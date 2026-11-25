// Interactive NPC Dialogues, Bagua Lore, WuXing Guidance & World Action Prompts

const BAGUA_SPECIALISTS = {
  "villager-bagua-daoist": {
    title: "太极坛司阵道长",
    badge: "太极坛",
    landmarkId: "bagua-taiji-pavilion",
    greetingsDay: [
      "无量寿福。太极坛居八卦岛坤舆正中，昼承天光、夜映星阵。",
      "若想激发八宫全面共鸣，不妨循五行相生之序依次点亮八门灵柱。",
    ],
    greetingsDusk: [
      "暮色四合，八门华灯齐映太极，正是一日之中推演周天流转的最佳时辰。",
      "仰观天穹，扶摇大鹏常于诸岛与星阵之间穿梭，若八宫齐鸣便会来此盘旋朝贺。",
    ],
    tips: [
      "五行相生秘诀：水生木（坎➔震/巽）➔ 木生火（离）➔ 火生土（坤/艮）➔ 土生金（乾/兑）➔ 金生水（坎）。",
      "环内一二坊新增了茶馆、蜀绣坊、百草堂、书斋与丝竹琴台；外坊亦添了酒肆、铁匠铺与奇珍阁。",
      "太极坛北侧有一座乾坤折叠传送阵，可直抵蓬莱玄霜仙岛；西侧传送阵可返主岛广场。",
    ],
    actions: [
      { label: "指引下一点亮宫位", kind: "wuxing_hint" },
      { label: "催动太极灵脉脉冲", kind: "bagua_pulse" },
    ],
  },
  "villager-bagua-tea": {
    title: "八卦盖碗茶馆 · 茶博士",
    badge: "坤坊茶馆",
    landmarkId: "bagua-inner-teahouse",
    greetingsDay: [
      "客官里面请！刚沏好的蒙顶甘露配竹叶青，三口盖碗茶，最解逛城乏意。",
      "这坤位内坊紧邻蜀绣坊与悦来客栈，日日都有南来北往的旅人歇脚听书。",
    ],
    greetingsDusk: [
      "夜灯亮起，盖碗里的茶汤也映着宫灯颜色呢，坐下来喝一盏安神热茶再走吧。",
      "对街的醉仙酒肆也开了晚市，不过茶香清心，看星阵最宜饮茶。",
    ],
    tips: [
      "进茶馆歇脚的话，走进大门前按 E 就能推门入室，里头备了雕花木桌和软榻。",
      "往东南方走几步便是流觞丝竹琴台，踩上玉石琴键就能自弹五声古韵。",
      "坤位属土，在五行相生里正好承接离火之气，转而生出兑、乾金脉。",
    ],
    actions: [
      { label: "斟一盏蒙顶盖碗茶", kind: "chime_toast", message: "沈茶娘为你斟上一盏热气氤氲的蒙顶盖碗茶，清香沁脾！", pitch: 523.25 },
      { label: "步入盖碗茶馆", kind: "enter_landmark", landmarkId: "bagua-inner-teahouse" },
    ],
  },
  "villager-bagua-herb": {
    title: "青囊百草堂 · 坐堂郎中",
    badge: "震坊医馆",
    landmarkId: "bagua-inner-apothecary",
    greetingsDay: [
      "春生木旺，震位东坊阳气最足，晒在石阶上的川贝与天麻正透着清苦药香。",
      "莫看此间只是体素草堂，四时节气与八宫脉象皆可在此细细调理。",
    ],
    greetingsDusk: [
      "夜露微凉，可要带一丸宁心琥珀香囊再往东侧震雷鼓楼行走？",
      "暮色时分百草收敛灵气，正是配制温脉药茶的工夫。",
    ],
    tips: [
      "震位五行属木，与东南巽风同属青龙生发之气；坎水之脉最能滋养草木。",
      "出百草堂向东穿过三环石路，便是公孙铁匠的蜀山铸剑铁匠铺。",
      "想细看堂内药柜与悬壶陈设，正对门廊按 E 即可步入。",
    ],
    actions: [
      { label: "领一枚青囊安神香囊", kind: "chime_toast", message: "白郎中赠你一枚清冽甘松的青囊香囊，神清气爽！", pitch: 440.0 },
      { label: "步入青囊百草堂", kind: "enter_landmark", landmarkId: "bagua-inner-apothecary" },
    ],
  },
  "villager-bagua-scholar": {
    title: "阆中墨香书斋 · 主讲夫子",
    badge: "乾坊书斋",
    landmarkId: "bagua-inner-bookstore",
    greetingsDay: [
      "既来乾西北书斋，何妨停步阅一卷《阆中八卦城志》与周易微言？",
      "书斋东邻天机星象算馆，西望主岛渡口，最适合静观天地象数。",
    ],
    greetingsDusk: [
      "青砖纸窗挑灯夜读，书声与远处古戏台锣鼓遥相呼应，岂非人间佳境？",
      "若在八卦九宫弈台缺个对手，老夫随时可以给你讲讲九宫先手妙招。",
    ],
    tips: [
      "八卦九宫弈台就设在东北艮坊，推演先占天元、后守四角的古棋路。",
      "乾位属天属金，最喜艮、坤二土相生；点亮后记得顺势往坎北水车阁接续水脉。",
      "也可去南端离火八卦点星台一试点灯解法，看看能否一举全亮。",
    ],
    actions: [
      { label: "求一签八卦易理卦象", kind: "bagua_fortune" },
      { label: "步入阆中墨香书斋", kind: "enter_landmark", landmarkId: "bagua-inner-bookstore" },
    ],
  },
  "villager-bagua-smith": {
    title: "蜀山铸剑铁匠铺 · 首席铸师",
    badge: "外坊铁匠",
    landmarkId: "bagua-outer-forge",
    greetingsDay: [
      "当——！这外坊炉火够旺，打出来的川铁剑坯连震宫鼓楼那边都能听见清越金声！",
      "外环灵渠疏阔之后，咱这三四环街坊通畅多了，挑灵石矿料顺手得很。",
    ],
    greetingsDusk: [
      "夜里炉火最显火候！看这通红炭焰映着漫天星点，简直比灯笼还亮堂。",
      "打完这一炉青铜编钟坯，我正好去旁边酒肆喝两碗冰醪糟。",
    ],
    tips: [
      "铁匠铺炉火正旺，进屋参观按 E 即可，屋里还陈列着匠人茶歇小案。",
      "东北边不远处就是太古灵石奇珍阁，陈列着采集自蓬莱与八卦地脉的晶矿。",
      "想要听五声雅乐清音，可去内环巽方的流觞丝竹琴台。",
    ],
    actions: [
      { label: "试叩青铜八卦编钟", kind: "chime_toast", message: "公孙铁匠抡锤轻叩八卦铜钟，清越余韵回荡全城！", pitch: 587.33 },
      { label: "步入铸剑铁匠铺", kind: "enter_landmark", landmarkId: "bagua-outer-forge" },
    ],
  },
  "villager-bagua-innkeeper": {
    title: "川味醉仙酒肆 · 当家掌柜",
    badge: "外坊酒肆",
    landmarkId: "bagua-outer-tavern",
    greetingsDay: [
      "稀客稀客！刚蒸熟的椒香红油钵钵鸡配冰糖米酒，快进屋挑个临窗雅座！",
      "南面几步就是离火八卦点星台，不少侠客解完灯阵都要来喝一碗庆祝。",
    ],
    greetingsDusk: [
      "红灯笼一挑起来，这外环夜市就算彻底热闹喽！楼上悦来客栈也备好了上房。",
      "远道飞来的旅人最爱看大鹏掠过檐角，再顺道进酒肆听一段川味说书。",
    ],
    tips: [
      "酒肆屋里备有柜台、木桌与灯火，正门前按 E 就能走进去坐坐。",
      "南面离位外坊设了离火八卦点星台，点按星灯会让相邻四向同步反转，颇有趣味。",
      "逛累了还能去西南坤外坊的八卦悦来客栈歇脚。",
    ],
    actions: [
      { label: "斟一碗青梅醉仙酿", kind: "chime_toast", message: "花月掌柜奉上温润醇香的青梅醉仙酿，唇齿留芳！", pitch: 392.0 },
      { label: "步入醉仙酒肆", kind: "enter_landmark", landmarkId: "bagua-outer-tavern" },
    ],
  },
  "villager-bagua-keeper": {
    title: "八卦凌霄文塔 · 守塔老翁",
    badge: "乾坊文塔",
    landmarkId: "bagua-outer-pagoda",
    greetingsDay: [
      "老朽在这五重凌霄文塔下守了半辈子，晴空万里时一抬头便能望见大鹏越过塔尖。",
      "乾位西北属天，这文塔补全了外坊天际最高一角，塔风吹响风铃最是清越。",
    ],
    greetingsDusk: [
      "夜风拂过文塔青砖，顶轮碧玉清辉与西北开门牌坊遥遥相照，宛如星柱。",
      "顺着乾方再往北走，便是苏染娘打理的保宁醋染水轩了。",
    ],
    tips: [
      "文塔门前正对三环大道，按下 E 可步入塔内观览雅室陈设。",
      "想知道全城还有哪几座宫殿尚未点亮，可以回太极坛请教天机道长。",
    ],
    actions: [
      { label: "叩响凌霄文塔风铃", kind: "chime_toast", message: "守塔陈翁轻拨青铜塔铃，清冽铃音绕塔飘向云端！", pitch: 659.25 },
      { label: "步入凌霄文塔", kind: "enter_landmark", landmarkId: "bagua-outer-pagoda" },
    ],
  },
  "villager-bagua-dyer": {
    title: "保宁醋染水轩 · 蓝染掌作",
    badge: "坎坊醋染",
    landmarkId: "bagua-outer-dyehouse",
    greetingsDay: [
      "坎北水脉甘冽，正好用来酿阆中保宁古醋与漂洗靛蓝土布，看檐前那几匹布多精神！",
      "太阳一照，青蓝布幔晃晃悠悠，连空气里都是麦曲稻壳和草木蓝靛的清香。",
    ],
    greetingsDusk: [
      "夜露下来前要把鲜染布收进檐下，只留一缸陈年老醋在月光下慢慢生香。",
      "若逛渴了，内坊还有茶馆，外坊东南也有醉仙酒肆可坐。",
    ],
    tips: [
      "保宁醋染水轩就在坎北外坊，正门按 E 即可进坊参观货架茶案。",
      "院前排着两只陈年陶土醋坛，风吹起布幔时别有一番蜀北古韵。",
    ],
    actions: [
      { label: "轻嗅百年保宁古醋香", kind: "chime_toast", message: "苏染娘揭开泥封陶坛，醇和甘洌的阆中醋香扑鼻而来！", pitch: 440.0 },
      { label: "步入醋染水轩", kind: "enter_landmark", landmarkId: "bagua-outer-dyehouse" },
    ],
  },
  "villager-bagua-lighthouse": {
    title: "天风望海灯楼 · 守灯舵手",
    badge: "兑坊灯楼",
    landmarkId: "bagua-outer-lighthouse",
    greetingsDay: [
      "站在这座天风望海灯楼前往西看，隔着东海海峡就是主岛码头！",
      "出西门外海崖上还新修了兑泽望岛栈桥亭，吹着海风发呆最舒服不过。",
    ],
    greetingsDusk: [
      "一入暮色，塔顶那盏苍青航标明灯就会旋照整片海域，给跨海而来的旅人引路。",
      "偶尔还能听见浪涛声里夹杂着东面震雷鼓楼隐约传来的鼓响呢。",
    ],
    tips: [
      "从灯楼往西穿过四环，就能沿着石板小路直达兑泽望岛栈桥亭看海。",
      "点击下方的鸣灯信号，还能用兑泽灵波向海空大鹏致意！",
    ],
    actions: [
      { label: "催动望海明灯青光信号", kind: "beacon_signal" },
      { label: "步入望海灯楼", kind: "enter_landmark", landmarkId: "bagua-outer-lighthouse" },
    ],
  },
  "villager-bagua-opera": {
    title: "川剧脸谱糖画坊 · 魏班主",
    badge: "离坊民俗",
    landmarkId: "bagua-market-opera",
    greetingsDay: [
      "来来来，瞧一瞧地道川剧彩绘脸谱，再转一转黄金糖画大转盘，转到飞龙算我送你的！",
      "往前几步就是离火八卦点星台，旁边还有一摊香气四溢的红油担担面。",
    ],
    greetingsDusk: [
      "红灯一亮，咱这南坊夜市最喜庆！大戏台开锣的时候，满城都能听见喝彩声。",
      "要是九宫点星台把你难住了，记住每次点下都会让中心与上下左右同时翻转哦。",
    ],
    tips: [
      "往东几步沿三环走过去，就能闻见担担面摊紫铜大锅的香辣热气。",
      "去南侧离火八卦点星台试试按 E 或点击符石，把九枚星火全部点亮吧！",
    ],
    actions: [
      { label: "听一段川剧变脸锣鼓", kind: "chime_toast", message: "魏班主手腕一抖！红金青白四张川剧脸谱在锣鼓脆响间瞬息连变！", pitch: 587.33 },
      { label: "指路前往离火点星台", kind: "focus_landmark", landmarkId: "bagua-outer-lightsout" },
    ],
  },
};

