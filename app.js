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
  },
  {
    id: "family",
    en: "family",
    zh: "家人",
    emoji: "👨‍👩‍👧",
    words: [
      { emoji: "👩", en: "mama", zh: "妈妈" },
      { emoji: "👨", en: "dada", zh: "爸爸" },
      { emoji: "👵", en: "grandma", zh: "奶奶/外婆" },
      { emoji: "👴", en: "grandpa", zh: "爷爷/外公" },
      { emoji: "👶", en: "baby", zh: "宝宝" },
      { emoji: "👧", en: "sister", zh: "姐姐/妹妹" },
      { emoji: "👦", en: "brother", zh: "哥哥/弟弟" },
      { emoji: "👪", en: "family", zh: "家" }
    ]
  },
  {
    id: "daily_items",
    en: "daily items",
    zh: "日常用品",
    emoji: "🍼",
    words: [
      { emoji: "🍼", en: "bottle", zh: "奶瓶" },
      { emoji: "🧷", en: "diaper", zh: "尿不湿" },
      { emoji: "🧣", en: "bib", zh: "围兜" },
      { emoji: "🧸", en: "toy", zh: "玩具" },
      { emoji: "🛏️", en: "bed", zh: "小床" },
      { emoji: "🧺", en: "towel", zh: "毛巾" },
      { emoji: "🛁", en: "bathtub", zh: "浴盆" },
      { emoji: "🧴", en: "lotion", zh: "润肤乳" }
    ]
  },
  {
    id: "routines",
    en: "routines",
    zh: "日常流程",
    emoji: "🌞",
    words: [
      { emoji: "☀️", en: "wake up", zh: "起床" },
      { emoji: "🍼", en: "drink milk", zh: "喝奶" },
      { emoji: "🍽️", en: "eat", zh: "吃饭" },
      { emoji: "🛁", en: "bath", zh: "洗澡" },
      { emoji: "🪥", en: "brush", zh: "刷牙" },
      { emoji: "📖", en: "read", zh: "看书" },
      { emoji: "🚶", en: "go out", zh: "出门" },
      { emoji: "🌙", en: "good night", zh: "晚安" }
    ]
  },
  {
    id: "places",
    en: "places",
    zh: "生活场景",
    emoji: "🏡",
    words: [
      { emoji: "🏠", en: "home", zh: "家里" },
      { emoji: "🛏️", en: "bedroom", zh: "卧室" },
      { emoji: "🛋️", en: "living room", zh: "客厅" },
      { emoji: "🍳", en: "kitchen", zh: "厨房" },
      { emoji: "🚿", en: "bathroom", zh: "洗手间" },
      { emoji: "🌳", en: "park", zh: "公园" },
      { emoji: "🛒", en: "shop", zh: "商店" },
      { emoji: "🚗", en: "car", zh: "车里" }
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
const parentLearningToggle = document.getElementById("parentLearningToggle");
const englishVoiceSelect = document.getElementById("englishVoiceSelect");
const childAudioEngineSelect = document.getElementById("childAudioEngineSelect");
const ttsEngineSelect = document.getElementById("ttsEngineSelect");
const azureRegionInput = document.getElementById("azureRegionInput");
const azureApiKeyInput = document.getElementById("azureApiKeyInput");

let currentCategoryIndex = null;
let lastSpokenEntry = null;
let touchStartX = null;
let titleLongPressTimer = null;
let autoplaySessionToken = 0;
let playingWordIndex = null;
let currentWordSet = [];
let isDailyMode = false;
let currentCloudAudio = null;
let cloudTtsAbortController = null;
const childEnglishAudioPlayer = new Audio();

const SETTINGS_KEY = "baby_english_settings";
const defaultSettings = {
  slowMode: true,
  autoplayWordCount: 4,
  autoplayGapMs: 2200,
  parentLearningMode: false,
  englishVoicePref: "us",
  childAudioEngine: "system",
  ttsEngine: "system",
  azureRegion: "eastasia",
  azureApiKey: "",
  azureEnglishVoiceUs: "en-US-JennyNeural",
  azureEnglishVoiceUk: "en-GB-SoniaNeural",
  azureChineseVoice: "zh-CN-XiaoxiaoNeural"
};
const settings = loadSettings();
if (!["us", "uk", "auto"].includes(settings.englishVoicePref)) {
  settings.englishVoicePref = "us";
}
if (!["system", "local"].includes(settings.childAudioEngine)) {
  settings.childAudioEngine = "system";
}
if (!["system", "azure"].includes(settings.ttsEngine)) {
  settings.ttsEngine = "system";
}

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

  const storyBtn = document.createElement("button");
  storyBtn.className = "big-btn story-btn";
  storyBtn.type = "button";
  storyBtn.textContent = "绘本故事";
  storyBtn.addEventListener("click", () => {
    window.location.href = "./story.html";
  });

  const adultBtn = document.createElement("button");
  adultBtn.className = "big-btn adult-btn";
  adultBtn.type = "button";
  adultBtn.textContent = "大人口语";
  adultBtn.addEventListener("click", () => {
    window.location.href = "./adult.html";
  });

  homeView.replaceChildren(wrap, dailyBtn, storyBtn, adultBtn, tip);
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
      speakWord(word, { wordIndex: index });
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        stopAutoplay();
        setPlayingWord(index);
        speakWord(word, { wordIndex: index });
      }
    });
    card.querySelector(".mini-replay").addEventListener("click", (event) => {
      event.stopPropagation();
      stopAutoplay();
      setPlayingWord(index);
      speakWord(word, { wordIndex: index });
    });
    wordGrid.appendChild(card);
  });
}

