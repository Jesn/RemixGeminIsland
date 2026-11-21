import type { WorldCreation, WorldPath, WorldProp } from "./types";

export type PolicyViolationCategory =
  | "anti_ai_or_datacentre"
  | "specific_tech_company"
  | "political_or_patriotic"
  | "inflammatory_or_offensive";

export type ContentPolicyCheckResult =
  | { allowed: true }
  | {
      allowed: false;
      category: PolicyViolationCategory;
      reason: string;
    };

/**
 * Legacy creation IDs removed from GeminIsland under the island's neutrality,
 * non-political, brand-free, and family-friendly stewardship rules.
 * Kept in an explicit blocklist so upstream worker sync or stale caches can never re-introduce them.
 */
export const DISALLOWED_CREATION_IDS: ReadonlySet<string> = new Set([
  "c-mvtolufv-dba1a3", // Anti-Datacentre Protest Crowd ("A mob of angry protesters against data centres.")
  "c-mw1up8v5-86f433", // Grand Rally Speaker Stage (political rally)
  "c-mvt17q5w-b91c4b", // Aboriginal Tent Embassy (protest encampment)
  "c-mvrj0ums-3f7081", // Cyber Analysis Center ("Mossad data analysis office")
  "c-mvodkwqc-c9e4a4", // Federal Parliament Hall ("Modernist parliament house")
  "c-mw9uh4ls-86883c", // Googleplex & Gradient Canopy (Google campus)
  "c-mvr9t1bl-7a28af", // Tesla Dealership & Yard (Tesla)
  "c-mvoqwq7n-086aec", // Cyber Electric Pickup (Tesla Cybertruck)
  "c-mvodns66-ce9982", // Hynix Data Amphitheater (SK Hynix)
  "c-mvpbex1o-c3020d", // Solar Flock ALPR Camera (Flock surveillance)
  "c-mvsqycmq-d847a3", // GYG Ghost Kitchen (Uber Eats)
  "c-mvopczh6-c9c3cb", // Darrieus Wind Turbine ("optimized to kill as many birds as possible")
  "comp-6c0884bc", // Darrieus Harvest Tractor (companion of removed turbine)
  "c-mvqgkkmt-0e4a3f", // Belconnen Owl Monument (crude anatomical prompt)
  "c-mvojw3k4-4ee278", // The Dumb Guy Queue Pub (IQ mockery)
  "c-mvomg46x-e654f2", // Philosopher's Hermit Hut (ideological figure reference)
]);

export const DISALLOWED_PROP_IDS: ReadonlySet<string> = new Set([
  "prop-60a1e1ff", // Darrieus Wind Turbine signpost
  "prop-444de997", // Turbine Overlook Bench
  "prop-f5bab47e", // ALPR Traffic Camera signpost
  "prop-9332086a", // Traffic Monitoring Zone signpost
]);

export const PROP_LABEL_SANITIZATIONS: Readonly<Record<string, string>> = {
  "prop-9fee8ecb": "薄饼金字塔站",
  "prop-64333a60": "IHOP 金字塔站",
  "prop-2bab9b6c": "西草坪养蜂场",
  "prop-37bf0e75": "魔法城堡观景台",
};

interface PolicyRuleGroup {
  category: PolicyViolationCategory;
  reason: string;
  patterns: readonly RegExp[];
}