const OTHER_VILLAGERS = {
  "villager-bagua-lin": {
    title: "蜀中画师",
    badge: "八卦画坊",
    landmarkId: "bagua-li-stage",
    greetingsDay: ["川西粉墙黛瓦在晴光下最富层次，我正在临摹离火古戏台的飞檐。"],
    greetingsDusk: ["华灯初上时，整座八卦城如一幅流光画卷，每一盏灯都像落笔星辰。"],
    tips: ["离火台旁有说书曲艺声，南外坊还新落成了离火八卦点星台。"],
  },
  "villager-bagua-su": {
    title: "堪舆居士",
    badge: "八卦巡游",
    landmarkId: "bagua-qian-observatory",
    greetingsDay: ["八卦城八门放射通衢，如今内外四坊各自成形，步步有景。"],
    greetingsDusk: ["看太极坛光柱随日暮转盛，八门宫灯彼此相望，气脉真乃浑然一体。"],
    tips: ["从太极坛西侧传送阵可直接折叠跃迁回主岛，北侧则通往蓬莱雪岛。"],
  },
  "villager-bagua-chen": {
    title: "观星弟子",
    badge: "乾天观星",
    landmarkId: "bagua-qian-observatory",
    greetingsDay: ["乾位观星台日间亦可测日影方位，西北内坊新开了一家阆中墨香书斋。"],
    greetingsDusk: ["天机星象算馆与乾天观星台夜里星辉交映，极宜推算气运。"],
    tips: ["可请教太极坛的天机道长查看下一点亮宫位的五行相生方向。"],
  },
  "villager-bagua-mu": {
    title: "绣坊织娘",
    badge: "蜀绣艺坊",
    landmarkId: "bagua-inner-silkshop",
    greetingsDay: ["蜀绣最讲究针脚细密、配色温润，南门蜀绣坊新挂了几匹云锦团扇。"],
    greetingsDusk: ["晚风吹动门前红灯，锦缎在暖光下流转着金线光泽，格外好看。"],
    tips: ["正门前按 E 可进入锦绣蜀绣坊参观琳琅绣品。"],
  },
  "villager-bagua-zhao": {
    title: "云游剑客",
    badge: "东震街坊",
    landmarkId: "bagua-outer-forge",
    greetingsDay: ["公孙铁匠炉火声声，倒教我想起当年在蜀山试剑的时光。"],
    greetingsDusk: ["夜晚走在青石大道上，头顶偶尔还有大鹏羽影掠过，颇有仙侠气象。"],
    tips: ["东外坊有蜀山铸剑铁匠铺，东北外坊有太古灵石奇珍阁。"],
  },
  "villager-bagua-yun": {
    title: "丝竹乐师",
    badge: "巽风雅乐",
    landmarkId: "bagua-inner-guqin",
    greetingsDay: ["风车阁下松风徐来，正合去流觞丝竹琴台抚一曲宫商角徵羽。"],
    greetingsDusk: ["暮色里琴声传得更远，五音和鸣之时，连萤火都会绕着石台飞舞。"],
    tips: ["巽位内坊设有一座露天流觞丝竹琴台，点按玉键就能弹奏古调。"],
  },
  "villager-kunlun-miao": {
    title: "蓬莱雪岭仙童",
    badge: "蓬莱仙岛",
    landmarkId: "kunlun-jade-palace",
    greetingsDay: ["蓬莱玄霜云雾袅袅，穿过南麓传送阵可直抵八卦城或返回主岛。"],
    greetingsDusk: ["夜色下的玄霜古松与青玉飞檐银装素裹，宛如人间仙境。"],
    tips: ["不妨乘着雪岛清风多走走，山顶瑶池宫殿前可入内小坐。"],
  },
  "villager-kunlun-han": {
    title: "玄霜守阁人",
    badge: "蓬莱雪岛",
    landmarkId: "kunlun-jade-palace",
    greetingsDay: ["远方大鹏巡游三岛天穹，有时亦会盘旋掠过蓬莱雪峰。"],
    greetingsDusk: ["寒潭映月，仙灯微明，若有兴致可再经传送阵回返八卦城一观夜市。"],
    tips: ["站在山崖边可远眺东面八卦城八门光柱冲霄之景。"],
  },
};

