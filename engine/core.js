/* ============================================================
   core.js — 游戏引擎核心：状态管理、场景系统、时间系统
   ============================================================ */
var Game = {
  state: {
    screen: "cover",           // cover | world | prologue | creation | opening | playing | desk | ending
    world: "ancient",          // ancient | modern
    playerName: "",
    playerGender: "女",
    playerColor: "red",        // red | blue | green
    currentCase: null,
    currentScene: null,
    currentTime: "dawn",       // dawn | noon | evening | night
    discoveredClues: [],
    spokenFlags: {},           // tracks what player has asked about {npcId: [topics]}
    totalClues: 0,
    dayCount: 1,
    prologueSeen: false,
    openingSeen: false,
    endingReached: null        // trap | direct | wrong
  },

  cases: {},

  /* ---- Init ---- */
  init() {
    var s = Save.load();
    if (s) {
      Object.assign(this.state, s);
      if (this.state.screen === "playing") {
        var c = this.getCurrentCase();
        if (c) { UI.renderScene(c); return; }
      }
      UI.showCover();
    } else {
      UI.showCover();
    }
  },

  /* ---- New Game ---- */
  startNewGame(world) {
    this.state.world = world;
    this.state.playerName = "";
    this.state.playerGender = "女";
    this.state.playerColor = "red";
    this.state.currentCase = null;
    this.state.currentScene = null;
    this.state.currentTime = "dawn";
    this.state.discoveredClues = [];
    this.state.spokenFlags = {};
    this.state.totalClues = 0;
    this.state.dayCount = 1;
    this.state.endingReached = null;
    this.state.screen = "prologue";
    UI.showPrologue();
  },

  /* ---- Flow Handlers ---- */
  onPrologueDone() {
    this.state.prologueSeen = true;
    this.state.screen = "creation";
    UI.showCreation();
  },

  onCreateDone(name, gender, color) {
    this.state.playerName = name || "无名";
    this.state.playerGender = gender;
    this.state.playerColor = color;
    this.state.screen = "opening";
    Save.save(this.state);
    UI.showOpening1();
  },

  onOpeningDone() {
    this.state.openingSeen = true;
    var c = this.state.world === "ancient" ? this.cases["ancient_case_001"] : null;
    if (c) this.enterCase(c);
  },

  /* ---- Case Entry ---- */
  enterCase(caseData) {
    this.state.currentCase = caseData.id;
    this.state.currentScene = caseData.startScene;
    this.state.currentTime = caseData.startTime || "dawn";
    this.state.discoveredClues = [];
    this.state.spokenFlags = {};
    this.state.totalClues = (caseData.clues || []).length;
    this.state.dayCount = 1;
    this.state.screen = "playing";
    Save.save(this.state);
    UI.renderScene(caseData);
  },

  /* ---- Scene Navigation ---- */
  goToScene(sceneId) {
    var c = this.getCurrentCase();
    if (!c || !c.scenes[sceneId]) return;
    this.state.currentScene = sceneId;
    Save.save(this.state);
    var cd = this.getCurrentCase();
    UI.renderScene(cd);
  },

  /* ---- Time System ---- */
  advanceTime() {
    var order = ["dawn","noon","evening","night"];
    var i = order.indexOf(this.state.currentTime);
    if (i < order.length - 1) {
      this.state.currentTime = order[i+1];
      Save.save(this.state);
      var c = this.getCurrentCase();
      UI.renderScene(c);
      UI.addNarration("天色渐晚，已是" + this.getTimeLabel(this.state.currentTime) + "。");
      if (this.state.currentTime === "night") {
        UI.addNarration("天色已深，该回衙门整理今日所得了。");
        setTimeout(function() { UI.askReturnToDesk(); }, 1500);
      }
    } else {
      // Already night — advance to next day
      this.state.currentTime = "dawn";
      this.state.dayCount++;
      Save.save(this.state);
      var c = this.getCurrentCase();
      UI.renderScene(c);
      UI.addNarration("一夜过去，新的一天开始了。这是案发后第" + this.state.dayCount + "天。");
    }
  },

  setTime(t) {
    if (["dawn","noon","evening","night"].indexOf(t) >= 0) {
      this.state.currentTime = t;
      Save.save(this.state);
      var c = this.getCurrentCase();
      UI.renderScene(c);
    }
  },

  /* ---- Clue System ---- */
  addClue(clueId) {
    if (this.state.discoveredClues.indexOf(clueId) >= 0) return;
    this.state.discoveredClues.push(clueId);
    UI.addSystem("【获得线索】已记录到案卷中。");
    Save.save(this.state);
    var c = this.getCurrentCase();
    if (c && c.checkEnding) c.checkEnding(this.state, this);
  },

  hasClue(clueId) {
    return this.state.discoveredClues.indexOf(clueId) >= 0;
  },

  /* ---- Dialogue Flag ---- */
  markSpoken(npcId, topic) {
    if (!this.state.spokenFlags[npcId]) this.state.spokenFlags[npcId] = [];
    if (this.state.spokenFlags[npcId].indexOf(topic) < 0) {
      this.state.spokenFlags[npcId].push(topic);
    }
  },

  hasSpoken(npcId, topic) {
    return (this.state.spokenFlags[npcId] || []).indexOf(topic) >= 0;
  },

  /* ---- Getters ---- */
  getCurrentCase() {
    return this.cases[this.state.currentCase];
  },

  getSceneData() {
    var c = this.getCurrentCase();
    if (!c) return null;
    var s = c.scenes[this.state.currentScene];
    if (!s) return null;
    return (s.times && s.times[this.state.currentTime]) ? s.times[this.state.currentTime] : s;
  },

  getNPCData(npcId) {
    var c = this.getCurrentCase();
    return (c && c.npcs) ? c.npcs[npcId] : null;
  },

  getTimeLabel(t) {
    return { dawn:"清晨", noon:"午间", evening:"傍晚", night:"深夜" }[t] || t;
  },

  getSceneName(sceneId) {
    var c = this.getCurrentCase();
    return (c && c.scenes[sceneId]) ? c.scenes[sceneId].name : sceneId;
  },

  getSceneImageKey(sceneId) {
    // Map scene IDs to folder image name prefixes
    var map = {
      weaver_shop_interior: "绸缎店",
      weaver_shop_street: "街道",
      jail: "地牢",
      pawn_street: "当铺",
      desk: "家"
    };
    return map[sceneId] || sceneId;
  },

  getTimeImageKey(time) {
    var map = { dawn: "清晨", noon: "中午", evening: "下午", night: "下午" };
    return map[time] || time;
  },

  getSceneBg(sceneId, time) {
    // Scenes that only have a single image (no time variants)
    var singleImageScenes = { desk: "家" };
    if (singleImageScenes[sceneId]) {
      return "tu/" + singleImageScenes[sceneId] + ".png";
    }
    var si = this.getSceneImageKey(sceneId);
    var ti = this.getTimeImageKey(time);
    return "tu/" + si + "-" + ti + ".png";
  },

  /* ---- Player Portrait ---- */
  getPlayerPortrait(expression) {
    var g = this.state.playerGender || "女";
    var c = this.state.playerColor || "red";
    var cs = c === "red" ? "" : (c === "blue" ? "-蓝色" : "-绿色");
    var exp = expression || "正常";
    return "tu/" + g + "官-" + exp + cs + ".png";
  },

  /* ---- Register ---- */
  registerCase(id, data) {
    this.cases[id] = data;
  }
};

window.Game = Game;