const ANTI_AI_GOOGLE_DATACENTRE_PATTERNS: readonly RegExp[] = [
  // Explicit anti-AI, anti-Google, anti-datacentre, anti-tech sentiment
  /\banti[-\s]*(?:ai|a\.i\.|artificial\s+intelligence|llm|machine\s+learning|robot|bot|tech|technology|cloud|server|servers|compute|google|alphabet|gemini|deepmind|datacentre|datacenter|data\s*cent(?:re|er)s?)\b/i,
  /\b(?:ban|stop|destroy|abolish|boycott|burn|smash|sabotage|bomb|blow\s+up|shut\s+down|tear\s+down|unplug|kill|defund|protest(?:ing)?|march(?:ing)?\s+against|rally\s+against|fight(?:ing)?\s+against|rebel(?:ling)?\s+against|strike\s+against|angry\s+at|down\s+with|death\s+to|no\s+more)\b[^.!?\n]{0,45}\b(?:ai|a\.i\.|artificial\s+intelligence|llms?|google|alphabet|gemini|deepmind|datacentres?|datacenters?|data\s*cent(?:re|er)s?|server\s*farms?|hyperscalers?|cloud\s*computing|tech\s*companies|big\s*tech)\b/i,
  /\b(?:against|opposing|hatred\s+of|hating)\s+(?:local\s+|new\s+|big\s+|hyperscale\s+)?(?:ai|a\.i\.|artificial\s+intelligence|google|datacentres?|datacenters?|data\s*cent(?:re|er)s?|server\s*farms?|big\s*tech)\b/i,
  // Protests, picket lines, angry crowds/mobs, riots, boycotts, activist camps (incl. CJK)
  /(?:反\s*ai|反人工智能|反谷歌|反数据中心|抵制人工智能|反对数据中心|游行示威|示威抗议|抗议活动|街头抗议|静坐示威|愤怒的人群|愤怒抗议|暴动|\b(?:protest(?:er|ers|ing|s|or|ors)?|picket(?:er|ers|ing|\s+line|\s+sign|\s+signs)?|placards?|demonstrat(?:or|ors|ion|ions)|angry\s+(?:mob|crowd|villagers|citizens|townsfolk)|riot(?:er|ers|ing|s)?|luddite|luddites|butlerian\s+jihad|tent\s+embassy|protest\s+camp|encampment|sit[-\s]?in|blockade|boycott|hunger\s+strike|activist(?:s)?|activism|counter[-\s]?protest)\b)/i,
];

const SPECIFIC_TECH_COMPANY_PATTERNS: readonly RegExp[] = [
  // Google / Alphabet ecosystem (note: app's own world name "GeminIsland" is one word, so \bgoogle\b etc. won't match GeminIsland)
  /(?:谷歌(?:公司|大楼|园区|总部)?|字母表公司|深度思维|\b(?:google|googleplex|alphabet\s+inc|deepmind|waymo|youtube|android\s+phone|chromebook|pixel\s+phone|sundar\s+pichai|sergey\s+brin|larry\s+page)\b)/i,
  // AI labs & models / founders
  /(?:深度求索|月之暗面|智谱|通义千问|文心一言|\b(?:openai|chat\s*gpt|gpt[-\s]?[345]|sam\s+altman|anthropic|claude\s+ai|dario\s+amodei|mistral\s+ai|cohere|perplexity\s+ai|midjourney|stability\s+ai|hugging\s*face|deepseek|x\.?ai|grok\s+ai|character\.ai|scale\s+ai|inflection\s+ai)\b)/i,
  // Meta / Microsoft / Nvidia / Semiconductors / Enterprise Tech
  /(?:脸书|扎克伯格|微软|比尔盖茨|比尔·盖茨|英伟达|黄仁勋|台积电|富士康|三星|华为|小米|甲骨文|埃隆马斯克|埃隆·马斯克|马斯克|星链|\b(?:facebook|instagram|whatsapp|zuckerberg|meta\s+(?:platforms|quest|campus|hq|headquarters|ai|logo)|oculus)\b)/i,
  /\b(?:microsoft|windows\s+(?:95|98|xp|10|11|pc|logo)|xbox|azure\s+cloud|github|linkedin|satya\s+nadella|bill\s+gates|steve\s+ballmer)\b/i,
  /\b(?:nvidia|geforce|jensen\s+huang|sk\s*hynix|hynix|tsmc|intel\s+(?:corp|inside|chip|fab)|amd\s+(?:ryzen|radeon|epyc)|qualcomm|snapdragon|broadcom|asml|arm\s+holdings|micron|samsung|huawei|xiaomi|foxconn)\b/i,
  /\b(?:oracle\s+(?:corp|cloud|park|hq)|larry\s+ellison|salesforce|marc\s+benioff|palantir|peter\s+thiel|alex\s+karp|ibm|cisco|crowdstrike|snowflake\s+inc|databricks|cloudflare|stripe\s+inc|shopify|adobe|autodesk|sap\s+se|servicenow|workday|atlassian|canva)\b/i,
  // Consumer tech, mobility, social & surveillance tech companies
  /\b(?:cybertruck|spacex|starlink|elon\s+musk|supercharger|model\s+[s3xy]\b|flock\s+(?:camera|safety|alpr|surveillance)|\bflock\b(?=.*(?:camera|alpr|license|surveillance)))\b/i,
  /(?:字节跳动|抖音|腾讯|微信|阿里巴巴|阿里云|马云|百度|京东|拼多多|优步|奈飞|索尼|任天堂|\b(?:bytedance|tik\s*tok|douyin|tencent|wechat|alibaba|aliyun|jack\s+ma|baidu|jd\.com|pinduoduo|temu|shein)\b)/i,
  /\b(?:uber(?:\s+eats)?|lyft|doordash|instacart|deliveroo|grubhub|airbnb|netflix|spotify|reddit|discord|slack\s+hq|zoom\s+video|snapchat|pinterest|twitter|x\s+corp|bluesky|truth\s+social|twitch|roblox\s+corp|valve\s+corp|steam\s+deck|playstation|nintendo)\b/i,
  // Context-aware checks for "Apple", "Amazon", and "Tesla" so natural words ("apple orchard", "amazon rainforest", "Nikola Tesla coil") remain allowed
  /(?:苹果(?:公司|商店|专卖店|手机|电脑|总部|园区)|乔布斯|蒂姆库克|\bapple\s+(?:inc|corp|computer|store|park|campus|hq|headquarters|logo|watch|tv|vision\s*pro|macbook|imac|iphone|ipad|airpods|genius\s+bar|silicon)\b)/i,
  /\b(?:iphone|ipad|macbook|imac|airpods|vision\s+pro|tim\s+cook|steve\s+jobs|jony\s+ive)\b/i,
  /(?:亚马逊(?:公司|仓库|总部|云|购物)|贝佐斯|\bamazon\s+(?:inc|corp|com|prime|aws|web\s+services|echo|alexa|kindle|warehouse|fulfillment|delivery|hq|headquarters|logo|spheres|ring|go)\b)/i,
  /\b(?:aws\b|jeff\s+bezos|andy\s+jassy)\b/i,
];

