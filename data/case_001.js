/* ============================================================
   case_001.js — 醉汉砸铺案 完整数据
   5场景 × 时段 × NPC关键词库 × 线索 × 结局
   ============================================================ */
var CASE_001 = {
  id: "ancient_case_001",
  title: "醉汉砸铺案",
  world: "ancient",
  startScene: "weaver_shop_interior",
  startTime: "dawn",

  /* ---- Clues ---- */
  clues: [
    { id: "clue_broken_bolt",    name: "断裂的门栓",   desc: "门栓从内部被破坏，不像是从外面撞开的" },
    { id: "clue_oil_lamp",       name: "翻倒的油灯",   desc: "油灯倒在角落，灯油还没干透" },
    { id: "clue_key_sound",      name: "钥匙开锁声",   desc: "阿福听到钥匙开锁的声音——钥匙只有掌柜有" },
    { id: "clue_pawn_record",    name: "当铺出入记录", desc: "老周最近频繁出入当铺，当了又赎，手头很紧" },
    { id: "clue_zhao_testimony", name: "赵三的证词",   desc: "赵三坚持不记得去过铺子，且欠钱另有原因" },
    { id: "clue_account_book",   name: "账本借款记录", desc: "账本上有一笔「急用」借款，日期就在案发前一天" },
    { id: "clue_hidden_coins",   name: "藏匿的银两",   desc: "老周在铺子后院藏了一包银两，来路不明" }
  ],

  /* ---- NPCs ---- */
  npcs: {
    lao_zhou: {
      name: "老周", title: "绸缎庄掌柜", role: "真凶",
      portrait: "老周",
      defaultDialogue: "大人，我这铺子被砸得惨啊……您可得替我做主！",
      keywords: {
        "昨晚|发生|经过|怎么回事|情况": {
          text: "昨晚那赵三喝得醉醺醺的，冲到我的铺子里来闹事！砸了柜台、撕了布匹、还推倒了油灯！要不是隔壁老王听见动静喊人，我这铺子怕是要被烧了！"
        },
        "赵三|酒鬼|嫌犯|他": {
          text: "赵三这人吧，平时就爱喝酒，喝醉了就闹事。但他就是个混账，没那个脑子搞什么预谋。不过……他确实欠我钱，怀恨在心也说不准。"
        },
        "证据|线索|查到|发现": {
          text: "大人您自己看看现场就知道了。门栓上的痕迹很奇怪，不像从外面撞开的。还有那油灯……我倒觉得像是有人故意布置的。",
          clueId: "clue_broken_bolt"
        },
        "门栓|门|锁": {
          text: "那门栓上的痕迹我看着就怪——要说从外面撞开，痕迹不该是那样的。倒像是里头有人动了手脚。"
        },
        "油灯|灯|火": {
          text: "油灯倒在地上，灯油洒了一地。要是赵三真喝醉了来砸店，哪还有心思管油灯？"
        },
        "阿福|伙计": {
          text: "阿福那孩子胆小，当时吓坏了躲在后院。大人可以去问问他，不过他胆子小，未必敢说什么。"
        },
        "当铺|缺钱|手头": {
          text: "呃……这个……近来生意不太好，确实周转了几次。但这和砸铺子有什么关系？"
        },
        "损失|赔|多少": {
          text: "损失大概一百多两银子。这些绸缎都是上好的料子，全给糟蹋了……唉！"
        },
        "欠钱|债务|借钱": {
          text: "赵三确实欠我钱——他之前摔坏了我一批货，我扣了他工钱，他就不干了。现在在街上混日子。"
        },
        "动机|为什么|原因|谁干的": {
          text: "我觉得就是赵三！他欠我钱、被我扣了工钱、在街上混得不如意——喝了酒什么事干不出来？"
        },
        "账本|借款|急用": {
          text: "……那是周转用的。做生意嘛，总有手头紧的时候。大人您看这个做什么？",
          clueId: "clue_account_book"
        },
        "后院|藏|银两|银子": {
          text: "后、后院？那儿就是堆放杂物的地方，没什么好看的。",
          clueId: "clue_hidden_coins"
        },
        "赌博|赌|债主": {
          text: "大人这话从何说起！我周某人清清白白做生意，从不沾赌！……是谁在造谣？"
        }
      },
      clueAware: {
        "clue_pawn_record": {
          text: "大人，我去当铺只是暂时周转……最近生意不好，这也不犯法吧？",
        },
        "clue_key_sound": {
          text: "钥匙？对，钥匙只有我和阿福有……但他那天晚上根本不在铺子里！再说他一个小伙计，哪来的胆子？",
        },
        "clue_account_book": {
          text: "那笔借款是我周转用的……跟案子没关系。大人您查清赵三的底细才是正道！",
        },
        "clue_hidden_coins": {
          text: "那、那是我攒的私房钱！我想着后院安全就埋那儿了……绝不是赃款！",
        }
      },
      fallbacks: [
        "大人，您一定得替我做主啊！这铺子可是我全部的家当。",
        "赵三他喝醉了什么都干得出来，您别被他骗了。",
        "我辛辛苦苦经营这家铺子，一夜之间就毁了……",
        "您还怀疑我？我可是受害者！"
      ],
      dialogues: {
        dawn:  { text: "大人！您可得为我做主！赵三他喝醉了就来砸店，不是第一次了！您看看这满地狼藉……", clueId: null },
        noon:  { text: "损失大概一百多两。赵三欠我钱，怀恨在心。大人您去牢里审审他就知道了。", clueId: null },
        evening: { text: "大人，天色不早了，您也辛苦了一天。我先把铺子收拾收拾？", clueId: null }
      }
    },

    zhao_san: {
      name: "赵三", title: "街上的酒鬼", role: "被冤枉者",
      portrait: "赵三",
      defaultDialogue: "大人……我真的不记得了……那晚我喝太多了……",
      keywords: {
        "昨晚|发生|经过|砸": {
          text: "大人我冤枉！我确实喝了不少酒，但真不记得去过周老板的铺子。我要有那胆子砸店，还能在街上混成这样？",
          clueId: "clue_zhao_testimony"
        },
        "老周|掌柜|周老板": {
          text: "老周他扣我工钱！我之前搬货不小心摔坏了一匹绸缎，他说要从工钱里扣。我就跟他吵了一架，然后不干了。但我没砸他铺子！"
        },
        "欠钱|债务": {
          text: "我是欠他钱，那是因为摔坏绸缎他扣了我工钱，后来他说不够，让我继续赔。我这日子都过不下去了，哪有钱赔？"
        },
        "喝酒|酒|醉": {
          text: "大人，我承认我爱喝两口。但喝醉了砸店？那是要挨板子的大事！我再糊涂也不至于……"
        },
        "阿福|伙计": {
          text: "阿福？那小子胆小得很，听到什么动静都躲。你问他，他肯定吓得什么都不记得。"
        },
        "门栓|钥匙": {
          text: "门栓？钥匙？大人，我连铺子的门朝哪开都不太记得了！我喝了酒，走路都晃，哪还能开锁？"
        },
        "动机|为什么": {
          text: "我是跟老周吵过架。但砸店可是要蹲大牢的！我赵三再怎么糊涂，也不至于把自己弄进去吧？"
        },
        "当铺|赌博|赌": {
          text: "老周去当铺？哈哈！我就说他最近不对头。以前他多神气啊，见了我都不正眼瞧。最近倒是常往当铺那边跑……"
        },
        "油灯|灯": {
          text: "我喝醉了连路都看不清，还能把油灯翻倒？大人您想想，这合理吗？"
        }
      },
      clueAware: {
        "clue_pawn_record": {
          text: "哈哈哈！我就说老周有问题！他肯定是在外头欠了钱！"
        },
        "clue_account_book": {
          text: "他账上借了钱？我就说他最近不对劲！大人您可要查清楚，别冤枉了好人。"
        },
        "clue_key_sound": {
          text: "钥匙开锁的声音？大人您听听——这不明摆着吗？有钥匙的人才能进铺子！我可没有！"
        }
      },
      fallbacks: [
        "大人，我虽然是个酒鬼，但不是坏人啊……",
        "您想想，我要是砸了店，还会留在街上等人来抓吗？",
        "老周他看我不顺眼不是一天两天了，这回肯定是想借机整治我。"
      ],
      dialogues: {
        noon:  { text: "大人！我冤枉！我是喝了酒，但真不记得去过周老板的铺子。我要有那胆子砸店，还能在街上混？", clueId: "clue_zhao_testimony" },
        evening: { text: "我想起来了——那天晚上我在东街酒摊喝的。老张头可以作证。他收了我三文钱，打了一壶散酒。" }
      }
    },

    a_fu: {
      name: "阿福", title: "小伙计", role: "重要证人",
      portrait: "阿福",
      defaultDialogue: "我、我什么都不知道……别问我……",
      keywords: {
        "昨晚|发生|看到|听到": {
          text: "我吓坏了，躲在后院没敢出来……但我听到了一些声音……",
        },
        "钥匙|开锁|声音": {
          text: "是……我听到了钥匙开锁的声音。铺子的钥匙只有掌柜有……我那天晚上明明锁好门才走的。",
          clueId: "clue_key_sound"
        },
        "老周|掌柜": {
          text: "掌柜的平时对我还不错……但最近他脾气不太好，老是对我发火。我不敢多问。",
        },
        "赵三|酒鬼": {
          text: "赵三以前在铺子里帮工，后来和掌柜吵了一架就不干了。他喝了酒确实会闹，但砸店……我不确定。"
        },
        "门栓|门": {
          text: "那天早上来开门的时候，门栓已经断了。但我记得头天晚上我是锁好门才走的……门栓不应该在外面能弄断。"
        },
        "油灯|灯": {
          text: "油灯平时放在柜台上。我走的时候明明吹灭了的……不知道为什么倒在角落。"
        },
        "当铺|缺钱": {
          text: "掌柜最近老往当铺跑，我偷偷跟过一次。他当了块玉佩，但过两天又赎回来了……不知道在干什么。",
          clueId: "clue_pawn_record"
        },
        "威胁|害怕|不敢": {
          text: "掌柜的说……要是我乱说话，就把我辞了。大人，我家就靠我这份工钱，我不敢乱说……"
        }
      },
      clueAware: {
        "clue_broken_bolt": {
          text: "门栓从里面坏的？那、那不就是说……不是从外面砸开的？那掌柜说赵三砸门进来的……这不对啊。"
        },
        "clue_oil_lamp": {
          text: "灯油还没干……说明油灯是不久前才翻倒的。可我是前一天晚上就锁门走了的……"
        },
        "clue_pawn_record": {
          text: "掌柜的一直跟我说生意不好……但为什么要偷偷去当铺呢？"
        }
      },
      fallbacks: [
        "我……我真的不知道更多了。大人您别为难我。",
        "掌柜的不让我多说。您自己去查吧……",
        "我就是个打杂的小伙计，什么都不懂……"
      ],
      dialogues: {
        dawn:   { text: "我、我吓坏了，躲在后院没敢出来……什么都没看到。", clueId: null },
        noon:   { text: "我听到钥匙开锁的声音……铺子的钥匙只有掌柜有。", clueId: "clue_key_sound" },
        evening: { text: "大人，我什么都说了。您千万别告诉掌柜的……他会辞了我的。", clueId: null }
      }
    },

    wang_gengfu: {
      name: "打更老王", title: "更夫", role: "目击者",
      portrait: "打更老王",
      defaultDialogue: "老朽打了几十年更，这街上夜里的事，都逃不过我的眼睛。",
      keywords: {
        "昨晚|看到|人影|发现": {
          text: "老朽三更打更路过绸缎庄，听到里面有动静。远远看到一个人影从铺子方向跑出去——那身形步伐稳健，不像醉醺醺的人。"
        },
        "人影|身形|模样|特征": {
          text: "天太黑了，看不清脸。但那人穿的不是粗布衣裳，像是绸缎料子——走路很稳当，不像是喝了酒的。"
        },
        "时间|三更|几时|时辰": {
          text: "三更天，梆子刚敲过。老朽每天都是那个时候路过绸缎庄那条街，雷打不动。"
        },
        "赵三|酒鬼": {
          text: "赵三？那个人影不像是赵三。赵三喝醉了走路东倒西歪，老朽见过的。那个人跑得很快、很稳，一看就是清醒的。"
        },
        "老周|掌柜": {
          text: "周掌柜平时为人还算和气。不过最近几个月，他好像总是愁眉苦脸的，见了我也不怎么打招呼了。"
        },
        "阿福|伙计": {
          text: "那小伙计勤快，每天最早来开门。那天早上就是他先发现的，吓得脸都白了。"
        },
        "动静|声音": {
          text: "有砸东西的声音，还有撕布的声音。老朽一开始以为是猫，后来觉得不对，就喊了人。"
        },
        "其他|还有|别人": {
          text: "那天晚上除了那个人影，没看到别人。哦对了——那人跑的方向是往东街。东街那边……有几家赌坊。"
        }
      },
      clueAware: {
        "clue_pawn_record": {
          text: "周掌柜去当铺？那就对了。前阵子我在东街看到他，他低着头走得很快，像是在躲什么人。"
        },
        "clue_account_book": {
          text: "账上有借款？那周掌柜手头怕是真的紧了。绸缎生意看着风光，里头的苦只有自己知道。"
        }
      },
      fallbacks: [
        "老朽知道的都说了。大人英明，定能查出真相。",
        "这街上的事啊，有时候看着简单，里头弯弯绕绕多着呢。",
        "大人若有需要，老朽随叫随到。打了这么多年更，别的没有，眼睛耳朵还算好使。"
      ],
      dialogues: {
        dawn:   { text: "老朽三更听到动静，远远看到一个人影从铺子方向跑开，看身形不像醉醺醺的人。", clueId: null },
        noon:   { text: "那人影穿的不是粗布衣裳，像是绸缎料子。跑的姿势很稳当。", clueId: null },
        evening: { text: "老朽知道的都说了。大人辛苦，天色不早了，早些歇着。", clueId: null }
      }
    },

    pawn_broker: {
      name: "pawn_broker", title: "当铺掌柜", role: "证人",
      portrait: null,  // No portrait
      defaultDialogue: "客官要当什么？……哦，大理寺查案？您请问。",
      keywords: {
        "老周|周掌柜|绸缎庄": {
          text: "周掌柜？最近来过几次。当了玉佩又赎回去，还拿瓷瓶来问价。我就纳闷——他铺子生意不是挺好的吗？怎么手头这么紧？",
          clueId: "clue_pawn_record"
        },
        "频繁|几次|最近": {
          text: "这半个月来了三四次吧。当的东西都是些值钱物件——玉佩、瓷瓶、还有一方端砚。每次都是急用钱的样子。"
        },
        "玉佩|瓷瓶|当了什么": {
          text: "那块玉佩成色不错，我给了他二十两。后来他又来赎——加了三两利息。过了几天又来当……这样当了赎、赎了当的，利钱都够他受的。"
        },
        "缺钱|手头紧|为什么": {
          text: "我也纳闷。绸缎庄在东城算是有名的，按理说不该这么紧巴。除非……在外头有别的事。大人，东街那边有几家赌坊，您知道的。"
        },
        "赌|赌博": {
          text: "我什么都没说啊大人。只是这城里手头突然紧的生意人，十个里有八个跟赌有关。您自己查查就明白了。"
        }
      },
      fallbacks: [
        "当铺做的就是周转生意，谁来当东西我都不过问。但大人查案，我肯定知无不言。",
        "做我们这行的，看人借钱看得多。周掌柜那样子，确实是急了。"
      ],
      dialogues: {
        dawn: { text: "周掌柜最近来过好几次，当了又赎、赎了又当。他铺子生意还行，怎么手头这么紧？", clueId: "clue_pawn_record" }
      }
    }
  },

  /* ---- Scenes ---- */
  scenes: {
    /* 1. 绸缎庄内 */
    weaver_shop_interior: {
      name: "绸缎庄内",
      description: "铺子内一片狼藉。布匹散落一地，柜台歪倒，地上有杂乱的脚印。空气中弥漫着淡淡的灯油味。",
      times: {
        dawn: {
          interactables: [
            { name:"counter",   label:"翻倒的柜台", x:28, y:48, w:28, h:22, aliases:["柜台","账本","抽屉"], examineText:"柜台被掀翻在地，抽屉摔开了，账本一角露了出来。翻开一看，有一笔「急用」的借款记录，日期就在昨天。", clueId:"clue_account_book" },
            { name:"fabrics",   label:"散落的布匹", x:58, y:38, w:22, h:28, aliases:["布匹","绸缎","布料"], examineText:"上好的绸缎被扯得七零八落，上面有泥脚印。有几匹的撕扯痕迹太整齐了——醉汉能撕得这么整齐吗？" },
            { name:"door_bolt", label:"断裂的门栓", x:4,  y:18, w:10, h:10, aliases:["门栓","门"], examineText:"门栓上的痕迹很奇怪——不像是从外面撞断的，更像是从内部被破坏的。如果是从外面砸门，断裂的方向应该相反。", clueId:"clue_broken_bolt" },
            { name:"oil_lamp",  label:"翻倒的油灯", x:52, y:55, w:12, h:12, aliases:["油灯","灯","灯油"], examineText:"一盏油灯倒在角落，灯油还没完全干透。如果是昨晚砸的，灯油应该早干了。", clueId:"clue_oil_lamp" }
          ],
          npcs: [
            { name:"lao_zhou", label:"老周", x:62, y:50, w:18, h:28, aliases:["掌柜","老周","周老板","周掌柜"] },
            { name:"a_fu", label:"阿福", x:42, y:55, w:14, h:24, aliases:["阿福","伙计","小伙计"] }
          ],
          exits: [
            { name:"to_street", label:"门外街道", x:90, y:8, w:10, h:18, aliases:["街道","街","出去","外面","门外"], target:"weaver_shop_street" }
          ]
        },
        noon: {
          interactables: [
            { name:"counter",   label:"翻倒的柜台", x:28, y:48, w:28, h:22, aliases:["柜台","账本"], examineText:"阳光照进来，账本上的字迹更清楚了。「急用」借款，五十两。日期就在案发前一天。掌柜手头很紧。", clueId:"clue_account_book" },
            { name:"fabrics",   label:"散落的布匹", x:58, y:38, w:22, h:28, aliases:["布匹","绸缎"], examineText:"在阳光下一看，那些整齐的撕痕更明显了。不像是发泄式的乱撕，倒像是有人故意布置的。" }
          ],
          npcs: [
            { name:"lao_zhou", label:"老周", x:62, y:50, w:18, h:28, aliases:["掌柜","老周","周老板"] },
            { name:"a_fu", label:"阿福", x:42, y:55, w:14, h:24, aliases:["阿福","伙计"] }
          ],
          exits: [
            { name:"to_street", label:"门外街道", x:90, y:8, w:10, h:18, aliases:["街道","出去"], target:"weaver_shop_street" },
            { name:"to_jail",   label:"大理寺牢房", x:68, y:6, w:16, h:12, aliases:["牢房","大理寺","监狱","赵三"], target:"jail" }
          ]
        },
        evening: {
          interactables: [
            { name:"counter",   label:"翻倒的柜台", x:28, y:48, w:28, h:22, aliases:["柜台"], examineText:"傍晚的光线下，柜台底部的划痕隐约可见——像是被人用力推倒时留下的。一个醉汉能推得动这么重的柜台吗？" },
            { name:"oil_lamp",  label:"翻倒的油灯", x:52, y:55, w:12, h:12, aliases:["油灯","灯"], examineText:"将暗未暗的天色里，油灯的痕迹反而更明显了。灯油泼洒的形状很均匀，不像是被人随手打翻。" }
          ],
          npcs: [
            { name:"lao_zhou", label:"老周", x:62, y:50, w:18, h:28, aliases:["掌柜","老周"] },
            { name:"a_fu", label:"阿福", x:42, y:55, w:14, h:24, aliases:["阿福","伙计"] }
          ],
          exits: [
            { name:"to_street", label:"门外街道", x:90, y:8, w:10, h:18, aliases:["街道"], target:"weaver_shop_street" },
            { name:"to_jail",   label:"大理寺牢房", x:68, y:6, w:16, h:12, aliases:["牢房","赵三"], target:"jail" }
          ]
        }
      }
    },

    /* 2. 事发街道 */
    weaver_shop_street: {
      name: "绸缎庄外·街道",
      description: "街道上三三两两围着看热闹的人，议论着昨晚的事。清晨的雾气还没散尽。",
      times: {
        dawn: {
          interactables: [],
          npcs: [
            { name:"wang_gengfu", label:"打更老王", x:18, y:48, w:14, h:24, aliases:["老王","打更","更夫","老丈"] }
          ],
          exits: [
            { name:"to_pawn",  label:"去当铺街", x:48, y:65, w:16, h:14, aliases:["当铺","当铺街"], target:"pawn_street" },
            { name:"to_shop",  label:"回绸缎庄", x:80, y:8, w:14, h:14, aliases:["绸缎庄","铺子"], target:"weaver_shop_interior" }
          ]
        },
        noon: {
          interactables: [],
          npcs: [
            { name:"wang_gengfu", label:"打更老王", x:18, y:48, w:14, h:24, aliases:["老王","打更","更夫"] }
          ],
          exits: [
            { name:"to_pawn",  label:"去当铺街", x:48, y:65, w:16, h:14, aliases:["当铺"], target:"pawn_street" },
            { name:"to_shop",  label:"回绸缎庄", x:80, y:8, w:14, h:14, aliases:["绸缎庄"], target:"weaver_shop_interior" }
          ]
        },
        evening: {
          interactables: [],
          npcs: [
            { name:"wang_gengfu", label:"打更老王", x:18, y:48, w:14, h:24, aliases:["老王","打更"] }
          ],
          exits: [
            { name:"to_pawn",  label:"去当铺街", x:48, y:65, w:16, h:14, aliases:["当铺"], target:"pawn_street" },
            { name:"to_shop",  label:"回绸缎庄", x:80, y:8, w:14, h:14, aliases:["绸缎庄"], target:"weaver_shop_interior" },
            { name:"to_desk",  label:"回大理寺", x:88, y:62, w:12, h:14, aliases:["大理寺","衙门","回去","案桌"], target:"desk" }
          ]
        }
      }
    },

    /* 3. 大理寺牢房 */
    jail: {
      name: "大理寺牢房",
      description: "阴暗潮湿的牢房里，赵三蜷缩在角落，身上还带着未散的酒气。铁栏外透进一缕微光。",
      times: {
        noon: {
          interactables: [],
          npcs: [
            { name:"zhao_san", label:"赵三", x:28, y:42, w:22, h:32, aliases:["赵三","酒鬼","赵","嫌犯"] }
          ],
          exits: [
            { name:"to_shop", label:"回绸缎庄", x:78, y:8, w:16, h:14, aliases:["绸缎庄","铺子","回去"], target:"weaver_shop_interior" }
          ]
        },
        evening: {
          interactables: [],
          npcs: [
            { name:"zhao_san", label:"赵三", x:28, y:42, w:22, h:32, aliases:["赵三","赵","嫌犯"] }
          ],
          exits: [
            { name:"to_shop", label:"回绸缎庄", x:78, y:8, w:16, h:14, aliases:["绸缎庄","铺子"], target:"weaver_shop_interior" }
          ]
        }
      }
    },

    /* 4. 当铺街 */
    pawn_street: {
      name: "当铺街",
      description: "当铺的柜台高耸，掌柜的正拨着算盘。柜台上摆着各式典当之物。",
      times: {
        dawn: {
          interactables: [],
          npcs: [
            { name:"pawn_broker", label:"当铺掌柜", x:35, y:42, w:18, h:22, aliases:["当铺","掌柜","当铺老板"] }
          ],
          exits: [
            { name:"to_street", label:"回绸缎庄街", x:78, y:8, w:16, h:14, aliases:["街道","绸缎庄","回去"], target:"weaver_shop_street" }
          ]
        },
        noon: {
          interactables: [],
          npcs: [
            { name:"pawn_broker", label:"当铺掌柜", x:35, y:42, w:18, h:22, aliases:["当铺","掌柜"] }
          ],
          exits: [
            { name:"to_street", label:"回绸缎庄街", x:78, y:8, w:16, h:14, aliases:["街道","绸缎庄"], target:"weaver_shop_street" }
          ]
        },
        evening: {
          interactables: [],
          npcs: [
            { name:"pawn_broker", label:"当铺掌柜", x:35, y:42, w:18, h:22, aliases:["当铺","掌柜"] }
          ],
          exits: [
            { name:"to_street", label:"回绸缎庄街", x:78, y:8, w:16, h:14, aliases:["街道","绸缎庄"], target:"weaver_shop_street" },
            { name:"to_desk",  label:"回大理寺", x:88, y:62, w:12, h:14, aliases:["大理寺","衙门","回去","案桌"], target:"desk" }
          ]
        }
      }
    },

    /* 5. 大理寺案桌前 */
    desk: {
      name: "大理寺案桌前",
      description: "案桌上堆着今日收集的线索和卷宗。烛火摇曳，你坐下来开始整理思路。在这里可以梳理线索、进行推理、决定下一步行动。",
      times: {
        dawn: {
          interactables: [
            { name:"case_file", label:"案卷宗", x:30, y:40, w:25, h:20, aliases:["案卷","卷宗","记录"], examineText:"翻开案卷，上面记录着你已经收集到的所有线索和证词。每一条都指向一个方向……" },
            { name:"brush",     label:"毛笔",   x:60, y:45, w:10, h:8,  aliases:["笔","毛笔"],     examineText:"提起笔，在纸上写下关键的推理。真相就在这些线索的连接之处。" }
          ],
          npcs: [],
          exits: [
            { name:"to_shop",   label:"前往绸缎庄", x:78, y:8, w:16, h:14, aliases:["绸缎庄","铺子","案发"], target:"weaver_shop_interior" },
            { name:"to_street", label:"前往街道",   x:55, y:8, w:16, h:14, aliases:["街道"], target:"weaver_shop_street" },
            { name:"to_jail",   label:"前往牢房",   x:32, y:8, w:16, h:14, aliases:["牢房","监狱"], target:"jail" }
          ]
        },
        noon: {
          interactables: [
            { name:"case_file", label:"案卷宗", x:30, y:40, w:25, h:20, aliases:["案卷","卷宗"], examineText:"你将新的线索整理进案卷。每一条线索都在逼近真相——但还差一点。" },
            { name:"brush",     label:"毛笔",   x:60, y:45, w:10, h:8,  aliases:["笔"],       examineText:"笔尖蘸满墨，你在纸上画出了线索之间的连线。动机、手段、时机——三者缺一不可。" }
          ],
          npcs: [],
          exits: [
            { name:"to_shop",   label:"前往绸缎庄", x:78, y:8, w:16, h:14, aliases:["绸缎庄","铺子"], target:"weaver_shop_interior" },
            { name:"to_street", label:"前往街道",   x:55, y:8, w:16, h:14, aliases:["街道"], target:"weaver_shop_street" },
            { name:"to_jail",   label:"前往牢房",   x:32, y:8, w:16, h:14, aliases:["牢房"], target:"jail" }
          ]
        },
        evening: {
          interactables: [
            { name:"case_file", label:"案卷宗", x:30, y:40, w:25, h:20, aliases:["案卷","卷宗"], examineText:"烛火下的案卷已经越来越厚了。所有的线索都指向了一个你不想相信的方向……" },
            { name:"brush",     label:"毛笔",   x:60, y:45, w:10, h:8,  aliases:["笔"],       examineText:"你提笔在纸上写下两个字——老周。然后画了一个圈。" }
          ],
          npcs: [],
          exits: [
            { name:"to_shop",   label:"前往绸缎庄", x:78, y:8, w:16, h:14, aliases:["绸缎庄"], target:"weaver_shop_interior" },
            { name:"to_street", label:"前往街道",   x:55, y:8, w:16, h:14, aliases:["街道"], target:"weaver_shop_street" },
            { name:"to_jail",   label:"前往牢房",   x:32, y:8, w:16, h:14, aliases:["牢房"], target:"jail" }
          ]
        }
      }
    }
  },

  /* ---- Ending Check ---- */
  checkEnding: function(state, game) {
    var found = state.discoveredClues;
    var critical = ["clue_broken_bolt","clue_key_sound","clue_pawn_record","clue_account_book"];
    // If all critical clues found and player is at desk → trigger ending choice
    var allCritical = true;
    for (var i = 0; i < critical.length; i++) {
      if (found.indexOf(critical[i]) < 0) { allCritical = false; break; }
    }
    if (allCritical && state.currentScene === "desk") {
      setTimeout(function() { UI.showEndingChoice(); }, 800);
    }
    // If at desk with 3+ clues but not all critical
    if (found.length >= 5 && state.currentScene === "desk") {
      setTimeout(function() { UI.showEndingChoice({ incomplete: true }); }, 800);
    }
  }
};

/* Register the case */
Game.registerCase("ancient_case_001", CASE_001);