function getEnglishVoiceScore(voice, preference) {
  const lang = voice.lang.toLowerCase();
  const name = voice.name.toLowerCase();
  let score = 0;

  if (voice.default) {
    score += 6;
  }
  if (name.includes("natural") || name.includes("neural")) {
    score += 25;
  }
  if (name.includes("online")) {
    score += 12;
  }
  if (name.includes("microsoft") || name.includes("google")) {
    score += 8;
  }
  if (name.includes("samantha") || name.includes("aria") || name.includes("jenny")) {
    score += 8;
  }
  if (
    name.includes("whisper") ||
    name.includes("espeak") ||
    name.includes("festival") ||
    name.includes("robot")
  ) {
    score -= 60;
  }

  if (preference === "us") {
    if (lang === "en-us" || lang.startsWith("en-us")) {
      score += 60;
    }
    if (
      name.includes("american") ||
      name.includes("united states") ||
      name.includes("en-us")
    ) {
      score += 30;
    }
    if (lang === "en-gb" || lang.startsWith("en-gb")) {
      score += 8;
    }
  } else if (preference === "uk") {
    if (lang === "en-gb" || lang.startsWith("en-gb")) {
      score += 60;
    }
    if (
      name.includes("british") ||
      name.includes("united kingdom") ||
      name.includes("en-gb")
    ) {
      score += 30;
    }
    if (lang === "en-us" || lang.startsWith("en-us")) {
      score += 8;
    }
  } else if (lang === "en-us" || lang.startsWith("en-us") || lang === "en-gb" || lang.startsWith("en-gb")) {
    score += 35;
  } else {
    score += 12;
  }

  return score;
}

function pickEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  if (englishVoices.length === 0) {
    return null;
  }
  const scored = englishVoices
    .map((voice) => ({
      voice,
      score: getEnglishVoiceScore(voice, settings.englishVoicePref)
    }))
    .sort((a, b) => b.score - a.score);
  return scored[0].voice;
}