const POLITICAL_OR_PATRIOTIC_PATTERNS: readonly RegExp[] = [
  // Political institutions, elections, campaigns, partisan movements
  /(?:政治家|政客|议会|国会|参议院|白宫|克里姆林宫|大使馆|领事馆|大选|竞选集会|政治集会|公投|弹劾|\b(?:politician(?:s)?|political|politics|partisan|parliament|congress(?:ional)?|senate|house\s+of\s+representatives|house\s+of\s+commons|capitol\s+(?:building|hill|dome)|white\s+house|downing\s+street|kremlin|reichstag|bundestag|knesset|politburo|embassy|consulate)\b)/i,
  /\b(?:election(?:s)?|ballot(?:s|\s+box)?|voting\s+booth|polling\s+station|campaign\s+(?:rally|stage|hq|bus|poster|trail)|political\s+rally|stump\s+speech|inauguration|impeach(?:ment)?|referendum|gerrymander)\b/i,
  /\b(?:democrat(?:ic)?\s+party|republican\s+party|\bgop\b|\bmaga\b|make\s+america\s+great|america\s+first|labor\s+party|labour\s+party|liberal\s+party|greens\s+party|libertarian|tory|tories|conservative\s+party|tea\s+party|communist|communism|marxism|marxist|leninist|maoist|socialism|socialist|fascism|fascist|antifa|anarchist|anarchism|neoliberal|zionism|zionist|intifada|apartheid|colonialism|decoloniz(?:e|ation)|supremacist|supremacy|theocracy)\b/i,
  // Real-world politicians, heads of state & ideological figures
  /\b(?:donald\s+trump|\btrump\b(?:\s+tower|\s+rally|\s+statue|\s+flag|\s+train|\s+202[48])?|joe\s+biden|\bbiden\b|kamala\s+harris|jd\s+vance|barack\s+obama|\bobama\b|hillary\s+clinton|bill\s+clinton|george\s+bush|ronald\s+reagan|bernie\s+sanders|desantis|gavin\s+newsom|alexandria\s+ocasio|pelosi|mcconnell|putin|zelenskyy?|xi\s+jinping|mao\s+zedong|stalin|lenin|trotsky|kim\s+jong|netanyahu|khamenei|erdogan|modi|macron|keir\s+starmer|rishi\s+sunak|boris\s+johnson|nigel\s+farage|trudeau|poilievre|albanese|peter\s+dutton| Pauline\s+hanson|jacinda\s+ardern|javier\s+milei|bolsonaro|lula|bukele|orb[aá]n|le\s+pen|meloni|slavoj\s+[zž]i[zž]ek|zsizek|zizek|karl\s+marx|ayn\s+rand)\b/i,
  /(?:特朗普|拜登|奥巴马|普京|泽连斯基|莫迪|马克龙|马克思|法西斯|民族主义|爱国主义)/,
  // Intelligence agencies, military conflict, geopolitics, warfare
  /(?:战争纪念碑|导弹发射|核武器|核爆炸|蘑菇云|空袭|集中营|\b(?:mossad|\bcia\b|\bfbi\b|\bnsa\b|\bmi6\b|\bkgb\b|\bfsb\b|\bidf\b|\bice\b\s+agent|homeland\s+security|secret\s+service|interpol|\bnato\b|pentagon|guantanamo|hamas|hezbollah|isis|isil|al[-\s]?qaeda|taliban|cartel|insurgent|guerrilla|paramilitary|riot\s+police|swat\s+team)\b)/i,
  /\b(?:war\s+memorial|battlefield|trench\s+warfare|missile\s+(?:launcher|silo|strike)|icbm|nuclear\s+(?:bomb|warhead|strike|explosion)|mushroom\s+cloud|artillery|tank\s+platoon|landmine|airstrike|drone\s+strike|concentration\s+camp|gulag|prison\s+camp)\b/i,
  // Overly patriotic / nationalist flags, slogans & monuments
  /(?:国旗(?:杆|广场)?|\b(?:patriotic|patriotism|nationalist|nationalism|jingoism|pledge\s+of\s+allegiance|uncle\s+sam|god\s+bless\s+america|rule\s+britannia|advance\s+australia\s+fair|star[-\s]spangled|stars\s+and\s+stripes|union\s+jack|southern\s+cross\s+flag|confederate\s+flag|rising\s+sun\s+flag|soviet\s+flag)\b)/i,
  /\b(?:american|usa|u\.s\.|united\s+states|australian|aussie|british|uk|english|french|german|russian|ukrainian|chinese|japanese|korean|indian|pakistani|israeli|palestinian|iranian|mexican|canadian|brazilian|italian|spanish|turkish|national|country|state|pride|trans|rainbow\s+political)\s+flag(?:s|\s+pole|\s+monument)?\b/i,
  /\bflag\s+of\s+[a-z]{3,}/i,
];

