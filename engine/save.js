/* ============================================================
   save.js — 存档系统（localStorage）
   ============================================================ */
var SAVE_KEY = "suyizong_save_v2";

var Save = {
  save: function(state) {
    try {
      var data = {
        version: 2,
        timestamp: Date.now(),
        world: state.world,
        playerName: state.playerName,
        playerGender: state.playerGender,
        playerColor: state.playerColor,
        currentCase: state.currentCase,
        currentScene: state.currentScene,
        currentTime: state.currentTime,
        discoveredClues: state.discoveredClues,
        spokenFlags: state.spokenFlags,
        totalClues: state.totalClues,
        dayCount: state.dayCount,
        prologueSeen: state.prologueSeen,
        openingSeen: state.openingSeen,
        endingReached: state.endingReached,
        screen: state.screen
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch(e) {
      // localStorage unavailable (file:// in some browsers)
      try { sessionStorage.setItem(SAVE_KEY, JSON.stringify(data)); return true; } catch(e2) { return false; }
    }
  },

  load: function() {
    try {
      var raw = localStorage.getItem(SAVE_KEY) || sessionStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== 2) return null;
      return data;
    } catch(e) { return null; }
  },

  hasSave: function() {
    try {
      return !!(localStorage.getItem(SAVE_KEY) || sessionStorage.getItem(SAVE_KEY));
    } catch(e) { return false; }
  },

  delete: function() {
    try {
      localStorage.removeItem(SAVE_KEY);
      sessionStorage.removeItem(SAVE_KEY);
    } catch(e) {}
  }
};

window.Save = Save;