function pickChineseVoice() {
  const voices = window.speechSynthesis.getVoices();
  const zhVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("zh"));
  if (zhVoices.length === 0) {
    return null;
  }
  const scored = zhVoices
    .map((voice) => {
      const lang = voice.lang.toLowerCase();
      const name = voice.name.toLowerCase();
      let score = 0;
      if (lang === "zh-cn" || lang.startsWith("zh-cn")) {
        score += 30;
      }
      if (voice.default) {
        score += 6;
      }
      if (name.includes("natural") || name.includes("neural")) {
        score += 16;
      }
      if (name.includes("espeak") || name.includes("robot")) {
        score -= 50;
      }
      return { voice, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0].voice;
}

function getChildAudioKey(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function stopChildLocalAudio() {
  childEnglishAudioPlayer.pause();
  childEnglishAudioPlayer.src = "";
}

async function playChildEnglishLocalAudio(text, rate = 1) {
  const key = getChildAudioKey(text);
  if (!key) {
    return false;
  }
  const src = `./audio/children/en/${key}.mp3`;
  try {
    stopChildLocalAudio();
    childEnglishAudioPlayer.src = src;
    childEnglishAudioPlayer.currentTime = 0;
    childEnglishAudioPlayer.playbackRate = rate;
    await new Promise((resolve, reject) => {
      childEnglishAudioPlayer.onended = () => resolve();
      childEnglishAudioPlayer.onerror = () => reject(new Error("audio failed"));
      childEnglishAudioPlayer.play().catch(reject);
    });
    return true;
  } catch {
    return false;
  }
}

function escapeForSsml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getAzureEndpoint() {
  const region = settings.azureRegion.trim();
  if (!region) {
    return "";
  }
  return `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
}

function getAzureVoiceName(voiceType) {
  if (voiceType === "chinese") {
    return settings.azureChineseVoice;
  }
  if (settings.englishVoicePref === "uk") {
    return settings.azureEnglishVoiceUk;
  }
  return settings.azureEnglishVoiceUs;
}

function cancelCloudSpeech() {
  if (cloudTtsAbortController) {
    cloudTtsAbortController.abort();
    cloudTtsAbortController = null;
  }
  if (currentCloudAudio) {
    currentCloudAudio.pause();
    currentCloudAudio.src = "";
    currentCloudAudio = null;
  }
}

async function speakByAzure(text, config = {}) {
  const apiKey = settings.azureApiKey.trim();
  const endpoint = getAzureEndpoint();
  const voiceName = getAzureVoiceName(config.voiceType);
  if (!apiKey || !endpoint || !voiceName) {
    return false;
  }

  cancelCloudSpeech();
  cloudTtsAbortController = new AbortController();

  const safeText = escapeForSsml(text);
  const ratePercent = Math.round(((config.rate ?? 1) - 1) * 100);
  const ssml = `<?xml version="1.0" encoding="utf-8"?>
<speak version="1.0" xml:lang="${config.lang || "en-US"}">
  <voice name="${voiceName}">
    <prosody rate="${ratePercent >= 0 ? "+" : ""}${ratePercent}%">${safeText}</prosody>
  </voice>
</speak>`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
        "User-Agent": "bbcare"
      },
      body: ssml,
      signal: cloudTtsAbortController.signal
    });
    if (!response.ok) {
      return false;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    currentCloudAudio = audio;

    await new Promise((resolve) => {
      audio.onended = resolve;
      audio.onerror = resolve;
      audio.play().catch(resolve);
    });
    URL.revokeObjectURL(audioUrl);
    currentCloudAudio = null;
    cloudTtsAbortController = null;
    return true;
  } catch {
    currentCloudAudio = null;
    cloudTtsAbortController = null;
    return false;
  }
}

function speakText(text, config = {}) {
  const shouldUseLocalChildAudio =
    config.voiceType !== "chinese" &&
    settings.childAudioEngine === "local";
  if (shouldUseLocalChildAudio) {
    return playChildEnglishLocalAudio(text, config.rate ?? 1).then((played) => {
      if (played) {
        return;
      }
      const shouldUseAzureFallback =
        settings.ttsEngine === "azure" &&
        settings.azureApiKey.trim() &&
        settings.azureRegion.trim();
      if (shouldUseAzureFallback) {
        return speakByAzure(text, config).then((azurePlayed) => {
          if (azurePlayed) {
            return;
          }
          return speakTextBySystem(text, config);
        });
      }
      return speakTextBySystem(text, config);
    });
  }

  const shouldUseAzure =
    settings.ttsEngine === "azure" &&
    settings.azureApiKey.trim() &&
    settings.azureRegion.trim();

  if (shouldUseAzure) {
    return speakByAzure(text, config).then((played) => {
      if (played) {
        return;
      }
      return speakTextBySystem(text, config);
    });
  }
  return speakTextBySystem(text, config);
}

function speakTextBySystem(text, config = {}) {
  if (!("speechSynthesis" in window)) {
    return Promise.resolve();
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = config.lang || "en-US";
  utterance.rate = config.rate ?? 0.92;
  utterance.pitch = config.pitch ?? 1;
  utterance.volume = config.volume ?? 1;

  if (config.voiceType === "chinese") {
    const zhVoice = pickChineseVoice();
    if (zhVoice) {
      utterance.voice = zhVoice;
    }
  } else {
    const enVoice = pickEnglishVoice();
    if (enVoice) {
      utterance.voice = enVoice;
    }
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

async function speakWord(word, options = {}) {
  if (!word) {
    return;
  }

  if (options.remember !== false) {
    lastSpokenEntry = { word: { ...word } };
  }
  replayBtn.classList.remove("hidden");
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  cancelCloudSpeech();
  stopChildLocalAudio();

  const englishLang = settings.englishVoicePref === "uk" ? "en-GB" : "en-US";

  try {
    if (settings.parentLearningMode) {
      await speakText(word.en, {
        lang: englishLang,
        rate: settings.slowMode ? 0.74 : 0.9,
        voiceType: "english"
      });
      await wait(180);
      await speakText(`中文解释：${word.zh}`, {
        lang: "zh-CN",
        rate: 0.92,
        voiceType: "chinese"
      });
      await wait(140);
      await speakText(word.en, {
        lang: englishLang,
        rate: settings.slowMode ? 0.78 : 0.95,
        voiceType: "english"
      });
    } else {
      await speakText(word.en, {
        lang: englishLang,
        rate: settings.slowMode ? 0.78 : 0.95,
        voiceType: "english"
      });
    }
  } finally {
    if (options.wordIndex === playingWordIndex) {
      setPlayingWord(null);
    }
  }
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
  parentLearningToggle.checked = settings.parentLearningMode;
  englishVoiceSelect.value = settings.englishVoicePref;
  childAudioEngineSelect.value = settings.childAudioEngine;
  ttsEngineSelect.value = settings.ttsEngine;
  azureRegionInput.value = settings.azureRegion;
  azureApiKeyInput.value = settings.azureApiKey;
  setAutoplayButton(autoPlayBtn.classList.contains("active"));
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
  parentLearningToggle.addEventListener("change", () => {
    settings.parentLearningMode = parentLearningToggle.checked;
    setAutoplayButton(autoPlayBtn.classList.contains("active"));
    saveSettings();
  });
  englishVoiceSelect.addEventListener("change", () => {
    settings.englishVoicePref = englishVoiceSelect.value;
    saveSettings();
  });
  childAudioEngineSelect.addEventListener("change", () => {
    settings.childAudioEngine = childAudioEngineSelect.value;
    saveSettings();
  });
  ttsEngineSelect.addEventListener("change", () => {
    settings.ttsEngine = ttsEngineSelect.value;
    saveSettings();
  });
  azureRegionInput.addEventListener("change", () => {
    settings.azureRegion = azureRegionInput.value.trim();
    saveSettings();
  });
  azureApiKeyInput.addEventListener("change", () => {
    settings.azureApiKey = azureApiKeyInput.value.trim();
    saveSettings();
  });
}

function setAutoplayButton(active) {
  autoPlayBtn.classList.toggle("active", active);
  autoPlayBtn.textContent = active
    ? "停止轮播"
    : settings.parentLearningMode
      ? "学习轮播"
      : "自动轮播";
}

function stopAutoplay() {
  autoplaySessionToken += 1;
  cancelCloudSpeech();
  stopChildLocalAudio();
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
    await speakWord(words[index], { wordIndex: index });
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
  if (lastSpokenEntry?.word) {
    stopAutoplay();
    speakWord(lastSpokenEntry.word, { remember: false });
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
