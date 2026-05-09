const categories = [
  {
    id: "animals",
    en: "animals",
    zh: "动物",
    emoji: "🐶",
    words: [
      { emoji: "🐶", en: "dog", zh: "狗" },
      { emoji: "🐱", en: "cat", zh: "猫" },
      { emoji: "🐰", en: "rabbit", zh: "兔子" },
      { emoji: "🐻", en: "bear", zh: "熊" },
      { emoji: "🦁", en: "lion", zh: "狮子" },
      { emoji: "🐼", en: "panda", zh: "熊猫" }
    ]
  },
  {
    id: "colors",
    en: "colors",
    zh: "颜色",
    emoji: "🌈",
    words: [
      { emoji: "🟥", en: "red", zh: "红色" },
      { emoji: "🟦", en: "blue", zh: "蓝色" },
      { emoji: "🟨", en: "yellow", zh: "黄色" },
      { emoji: "🟩", en: "green", zh: "绿色" },
      { emoji: "⬜", en: "white", zh: "白色" },
      { emoji: "⬛", en: "black", zh: "黑色" }
    ]
  },
  {
    id: "food",
    en: "food",
    zh: "食物",
    emoji: "🍎",
    words: [
      { emoji: "🍎", en: "apple", zh: "苹果" },
      { emoji: "🍌", en: "banana", zh: "香蕉" },
      { emoji: "🍞", en: "bread", zh: "面包" },
      { emoji: "🥛", en: "milk", zh: "牛奶" },
      { emoji: "🥚", en: "egg", zh: "鸡蛋" },
      { emoji: "🍚", en: "rice", zh: "米饭" }
    ]
  },
  {
    id: "body",
    en: "body",
    zh: "身体",
    emoji: "🧍",
    words: [
      { emoji: "👀", en: "eyes", zh: "眼睛" },
      { emoji: "👂", en: "ear", zh: "耳朵" },
      { emoji: "👃", en: "nose", zh: "鼻子" },
      { emoji: "👄", en: "mouth", zh: "嘴巴" },
      { emoji: "🖐️", en: "hand", zh: "手" },
      { emoji: "🦶", en: "foot", zh: "脚" }
    ]
  },
  {
    id: "actions",
    en: "actions",
    zh: "动作",
    emoji: "🏃",
    words: [
      { emoji: "👋", en: "wave", zh: "挥手" },
      { emoji: "👏", en: "clap", zh: "拍手" },
      { emoji: "🏃", en: "run", zh: "跑步" },
      { emoji: "🚶", en: "walk", zh: "走路" },
      { emoji: "🛌", en: "sleep", zh: "睡觉" },
      { emoji: "🕺", en: "dance", zh: "跳舞" }
    ]
  }
];

const homeView = document.getElementById("homeView");
const categoryView = document.getElementById("categoryView");
const wordGrid = document.getElementById("wordGrid");
const tabs = document.getElementById("bottomTabs");
const pageTitle = document.getElementById("pageTitle");
const backBtn = document.getElementById("backBtn");
const replayBtn = document.getElementById("replayBtn");
const autoPlayBtn = document.getElementById("autoPlayBtn");
const parentModal = document.getElementById("parentModal");
const closeParentModalBtn = document.getElementById("closeParentModalBtn");
const slowModeToggle = document.getElementById("slowModeToggle");
const wordCountInput = document.getElementById("wordCountInput");
const delayInput = document.getElementById("delayInput");
const wordCountValue = document.getElementById("wordCountValue");
const delayValue = document.getElementById("delayValue");

let currentCategoryIndex = null;
let lastSpokenWord = "";
let touchStartX = null;
let titleLongPressTimer = null;
let autoplaySessionToken = 0;
let playingWordIndex = null;
let currentWordSet = [];
let isDailyMode = false;

const SETTINGS_KEY = "baby_english_settings";
const defaultSettings = {
  slowMode: true,
  autoplayWordCount: 4,
  autoplayGapMs: 2200
};
const settings = loadSettings();