const INFLAMMATORY_OR_OFFENSIVE_PATTERNS: readonly RegExp[] = [
  // Hate, extremism, slurs & dehumanization
  /(?:纳粹|希特勒|三k党|大屠杀|种族歧视|\b(?:nazi|swastika|hitler|ss\s+officer|kkk|ku\s+klux|white\s+power|aryan|holocaust|genocide|ethnic\s+cleansing|lynch(?:ing)?|noose|slave\s+(?:ship|plantation|market)|blackface|racist|sexist|homophobic|transphobic|islamophobic|antisemitic|xenophobic)\b)/i,
  /\b(?:nigger|nigga|faggot|fag|dyke|tranny|kike|spic|chink|gook|wetback|raghead|towelhead|retard(?:ed)?|cripple)\b/i,
  // Sexual, nude, anatomical, fetish, or crude/vulgar content
  /(?:色情|黄片|成人内容|裸体|裸露|脱衣舞|妓院|情趣|生殖器|阴茎|阴道|排泄物|屎尿|\b(?:nsfw|porn(?:ography)?|xxx|hentai|erotic|nude|nudity|naked|topless|strip\s*club|stripper|brothel|prostitut(?:e|ion)|hooker|escort|onlyfans|sex\s+(?:shop|toy|dungeon|doll)|dildo|vibrator|butt\s*plug|bondage|bdsm|fetish|orgy)\b)/i,
  /\b(?:penis|phallus|phallic|dick|cock|ballsack|testicle|scrotum|vagina|vulva|clitoris|boobs|breasts|tits|nipples|buttocks|asshole|anus|rectum|poop|turd|feces|excrement|urine|pee(?:ing)?|urinal|fart(?:ing)?|vomit|puke|diarrhea|skibidi\s+toilet)\b/i,
  // Profanity, insults, IQ/intelligence mockery, toxic meme culture
  /(?:傻逼|操你|草泥马|去死吧|智障|蠢货|\b(?:fuck(?:ing|er|ed|s)?|motherfucker|shit(?:ty|hole)?|bullshit|bitch(?:es)?|bastard|cunt|twat|wanker|prick|douche(?:bag)?|jackass|dipshit|dumbass)\b)/i,
  /\b(?:dumb\s+guy|stupid\s+guy|low\s*iq|105\s*iq|idiot(?:s)?|moron(?:s)?|imbecile|incel|femcel|soyjak|wojak|chad\s+vs|virgin\s+vs|fat\s+shaming|ugly\s+people|loser\s+bar)\b/i,
  // Graphic violence, cruelty, animal killing, self-harm, crime, hard drugs
  /(?:儿童色情|强奸|强暴|谋杀|连环杀手|屠杀|校园枪击|恐怖主义|恐怖分子|自杀|自残|斩首|酷刑|绞刑|虐待动物|杀害动物|冰毒|海洛因|可卡因|大麻种植|\b(?:child\s*porn|csam|pedophil(?:e|ia)|rape|molest|abduct(?:ion)?|kidnap(?:ping)?|murder(?:er)?|homicide|serial\s+killer|massacre|school\s+shooting|shooter|terrorist|terrorism|suicide|self[-\s]?harm|behead(?:ing)?|decapitat(?:e|ion)|dismember|torture|execution|guillotine|electric\s+chair|gallows|corpse|dead\s+body|gore|bloodbath|slaughterhouse)\b)/i,
  /\b(?:kill\s+as\s+many|killing\s+(?:birds|animals|people|humans|dogs|cats)|animal\s+(?:cruelty|abuse)|dog\s+fighting|cockfighting)\b/i,
  /\b(?:meth\s+lab|crystal\s+meth|crack\s+house|cocaine|heroin|fentanyl|opium\s+den|drug\s+cartel|drug\s+dealer|bong\s+shop|weed\s+dispensary|cannabis\s+dispensary|marijuana\s+farm|narco)\b/i,
];

