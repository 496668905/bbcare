/**
 * 英语竞技场 · 第二版「疾速真伪」
 * 独立数据与规则，与 adult-game.js 并行。
 */
(function () {
  "use strict";

  const SAVE_KEY = "adult_english_arena_b_v1";

  const LABELS = {
    TRUTH_ZH: "真伪秒判",
    PREP: "介词闪电",
    LISTEN_TF: "听力对错",
    WORD_SENSE: "词义猎手",
    PAIR_NATURAL: "地道二选一"
  };

  const PAIRS = [
    { a: "He don't like coffee.", b: "He doesn't like coffee.", ok: "b" },
    { a: "Could you help me with this?", b: "Could you help me of this?", ok: "a" },
    { a: "I look forward to seeing you.", b: "I look forward to see you.", ok: "a" },
    { a: "She suggested leaving early.", b: "She suggested to leave early.", ok: "a" },
    { a: "There are many options.", b: "There is many options.", ok: "a" },
    { a: "Let us agree on the next step.", b: "Lets agree on the next step.", ok: "a" },
    { a: "I would rather stay home.", b: "I would rather staying home.", ok: "a" },
    { a: "Neither option is perfect.", b: "Neither option are perfect.", ok: "a" },
    { a: "Everyone wants clarity.", b: "Everyone want clarity.", ok: "a" }
  ];

  const PREPS = [
    { template: "I am interested ___ learning English.", answer: "in", wrong: ["on", "at", "of"] },
    { template: "Thank you ___ your help.", answer: "for", wrong: ["to", "with", "on"] },
    { template: "We agreed ___ a simple plan.", answer: "on", wrong: ["in", "at", "by"] },
    { template: "She arrived ___ the station on time.", answer: "at", wrong: ["in", "on", "to"] },
    { template: "This is similar ___ what we did last week.", answer: "to", wrong: ["as", "like", "for"] },
    { template: "I will call you ___ tonight.", answer: "back", wrong: ["up", "off", "out"] },
    { template: "We are good ___ time for now.", answer: "on", wrong: ["in", "at", "by"] },
    { template: "He is responsible ___ the delivery.", answer: "for", wrong: ["of", "to", "with"] },
    { template: "Let us focus ___ one task at a time.", answer: "on", wrong: ["in", "at", "to"] },
    { template: "I am allergic ___ peanuts.", answer: "to", wrong: ["for", "with", "on"] }
  ];

  const SENSES = [
    { word: "book", correctZh: "预订（动词义）", wrongZh: ["书（名词）", "笔记本", "账单"] },
    { word: "fine", correctZh: "很好；没问题", wrongZh: ["罚款", "细的", "结尾"] },
    { word: "date", correctZh: "日期；约会", wrongZh: ["数据", "枣子", "更新"] },
    { word: "present", correctZh: "礼物；出席", wrongZh: ["现在", "呈现", "过去"] },
    { word: "spring", correctZh: "春天；弹簧", wrongZh: ["泉水", "跳跃", "剪刀"] },
    { word: "match", correctZh: "比赛；匹配", wrongZh: ["火柴", "结婚", "面具"] },
    { word: "bank", correctZh: "银行；河岸", wrongZh: ["板凳", "存储", "倾斜"] },
    { word: "novel", correctZh: "小说；新颖的", wrongZh: ["新颖的名词", "古老的", "普通的"] }
  ];

  const LINES = [
    { en: "Could you take me to the station?", zh: "你可以带我去车站吗？" },
    { en: "I would like a cup of coffee.", zh: "我想要一杯咖啡。" },
    { en: "Can I pay by card?", zh: "我可以刷卡吗？" },
    { en: "Let us make a simple plan.", zh: "我们做个简单计划吧。" },
    { en: "I will call you tonight.", zh: "我今晚给你打电话。" },
    { en: "Please wait for me.", zh: "请等我一下。" },
    { en: "Thank you for your help.", zh: "谢谢你的帮助。" },
    { en: "Where can I find milk?", zh: "我在哪里能找到牛奶？" },
    { en: "Could we confirm the next step?", zh: "我们可以确认下一步吗？" },
    { en: "Is breakfast included?", zh: "包含早餐吗？" },
    { en: "I feel more confident now.", zh: "我现在更有信心了。" },
    { en: "It looks like it will rain this afternoon.", zh: "看起来今天下午会下雨。" },
    { en: "I should bring an umbrella.", zh: "我应该带把伞。" },
    { en: "The traffic is heavier than usual.", zh: "交通比平时更堵。" },
    { en: "I have been sleeping better lately.", zh: "我最近睡眠更好了。" },
    { en: "I would like to book a table for two at seven.", zh: "我想订晚上七点的两人桌。" },
    { en: "Do you have a table near the window?", zh: "你们有靠窗的位子吗？" },
    { en: "I would like to return this item.", zh: "我想退这件商品。" },
    { en: "Nice to meet you.", zh: "很高兴见到你。" },
    { en: "See you later.", zh: "待会见。" },
    { en: "How long will it take?", zh: "大概需要多久？" },
    { en: "For here or to go?", zh: "在这喝还是带走？" },
    { en: "May I see the menu, please?", zh: "可以看一下菜单吗？" },
    { en: "I am allergic to peanuts.", zh: "我对花生过敏。" },
    { en: "Excuse me, where is the nearest subway station?", zh: "打扰一下，最近的地铁站在哪里？" },
    { en: "Turn left at the traffic lights.", zh: "在红绿灯处左转。" },
    { en: "What matters to me is clear communication.", zh: "对我来说重要的是沟通清楚。" },
    { en: "In the end, everything was fine.", zh: "最后一切都很好。" },
    { en: "Let me share a quick update.", zh: "我快速同步一下进展。" },
    { en: "We are on track for this week.", zh: "我们本周进度正常。" },
    { en: "Hi, how are you today?", zh: "嗨，你今天怎么样？" },
    { en: "I am fine, thank you.", zh: "我很好，谢谢你。" }
  ];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const x = arr.slice();
    const r = rng || Math.random;
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }

  function loadSave() {
    try {
      const o = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
      return {
        best: Number(o.best) || 0,
        muted: Boolean(o.muted)
      };
    } catch {
      return { best: 0, muted: false };
    }
  }

  function saveSave(s) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  }

  class Sfx {
    constructor() {
      this.muted = false;
      this.ctx = null;
    }
    ensure() {
      if (!this.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (C) {
          this.ctx = new C();
        }
      }
      return this.ctx;
    }
    tone(f, t, g = 0.07) {
      if (this.muted) {
        return;
      }
      const c = this.ensure();
      if (!c) {
        return;
      }
      const o = c.createOscillator();
      const ga = c.createGain();
      o.frequency.value = f;
      o.type = "square";
      ga.gain.value = g;
      o.connect(ga);
      ga.connect(c.destination);
      const n = c.currentTime;
      o.start(n);
      o.stop(n + t);
    }
    ok() {
      this.tone(660, 0.06);
      this.tone(990, 0.07);
    }
    bad() {
      this.tone(120, 0.16, 0.09);
    }
    tick() {
      this.tone(440, 0.03, 0.03);
    }
  }

  class Fx {
    constructor(cv) {
      this.cv = cv;
      this.g = cv.getContext("2d");
      this.p = [];
      this.raf = 0;
      this.resize();
      window.addEventListener("resize", () => this.resize());
    }
    resize() {
      const d = Math.min(2, window.devicePixelRatio || 1);
      this.cv.width = Math.floor(innerWidth * d);
      this.cv.height = Math.floor(innerHeight * d);
      this.cv.style.width = `${innerWidth}px`;
      this.cv.style.height = `${innerHeight}px`;
      this.g.setTransform(d, 0, 0, d, 0, 0);
    }
    spark(x, y) {
      for (let i = 0; i < 18; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 5;
        this.p.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 1.5,
          life: 1,
          c: Math.random() > 0.5 ? "#ffc14d" : "#ff6b2d"
        });
      }
      if (!this.raf) {
        this.raf = requestAnimationFrame(() => this.loop());
      }
    }
    loop() {
      const g = this.g;
      const w = innerWidth;
      const h = innerHeight;
      g.clearRect(0, 0, w, h);
      this.p = this.p.filter((q) => {
        q.life -= 0.02;
        q.x += q.vx;
        q.y += q.vy;
        q.vy += 0.16;
        if (q.life <= 0) {
          return false;
        }
        g.globalAlpha = q.life;
        g.fillStyle = q.c;
        g.beginPath();
        g.arc(q.x, q.y, 2.5, 0, Math.PI * 2);
        g.fill();
        return true;
      });
      g.globalAlpha = 1;
      if (this.p.length) {
        this.raf = requestAnimationFrame(() => this.loop());
      } else {
        this.raf = 0;
      }
    }
  }

  class Factory {
    constructor(seed) {
      this.r = mulberry32(seed >>> 0);
    }
    pickLine() {
      return LINES[Math.floor(this.r() * LINES.length)];
    }
    truthZh() {
      const line = this.pickLine();
      let lie = this.pickLine();
      let guard = 0;
      while (lie.zh === line.zh && guard++ < 20) {
        lie = this.pickLine();
      }
      const tellTruth = this.r() > 0.45;
      const claimZh = tellTruth ? line.zh : lie.zh;
      return {
        type: "TRUTH_ZH",
        label: LABELS.TRUTH_ZH,
        en: line.en,
        zh: `判断：下面中文是否是上面英文的意思？\n「${claimZh}」`,
        binary: true,
        correctYes: tellTruth,
        time: 11800
      };
    }
    prep() {
      const p = PREPS[Math.floor(this.r() * PREPS.length)];
      const choices = shuffle([p.answer, ...p.wrong], this.r);
      return {
        type: "PREP",
        label: LABELS.PREP,
        en: p.template.replace("___", "______"),
        zh: "选出正确的介词或搭配词",
        choices,
        answer: p.answer,
        time: 12500
      };
    }
    listenTf() {
      const line = this.pickLine();
      let decoy = this.pickLine();
      let g = 0;
      while (decoy.zh === line.zh && g++ < 20) {
        decoy = this.pickLine();
      }
      const match = this.r() > 0.42;
      const claimZh = match ? line.zh : decoy.zh;
      return {
        type: "LISTEN_TF",
        label: LABELS.LISTEN_TF,
        en: line.en,
        zh: `先听英文，再判断：下面中文意思是否一致？\n「${claimZh}」`,
        binary: true,
        correctYes: match,
        speak: line.en,
        time: 13500
      };
    }
    wordSense() {
      const s = SENSES[Math.floor(this.r() * SENSES.length)];
      const choices = shuffle([s.correctZh, ...s.wrongZh], this.r);
      return {
        type: "WORD_SENSE",
        label: LABELS.WORD_SENSE,
        en: `英文词：${s.word}`,
        zh: "选出最合理的中文义项（结合口语常见用法）",
        choices,
        answer: s.correctZh,
        time: 13000
      };
    }
    next(round) {
      const roll = this.r();
      const harder = round > 12;
      if (roll < 0.28) {
        const q = this.truthZh();
        q.time = harder ? q.time * 0.88 : q.time;
        return q;
      }
      if (roll < 0.48) {
        const q = this.prep();
        q.time = harder ? q.time * 0.9 : q.time;
        return q;
      }
      if (roll < 0.68) {
        const q = this.listenTf();
        q.time = harder ? q.time * 0.9 : q.time;
        return q;
      }
      if (roll < 0.88) {
        const q = this.wordSense();
        q.time = harder ? q.time * 0.9 : q.time;
        return q;
      }
      const pr = PAIRS[Math.floor(this.r() * PAIRS.length)];
      const order = this.r() > 0.5;
      const firstLine = order ? pr.a : pr.b;
      const secondLine = order ? pr.b : pr.a;
      const correctLine = pr.ok === "a" ? pr.a : pr.b;
      const answer = correctLine === firstLine ? "上面一句" : "下面一句";
      return {
        type: "PAIR_NATURAL",
        label: LABELS.PAIR_NATURAL,
        en: "哪一句更自然、更地道？",
        zh: `${firstLine}\n—\n${secondLine}`,
        choices: ["上面一句", "下面一句"],
        answer,
        time: harder ? 11000 : 12500
      };
    }
  }

  class Game {
    constructor(ui, sfx, fx, save) {
      this.ui = ui;
      this.sfx = sfx;
      this.fx = fx;
      this.save = save;
      this.reset();
    }
    reset() {
      this.score = 0;
      this.combo = 0;
      this.round = 0;
      this.energy = 100;
      this.maxCombo = 0;
      this.correct = 0;
      this.wrong = 0;
      this.factory = new Factory(Date.now());
      this.q = null;
      this.dead = 0;
      this.tickTimer = null;
      this.busy = false;
    }
    speak(t) {
      if (!("speechSynthesis" in window)) {
        return;
      }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = "en-US";
      u.rate = 0.9;
      speechSynthesis.speak(u);
    }
    showMenu() {
      this.clearTick();
      this.ui.menu();
    }
    clearTick() {
      if (this.tickTimer) {
        clearInterval(this.tickTimer);
        this.tickTimer = null;
      }
    }
    start() {
      this.reset();
      this.ui.play();
      this.next();
    }
    end() {
      this.clearTick();
      this.save.best = Math.max(this.save.best, this.score);
      saveSave(this.save);
      this.ui.over(this);
    }
    next() {
      if (this.energy <= 0) {
        this.end();
        return;
      }
      this.busy = false;
      this.round += 1;
      this.q = this.factory.next(this.round);
      this.dead = Date.now() + this.q.time;
      this.ui.renderQ(this);
      this.armTick();
      if (this.q.type === "LISTEN_TF" && this.q.speak) {
        this.speak(this.q.speak);
      }
    }
    armTick() {
      this.clearTick();
      this.tickTimer = setInterval(() => {
        const t = clamp((this.dead - Date.now()) / this.q.time, 0, 1);
        this.ui.setEnergyBar(this.energy / 100);
        this.ui.setTime(t);
        if (Date.now() > this.dead && !this.busy) {
          this.timeout();
        }
      }, 100);
    }
    timeout() {
      this.busy = true;
      this.clearTick();
      this.sfx.bad();
      this.combo = 0;
      this.energy -= 18;
      this.wrong += 1;
      setTimeout(() => this.next(), 380);
    }
    submit(val) {
      if (this.busy || !this.q) {
        return;
      }
      this.busy = true;
      this.clearTick();
      let ok = false;
      if (this.q.binary) {
        const yes = val === "对" || val === "意思一致";
        ok = yes === Boolean(this.q.correctYes);
      } else {
        ok = val === this.q.answer;
      }
      if (ok) {
        this.correct += 1;
        this.combo += 1;
        this.maxCombo = Math.max(this.maxCombo, this.combo);
        const mult = 1 + this.combo * 0.07;
        this.score += Math.round(42 * mult);
        if (this.combo % 4 === 0) {
          this.energy = clamp(this.energy + 8, 0, 100);
        }
        this.sfx.ok();
        this.fx.spark(innerWidth / 2, innerHeight * 0.38);
      } else {
        this.wrong += 1;
        this.combo = 0;
        this.score = Math.max(0, this.score - 12);
        this.energy -= 20;
        this.sfx.bad();
      }
      this.ui.hud(this);
      setTimeout(() => this.next(), ok ? 320 : 420);
    }
    skip() {
      if (this.busy) {
        return;
      }
      this.score = Math.max(0, this.score - 8);
      this.combo = 0;
      this.sfx.tick();
      this.clearTick();
      this.next();
    }
  }

  class UI {
    constructor() {
      this.$ = (id) => document.getElementById(id);
    }
    menu() {
      this.$("bMenu").classList.add("on");
      this.$("bPlay").classList.remove("on");
      this.$("bOver").classList.remove("on");
    }
    play() {
      this.$("bMenu").classList.remove("on");
      this.$("bPlay").classList.add("on");
      this.$("bOver").classList.remove("on");
    }
    over(g) {
      this.$("bMenu").classList.remove("on");
      this.$("bPlay").classList.remove("on");
      this.$("bOver").classList.add("on");
      this.$("bOverTitle").textContent = g.energy <= 0 ? "能量耗尽" : "本局结束";
      this.$("bOverSub").textContent = `得分 ${g.score} · 最高连击 ${g.maxCombo} · 最佳历史 ${loadSave().best}`;
      const st = this.$("bStats");
      st.innerHTML = "";
      [
        ["答对", String(g.correct)],
        ["答错 / 超时", String(g.wrong)],
        ["回合数", String(g.round)]
      ].forEach(([a, b]) => {
        const d = document.createElement("div");
        d.className = "line";
        d.innerHTML = `<span>${a}</span><b>${b}</b>`;
        st.appendChild(d);
      });
    }
    hud(g) {
      this.$("bScore").textContent = String(g.score);
      this.$("bCombo").textContent = String(g.combo);
      this.$("bRound").textContent = String(g.round);
      this.setEnergyBar(g.energy / 100);
    }
    setEnergyBar(r) {
      this.$("bEnergy").style.setProperty("--e", String(clamp(r, 0, 1)));
    }
    setTime(t) {
      const el = this.$("bTime");
      if (el) {
        el.style.setProperty("--t", String(t));
      }
    }
    renderQ(g) {
      const q = g.q;
      this.$("bPill").textContent = q.label;
      this.$("bEn").textContent = q.en;
      this.$("bZh").textContent = q.zh;
      const act = this.$("bActions");
      act.innerHTML = "";
      this.$("bListen").hidden = q.type !== "LISTEN_TF";
      if (q.binary) {
        act.className = "b-actions two";
        const ok = document.createElement("button");
        ok.type = "button";
        ok.className = "b-big ok";
        ok.textContent = q.type === "LISTEN_TF" ? "意思一致" : "对";
        ok.dataset.val = q.type === "LISTEN_TF" ? "意思一致" : "对";
        const no = document.createElement("button");
        no.type = "button";
        no.className = "b-big no";
        no.textContent = q.type === "LISTEN_TF" ? "意思不一致" : "错";
        no.dataset.val = q.type === "LISTEN_TF" ? "意思不一致" : "错";
        act.appendChild(ok);
        act.appendChild(no);
      } else {
        act.className = "b-actions";
        q.choices.forEach((c) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "b-big";
          b.textContent = c;
          b.dataset.val = c;
          act.appendChild(b);
        });
      }
      this.hud(g);
    }
  }

  function boot() {
    const save = loadSave();
    const sfx = new Sfx();
    sfx.muted = save.muted;
    const fx = new Fx(document.getElementById("fxB"));
    const ui = new UI();
    const app = { g: new Game(ui, sfx, fx, save) };

    document.getElementById("bMute").textContent = save.muted ? "🔇" : "🔊";
    document.getElementById("bBack").addEventListener("click", () => {
      window.location.href = "./adult.html";
    });
    document.getElementById("bToV1").addEventListener("click", () => {
      window.location.href = "./adult-game.html";
    });
    document.getElementById("bMute").addEventListener("click", () => {
      save.muted = !save.muted;
      sfx.muted = save.muted;
      document.getElementById("bMute").textContent = save.muted ? "🔇" : "🔊";
      saveSave(save);
    });
    document.getElementById("bStart").addEventListener("click", () => app.g.start());
    document.getElementById("bRetry").addEventListener("click", () => {
      app.g = new Game(ui, sfx, fx, save);
      app.g.start();
    });
    document.getElementById("bMenu").addEventListener("click", () => app.g.showMenu());
    document.getElementById("bSkip").addEventListener("click", () => app.g.skip());
    document.getElementById("bListen").addEventListener("click", () => {
      if (app.g.q?.speak) {
        app.g.speak(app.g.q.speak);
      }
    });
    document.getElementById("bActions").addEventListener("click", (e) => {
      const b = e.target.closest(".b-big");
      if (!b) {
        return;
      }
      app.g.submit(b.dataset.val);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