function createHome() {
  const wrap = document.createElement("div");
  wrap.className = "card-grid";

  categories.forEach((cat, idx) => {
    const btn = document.createElement("button");
    btn.className = "category-card";
    btn.innerHTML = `
      <span class="category-emoji" aria-hidden="true">${cat.emoji}</span>
      <span class="category-labels">
        <strong>${cat.en}</strong>
        <span>${cat.zh}</span>
      </span>
    `;
    btn.addEventListener("click", () => openCategory(idx));
    wrap.appendChild(btn);
  });

  const tip = document.createElement("p");
  tip.className = "parent-mode-tip";
  tip.textContent = "长按顶部标题 1.2 秒可进入家长模式";

  const dailyBtn = document.createElement("button");
  dailyBtn.className = "big-btn daily-btn";
  dailyBtn.type = "button";
  dailyBtn.textContent = "今日10词";
  dailyBtn.addEventListener("click", openDailyMode);

  homeView.replaceChildren(wrap, dailyBtn, tip);
}

function createTabs() {
  categories.forEach((cat, idx) => {
    const tab = document.createElement("button");
    tab.className = "tab-btn";
    tab.innerHTML = `
      <span class="tab-emoji" aria-hidden="true">${cat.emoji}</span>
      <span class="tab-text">${cat.en}</span>
    `;
    tab.addEventListener("click", () => openCategory(idx));
    tabs.appendChild(tab);
  });
}

function openCategory(index) {
  stopAutoplay();
  isDailyMode = false;
  currentCategoryIndex = index;
  const cat = categories[index];

  homeView.classList.add("hidden");
  categoryView.classList.remove("hidden");
  backBtn.classList.remove("hidden");

  pageTitle.textContent = `${cat.en} · ${cat.zh}`;
  renderWords(cat.words);
  setTabActive(index);
}

function goHome() {
  stopAutoplay();
  isDailyMode = false;
  currentCategoryIndex = null;
  homeView.classList.remove("hidden");
  categoryView.classList.add("hidden");
  backBtn.classList.add("hidden");
  replayBtn.classList.add("hidden");
  pageTitle.textContent = "Baby English";
  setTabActive(null);
}

function setTabActive(index) {
  const allTabs = tabs.querySelectorAll(".tab-btn");
  allTabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
}

function renderWords(words) {
  wordGrid.innerHTML = "";
  playingWordIndex = null;
  currentWordSet = words.slice();

  words.forEach((word, index) => {
    const card = document.createElement("div");
    card.className = "word-card";
    card.dataset.wordIndex = index;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML = `
      <div class="word-emoji" aria-hidden="true">${word.emoji}</div>
      <div class="word-en">${word.en}</div>
      <div class="word-zh">${word.zh}</div>
      <div class="word-actions">
        <button class="mini-replay" type="button">再读一次</button>
      </div>
    `;

    card.addEventListener("click", () => {
      stopAutoplay();
      setPlayingWord(index);
      speak(word.en, { wordIndex: index });
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        stopAutoplay();
        setPlayingWord(index);
        speak(word.en, { wordIndex: index });
      }
    });
    card.querySelector(".mini-replay").addEventListener("click", (event) => {
      event.stopPropagation();
      stopAutoplay();
      setPlayingWord(index);
      speak(word.en, { wordIndex: index });
    });
    wordGrid.appendChild(card);
  });
}

