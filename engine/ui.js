/* ============================================================
   ui.js — 全部界面渲染
   封面 / 世界观选择 / 序幕 / 捏人 / 开场 / 场景 / 对话 / 案卷 / 结局
   ============================================================ */
var UI = {

  /* =============================================================
     COVER SCREEN — 男女官封面图 3秒交替
     ============================================================= */
  _coverTimer: null,

  showCover: function() {
    if (this._coverTimer) clearInterval(this._coverTimer);
    var app = document.getElementById("app");
    app.innerHTML =
      '<div class="cover-screen" id="cover">' +
        '<div class="cover-bg active" style="background-image:url(tu/标题-女官.png)"></div>' +
        '<div class="cover-bg" style="background-image:url(tu/标题-男官.png)"></div>' +
        '<div class="cover-overlay"></div>' +
        '<div class="cover-content">' +
          '<h1 class="game-title">溯疑踪</h1>' +
          '<p class="game-subtitle">双世奇案 · 由你执笔</p>' +
          '<button class="ani-btn" onclick="UI.showWorldSelect()">进入游戏</button>' +
          '<button class="ani-btn' + (Save.hasSave() ? '' : ' disabled') + '" id="cbtn" onclick="UI.continueGame()">继续游戏</button>' +
        '</div>' +
      '</div>';
    // Alternating backgrounds
    var alt = 0;
    var self = this;
    this._coverTimer = setInterval(function() {
      alt = 1 - alt;
      var bgs = document.querySelectorAll("#cover .cover-bg");
      for (var i = 0; i < bgs.length; i++) {
        bgs[i].classList.toggle("active", i === alt);
      }
    }, 3000);
  },

  continueGame: function() {
    if (!Save.hasSave()) return;
    var s = Save.load();
    if (s) {
      Object.assign(Game.state, s);
      if (Game.state.screen === "playing") {
        var c = Game.getCurrentCase();
        if (c) { UI.renderScene(c); return; }
      }
    }
    UI.showCover();
  },

  /* =============================================================
     WORLDVIEW SELECTION — 男女版背景交替
     ============================================================= */
  _wsTimer: null,

  showWorldSelect: function() {
    if (this._coverTimer) clearInterval(this._coverTimer);
    if (this._wsTimer) clearInterval(this._wsTimer);
    var app = document.getElementById("app");
    app.innerHTML =
      '<div class="world-select-screen" id="ws">' +
        '<div class="ws-bg active" style="background-image:url(tu/选择世界观-女版.png)"></div>' +
        '<div class="ws-bg" style="background-image:url(tu/选择世界观-男版.png)"></div>' +
        '<div class="cover-overlay"></div>' +
        '<div class="ws-content">' +
          '<h2 class="ws-title">选择你的时代</h2>' +
          '<button class="ani-btn" onclick="UI.selectWorld(\'ancient\')">古代·大理寺卿</button>' +
          '<button class="ani-btn" onclick="UI.selectWorld(\'modern\')">现代·特案组警察</button>' +
          '<button class="ani-btn back-btn" onclick="UI.showCover()">返回</button>' +
        '</div>' +
      '</div>';
    var alt = 0;
    var self = this;
    this._wsTimer = setInterval(function() {
      alt = 1 - alt;
      var bgs = document.querySelectorAll("#ws .ws-bg");
      for (var i = 0; i < bgs.length; i++) {
        bgs[i].classList.toggle("active", i === alt);
      }
    }, 3000);
  },

  selectWorld: function(world) {
    if (world === "modern") {
      this.addNarration("现代篇正在开发中，先体验古代篇吧！");
      setTimeout(function() { Game.startNewGame("ancient"); }, 1200);
    } else {
      Game.startNewGame(world);
    }
  },

  /* =============================================================
     PROLOGUE — 旁白框 + 逐行文字 + 可点击加速
     ============================================================= */
  showPrologue: function() {
    var lines = [
      "大燕王朝，建元三年。天下初定，百废待兴。",
      "你，寒门出身，凭科举入仕，本在地方为官。",
      "三年前一桩连环命案震动朝野，无人敢接。",
      "你毛遂自荐，七日内告破，天子亲批「断案如神」。",
      "自此，你被破格擢升为大理寺卿，执掌天下刑狱。",
      "上任不过半月，案牍尚未来得及整理，",
      "新的案子……就递到了你的案前。"
    ];
    var app = document.getElementById("app");
    app.innerHTML =
      '<div class="prologue-screen" id="ps">' +
        '<div class="prologue-box">' +
          '<img src="tu/旁白文本框.jpeg">' +
          '<div class="prologue-inner" id="pli"></div>' +
        '</div>' +
      '</div>';
    var inner = document.getElementById("pli");
    var idx = 0;
    var self = this;

    function showNext() {
      if (idx >= lines.length) {
        var hint = document.createElement("div");
        hint.className = "prologue-hint show";
        hint.textContent = "— 点击继续 —";
        hint.onclick = function() { Game.onPrologueDone(); };
        inner.appendChild(hint);
        return;
      }
      var el = document.createElement("div");
      el.className = "prologue-line";
      el.textContent = lines[idx];
      inner.appendChild(el);
      idx++;
      setTimeout(function() { el.classList.add("show"); }, 30);
    }

    showNext();
    // Click to advance or skip
    document.getElementById("ps").onclick = function() {
      if (idx >= lines.length) {
        Game.onPrologueDone();
      } else {
        // Show all remaining lines at once
        while (idx < lines.length) {
          var el2 = document.createElement("div");
          el2.className = "prologue-line show";
          el2.textContent = lines[idx];
          inner.appendChild(el2);
          idx++;
        }
        var hint2 = document.createElement("div");
        hint2.className = "prologue-hint show";
        hint2.textContent = "— 点击继续 —";
        hint2.onclick = function(e) { e.stopPropagation(); Game.onPrologueDone(); };
        inner.appendChild(hint2);
      }
    };
  },

  /* =============================================================
     CHARACTER CREATION — 家背景 + 性别 + 衣色
     ============================================================= */
  showCreation: function() {
    var app = document.getElementById("app");
    app.innerHTML =
      '<div class="creation-screen" id="cs">' +
        '<div class="creation-preview">' +
          '<img id="preview-img" src="tu/女官-正常.png">' +
        '</div>' +
        '<div class="creation-options">' +
          '<div class="opt-group">' +
            '<label>姓名</label>' +
            '<input class="creation-input" id="cname" placeholder="输入你的名字" maxlength="8">' +
          '</div>' +
          '<div class="opt-group">' +
            '<label>性别</label>' +
            '<div class="opt-row">' +
              '<button class="opt-btn sel" data-g="gender" data-v="女" onclick="UI.selectCOption(this)">女</button>' +
              '<button class="opt-btn" data-g="gender" data-v="男" onclick="UI.selectCOption(this)">男</button>' +
            '</div>' +
          '</div>' +
          '<div class="opt-group">' +
            '<label>衣色</label>' +
            '<div class="opt-row">' +
              '<button class="opt-btn sel" data-g="color" data-v="red" onclick="UI.selectCOption(this)">红色</button>' +
              '<button class="opt-btn" data-g="color" data-v="blue" onclick="UI.selectCOption(this)">蓝色</button>' +
              '<button class="opt-btn" data-g="color" data-v="green" onclick="UI.selectCOption(this)">绿色</button>' +
            '</div>' +
          '</div>' +
          '<button class="ani-btn creation-confirm" onclick="UI.confirmCreation()">确认创建</button>' +
        '</div>' +
      '</div>';
  },

  selectCOption: function(btn) {
    var group = btn.getAttribute("data-g");
    var btns = document.querySelectorAll("[data-g='" + group + "']");
    for (var i = 0; i < btns.length; i++) { btns[i].classList.remove("sel"); }
    btn.classList.add("sel");
    // Update preview
    var gender = (document.querySelector("[data-g=gender].sel") || {}).getAttribute("data-v") || "女";
    var color = (document.querySelector("[data-g=color].sel") || {}).getAttribute("data-v") || "red";
    var cs = color === "red" ? "" : (color === "blue" ? "-蓝色" : "-绿色");
    var preview = document.getElementById("preview-img");
    if (preview) preview.src = "tu/" + gender + "官-正常" + cs + ".png";
  },

  confirmCreation: function() {
    var name = (document.getElementById("cname") || {}).value || "";
    name = name.trim() || "无名";
    var gender = (document.querySelector("[data-g=gender].sel") || {}).getAttribute("data-v") || "女";
    var color = (document.querySelector("[data-g=color].sel") || {}).getAttribute("data-v") || "red";
    Game.onCreateDone(name, gender, color);
  },

  /* =============================================================
     OPENING ANIMATION — Part 1: 衙门外 + 老周哭诉
     ============================================================= */
  showOpening1: function() {
    var app = document.getElementById("app");
    app.innerHTML =
      '<div class="opening-screen" style="background-image:url(tu/衙门外背景.png)" onclick="UI.showOpening2()">' +
        '<div class="opening-stage">' +
          '<img class="opening-npc-img" src="tu/老周-哭泣.png">' +
        '</div>' +
        '<div class="opening-text-box">' +
          '<img src="tu/人物对话框.jpeg">' +
          '<div class="opening-text-inner">大人！您可得为我做主啊！<br>昨夜我的绸缎庄被人砸了！<br>那赵三喝醉了酒，冲到铺子里来闹事！</div>' +
        '</div>' +
        '<div class="opening-hint">点击继续</div>' +
      '</div>';
  },

  /* Opening Part 2: 衙门内 + 老周递案 */
  showOpening2: function() {
    var app = document.getElementById("app");
    app.innerHTML =
      '<div class="opening-screen" style="background-image:url(tu/衙门内背景.png)" onclick="Game.onOpeningDone()">' +
        '<div class="opening-stage">' +
          '<img class="opening-npc-img" src="tu/老周-哭泣.png">' +
        '</div>' +
        '<div class="opening-text-box">' +
          '<img src="tu/人物对话框.jpeg">' +
          '<div class="opening-text-inner">大人，这是案情的详细情况。<br>铺子被砸得一塌糊涂，值钱的料子全毁了。<br>您一定要替小人做主啊！</div>' +
        '</div>' +
        '<div class="opening-hint">点击接案</div>' +
      '</div>';
  },

  /* =============================================================
     MAIN GAME SCENE
     ============================================================= */
  renderScene: function(cd) {
    this._clearTimers();
    var sd = Game.getSceneData();
    if (!sd) return;

    var sceneName = (cd.scenes[Game.state.currentScene] || {}).name || "";
    var timeLabel = Game.getTimeLabel(Game.state.currentTime);
    var bgPath = Game.getSceneBg(Game.state.currentScene, Game.state.currentTime);
    var clueStr = Game.state.discoveredClues.length + "/" + Game.state.totalClues;

    var app = document.getElementById("app");
    // Build top bar
    var topBar =
      '<div id="top-bar">' +
        '<span class="tb-world">[古]</span>' +
        '<span class="tb-time">' + timeLabel + '</span>' +
        '<span class="tb-scene">' + sceneName + '</span>' +
        '<span class="tb-clues">线索 ' + clueStr + '</span>' +
        '<button class="tb-btn" onclick="UI.toggleCasePanel()">案卷</button>' +
        '<button class="tb-btn" onclick="Game.advanceTime()">切换时辰</button>' +
        '<button class="tb-btn" onclick="UI.showLocationPanel()">地点</button>' +
      '</div>';

    // Build scene viewport
    var sceneView =
      '<div id="scene-view">' +
        '<div id="scene-bg" style="background-image:url(' + bgPath + ');background-size:cover;background-position:center;"></div>' +
        '<div class="corner-tl"></div><div class="corner-tr"></div>' +
        '<div class="corner-bl"></div><div class="corner-br"></div>' +
        this._buildHotspots(sd) +
        this._buildNPCs(sd) +
        this._buildExits(sd) +
      '</div>';

    // Build text area
    var textArea =
      '<div id="text-area">' +
        '<div class="text-line narration">' +
          '<span class="tl-msg">' + (sd.description || "...") + '</span>' +
        '</div>' +
      '</div>';

    // Build input area
    var quickBar = this._buildQuickBar(sd);
    var inputArea =
      '<div id="input-area">' +
        '<div id="quick-bar">' + quickBar + '</div>' +
        '<div id="input-row">' +
          '<input id="chat-input" type="text" placeholder="输入你想说的话或做的事……" onkeydown="if(event.key===\'Enter\')UI.sendInput()">' +
          '<button id="send-btn" onclick="UI.sendInput()">确认</button>' +
        '</div>' +
      '</div>';

    app.innerHTML = topBar + sceneView + textArea + inputArea + '<div id="case-panel"></div>';

    // Focus input
    setTimeout(function() {
      var inp = document.getElementById("chat-input");
      if (inp) inp.focus();
    }, 200);

    // Show NPC name cards with auto-hide
    this._showNPCCards(sd);
  },

  /* ---- Build hotspot HTML ---- */
  _buildHotspots: function(sd) {
    var items = sd.interactables || [];
    if (items.length === 0) return "";
    return items.map(function(item) {
      return '<div class="scene-hotspot" style="left:' + item.x + '%;top:' + item.y +
        '%;width:' + item.w + '%;height:' + item.h +
        '%;" onclick="Input.handle({intent:\'examine\',target:\'' + (item.name || item.label) + '\'})">' +
        '<span class="hs-label">' + item.label + '</span></div>';
    }).join("");
  },

  /* ---- Build NPC HTML on scene ---- */
  _buildNPCs: function(sd) {
    var npcs = sd.npcs || [];
    if (npcs.length === 0) return "";
    var portraitMap = {
      "老周": "老周-正常", "阿福": "阿福-正常",
      "赵三": "赵三-正常", "打更老王": "打更老王-正常"
    };
    return npcs.map(function(npc) {
      var src = portraitMap[npc.label];
      if (!src) return "";
      return '<img class="scene-npc" src="tu/' + src + '.png" ' +
        'style="left:' + Math.max(0, npc.x - 3) + '%;top:' + Math.max(0, npc.y - 3) +
        '%;width:' + (npc.w * 1.8) + '%;max-width:140px;height:auto;" ' +
        'onclick="UI.startDialogue(\'' + npc.label + '\')" ' +
        'title="' + npc.label + '">';
    }).join("");
  },

  /* ---- Build exit markers ---- */
  _buildExits: function(sd) {
    var exits = sd.exits || [];
    if (exits.length === 0) return "";
    return exits.map(function(ex) {
      return '<div class="scene-hotspot" style="left:' + ex.x + '%;top:' + ex.y +
        '%;width:' + ex.w + '%;height:' + ex.h +
        '%;border-color:rgba(100,180,100,0.3);" onclick="Input.handle({intent:\'goto\',target:\'' + (ex.label) + '\'})">' +
        '<span class="hs-label" style="color:#8ab88a;">' + ex.label + '</span></div>';
    }).join("");
  },

  /* ---- NPC Name Cards ---- */
  _showNPCCards: function(sd) {
    var npcs = sd.npcs || [];
    if (npcs.length === 0) return;
    var sv = document.getElementById("scene-view");
    if (!sv) return;

    var titleMap = {
      "老周": "绸缎庄掌柜", "阿福": "小伙计",
      "赵三": "街上的酒鬼", "打更老王": "更夫",
      "当铺掌柜": "当铺掌柜"
    };

    for (var i = 0; i < npcs.length; i++) {
      var npc = npcs[i];
      var nc = document.createElement("div");
      nc.className = "name-card";
      nc.innerHTML =
        '<img src="tu/人物名字身份介绍框.jpeg">' +
        '<div class="nc-text">' + npc.label + '<br>' + (titleMap[npc.label] || "") + '</div>';
      nc.style.cssText = "left:" + (npc.x + npc.w/2 - 8) + "%;top:" + Math.max(2, npc.y - 22) + "%;";
      sv.appendChild(nc);
      // Show then hide after 3s
      (function(card) {
        setTimeout(function() { card.classList.add("show"); }, 50);
        setTimeout(function() { card.classList.remove("show"); }, 3000);
      })(nc);
    }
  },

  /* ---- Quick action bar ---- */
  _buildQuickBar: function(sd) {
    var chips = [];
    // Examine shortcuts
    var items = sd.interactables || [];
    for (var i = 0; i < Math.min(items.length, 3); i++) {
      chips.push('<button class="quick-chip" onclick="Input.handle({intent:\'examine\',target:\'' +
        (items[i].name || items[i].label) + '\'})">查看' + items[i].label + '</button>');
    }
    // Talk shortcuts
    var npcs = sd.npcs || [];
    for (var j = 0; j < Math.min(npcs.length, 3); j++) {
      chips.push('<button class="quick-chip" onclick="UI.startDialogue(\'' + npcs[j].label + '\')">' +
        npcs[j].label + '</button>');
    }
    // Time chip
    chips.push('<button class="quick-chip" onclick="Game.advanceTime()">下一时辰</button>');
    // Desk shortcut
    if (Game.state.currentScene !== "desk") {
      chips.push('<button class="quick-chip" onclick="Game.goToScene(\'desk\')">回案桌</button>');
    }
    return chips.join("");
  },

  /* ---- Send input from main game ---- */
  sendInput: function() {
    var inp = document.getElementById("chat-input");
    if (!inp || !inp.value.trim()) return;
    var text = inp.value.trim();
    inp.value = "";
    UI.addPlayerAction(text);
    var result = Input.parse(text);
    Input.handle(result);
  },

  /* =============================================================
     DIALOGUE MODE — click NPC, 双人立绘 + 自由对话
     ============================================================= */
  _dlgNPC: null,

  startDialogue: function(npcLabel) {
    // Find NPC data
    var cd = Game.getCurrentCase();
    if (!cd) return;
    var npcEntry = null;
    var sd = Game.getSceneData();
    if (sd && sd.npcs) {
      for (var i = 0; i < sd.npcs.length; i++) {
        if (sd.npcs[i].label === npcLabel) { npcEntry = sd.npcs[i]; break; }
      }
    }
    var npcData = cd.npcs ? cd.npcs[(npcEntry || {}).name] : null;
    if (!npcData) return;

    this._dlgNPC = { entry: npcEntry, data: npcData, label: npcLabel };

    // NPC portrait
    var portraitMap = { "老周":"老周-正常", "阿福":"阿福-正常", "赵三":"赵三-正常", "打更老王":"打更老王-正常" };
    var npcSrc = portraitMap[npcLabel] || "";
    var npcImg = npcSrc ? "tu/" + npcSrc + ".png" : "";
    // Player portrait
    var playerImg = Game.getPlayerPortrait("正常");

    var app = document.getElementById("app");
    var ov = document.createElement("div");
    ov.className = "dlg-overlay";
    ov.id = "dlg-overlay";

    // Exit button
    var eb = document.createElement("button");
    eb.className = "dlg-exit";
    eb.textContent = "← 退出对话";
    eb.onclick = function() { ov.remove(); UI.renderScene(Game.getCurrentCase()); };
    ov.appendChild(eb);

    // Stage with portraits
    var stg = document.createElement("div");
    stg.className = "dlg-stage";
    // NPC side
    var nb = document.createElement("div");
    nb.className = "dlg-portrait-box npc-side";
    nb.id = "dnb";
    if (npcImg) { var ni = document.createElement("img"); ni.className = "dlg-portrait-img"; ni.src = npcImg; nb.appendChild(ni); }
    var nn = document.createElement("div"); nn.className = "dlg-portrait-name"; nn.textContent = npcLabel; nb.appendChild(nn);
    stg.appendChild(nb);
    // Player side
    var pb = document.createElement("div");
    pb.className = "dlg-portrait-box player-side";
    pb.id = "dpb";
    var pi = document.createElement("img"); pi.className = "dlg-portrait-img"; pi.src = playerImg; pb.appendChild(pi);
    var pn = document.createElement("div"); pn.className = "dlg-portrait-name"; pn.textContent = Game.state.playerName; pb.appendChild(pn);
    stg.appendChild(pb);
    ov.appendChild(stg);

    // Chat area
    var chat = document.createElement("div");
    chat.className = "dlg-chat-area";
    chat.id = "dlg-chat";
    // Initial NPC greeting
    var initText = npcData.defaultDialogue || "……";
    var msg = document.createElement("div");
    msg.className = "dlg-msg";
    msg.innerHTML = '<span class="w">' + npcLabel + "：</span>" + initText;
    chat.appendChild(msg);
    ov.appendChild(chat);

    // Input
    var inpDiv = document.createElement("div");
    inpDiv.className = "dlg-input-row";
    var inp = document.createElement("input");
    inp.id = "dlg-input";
    inp.placeholder = "输入你想说的话……";
    inp.onkeydown = function(e) { if (e.key === "Enter") UI.sendDlgMessage(); };
    inpDiv.appendChild(inp);
    var btn = document.createElement("button");
    btn.textContent = "说话";
    btn.onclick = function() { UI.sendDlgMessage(); };
    inpDiv.appendChild(btn);
    ov.appendChild(inpDiv);

    app.appendChild(ov);

    // Animate in
    setTimeout(function() {
      var dn = document.getElementById("dnb");
      var dp = document.getElementById("dpb");
      var di = document.getElementById("dlg-input");
      if (dn) dn.classList.add("show");
      if (dp) dp.classList.add("show");
      if (di) di.focus();
    }, 80);
  },

  sendDlgMessage: function() {
    var inp = document.getElementById("dlg-input");
    if (!inp || !inp.value.trim()) return;
    var text = inp.value.trim();
    inp.value = "";
    var chat = document.getElementById("dlg-chat");
    if (!chat) return;

    // Add player message
    var pm = document.createElement("div");
    pm.className = "dlg-msg me";
    pm.innerHTML = '<span class="w">' + Game.state.playerName + "：</span>" + text;
    chat.appendChild(pm);
    chat.scrollTop = chat.scrollHeight;

    // Get NPC response via keyword matching
    var self = this;
    var dlg = this._dlgNPC;
    if (!dlg) return;

    setTimeout(function() {
      var sd = Game.getSceneData();
      var cd = Game.getCurrentCase();
      var topic = Input.extractTopic(text, dlg.entry || { label: dlg.label, aliases: [] });
      var response = Input.getNPCResponse(dlg.entry, dlg.data, topic, sd, cd);
      Game.markSpoken((dlg.entry || {}).name || dlg.label, topic);

      var rm = document.createElement("div");
      rm.className = "dlg-msg";
      rm.innerHTML = '<span class="w">' + dlg.label + "：</span>" + (response.text || "……");
      chat.appendChild(rm);
      chat.scrollTop = chat.scrollHeight;

      // Check for clue
      if (response.clueId && !Game.hasClue(response.clueId)) {
        setTimeout(function() { Game.addClue(response.clueId); }, 600);
      }

      // Focus input
      var di = document.getElementById("dlg-input");
      if (di) di.focus();
    }, 400);
  },

  /* =============================================================
     CASE PANEL (slide from right)
     ============================================================= */
  toggleCasePanel: function() {
    var p = document.getElementById("case-panel");
    if (!p) return;
    if (p.classList.contains("open")) {
      p.classList.remove("open");
      return;
    }
    var cd = Game.getCurrentCase();
    if (!cd) return;
    var clueHtml = "";
    var clues = cd.clues || [];
    for (var i = 0; i < clues.length; i++) {
      var found = Game.state.discoveredClues.indexOf(clues[i].id) >= 0;
      clueHtml += '<div class="case-item' + (found ? " found" : "") + '">' +
        '<span class="ci-mark">' + (found ? "✓" : "?") + '</span> ' + clues[i].name +
        (found ? '<br><small style="color:#8b7355;margin-left:18px;">' + (clues[i].desc || "") + '</small>' : "") +
        '</div>';
    }
    var charHtml = "";
    var npcs = cd.npcs || {};
    for (var key in npcs) {
      if (!npcs.hasOwnProperty(key)) continue;
      var ch = npcs[key];
      charHtml += '<div class="case-item">' + ch.name + ' — ' + ch.role + '</div>';
    }
    p.innerHTML =
      '<h3>案卷 · ' + cd.title + '</h3>' +
      '<div class="case-section"><h4>线索 (' + Game.state.discoveredClues.length + '/' + Game.state.totalClues + ')</h4>' + clueHtml + '</div>' +
      '<div class="case-section"><h4>人物</h4>' + charHtml + '</div>';
    p.classList.add("open");
  },

  /* =============================================================
     LOCATION PANEL
     ============================================================= */
  showLocationPanel: function() {
    // Remove existing
    var existing = document.querySelector(".loc-panel");
    if (existing) { existing.remove(); return; }
    var cd = Game.getCurrentCase();
    if (!cd || !cd.scenes) return;
    var scenes = cd.scenes;
    var current = Game.state.currentScene;
    var items = "";
    for (var key in scenes) {
      if (!scenes.hasOwnProperty(key)) continue;
      if (key === current) continue;
      items += '<div class="loc-item" onclick="Game.goToScene(\'' + key +
        '\');var lp=document.querySelector(\'.loc-panel\');if(lp)lp.remove();">' +
        scenes[key].name + '</div>';
    }
    if (!items) { UI.addSystem("没有其他可去的地方。"); return; }
    var panel = document.createElement("div");
    panel.className = "loc-panel";
    panel.innerHTML = '<h4 style="color:#c9a96e;margin-bottom:8px;letter-spacing:2px;">可前往</h4>' + items;
    document.getElementById("app").appendChild(panel);
  },

  /* =============================================================
     DESK SCENE — ask player to return to desk
     ============================================================= */
  askReturnToDesk: function() {
    var app = document.getElementById("app");
    var ov = document.createElement("div");
    ov.style.cssText = "position:absolute;inset:0;z-index:35;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);animation:fadeIn 0.4s;";
    ov.innerHTML =
      '<div style="text-align:center;">' +
        '<p style="color:#c9a96e;font-size:18px;margin-bottom:16px;">天色已深</p>' +
        '<p style="color:#b0aca0;margin-bottom:20px;">该回大理寺案桌前整理今日线索，进行推理了。</p>' +
        '<button class="ani-btn" style="display:inline-block;" onclick="this.parentElement.parentElement.remove();Game.goToScene(\'desk\')">回案桌</button>' +
        '<button class="ani-btn back-btn" style="display:inline-block;margin-left:12px;" onclick="this.parentElement.parentElement.remove();UI.addNarration(\'你决定继续留在这里。\')">继续在此</button>' +
      '</div>';
    app.appendChild(ov);
  },

  /* =============================================================
     ENDING CHOICES
     ============================================================= */
  showEndingChoice: function(opts) {
    opts = opts || {};
    var app = document.getElementById("app");
    var ov = document.createElement("div");
    ov.className = "ending-overlay";
    if (opts.incomplete) {
      ov.innerHTML =
        '<h2>线索尚不完整</h2>' +
        '<p>证据还不够充足。直接定案有风险，可能会冤枉好人。但如果你坚持……</p>' +
        '<button class="ani-btn" style="margin:6px;" onclick="this.parentElement.remove();UI.addNarration(\'你决定继续调查。\')">继续调查</button>' +
        '<button class="ani-btn back-btn" style="margin:6px;filter:brightness(0.6) hue-rotate(-20deg);" onclick="UI.executeEnding(\'wrong\')">强行定案</button>';
    } else {
      ov.innerHTML =
        '<h2>真相已浮出水面</h2>' +
        '<p>所有证据都指向老周——绸缎庄掌柜。自导自演，砸了自己的铺子，嫁祸给赵三。你打算怎么做？</p>' +
        '<button class="ani-btn" style="margin:6px;" onclick="this.parentElement.remove();UI.executeEnding(\'trap\')">设局收网</button>' +
        '<button class="ani-btn back-btn" style="margin:6px;" onclick="UI.executeEnding(\'direct\')">直接拿下</button>';
    }
    app.appendChild(ov);
  },

  executeEnding: function(type) {
    // Remove ending overlay
    var o = document.querySelector(".ending-overlay");
    if (o) o.remove();
    Game.state.screen = "ending";
    Game.state.endingReached = type;
    Save.save(Game.state);

    var txt = "";
    if (type === "trap") {
      txt = "你放出消息：赵三因证据不足，无罪释放。当晚，老周果然悄悄返回铺子，撬开后院的地砖——取出藏匿的银两。\n\n埋伏在暗处的衙役一拥而上，人赃并获。\n\n公堂之上，铁证如山：断裂的门栓、钥匙的开锁声、当铺的出入记录、账本的借款——再加上现场抓获。老周终于低头认罪。\n\n原来他赌博欠了巨债，从铺子账上借了「急用」钱，去当铺当了又赎、赎了又当。眼看窟窿越来越大，他动了一个歪心思——砸了自己的铺子，嫁祸给赵三。\n\n赵三当堂释放。\n\n他走出牢房的那一刻，阳光正好。\n\n【结局：设局收网 · 完胜】";
    } else if (type === "direct") {
      txt = "你带着全部证据，直接前往绸缎庄拿人。老周起初极力抵赖，但当你在后院挖出那包藏匿的银两时，他哑口无言。\n\n账本、当铺记录、门栓的痕迹——每一条都指向了他。\n\n案子结了。赵三被释放，老周被押入大牢。\n\n但你总觉得，少了点什么。或许让他自己露出马脚，会更有说服力。\n\n【结局：直接拿下 · 结案】";
    } else if (type === "wrong") {
      txt = "你决定不再拖延，直接定案。\n\n赵三被杖责二十，赔偿铺子损失五十两——他哪里拿得出这笔钱。\n\n一个月后，有人在隔壁县城看到了老周。他在那里新开了一家绸缎庄，出手阔绰，身边还多了两个伙计。\n\n有人问起，他笑着说：「大理寺那位大人，还得谢谢他呢。」\n\n【结局：冤案 · 真凶逍遥法外】";
    }
    UI.addNarration(txt);

    setTimeout(function() {
      var app = document.getElementById("app");
      var div = document.createElement("div");
      div.style.cssText = "text-align:center;padding:20px;";
      div.innerHTML = '<button class="ani-btn" onclick="Save.delete();Game.init()">返回主菜单</button>';
      app.appendChild(div);
    }, 2000);
  },

  /* =============================================================
     TEXT OUTPUT HELPERS
     ============================================================= */
  addNarration: function(text) {
    var ta = document.getElementById("text-area");
    if (!ta) return;
    var el = document.createElement("div");
    el.className = "text-line narration";
    el.innerHTML = '<span class="tl-msg">' + text + '</span>';
    ta.appendChild(el);
    ta.scrollTop = ta.scrollHeight;
  },

  addDialogue: function(speaker, text) {
    var ta = document.getElementById("text-area");
    if (!ta) return;
    var el = document.createElement("div");
    el.className = "text-line" + (speaker === "你" ? " player" : " npc");
    // Portrait
    var portraitHtml = "";
    var portraitMap = { "老周":"老周-正常", "阿福":"阿福-正常", "赵三":"赵三-正常", "打更老王":"打更老王-正常" };
    if (speaker !== "你" && portraitMap[speaker]) {
      portraitHtml = '<img class="tl-portrait" src="tu/' + portraitMap[speaker] + '.png">';
    } else if (speaker === "你") {
      portraitHtml = '<img class="tl-portrait" src="' + Game.getPlayerPortrait("正常") + '">';
    }
    el.innerHTML = portraitHtml + '<span class="tl-speaker">' + speaker + '</span><span class="tl-msg">' + text + '</span>';
    ta.appendChild(el);
    ta.scrollTop = ta.scrollHeight;
  },

  addSystem: function(text) {
    var ta = document.getElementById("text-area");
    if (!ta) return;
    var el = document.createElement("div");
    el.className = "text-line system";
    el.innerHTML = '<span class="tl-msg">' + text + '</span>';
    ta.appendChild(el);
    ta.scrollTop = ta.scrollHeight;
  },

  addPlayerAction: function(text) {
    this.addDialogue("你", text);
  },

  /* ---- Cleanup timers ---- */
  _clearTimers: function() {
    if (this._coverTimer) { clearInterval(this._coverTimer); this._coverTimer = null; }
    if (this._wsTimer) { clearInterval(this._wsTimer); this._wsTimer = null; }
  }
};

window.UI = UI;
