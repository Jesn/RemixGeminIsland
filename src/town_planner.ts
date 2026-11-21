import type {
  CreationCategory,
  PathKind,
  RouteStop,
  ScaleClass,
  TrafficIncidentRecord,
  WorldCreation,
  WorldPath,
  WorldProp,
  WorldStateSnapshot,
} from "./types";
import { distPointToPolyline2D, OUTER_RING_ROAD_POINTS, sampleCatmullRom2D } from "./voxel_audit";
import { detectBlueprintFrontAngle, getCreationFootprintRadius } from "./voxel_dsl";

export function ensureOuterRingRoad(paths: WorldPath[]): boolean {
  if (paths.some((p) => p.id === "path-outer-ring")) return false;
  const insertIdx = paths.findIndex((p) => p.id === "path-main-loop");
  const outerRing: WorldPath = {
    id: "path-outer-ring",
    kind: "road",
    points: OUTER_RING_ROAD_POINTS.map(([x, z]) => [x, z] as [number, number]),
    closed: true,
  };
  if (insertIdx >= 0) {
    paths.splice(insertIdx + 1, 0, outerRing);
  } else {
    paths.unshift(outerRing);
  }
  return true;
}

function rotateClosedWaypointsNear(
  pts: [number, number][],
  refX: number,
  refZ: number,
): [number, number][] {
  if (pts.length < 3) return pts;
  let bestIdx = 0;
  let bestD = Infinity;
  for (let i = 0; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - refX, pts[i][1] - refZ);
    if (d < bestD) {
      bestD = d;
      bestIdx = i;
    }
  }
  if (bestIdx === 0) return pts.map(([x, z]) => [x, z]);
  return pts.map((_, i) => {
    const p = pts[(bestIdx + i) % pts.length];
    return [p[0], p[1]];
  });
}

import { BAGUA_ISLAND_CENTER, getBaguaIslandInlandMargin } from "./bagua_island";
import { KUNLUN_ISLAND_CENTER, getKunlunIslandInlandMargin } from "./kunlun_island";

export const ISLAND_HALF_EXTENT = 163.5;
export const ISLAND_SUPERELLIPSE_EXP = 3.1;

export function getIslandCoastWarp(theta: number): number {
  return (
    9.2 * Math.cos(2 * theta + 1.55) +
    7.8 * Math.sin(3 * theta + 0.75) +
    5.6 * Math.cos(4 * theta + 3.08) +
    4.1 * Math.sin(5 * theta - 0.85) +
    2.6 * Math.cos(7 * theta + 0.4)
  );
}

export function getMainIslandInlandMargin(x: number, z: number): number {
  const ax = Math.abs(x) / ISLAND_HALF_EXTENT;
  const az = Math.abs(z) / ISLAND_HALF_EXTENT;
  const superDist =
    Math.pow(
      Math.pow(ax, ISLAND_SUPERELLIPSE_EXP) + Math.pow(az, ISLAND_SUPERELLIPSE_EXP),
      1 / ISLAND_SUPERELLIPSE_EXP,
    ) * ISLAND_HALF_EXTENT;
  const theta = Math.atan2(z, x);
  return ISLAND_HALF_EXTENT + getIslandCoastWarp(theta) - superDist;
}

/**
 * Signed distance (in meters) inward from the nearest flat buildable island plateau rim
 * across Main GeminIsland [0,0], East Bagua Island [498.24,0], or North Kunlun Frost Isle [340,-480].
 */
export function getIslandInlandMargin(x: number, z: number): number {
  return Math.max(
    getMainIslandInlandMargin(x, z),
    getBaguaIslandInlandMargin(x, z),
    getKunlunIslandInlandMargin(x, z),
  );
}

function pickNearestIslandMeta(x: number, z: number): {
  center: [number, number];
  marginFn: (px: number, pz: number) => number;
  key: "main" | "bagua" | "kunlun";
} {
  const mMain = getMainIslandInlandMargin(x, z);
  const mBagua = getBaguaIslandInlandMargin(x, z);
  const mKunlun = getKunlunIslandInlandMargin(x, z);
  if (mKunlun >= mMain && mKunlun >= mBagua) {
    return { center: KUNLUN_ISLAND_CENTER, marginFn: getKunlunIslandInlandMargin, key: "kunlun" };
  }
  if (mBagua > mMain) {
    return { center: BAGUA_ISLAND_CENTER, marginFn: getBaguaIslandInlandMargin, key: "bagua" };
  }
  return { center: [0, 0], marginFn: getMainIslandInlandMargin, key: "main" };
}

export function getNearestIslandCenter(x: number, z: number): [number, number] {
  return pickNearestIslandMeta(x, z).center;
}

export function clampPointToIsland(x: number, z: number, minInlandMargin = 3.0): [number, number] {
  if (getIslandInlandMargin(x, z) >= minInlandMargin) return [x, z];
  const { center, marginFn } = pickNearestIslandMeta(x, z);
  const [cx, cz] = center;
  const dx = x - cx;
  const dz = z - cz;
  const r = Math.hypot(dx, dz);
  if (r < 0.001) return [cx, cz];
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) * 0.5;
    if (marginFn(cx + dx * mid, cz + dz * mid) >= minInlandMargin) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return [cx + dx * lo, cz + dz * lo];
}

export type TownPlanningRole =
  | "mobile"
  | "natural_scenic"
  | "remote_industrial"
  | "downtown_civic"
  | "neighborhood_cottage";

const NATURAL_SCENIC_RE =
  /\b(waterfall|cascade|cataract|cliff|gorge|canyon|volcano|stratovolcano|caldera|mountain|peak|glacier|island|atoll|coast|coastline|vista|beach|shore|cove|reef|lagoon|oasis|forest|woods|grove|world\s*tree|cave|cavern|geyser|hot\s*spring|hammock|lounger)\b|(?:瀑布|悬崖|峡谷|火山|高山|山峰|冰川|岛屿|海岛|海岸|沙滩|海滩|海湾|礁石|潟湖|绿洲|森林|树林|世界树|洞穴|间歇泉|温泉|吊床|躺椅)/i;

const REMOTE_INDUSTRIAL_RE =
  /\b(quarry|mine|mining|coal\s*pit|ore\s*pit|excavat|launchpad|launch\s*pad|spaceport|rocket\s*pad|oil\s*rig|refinery|smelter|power\s*plant|reactor|wind\s*farm|solar\s*farm)\b|(?:采石场|矿场|矿山|采矿|煤矿|矿坑|挖掘|发射台|航天港|火箭发射|钻井|精炼厂|冶炼厂|发电厂|反应堆|风力发电|光伏)/i;

const GEOLOGICAL_EXCAVATION_RE =
  /\b(quarry|mine|mining|pit|crater|excavat|oil\s*rig)\b|(?:采石场|矿场|矿山|采矿|矿坑|陨石坑|火山口|挖掘|钻井)/i;

const DOWNTOWN_CIVIC_RE =
  /\b(tower|skyscraper|high-?rise|office|datacentre|datacenter|server|cloud|parliament|capitol|city\s*hall|courthouse|firehouse|fire\s*station|police|hospital|station|clocktower|museum|library|archive|wikipedia|university|arena|stadium|amphitheater|amphitheatre|colosseum|cathedral|palace|pavilion|retail|mall|store|bank|hotel|ihop|ziggurat|diner|cinema|theater|theatre)\b|(?:高塔|摩天大楼|写字楼|数据中心|服务器|议会|市政厅|法院|消防站|消防局|警局|医院|车站|钟楼|博物馆|图书馆|档案馆|百科|大学|竞技场|体育场|剧场|大教堂|宫殿|展馆|商场|百货|商店|银行|酒店|餐厅|影院)/i;

/**
 * Classifies any creation into an intelligent SimCity town-planning role so the orchestrator
 * knows whether it belongs on an orthogonal downtown block, a neighborhood cottage lane,
 * a distant industrial highway, or a natural perimeter vista.
 */