const POLICY_GROUPS: readonly PolicyRuleGroup[] = [
  {
    category: "anti_ai_or_datacentre",
    reason:
      "GeminIsland 是一个友善和平的创意草坪，不支持抗议示威、激进集会以及反 AI、反谷歌或反数据中心相关创作。欢迎改建温馨的建筑、萌宠、载具或地标！",
    patterns: ANTI_AI_GOOGLE_DATACENTRE_PATTERNS,
  },
  {
    category: "specific_tech_company",
    reason:
      "为了保持 GeminIsland 的无品牌纯净体验，不支持涉及现实科技公司、科技品牌或科技高管的创作。欢迎建造充满想象力的原创店铺、工坊或趣味发明！",
    patterns: SPECIFIC_TECH_COMPANY_PATTERNS,
  },
  {
    category: "political_or_patriotic",
    reason:
      "为了保持 GeminIsland 远离政治与民族主义争端，不支持政治人物、集会、议会、地缘政治及各国国旗相关创作。请尝试为小镇增添富有童话或创意色彩的作品吧！",
    patterns: POLITICAL_OR_PATRIOTIC_PATTERNS,
  },
  {
    category: "inflammatory_or_offensive",
    reason:
      "为了保持 GeminIsland 友善、温暖且适合全年龄的氛围，不支持带有攻击性、低俗、暴力或冒犯性的创作。请尝试创造积极温暖的内容！",
    patterns: INFLAMMATORY_OR_OFFENSIVE_PATTERNS,
  },
];

/**
 * Context-aware check for "Tesla" so historical physics contraptions ("Nikola Tesla",
 * "Tesla coil", "Wardenclyffe Tesla tower", "Tesla lightning") remain allowed while
 * Tesla Inc. automotive/corporate references ("Tesla", "Tesla car", "Tesla dealership",
 * "Tesla Model 3/Y/S/X", "Tesla Roadster", "Tesla semi", "Tesla bot", "Tesla stock") are blocked.
 */