function speak(text, options = {}) {
  if (!("speechSynthesis" in window)) {
    return Promise.resolve();
  }

  lastSpokenWord = text;
  replayBtn.classList.remove("hidden");
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = settings.slowMode ? 0.78 : 0.95;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) => voice.lang.startsWith("en") && !voice.name.toLowerCase().includes("whisper")
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  return new Promise((resolve) => {
    utterance.onend = () => {
      if (options.wordIndex === playingWordIndex) {
        setPlayingWord(null);
      }
      resolve();
    };
    utterance.onerror = () => {
      if (options.wordIndex === playingWordIndex) {
        setPlayingWord(null);
      }
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

function openSiblingCategory(direction) {
  if (currentCategoryIndex === null || isDailyMode) {
    return;
  }
  const next =
    (currentCategoryIndex + direction + categories.length) % categories.length;
  openCategory(next);
}

function setupSwipe() {
  categoryView.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  });

  categoryView.addEventListener("touchend", (event) => {
    if (touchStartX === null) {
      return;
    }
    const touchEndX = event.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    touchStartX = null;

    if (Math.abs(delta) < 50) {
      return;
    }
    if (delta < 0) {
      openSiblingCategory(1);
    } else {
      openSiblingCategory(-1);
    }
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getDateSeed() {
  const now = new Date();
  return Number(
    `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`
  );
}

function seededRandomGenerator(seed) {
  let value = seed >>> 0;
  return function random() {
    value = (value + 0x6d2b79f5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getTodayWords() {
  const allWords = categories.flatMap((cat) =>
    cat.words.map((word) => ({
      ...word,
      id: `${cat.id}-${word.en}`
    }))
  );
  const random = seededRandomGenerator(getDateSeed());
  const shuffled = allWords.slice();
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

function openDailyMode() {
  stopAutoplay();
  isDailyMode = true;
  currentCategoryIndex = null;
  homeView.classList.add("hidden");
  categoryView.classList.remove("hidden");
  backBtn.classList.remove("hidden");
  pageTitle.textContent = "Today 10 · 今日10词";
  renderWords(getTodayWords());
  setTabActive(null);
}

function setPlayingWord(index) {
  playingWordIndex = index;
  const cards = wordGrid.querySelectorAll(".word-card");
  cards.forEach((card, cardIndex) => {
    card.classList.toggle("playing", cardIndex === index);
  });
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return { ...defaultSettings };
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed
    };
  } catch {
    return { ...defaultSettings };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function syncSettingsUi() {
  slowModeToggle.checked = settings.slowMode;
  wordCountInput.value = String(settings.autoplayWordCount);
  delayInput.value = (settings.autoplayGapMs / 1000).toFixed(1);
  wordCountValue.textContent = String(settings.autoplayWordCount);
  delayValue.textContent = (settings.autoplayGapMs / 1000).toFixed(1);
}

function openParentMode() {
  syncSettingsUi();
  parentModal.classList.remove("hidden");
}

function closeParentMode() {
  parentModal.classList.add("hidden");
}

function setupParentMode() {
  const startPress = () => {
    clearTimeout(titleLongPressTimer);
    titleLongPressTimer = window.setTimeout(() => {
      openParentMode();
    }, 1200);
  };
  const endPress = () => {
    clearTimeout(titleLongPressTimer);
  };

  pageTitle.addEventListener("mousedown", startPress);
  pageTitle.addEventListener("touchstart", startPress, { passive: true });
  pageTitle.addEventListener("mouseup", endPress);
  pageTitle.addEventListener("mouseleave", endPress);
  pageTitle.addEventListener("touchend", endPress);
  pageTitle.addEventListener("touchcancel", endPress);

  closeParentModalBtn.addEventListener("click", closeParentMode);
  parentModal.addEventListener("click", (event) => {
    if (event.target === parentModal) {
      closeParentMode();
    }
  });

  slowModeToggle.addEventListener("change", () => {
    settings.slowMode = slowModeToggle.checked;
    saveSettings();
  });
  wordCountInput.addEventListener("input", () => {
    settings.autoplayWordCount = Number(wordCountInput.value);
    wordCountValue.textContent = String(settings.autoplayWordCount);
    saveSettings();
  });
  delayInput.addEventListener("input", () => {
    settings.autoplayGapMs = Math.round(Number(delayInput.value) * 1000);
    delayValue.textContent = (settings.autoplayGapMs / 1000).toFixed(1);
    saveSettings();
  });
}

function setAutoplayButton(active) {
  autoPlayBtn.classList.toggle("active", active);
  autoPlayBtn.textContent = active ? "停止轮播" : "自动轮播";
}

function stopAutoplay() {
  autoplaySessionToken += 1;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  setAutoplayButton(false);
  setPlayingWord(null);
}

async function startAutoplay() {
  if (currentWordSet.length === 0) {
    return;
  }

  stopAutoplay();
  const mySession = autoplaySessionToken;
  setAutoplayButton(true);

  const words = currentWordSet.slice(0, settings.autoplayWordCount);
  for (let index = 0; index < words.length; index += 1) {
    if (mySession !== autoplaySessionToken) {
      return;
    }
    setPlayingWord(index);
    await speak(words[index].en, { wordIndex: index });
    if (mySession !== autoplaySessionToken || index === words.length - 1) {
      break;
    }
    await wait(settings.autoplayGapMs);
  }

  if (mySession === autoplaySessionToken) {
    setAutoplayButton(false);
    setPlayingWord(null);
  }
}

backBtn.addEventListener("click", goHome);
replayBtn.addEventListener("click", () => {
  if (lastSpokenWord) {
    stopAutoplay();
    speak(lastSpokenWord);
  }
});
autoPlayBtn.addEventListener("click", () => {
  if (autoPlayBtn.classList.contains("active")) {
    stopAutoplay();
    return;
  }
  startAutoplay();
});

createHome();
createTabs();
setupSwipe();
setupParentMode();
syncSettingsUi();
registerServiceWorker();