export function classifyTownPlanningRole(
  text: string,
  category: CreationCategory,
  scaleClass: ScaleClass,
): TownPlanningRole {
  if (
    category === "vehicle" ||
    category === "aircraft" ||
    category === "watercraft" ||
    category === "creature"
  ) {
    return "mobile";
  }
  if (NATURAL_SCENIC_RE.test(text)) {
    return "natural_scenic";
  }
  if (REMOTE_INDUSTRIAL_RE.test(text)) {
    return "remote_industrial";
  }
  if (DOWNTOWN_CIVIC_RE.test(text) || scaleClass === "colossal") {
    return "downtown_civic";
  }
  return "neighborhood_cottage";
}

/**
 * Determines whether a stationary creation should rotate to face its fronting street.
 * Architectural buildings, shops, cottages, courts, and towers face the street;
 * quarries, mines, waterfalls, cliffs, volcanoes, islands, and beach hammocks do NOT.
 */
export function shouldCreationFaceRoad(creation: WorldCreation): boolean {
  if (creation.isSeed || creation.isCompanion) return false;
  if (creation.behavior && creation.behavior.type !== "landmark") return false;
  if (
    creation.category === "vehicle" ||
    creation.category === "aircraft" ||
    creation.category === "watercraft" ||
    creation.category === "creature"
  ) {
    return false;
  }
  const text = `${creation.name} ${creation.creatorPrompt ?? ""} ${creation.description ?? ""}`;
  if (NATURAL_SCENIC_RE.test(text)) return false;
  if (GEOLOGICAL_EXCAVATION_RE.test(text)) return false;
  return true;
}

