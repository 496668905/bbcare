/**
 * 口语模拟教练 — 无后端，场景数据来自 coach-scenes.json
 */
(function () {
  "use strict";

  const EMBEDDED_SCENES = [
    {
      id: "demo_fallback",
      titleZh: "离线演示",
      titleEn: "Demo",
      openingZh: "无法加载 JSON 时使用本场景。",
      turns: [
        {
          role: "assistant",
          en: "Hello! Can you say hello back?",
          zh: "你好！试着用英文回一句问候。"
        },
        {
          role: "user",
          promptZh: "用英文打招呼。",
          acceptable: ["Hello", "Hi there", "Good morning"],
          keywords: ["hello", "hi"],
          hintEn: "Hello!"
        }
      ]
    }
  ];

  function normalizeText(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) {
      return n;
    }
    if (n === 0) {
      return m;
    }
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) {
      dp[j] = j;
    }
    for (let i = 1; i <= m; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = dp[j];
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
        prev = tmp;
      }
    }
    return dp[n];
  }

  function stringSimilarity(user, ref) {
    const u = normalizeText(user);
    const r = normalizeText(ref);
    if (!u || !r) {
      return 0;
    }
    const d = levenshtein(u, r);
    return 1 - d / Math.max(u.length, r.length, 1);
  }

  function bestAcceptableScore(user, acceptableList) {
    let best = 0;
    acceptableList.forEach((ref) => {
      best = Math.max(best, stringSimilarity(user, ref));
    });
    return best;
  }

  function keywordCoverage(user, keywords) {
    if (!keywords || !keywords.length) {
      return 1;
    }
    const u = normalizeText(user);
    let hit = 0;
    keywords.forEach((kw) => {
      const k = normalizeText(kw);
      if (k && u.includes(k)) {
        hit += 1;
      }
    });
    return hit / keywords.length;
  }

  /**
   * @returns {{ grade: 'great' | 'close' | 'retry', sim: number, kw: number }}
   */
  function evaluateAnswer(userText, turn) {
    const sim = bestAcceptableScore(userText, turn.acceptable || []);
    const kw = keywordCoverage(userText, turn.keywords || []);
    if (sim >= 0.78 || (sim >= 0.62 && kw >= 0.75)) {
      return { grade: "great", sim, kw };
    }
    if (sim >= 0.52 || kw >= 0.55 || (sim >= 0.4 && kw >= 0.45)) {
      return { grade: "close", sim, kw };
    }
    return { grade: "retry", sim, kw };
  }

  function getRecognitionCtor() {
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
  }

  class CoachApp {
    constructor() {
      this.scenes = [];
      this.scene = null;
      this.turnIndex = 0;
      this.listening = false;
      this.recognition = null;
      this.$ = (id) => document.getElementById(id);
      this.initElements();
    }

    initElements() {
      this.elPick = this.$("screenPick");
      this.elChat = this.$("screenChat");
      this.elGrid = this.$("sceneGrid");
      this.elChatArea = this.$("chatArea");
      this.elUserPanel = this.$("userPanel");
      this.elUserPrompt = this.$("userPrompt");
      this.elHintBox = this.$("hintBox");
      this.elHintEn = this.$("hintEn");
      this.elRecBtn = this.$("recBtn");
      this.elFeedback = this.$("feedbackArea");
      this.elUserActions = this.$("userActions");
      this.elAssistantActions = this.$("assistantActions");
      this.elProgress = this.$("progressText");
      this.elNoRec = this.$("noRecBanner");
    }

    async loadScenes() {
      try {
        const res = await fetch("./coach-scenes.json", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("bad status");
        }
        const data = await res.json();
        if (data && Array.isArray(data.scenes) && data.scenes.length) {
          this.scenes = data.scenes;
          return;
        }
      } catch {
        /* fallback */
      }
      this.scenes = EMBEDDED_SCENES;
    }

    setupRecognition() {
      const Ctor = getRecognitionCtor();
      if (!Ctor) {
        this.elNoRec.hidden = false;
        return null;
      }
      const rec = new Ctor();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript || "";
        this.onHeard(text);
      };
      rec.onerror = (event) => {
        this.setListening(false);
        if (event.error === "no-speech") {
          this.showFeedback("retry", "没有听到声音，请靠近麦克风再试。", "", "");
        } else if (event.error === "not-allowed") {
          this.showFeedback("retry", "麦克风权限被拒绝，请在浏览器设置中允许。", "", "");
        } else {
          this.showFeedback("retry", `识别出错：${event.error}，请重试。`, "", "");
        }
      };
      rec.onend = () => {
        this.setListening(false);
      };
      return rec;
    }

    setListening(on) {
      this.listening = on;
      this.elRecBtn.textContent = on ? "再点一下结束识别" : "点击开始说话（英文）";
      this.elRecBtn.classList.toggle("listening", on);
    }

    onHeard(text) {
      const turn = this.scene.turns[this.turnIndex];
      const ev = evaluateAnswer(text, turn);
      const ref = turn.hintEn || (turn.acceptable && turn.acceptable[0]) || "";
      const detail = `匹配度约 ${Math.round(ev.sim * 100)}%，关键词覆盖 ${Math.round(ev.kw * 100)}%。`;
      if (ev.grade === "great") {
        this.showFeedback("great", "很棒！表达接近参考说法。", detail, text);
      } else if (ev.grade === "close") {
        this.showFeedback("close", "接近了，语感不错，可再对照参考润色。", detail, text);
      } else {
        this.showFeedback("retry", "再试试：可以大声、慢一点，对照参考句说。", detail, text);
      }
      this.elUserActions.hidden = false;
      this.elHintEn.textContent = ref;
    }

    showFeedback(grade, title, detail, heard) {
      this.elFeedback.innerHTML = "";
      const box = document.createElement("div");
      box.className = `feedback ${grade === "great" ? "great" : grade === "close" ? "close" : "retry"}`;
      box.innerHTML = `<strong>${title}</strong><div style="margin-top:6px;font-size:14px">${detail}</div>`;
      if (heard) {
        const tr = document.createElement("div");
        tr.className = "transcript";
        tr.textContent = `识别到：${heard}`;
        box.appendChild(tr);
      }
      this.elFeedback.appendChild(box);
    }

    boot() {
      this.$("navBack").addEventListener("click", () => {
        if (this.elChat.classList.contains("on")) {
          if (!window.confirm("确定退出当前对话吗？")) {
            return;
          }
        }
        window.location.href = "./adult.html";
      });
      this.$("toggleHint").addEventListener("click", () => {
        const on = this.elHintBox.style.display !== "block";
        this.elHintBox.style.display = on ? "block" : "none";
      });
      this.$("recBtn").addEventListener("click", () => this.toggleRecord());
      this.$("retryTurn").addEventListener("click", () => {
        this.elFeedback.innerHTML = "";
        this.elUserActions.hidden = true;
      });
      this.$("nextTurn").addEventListener("click", () => this.advanceAfterUser());
      this.$("assistantContinue").addEventListener("click", () => this.advanceAssistant());

      this.recognition = this.setupRecognition();

      this.loadScenes().then(() => this.renderScenePicker());
    }

    renderScenePicker() {
      this.elGrid.innerHTML = "";
      this.scenes.forEach((sc) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "scene-card";
        b.innerHTML = `<h3>${sc.titleZh}</h3><p>${sc.titleEn}</p>`;
        b.addEventListener("click", () => this.startScene(sc));
        this.elGrid.appendChild(b);
      });
    }

    startScene(sc) {
      this.scene = sc;
      this.turnIndex = 0;
      this.elPick.classList.remove("on");
      this.elChat.classList.add("on");
      this.elChatArea.innerHTML = "";
      const intro = document.createElement("div");
      intro.className = "bubble assistant";
      intro.innerHTML = `<div class="en">${sc.titleEn}</div><div class="zh">${sc.openingZh || ""}</div>`;
      this.elChatArea.appendChild(intro);
      this.renderTurn();
    }

    renderTurn() {
      this.elUserPanel.hidden = true;
      this.elUserActions.hidden = true;
      this.elAssistantActions.hidden = true;
      this.elFeedback.innerHTML = "";
      this.elHintBox.style.display = "none";
      const t = this.scene.turns[this.turnIndex];
      const total = this.scene.turns.length;
      this.elProgress.textContent = `${this.scene.titleZh} · 第 ${this.turnIndex + 1} / ${total} 回合`;

      if (!t) {
        this.finishScene();
        return;
      }

      if (t.role === "assistant") {
        const bubble = document.createElement("div");
        bubble.className = "bubble assistant";
        bubble.innerHTML = `<div class="en">${t.en}</div><div class="zh">${t.zh || ""}</div>`;
        this.elChatArea.appendChild(bubble);
        this.speak(t.en);
        this.elAssistantActions.hidden = false;
      } else {
        this.elUserPanel.hidden = false;
        this.elUserPrompt.innerHTML = `<strong>轮到你说了</strong>${t.promptZh || ""}`;
        this.elHintEn.textContent = t.hintEn || "";
        this.elRecBtn.disabled = !this.recognition;
      }
    }

    speak(text) {
      if (!("speechSynthesis" in window)) {
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.92;
      window.speechSynthesis.speak(u);
    }

    advanceAssistant() {
      this.turnIndex += 1;
      this.renderTurn();
    }

    advanceAfterUser() {
      this.turnIndex += 1;
      this.renderTurn();
    }

    finishScene() {
      window.speechSynthesis.cancel();
      this.elUserPanel.hidden = true;
      this.elAssistantActions.hidden = true;
      this.elProgress.textContent = "本轮对话已完成";
      const box = document.createElement("div");
      box.className = "bubble assistant";
      box.innerHTML =
        '<div class="en">Great job practicing!</div><div class="zh">可以换场景继续练，或返回大人口语。</div>';
      this.elChatArea.appendChild(box);
      const row = document.createElement("div");
      row.className = "row2";
      row.style.marginTop = "14px";
      const b1 = document.createElement("button");
      b1.type = "button";
      b1.className = "btn secondary";
      b1.textContent = "选场景";
      b1.addEventListener("click", () => {
        this.elChat.classList.remove("on");
        this.elPick.classList.add("on");
        this.elChatArea.innerHTML = "";
      });
      const b2 = document.createElement("button");
      b2.type = "button";
      b2.className = "btn";
      b2.textContent = "再练本场景";
      b2.addEventListener("click", () => {
        this.startScene(this.scene);
      });
      row.appendChild(b1);
      row.appendChild(b2);
      this.elChatArea.appendChild(row);
    }

    toggleRecord() {
      if (!this.recognition) {
        this.showFeedback("retry", "当前浏览器不支持语音识别。", "", "");
        this.elUserActions.hidden = false;
        return;
      }
      const turn = this.scene.turns[this.turnIndex];
      if (!turn || turn.role !== "user") {
        return;
      }
      if (!this.listening) {
        this.elFeedback.innerHTML = "";
        this.elUserActions.hidden = true;
        try {
          this.recognition.start();
          this.setListening(true);
        } catch {
          this.setListening(false);
          try {
            this.recognition.abort();
          } catch {
            /* ignore */
          }
          try {
            this.recognition.start();
            this.setListening(true);
          } catch (e2) {
            this.showFeedback("retry", "无法启动识别，请稍后再试。", String(e2), "");
            this.elUserActions.hidden = false;
          }
        }
      } else {
        try {
          this.recognition.stop();
        } catch {
          this.setListening(false);
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new CoachApp().boot());
  } else {
    new CoachApp().boot();
  }
})();