export function getNpcMeta(villager) {
  if (!villager) {
    return { title: "岛屿旅人", badge: "居民", isBaguaSpecialist: false };
  }
  const spec = BAGUA_SPECIALISTS[villager.id];
  if (spec) {
    return {
      title: spec.title,
      badge: spec.badge,
      landmarkId: spec.landmarkId,
      isBaguaSpecialist: true,
    };
  }
  const other = OTHER_VILLAGERS[villager.id];
  if (other) {
    return {
      title: other.title,
      badge: other.badge,
      landmarkId: other.landmarkId,
      isBaguaSpecialist: false,
    };
  }
  const roleMap = {
    baker: "烘焙师",
    artist: "画师",
    commuter: "旅人",
    gardener: "花匠",
    student: "学徒",
    explorer: "探险家",
  };
  return {
    title: roleMap[villager.role] || "岛屿居民",
    badge: "主岛街坊",
    landmarkId: null,
    isBaguaSpecialist: false,
  };
}

export function buildNpcDialogueSession(villager, context = {}) {
  const meta = getNpcMeta(villager);
  const spec = BAGUA_SPECIALISTS[villager.id];
  const other = OTHER_VILLAGERS[villager.id];
  const isDusk = (context?.duskMix || 0) >= 0.45;

  const lines = [];
  if (spec) {
    const greetPool = isDusk ? spec.greetingsDusk : spec.greetingsDay;
    for (const g of greetPool) lines.push(g);
    for (const t of spec.tips) lines.push(t);
  } else if (other) {
    const greetPool = isDusk ? other.greetingsDusk : other.greetingsDay;
    for (const g of greetPool) lines.push(g);
    for (const t of other.tips) lines.push(t);
  } else {
    lines.push(
      isDusk
        ? `晚上好！今天在岛上逛得还顺心吗？东面的八卦城华灯初上，很值得乘传送阵去看一看。`
        : `你好呀！阳光正好，岛上的巴士和电车都很准时，去广场传送阵还可以瞬移去八卦城或蓬莱雪岛呢。`,
    );
    lines.push(
      `听说八卦城里最近新开了茶馆、蜀绣坊、书斋、铁匠铺和醉仙酒肆，可热闹了！`,
    );
  }

  let actions;
  if (spec) {
    actions = spec.actions.map((a) => ({ ...a }));
  } else if (other?.landmarkId) {
    actions = [
      { label: "指路前往附近胜景", kind: "focus_landmark", landmarkId: other.landmarkId },
      { label: "挥手致意", kind: "wave", villagerName: villager.name },
    ];
  } else {
    actions = [
      { label: "前往主岛传送阵", kind: "focus_landmark", landmarkId: "__main_portal__" },
      { label: "挥手致意", kind: "wave", villagerName: villager.name },
    ];
  }

  return {
    villagerId: villager.id,
    name: villager.name || "岛民",
    title: meta.title,
    badge: meta.badge,
    isBaguaSpecialist: meta.isBaguaSpecialist,
    lines,
    actions,
  };
}