function wrapAnglePi(rad: number): number {
  let a = rad;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

/**
 * Snaps a world-space facing angle (where `0` = `+Z` South, `Math.PI/2` = `+X` East,
 * `Math.PI` = `-Z` North, `-Math.PI/2` = `-X` West) to crisp SimCity urban angles:
 * - Cardinal `90°` increments (`0`, `±π/2`, `π`) whenever within `24°` of a cardinal axis
 * - Clean `45°` diagonal (`±π/4`, `±3π/4`) when fronting a diagonal boulevard!
 */
export function snapAngleToSimCityGrid(rawWorldYaw: number): number {
  const wrapped = wrapAnglePi(rawWorldYaw);
  const nearestCardinal = Math.round(wrapped / (Math.PI / 2)) * (Math.PI / 2);
  if (Math.abs(wrapAnglePi(wrapped - nearestCardinal)) <= 0.42) {
    return Number(wrapAnglePi(nearestCardinal).toFixed(4));
  }
  const nearestOctant = Math.round(wrapped / (Math.PI / 4)) * (Math.PI / 4);
  return Number(wrapAnglePi(nearestOctant).toFixed(4));
}

/**
 * Computes a clean, uniform SimCity street-facing `yaw` for architectural buildings,
 * or returns `null` for quarries, waterfalls, cliffs, islands, and mobile creations.
 */
export function computeIntelligentBuildingYaw(
  creation: WorldCreation,
  paths: WorldPath[],
): number | null {
  if (!shouldCreationFaceRoad(creation)) return null;

  // Prefer primary streets (`road`, `cottage_road`, `cobblestone`) within 26m over tiny footpaths
  const streetKinds = new Set(["road", "cottage_road", "cobblestone"]);
  let bestStreetDist = Infinity;
  let bestStreetTarget: [number, number] | null = null;
  let bestAnyDist = Infinity;
  let bestAnyTarget: [number, number] | null = null;

  for (const p of paths) {
    if (!p.points || p.points.length < 2) continue;
    // Ignore creation's own tiny doorway spur if a real avenue/lane is nearby so buildings align to the street block, not a diagonal stub
    const isOwnSpur = p.id === `spur-${creation.id}` || p.id === `initpath-${creation.id}`;
    const curve = sampleCatmullRom2D(p.points, Boolean(p.closed), 1.0, Boolean(p.linear));
    const hit = distPointToPolyline2D(creation.x, creation.z, curve);

    if (!isOwnSpur && streetKinds.has(p.kind) && hit.dist < bestStreetDist) {
      bestStreetDist = hit.dist;
      bestStreetTarget = [hit.closestX, hit.closestZ];
    }
    if (!isOwnSpur && hit.dist < bestAnyDist) {
      bestAnyDist = hit.dist;
      bestAnyTarget = [hit.closestX, hit.closestZ];
    }
  }

  const chosenTarget =
    bestStreetTarget && bestStreetDist <= 28.0 ? bestStreetTarget : bestAnyTarget;
  if (!chosenTarget) return null;

  const dx = chosenTarget[0] - creation.x;
  const dz = chosenTarget[1] - creation.z;
  if (Math.hypot(dx, dz) < 0.4) return null;

  const worldDirToStreet = Math.atan2(dx, dz);
  const snappedStreetDir = snapAngleToSimCityGrid(worldDirToStreet);
  const localFront = detectBlueprintFrontAngle(creation.blueprint);
  return Number(wrapAnglePi(snappedStreetDir - localFront).toFixed(3));
}

/**
 * Chooses a SimCity-aligned plot for newly placed creations when no manual spot is forced
 * (or nudges cleanly around an occupied spot).
 */
export function chooseSimCityPlot(opts: {
  reqX: number | null | undefined;
  reqZ: number | null | undefined;
  category: CreationCategory;
  scaleClass: ScaleClass;
  newRadius: number;
  contextText: string;
  world: Omit<WorldStateSnapshot, "myCreationId">;
  isSpotClear: (x: number, z: number) => boolean;
}): [number, number] {
  const { reqX, reqZ, category, scaleClass, newRadius, contextText, world, isSpotClear } = opts;
  const snapGrid = (v: number) => Math.round(v / 2) * 2;

  if (
    typeof reqX === "number" &&
    Number.isFinite(reqX) &&
    typeof reqZ === "number" &&
    Number.isFinite(reqZ)
  ) {
    const [cx, cz] = clampPointToIsland(reqX, reqZ, newRadius + 2.8);
    const reqIsland = pickNearestIslandMeta(reqX, reqZ).key;
    const matchesRequestedIsland = (px: number, pz: number): boolean =>
      pickNearestIslandMeta(px, pz).key === reqIsland &&
      getIslandInlandMargin(px, pz) >= newRadius + 2.4;
    if (isSpotClear(cx, cz)) {
      return [Number(cx.toFixed(1)), Number(cz.toFixed(1))];
    }
    // Fine-grained spiral search around user-requested spot (staying on the requested island)
    for (let rad = 1.6; rad <= 26; rad += 1.6) {
      for (let k = 0; k < 16; k++) {
        const ang = (k / 16) * Math.PI * 2;
        const tx = Number((cx + Math.cos(ang) * rad).toFixed(1));
        const tz = Number((cz + Math.sin(ang) * rad).toFixed(1));
        if (matchesRequestedIsland(tx, tz) && isSpotClear(tx, tz)) {
          return [tx, tz];
        }
      }
    }
    for (let step = 4; step <= 88; step += 4) {
      const offsets: [number, number][] = [
        [step, 0],
        [-step, 0],
        [0, step],
        [0, -step],
        [step, step],
        [-step, step],
        [step, -step],
        [-step, -step],
      ];
      for (const [ox, oz] of offsets) {
        const tx = snapGrid(cx + ox);
        const tz = snapGrid(cz + oz);
        if (matchesRequestedIsland(tx, tz) && isSpotClear(tx, tz)) {
          return [tx, tz];
        }
      }
    }
  }

  const role = classifyTownPlanningRole(contextText, category, scaleClass);

  // 1. Remote industrial (quarries, mines, launchpads) -> outer frontier zones (r = 96..134m)
  if (role === "remote_industrial") {
    const frontierCandidates: [number, number][] = [
      [126, -116],
      [-18, -126],
      [118, -82],
      [-96, -104],
      [112, 88],
      [-108, 86],
    ];
    for (const [fx, fz] of frontierCandidates) {
      if (isSpotClear(fx, fz)) return [fx, fz];
    }
  }

  // 2. Natural scenic (waterfalls, cliffs, volcanoes, islands, beaches) -> scenic perimeter rim
  if (role === "natural_scenic") {
    const scenicCandidates: [number, number][] = [
      [-16, 88],
      [82, 34],
      [58, 26],
      [-86, 68],
      [26, 92],
      [92, -38],
      [-92, -48],
    ];
    for (const [sx, sz] of scenicCandidates) {
      if (isSpotClear(sx, sz)) return [sx, sz];
    }
  }

  // 3. City & village buildings -> orthogonal street-block frontage along roads & cottage lanes
  if (role === "downtown_civic" || role === "neighborhood_cottage") {
    const preferredKind =
      role === "downtown_civic"
        ? new Set(["road", "cobblestone"])
        : new Set(["cottage_road", "cobblestone", "road"]);
    const streets = world.paths.filter(
      (p) => preferredKind.has(p.kind) && p.points && p.points.length >= 2,
    );
    for (const st of streets) {
      const curve = sampleCatmullRom2D(st.points, Boolean(st.closed), 6.0, Boolean(st.linear));
      const halfW = st.kind === "road" ? 3.2 : 2.0;
      const setback = Math.ceil((halfW + newRadius + 2.8) / 2) * 2;
      for (let i = 1; i < curve.length - 1; i++) {
        const pt = curve[i];
        const prev = curve[i - 1];
        const next = curve[i + 1];
        const dx = next[0] - prev[0];
        const dz = next[1] - prev[1];
        const len = Math.hypot(dx, dz);
        if (len < 0.1) continue;
        // Snap perpendicular to exact SimCity grid normal
        const rawPerp = Math.atan2(-dz / len, dx / len);
        const gridNorm = snapAngleToSimCityGrid(rawPerp);
        const nx = Math.sin(gridNorm);
        const nz = Math.cos(gridNorm);
        for (const side of [1, -1]) {
          const tx = snapGrid(pt[0] + nx * setback * side);
          const tz = snapGrid(pt[1] + nz * setback * side);
          // Never place inside Central Park [-22..22, -18..18]
          if (Math.abs(tx) < 23 && Math.abs(tz) < 19) continue;
          const r = Math.hypot(tx, tz);
          if (r < 26 || r > 116) continue;
          if (isSpotClear(tx, tz)) {
            return [tx, tz];
          }
        }
      }
    }
  }

  // 4. Structured orthogonal ring fallback on 8m grid steps
  const minRing = newRadius >= 8.5 ? 48 : 32;
  for (let ring = minRing; ring <= 128; ring += 12) {
    for (let u = -ring; u <= ring; u += 8) {
      const candidates: [number, number][] = [
        [u, -ring],
        [u, ring],
        [-ring, u],
        [ring, u],
      ];
      for (const [tx, tz] of candidates) {
        if (isSpotClear(tx, tz)) return [tx, tz];
      }
    }
  }
  return [56, -48];
}

/**
 * Identity + purpose descriptions ("what it is, and what its role or intention is")
 * for all seed and established creations on GeminIsland — avoiding redundant visual
 * geometry/material inventories since viewers can already see the 3D model.
 */
export const FACTUAL_CREATION_DESCRIPTIONS: Record<string, { description: string; statusLine: string }> = {
  "seed-school-bus": {
    description: "沿中央环线穿梭接送小镇居民与通勤乘客的小镇校车。",
    statusLine: "正在中央通勤环线绕行接送乘客",
  },
  "seed-windmill-bakery": {
    description: "为西村居民研磨谷物并烘焙新鲜面包的邻里风车面包坊。",
    statusLine: "正在研磨谷物并烘焙新鲜面包",
  },
  "seed-clocktower-station": {
    description: "连接小镇巴士与接驳线路的中央交通枢纽与钟楼车站。",
    statusLine: "小镇巴士与接驳线路交汇的中央枢纽",
  },
  "seed-matcha-bookshop": {
    description: "供小镇居民歇脚品茶、翻阅图书的街角书店兼茶室。",
    statusLine: "街角邻里书店与抹茶茶室",
  },
  "seed-meadow-pup": {
    description: "在中央绿地漫步迎宾、活力满满的小镇小狗。",
    statusLine: "正在中央草坪欢快巡游的小狗",
  },
  "seed-pond-duck": {
    description: "常驻在小镇中央三叶草池塘里悠闲游水的绿头鸭。",
    statusLine: "正在三叶草池塘惬意游水",
  },
  "c-mvm7qli8-4h2k": {
    description: "为北部科技园区提供稳定服务器算力的云计算数据中心。",
    statusLine: "正在稳定运行区域云计算负载",
  },
  "c-mvmvo1vh-47fbad": {
    description: "在高山瀑布与小镇地标之间高空翱翔的草坪飞龙。",
    statusLine: "正在小岛上空盘旋巡游的飞龙",
  },
  "c-mvn0lbb4-74136e": {
    description: "从西北海岸山崖倾泻入海、为岛屿溪流注入清冽山泉的海岸瀑布。",
    statusLine: "在西北海岸山崖奔流倾泻的瀑布",
  },
  "c-mvn8g9cn-a857de": {
    description: "灵感来自“住在鞋里的老妇人”童谣的巨型靴子造型家庭住宅。",
    statusLine: "西区小巷旁的靴子造型小屋",
  },
  "c-mvn9yxeh-1d5644": {
    description: "展示各式厨房电器与家居用品的市中心家电展厅。",
    statusLine: "市中心厨房家电展厅",
  },
  "c-mvnbcub6-d06441": {
    description: "为当地机器人供应墨西哥卷饼与备用零件的路边卷饼小馆。",
    statusLine: "专为本地机器人打造的卷饼小馆",
  },
  "c-mvnbmbqg-48aa8f": {
    description: "位于西区乡间小路旁、供邻里约战匹克球的社区球场。",
    statusLine: "开放休闲对战的社区匹克球场",
  },
  "c-mvnc3mga-c6ea36": {
    description: "位于南大街、为本地居民和旅人提供冰镇饮品的乡村酒馆。",
    statusLine: "南大街上的澳式乡村酒馆",
  },
  "c-mvnc7tlr-6784e6": {
    description: "位于东北山丘、为城市开采稀土矿产的露天矿场。",
    statusLine: "正在为城市供应稀土矿产的矿场",
  },
  "c-mvnd5i04-14bfd5": {
    description: "适合邻里双打对决的封闭式板式网球社区球场。",
    statusLine: "邻里双打板式网球场",
  },
  "c-mvne3zub-216636": {
    description: "设在中央草坪、供滑板爱好者练习腾空特技的公共U型滑板池。",
    statusLine: "中央草坪公共滑板U池",
  },
  "c-mvne5cm4-375d1d": {
    description: "俯瞰西区林荫小巷的私人乡间庄园。",
    statusLine: "西区乡间私人庄园",
  },
  "c-mvnengyt-a5d341": {
    description: "在岛屿上空执行观光巡飞的皮卡丘涂装客机。",
    statusLine: "正在高空执飞观光航线的涂装客机",
  },
  "c-mvnepky4-e46ba2": {
    description: "为区域大规模计算与 AI 负载提供支撑的超大规模数据中心。",
    statusLine: "正在支撑区域算力的超大规模数据中心",
  },
  "c-mvnf2juk-326f62": {
    description: "坐落于城市核心商圈的标志性市中心办公大楼。",
    statusLine: "市中心核心区商业办公塔楼",
  },
  "c-mvng01tx-c070df": {
    description: "泡在泡泡浴缸里悠闲穿行于南部街区的犀牛。",
    statusLine: "正乘着泡泡浴缸巡游南区的犀牛",
  },
  "c-mvnlor0y-0ebcf9": {
    description: "在海岛空域高速巡航飞越的超音速战斗机。",
    statusLine: "正在岛屿高空高速巡航的战斗机",
  },
  "c-mvnlu09c-0cd9f7": {
    description: "掩映在西区住宅小径旁的幽静乡村小屋。",
    statusLine: "西区乡间小巷旁的静谧民居",
  },
  "c-mvnmyyq6-bc000b": {
    description: "致敬2007年经典虚拟世界而重现的近海公共广播电视小岛。",
    statusLine: "近海复古公共广播电视主题岛屿前哨",
  },
  "c-mvns4thf-81f7de": {
    description: "驻守小镇应急救援队与消防泵浦车的市政消防站。",
    statusLine: "守护南部街区的市政消防站",
  },
  "c-mvo96y3f-96e304": {
    description: "俯瞰潮汐池与辽阔海面的东部岩石海角观景点。",
    statusLine: "东部海岸观景点与潮汐池",
  },
  "c-mvoab00r-9b0864": {
    description: "守望着最西侧林荫小巷的维多利亚风幽灵老宅。",
    statusLine: "镇西边缘的神秘维多利亚老宅",
  },
  "c-mvobfiiw-3fb48e": {
    description: "绕行全镇在公园站点贩售冰品的小镇冰淇淋车。",
    statusLine: "正在中央绿地周边售卖冷饮的冰淇淋车",
  },
  "c-mvocr3dc-a475ca": {
    description: "在草坪西缘辛勤酿蜜的大型共享蜂巢。",
    statusLine: "为面包坊供应天然蜂蜜的草坪蜂房",
  },
  "c-mvocxa72-f718f5": {
    description: "位于南大街、用于举办全景视听演出的沉浸式蛋形音乐馆。",
    statusLine: "南大街全景沉浸式音乐演出馆",
  },
  "c-mvod5t0a-226189": {
    description: "在西南小路旁供应现烤美味汉堡的路边汉堡摊。",
    statusLine: "西南街区路边现烤汉堡小摊",
  },
  "c-mvodkwqc-c9e4a4": {
    description: "供小镇代表齐聚商议公共事务的市政议事厅。",
    statusLine: "商议小镇事务的市政议会大厅",
  },
  "c-mvodns66-ce9982": {
    description: "紧邻北部数据中心园区、举办摇滚现场演出的露天剧场。",
    statusLine: "北区露天摇滚音乐剧场",
  },
  "c-mvoehstp-db1cae": {
    description: "为东区居民全天候供应厚松饼早餐的金字塔造型松饼屋。",
    statusLine: "全天供应美味松饼的金字塔餐厅",
  },
  "c-mvofq9cw-f479a6": {
    description: "独自在小镇街道上一跳一跳巡游的巨型赤脚。",
    statusLine: "正在街区蹦跳穿梭的巨型赤脚",
  },
  "c-mvofu6xi-9656b7": {
    description: "穿着香蕉人偶服在海边吊床上惬意小憩的游人。",
    statusLine: "海滨树荫下的慵懒午休吊床",
  },
  "c-mvogm9ja-6cd891": {
    description: "沿岛屿外围不断巡逻以守护所有镇民安全的巨型防御机甲。",
    statusLine: "正在外环巡逻守卫小镇的防御机甲",
  },
  "c-mvoi4jxh-b16cfb": {
    description: "正准备发射重型运载火箭进入轨道的北部航天发射基地。",
    statusLine: "正在筹备发射任务的北区航天发射场",
  },
  "c-mvoivyhf-8fdd46": {
    description: "举办龙舌兰品鉴与邻里聚会的南大街户外品酒亭。",
    statusLine: "南大街户外龙舌兰品鉴酒吧",
  },
  "c-mvoiz95f-8d5336": {
    description: "珍藏纸质版维基百科作为人类知识离线备份的公共图书馆。",
    statusLine: "保存人类知识纸质档案的公共图书馆",
  },
  "c-mvojw3k4-4ee278": {
    description: "常客们轮流排队登台、让每个人都能成为全场焦点的街角酒馆。",
    statusLine: "欢庆日常趣味聚会的邻里酒馆",
  },
  "comp-4bcf04f9": {
    description: "在西区蜂房与面包坊之间往返运送新鲜蜂蜜和面包的配送面包车。",
    statusLine: "正在执行西区蜂蜜与面包配送路线",
  },
  "c-mvolsq8o-c1a835": {
    description: "向西南草坪播撒动感旋律的巨型电吉他纪念碑。",
    statusLine: "西南草坪上的电吉他音乐地标",
  },
  "c-mvom998k-8e5580": {
    description: "在东北公路旁为矿场工人和过往司机提供餐食的得来速墨西哥餐厅。",
    statusLine: "东北矿区公路旁的得来速卷饼餐厅",
  },
  "comp-f2ce5ebd": {
    description: "在东北卷饼餐厅与东城区之间穿梭送餐的餐饮配送车。",
    statusLine: "东北公路餐饮外卖配送中",
  },
  "c-mvomg46x-e654f2": {
    description: "隐匿在西境荒野、供哲人独自静修沉思的孤寂木屋。",
    statusLine: "极西之境的哲人独居书屋",
  },
  "comp-quarry-dump-truck": {
    description: "将东北矿场开采的原矿石运往市区中转站的重型矿用卡车。",
    statusLine: "正在东北矿区公路运送原矿石",
  },
  "comp-firehouse-pumper": {
    description: "从灯塔山消防站出发沿南大街日常巡逻的市政消防车。",
    statusLine: "从消防站出发沿南大街日常巡防",
  },
  "c-mvoo26uh-4e0810": {
    description: "在东北天际线闪耀着巨大动态表情的球形多媒体演艺馆。",
    statusLine: "俯瞰东北区的沉浸式球形演艺馆",
  },
  "c-mvoobup6-14b5ed": {
    description: "在矿区公路旁专营铁锹与挖掘工具的五金专卖店。",
    statusLine: "供应铁锹与挖掘装备的五金专卖店",
  },
  "c-mvoogwn8-0f4801": {
    description: "矗立在西南草坪上的巨型字母 L 雕塑地标。",
    statusLine: "西南草坪上的巨大字母 L 地标",
  },
  "c-mvopczh6-c9c3cb": {
    description: "在东南山脊上迎风旋转并源源不断生产清洁电力的垂直轴风力发电机。",
    statusLine: "东南山脊正在发电的风力涡轮机",
  },
  "comp-6c0884bc": {
    description: "在东南风力发电机与南大街之间运送检修器材的多功能工程拖拉机。",
    statusLine: "东南风电场运维器材转运车",
  },
  "c-mvopnujw-13af09": {
    description: "沿着东北矿区公路为来往旅人供应卷饼与塔可的墨西哥小馆。",
    statusLine: "服务公路旅人的墨西哥塔可小馆",
  },
  "comp-3227ab04": {
    description: "在北区火箭发射台与数据中心园区之间接送工程师的通勤接驳车。",
    statusLine: "往返火箭发射台与北区科技园的通勤班车",
  },
  "c-mvoq55fb-008e1b": {
    description: "灵感源自科幻电影《心慌方》的北境神秘迷宫立方体设施，内有变幻莫测的房间。",
    statusLine: "北部边境上的科幻机关迷宫",
  },
  "c-mvoqwq7n-086aec": {
    description: "沿岛屿外围街区小巷自在巡航的电动皮卡车。",
    statusLine: "正在西区外围街区自由巡航",
  },
  "c-mvormrg7-af85ff": {
    description: "在南岸浅滩为过往船只指引航向的珊瑚礁潟湖与灯塔海湾。",
    statusLine: "指引南部礁石航道的灯塔海湾",
  },
};

/**
 * Strips flowery/whimsical adjectives from LLM-generated descriptions so any newly added
 * creation also reads as a clean, matter-of-fact description of the object.
 */
export function normalizeFactualDescription(raw: string): string {
  let s = String(raw || "").trim();
  if (!s) return s;
  s = s.replace(
    /^(a|an)\s+(whimsical|charming|delightful|mouth-watering|sun-drenched|sun-warmed|nostalgic|cheerful|contented|playful|cozy|adorable|striking|monumental|mythical|decrepit)\s+/i,
    (_, art: string) => `${art.toUpperCase()} `,
  );
  // Capitalize first letter cleanly
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Clean outer-meadow patrol anchors for Aegis Perimeter Titan (`c-mvogm9ja-6cd891`),
 * circling the town while staying well clear of Borealis Mineral Quarry (`[118, -114]`),
 * Interstellar Rocket Launchpad (`[0, -126]`), Emerald Cliff Waterfall (`[-14, 91]`),
 * and outer neighborhood landmarks.
 */
export const PERIMETER_TITAN_SEED_LOOP: [number, number][] = [
  [52, 118],
  [-58, 76],
  [-116, -8],
  [-56, -112],
  [44, -108],
  [98, -92],
  [116, -36],
  [122, 24],
];

interface WanderObstacleCircle {
  id: string;
  x: number;
  z: number;
  clearR: number;
}

function clampCoord(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function closestOnSegment2D(
  ax: number,
  az: number,
  bx: number,
  bz: number,
  cx: number,
  cz: number,
): { dist: number; t: number } {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz;
  const t = len2 > 1e-6 ? clampCoord(((cx - ax) * dx + (cz - az) * dz) / len2, 0, 1) : 0;
  const px = ax + dx * t;
  const pz = az + dz * t;
  return { dist: Math.hypot(cx - px, cz - pz), t };
}

function buildWanderObstacles(
  walker: Pick<WorldCreation, "id" | "scaleClass" | "blueprint">,
  style: string | undefined,
  creations: WorldCreation[],
  props: WorldProp[],
): WanderObstacleCircle[] {
  const selfR = getCreationFootprintRadius(
    walker.scaleClass,
    walker.blueprint?.stats?.footprintX ?? 14,
    walker.blueprint?.stats?.footprintZ ?? 14,
  );
  const selfPad = Math.min(3.8, Math.max(0.85, selfR * 0.48));
  const isGlide = style === "glide";
  const obs: WanderObstacleCircle[] = [];

  for (const c of creations) {
    if (c.id === walker.id) continue;
    if (c.category !== "building" && c.behavior?.type !== "landmark") continue;
    const r = getCreationFootprintRadius(
      c.scaleClass,
      c.blueprint?.stats?.footprintX ?? 14,
      c.blueprint?.stats?.footprintZ ?? 14,
    );
    obs.push({ id: c.id, x: c.x, z: c.z, clearR: r + selfPad + 2.2 });
  }
  if (!isGlide) {
    for (const p of props) {
      if (p.kind !== "pond") continue;
      const r = p.radius ?? 6.4;
      obs.push({ id: p.id, x: p.x, z: p.z, clearR: r + selfPad * 0.6 + 1.6 });
    }
  }
  obs.push({ id: "city-sign", x: 10.5, z: 4.5, clearR: 2.8 + selfPad * 0.4 });
  return obs;
}

export function nudgeWanderPointClearOfWorld(
  px: number,
  pz: number,
  walker: Pick<WorldCreation, "id" | "scaleClass" | "blueprint">,
  style: string | undefined,
  creations: WorldCreation[],
  props: WorldProp[],
  bound = 136,
): [number, number] {
  const obs = buildWanderObstacles(walker, style, creations, props);
  return nudgePointClearInternal(px, pz, obs, bound);
}

function clampWanderToNearestIsland(px: number, pz: number, minMargin = 6.0): [number, number] {
  if (getIslandInlandMargin(px, pz) >= minMargin) return [px, pz];
  return clampPointToIsland(px, pz, minMargin);
}

function nudgePointClearInternal(
  px: number,
  pz: number,
  obs: WanderObstacleCircle[],
  _bound = 136,
): [number, number] {
  let [x, z] = clampWanderToNearestIsland(px, pz, 6.0);
  const [islandCx, islandCz] = getNearestIslandCenter(x, z);
  for (let pass = 0; pass < 8; pass++) {
    let moved = false;
    for (const o of obs) {
      const dx = x - o.x;
      const dz = z - o.z;
      const d = Math.hypot(dx, dz);
      if (d < o.clearR - 0.05) {
        let ux = d > 0.05 ? dx / d : o.x > islandCx ? -1 : 1;
        let uz = d > 0.05 ? dz / d : o.z > islandCz ? -1 : 1;
        let nx = o.x + ux * (o.clearR + 0.45);
        let nz = o.z + uz * (o.clearR + 0.45);
        if (getIslandInlandMargin(nx, nz) < 6.0) {
          const toCenterLen = Math.hypot(islandCx - o.x, islandCz - o.z) || 1;
          ux = (islandCx - o.x) / toCenterLen;
          uz = (islandCz - o.z) / toCenterLen;
          nx = o.x + ux * (o.clearR + 0.8);
          nz = o.z + uz * (o.clearR + 0.8);
        }
        [x, z] = clampWanderToNearestIsland(nx, nz, 6.0);
        moved = true;
      }
    }
    if (!moved) break;
  }
  return [Number(x.toFixed(1)), Number(z.toFixed(1))];
}

/**
 * Ensures every wander waypoint AND every straight-line walk segment between consecutive
 * waypoints clears stationary buildings, quarries, waterfalls, and ponds (taking the walker's
 * own scaleClass footprint into account), inserting clean detour waypoints around obstacles.
 */
export function sanitizeWanderTargetsForWorld(
  walker: Pick<WorldCreation, "id" | "scaleClass" | "blueprint" | "x" | "z">,
  style: string | undefined,
  rawTargets: [number, number][],
  creations: WorldCreation[],
  props: WorldProp[],
): [number, number][] {
  const obs = buildWanderObstacles(walker, style, creations, props);
  const seed =
    rawTargets.length >= 2
      ? rawTargets
      : ([
          [walker.x + 12, walker.z + 8],
          [walker.x - 11, walker.z + 9],
          [walker.x + 4, walker.z - 14],
        ] as [number, number][]);

  let pts = seed.map(([tx, tz]) => nudgePointClearInternal(tx, tz, obs));

  for (let pass = 0; pass < 4 && pts.length < 18; pass++) {
    const nextPts: [number, number][] = [];
    let inserted = false;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      nextPts.push(a);
      if (nextPts.length >= 18) continue;

      let worst: WanderObstacleCircle | null = null;
      let worstPen = 0;
      for (const o of obs) {
        const hit = closestOnSegment2D(a[0], a[1], b[0], b[1], o.x, o.z);
        const req = o.clearR - 0.7;
        if (hit.t > 0.03 && hit.t < 0.97 && hit.dist < req) {
          const pen = req - hit.dist;
          if (pen > worstPen) {
            worstPen = pen;
            worst = o;
          }
        }
      }

      if (worst) {
        const sdx = b[0] - a[0];
        const sdz = b[1] - a[1];
        const slen = Math.hypot(sdx, sdz) || 1;
        const px1 = -sdz / slen;
        const pz1 = sdx / slen;
        const cand1 = nudgePointClearInternal(
          worst.x + px1 * (worst.clearR + 1.9),
          worst.z + pz1 * (worst.clearR + 1.9),
          obs,
        );
        const cand2 = nudgePointClearInternal(
          worst.x - px1 * (worst.clearR + 1.9),
          worst.z - pz1 * (worst.clearR + 1.9),
          obs,
        );
        const score = (c: [number, number]): number => {
          const dPath = Math.hypot(c[0] - a[0], c[1] - a[1]) + Math.hypot(b[0] - c[0], b[1] - c[1]);
          let penalty = 0;
          for (const other of obs) {
            const h1 = closestOnSegment2D(a[0], a[1], c[0], c[1], other.x, other.z);
            const h2 = closestOnSegment2D(c[0], c[1], b[0], b[1], other.x, other.z);
            if (h1.dist < other.clearR - 0.7) penalty += 500;
            if (h2.dist < other.clearR - 0.7) penalty += 500;
          }
          return dPath + penalty;
        };
        const chosen = score(cand1) <= score(cand2) ? cand1 : cand2;
        nextPts.push(chosen);
        inserted = true;
      }
    }
    pts = nextPts;
    if (!inserted) break;
  }

  return pts;
}

export interface CorridorLoadSummary {
  pathId: string;
  kind: PathKind;
  closed: boolean;
  lengthM: number;
  capacity: number;
  vehicleIds: string[];
  overloaded: boolean;
}

export interface WorldTrafficCongestionReport {
  congested: boolean;
  corridors: CorridorLoadSummary[];
  overloadedCorridors: CorridorLoadSummary[];
  pingPongLoopIntrusionIds: string[];
  longDwellVehicleIds: string[];
  roadBlockedVehicleIds: string[];
  crampedTurnaroundVehicleIds: string[];
  activeIncidents: TrafficIncidentRecord[];
  summaryText: string;
}

function polylineLength2D(pts: [number, number][], closed: boolean): number {
  if (pts.length < 2) return 0;
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    total += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
  }
  if (closed && pts.length >= 3) {
    total += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
  }
  return total;
}

function dedupeConsecutiveWaypoints(pts: [number, number][], minStep = 1.2): [number, number][] {
  const out: [number, number][] = [];
  for (const [x, z] of pts) {
    const rounded: [number, number] = [Number(x.toFixed(2)), Number(z.toFixed(2))];
    const prev = out[out.length - 1];
    if (!prev || Math.hypot(rounded[0] - prev[0], rounded[1] - prev[1]) >= minStep) {
      out.push(rounded);
    }
  }
  return out;
}

function sanitizeStopsAlongWaypoints(
  rawStops: RouteStop[] | undefined,
  waypoints: [number, number][],
  closed: boolean,
  vehicleId: string,
): RouteStop[] {
  const curve = sampleCatmullRom2D(waypoints, closed, 0.75);
  const kept: RouteStop[] = [];
  for (const st of rawStops ?? []) {
    const hit = distPointToPolyline2D(st.x, st.z, curve);
    if (hit.dist > 8.5) continue;
    const sx = Number(hit.closestX.toFixed(1));
    const sz = Number(hit.closestZ.toFixed(1));
    if (kept.some((o) => Math.hypot(o.x - sx, o.z - sz) < 14.0)) continue;
    kept.push({
      ...st,
      x: sx,
      z: sz,
      dwellSec: Number(Math.min(2.2, Math.max(1.4, st.dwellSec || 1.8)).toFixed(1)),
    });
    if (kept.length >= 3) break;
  }
  if (kept.length >= 2) return kept;

  const startPt = waypoints[0];
  const endPt = closed
    ? waypoints[Math.floor(waypoints.length / 2)]
    : waypoints[waypoints.length - 1];
  return [
    {
      id: `stop-${vehicleId}-a`,
      name: kept[0]?.name || "路线起点 A",
      x: Number(startPt[0].toFixed(1)),
      z: Number(startPt[1].toFixed(1)),
      dwellSec: 1.8,
      ...(kept[0]?.nearCreationId ? { nearCreationId: kept[0].nearCreationId } : {}),
    },
    {
      id: `stop-${vehicleId}-b`,
      name: kept[1]?.name || "路线终点 B",
      x: Number(endPt[0].toFixed(1)),
      z: Number(endPt[1].toFixed(1)),
      dwellSec: 1.8,
      ...(kept[1]?.nearCreationId ? { nearCreationId: kept[1].nearCreationId } : {}),
    },
  ];
}

/**
 * Inspects every drivable road/lane corridor and every `vehicle_route` creation to detect
 * downtown ring-road bottlenecks, regional ping-pong overlap on `path-main-loop`, and
 * excessive stop dwell times so the orchestrator can continuously rebalance traffic.
 */
export function analyzeWorldTrafficCongestion(
  creations: WorldCreation[],
  paths: WorldPath[],
  incidents: TrafficIncidentRecord[] = [],
): WorldTrafficCongestionReport {
  const drivablePaths = paths
    .filter((p) => (p.kind === "road" || p.kind === "cottage_road") && p.points.length >= 2)
    .map((p) => {
      const curve = sampleCatmullRom2D(p.points, Boolean(p.closed), 0.75, Boolean(p.linear));
      const lengthM = Number(polylineLength2D(curve, Boolean(p.closed)).toFixed(1));
      return { path: p, curve, lengthM };
    })
    .filter((rc) => rc.lengthM >= 26 || rc.path.id === "path-main-loop");

  const mainLoop = drivablePaths.find((rc) => rc.path.id === "path-main-loop");
  const vehicles = creations.filter((c) => c.behavior?.type === "vehicle_route");
  const solidStructures = creations.filter(
    (c) =>
      c.behavior?.type !== "vehicle_route" &&
      (c.category === "building" || c.behavior?.type === "landmark"),
  );

  const corridorLoads = new Map<string, string[]>();
  for (const rc of drivablePaths) corridorLoads.set(rc.path.id, []);

  const pingPongLoopIntrusionIds: string[] = [];
  const longDwellVehicleIds: string[] = [];
  const roadBlockedVehicleIds: string[] = [];
  const crampedTurnaroundVehicleIds: string[] = [];

  for (const v of vehicles) {
    if (v.behavior.type !== "vehicle_route") continue;
    const wps = v.behavior.waypoints ?? [];
    if (wps.length < 2) continue;

    if (
      (v.behavior.stops ?? []).some((s) => (s.dwellSec ?? 0) > 2.6) ||
      (v.behavior.stops ?? []).length > 3
    ) {
      longDwellVehicleIds.push(v.id);
    }

    const closed = v.behavior.loopMode !== "pingpong";
    const sampledRoute = sampleCatmullRom2D(wps, closed, 1.5);
    let routeObstructed = false;
    for (const pt of sampledRoute) {
      for (const bld of solidStructures) {
        const bldR = getCreationFootprintRadius(
          bld.scaleClass,
          bld.blueprint?.stats?.footprintX ?? 14,
          bld.blueprint?.stats?.footprintZ ?? 14,
        );
        if (Math.hypot(pt[0] - bld.x, pt[1] - bld.z) < bldR * 0.72) {
          routeObstructed = true;
          break;
        }
      }
      if (routeObstructed) break;
    }
    if (routeObstructed) {
      roadBlockedVehicleIds.push(v.id);
    }

    if (!closed) {
      const endpoints = [wps[0], wps[wps.length - 1]];
      let crampedEnd = false;
      for (const ep of endpoints) {
        if (getIslandInlandMargin(ep[0], ep[1]) < 3.5) {
          crampedEnd = true;
          break;
        }
        for (const bld of solidStructures) {
          const bldR = getCreationFootprintRadius(
            bld.scaleClass,
            bld.blueprint?.stats?.footprintX ?? 14,
            bld.blueprint?.stats?.footprintZ ?? 14,
          );
          if (Math.hypot(ep[0] - bld.x, ep[1] - bld.z) < bldR * 0.8 + 1.0) {
            crampedEnd = true;
            break;
          }
        }
        if (crampedEnd) break;
      }
      if (crampedEnd) {
        crampedTurnaroundVehicleIds.push(v.id);
      }

      if (mainLoop) {
        const ringHits = wps.filter(
          ([wx, wz]) => distPointToPolyline2D(wx, wz, mainLoop.curve).dist <= 2.2,
        ).length;
        if (ringHits >= 2) {
          pingPongLoopIntrusionIds.push(v.id);
        }
      }
    }

    // Assign vehicle load to each corridor where >= 30% (or >= 3) of its waypoints run
    for (const rc of drivablePaths) {
      const onCorridor = wps.filter(
        ([wx, wz]) => distPointToPolyline2D(wx, wz, rc.curve).dist <= 3.5,
      ).length;
      if (onCorridor >= 3 || onCorridor / wps.length >= 0.35) {
        corridorLoads.get(rc.path.id)!.push(v.id);
      }
    }
  }

  const corridors: CorridorLoadSummary[] = drivablePaths.map((rc) => {
    const vehicleIds = corridorLoads.get(rc.path.id) ?? [];
    const capacity =
      rc.path.id === "path-outer-ring"
        ? 4
        : Boolean(rc.path.closed) || rc.lengthM >= 55
          ? 2
          : 1;
    return {
      pathId: rc.path.id,
      kind: rc.path.kind,
      closed: Boolean(rc.path.closed),
      lengthM: rc.lengthM,
      capacity,
      vehicleIds,
      overloaded: vehicleIds.length > capacity,
    };
  });

  const activeIncidents = incidents.filter((inc) =>
    vehicles.some((v) => v.id === inc.vehicleId),
  );
  const overloadedCorridors = corridors.filter((c) => c.overloaded);
  const congested =
    overloadedCorridors.length > 0 ||
    pingPongLoopIntrusionIds.length > 0 ||
    longDwellVehicleIds.length > 0 ||
    roadBlockedVehicleIds.length > 0 ||
    crampedTurnaroundVehicleIds.length > 0 ||
    activeIncidents.length > 0;

  const summaryParts: string[] = [];
  if (overloadedCorridors.length > 0) {
    summaryParts.push(
      `Overloaded corridors: ${overloadedCorridors.map((c) => `${c.pathId} (${c.vehicleIds.length}/${c.capacity})`).join(", ")}`,
    );
  }
  if (pingPongLoopIntrusionIds.length > 0) {
    summaryParts.push(
      `Regional ping-pong vehicles intruding onto path-main-loop: ${pingPongLoopIntrusionIds.join(", ")}`,
    );
  }
  if (roadBlockedVehicleIds.length > 0) {
    summaryParts.push(`Vehicles with building-obstructed waypoints: ${roadBlockedVehicleIds.join(", ")}`);
  }
  if (crampedTurnaroundVehicleIds.length > 0) {
    summaryParts.push(`Open-route vehicles needing clear turnaround space: ${crampedTurnaroundVehicleIds.join(", ")}`);
  }
  if (activeIncidents.length > 0) {
    summaryParts.push(
      `Live vehicle clash/stuck incidents reported: ${activeIncidents.map((inc) => `${inc.vehicleId} (${inc.reason} x${inc.count} at [${inc.x}, ${inc.z}])`).join(", ")}`,
    );
  }
  if (longDwellVehicleIds.length > 0) {
    summaryParts.push(`Vehicles with excessive stop dwell/count: ${longDwellVehicleIds.join(", ")}`);
  }

  return {
    congested,
    corridors,
    overloadedCorridors,
    pingPongLoopIntrusionIds,
    longDwellVehicleIds,
    roadBlockedVehicleIds,
    crampedTurnaroundVehicleIds,
    activeIncidents,
    summaryText: summaryParts.length > 0 ? summaryParts.join(" | ") : "All corridors within traffic capacity",
  };
}

/**
 * Picks the best under-capacity drivable corridor near `(targetX, targetZ)` when assigning
 * a newly placed or re-routed vehicle so new cars don't all pile onto `path-main-loop`.
 */
export function chooseLeastCongestedRoad(
  targetX: number,
  targetZ: number,
  preferredKind: PathKind,
  creations: WorldCreation[],
  paths: WorldPath[],
  excludeVehicleId?: string,
  maxDistanceM?: number,
): WorldPath | null {
  const filteredCreations = excludeVehicleId
    ? creations.filter((c) => c.id !== excludeVehicleId)
    : creations;
  const report = analyzeWorldTrafficCongestion(filteredCreations, paths);
  const loadById = new Map(report.corridors.map((c) => [c.pathId, c]));

  const candidates = paths.filter((p) => {
    const info = loadById.get(p.id);
    return Boolean(info);
  });
  if (candidates.length === 0) return null;

  let best: WorldPath | null = null;
  let bestScore = Infinity;
  for (const p of candidates) {
    const info = loadById.get(p.id)!;
    const curve = sampleCatmullRom2D(p.points, Boolean(p.closed), 0.75, Boolean(p.linear));
    const d = distPointToPolyline2D(targetX, targetZ, curve).dist;
    if (typeof maxDistanceM === "number" && d > maxDistanceM) continue;
    const loadRatio = info.vehicleIds.length / Math.max(1, info.capacity);
    const overloadPenalty = info.vehicleIds.length >= info.capacity ? 240 + info.vehicleIds.length * 90 : loadRatio * 55;
    const closedBonus = p.closed ? -28 : 0;
    const kindPenalty = p.kind === preferredKind ? 0 : 18;
    const score = d * 1.15 + overloadPenalty + kindPenalty + closedBonus;
    if (score < bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}

/**
 * Deterministic SimCity Traffic Orchestrator pass:
 * 1. Trims regional `pingpong` haul/shuttle routes so they terminate cleanly at their outer
 *    district ring junction instead of driving around `path-main-loop`.
 * 2. Rebalances any corridor exceeding capacity (`> 2` vehicles) by moving excess non-seed
 *    vehicles onto underutilized district avenues/boulevards.
 * 3. Deduplicates waypoints, spaces stops >= 14m apart, caps `dwellSec <= 2.2s`, and staggers
 *    speeds on shared roads so vehicles flow continuously without bunching.
 */
export function decongestWorldTraffic(
  creations: WorldCreation[],
  paths: WorldPath[],
): { changedIds: string[]; notes: string[] } {
  const changedIds = new Set<string>();
  const notes: string[] = [];

  const drivable = paths
    .filter((p) => (p.kind === "road" || p.kind === "cottage_road") && p.points.length >= 2)
    .map((p) => {
      const curve = sampleCatmullRom2D(p.points, Boolean(p.closed), 0.75, Boolean(p.linear));
      const lengthM = polylineLength2D(curve, Boolean(p.closed));
      return { path: p, curve, lengthM };
    })
    .filter((rc) => rc.lengthM >= 26 || rc.path.id === "path-main-loop");

  const mainLoop = drivable.find((rc) => rc.path.id === "path-main-loop");
  if (!mainLoop) return { changedIds: [], notes: [] };

  // Step 1: Trim regional/cross-town ping-pong routes off `path-main-loop`
  for (const c of creations) {
    if (c.behavior?.type !== "vehicle_route") continue;
    let wps = dedupeConsecutiveWaypoints(c.behavior.waypoints ?? []);
    if (wps.length < 2) continue;

    const origJson = JSON.stringify({
      loopMode: c.behavior.loopMode,
      speed: c.behavior.speed,
      waypoints: c.behavior.waypoints,
      stops: c.behavior.stops,
    });

    if (c.behavior.loopMode === "pingpong") {
      const onRingFlags = wps.map(
        ([wx, wz]) => distPointToPolyline2D(wx, wz, mainLoop.curve).dist <= 2.2,
      );
      const ringCount = onRingFlags.filter(Boolean).length;

      if (ringCount >= 1) {
        const startsOffRing = !onRingFlags[0];
        const endsOffRing = !onRingFlags[onRingFlags.length - 1];
        const firstRingIdx = onRingFlags.findIndex(Boolean);

        if (startsOffRing && !endsOffRing) {
          // Regional haul/patrol entering town: stop cleanly at the T-junction curb just outside `path-main-loop`
          const offRingPrefix = wps.slice(0, firstRingIdx);
          if (offRingPrefix.length >= 2 && polylineLength2D(offRingPrefix, false) >= 16) {
            wps = offRingPrefix;
          } else if (firstRingIdx >= 1) {
            wps = wps.slice(0, firstRingIdx + 1);
          }
        } else if (!startsOffRing && endsOffRing) {
          let lastRingIdx = 0;
          for (let i = 0; i < onRingFlags.length; i++) {
            if (onRingFlags[i]) lastRingIdx = i;
            else break;
          }
          const offRingSuffix = wps.slice(lastRingIdx + 1);
          if (offRingSuffix.length >= 2 && polylineLength2D(offRingSuffix, false) >= 16) {
            wps = offRingSuffix;
          } else {
            wps = wps.slice(lastRingIdx);
          }
        } else if (startsOffRing && endsOffRing && ringCount >= 2) {
          const offRingPrefix = wps.slice(0, firstRingIdx);
          if (c.isCompanion && offRingPrefix.length >= 2 && polylineLength2D(offRingPrefix, false) >= 55) {
            wps = offRingPrefix;
          } else {
            const alt = chooseLeastCongestedRoad(
              c.x,
              c.z,
              "road",
              creations,
              paths.filter((p) => p.id !== "path-main-loop"),
              c.id,
              24,
            );
            if (alt && alt.points.length >= 3) {
              wps = dedupeConsecutiveWaypoints(alt.points);
            } else if (offRingPrefix.length >= 2) {
              wps = offRingPrefix;
            }
          }
        }
      }
    }

    const closed = c.behavior.loopMode !== "pingpong";
    const cleanStops = sanitizeStopsAlongWaypoints(c.behavior.stops, wps, closed, c.id);

    const nextBehavior = {
      ...c.behavior,
      waypoints: wps,
      stops: cleanStops,
    };
    const nextJson = JSON.stringify({
      loopMode: nextBehavior.loopMode,
      speed: nextBehavior.speed,
      waypoints: nextBehavior.waypoints,
      stops: nextBehavior.stops,
    });
    if (origJson !== nextJson) {
      c.behavior = nextBehavior;
      c.x = wps[0][0];
      c.z = wps[0][1];
      changedIds.add(c.id);
      notes.push(`trimmed "${c.name}" (${c.id}) route & stops for smooth traffic flow`);
    }
  }

  // Step 2: Enforce corridor capacity (max 2 vehicles per corridor) on nearby roads only
  const report = analyzeWorldTrafficCongestion(creations, paths);
  for (const overloaded of report.overloadedCorridors) {
    const movableIds = overloaded.vehicleIds.filter((vid) => {
      const vc = creations.find((x) => x.id === vid);
      return vc && !vc.isSeed;
    });
    const excessCount = overloaded.vehicleIds.length - overloaded.capacity;
    for (let i = 0; i < excessCount && i < movableIds.length; i++) {
      const vid = movableIds[movableIds.length - 1 - i];
      const vc = creations.find((x) => x.id === vid);
      if (!vc || vc.behavior?.type !== "vehicle_route") continue;

      // Only transition onto a nearby / intersecting road (such as path-outer-ring <= 24m away) — NEVER jump across the island!
      const refPts: [number, number][] =
        vc.behavior.waypoints.length >= 2
          ? [
              [vc.x, vc.z],
              vc.behavior.waypoints[0],
              vc.behavior.waypoints[vc.behavior.waypoints.length - 1],
            ]
          : [[vc.x, vc.z]];
      let altRoad: WorldPath | null = null;
      for (const [rx, rz] of refPts) {
        altRoad = chooseLeastCongestedRoad(
          rx,
          rz,
          overloaded.kind,
          creations,
          paths.filter((p) => p.id !== overloaded.pathId),
          vc.id,
          24,
        );
        if (altRoad) break;
      }
      if (!altRoad || altRoad.points.length < 2) continue;

      const isClosed = Boolean(altRoad.closed) && altRoad.points.length >= 4;
      const rawWps = dedupeConsecutiveWaypoints(altRoad.points);
      const newWps = isClosed ? rotateClosedWaypointsNear(rawWps, vc.x, vc.z) : rawWps;
      const newStops = sanitizeStopsAlongWaypoints(vc.behavior.stops, newWps, isClosed, vc.id);
      vc.behavior = {
        ...vc.behavior,
        loopMode: isClosed ? "loop" : "pingpong",
        waypoints: newWps,
        stops: newStops,
      };
      const nearCurve = sampleCatmullRom2D(newWps, isClosed, 1.0);
      const proj = distPointToPolyline2D(vc.x, vc.z, nearCurve);
      vc.x = Number(proj.closestX.toFixed(1));
      vc.z = Number(proj.closestZ.toFixed(1));
      changedIds.add(vc.id);
      notes.push(`rerouted "${vc.name}" (${vc.id}) from congested ${overloaded.pathId} onto ${altRoad.id}`);
    }
  }

  // Step 3: Stagger speeds gently downward (NEVER speeding up above authored speed!) when sharing a corridor
  const postReport = analyzeWorldTrafficCongestion(creations, paths);
  const corridorFactors = [1.0, 0.86, 0.93];
  for (const corr of postReport.corridors) {
    if (corr.vehicleIds.length < 2) continue;
    corr.vehicleIds.forEach((vid, slotIdx) => {
      if (slotIdx === 0) return;
      const vc = creations.find((x) => x.id === vid);
      if (!vc || vc.behavior?.type !== "vehicle_route" || vc.isSeed) return;
      const curSpd = vc.behavior.speed || 5.4;
      const factor = corridorFactors[slotIdx % corridorFactors.length];
      const desiredSpeed = Number(Math.max(3.6, Math.min(curSpd, curSpd * factor)).toFixed(2));
      if (curSpd - desiredSpeed > 0.2) {
        vc.behavior = { ...vc.behavior, speed: desiredSpeed };
        changedIds.add(vc.id);
      }
    });
  }

  return { changedIds: [...changedIds], notes };
}

/**
 * Observer Agent deterministic resolution pass for vehicle clearance:
 * - Clears route waypoints that genuinely clip inside newly placed solid buildings/landmarks.
 * - Never swaps active driving vehicles onto distant roads mid-session so live vehicles never jump or fly.
 */
export function resolveTrafficIncidentsWithObserver(
  creations: WorldCreation[],
  _paths: WorldPath[],
  incidents: TrafficIncidentRecord[],
): {
  changedIds: string[];
  resolvedIncidentIds: string[];
  notes: string[];
} {
  const changedIds = new Set<string>();
  const resolvedIncidentIds: string[] = incidents.map((inc) => inc.id);
  const notes: string[] = [];

  const solidStructures = creations.filter(
    (c) =>
      c.behavior?.type !== "vehicle_route" &&
      (c.category === "building" || c.behavior?.type === "landmark"),
  );

  const nudgeWaypointClearOfStructures = (
    wx: number,
    wz: number,
    extraPad: number,
  ): [number, number] => {
    let [nx, nz] = clampPointToIsland(wx, wz, 5.5);
    for (let pass = 0; pass < 2; pass++) {
      for (const bld of solidStructures) {
        const bldR =
          getCreationFootprintRadius(
            bld.scaleClass,
            bld.blueprint?.stats?.footprintX ?? 14,
            bld.blueprint?.stats?.footprintZ ?? 14,
          ) *
            0.76 +
          extraPad;
        const dx = nx - bld.x;
        const dz = nz - bld.z;
        const d = Math.hypot(dx, dz);
        if (d < bldR) {
          const ang = d > 0.01 ? Math.atan2(dz, dx) : 0.7;
          nx = bld.x + Math.cos(ang) * bldR;
          nz = bld.z + Math.sin(ang) * bldR;
        }
      }
      [nx, nz] = clampPointToIsland(nx, nz, 4.8);
    }
    return [Number(nx.toFixed(2)), Number(nz.toFixed(2))];
  };

  for (const vc of creations) {
    if (vc.behavior?.type !== "vehicle_route" || vc.isSeed) continue;
    const wps = vc.behavior.waypoints ?? [];
    if (wps.length < 2) continue;

    const isPingPong = vc.behavior.loopMode === "pingpong";
    let modified = false;
    const adjustedWps: [number, number][] = wps.map(([wx, wz], idx) => {
      const isEndpoint = isPingPong && (idx === 0 || idx === wps.length - 1);
      const reqPad = isEndpoint ? 1.2 : 0.45;
      const [cx, cz] = nudgeWaypointClearOfStructures(wx, wz, reqPad);
      const shift = Math.hypot(cx - wx, cz - wz);
      if (shift > 0.45 && shift <= 3.5) {
        modified = true;
        return [cx, cz];
      }
      return [wx, wz];
    });

    if (modified) {
      const cleanWps = dedupeConsecutiveWaypoints(adjustedWps);
      if (cleanWps.length >= (isPingPong ? 2 : 3)) {
        const cleanStops = sanitizeStopsAlongWaypoints(
          vc.behavior.stops,
          cleanWps,
          !isPingPong,
          vc.id,
        );
        vc.behavior = {
          ...vc.behavior,
          waypoints: cleanWps,
          stops: cleanStops,
        };
        changedIds.add(vc.id);
      }
    }
  }

  return {
    changedIds: [...changedIds],
    resolvedIncidentIds,
    notes,
  };
}

