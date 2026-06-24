/**
 * 大人英语竞技场 — 多模式趣味闯关
 * 独立页 adult-game.html，数据与逻辑自包含，便于离线部署。
 */
(function () {
  "use strict";

  const STORAGE_KEY = "adult_english_arena_v2";
  const ACH_KEY = "adult_english_arena_ach_v2";

  const MODES = {
    SPEED_ZH: "speed_zh",
    SPEED_EN: "speed_en",
    LISTEN: "listen",
    SCRAMBLE: "scramble",
    ODD: "odd_grammar",
    GAP: "gap_fill",
    STORM: "word_storm"
  };

  const MODE_LABEL = {
    [MODES.SPEED_ZH]: "闪电中英",
    [MODES.SPEED_EN]: "反向点英",
    [MODES.LISTEN]: "听力抓意",
    [MODES.SCRAMBLE]: "拼词拆弹",
    [MODES.ODD]: "语法找茬",
    [MODES.GAP]: "完形填空",
    [MODES.STORM]: "分类风暴"
  };

  const BASE_TIME_MS = 14000;
  const BOSS_EVERY = 5;
  const BOSS_TIME_MUL = 0.72;
  const MAX_LIVES = 3;

  /** @type {{en:string, zh:string, tags:string[]}[]} */
  const VOCAB = [
    { en: "Could you take me to the station?", zh: "你可以带我去车站吗？", tags: ["travel"] },
    { en: "I would like a cup of coffee.", zh: "我想要一杯咖啡。", tags: ["food"] },
    { en: "Can I pay by card?", zh: "我可以刷卡吗？", tags: ["shop"] },
    { en: "Let us make a simple plan.", zh: "我们做个简单计划吧。", tags: ["work"] },
    { en: "I will call you tonight.", zh: "我今晚给你打电话。", tags: ["work"] },
    { en: "Please wait for me.", zh: "请等我一下。", tags: ["social"] },
    { en: "Thank you for your help.", zh: "谢谢你的帮助。", tags: ["social"] },
    { en: "Where can I find milk?", zh: "我在哪里能找到牛奶？", tags: ["shop"] },
    { en: "Do you have a cheaper one?", zh: "有更便宜一点的吗？", tags: ["shop"] },
    { en: "I need to finish this today.", zh: "我今天得把这个完成。", tags: ["work"] },
    { en: "Could we confirm the next step?", zh: "我们可以确认下一步吗？", tags: ["work"] },
    { en: "We are on track for this week.", zh: "我们本周进度正常。", tags: ["work"] },
    { en: "Is breakfast included?", zh: "包含早餐吗？", tags: ["hotel"] },
    { en: "Could I check in early?", zh: "我可以提前入住吗？", tags: ["hotel"] },
    { en: "I have a booking under Chen.", zh: "我有一笔陈姓预订。", tags: ["hotel"] },
    { en: "I feel more confident now.", zh: "我现在更有信心了。", tags: ["emotion"] },
    { en: "Today was busy but meaningful.", zh: "今天很忙，但很有意义。", tags: ["emotion"] },
    { en: "Tomorrow I will practice again.", zh: "明天我会继续练习。", tags: ["emotion"] },
    { en: "I prefer quiet cafes with natural light.", zh: "我更喜欢安静、有自然光的咖啡馆。", tags: ["food"] },
    { en: "To be honest, I was not fully convinced.", zh: "老实说，我并没有完全被说服。", tags: ["emotion"] },
    { en: "I would rather keep things simple.", zh: "我宁愿把事情保持简单。", tags: ["emotion"] },
    { en: "It looks like it will rain this afternoon.", zh: "看起来今天下午会下雨。", tags: ["weather"] },
    { en: "I should bring an umbrella.", zh: "我应该带把伞。", tags: ["weather"] },
    { en: "The traffic is heavier than usual.", zh: "交通比平时更堵。", tags: ["travel"] },
    { en: "Let us leave ten minutes earlier.", zh: "我们提前十分钟出发吧。", tags: ["travel"] },
    { en: "I have been sleeping better lately.", zh: "我最近睡眠更好了。", tags: ["health"] },
    { en: "Could you recommend a light exercise?", zh: "你可以推荐一项轻松运动吗？", tags: ["health"] },
    { en: "I want to walk at least eight thousand steps.", zh: "我想至少走八千步。", tags: ["health"] },
    { en: "I would like to book a table for two at seven.", zh: "我想订晚上七点的两人桌。", tags: ["food"] },
    { en: "Do you have a table near the window?", zh: "你们有靠窗的位子吗？", tags: ["food"] },
    { en: "Is there a vegetarian option on the menu?", zh: "菜单上有素食吗？", tags: ["food"] },
    { en: "I would like to return this item.", zh: "我想退这件商品。", tags: ["shop"] },
    { en: "Here is my order number and receipt.", zh: "这是我的订单号和收据。", tags: ["shop"] },
    { en: "Could you process a refund to my card?", zh: "可以退款到我的卡上吗？", tags: ["shop"] },
    { en: "I am satisfied with your quick response.", zh: "我对你们的快速回复很满意。", tags: ["shop"] },
    { en: "Let me share a quick update.", zh: "我快速同步一下进展。", tags: ["work"] },
    { en: "The main risk is delivery time.", zh: "主要风险是交付时间。", tags: ["work"] },
    { en: "Nice to meet you.", zh: "很高兴见到你。", tags: ["social"] },
    { en: "See you later.", zh: "待会见。", tags: ["social"] },
    { en: "How long will it take?", zh: "大概需要多久？", tags: ["travel"] },
    { en: "Please stop here.", zh: "请在这里停。", tags: ["travel"] },
    { en: "For here or to go?", zh: "在这喝还是带走？", tags: ["food"] },
    { en: "To go, please.", zh: "带走，谢谢。", tags: ["food"] },
    { en: "May I see the menu, please?", zh: "可以看一下菜单吗？", tags: ["food"] },
    { en: "I am allergic to peanuts.", zh: "我对花生过敏。", tags: ["health"] },
    { en: "Could we have the bill?", zh: "可以买单吗？", tags: ["food"] },
    { en: "Excuse me, where is the nearest subway station?", zh: "打扰一下，最近的地铁站在哪里？", tags: ["travel"] },
    { en: "Turn left at the traffic lights.", zh: "在红绿灯处左转。", tags: ["travel"] },
    { en: "You can't miss it.", zh: "你不会错过的。", tags: ["travel"] },
    { en: "What matters to me is clear communication.", zh: "对我来说重要的是沟通清楚。", tags: ["work"] },
    { en: "In my experience, consistency matters most.", zh: "以我的经验，坚持最重要。", tags: ["emotion"] },
    { en: "This morning I missed my bus.", zh: "今天早上我错过了公交。", tags: ["travel"] },
    { en: "Then I took a taxi and arrived on time.", zh: "然后我打车并准时到了。", tags: ["travel"] },
    { en: "In the end, everything was fine.", zh: "最后一切都很好。", tags: ["emotion"] },
    { en: "I solved one difficult problem.", zh: "我解决了一个难题。", tags: ["work"] },
    { en: "I learned a new phrase at lunch.", zh: "我午饭时学了一个新短语。", tags: ["emotion"] },
    { en: "Could you call me a taxi at seven?", zh: "你可以七点帮我叫车吗？", tags: ["hotel"] },
    { en: "We may arrive ten minutes late.", zh: "我们可能会迟到十分钟。", tags: ["food"] },
    { en: "Can we talk after lunch?", zh: "我们午饭后再聊可以吗？", tags: ["work"] },
    { en: "I will be home before eight.", zh: "我八点前回家。", tags: ["social"] },
    { en: "Let us eat together tonight.", zh: "今晚我们一起吃饭吧。", tags: ["social"] },
    { en: "I will take this one.", zh: "我要这个。", tags: ["shop"] },
    { en: "Can I have less sugar?", zh: "可以少糖吗？", tags: ["food"] },
    { en: "Hi, how are you today?", zh: "嗨，你今天怎么样？", tags: ["social"] },
    { en: "I am fine, thank you.", zh: "我很好，谢谢你。", tags: ["social"] }
  ];

  const ODD_PAIRS = [
    { good: "She doesn't like coffee.", bad: "She don't like coffee." },
    { good: "If I were you, I would rest.", bad: "If I was you, I would rest." },
    { good: "There are many options.", bad: "There is many options." },
    { good: "He has already finished.", bad: "He already have finished." },
    { good: "Could you help me with this?", bad: "Could you helps me with this?" },
    { good: "I enjoy working with the team.", bad: "I enjoy to work with the team." },
    { good: "Let us discuss it tomorrow.", bad: "Lets discuss it tomorrow." },
    { good: "Neither option is perfect.", bad: "Neither option are perfect." },
    { good: "The data suggests a delay.", bad: "The data suggest a delay." },
    { good: "I would rather stay home.", bad: "I would rather staying home." },
    { good: "She speaks English fluently.", bad: "She speak English fluently." },
    { good: "We need fewer meetings.", bad: "We need less meetings." },
    { good: "This is more important than speed.", bad: "This is more important than speedy." },
    { good: "Can you send me the file?", bad: "Can you sent me the file?" },
    { good: "I have been waiting for ten minutes.", bad: "I am waiting since ten minutes." },
    { good: "Neither he nor she agrees.", bad: "Neither he nor she agree." },
    { good: "The news was surprising.", bad: "The news were surprising." },
    { good: "Everyone wants clarity.", bad: "Everyone want clarity." },
    { good: "I used to live in Shanghai.", bad: "I use to live in Shanghai." },
    { good: "She suggested leaving early.", bad: "She suggested to leave early." }
  ];

  const GAP_BLUEPRINTS = [
    {
      template: "I would like to ____ a table for two.",
      answer: "book",
      decoys: ["buy", "sell", "break"]
    },
    {
      template: "Could you ____ me to the station?",
      answer: "take",
      decoys: ["bring", "carry", "throw"]
    },
    {
      template: "Can I pay ____ card?",
      answer: "by",
      decoys: ["with", "on", "at"]
    },
    {
      template: "Let us ____ on the next step.",
      answer: "agree",
      decoys: ["fight", "sleep", "dance"]
    },
    {
      template: "I need to ____ this today.",
      answer: "finish",
      decoys: ["forget", "ignore", "delay"]
    },
    {
      template: "Please ____ me if anything changes.",
      answer: "tell",
      decoys: ["hide", "guess", "paint"]
    },
    {
      template: "I will ____ you tonight.",
      answer: "call",
      decoys: ["paint", "cook", "build"]
    },
    {
      template: "Could we ____ after lunch?",
      answer: "talk",
      decoys: ["run", "swim", "jump"]
    },
    {
      template: "Is breakfast ____?",
      answer: "included",
      decoys: ["exclude", "lost", "broken"]
    },
    {
      template: "I would like to ____ this item.",
      answer: "return",
      decoys: ["borrow", "hide", "freeze"]
    },
    {
      template: "The traffic is ____ than usual.",
      answer: "heavier",
      decoys: ["lighter", "smaller", "quieter"]
    },
    {
      template: "I prefer ____ cafes with natural light.",
      answer: "quiet",
      decoys: ["loud", "angry", "tiny"]
    }
  ];

  const ACH_DEFS = [
    { id: "first_win", label: "首胜", desc: "完成一局（无论分数）", test: (s) => s.totalRuns >= 1 },
    { id: "combo10", label: "连击狂人", desc: "单局连击达到 10", test: (s) => s.bestComboEver >= 10 },
    { id: "score500", label: "五百先生", desc: "单局得分 ≥ 500", test: (s) => s.bestScore >= 500 },
    { id: "boss3", label: "BOSS 猎手", desc: "累计通过 3 次 BOSS 关", test: (s) => s.bossCleared >= 3 },
    { id: "perfect_listen", label: "耳朵很尖", desc: "单局听力题全对 ≥ 5 题", test: (s) => s.bestListenStreak >= 5 },
    { id: "marathon", label: "马拉松嘴炮", desc: "累计答对 200 题", test: (s) => s.lifetimeCorrect >= 200 }
  ];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function mulberry32(seed) {
    return function rand() {
      let t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    const r = rng || Math.random;
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickUnique(arr, n, rng) {
    const copy = shuffle(arr, rng);
    return copy.slice(0, n);
  }

  function tokenizeKeyword(phrase) {
    const cleaned = phrase
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && w.length <= 9);
    return cleaned[0] || "coffee";
  }

  function anagramVariants(word, rng) {
    const letters = word.split("");
    const set = new Set();
    set.add(word);
    let guard = 0;
    while (set.size < 4 && guard < 80) {
      guard++;
      const w = shuffle(letters, rng).join("");
      if (w !== word) {
        set.add(w);
      }
    }
    const out = Array.from(set);
    while (out.length < 4) {
      out.push(word + (out.length % 2 ? "s" : "x"));
    }
    return shuffle(out, rng).slice(0, 4);
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return defaultSave();
      }
      const o = JSON.parse(raw);
      return { ...defaultSave(), ...o };
    } catch {
      return defaultSave();
    }
  }

  function defaultSave() {
    return {
      totalRuns: 0,
      bestScore: 0,
      bestComboEver: 0,
      bossCleared: 0,
      bestListenStreak: 0,
      lifetimeCorrect: 0,
      muted: false
    };
  }

  function saveStore(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function loadAch() {
    try {
      const raw = localStorage.getItem(ACH_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveAch(map) {
    localStorage.setItem(ACH_KEY, JSON.stringify(map));
  }

  class SoundBus {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    ensure() {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) {
          return null;
        }
        this.ctx = new Ctx();
      }
      return this.ctx;
    }

    setMuted(v) {
      this.muted = v;
    }

    beep(freq, dur, type = "sine", gain = 0.08) {
      if (this.muted) {
        return;
      }
      const ctx = this.ensure();
      if (!ctx) {
        return;
      }
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime;
      o.start(t);
      o.stop(t + dur);
    }

    ok() {
      this.beep(880, 0.06, "square", 0.05);
      this.beep(1320, 0.08, "square", 0.04);
    }

    bad() {
      this.beep(140, 0.18, "sawtooth", 0.06);
    }

    boss() {
      this.beep(220, 0.1);
      this.beep(330, 0.1);
      this.beep(440, 0.12);
    }

    tick() {
      this.beep(520, 0.03, "triangle", 0.02);
    }
  }

  class FxCanvas {
    constructor(canvas) {
      this.cv = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = [];
      this._resize();
      window.addEventListener("resize", () => this._resize());
    }

    _resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.cv.width = Math.floor(window.innerWidth * dpr);
      this.cv.height = Math.floor(window.innerHeight * dpr);
      this.cv.style.width = `${window.innerWidth}px`;
      this.cv.style.height = `${window.innerHeight}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    burst(x, y, color, n = 26) {
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 6;
        this.particles.push({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 2,
          life: 1,
          color
        });
      }
      if (!this._raf) {
        this._raf = requestAnimationFrame(() => this._tick());
      }
    }

    _tick() {
      const ctx = this.ctx;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      this.particles = this.particles.filter((p) => {
        p.life -= 0.018;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        if (p.life <= 0) {
          return false;
        }
        ctx.globalAlpha = clamp(p.life, 0, 1);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
      if (this.particles.length) {
        this._raf = requestAnimationFrame(() => this._tick());
      } else {
        this._raf = 0;
      }
    }
  }

  class QuestionFactory {
    constructor(seed) {
      this.rng = mulberry32(seed >>> 0);
    }

    nextSeed() {
      return (this.rng() * 0xffffffff) >>> 0;
    }

    buildSpeedZh(entry) {
      const correct = entry.zh;
      const pool = VOCAB.filter((v) => v.zh !== correct);
      const wrong = pickUnique(pool, 3, this.rng).map((v) => v.zh);
      const choices = shuffle([correct, ...wrong], this.rng);
      return {
        type: MODES.SPEED_ZH,
        promptEn: entry.en,
        promptZh: "选出最贴切的中文",
        choices,
        choiceType: "zh",
        answer: correct,
        meta: { entry }
      };
    }

    buildSpeedEn(entry) {
      const correct = entry.en;
      const pool = VOCAB.filter((v) => v.en !== correct);
      const wrong = pickUnique(pool, 3, this.rng).map((v) => v.en);
      const choices = shuffle([correct, ...wrong], this.rng);
      return {
        type: MODES.SPEED_EN,
        promptEn: entry.zh,
        promptZh: "选出对应的英文原句",
        choices,
        choiceType: "en",
        answer: correct,
        meta: { entry }
      };
    }

    buildListen(entry) {
      const correct = entry.zh;
      const pool = VOCAB.filter((v) => v.zh !== correct);
      const wrong = pickUnique(pool, 3, this.rng).map((v) => v.zh);
      const choices = shuffle([correct, ...wrong], this.rng);
      return {
        type: MODES.LISTEN,
        promptEn: "🎧 听英文，选中文",
        promptZh: entry.en,
        choices,
        choiceType: "zh",
        answer: correct,
        meta: { entry, speakEn: entry.en }
      };
    }

    buildScramble(entry) {
      const word = tokenizeKeyword(entry.en);
      const choices = anagramVariants(word, this.rng);
      const answer = word;
      return {
        type: MODES.SCRAMBLE,
        promptEn: `还原单词（来自句中）`,
        promptZh: entry.en,
        choices,
        choiceType: "en",
        answer,
        meta: { entry, word }
      };
    }

    buildOdd() {
      const pair = ODD_PAIRS[Math.floor(this.rng() * ODD_PAIRS.length)];
      const choices = shuffle([pair.good, pair.bad], this.rng);
      return {
        type: MODES.ODD,
        promptEn: "选出语法正确的一句",
        promptZh: "",
        choices,
        choiceType: "en",
        answer: pair.good,
        meta: { pair }
      };
    }

    buildGap() {
      const g = GAP_BLUEPRINTS[Math.floor(this.rng() * GAP_BLUEPRINTS.length)];
      const choices = shuffle([g.answer, ...g.decoys], this.rng);
      return {
        type: MODES.GAP,
        promptEn: g.template.replace("____", "______"),
        promptZh: "选择最合适的词填入空白",
        choices,
        choiceType: "en",
        answer: g.answer,
        meta: { gap: g }
      };
    }

    buildStorm() {
      const tag = VOCAB[Math.floor(this.rng() * VOCAB.length)].tags[0];
      const same = VOCAB.filter((v) => v.tags.includes(tag));
      const diffPool = VOCAB.filter((v) => !v.tags.includes(tag));
      if (same.length < 4 || diffPool.length < 1) {
        return this.buildSpeedZh(VOCAB[Math.floor(this.rng() * VOCAB.length)]);
      }
      const core = pickUnique(same, 4, this.rng);
      const intruder = diffPool[Math.floor(this.rng() * diffPool.length)];
      const choices = shuffle(
        [...core.map((c) => c.en), intruder.en],
        this.rng
      );
      return {
        type: MODES.STORM,
        promptEn: `找出「不属于 ${tag}」主题的一项`,
        promptZh: "有一项语义标签不同",
        choices,
        choiceType: "en",
        answer: intruder.en,
        meta: { tag, intruder, core }
      };
    }

    randomQuestion(difficulty, boss, modeTag) {
      const roll = this.rng();
      const pool = VOCAB;
      const entry = pool[Math.floor(this.rng() * pool.length)];
      let q;
      const listenBias = modeTag === "listen";
      if (boss) {
        if (listenBias) {
          q = roll < 0.55 ? this.buildListen(entry) : roll < 0.82 ? this.buildStorm() : this.buildGap();
        } else {
          q =
            roll < 0.34
              ? this.buildListen(entry)
              : roll < 0.66
                ? this.buildStorm()
                : this.buildGap();
        }
      } else if (listenBias) {
        if (roll < 0.42) {
          q = this.buildListen(entry);
        } else if (roll < 0.58) {
          q = this.buildSpeedEn(entry);
        } else if (roll < 0.72) {
          q = this.buildGap();
        } else if (roll < 0.86) {
          q = this.buildStorm();
        } else if (roll < 0.93) {
          q = this.buildScramble(entry);
        } else {
          q = this.buildSpeedZh(entry);
        }
      } else {
        if (roll < 0.22) {
          q = this.buildSpeedZh(entry);
        } else if (roll < 0.4) {
          q = this.buildSpeedEn(entry);
        } else if (roll < 0.55) {
          q = this.buildListen(entry);
        } else if (roll < 0.72) {
          q = this.buildScramble(entry);
        } else if (roll < 0.86) {
          q = this.buildOdd();
        } else if (roll < 0.94) {
          q = this.buildGap();
        } else {
          q = this.buildStorm();
        }
      }
      q.difficulty = difficulty;
      q.boss = boss;
      q.timeLimit = Math.round(BASE_TIME_MS * (boss ? BOSS_TIME_MUL : 1) * clamp(1.05 - difficulty * 0.04, 0.72, 1.05));
      return q;
    }
  }

  class GameSession {
    constructor(ui, sfx, fx, store) {
      this.ui = ui;
      this.sfx = sfx;
      this.fx = fx;
      this.store = store;
      this.modeTag = "default";
      this.resolving = false;
      this.resetRun();
    }

    resetRun() {
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.round = 0;
      this.lives = MAX_LIVES;
      this.difficulty = 1;
      this.listenCorrect = 0;
      this.listenStreak = 0;
      this.peakListenStreak = 0;
      this.correctTotal = 0;
      this.wrongTotal = 0;
      this.bossBeat = 0;
      this.factory = new QuestionFactory(Date.now());
      this.current = null;
      this.deadline = 0;
      this._timer = null;
      this.resolving = false;
    }

    start() {
      this.resetRun();
      this.ui.showGame();
      this.nextRound();
    }

    end(reason) {
      this.resolving = false;
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      this.store.totalRuns += 1;
      this.store.bestScore = Math.max(this.store.bestScore, this.score);
      this.store.bestComboEver = Math.max(this.store.bestComboEver, this.maxCombo);
      this.store.bossCleared += this.bossBeat;
      this.store.bestListenStreak = Math.max(this.store.bestListenStreak, this.peakListenStreak);
      this.store.lifetimeCorrect += this.correctTotal;
      saveStore(this.store);
      this.ui.showOver(this, reason);
      this.checkAchievements();
    }

    checkAchievements() {
      const map = loadAch();
      let dirty = false;
      ACH_DEFS.forEach((def) => {
        if (map[def.id]) {
          return;
        }
        if (def.test(this.store)) {
          map[def.id] = Date.now();
          dirty = true;
        }
      });
      if (dirty) {
        saveAch(map);
      }
      this.ui.renderAchievements(map);
    }

    nextRound() {
      if (this.lives <= 0) {
        this.end("生命耗尽");
        return;
      }
      this.round += 1;
      const boss = this.round % BOSS_EVERY === 0;
      if (boss) {
        this.sfx.boss();
      }
      this.current = this.factory.randomQuestion(this.difficulty, boss, this.modeTag);
      this.deadline = Date.now() + this.current.timeLimit;
      this.ui.updateHud(this);
      this.ui.renderQuestion(this.current);
      this._armTimer();
      if (this.current.type === MODES.LISTEN) {
        this.speak(this.current.meta.speakEn);
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

    _armTimer() {
      if (this._timer) {
        clearInterval(this._timer);
      }
      this._timer = setInterval(() => this._tick(), 120);
    }

    _tick() {
      const left = this.deadline - Date.now();
      const t = clamp(left / this.current.timeLimit, 0, 1);
      this.ui.setTimer(t);
      if (left <= 0) {
        this.onTimeout();
      }
    }

    onTimeout() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      this.resolving = true;
      this.sfx.bad();
      this.combo = 0;
      this.lives -= 1;
      this.wrongTotal += 1;
      this.ui.flashHud();
      if (this.current && this.current.type === MODES.LISTEN) {
        this.listenStreak = 0;
      }
      this.difficulty = clamp(this.difficulty - 0.15, 1, 9);
      if (this.current) {
        this.ui.revealAnswer(this.current.answer);
      }
      setTimeout(() => {
        this.resolving = false;
        this.nextRound();
      }, 480);
    }

    submitChoice(text) {
      if (!this.current || this.resolving) {
        return;
      }
      const ok = text === this.current.answer;
      if (ok) {
        this.onCorrect();
      } else {
        this.onWrong();
      }
    }

    onCorrect() {
      this.resolving = true;
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      const mult = 1 + this.combo * 0.08 + (this.current.boss ? 0.35 : 0);
      const gain = Math.round(50 * mult * (1 + this.difficulty * 0.06));
      this.score += gain;
      this.combo += 1;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      this.correctTotal += 1;
      if (this.current.type === MODES.LISTEN) {
        this.listenCorrect += 1;
        this.listenStreak += 1;
        this.peakListenStreak = Math.max(this.peakListenStreak, this.listenStreak);
      }
      if (this.current.boss) {
        this.bossBeat += 1;
      }
      this.difficulty = clamp(this.difficulty + 0.12, 1, 9);
      this.sfx.ok();
      this.fx.burst(window.innerWidth / 2, window.innerHeight * 0.35, "#3dffea");
      this.ui.updateHud(this);
      setTimeout(() => {
        this.resolving = false;
        this.nextRound();
      }, 420);
    }

    onWrong() {
      this.resolving = true;
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      this.combo = 0;
      this.score = Math.max(0, this.score - 18);
      this.lives -= 1;
      this.wrongTotal += 1;
      if (this.current.type === MODES.LISTEN) {
        this.listenStreak = 0;
      }
      this.difficulty = clamp(this.difficulty - 0.2, 1, 9);
      this.sfx.bad();
      this.ui.updateHud(this);
      this.ui.revealAnswer(this.current.answer);
      setTimeout(() => {
        this.resolving = false;
        this.nextRound();
      }, 520);
    }

    skip() {
      if (this.resolving) {
        return;
      }
      this.score = Math.max(0, this.score - 10);
      this.combo = 0;
      if (this.current && this.current.type === MODES.LISTEN) {
        this.listenStreak = 0;
      }
      this.sfx.tick();
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      this.nextRound();
    }
  }

  class UIManager {
    constructor(root) {
      this.screens = {
        menu: root.querySelector("#screenMenu"),
        game: root.querySelector("#screenGame"),
        over: root.querySelector("#screenOver")
      };
      this.el = {
        hudScore: root.querySelector("#hudScore"),
        hudCombo: root.querySelector("#hudCombo"),
        hudLives: root.querySelector("#hudLives"),
        timerFill: root.querySelector("#timerFill"),
        comboMeter: root.querySelector("#comboMeter"),
        modePill: root.querySelector("#modePill"),
        promptEn: root.querySelector("#promptEn"),
        promptZh: root.querySelector("#promptZh"),
        promptHint: root.querySelector("#promptHint"),
        choiceGrid: root.querySelector("#choiceGrid"),
        listenAgain: root.querySelector("#listenAgainBtn"),
        modeGrid: root.querySelector("#modeGrid"),
        achList: root.querySelector("#achList"),
        overTitle: root.querySelector("#overTitle"),
        overSub: root.querySelector("#overSub"),
        overStats: root.querySelector("#overStats")
      };
    }

    showScreen(name) {
      Object.entries(this.screens).forEach(([k, el]) => {
        el.classList.toggle("active", k === name);
      });
    }

    showMenu() {
      this.showScreen("menu");
    }

    showGame() {
      this.showScreen("game");
    }

    showOver(session, reason) {
      this.showScreen("over");
      this.el.overTitle.textContent = reason === "生命耗尽" ? "挑战失败" : "本局结束";
      this.el.overSub.textContent = `最终得分 ${session.score} · 最高连击 ${session.maxCombo} · 答对 ${session.correctTotal} / 错 ${session.wrongTotal}`;
      this.el.overStats.innerHTML = "";
      const rows = [
        ["回合数", String(session.round)],
        ["BOSS 击破", String(session.bossBeat)],
        ["难度系数", session.difficulty.toFixed(2)],
        ["听力连击峰值", String(session.peakListenStreak)]
      ];
      rows.forEach(([a, b]) => {
        const div = document.createElement("div");
        div.className = "stat-line";
        div.innerHTML = `<span>${a}</span><b>${b}</b>`;
        this.el.overStats.appendChild(div);
      });
    }

    renderMenuModes() {
      const modes = [
        {
          title: "经典闯关",
          desc: "混合题型，生命制，难度自适应。适合每天 5～10 分钟碎片练语感。",
          tag: "default"
        },
        {
          title: "听力特训",
          desc: "更多听力与 BOSS 权重（仍含少量其他题防枯燥）。",
          tag: "listen"
        }
      ];
      this.el.modeGrid.innerHTML = "";
      modes.forEach((m) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "mode-card";
        card.dataset.tag = m.tag;
        card.innerHTML = `<h3>${m.title}</h3><p>${m.desc}</p>`;
        this.el.modeGrid.appendChild(card);
      });
    }

    renderAchievements(map) {
      this.el.achList.innerHTML = "";
      ACH_DEFS.forEach((def) => {
        const li = document.createElement("li");
        const unlocked = Boolean(map[def.id]);
        li.className = unlocked ? "unlocked" : "";
        li.innerHTML = `<span><strong>${def.label}</strong><div class="tag">${def.desc}</div></span><span>${
          unlocked ? "✅" : "🔒"
        }</span>`;
        this.el.achList.appendChild(li);
      });
    }

    updateHud(session) {
      this.el.hudScore.textContent = String(session.score);
      this.el.hudCombo.textContent = String(session.combo);
      this.el.hudLives.textContent = "♥".repeat(session.lives) + "♡".repeat(MAX_LIVES - session.lives);
      this.el.comboMeter.textContent = session.combo >= 3 ? `COMBO x${session.combo}  🔥` : "";
    }

    setTimer(t) {
      this.el.timerFill.style.setProperty("--t", String(t));
    }

    flashHud() {
      document.querySelector(".hud")?.animate([{ filter: "brightness(1.6)" }, { filter: "brightness(1)" }], {
        duration: 220
      });
    }

    renderQuestion(q) {
      this.el.modePill.textContent = MODE_LABEL[q.type] || q.type;
      this.el.promptEn.textContent = q.promptEn;
      this.el.promptZh.textContent = q.promptZh || "";
      this.el.promptHint.textContent =
        q.type === MODES.LISTEN ? "播放已开始；不确定可点「再听一遍」" : "点选你认为正确的答案";
      this.el.listenAgain.hidden = q.type !== MODES.LISTEN;
      this.el.choiceGrid.innerHTML = "";
      q.choices.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice-btn";
        b.textContent = c;
        b.dataset.val = c;
        this.el.choiceGrid.appendChild(b);
      });
      this.setTimer(1);
    }

    revealAnswer(answerText) {
      this.el.choiceGrid.querySelectorAll(".choice-btn").forEach((b) => {
        if (b.dataset.val === answerText) {
          b.classList.add("correct-flash");
        }
      });
    }
  }

  function bootstrap() {
    const ui = new UIManager(document);
    const sfx = new SoundBus();
    const fx = new FxCanvas(document.getElementById("fxCanvas"));
    const store = loadSave();
    sfx.setMuted(store.muted);

    const app = { session: null };
    ui.renderMenuModes();
    ui.renderAchievements(loadAch());

    document.getElementById("backBtn").addEventListener("click", () => {
      window.location.href = "./adult.html";
    });
    document.getElementById("muteBtn").addEventListener("click", () => {
      store.muted = !store.muted;
      sfx.setMuted(store.muted);
      document.getElementById("muteBtn").textContent = store.muted ? "🔇" : "🔊";
      saveStore(store);
    });
    document.getElementById("muteBtn").textContent = store.muted ? "🔇" : "🔊";

    document.getElementById("toGameB").addEventListener("click", () => {
      window.location.href = "./adult-game-b.html";
    });

    document.getElementById("modeGrid").addEventListener("click", (e) => {
      const card = e.target.closest(".mode-card");
      if (!card) {
        return;
      }
      const s = new GameSession(ui, sfx, fx, store);
      s.modeTag = card.dataset.tag || "default";
      app.session = s;
      s.start();
    });

    document.getElementById("choiceGrid").addEventListener("click", (e) => {
      const btn = e.target.closest(".choice-btn");
      if (!btn || !app.session || app.session.resolving) {
        return;
      }
      const val = btn.dataset.val;
      const ok = val === app.session.current.answer;
      btn.classList.add(ok ? "correct-flash" : "wrong-flash");
      if (ok) {
        app.session.onCorrect();
      } else {
        app.session.onWrong();
      }
    });

    document.getElementById("skipBtn").addEventListener("click", () => app.session?.skip());
    document.getElementById("listenAgainBtn").addEventListener("click", () => {
      if (app.session?.current?.meta?.speakEn) {
        app.session.speak(app.session.current.meta.speakEn);
      }
    });

    document.getElementById("retryBtn").addEventListener("click", () => {
      const prev = app.session;
      const s = new GameSession(ui, sfx, fx, store);
      s.modeTag = prev?.modeTag || "default";
      app.session = s;
      s.start();
    });
    document.getElementById("menuBtn").addEventListener("click", () => {
      ui.showMenu();
      ui.renderAchievements(loadAch());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
