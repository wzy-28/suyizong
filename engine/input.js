/* ============================================================
   input.js — 增强关键词匹配引擎
   支持模糊匹配、NPC人设感知、上下文关联、多级匹配
   ============================================================ */
var Input = {

  /* ---- Main Parse ---- */
  parse(text) {
    text = text.trim();
    if (!text) return { intent: "empty" };

    // System commands
    if (text === "存档" || text === "保存") {
      Save.save(Game.state);
      UI.addSystem("游戏已存档。");
      return { intent: "system", cmd: "save" };
    }
    if (text === "读档") {
      var s = Save.load();
      if (s) {
        Object.assign(Game.state, s);
        var c = Game.getCurrentCase();
        if (c) UI.renderScene(c);
        UI.addSystem("已读取存档。");
      } else {
        UI.addSystem("没有找到存档。");
      }
      return { intent: "system", cmd: "load" };
    }
    if (text === "案卷" || text === "线索" || text === "证物") {
      UI.toggleCasePanel();
      return { intent: "system", cmd: "casefile" };
    }
    if (text === "帮助" || text === "怎么玩") {
      UI.addSystem("你可以：查看+物品名（如「查看门栓」）、和NPC对话（如「问老周昨晚的事」）、去+地点（如「去街道」）、切换时辰（输入「下一个时辰」）。");
      return { intent: "help" };
    }
    if (text === "下一个时辰" || text === "推进时间" || text === "等待") {
      Game.advanceTime();
      return { intent: "time" };
    }
    if (text === "回衙门" || text === "回大理寺" || text === "回案桌前") {
      Game.goToScene("desk");
      return { intent: "system", cmd: "goto_desk" };
    }

    // Intent detection
    var intents = [
      { kw: ["查看","检查","观察","看","验","搜","翻","仔细"], intent: "examine" },
      { kw: ["问","说","聊","告诉","和","对话","询问","质问","打听","审问","追问"], intent: "talk" },
      { kw: ["去","走","前往","到","进","出","离开","回"], intent: "goto" },
      { kw: ["拿","取","收集","捡","收","带走"], intent: "take" },
      { kw: ["推理","推断","思考","想","认为","怀疑","判断","推测"], intent: "think" },
      { kw: ["等","等待","待到","待到","推进","切换"], intent: "wait" }
    ];

    for (var ei = 0; ei < intents.length; ei++) {
      var e = intents[ei];
      for (var ki = 0; ki < e.kw.length; ki++) {
        var k = e.kw[ki];
        if (text.indexOf(k) >= 0) {
          var target = text.replace(k, "").replace(/[的了呢吧吗啊呀哦哈嗯着过到]/g, "").trim();
          return { intent: e.intent, target: target, raw: text };
        }
      }
    }

    // Default: treat as free dialogue/question
    return { intent: "talk", target: text, raw: text };
  },

  /* ---- Handle ---- */
  handle(result) {
    var sd = Game.getSceneData();
    var cd = Game.getCurrentCase();
    if (!cd) return;

    switch (result.intent) {
      case "examine": this.handleExamine(result.target, sd); break;
      case "talk":    this.handleTalk(result.target, sd, cd); break;
      case "goto":    this.handleGoto(result.target, sd); break;
      case "take":    this.handleTake(result.target, sd); break;
      case "think":   this.handleThink(result.target); break;
      case "wait":    Game.advanceTime(); break;
      case "help":    break;
      case "system":  break;
      case "empty":   break;
      default:
        UI.addNarration("（你还不确定该怎么做，或许可以先看看周围，或找人问问。）");
    }
  },

  /* ---- Examine ---- */
  handleExamine(target, sd) {
    if (!sd || !sd.interactables || sd.interactables.length === 0) {
      UI.addNarration("这里没有什么特别的值得查看。");
      return;
    }
    if (!target) {
      UI.addNarration("你想查看什么？试试输入「查看」+物品名。");
      return;
    }
    for (var i = 0; i < sd.interactables.length; i++) {
      var item = sd.interactables[i];
      var aliases = item.aliases || [];
      if (this.fuzzyMatch(target, [item.name, item.label].concat(aliases))) {
        UI.addPlayerAction("查看了" + item.label);
        UI.addNarration(item.examineText || "你仔细看了看" + item.label + "，似乎没什么特别的。");
        if (item.clueId) {
          if (!Game.hasClue(item.clueId)) {
            Game.addClue(item.clueId);
          }
        }
        return;
      }
    }
    UI.addNarration("这里没有「" + target + "」可查看。试试看别的东西？");
  },

  /* ---- Talk (handles both NPC dialogue and free questions) ---- */
  handleTalk(target, sd, cd) {
    // If no NPCs present
    if (!sd || !sd.npcs || sd.npcs.length === 0) {
      UI.addNarration("这里没有人可以说话。");
      return;
    }
    // Try to find a matching NPC
    var matchedNPC = null;
    for (var i = 0; i < sd.npcs.length; i++) {
      var npc = sd.npcs[i];
      var aliases = npc.aliases || [];
      if (target && this.fuzzyMatch(target, [npc.label, npc.name].concat(aliases))) {
        matchedNPC = npc;
        break;
      }
    }

    if (!matchedNPC && target && sd.npcs.length === 1) {
      // Only one NPC — assume player means them
      matchedNPC = sd.npcs[0];
    }

    if (!matchedNPC) {
      if (sd.npcs.length === 1) {
        matchedNPC = sd.npcs[0];
      } else {
        var names = sd.npcs.map(function(n) { return n.label; }).join("、");
        UI.addNarration("你想找谁说话？这里有：" + names + "。");
        return;
      }
    }

    // Get NPC data from case definition
    var npcData = cd.npcs ? cd.npcs[matchedNPC.name] : null;
    if (!npcData) {
      UI.addDialogue(matchedNPC.label, "……（沉默）");
      return;
    }

    // Get contextual response
    var topic = this.extractTopic(target || "", matchedNPC);
    var response = this.getNPCResponse(matchedNPC, npcData, topic, sd, cd);

    // Record spoken
    Game.markSpoken(matchedNPC.name, topic);

    // Check for clue reveals
    if (response.clueId && !Game.hasClue(response.clueId)) {
      UI.addDialogue(matchedNPC.label, response.text);
      // Reveal clue after a short delay for dramatic effect
      setTimeout(function() {
        Game.addClue(response.clueId);
      }, 1000);
    } else {
      UI.addDialogue(matchedNPC.label, response.text);
    }
  },

  /* ---- Goto ---- */
  handleGoto(target, sd) {
    if (!sd || !sd.exits || sd.exits.length === 0) {
      UI.addNarration("这里没有别的地方可去。");
      return;
    }
    if (!target) {
      var names = sd.exits.map(function(e) { return e.label; }).join("、");
      UI.addNarration("你想去哪里？可以去：" + names + "。");
      return;
    }
    for (var i = 0; i < sd.exits.length; i++) {
      var ex = sd.exits[i];
      var aliases = ex.aliases || [];
      if (this.fuzzyMatch(target, [ex.label].concat(aliases))) {
        UI.addNarration("你前往了" + ex.label + "。");
        Game.goToScene(ex.target);
        return;
      }
    }
    UI.addNarration("去不了「" + target + "」。试试换个说法？");
  },

  /* ---- Take ---- */
  handleTake(target, sd) {
    if (!sd || !sd.interactables) {
      UI.addNarration("没什么可以拿的。");
      return;
    }
    for (var i = 0; i < sd.interactables.length; i++) {
      var item = sd.interactables[i];
      if (target && this.fuzzyMatch(target, [item.name, item.label].concat(item.aliases || []))) {
        if (item.clueId) {
          UI.addPlayerAction("收起了" + item.label + "作为证物。");
          Game.addClue(item.clueId);
        } else {
          UI.addNarration(item.label + "不是证物，不需要拿走。");
        }
        return;
      }
    }
    UI.addNarration("拿不了「" + target + "」。");
  },

  /* ---- Think / Deduce ---- */
  handleThink(target) {
    var clues = Game.state.discoveredClues;
    if (clues.length === 0) {
      UI.addNarration("你还没有收集到任何线索，无从推理。先去案发现场看看吧。");
      return;
    }
    if (clues.length >= 10) {
      UI.addNarration("线索已经十分充足了，或许该回案桌前整理一下，准备结案。");
      return;
    }
    var msgs = [
      "你把已知的线索在脑子里过了一遍……但还需要更多证据。",
      "你沉思片刻。目前的线索指向了几个方向，但还缺少关键的一环。",
      "你在心里推演着各种可能。真相就藏在那些看似无关的细节之中。"
    ];
    UI.addNarration(msgs[Math.floor(Math.random() * msgs.length)]);
    UI.addNarration("当前线索：" + clues.length + "条。继续查探，也许去不同的时辰会有所发现。");
  },

  /* ================================================================
     KEYWORD MATCHING ENGINE
     ================================================================ */

  /* Fuzzy match: target contains any keyword or alias */
  fuzzyMatch(target, keywords) {
    if (!target) return false;
    target = target.toLowerCase();
    for (var i = 0; i < keywords.length; i++) {
      if (!keywords[i]) continue;
      if (target.indexOf(keywords[i].toLowerCase()) >= 0) return true;
      if (keywords[i].toLowerCase().indexOf(target) >= 0) return true;
    }
    return false;
  },

  /* Extract the topic/subject from player's text */
  extractTopic(text, npc) {
    // Remove the NPC's name/aliases to get the actual question
    var cleaned = text;
    var aliases = (npc.aliases || []).concat([npc.label, npc.name]);
    for (var i = 0; i < aliases.length; i++) {
      if (aliases[i]) {
        cleaned = cleaned.replace(aliases[i], "").trim();
      }
    }
    // Remove common filler words
    cleaned = cleaned.replace(/[的了呢吧吗啊呀哦哈嗯着过到和与]/g, "").trim();
    return cleaned || text;
  },

  /* Get NPC response based on keywords, time, clues, and personality */
  getNPCResponse(npc, npcData, topic, sd, cd) {
    var dlgEntries = npc.dialogues || {};
    var timeEntry = dlgEntries[Game.state.currentTime];

    // First priority: specific time-based dialogue (scripted story moments)
    if (timeEntry && timeEntry.text) {
      // If this is the first time talking to this NPC at this time, use scripted dialogue
      if (!Game.hasSpoken(npc.name, "time_" + Game.state.currentTime)) {
        Game.markSpoken(npc.name, "time_" + Game.state.currentTime);
        return { text: timeEntry.text, clueId: timeEntry.clueId || null };
      }
    }

    // Second priority: keyword matching against NPC's knowledge
    var kwMap = npcData.keywords || {};
    for (var pattern in kwMap) {
      if (!kwMap.hasOwnProperty(pattern)) continue;
      var keywords = pattern.split("|");
      if (this.fuzzyMatch(topic, keywords)) {
        var resp = kwMap[pattern];
        if (typeof resp === "function") {
          return resp(Game.state);
        }
        return { text: resp.text || resp, clueId: resp.clueId || null };
      }
    }

    // Third priority: context-aware responses based on discovered clues
    if (npcData.clueAware) {
      for (var caKey in npcData.clueAware) {
        if (!npcData.clueAware.hasOwnProperty(caKey)) continue;
        if (Game.hasClue(caKey)) {
          var awareResp = npcData.clueAware[caKey];
          if (typeof awareResp === "function") return awareResp(Game.state);
          return { text: awareResp.text || awareResp, clueId: awareResp.clueId || null };
        }
      }
    }

    // Fourth priority: personality-based fallback for this NPC
    if (npcData.fallbacks && npcData.fallbacks.length > 0) {
      var fb = npcData.fallbacks[Math.floor(Math.random() * npcData.fallbacks.length)];
      return { text: fb };
    }

    // Final fallback
    return { text: npcData.defaultDialogue || "……（" + npc.label + "沉默不语）" };
  }
};

window.Input = Input;