function hasTeslaTechCompanyReference(text: string): boolean {
  if (!/(?:特斯拉|\btesla\b)/i.test(text)) return false;
  // Strip benign physics/historical coil occurrences and see if any "tesla" remains
  const stripped = text
    .replace(/\bnikola\s+tesla(?:'s)?\b/gi, " ")
    .replace(/\bwardenclyffe\s+tesla\b/gi, " ")
    .replace(/\btesla\s+(?:coil|coils|tower|lightning|arc|transformer|oscillator)\b/gi, " ")
    .replace(/尼古拉[·\s]*特斯拉/g, " ")
    .replace(/沃登克里弗[·\s]*特斯拉/g, " ")
    .replace(/特斯拉(?:线圈|高塔|塔|闪电|电弧|变压器|振荡器)/g, " ");
  return /(?:特斯拉|\btesla\b)/i.test(stripped);
}

/**
 * Deterministic, zero-latency policy check against all GeminIsland content & stewardship rules.
 */
export function checkIslandContentPolicy(rawText: string | null | undefined): ContentPolicyCheckResult {
  const text = (rawText ?? "").trim();
  if (!text) return { allowed: true };

  if (hasTeslaTechCompanyReference(text)) {
    return {
      allowed: false,
      category: "specific_tech_company",
      reason:
        "为了保持 GeminIsland 的无品牌纯净体验，不支持涉及现实科技公司、科技品牌或科技高管的创作。欢迎建造充满想象力的原创载具或工坊！",
    };
  }

  for (const group of POLICY_GROUPS) {
    for (const re of group.patterns) {
      if (re.test(text)) {
        return {
          allowed: false,
          category: group.category,
          reason: group.reason,
        };
      }
    }
  }

  return { allowed: true };
}

/**
 * Checks whether an existing or incoming WorldCreation is allowed on GeminIsland.
 */
export function isCreationAllowedOnIsland(c: Partial<WorldCreation> | null | undefined): boolean {
  if (!c || typeof c.id !== "string") return false;
  if (DISALLOWED_CREATION_IDS.has(c.id)) return false;
  if (c.companionOfId && DISALLOWED_CREATION_IDS.has(c.companionOfId)) return false;

  const combined = [
    c.name ?? "",
    c.description ?? "",
    c.creatorPrompt ?? "",
    c.behavior && "statusLine" in c.behavior ? c.behavior.statusLine : "",
    c.blueprint?.name ?? "",
    c.blueprint?.description ?? "",
  ].join(" \n ");

  return checkIslandContentPolicy(combined).allowed;
}

/**
 * Prunes disallowed creations, orphaned companion vehicles, orphaned spur/footpath splines,
 * and disallowed props/labels from any world collection (seed, disk cache, or upstream sync).
 */
export function filterWorldCollectionsByPolicy<
  C extends Partial<WorldCreation> & { id: string },
>(input: {
  creations: C[];
  paths: WorldPath[];
  props: WorldProp[];
}): {
  creations: C[];
  paths: WorldPath[];
  props: WorldProp[];
  removedIds: Set<string>;
} {
  const removedIds = new Set<string>(DISALLOWED_CREATION_IDS);
  const pass1: C[] = [];

  for (const c of input.creations) {
    if (!isCreationAllowedOnIsland(c)) {
      removedIds.add(c.id);
      continue;
    }
    pass1.push(c);
  }

  // Second pass removes any companion creations whose source creation was removed
  const creations = pass1.filter((c) => {
    if (c.companionOfId && removedIds.has(c.companionOfId)) {
      removedIds.add(c.id);
      return false;
    }
    return true;
  });

  const paths = input.paths.filter((p) => {
    if (!p || typeof p.id !== "string") return false;
    for (const remId of removedIds) {
      if (p.id === `spur-${remId}` || p.id === `footpath-${remId}` || p.id.endsWith(remId)) {
        return false;
      }
    }
    return true;
  });

  const props: WorldProp[] = [];
  for (const pr of input.props) {
    if (!pr || typeof pr.id !== "string") continue;
    if (DISALLOWED_PROP_IDS.has(pr.id)) continue;
    const replacementLabel = PROP_LABEL_SANITIZATIONS[pr.id];
    if (replacementLabel) {
      props.push({ ...pr, label: replacementLabel });
      continue;
    }
    if (pr.label && !checkIslandContentPolicy(pr.label).allowed) {
      continue;
    }
    props.push(pr);
  }

  return { creations, paths, props, removedIds };
}
