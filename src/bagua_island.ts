import type {
  VoxelBlueprint,
  WorldCreation,
  WorldPath,
  WorldProp,
  WorldTerrainZone,
  WorldVillager,
} from "./types";
import { normalizeAndGroundBlueprint } from "./voxel_dsl";

export const BAGUA_ISLAND_CENTER: [number, number] = [498.24, 0];
export const BAGUA_ISLAND_HALF_EXTENT = 240.24;

export const BAGUA_CREATION_IDS = {
  taijiPavilion: "bagua-taiji-pavilion",
  kanWaterwheel: "bagua-kan-waterwheel",
  genMaze: "bagua-gen-maze",
  zhenDrumtower: "bagua-zhen-drumtower",
  xunWindmill: "bagua-xun-windmill",
  liStage: "bagua-li-stage",
  kunCourtyard: "bagua-kun-courtyard",
  duiPavilion: "bagua-dui-pavilion",
  qianObservatory: "bagua-qian-observatory",
  shuttleBus: "bagua-shuttle-bus",
  dapengRoc: "world-dapeng-roc",
  // Ring 1-2 Inner Commercial & Cultural Ward
  innerTeahouse: "bagua-inner-teahouse",
  innerSilkshop: "bagua-inner-silkshop",
  innerGuqin: "bagua-inner-guqin",
  innerApothecary: "bagua-inner-apothecary",
  innerChess: "bagua-inner-chess",
  innerAstrology: "bagua-inner-astrology",
  innerBookstore: "bagua-inner-bookstore",
  // Ring 3-4 Outer Craft, Culinary & Gallery Ward
  outerForge: "bagua-outer-forge",
  outerTavern: "bagua-outer-tavern",
  outerLightsOut: "bagua-outer-lightsout",
  outerInn: "bagua-outer-inn",
  outerCurio: "bagua-outer-curio",
  outerLighthouse: "bagua-outer-lighthouse",
  outerPagoda: "bagua-outer-pagoda",
  outerDyehouse: "bagua-outer-dyehouse",
  // Ring 3-4 Street Market Stalls, Central Monument & Coastal Viewing Piers
  marketNoodles: "bagua-market-noodles",
  marketOpera: "bagua-market-opera",
  courtyardStele: "bagua-courtyard-stele",
  shorePierE: "bagua-shore-pier-e",
  shorePierW: "bagua-shore-pier-w",
} as const;

const BAGUA_RADIAL_DIRS = ["e", "se", "s", "sw", "w", "nw", "n", "ne"] as const;
const BAGUA_INNER_SPUR_DIRS = ["e", "se", "s", "sw", "nw", "n", "ne"] as const;
const BAGUA_OUTER_SPUR_DIRS = ["e", "se", "s", "sw", "w", "nw", "n", "ne"] as const;

export const BAGUA_GATE_DEFS = [
  { dir: "e", gateName: "伤门", trigramLabel: "震东", angle: 0, accentHex: "#46e87a" },
  { dir: "se", gateName: "杜门", trigramLabel: "巽东南", angle: Math.PI / 4, accentHex: "#2ee6c5" },
  { dir: "s", gateName: "景门", trigramLabel: "离南", angle: Math.PI / 2, accentHex: "#ff5a36" },
  { dir: "sw", gateName: "死门", trigramLabel: "坤西南", angle: (3 * Math.PI) / 4, accentHex: "#f4be3b" },
  { dir: "w", gateName: "惊门", trigramLabel: "兑西", angle: Math.PI, accentHex: "#64dcff" },
  { dir: "nw", gateName: "开门", trigramLabel: "乾西北", angle: (-3 * Math.PI) / 4, accentHex: "#c98cff" },
  { dir: "n", gateName: "休门", trigramLabel: "坎北", angle: -Math.PI / 2, accentHex: "#338eff" },
  { dir: "ne", gateName: "生门", trigramLabel: "艮东北", angle: -Math.PI / 4, accentHex: "#ffa042" },
] as const;

export const BAGUA_PROTECTED_PATH_IDS = new Set([
  "path-bagua-inner-ring",
  "path-bagua-ring-2",
  "path-bagua-ring-3",
  "path-bagua-outer-ring",
  ...BAGUA_RADIAL_DIRS.map((d) => `path-bagua-radial-${d}`),
  ...BAGUA_RADIAL_DIRS.map((d) => `path-bagua-radial2-${d}`),
  ...BAGUA_RADIAL_DIRS.map((d) => `path-bagua-radial3-${d}`),
  ...BAGUA_RADIAL_DIRS.map((d) => `path-bagua-court-${d}`),
  ...BAGUA_RADIAL_DIRS.map((d) => `path-bagua-gate-${d}`),
  ...BAGUA_INNER_SPUR_DIRS.map((d) => `path-bagua-inner-spur-${d}`),
  ...BAGUA_OUTER_SPUR_DIRS.map((d) => `path-bagua-outer-spur-${d}`),
  "path-bagua-shore-e",
  "path-bagua-shore-w",
]);

export const BAGUA_PROTECTED_PROP_IDS = new Set([
  "prop-bagua-taiji-sign",
  "prop-bagua-dui-pond",
  "prop-bagua-kan-pond",
  "prop-bagua-lantern-nw",
  "prop-bagua-lantern-sw",
  "prop-bagua-lantern-ne",
  "prop-bagua-lantern-se",
  "prop-bagua-lantern-outer-e",
  "prop-bagua-lantern-outer-w",
  "prop-bagua-lantern-outer-n",
  "prop-bagua-lantern-outer-s",
  "prop-bagua-lantern-ring4-ne",
  "prop-bagua-lantern-ring4-se",
  "prop-bagua-lantern-ring4-sw",
  "prop-bagua-lantern-ring4-nw",
  "prop-bagua-bench-west",
  "prop-bagua-bench-south",
  "prop-bagua-bench-east",
  "prop-bagua-bench-north",
  "prop-bagua-bench-outer-se",
  "prop-bagua-bench-outer-sw",
  "prop-bagua-bench-outer-w",
  "prop-bagua-bench-outer-n",
  "prop-bagua-flower-dui",
  "prop-bagua-flower-taiji-n",
  "prop-bagua-flower-taiji-s",
  "prop-bagua-flower-outer-w",
  "prop-bagua-flower-outer-nw",
  "prop-bagua-tree-inner-ne",
  "prop-bagua-tree-inner-se",
  "prop-bagua-tree-outer-ne",
  "prop-bagua-tree-outer-sw",
  "prop-bagua-tree-outer-nw",
  "prop-bagua-tree-outer-n",
  "prop-bagua-stop-dui",
  "prop-bagua-stop-kan",
  "prop-bagua-stop-li",
]);

export function getBaguaCoastWarp(_theta: number): number {
  return 0;
}

/**
 * Signed distance (in meters) inward from the flat octagonal plateau edge of East Bagua Island (`[498.24, 0]`).
 * Regular octagon with 8 flat sides facing N/NE/E/SE/S/SW/W/NW and apothem `240.24m`.
 */
export function getBaguaIslandInlandMargin(x: number, z: number): number {
  const dx = Math.abs(x - BAGUA_ISLAND_CENTER[0]);
  const dz = Math.abs(z - BAGUA_ISLAND_CENTER[1]);
  const octDist = Math.max(dx, dz, (dx + dz) * Math.SQRT1_2);
  return BAGUA_ISLAND_HALF_EXTENT - octDist;
}

/**
 * Builds the exact 8 vertices of a regular octagon ring (`linear: true` polyline)
 * with vertices placed directly on the 8 Bagua radial axes `side * π/4` (`0°, 45°, 90°...`),
 * so all 4 concentric rings are crisp straight line segments whose 8 corners link directly
 * corner-to-corner with the 8 radial main avenues.
 */
function buildOctagonRingPoints(cx: number, cz: number, cornerRadius: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let side = 0; side < 8; side++) {
    const a = side * (Math.PI / 4);
    pts.push([
      Number((cx + Math.cos(a) * cornerRadius).toFixed(2)),
      Number((cz + Math.sin(a) * cornerRadius).toFixed(2)),
    ]);
  }
  return pts;
}

function radialPt(angle: number, radius: number): [number, number] {
  return [
    Number((BAGUA_ISLAND_CENTER[0] + Math.cos(angle) * radius).toFixed(1)),
    Number((BAGUA_ISLAND_CENTER[1] + Math.sin(angle) * radius).toFixed(1)),
  ];
}

// ---------------------------------------------------------------------------
// 1. 中天太极观景楼 (Circular Center Taiji Altar & 3-Tier Sichuan Tower)
// ---------------------------------------------------------------------------
export function buildBaguaTaijiPavilionBlueprint(): VoxelBlueprint {
  const yinYangVoxels: [number, number, number, string, number?][] = [];
  // Bold circular Taiji Yin-Yang mosaic at Y = 2 spanning r = 5.4..16.0 around central podium (+30% scaled)
  const outerYY = 16.0;
  const halfYY = outerYY * 0.5;
  for (let x = -16; x <= 15; x++) {
    for (let z = -16; z <= 15; z++) {
      const cx = x + 0.5;
      const cz = z + 0.5;
      const r = Math.hypot(cx, cz);
      if (r > outerYY || r < 5.4) continue;
      const inNorthHead = Math.hypot(cx, cz + halfYY) <= halfYY;
      const inSouthHead = Math.hypot(cx, cz - halfYY) <= halfYY;
      let isWhite = cx >= 0;
      if (inNorthHead) isWhite = true;
      if (inSouthHead) isWhite = false;
      // Contrasting Yin/Yang fish-eyes
      if (Math.hypot(cx, cz + halfYY) <= 2.0) isWhite = false;
      if (Math.hypot(cx, cz - halfYY) <= 2.0) isWhite = true;
      yinYangVoxels.push([x, 2, z, isWhite ? "jadeWhite" : "obsidian", isWhite ? 0.14 : 0]);
    }
  }

  // 8 circularly arranged terrace stone lanterns placed in the 8 sector gaps (keeping all 8 radial street axes clear!)
  const lanternOps: Array<{ op: "box"; x0: number; y0: number; z0: number; x1: number; y1: number; z1: number; color: string; emit?: number }> = [];
  for (let i = 0; i < 8; i++) {
    const a = (i + 0.5) * (Math.PI / 4);
    const lx = Math.round(Math.cos(a) * 16.9);
    const lz = Math.round(Math.sin(a) * 16.9);
    lanternOps.push(
      { op: "box", x0: lx, y0: 2, z0: lz, x1: lx + 1, y1: 6, z1: lz + 1, color: "qingStone" },
      { op: "box", x0: lx, y0: 6, z0: lz, x1: lx + 1, y1: 7, z1: lz + 1, color: "lanternGlow", emit: 1.2 },
    );
  }

  return normalizeAndGroundBlueprint(
    {
      name: "中天太极观景楼",
      description:
        "屹立在八卦城正中的圆形太极阴阳石坛与三重檐川西青砖飞檐观景楼，八条八卦放射主干道直指太极圆心。",
      category: "building",
      scaleClass: "colossal",
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#c8ccd0",
        jadeWhite: "#f4f1e6",
        obsidian: "#20242c",
        qingBrick: "#525b66",
        brickDark: "#38404a",
        daiTile: "#28303b",
        eaveTrim: "#758291",
        cinnabar: "#b5332a",
        timber: "#6e4226",
        gold: "#eab63e",
        lanternGlow: "#ffe296",
        jadeAccent: "#4aa38b",
      },
      ops: [
        // Pure 360-degree stepped circular limestone Taiji Altar Y = 0..3 (+30% scaled)
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, radius: 20.3, color: "qingStone" },
        { op: "cylinder", axis: "y", cx: 0, y0: 1, y1: 2, cz: 0, radius: 18.3, color: "stoneLight" },
        { op: "ring", axis: "y", cx: 0, y0: 2, y1: 3, cz: 0, outerR: 18.1, innerR: 16.1, color: "qingStone" },
        { op: "voxels", list: yinYangVoxels },

        // Sleek circular central pavilion podium & 8 vermilion columns (Y = 2..15)
        { op: "cylinder", axis: "y", cx: 0, y0: 2, y1: 5, cz: 0, radius: 5.5, color: "qingBrick" },
        { op: "cylinder", axis: "y", cx: 0, y0: 5, y1: 15, cz: 0, radius: 4.5, color: "qingBrick" },
        { op: "cylinder", axis: "y", cx: 5.8, y0: 3, y1: 15, cz: 0, radius: 0.85, color: "cinnabar", mirrorX: true },
        { op: "cylinder", axis: "y", cx: 0, y0: 3, y1: 15, cz: 5.8, radius: 0.85, color: "cinnabar" },
        { op: "cylinder", axis: "y", cx: 0, y0: 3, y1: 15, cz: -5.8, radius: 0.85, color: "cinnabar" },
        { op: "cylinder", axis: "y", cx: 4.1, y0: 3, y1: 15, cz: 4.1, radius: 0.85, color: "cinnabar", mirrorX: true },
        { op: "cylinder", axis: "y", cx: 4.1, y0: 3, y1: 15, cz: -4.1, radius: 0.85, color: "cinnabar", mirrorX: true },

        // Glowing ground-floor lattice doorways (N/S/E/W)
        { op: "box", x0: -1, y0: 5, z0: 4, x1: 1, y1: 13, z1: 5, color: "lanternGlow", emit: 0.95 },
        { op: "box", x0: -1, y0: 5, z0: -5, x1: 1, y1: 13, z1: -4, color: "lanternGlow", emit: 0.95 },
        { op: "box", x0: 4, y0: 5, z0: -1, x1: 5, y1: 13, z1: 1, color: "lanternGlow", emit: 0.95, mirrorX: true },

        // Tier 1 circular dark-tile upturned eave (Y = 15..19)
        { op: "cone", cx: 0, y0: 15, y1: 19, cz: 0, rBottom: 10.5, rTop: 6.0, color: "daiTile" },
        { op: "ring", axis: "y", cx: 0, y0: 15, y1: 16, cz: 0, outerR: 10.8, innerR: 8.6, color: "gold" },

        // Tier 2 Sichuan gray-brick & red-timber circular gallery (Y = 19..28)
        { op: "cylinder", axis: "y", cx: 0, y0: 19, y1: 28, cz: 0, radius: 4.8, color: "cinnabar" },
        { op: "box", x0: -1, y0: 20, z0: -5, x1: 1, y1: 25, z1: 5, color: "lanternGlow", emit: 0.9 },
        { op: "box", x0: -5, y0: 20, z0: -1, x1: 5, y1: 25, z1: 1, color: "lanternGlow", emit: 0.9 },
        { op: "ring", axis: "y", cx: 0, y0: 19, y1: 21, cz: 0, outerR: 6.5, innerR: 4.8, color: "timber" },

        // Tier 2 eave (Y = 28..32)
        { op: "cone", cx: 0, y0: 28, y1: 32, cz: 0, rBottom: 8.8, rTop: 4.6, color: "daiTile" },
        { op: "ring", axis: "y", cx: 0, y0: 28, y1: 29, cz: 0, outerR: 9.1, innerR: 7.1, color: "eaveTrim" },

        // Tier 3 top circular belvedere & conical roof (Y = 32..46)
        { op: "cylinder", axis: "y", cx: 0, y0: 32, y1: 40, cz: 0, radius: 3.6, color: "qingBrick" },
        { op: "box", x0: -1, y0: 34, z0: -4, x1: 1, y1: 38, z1: 4, color: "lanternGlow", emit: 1.05 },
        { op: "cone", cx: 0, y0: 40, y1: 46, cz: 0, rBottom: 6.9, rTop: 1.1, color: "daiTile" },
        { op: "cylinder", axis: "y", cx: 0, y0: 46, y1: 48, cz: 0, radius: 0.85, color: "gold" },

        ...lanternOps,
      ],
      parts: [
        {
          // Rotating golden Bagua crown spire suspended cleanly at y=51.0..55 (3 voxels above static y=48 spire)
          name: "taiji-compass-finial",
          kind: "spinY",
          speed: 0.55,
          pivot: [0, 51.0, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 3.8, innerR: 2.2, color: "gold", emit: 0.6 },
            { op: "box", x0: -4, y0: 0, z0: 0, x1: 4, y1: 1, z1: 1, color: "gold", emit: 0.5 },
            { op: "box", x0: 0, y0: 0, z0: -4, x1: 1, y1: 1, z1: 4, color: "gold", emit: 0.5 },
            { op: "sphere", cx: 0, cy: 2.8, cz: 0, rx: 1.4, ry: 1.7, rz: 1.4, color: "jadeAccent", emit: 0.9 },
          ],
        },
      ],
    },
    "中天太极观景楼",
  );
}

// ---------------------------------------------------------------------------
// 2. 坎·北：坎水玄武水车阁 (Sichuan Riverside Pavilion & Spinning Bamboo Waterwheel)
// ---------------------------------------------------------------------------
export function buildBaguaKanWaterwheelBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "坎水玄武水车阁",
      description:
        "坐落于八卦城正北坎位的水利奇观，青砖黛瓦水阁旁架设川西老木筒车，日夜汲水润泽城池。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8c939b",
        qingBrick: "#4e5761",
        plaster: "#ece6d8",
        daiTile: "#28303b",
        timber: "#7a4c2a",
        timberLight: "#a66c3e",
        cinnabar: "#b5332a",
        lagoon: "#2490a3",
        aqua: "#58d4de",
        foam: "#eefcff",
        lanternGlow: "#ffe296",
        moss: "#4f9b49",
      },
      ops: [
        // Stepped stone riverbank foundation Y = 0..2
        { op: "box", x0: -10, y0: 0, z0: -10, x1: 8, y1: 2, z1: 9, color: "qingStone" },
        // Turquoise water flume & reservoir pool on the east side (x = 7..15)
        { op: "box", x0: 7, y0: 0, z0: -10, x1: 15, y1: 1, z1: 10, color: "qingStone" },
        { op: "box", x0: 8, y0: 1, z0: -9, x1: 14, y1: 2, z1: 9, color: "lagoon", emit: 0.35 },
        { op: "box", x0: 9, y0: 1, z0: -4, x1: 13, y1: 2, z1: 4, color: "aqua", emit: 0.5 },

        // Stairs facing +Z (toward Taiji plaza)
        { op: "stairs", x0: -3, y0: 0, z0: 9, steps: 2, width: 5, dir: "+z", color: "qingStone" },

        // Sichuan gray-brick & lime-plaster main hall (x = -8..6, z = -7..7, Y = 2..12)
        { op: "hollowBox", x0: -8, y0: 2, z0: -7, x1: 6, y1: 11, z1: 7, wall: 1, color: "qingBrick", trim: "timber" },
        { op: "box", x0: -6, y0: 3, z0: -7, x1: 4, y1: 9, z1: 7, color: "plaster" },
        { op: "arch", cx: -1, y0: 2, cz: 6, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: -6, y0: 5, z0: 6, x1: -4, y1: 8, z1: 7, color: "lanternGlow", emit: 1.0 },
        { op: "box", x0: 2, y0: 5, z0: 6, x1: 4, y1: 8, z1: 7, color: "lanternGlow", emit: 1.0 },

        // Stepped horse-head gable walls & Dai-tile pitched roof
        { op: "box", x0: -9, y0: 9, z0: -8, x1: -8, y1: 14, z1: 8, color: "plaster" },
        { op: "box", x0: 6, y0: 9, z0: -8, x1: 7, y1: 14, z1: 8, color: "plaster" },
        { op: "roofGable", x0: -9, yBase: 11, z0: -8, x1: 7, z1: 8, rise: 6, axis: "x", color: "daiTile", trim: "qingStone" },

        // Wooden axle shaft extending cleanly east to hold waterwheel (cleared around wheel rim!)
        { op: "cylinder", axis: "x", x0: 5, x1: 9, cy: 7, cz: 0, radius: 0.7, color: "timber" },
        { op: "box", x0: 13, y0: 2, z0: -1, x1: 14, y1: 8, z1: 1, color: "timber" },

        // Moss accents along damp stonework
        { op: "sphere", cx: -9, cy: 2.2, cz: -7, rx: 1.6, ry: 1.2, rz: 1.6, color: "moss" },
      ],
      parts: [
        {
          // Spinning wooden waterwheel strictly at x = 10..12, radius 4.2 -> y in [2.8..11.2], 1+ voxel clear of x=9 wall & y=2 pool!
          name: "kan-waterwheel",
          kind: "spinX",
          speed: 0.85,
          pivot: [11, 7.2, 0],
          ops: [
            { op: "ring", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, outerR: 4.4, innerR: 3.3, color: "timberLight" },
            { op: "box", x0: 0, y0: -4, z0: 0, x1: 1, y1: 4, z1: 1, color: "timber" },
            { op: "box", x0: 0, y0: 0, z0: -4, x1: 1, y1: 1, z1: 4, color: "timber" },
            { op: "box", x0: -1, y0: 4, z0: -1, x1: 1, y1: 5, z1: 1, color: "aqua", emit: 0.45 },
            { op: "box", x0: -1, y0: -5, z0: -1, x1: 1, y1: -4, z1: 1, color: "foam", emit: 0.45 },
          ],
        },
      ],
    },
    "坎水玄武水车阁",
  );
}

// ---------------------------------------------------------------------------
// 3. 艮·东北：艮山八卦迷踪观 (Mountain Taoist Maze Courtyard & Hovering Compass)
// ---------------------------------------------------------------------------
export function buildBaguaGenMazeBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "艮山八卦迷踪观",
      description:
        "位居东北艮位的川西石壁道观与八卦迷踪院，青石照壁隐于苍翠山岩与矮墙阵中。",
      category: "building",
      scaleClass: "large",
      palette: {
        granite: "#7d848d",
        graniteLight: "#adb4bc",
        qingBrick: "#4e5660",
        plaster: "#efe8d8",
        daiTile: "#28303b",
        cinnabar: "#b5332a",
        timber: "#74482a",
        moss: "#4c9646",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
        jade: "#3aa68e",
      },
      ops: [
        { op: "roundedBox", x0: -12, y0: 0, z0: -12, x1: 12, y1: 2, z1: 12, radius: 1.5, color: "graniteLight" },
        { op: "stairs", x0: -3, y0: 0, z0: 12, steps: 2, width: 6, dir: "+z", color: "graniteLight" },

        // Front Bagua labyrinth garden walls (low gray brick + plaster coping)
        { op: "box", x0: -11, y0: 2, z0: 4, x1: -4, y1: 5, z1: 5, color: "qingBrick", mirrorX: true },
        { op: "box", x0: -11, y0: 2, z0: 8, x1: -6, y1: 5, z1: 9, color: "qingBrick", mirrorX: true },
        { op: "box", x0: -4, y0: 2, z0: 9, x1: 4, y1: 6, z1: 10, color: "plaster" }, // 照壁 Spirit screen
        { op: "box", x0: -4, y0: 6, z0: 9, x1: 4, y1: 7, z1: 10, color: "daiTile" },

        // Mountain granite crags behind the Taoist hall
        { op: "cone", cx: -8, y0: 2, y1: 18, cz: -8, rBottom: 5.5, rTop: 1.5, color: "granite" },
        { op: "cone", cx: 8, y0: 2, y1: 16, cz: -8, rBottom: 5.0, rTop: 1.4, color: "granite" },
        { op: "sphere", cx: -8, cy: 13, cz: -7, rx: 2.2, ry: 1.4, rz: 2.2, color: "moss" },
        { op: "sphere", cx: 8, cy: 12, cz: -7, rx: 2.0, ry: 1.4, rz: 2.0, color: "moss" },

        // Main Taoist mountain hall at Z = -8..2
        { op: "hollowBox", x0: -7, y0: 2, z0: -7, x1: 7, y1: 11, z1: 2, wall: 1, color: "qingBrick", trim: "cinnabar" },
        { op: "arch", cx: 0, y0: 2, cz: 1, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 4, y0: 4, z0: 1, x1: 6, y1: 7, z1: 2, color: "lanternGlow", emit: 1.0, mirrorX: true },
        { op: "roofGable", x0: -8, yBase: 11, z0: -8, x1: 8, z1: 3, rise: 5, axis: "x", color: "daiTile", trim: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 15, y1: 17, cz: -2, radius: 1.0, color: "timber" },
      ],
      parts: [
        {
          // Floating Bagua jade compass sphere well above roof peak (y=20 vs roof y=17)
          name: "gen-compass-orb",
          kind: "bob",
          speed: 1.6,
          amp: 0.45,
          pivot: [0, 20.5, -2],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 2.4, innerR: 1.6, color: "gold", emit: 0.5 },
            { op: "sphere", cx: 0, cy: 0.5, cz: 0, rx: 1.1, ry: 1.1, rz: 1.1, color: "jade", emit: 0.9 },
          ],
        },
      ],
    },
    "艮山八卦迷踪观",
  );
}

// ---------------------------------------------------------------------------
// 4. 震·东：震雷凌霄鼓楼 (Twin-Eave Drum Tower + Emerald Bamboo + Swinging Drum)
// ---------------------------------------------------------------------------
export function buildBaguaZhenDrumtowerBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "震雷凌霄鼓楼",
      description:
        "东方震位象征春雷与苍翠生机，青砖台基承托重檐木构鼓楼，翠竹摇曳间悬置红木大鼓。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#4b545e",
        daiTile: "#28303b",
        cinnabar: "#b5332a",
        timber: "#6e4226",
        drumSkin: "#f0d9aa",
        drumBody: "#9c2820",
        gold: "#eab63e",
        bamboo: "#539e48",
        bambooLeaf: "#79c458",
        lanternGlow: "#ffe296",
      },
      ops: [
        // Elevated gray-brick drum tower base with central archway Y = 0..8
        { op: "box", x0: -9, y0: 0, z0: -9, x1: 9, y1: 8, z1: 9, color: "qingBrick" },
        { op: "clear", x0: -3, y0: 0, z0: -9, x1: 3, y1: 6, z1: 9 },
        { op: "clear", x0: -9, y0: 0, z0: -3, x1: 9, y1: 6, z1: 3 },
        { op: "box", x0: -10, y0: 7, z0: -10, x1: 10, y1: 9, z1: 10, color: "qingStone" },

        // Open 2nd-story vermilion drum pavilion pillars (corners at ±6, hollow center clear for drum!)
        { op: "pillars", x0: -6, y0: 9, z0: -6, x1: 6, y1: 18, z1: 6, color: "cinnabar" },
        { op: "box", x0: -7, y0: 9, z0: -7, x1: 7, y1: 10, z1: 7, color: "timber" },
        // Tier 1 skirt eave Y = 9..11
        { op: "ring", axis: "y", cx: 0, y0: 10, y1: 11, cz: 0, outerR: 9.2, innerR: 6.8, color: "daiTile" },
        // Upper crossbeam suspending drum at Y = 17..18
        { op: "box", x0: -6, y0: 17, z0: -1, x1: 6, y1: 18, z1: 1, color: "timber" },
        // Roof Y = 18..25
        { op: "roofPyramid", x0: -9, yBase: 18, z0: -9, x1: 9, z1: 9, color: "daiTile", trim: "gold" },

        // Flanking emerald bamboo stalks (震 = 东方木竹)
        { op: "cylinder", axis: "y", cx: 11, y0: 0, y1: 12, cz: -7, radius: 0.6, color: "bamboo", mirrorX: true },
        { op: "sphere", cx: 11, cy: 13, cz: -7, rx: 2.0, ry: 2.0, rz: 2.0, color: "bambooLeaf", mirrorX: true },
        { op: "cylinder", axis: "y", cx: 11, y0: 0, y1: 10, cz: 7, radius: 0.6, color: "bamboo", mirrorX: true },
        { op: "sphere", cx: 11, cy: 11, cz: 7, rx: 1.8, ry: 1.8, rz: 1.8, color: "bambooLeaf", mirrorX: true },
      ],
      parts: [
        {
          // Suspended thunder drum swinging gently inside open 12x12 chamber (y=11.5..15.5, clear of y=17 beam & y=10 floor!)
          name: "zhen-thunder-drum",
          kind: "swingX",
          speed: 1.5,
          amp: 0.18,
          pivot: [0, 16, 0],
          ops: [
            { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 0, z1: 1, color: "gold" },
            { op: "cylinder", axis: "z", cx: 0, cy: -3, z0: -2, z1: 2, radius: 1.8, color: "drumBody" },
            { op: "cylinder", axis: "z", cx: 0, cy: -3, z0: 2, z1: 3, radius: 1.4, color: "drumSkin", emit: 0.35 },
            { op: "cylinder", axis: "z", cx: 0, cy: -3, z0: -3, z1: -2, radius: 1.4, color: "drumSkin", emit: 0.35 },
          ],
        },
      ],
    },
    "震雷凌霄鼓楼",
  );
}

// ---------------------------------------------------------------------------
// 5. 巽·东南：巽风纸鸢风铃阁 (Sichuan Wind-Chime & Spinning Kite Tower)
// ---------------------------------------------------------------------------
export function buildBaguaXunWindmillBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "巽风纸鸢风铃阁",
      description:
        "巽位迎风而立，川西木构高阁檐下悬满铜制风铃，楼顶风转纸鸢随海风轻快旋舞。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#525b66",
        plaster: "#f3ece0",
        daiTile: "#28303b",
        timber: "#7a4c2a",
        cinnabar: "#b5332a",
        kiteGold: "#f4c444",
        kiteJade: "#4cb89c",
        lanternGlow: "#ffe296",
        brass: "#d9a73b",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 2, cz: 0, radius: 9.0, color: "qingStone" },
        { op: "stairs", x0: -2, y0: 0, z0: 8, steps: 2, width: 4, dir: "+z", color: "qingStone" },

        // Two-story octagonal timber & gray-brick wind pavilion
        { op: "hollowBox", x0: -6, y0: 2, z0: -6, x1: 6, y1: 10, z1: 6, wall: 1, color: "plaster", trim: "timber" },
        { op: "arch", cx: 0, y0: 2, cz: 5, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "roofPyramid", x0: -8, yBase: 10, z0: -8, x1: 8, z1: 8, color: "daiTile", trim: "timber" },

        // Upper lookout turret Y = 14..21
        { op: "hollowBox", x0: -4, y0: 14, z0: -4, x1: 4, y1: 20, z1: 4, wall: 1, color: "qingBrick", trim: "cinnabar" },
        { op: "box", x0: -2, y0: 15, z0: -5, x1: 2, y1: 18, z1: 5, color: "lanternGlow", emit: 0.95 },
        { op: "roofPyramid", x0: -6, yBase: 20, z0: -6, x1: 6, z1: 6, color: "daiTile", trim: "brass" },
        { op: "cylinder", axis: "y", cx: 0, y0: 23, y1: 26, cz: 0, radius: 0.6, color: "brass" },
      ],
      parts: [
        {
          // Rotating kite pinwheel crown well above static y=26 finial
          name: "xun-wind-spinner",
          kind: "spinY",
          speed: 1.25,
          pivot: [0, 28.0, 0],
          ops: [
            { op: "box", x0: -6, y0: 0, z0: 0, x1: 6, y1: 1, z1: 1, color: "timber" },
            { op: "box", x0: 0, y0: 0, z0: -6, x1: 1, y1: 1, z1: 6, color: "timber" },
            { op: "box", x0: 3, y0: -1, z0: 1, x1: 6, y1: 2, z1: 3, color: "kiteGold", emit: 0.35 },
            { op: "box", x0: -6, y0: -1, z0: -3, x1: -3, y1: 2, z1: -1, color: "kiteGold", emit: 0.35 },
            { op: "box", x0: 1, y0: -1, z0: -6, x1: 3, y1: 2, z1: -3, color: "kiteJade", emit: 0.35 },
            { op: "box", x0: -3, y0: -1, z0: 3, x1: -1, y1: 2, z1: 6, color: "kiteJade", emit: 0.35 },
          ],
        },
        {
          // Outboard bronze wind chime east eave (x=9.5, well outside eave x=8)
          name: "xun-chime-east",
          kind: "swingZ",
          speed: 2.1,
          amp: 0.25,
          pivot: [9.5, 10, 0],
          ops: [
            { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 0, z1: 1, color: "brass" },
            { op: "cone", cx: 0, y0: -4, y1: -2, cz: 0, rBottom: 1.0, rTop: 0.5, color: "kiteGold", emit: 0.45 },
          ],
        },
        {
          // Outboard bronze wind chime west eave (x=-9.5)
          name: "xun-chime-west",
          kind: "swingZ",
          speed: 2.1,
          amp: 0.25,
          phase: 1.6,
          pivot: [-9.5, 10, 0],
          ops: [
            { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 0, z1: 1, color: "brass" },
            { op: "cone", cx: 0, y0: -4, y1: -2, cz: 0, rBottom: 1.0, rTop: 0.5, color: "kiteGold", emit: 0.45 },
          ],
        },
      ],
    },
    "巽风纸鸢风铃阁",
  );
}

// ---------------------------------------------------------------------------
// 6. 离·南：离火朱雀大戏台 (Sichuan Opera Ancient Stage & Lanterns)
// ---------------------------------------------------------------------------
export function buildBaguaLiStageBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "离火朱雀大戏台",
      description:
        "正南离火位代表光明礼乐，朱柱藻井的川剧古戏台灯笼高照，飞檐挑角尽显巴蜀神韵。",
      category: "building",
      scaleClass: "large",
      palette: {
        sandStone: "#cbbba0",
        qingBrick: "#4b545e",
        plaster: "#f3ead8",
        daiTile: "#28303b",
        cinnabar: "#c23127",
        timber: "#6b3e22",
        gold: "#f2be3d",
        lanternRed: "#f24838",
        lanternGlow: "#ffe296",
        silkBlue: "#2d5f8b",
      },
      ops: [
        // Stage stone terrace Y = 0..4
        { op: "box", x0: -11, y0: 0, z0: -9, x1: 11, y1: 4, z1: 9, color: "qingBrick" },
        { op: "box", x0: -12, y0: 3, z0: -10, x1: 12, y1: 4, z1: 10, color: "sandStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 9, steps: 4, width: 6, dir: "+z", color: "sandStone" },

        // Back backdrop screen wall (出将入相幕墙) at Z = -8..-6
        { op: "box", x0: -9, y0: 4, z0: -8, x1: 9, y1: 13, z1: -6, color: "cinnabar" },
        { op: "box", x0: -6, y0: 5, z0: -6, x1: 6, y1: 11, z1: -5, color: "silkBlue" },
        { op: "box", x0: -3, y0: 6, z0: -5, x1: 3, y1: 10, z1: -4, color: "gold" },

        // Four tall vermilion front & mid stage pillars
        { op: "cylinder", axis: "y", cx: 8, y0: 4, y1: 14, cz: 7, radius: 0.8, color: "cinnabar", mirrorX: true },
        { op: "cylinder", axis: "y", cx: 8, y0: 4, y1: 14, cz: -1, radius: 0.8, color: "cinnabar", mirrorX: true },

        // Ornate carved lintel & glowing red opera lanterns under front eaves
        { op: "box", x0: -9, y0: 13, z0: 6, x1: 9, y1: 15, z1: 8, color: "timber" },
        { op: "sphere", cx: 5, cy: 11.5, cz: 8, rx: 1.1, ry: 1.3, rz: 1.1, color: "lanternRed", emit: 1.2, mirrorX: true },
        { op: "sphere", cx: 0, cy: 11.5, cz: 8, rx: 1.1, ry: 1.3, rz: 1.1, color: "lanternGlow", emit: 1.2 },

        // Pitched dark-tile double Xieshan-style theater roof Y = 14..21
        { op: "roofGable", x0: -11, yBase: 14, z0: -10, x1: 11, z1: 10, rise: 6, axis: "x", color: "daiTile", trim: "gold" },
        { op: "box", x0: -12, y0: 13, z0: -10, x1: -11, y1: 18, z1: 10, color: "plaster" },
        { op: "box", x0: 11, y0: 13, z0: -10, x1: 12, y1: 18, z1: 10, color: "plaster" },
      ],
      parts: [
        {
          // Bobbing vermilion phoenix flame ornament cleanly above ridge y=20
          name: "li-phoenix-flame",
          kind: "bob",
          speed: 1.9,
          amp: 0.45,
          pivot: [0, 23.0, 0],
          ops: [
            { op: "sphere", cx: 0, cy: 0, cz: 0, rx: 1.4, ry: 1.6, rz: 1.4, color: "lanternRed", emit: 1.1 },
            { op: "cone", cx: 0, y0: 1, y1: 4, cz: 0, rBottom: 1.1, rTop: 0.3, color: "gold", emit: 0.9 },
          ],
        },
      ],
    },
    "离火朱雀大戏台",
  );
}

// ---------------------------------------------------------------------------
// 7. 坤·西南：坤地蜀风四合院 (Sichuan Gray-Brick Horse-Head Wall Courtyard)
// ---------------------------------------------------------------------------
export function buildBaguaKunCourtyardBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "坤地蜀风四合院",
      description:
        "西南坤位厚德载物，展现典型川西民居青砖马头墙围合四合院格局，院内天光敞亮，红灯高挂。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#525b66",
        plaster: "#f3ece0",
        daiTile: "#28303b",
        timber: "#7a4c2a",
        cinnabar: "#b5332a",
        lanternRed: "#ef4a3a",
        lanternGlow: "#ffe296",
        treeBark: "#664026",
        blossom: "#f28aa8",
        leaf: "#499447",
      },
      ops: [
        // Paved stone courtyard floor Y = 0..1
        { op: "box", x0: -12, y0: 0, z0: -12, x1: 12, y1: 1, z1: 12, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 12, steps: 1, width: 6, dir: "+z", color: "qingStone" },

        // North main hall (堂屋) Z = -12..-5
        { op: "hollowBox", x0: -10, y0: 1, z0: -12, x1: 10, y1: 9, z1: -5, wall: 1, color: "plaster", trim: "timber" },
        { op: "arch", cx: 0, y0: 1, cz: -6, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 4, y0: 3, z0: -6, x1: 7, y1: 6, z1: -5, color: "lanternGlow", emit: 0.9, mirrorX: true },
        { op: "roofGable", x0: -11, yBase: 9, z0: -13, x1: 11, z1: -4, rise: 4, axis: "x", color: "daiTile", trim: "qingStone" },

        // East & West side wings (东西厢房) + stepped horse-head walls (马头墙)
        { op: "hollowBox", x0: 7, y0: 1, z0: -5, x1: 12, y1: 7, z1: 9, wall: 1, color: "qingBrick", trim: "timber", mirrorX: true },
        { op: "roofGable", x0: 6, yBase: 7, z0: -6, x1: 13, z1: 10, rise: 3, axis: "z", color: "daiTile", trim: "plaster" },
        { op: "roofGable", x0: -13, yBase: 7, z0: -6, x1: -6, z1: 10, rise: 3, axis: "z", color: "daiTile", trim: "plaster" },
        // Stepped horse-head gable finials on front corners
        { op: "box", x0: 7, y0: 7, z0: 9, x1: 12, y1: 10, z1: 11, color: "plaster", mirrorX: true },
        { op: "box", x0: 8, y0: 10, z0: 9, x1: 11, y1: 12, z1: 11, color: "daiTile", mirrorX: true },

        // Front gatehouse wall & arched doorway (朝南大门)
        { op: "box", x0: -8, y0: 1, z0: 10, x1: -3, y1: 7, z1: 12, color: "qingBrick", mirrorX: true },
        { op: "box", x0: -4, y0: 6, z0: 10, x1: 4, y1: 8, z1: 12, color: "cinnabar" },
        { op: "roofGable", x0: -5, yBase: 8, z0: 9, x1: 5, z1: 13, rise: 3, axis: "x", color: "daiTile", trim: "qingStone" },

        // Blossoming pomegranate tree inside courtyard center
        { op: "cylinder", axis: "y", cx: -2, y0: 1, y1: 5, cz: 2, radius: 0.7, color: "treeBark" },
        { op: "sphere", cx: -2, cy: 6.5, cz: 2, rx: 2.8, ry: 2.2, rz: 2.8, color: "leaf" },
        { op: "voxels", list: [[-3, 7, 3, "blossom", 0.3], [-1, 8, 1, "blossom", 0.3], [-2, 6, 4, "blossom", 0.3]] },
      ],
      parts: [
        {
          // Swaying festive red gate lantern out front
          name: "kun-lantern-east",
          kind: "swingZ",
          speed: 1.8,
          amp: 0.22,
          pivot: [4, 7.5, 13.2],
          ops: [
            { op: "box", x0: 0, y0: -1, z0: 0, x1: 1, y1: 0, z1: 1, color: "timber" },
            { op: "sphere", cx: 0, cy: -2.0, cz: 0, rx: 1.0, ry: 1.2, rz: 1.0, color: "lanternRed", emit: 1.15 },
          ],
        },
        {
          name: "kun-lantern-west",
          kind: "swingZ",
          speed: 1.8,
          amp: 0.22,
          phase: 1.2,
          pivot: [-4, 7.5, 13.2],
          ops: [
            { op: "box", x0: 0, y0: -1, z0: 0, x1: 1, y1: 0, z1: 1, color: "timber" },
            { op: "sphere", cx: 0, cy: -2.0, cz: 0, rx: 1.0, ry: 1.2, rz: 1.0, color: "lanternRed", emit: 1.15 },
          ],
        },
      ],
    },
    "坤地蜀风四合院",
  );
}

// ---------------------------------------------------------------------------
// 8. 兑·西：兑泽荷风迎宾阁 (Riverside Welcoming Tea Pavilion beside Bridge Avenue)
// ---------------------------------------------------------------------------
export function buildBaguaDuiPavilionBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "兑泽荷风迎宾阁",
      description:
        "坐落于八卦城西端兑泽荷池畔的迎宾茶阁，临水而筑，飞檐挑灯迎接经折叠空间传送而来的双岛旅人。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#c8ccd0",
        daiTile: "#28303b",
        timber: "#7a4c2a",
        cinnabar: "#b5332a",
        plaster: "#f4ede0",
        lotusPink: "#f585ad",
        lotusLeaf: "#4ea352",
        lanternGlow: "#ffe296",
        gold: "#ebb93c",
      },
      ops: [
        // Octagonal-feel welcoming stone terrace Y = 0..2
        { op: "roundedBox", x0: -9, y0: 0, z0: -9, x1: 9, y1: 2, z1: 9, radius: 2.5, color: "stoneLight" },
        { op: "stairs", x0: -3, y0: 0, z0: 9, steps: 2, width: 6, dir: "+z", color: "qingStone" },

        // Open ground-floor tea veranda columns & glowing shoji tea bar (Y = 2..9)
        { op: "pillars", x0: -7, y0: 2, z0: -7, x1: 7, y1: 9, z1: 7, color: "cinnabar" },
        { op: "hollowBox", x0: -5, y0: 2, z0: -5, x1: 5, y1: 9, z1: 3, wall: 1, color: "plaster", trim: "timber" },
        { op: "box", x0: -3, y0: 3, z0: 2, x1: 3, y1: 7, z1: 4, color: "lanternGlow", emit: 1.05 },

        // Tier 1 wide overhanging Dai-tile tea pavilion roof Y = 9..13
        { op: "roofPyramid", x0: -9, yBase: 9, z0: -9, x1: 9, z1: 9, color: "daiTile", trim: "gold" },

        // Upper welcoming attic balcony Y = 13..18
        { op: "hollowBox", x0: -4, y0: 13, z0: -4, x1: 4, y1: 17, z1: 4, wall: 1, color: "cinnabar", trim: "timber" },
        { op: "box", x0: -2, y0: 14, z0: -5, x1: 2, y1: 16, z1: 5, color: "lanternGlow", emit: 1.0 },
        { op: "roofPyramid", x0: -6, yBase: 17, z0: -6, x1: 6, z1: 6, color: "daiTile", trim: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 20, y1: 22, cz: 0, radius: 0.6, color: "gold" },
      ],
      parts: [
        {
          // Hovering lotus lantern finial cleanly above roof tip y=22
          name: "dui-lotus-finial",
          kind: "bob",
          speed: 1.7,
          amp: 0.4,
          pivot: [0, 24.5, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: -1, y1: 0, cz: 0, outerR: 2.0, innerR: 1.0, color: "lotusLeaf" },
            { op: "sphere", cx: 0, cy: 0.5, cz: 0, rx: 1.3, ry: 1.1, rz: 1.3, color: "lotusPink", emit: 0.85 },
          ],
        },
      ],
    },
    "兑泽荷风迎宾阁",
  );
}

// ---------------------------------------------------------------------------
// 9. 乾·西北：乾天浑仪文昌院 (Langzhong Scholarly Academy & Spinning Armillary Sphere)
// ---------------------------------------------------------------------------
export function buildBaguaQianObservatoryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "乾天浑仪文昌院",
      description:
        "西北乾位主天象与文风，仿阆中贡院文昌阁格局，青砖高台上安置凌空旋转的黄铜浑天仪。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#c8ccd0",
        qingBrick: "#4b545e",
        daiTile: "#28303b",
        cinnabar: "#b5332a",
        timber: "#6e4226",
        gold: "#ebb93c",
        brass: "#d49e35",
        inkPool: "#1e4b63",
        lanternGlow: "#ffe296",
      },
      ops: [
        // Elevated imperial academy stone platform & ink-pond forecourt Y = 0..3
        { op: "box", x0: -11, y0: 0, z0: -10, x1: 11, y1: 3, z1: 10, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 10, steps: 3, width: 6, dir: "+z", color: "stoneLight" },
        { op: "box", x0: -6, y0: 2, z0: 6, x1: 6, y1: 3, z1: 9, color: "inkPool", emit: 0.3 },

        // Two-tier Langzhong Wenchang gray-brick & red-column Hall Y = 3..18
        { op: "hollowBox", x0: -8, y0: 3, z0: -8, x1: 8, y1: 11, z1: 4, wall: 1, color: "qingBrick", trim: "cinnabar" },
        { op: "arch", cx: 0, y0: 3, cz: 3, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 4, y0: 5, z0: 3, x1: 6, y1: 8, z1: 4, color: "lanternGlow", emit: 0.95, mirrorX: true },
        { op: "ring", axis: "y", cx: 0, y0: 10, y1: 11, cz: -2, outerR: 9.0, innerR: 6.5, color: "daiTile" },

        { op: "hollowBox", x0: -5, y0: 11, z0: -6, x1: 5, y1: 17, z1: 2, wall: 1, color: "cinnabar", trim: "timber" },
        { op: "box", x0: -2, y0: 12, z0: -7, x1: 2, y1: 15, z1: 3, color: "lanternGlow", emit: 0.95 },
        { op: "roofPyramid", x0: -7, yBase: 17, z0: -8, x1: 7, z1: 4, color: "daiTile", trim: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 21, y1: 23, cz: -2, radius: 0.7, color: "brass" },
      ],
      parts: [
        {
          // Spinning brass celestial armillary sphere cleanly above spire y=23
          name: "qian-armillary-sphere",
          kind: "spinY",
          speed: 0.7,
          pivot: [0, 26.5, -2],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 3.2, innerR: 2.5, color: "gold", emit: 0.5 },
            { op: "ring", axis: "z", cx: 0, cy: 0.5, z0: -1, z1: 1, outerR: 3.0, innerR: 2.4, color: "brass", emit: 0.4 },
            { op: "sphere", cx: 0, cy: 0.5, cz: 0, rx: 1.0, ry: 1.0, rz: 1.0, color: "lanternGlow", emit: 0.95 },
          ],
        },
      ],
    },
    "乾天浑仪文昌院",
  );
}

// ---------------------------------------------------------------------------
// 10. 八卦城观光专车 (Sichuan Emerald & Vermilion Bagua City Sightseeing Shuttle)
// ---------------------------------------------------------------------------
export function buildBaguaShuttleBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint({
    name: "八卦城观光专车",
    description: "往返川西八卦城兑泽门、二环坊市与中天太极广场的古风雕花观光接驳车。",
    category: "vehicle",
    scaleClass: "medium",
    palette: {
      jadeBody: "#2d786a",
      jadeShade: "#1f594e",
      cinnabar: "#b83c32",
      goldTrim: "#e8ba4e",
      creamRoof: "#f4ebd7",
      slateTile: "#38414c",
      trimBlack: "#22252b",
      glass: "#b8ecfa",
      tire: "#1f2127",
      headlight: "#fff0b3",
      taillight: "#ff5347",
      lantern: "#ffb84d",
    },
    ops: [
      { op: "box", x0: -6, y0: 2, z0: -13, x1: 6, y1: 5, z1: 13, color: "jadeShade" },
      { op: "roundedBox", x0: -6, y0: 4, z0: -13, x1: 6, y1: 12, z1: 11, radius: 1.4, color: "jadeBody" },
      // Cinnabar waistband & gilded belt trim
      { op: "box", x0: -6, y0: 6, z0: -13, x1: 6, y1: 7, z1: 11, color: "cinnabar" },
      { op: "box", x0: -6, y0: 5, z0: -13, x1: 6, y1: 6, z1: 11, color: "goldTrim" },
      // Turned-eave antique sightseeing canopy roof
      { op: "roundedBox", x0: -7, y0: 12, z0: -13, x1: 7, y1: 14, z1: 12, radius: 1.0, color: "slateTile" },
      { op: "box", x0: -5, y0: 14, z0: -11, x1: 5, y1: 15, z1: 9, color: "cinnabar" },
      { op: "box", x0: -2, y0: 15, z0: -6, x1: 2, y1: 16, z1: 4, color: "goldTrim" },
      // Panoramic sightseeing windows
      { op: "box", x0: -5, y0: 8, z0: 10, x1: 5, y1: 11, z1: 12, color: "glass" },
      { op: "box", x0: -4, y0: 8, z0: -13, x1: 4, y1: 11, z1: -12, color: "glass" },
      { op: "box", x0: -6, y0: 8, z0: -10, x1: 6, y1: 11, z1: -7, color: "glass" },
      { op: "box", x0: -6, y0: 8, z0: -5, x1: 6, y1: 11, z1: -2, color: "glass" },
      { op: "box", x0: -6, y0: 8, z0: 0, x1: 6, y1: 11, z1: 3, color: "glass" },
      { op: "box", x0: -6, y0: 8, z0: 5, x1: 6, y1: 11, z1: 8, color: "glass" },
      // Brass bumpers & headlights / corner roof lanterns
      { op: "box", x0: -6, y0: 2, z0: 12, x1: 6, y1: 3, z1: 14, color: "goldTrim" },
      { op: "box", x0: -6, y0: 2, z0: -14, x1: 6, y1: 3, z1: -13, color: "goldTrim" },
      { op: "box", x0: 4, y0: 4, z0: 11, x1: 5, y1: 6, z1: 12, color: "headlight", emit: 1.5, mirrorX: true },
      { op: "box", x0: 4, y0: 4, z0: -13, x1: 5, y1: 6, z1: -12, color: "taillight", emit: 1.3, mirrorX: true },
      { op: "box", x0: 6, y0: 10, z0: 10, x1: 7, y1: 12, z1: 11, color: "lantern", emit: 1.6, mirrorX: true },
      { op: "box", x0: 6, y0: 10, z0: -12, x1: 7, y1: 12, z1: -11, color: "lantern", emit: 1.6, mirrorX: true },
      // Carve clean wheel arches
      { op: "clear", x0: 4, y0: 0, z0: 6, x1: 8, y1: 6, z1: 13, mirrorX: true },
      { op: "clear", x0: 4, y0: 0, z0: -12, x1: 8, y1: 6, z1: -5, mirrorX: true },
    ],
    parts: [
      {
        name: "front-axle",
        kind: "wheel",
        speed: 1.0,
        pivot: [0, 3, 9.5],
        ops: [
          { op: "cylinder", axis: "x", x0: 5, x1: 7, cy: 0, cz: 0, radius: 2.6, color: "tire", mirrorX: true },
          { op: "cylinder", axis: "x", x0: 6, x1: 7, cy: 0, cz: 0, radius: 1.3, color: "goldTrim", mirrorX: true },
        ],
      },
      {
        name: "rear-axle",
        kind: "wheel",
        speed: 1.0,
        pivot: [0, 3, -8.5],
        ops: [
          { op: "cylinder", axis: "x", x0: 5, x1: 7, cy: 0, cz: 0, radius: 2.6, color: "tire", mirrorX: true },
          { op: "cylinder", axis: "x", x0: 6, x1: 7, cy: 0, cz: 0, radius: 1.3, color: "goldTrim", mirrorX: true },
        ],
      },
    ],
  });
}

/**
 * Ensures the entire East Bagua Island district (9 Sichuan Bagua buildings, concentric & radial
 * non-crossing stone avenues, bridgehead approaches, Taiji plaza terrain zones, and scenic props)
 * exists cleanly and idempotently in world state across both fresh boots and saved snapshots.
 */
// ---------------------------------------------------------------------------
// 11. 扶摇大鹏 (Golden-Azure Mythic Roc soaring across all islands & portals)
// ---------------------------------------------------------------------------
export function buildDapengRocBlueprint(): VoxelBlueprint {
  // +Z is forward, -Z is tail, X is wingspan (+/-). Paired swingZ wings use phase 0 (+X) and Math.PI (-X)
  // so both wings flap symmetrically up and down in unison.
  const rightWingOps: VoxelBlueprint["ops"] = [
    // Shoulder joint & heavy golden covert muscles (local x = 0..14)
    { op: "box", x0: 0, y0: 0, z0: -2, x1: 6, y1: 2, z1: 3, color: "goldFeather" },
    { op: "box", x0: 5, y0: 0, z0: -3, x1: 12, y1: 2, z1: 2, color: "amberPlume" },
    { op: "box", x0: 11, y0: 0, z0: -4, x1: 18, y1: 1, z1: 1, color: "goldFeather" },
    // Leading-edge luminous cyan spiritual pinion vein
    { op: "box", x0: 1, y0: 2, z0: 2, x1: 14, y1: 3, z1: 3, color: "jadeEnergy", emit: 1.05 },
    { op: "box", x0: 14, y0: 1, z0: 0, x1: 21, y1: 2, z1: 2, color: "jadeEnergy", emit: 1.25 },
    // Swept deep-indigo secondary flight feathers
    { op: "box", x0: 1, y0: 0, z0: -6, x1: 8, y1: 1, z1: -2, color: "indigoPlume" },
    { op: "box", x0: 7, y0: 0, z0: -7, x1: 15, y1: 1, z1: -3, color: "obsidianPlume" },
    // Splayed golden-tipped primary wingtip feathers (x = 18..25)
    { op: "box", x0: 18, y0: 0, z0: -2, x1: 24, y1: 1, z1: 0, color: "goldFeather", emit: 0.35 },
    { op: "box", x0: 16, y0: 0, z0: -5, x1: 23, y1: 1, z1: -3, color: "indigoPlume" },
    { op: "box", x0: 13, y0: 0, z0: -8, x1: 20, y1: 1, z1: -6, color: "goldFeather" },
    { op: "box", x0: 22, y0: 1, z0: -1, x1: 25, y1: 2, z1: 1, color: "jadeEnergy", emit: 1.35 },
  ];

  const leftWingOps: VoxelBlueprint["ops"] = rightWingOps.map((o) => {
    if (o.op === "box") {
      return { ...o, x0: -o.x1, x1: -o.x0 };
    }
    return o;
  });

  return normalizeAndGroundBlueprint(
    {
      name: "扶摇大鹏",
      description:
        "金翅玄羽、翼展遮空的太古神鸟大鹏，环游主岛、川西八卦城及诸方新增海岛天穹，更能俯冲穿过空间传送阵随机跃迁至不同岛屿。",
      category: "aircraft",
      scaleClass: "large",
      palette: {
        goldFeather: "#f5c249",
        amberPlume: "#d89028",
        indigoPlume: "#284478",
        obsidianPlume: "#1b243b",
        jadeEnergy: "#5ef2e4",
        crimsonCrest: "#d94e3f",
        beakGold: "#ffd966",
        ivoryBreast: "#f2e5c4",
      },
      ops: [
        // Streamlined avian fuselage & golden breast
        { op: "sphere", cx: 0, cy: 5, cz: 1, rx: 3.4, ry: 2.9, rz: 7.2, color: "obsidianPlume" },
        { op: "sphere", cx: 0, cy: 3.6, cz: 2.2, rx: 2.9, ry: 2.1, rz: 5.5, color: "goldFeather" },
        { op: "box", x0: -2, y0: 2, z0: 3, x1: 2, y1: 4, z1: 7, color: "ivoryBreast" },
        // Dorsal glowing cyan Bagua spine rune
        { op: "box", x0: -1, y0: 7, z0: -4, x1: 1, y1: 8, z1: 5, color: "jadeEnergy", emit: 1.1 },
        // Neck & noble raptor head (+Z forward)
        { op: "cylinder", axis: "z", cx: 0, cy: 6.2, z0: 6, z1: 11, radius: 2.1, color: "goldFeather" },
        { op: "sphere", cx: 0, cy: 7.5, cz: 11.2, rx: 2.1, ry: 1.9, rz: 2.3, color: "indigoPlume" },
        // Sharp hooked golden beak
        { op: "box", x0: -1, y0: 6, z0: 13, x1: 1, y1: 8, z1: 15, color: "beakGold" },
        { op: "box", x0: -1, y0: 5, z0: 14, x1: 1, y1: 7, z1: 16, color: "beakGold" },
        // Luminous eyes & swept phoenix-roc crest
        { op: "box", x0: 1, y0: 7, z0: 11, x1: 2, y1: 8, z1: 12, color: "jadeEnergy", emit: 1.5, mirrorX: true },
        { op: "box", x0: -1, y0: 9, z0: 7, x1: 1, y1: 11, z1: 11, color: "crimsonCrest" },
        { op: "box", x0: -2, y0: 9, z0: 5, x1: 2, y1: 10, z1: 8, color: "goldFeather" },
        // Tucked golden talons under belly
        { op: "box", x0: 1, y0: 0, z0: -2, x1: 2, y1: 2, z1: 2, color: "beakGold", mirrorX: true },
        { op: "box", x0: 1, y0: 0, z0: 2, x1: 2, y1: 1, z1: 3, color: "beakGold", mirrorX: true },
        // Tail root fairing
        { op: "box", x0: -2, y0: 4, z0: -9, x1: 2, y1: 6, z1: -5, color: "indigoPlume" },
      ],
      parts: [
        {
          name: "right-wing",
          kind: "swingZ",
          speed: 1.25,
          amp: 0.44,
          phase: 0,
          pivot: [3, 5, 1],
          ops: rightWingOps,
        },
        {
          name: "left-wing",
          kind: "swingZ",
          speed: 1.25,
          amp: 0.44,
          phase: Math.PI,
          pivot: [-3, 5, 1],
          ops: leftWingOps,
        },
        {
          name: "tail-fan",
          kind: "swingX",
          speed: 0.9,
          amp: 0.14,
          phase: 0.4,
          pivot: [0, 5, -9],
          ops: [
            { op: "box", x0: -2, y0: -1, z0: -9, x1: 2, y1: 0, z1: 0, color: "indigoPlume" },
            { op: "box", x0: -5, y0: -1, z0: -10, x1: -2, y1: 0, z1: -2, color: "goldFeather" },
            { op: "box", x0: 2, y0: -1, z0: -10, x1: 5, y1: 0, z1: -2, color: "goldFeather" },
            { op: "box", x0: -1, y0: 0, z0: -12, x1: 1, y1: 1, z1: -6, color: "jadeEnergy", emit: 1.0 },
          ],
        },
      ],
    },
    "扶摇大鹏",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// ---------------------------------------------------------------------------
// 12. 八门石牌坊 (Outer Ring-4 Ceremonial Bagua Gate Archways, Open & Walkable)
// ---------------------------------------------------------------------------
export function buildBaguaGateBlueprint(
  gateName: string,
  trigramLabel: string,
  accentHex: string,
): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: `八卦${gateName}牌坊`,
      description: `屹立在川西八卦城四环城垣${trigramLabel}门户的青石朱柱飞檐牌坊（${gateName}），敞阔中门可供行人直穿进出。`,
      category: "prop",
      scaleClass: "medium",
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#c8ccd0",
        cinnabar: "#b5332a",
        timber: "#6e4226",
        daiTile: "#28303b",
        eaveTrim: "#758291",
        gold: "#eab63e",
        lantern: "#ffe296",
        accent: accentHex,
      },
      ops: [
        // Twin stone pillar bases flanking a wide 14-voxel clear central passageway (x = -7..7 completely open!)
        { op: "box", x0: -10, y0: 0, z0: -3, x1: -7, y1: 2, z1: 3, color: "qingStone", mirrorX: true },
        { op: "box", x0: -10, y0: 2, z0: -2, x1: -7, y1: 3, z1: 2, color: "stoneLight", mirrorX: true },
        // Twin vertical cinnabar pillars Y=3..13
        { op: "box", x0: -9, y0: 3, z0: -1, x1: -7, y1: 13, z1: 1, color: "cinnabar", mirrorX: true },
        // Outer secondary side buttresses Y=0..10
        { op: "box", x0: -12, y0: 0, z0: -2, x1: -10, y1: 2, z1: 2, color: "qingStone", mirrorX: true },
        { op: "box", x0: -11, y0: 2, z0: -1, x1: -10, y1: 10, z1: 1, color: "timber", mirrorX: true },
        // Elevated crossbeam & glowing trigram crest high overhead Y=12..16 (clear above head)
        { op: "box", x0: -11, y0: 12, z0: -1, x1: 11, y1: 14, z1: 1, color: "timber" },
        { op: "box", x0: -4, y0: 14, z0: -2, x1: 4, y1: 16, z1: 2, color: "cinnabar" },
        { op: "box", x0: -2, y0: 14, z0: -2, x1: 2, y1: 16, z1: 2, color: "accent", emit: 1.15 },
        // Side hanging warm stone lanterns on outer posts
        { op: "box", x0: -12, y0: 9, z0: -1, x1: -11, y1: 11, z1: 1, color: "lantern", emit: 1.35, mirrorX: true },
        // Upturned Dai-tile gateway roof Y=16..20
        { op: "box", x0: -13, y0: 16, z0: -3, x1: 13, y1: 17, z1: 3, color: "eaveTrim" },
        { op: "box", x0: -12, y0: 17, z0: -2, x1: 12, y1: 18, z1: 2, color: "daiTile" },
        { op: "box", x0: -8, y0: 18, z0: -1, x1: 8, y1: 19, z1: 1, color: "daiTile" },
        { op: "box", x0: -2, y0: 19, z0: -1, x1: 2, y1: 20, z1: 1, color: "gold", emit: 0.45 },
      ],
      parts: [],
    },
    `八卦${gateName}牌坊`,
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// ---------------------------------------------------------------------------
// 13. 八卦城内城坊市建筑与互动灵台 (Ring 1-2 & Ring 3-4 Infill Landmarks)
// ---------------------------------------------------------------------------

// 13a. 八卦盖碗茶馆 (Sichuan Covered-Bowl Teahouse)
export function buildBaguaTeahouseBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "八卦盖碗茶馆",
      description:
        "川西青瓦竹廊盖碗茶馆，红灯映暖窗，檐前铜壶蒸雾氤氲，迎着二环坊市客流煮茶待客。",
      category: "building",
      scaleClass: "medium",
      palette: {
        qingStone: "#8d9399",
        plaster: "#f3ecdf",
        timber: "#6f4526",
        bamboo: "#679c4c",
        daiTile: "#2a313c",
        cinnabar: "#b8362c",
        lanternGlow: "#ffe296",
        copper: "#d68c3e",
        gold: "#ebb93c",
      },
      ops: [
        { op: "box", x0: -8, y0: 0, z0: -7, x1: 8, y1: 1, z1: 7, color: "qingStone" },
        { op: "stairs", x0: -2, y0: 0, z0: 7, steps: 1, width: 4, dir: "+z", color: "qingStone" },
        { op: "hollowBox", x0: -6, y0: 1, z0: -5, x1: 6, y1: 8, z1: 5, wall: 1, color: "plaster", trim: "timber" },
        { op: "arch", cx: 0, y0: 1, cz: 4, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 3, y0: 3, z0: 4, x1: 5, y1: 6, z1: 5, color: "lanternGlow", emit: 1.0, mirrorX: true },
        // Bamboo porch pillars
        { op: "cylinder", axis: "y", cx: 6, y0: 1, y1: 8, cz: 6, radius: 0.55, color: "bamboo", mirrorX: true },
        { op: "roofGable", x0: -8, yBase: 8, z0: -7, x1: 8, z1: 7, rise: 5, axis: "x", color: "daiTile", trim: "gold" },
        // Decorative gilded copper tea kettle finial
        { op: "cylinder", axis: "y", cx: 0, y0: 13, y1: 15, cz: 0, radius: 1.1, color: "copper" },
        { op: "box", x0: -2, y0: 14, z0: 0, x1: 2, y1: 15, z1: 1, color: "gold" },
      ],
      parts: [
        {
          name: "tea-lantern-l",
          kind: "swingZ",
          speed: 1.7,
          amp: 0.18,
          pivot: [-6, 7.6, 6.2],
          ops: [
            { op: "box", x0: 0, y0: -1, z0: 0, x1: 1, y1: 0, z1: 1, color: "timber" },
            { op: "sphere", cx: 0, cy: -1.8, cz: 0, rx: 0.9, ry: 1.1, rz: 0.9, color: "lanternGlow", emit: 1.2 },
          ],
        },
        {
          name: "tea-lantern-r",
          kind: "swingZ",
          speed: 1.7,
          amp: 0.18,
          phase: 1.3,
          pivot: [6, 7.6, 6.2],
          ops: [
            { op: "box", x0: 0, y0: -1, z0: 0, x1: 1, y1: 0, z1: 1, color: "timber" },
            { op: "sphere", cx: 0, cy: -1.8, cz: 0, rx: 0.9, ry: 1.1, rz: 0.9, color: "lanternGlow", emit: 1.2 },
          ],
        },
      ],
    },
    "八卦盖碗茶馆",
  );
}

// 13b. 锦绣蜀绣坊 (Shu Brocade & Lantern Craft Atelier)
export function buildBaguaSilkShopBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "锦绣蜀绣坊",
      description:
        "二环离火内坊的手工蜀绣锦缎铺，檐下垂挂五彩绫罗布幡与吉祥灯笼，尽显巴蜀织造神韵。",
      category: "building",
      scaleClass: "medium",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#4d5561",
        plaster: "#f2eadb",
        daiTile: "#28303b",
        cinnabar: "#c2342b",
        silkPink: "#eb6f92",
        silkTeal: "#3bb39e",
        gold: "#ebb93c",
        timber: "#6f4426",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -8, y0: 0, z0: -7, x1: 8, y1: 1, z1: 7, color: "qingStone" },
        { op: "hollowBox", x0: -6, y0: 1, z0: -5, x1: 6, y1: 9, z1: 5, wall: 1, color: "qingBrick", trim: "cinnabar" },
        { op: "arch", cx: 0, y0: 1, cz: 4, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "gold" },
        { op: "box", x0: 3, y0: 3, z0: 4, x1: 5, y1: 7, z1: 5, color: "lanternGlow", emit: 0.95, mirrorX: true },
        // Colorful brocade banners flanking doorway
        { op: "box", x0: -6, y0: 2, z0: 5, x1: -4, y1: 7, z1: 6, color: "silkPink", emit: 0.25 },
        { op: "box", x0: 4, y0: 2, z0: 5, x1: 6, y1: 7, z1: 6, color: "silkTeal", emit: 0.25 },
        { op: "roofGable", x0: -8, yBase: 9, z0: -7, x1: 8, z1: 7, rise: 5, axis: "x", color: "daiTile", trim: "cinnabar" },
        // Stepped gable finials
        { op: "box", x0: -7, y0: 8, z0: -6, x1: -6, y1: 12, z1: 6, color: "plaster" },
        { op: "box", x0: 6, y0: 8, z0: -6, x1: 7, y1: 12, z1: 6, color: "plaster" },
      ],
      parts: [],
    },
    "锦绣蜀绣坊",
  );
}

// 13c. 青囊百草堂 (Traditional Herbal Apothecary Hall)
export function buildBaguaApothecaryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "青囊百草堂",
      description:
        "东方震木内坊的川药百草堂，青翠药圃环绕飞檐石砌医馆，阁顶悬一尊生机盎然的翡翠药葫芦。",
      category: "building",
      scaleClass: "medium",
      palette: {
        qingStone: "#8c9399",
        qingBrick: "#4b555c",
        plaster: "#f3ece0",
        daiTile: "#28303b",
        timber: "#6e4226",
        jadeHerb: "#49b879",
        herbLeaf: "#75d966",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -8, y0: 0, z0: -7, x1: 8, y1: 1, z1: 7, color: "qingStone" },
        { op: "hollowBox", x0: -6, y0: 1, z0: -5, x1: 6, y1: 9, z1: 5, wall: 1, color: "plaster", trim: "timber" },
        { op: "arch", cx: 0, y0: 1, cz: 4, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "timber" },
        { op: "box", x0: 3, y0: 3, z0: 4, x1: 5, y1: 6, z1: 5, color: "lanternGlow", emit: 0.95, mirrorX: true },
        // Herb planters flanking entrance
        { op: "box", x0: 4, y0: 1, z0: 5, x1: 7, y1: 2, z1: 7, color: "qingBrick", mirrorX: true },
        { op: "sphere", cx: 5.5, cy: 3.0, cz: 6, rx: 1.3, ry: 1.1, rz: 1.3, color: "herbLeaf", mirrorX: true },
        { op: "roofPyramid", x0: -8, yBase: 9, z0: -7, x1: 8, z1: 7, color: "daiTile", trim: "jadeHerb" },
        { op: "cylinder", axis: "y", cx: 0, y0: 13, y1: 15, cz: 0, radius: 0.6, color: "gold" },
      ],
      parts: [
        {
          name: "apothecary-jade-gourd",
          kind: "bob",
          speed: 1.5,
          amp: 0.38,
          pivot: [0, 17.5, 0],
          ops: [
            { op: "sphere", cx: 0, cy: 0, cz: 0, rx: 1.3, ry: 1.5, rz: 1.3, color: "jadeHerb", emit: 0.65 },
            { op: "sphere", cx: 0, cy: 1.8, cz: 0, rx: 0.9, ry: 1.0, rz: 0.9, color: "gold", emit: 0.5 },
          ],
        },
      ],
    },
    "青囊百草堂",
  );
}

// 13d. 天机星象算馆 (Mystical Bagua Star-Chart & Divination Hall)
export function buildBaguaAstrologyBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "天机星象算馆",
      description:
        "坎北内坊星象演易之所，深蓝琉璃攒尖顶悬着一颗微光八卦星盘，推演周天流转。",
      category: "building",
      scaleClass: "medium",
      palette: {
        qingStone: "#8b929a",
        slateDark: "#2d3647",
        azureRoof: "#275d85",
        cinnabar: "#b5332a",
        gold: "#ebb93c",
        starCyan: "#64dcff",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, radius: 8.2, color: "qingStone" },
        { op: "hollowBox", x0: -5, y0: 1, z0: -5, x1: 5, y1: 10, z1: 5, wall: 1, color: "slateDark", trim: "gold" },
        { op: "arch", cx: 0, y0: 1, cz: 4, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 3, y0: 4, z0: 4, x1: 4, y1: 7, z1: 5, color: "starCyan", emit: 1.0, mirrorX: true },
        { op: "cone", cx: 0, y0: 10, y1: 16, cz: 0, rBottom: 8.2, rTop: 1.4, color: "azureRoof" },
        { op: "ring", axis: "y", cx: 0, y0: 10, y1: 11, cz: 0, outerR: 8.4, innerR: 6.4, color: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 16, y1: 18, cz: 0, radius: 0.6, color: "gold" },
      ],
      parts: [
        {
          name: "astrology-star-ring",
          kind: "spinY",
          speed: 0.9,
          pivot: [0, 20.5, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 2.6, innerR: 1.8, color: "gold", emit: 0.6 },
            { op: "sphere", cx: 0, cy: 0.5, cz: 0, rx: 1.0, ry: 1.0, rz: 1.0, color: "starCyan", emit: 1.25 },
          ],
        },
      ],
    },
    "天机星象算馆",
  );
}

// 13e. 阆中墨香书斋 (Langzhong Calligraphy & Classics Bookstore)
export function buildBaguaBookstoreBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "阆中墨香书斋",
      description:
        "乾西北内坊的青砖雅致书斋，门悬书卷楹联与暖光纸窗，供往来文士品读阆中古韵与易经典籍。",
      category: "building",
      scaleClass: "medium",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#4e5662",
        plaster: "#f3ece0",
        daiTile: "#28303b",
        timber: "#6b4024",
        inkTeal: "#2b7375",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -8, y0: 0, z0: -7, x1: 8, y1: 1, z1: 7, color: "qingStone" },
        { op: "hollowBox", x0: -6, y0: 1, z0: -5, x1: 6, y1: 9, z1: 5, wall: 1, color: "qingBrick", trim: "timber" },
        { op: "box", x0: -5, y0: 2, z0: -5, x1: 5, y1: 8, z1: 5, color: "plaster" },
        { op: "arch", cx: 0, y0: 1, cz: 4, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "timber" },
        { op: "box", x0: -3, y0: 6, z0: 5, x1: 3, y1: 8, z1: 6, color: "inkTeal" },
        { op: "box", x0: 3, y0: 3, z0: 4, x1: 5, y1: 6, z1: 5, color: "lanternGlow", emit: 0.95, mirrorX: true },
        { op: "roofGable", x0: -8, yBase: 9, z0: -7, x1: 8, z1: 7, rise: 5, axis: "x", color: "daiTile", trim: "gold" },
      ],
      parts: [],
    },
    "阆中墨香书斋",
  );
}

// 13f. 流觞丝竹琴台 (Interactive Pentatonic Guqin Floor-Piano Pavilion)
export function buildBaguaGuqinDeckBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "流觞丝竹琴台",
      description:
        "巽位内坊的露天八卦雅乐石台，踏上或点按八枚温润玉键即可奏出古韵五声丝竹清音。",
      category: "prop",
      scaleClass: "medium",
      interaction: { kind: "floor_piano" },
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#c9cdd2",
        jadeAccent: "#38a68e",
        gold: "#ebb93c",
        cinnabar: "#b5332a",
      },
      ops: [
        // Low unobstructed terrace so floor_piano keys mount cleanly on top!
        { op: "box", x0: -9, y0: 0, z0: -6, x1: 9, y1: 1, z1: 6, color: "qingStone" },
        { op: "box", x0: -8, y0: 1, z0: -5, x1: 8, y1: 2, z1: 5, color: "stoneLight" },
        { op: "box", x0: -9, y0: 0, z0: -6, x1: -8, y1: 4, z1: -5, color: "cinnabar", mirrorX: true },
        { op: "box", x0: -9, y0: 4, z0: -6, x1: -8, y1: 5, z1: -5, color: "gold", mirrorX: true },
        { op: "box", x0: -9, y0: 0, z0: 5, x1: -8, y1: 4, z1: 6, color: "cinnabar", mirrorX: true },
        { op: "box", x0: -9, y0: 4, z0: 5, x1: -8, y1: 5, z1: 6, color: "jadeAccent", emit: 0.7, mirrorX: true },
      ],
      parts: [],
    },
    "流觞丝竹琴台",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// 13g. 八卦九宫弈台 (Interactive Stone-and-Jade Tic-Tac-Toe Court)
export function buildBaguaChessCourtBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "八卦九宫弈台",
      description:
        "艮位内坊的青石对弈棋坪，可点击九宫棋格或按 E 与八卦棋灵对弈切磋。",
      category: "prop",
      scaleClass: "medium",
      interaction: { kind: "tic_tac_toe" },
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#cfd3d8",
        timber: "#6e4226",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
      },
      ops: [
        // Solid stone table center y=0..3 so tic_tac_toe mounts flush on top!
        { op: "box", x0: -7, y0: 0, z0: -7, x1: 7, y1: 1, z1: 7, color: "qingStone" },
        { op: "box", x0: -5, y0: 1, z0: -5, x1: 5, y1: 3, z1: 5, color: "stoneLight" },
        { op: "box", x0: -7, y0: 0, z0: -7, x1: -6, y1: 4, z1: -6, color: "timber", mirrorX: true },
        { op: "box", x0: -7, y0: 4, z0: -7, x1: -6, y1: 5, z1: -6, color: "lanternGlow", emit: 0.9, mirrorX: true },
        { op: "box", x0: -7, y0: 0, z0: 6, x1: -6, y1: 4, z1: 7, color: "timber", mirrorX: true },
        { op: "box", x0: -7, y0: 4, z0: 6, x1: -6, y1: 5, z1: 7, color: "gold", emit: 0.5, mirrorX: true },
      ],
      parts: [],
    },
    "八卦九宫弈台",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// 13h. 蜀山铸剑铁匠铺 (Outer Ring 3-4 Forge & Bronze Chime Smithy)
export function buildBaguaForgeBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "蜀山铸剑铁匠铺",
      description:
        "震东外坊的玄石铸铁工坊，红炉烟囱炉火映天，门旁水轮砂轮昼夜砥砺铜钟剑器。",
      category: "building",
      scaleClass: "large",
      palette: {
        basalt: "#464b54",
        qingStone: "#8d9399",
        brickDark: "#6a342a",
        daiTile: "#28303b",
        timber: "#6b3e22",
        ember: "#ff6a2b",
        amber: "#ffbe4f",
        steel: "#aeb8c2",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "basalt" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 2, width: 6, dir: "+z", color: "qingStone" },
        { op: "hollowBox", x0: -8, y0: 2, z0: -6, x1: 7, y1: 10, z1: 6, wall: 1, color: "qingStone", trim: "timber" },
        { op: "arch", cx: -1, y0: 2, cz: 5, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "brickDark" },
        // Glowing furnace chimney on the east wing
        { op: "box", x0: 4, y0: 2, z0: -5, x1: 8, y1: 17, z1: -1, color: "brickDark" },
        { op: "box", x0: 5, y0: 17, z0: -4, x1: 7, y1: 18, z1: -2, color: "ember", emit: 1.4 },
        { op: "box", x0: 4, y0: 3, z0: 3, x1: 6, y1: 6, z1: 6, color: "amber", emit: 1.1 },
        { op: "roofGable", x0: -9, yBase: 10, z0: -7, x1: 8, z1: 7, rise: 5, axis: "x", color: "daiTile", trim: "basalt" },
      ],
      parts: [
        {
          // Spinning steel grindstone out in front-right yard (cleared cleanly of wall!)
          name: "forge-grindstone",
          kind: "spinX",
          speed: 1.35,
          pivot: [9.5, 4.5, 4.5],
          ops: [
            { op: "ring", axis: "x", x0: -1, x1: 1, cy: 0, cz: 0, outerR: 2.3, innerR: 1.0, color: "steel" },
            { op: "box", x0: 0, y0: -2, z0: 0, x1: 1, y1: 2, z1: 1, color: "amber", emit: 0.5 },
          ],
        },
      ],
    },
    "蜀山铸剑铁匠铺",
  );
}

// 13i. 川味醉仙酒肆 (Outer Ring 3-4 Two-Story Red-Lantern Sichuan Tavern)
export function buildBaguaTavernBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "川味醉仙酒肆",
      description:
        "巽东南外坊的两层朱漆画栋酒肆，满楼灯笼暖光映照三环夜色，川香酒旗随海风轻摆。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#4e5660",
        plaster: "#f3eadb",
        cinnabar: "#c23228",
        timber: "#6e4024",
        daiTile: "#28303b",
        gold: "#ebb93c",
        lanternRed: "#f24a38",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 2, width: 6, dir: "+z", color: "qingStone" },
        { op: "hollowBox", x0: -8, y0: 2, z0: -6, x1: 8, y1: 10, z1: 6, wall: 1, color: "qingBrick", trim: "cinnabar" },
        { op: "arch", cx: 0, y0: 2, cz: 5, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 4, y0: 4, z0: 5, x1: 6, y1: 7, z1: 6, color: "lanternGlow", emit: 1.05, mirrorX: true },
        { op: "ring", axis: "y", cx: 0, y0: 9, y1: 10, cz: 0, outerR: 9.8, innerR: 7.4, color: "daiTile" },
        // Second floor dining gallery
        { op: "hollowBox", x0: -6, y0: 10, z0: -5, x1: 6, y1: 16, z1: 5, wall: 1, color: "plaster", trim: "cinnabar" },
        { op: "box", x0: -4, y0: 11, z0: 4, x1: 4, y1: 14, z1: 5, color: "lanternGlow", emit: 1.0 },
        { op: "roofGable", x0: -8, yBase: 16, z0: -7, x1: 8, z1: 7, rise: 5, axis: "x", color: "daiTile", trim: "gold" },
      ],
      parts: [
        {
          name: "tavern-wine-banner",
          kind: "swingZ",
          speed: 1.6,
          amp: 0.16,
          pivot: [9.2, 13.5, 5.5],
          ops: [
            { op: "box", x0: 0, y0: -4, z0: 0, x1: 1, y1: 0, z1: 1, color: "gold" },
            { op: "box", x0: -1, y0: -5, z0: 0, x1: 2, y1: -1, z1: 1, color: "lanternRed", emit: 0.7 },
          ],
        },
      ],
    },
    "川味醉仙酒肆",
  );
}

// 13j. 八卦悦来客栈 (Outer Ring 3-4 Sichuan Timber Guest Inn)
export function buildBaguaInnBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "八卦悦来客栈",
      description:
        "坤西南外坊的木构穿斗客栈，马头墙环抱暖光客房，为远游三岛的旅人提供歇脚落宿之所。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        plaster: "#f3ece0",
        timber: "#7a4c2a",
        cinnabar: "#b5332a",
        daiTile: "#28303b",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
        leaf: "#4e964b",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 2, width: 6, dir: "+z", color: "qingStone" },
        { op: "hollowBox", x0: -8, y0: 2, z0: -6, x1: 8, y1: 11, z1: 6, wall: 1, color: "plaster", trim: "timber" },
        { op: "arch", cx: 0, y0: 2, cz: 5, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 4, y0: 4, z0: 5, x1: 6, y1: 8, z1: 6, color: "lanternGlow", emit: 0.95, mirrorX: true },
        { op: "box", x0: -3, y0: 8, z0: 6, x1: 3, y1: 10, z1: 7, color: "gold" },
        // Stepped gables
        { op: "box", x0: 8, y0: 9, z0: -7, x1: 9, y1: 14, z1: 7, color: "plaster", mirrorX: true },
        { op: "roofGable", x0: -9, yBase: 11, z0: -7, x1: 9, z1: 7, rise: 5, axis: "x", color: "daiTile", trim: "timber" },
        { op: "sphere", cx: -8, cy: 3.5, cz: 7, rx: 1.5, ry: 1.5, rz: 1.5, color: "leaf", mirrorX: true },
      ],
      parts: [],
    },
    "八卦悦来客栈",
  );
}

// 13k. 太古灵石奇珍阁 (Outer Ring 3-4 Octagonal Jade & Mineral Curio Gallery)
export function buildBaguaCurioGalleryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "太古灵石奇珍阁",
      description:
        "艮东北外坊的玉石珍宝展馆，重檐青瓷顶下陈列昆仑寒玉与八卦晶矿，阁顶悬一尊缓旋灵晶。",
      category: "building",
      scaleClass: "large",
      palette: {
        stoneLight: "#cbd0d6",
        qingBrick: "#4b5561",
        jadeRoof: "#2a7b72",
        gold: "#ebb93c",
        crystalCyan: "#66f0e8",
        lanternGlow: "#ffe296",
        cinnabar: "#b5332a",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 2, cz: 0, radius: 9.8, color: "stoneLight" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 2, width: 6, dir: "+z", color: "stoneLight" },
        { op: "hollowBox", x0: -7, y0: 2, z0: -7, x1: 7, y1: 11, z1: 7, wall: 1, color: "qingBrick", trim: "gold" },
        { op: "arch", cx: 0, y0: 2, cz: 6, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "box", x0: 4, y0: 5, z0: 6, x1: 6, y1: 8, z1: 7, color: "crystalCyan", emit: 1.0, mirrorX: true },
        { op: "roofPyramid", x0: -9, yBase: 11, z0: -9, x1: 9, z1: 9, color: "jadeRoof", trim: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 15, y1: 18, cz: 0, radius: 0.7, color: "gold" },
      ],
      parts: [
        {
          name: "curio-jade-crystal",
          kind: "spinY",
          speed: 0.8,
          pivot: [0, 21.0, 0],
          ops: [
            { op: "cone", cx: 0, y0: 0, y1: 2.5, cz: 0, rBottom: 1.5, rTop: 0.3, color: "crystalCyan", emit: 1.2 },
            { op: "cone", cx: 0, y0: -2.5, y1: 0, cz: 0, rBottom: 0.3, rTop: 1.5, color: "gold", emit: 0.7 },
          ],
        },
      ],
    },
    "太古灵石奇珍阁",
  );
}

// 13l. 离火八卦点星台 (Outer Ring 3-4 Interactive Lights-Out Star Constellation Puzzle)
export function buildBaguaLightsOutAltarBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "离火八卦点星台",
      description:
        "离南外坊的九宫星图石坛，点按符石连携翻转明暗，点亮全部九枚星符即可唤醒黄金天枢。",
      category: "prop",
      scaleClass: "medium",
      interaction: { kind: "lights_out" },
      palette: {
        basalt: "#3c434f",
        qingStone: "#8d9399",
        cinnabar: "#c2342b",
        gold: "#ebb93c",
        ember: "#ff723b",
      },
      ops: [
        { op: "box", x0: -7, y0: 0, z0: -7, x1: 7, y1: 1, z1: 7, color: "basalt" },
        { op: "box", x0: -5, y0: 1, z0: -5, x1: 5, y1: 3, z1: 5, color: "qingStone" },
        { op: "box", x0: -7, y0: 0, z0: -7, x1: -6, y1: 4, z1: -6, color: "cinnabar", mirrorX: true },
        { op: "box", x0: -7, y0: 4, z0: -7, x1: -6, y1: 5, z1: -6, color: "ember", emit: 1.1, mirrorX: true },
        { op: "box", x0: -7, y0: 0, z0: 6, x1: -6, y1: 4, z1: 7, color: "cinnabar", mirrorX: true },
        { op: "box", x0: -7, y0: 4, z0: 6, x1: -6, y1: 5, z1: 7, color: "gold", emit: 0.6, mirrorX: true },
      ],
      parts: [],
    },
    "离火八卦点星台",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// 13m. 天风望海灯楼 (Outer Ring 3-4 West Coastal Beacon Tower)
export function buildBaguaLighthouseBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "天风望海灯楼",
      description:
        "兑西外坊遥望主岛海峡的八角望海灯楼，朱漆重檐悬着旋照苍穹的航标明灯与青铜风标。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8c939b",
        plaster: "#f3ece0",
        cinnabar: "#c2342b",
        azureTile: "#285f7f",
        timber: "#6e4024",
        gold: "#ebb93c",
        beaconCyan: "#64f0ff",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 2, cz: 0, radius: 9.2, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 2, width: 6, dir: "+z", color: "qingStone" },
        { op: "hollowBox", x0: -6, y0: 2, z0: -6, x1: 6, y1: 10, z1: 6, wall: 1, color: "plaster", trim: "cinnabar" },
        { op: "arch", cx: 0, y0: 2, cz: 5, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "cinnabar" },
        { op: "ring", axis: "y", cx: 0, y0: 9, y1: 10, cz: 0, outerR: 8.6, innerR: 6.2, color: "azureTile" },
        { op: "hollowBox", x0: -5, y0: 10, z0: -5, x1: 5, y1: 17, z1: 5, wall: 1, color: "cinnabar", trim: "gold" },
        { op: "box", x0: -3, y0: 12, z0: 4, x1: 3, y1: 15, z1: 5, color: "lanternGlow", emit: 0.95 },
        { op: "ring", axis: "y", cx: 0, y0: 16, y1: 17, cz: 0, outerR: 7.4, innerR: 5.0, color: "azureTile" },
        // Lantern watch gallery
        { op: "hollowBox", x0: -3, y0: 17, z0: -3, x1: 3, y1: 22, z1: 3, wall: 1, color: "timber", trim: "gold" },
        { op: "box", x0: -2, y0: 18, z0: -2, x1: 2, y1: 21, z1: 2, color: "beaconCyan", emit: 1.35 },
        { op: "roofPyramid", x0: -5, yBase: 22, z0: -5, x1: 5, z1: 5, color: "azureTile", trim: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 25, y1: 27, cz: 0, radius: 0.5, color: "gold" },
      ],
      parts: [
        {
          name: "lighthouse-beacon-vane",
          kind: "spinY",
          speed: 0.95,
          pivot: [0, 28.5, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 2.8, innerR: 2.0, color: "gold", emit: 0.7 },
            { op: "box", x0: -4, y0: 0, z0: 0, x1: 4, y1: 1, z1: 1, color: "beaconCyan", emit: 1.2 },
          ],
        },
      ],
    },
    "天风望海灯楼",
  );
}

// 13n. 八卦凌霄文塔 (Outer Ring 3-4 Northwest 5-Tier Sichuan Pagoda)
export function buildBaguaPagodaBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "八卦凌霄文塔",
      description:
        "乾西北外坊五重飞檐八角文峰古塔，青砖黛瓦逐层收分耸立云端，为八卦城西北天际制高点。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#4e5662",
        plaster: "#f2ebe0",
        daiTile: "#28303b",
        cinnabar: "#b5332a",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
        jadeAccent: "#4de3c8",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 2, cz: 0, radius: 9.6, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 2, width: 6, dir: "+z", color: "qingStone" },
        // Tier 1
        { op: "hollowBox", x0: -6, y0: 2, z0: -6, x1: 6, y1: 9, z1: 6, wall: 1, color: "qingBrick", trim: "cinnabar" },
        { op: "arch", cx: 0, y0: 2, cz: 5, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "cinnabar" },
        { op: "ring", axis: "y", cx: 0, y0: 8, y1: 9, cz: 0, outerR: 8.8, innerR: 6.0, color: "daiTile" },
        // Tier 2
        { op: "hollowBox", x0: -5, y0: 9, z0: -5, x1: 5, y1: 15, z1: 5, wall: 1, color: "plaster", trim: "cinnabar" },
        { op: "box", x0: -2, y0: 11, z0: 4, x1: 2, y1: 13, z1: 5, color: "lanternGlow", emit: 0.9 },
        { op: "ring", axis: "y", cx: 0, y0: 14, y1: 15, cz: 0, outerR: 7.4, innerR: 4.8, color: "daiTile" },
        // Tier 3
        { op: "hollowBox", x0: -4, y0: 15, z0: -4, x1: 4, y1: 20, z1: 4, wall: 1, color: "plaster", trim: "gold" },
        { op: "ring", axis: "y", cx: 0, y0: 19, y1: 20, cz: 0, outerR: 6.2, innerR: 3.8, color: "daiTile" },
        // Tier 4
        { op: "box", x0: -3, y0: 20, z0: -3, x1: 3, y1: 24, z1: 3, color: "cinnabar" },
        { op: "ring", axis: "y", cx: 0, y0: 23, y1: 24, cz: 0, outerR: 5.0, innerR: 2.8, color: "daiTile" },
        // Tier 5 & Roof Spire
        { op: "box", x0: -2, y0: 24, z0: -2, x1: 2, y1: 27, z1: 2, color: "lanternGlow", emit: 0.9 },
        { op: "roofPyramid", x0: -4, yBase: 27, z0: -4, x1: 4, z1: 4, color: "daiTile", trim: "gold" },
        { op: "cylinder", axis: "y", cx: 0, y0: 30, y1: 33, cz: 0, radius: 0.5, color: "gold" },
      ],
      parts: [
        {
          name: "pagoda-sky-halo",
          kind: "spinY",
          speed: 0.65,
          pivot: [0, 34.0, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 2.2, innerR: 1.5, color: "gold", emit: 0.8 },
            { op: "sphere", cx: 0, cy: 0.5, cz: 0, rx: 0.9, ry: 0.9, rz: 0.9, color: "jadeAccent", emit: 1.15 },
          ],
        },
      ],
    },
    "八卦凌霄文塔",
  );
}

// 13o. 保宁醋染水轩 (Outer Ring 3-4 North Langzhong Vinegar & Indigo Dye Workshop)
export function buildBaguaDyehouseBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "保宁醋染水轩",
      description:
        "坎北外坊传承阆中非遗的古法酿醋与青蓝扎染水工坊，檐下陈列陶土醋坛并高悬随风轻扬的靛蓝染布。",
      category: "building",
      scaleClass: "large",
      palette: {
        qingStone: "#8d9399",
        qingBrick: "#4b545f",
        plaster: "#ede6d8",
        timber: "#6e4024",
        daiTile: "#28303b",
        indigoCloth: "#2b5ba8",
        tealCloth: "#38a39c",
        vinegarJar: "#5a3926",
        gold: "#ebb93c",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 1, z1: 8, color: "qingStone" },
        { op: "stairs", x0: -3, y0: 0, z0: 8, steps: 1, width: 6, dir: "+z", color: "qingStone" },
        { op: "hollowBox", x0: -8, y0: 1, z0: -6, x1: 8, y1: 10, z1: 3, wall: 1, color: "qingBrick", trim: "timber" },
        { op: "arch", cx: 0, y0: 1, cz: 2, halfSpan: 2, height: 6, depth: 2, axis: "z", color: "timber" },
        { op: "box", x0: 4, y0: 4, z0: 2, x1: 6, y1: 7, z1: 3, color: "lanternGlow", emit: 0.9, mirrorX: true },
        { op: "roofGable", x0: -9, yBase: 10, z0: -7, x1: 9, z1: 4, rise: 5, axis: "x", color: "daiTile", trim: "gold" },
        // Courtyard stone dye-drying timber frame + stoneware vinegar vats
        { op: "box", x0: -8, y0: 1, z0: 5, x1: -7, y1: 9, z1: 6, color: "timber", mirrorX: true },
        { op: "box", x0: -8, y0: 8, z0: 5, x1: 8, y1: 9, z1: 6, color: "timber" },
        { op: "box", x0: -6, y0: 3, z0: 5, x1: -4, y1: 8, z1: 6, color: "indigoCloth" },
        { op: "box", x0: 4, y0: 3, z0: 5, x1: 6, y1: 8, z1: 6, color: "tealCloth" },
        { op: "cylinder", axis: "y", cx: -5, y0: 1, y1: 3, cz: 7, radius: 1.2, color: "vinegarJar" },
        { op: "cylinder", axis: "y", cx: 5, y0: 1, y1: 3, cz: 7, radius: 1.2, color: "vinegarJar" },
      ],
      parts: [
        {
          name: "dyehouse-hanging-cloth",
          kind: "swingX",
          speed: 1.4,
          amp: 0.14,
          pivot: [0, 8.2, 5.5],
          ops: [
            { op: "box", x0: -2, y0: -5, z0: 0, x1: 0, y1: 0, z1: 1, color: "indigoCloth" },
            { op: "box", x0: 1, y0: -4, z0: 0, x1: 3, y1: 0, z1: 1, color: "tealCloth" },
          ],
        },
      ],
    },
    "保宁醋染水轩",
  );
}

// 13p. 川味红油担担面摊 (Outer Market Alley Street Food Stall)
export function buildBaguaNoodleStallBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "川味红油担担面摊",
      description:
        "街坊巷口热气腾腾的川味红油担担面摊，紫铜汤锅正冒着白气，配一排条凳迎候往来食客。",
      category: "prop",
      scaleClass: "small",
      palette: {
        qingStone: "#8d9399",
        timber: "#754626",
        cinnabar: "#c2342b",
        daiTile: "#28303b",
        brass: "#e3b344",
        lanternGlow: "#ffe296",
        steamWhite: "#f7fafc",
      },
      ops: [
        { op: "box", x0: -5, y0: 0, z0: -4, x1: 5, y1: 1, z1: 4, color: "qingStone" },
        { op: "box", x0: 4, y0: 1, z0: -3, x1: 5, y1: 6, z1: -2, color: "timber", mirrorX: true },
        { op: "box", x0: 4, y0: 1, z0: 2, x1: 5, y1: 6, z1: 3, color: "timber", mirrorX: true },
        { op: "box", x0: -4, y0: 1, z0: -1, x1: 4, y1: 3, z1: 1, color: "cinnabar" },
        { op: "cylinder", axis: "y", cx: 2, y0: 3, y1: 4, cz: 0, radius: 1.1, color: "brass" },
        { op: "box", x0: -3, y0: 4, z0: 2, x1: -2, y1: 5, z1: 3, color: "lanternGlow", emit: 1.0, mirrorX: true },
        { op: "box", x0: -3, y0: 1, z0: 2, x1: 3, y1: 2, z1: 3, color: "timber" },
        { op: "roofGable", x0: -5, yBase: 6, z0: -4, x1: 5, z1: 4, rise: 2, axis: "x", color: "daiTile", trim: "cinnabar" },
      ],
      parts: [
        {
          name: "noodle-pot-steam",
          kind: "bob",
          speed: 2.2,
          amp: 0.35,
          pivot: [2, 5.2, 0],
          ops: [
            { op: "sphere", cx: 0, cy: 0, cz: 0, rx: 0.9, ry: 0.7, rz: 0.9, color: "steamWhite", emit: 0.25 },
            { op: "sphere", cx: 0.3, cy: 0.9, cz: -0.2, rx: 0.6, ry: 0.5, rz: 0.6, color: "steamWhite", emit: 0.2 },
          ],
        },
      ],
    },
    "川味红油担担面摊",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// 13q. 川剧脸谱糖画坊 (Outer Market Alley Sichuan Opera Mask & Sugar Art Stall)
export function buildBaguaOperaStallBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "川剧脸谱糖画坊",
      description:
        "彩绘川剧脸谱与金丝转盘糖画民俗摊棚，红金画幕两侧摆着铜锣与糖画大转盘，节日氛围十足。",
      category: "prop",
      scaleClass: "small",
      palette: {
        qingStone: "#8d9399",
        timber: "#6e4024",
        cinnabar: "#c9332b",
        gold: "#ebb93c",
        cyanMask: "#48cde6",
        whiteMask: "#f5f4ef",
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -5, y0: 0, z0: -4, x1: 5, y1: 1, z1: 4, color: "qingStone" },
        { op: "box", x0: 4, y0: 1, z0: -3, x1: 5, y1: 6, z1: -2, color: "cinnabar", mirrorX: true },
        { op: "box", x0: 4, y0: 1, z0: 2, x1: 5, y1: 6, z1: 3, color: "cinnabar", mirrorX: true },
        // Mask display board
        { op: "box", x0: -4, y0: 2, z0: -3, x1: 4, y1: 5, z1: -2, color: "timber" },
        { op: "put", x: -2, y: 4, z: -1, color: "cinnabar" },
        { op: "put", x: 0, y: 4, z: -1, color: "gold" },
        { op: "put", x: 2, y: 4, z: -1, color: "cyanMask" },
        { op: "put", x: -1, y: 3, z: -1, color: "whiteMask" },
        { op: "box", x0: -4, y0: 1, z0: 0, x1: 4, y1: 3, z1: 2, color: "timber" },
        { op: "box", x0: -3, y0: 4, z0: 2, x1: -2, y1: 5, z1: 3, color: "lanternGlow", emit: 1.0, mirrorX: true },
        { op: "roofGable", x0: -5, yBase: 6, z0: -4, x1: 5, z1: 4, rise: 2, axis: "x", color: "cinnabar", trim: "gold" },
      ],
      parts: [
        {
          name: "sugar-art-turntable",
          kind: "spinY",
          speed: 1.2,
          pivot: [0, 3.6, 1],
          ops: [
            { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 0.4, cz: 0, radius: 1.3, color: "gold", emit: 0.4 },
            { op: "put", x: 1, y: 1, z: 0, color: "cinnabar" },
          ],
        },
      ],
    },
    "川剧脸谱糖画坊",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// 13r. 东震观澜听涛台 / 兑泽望岛栈桥亭 (Coastal Cliff Timber Viewing Pier & Pavilion)
export function buildBaguaShorePierBlueprint(name: string, desc: string, accentHex: string): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name,
      description: desc,
      category: "prop",
      scaleClass: "medium",
      palette: {
        qingStone: "#8d9399",
        timber: "#7a4d2a",
        timberLight: "#a67042",
        daiTile: "#28303b",
        gold: "#ebb93c",
        accent: accentHex,
        lanternGlow: "#ffe296",
      },
      ops: [
        { op: "box", x0: -7, y0: 0, z0: -7, x1: 7, y1: 1, z1: 7, color: "qingStone" },
        { op: "box", x0: -6, y0: 1, z0: -6, x1: 6, y1: 2, z1: 6, color: "timberLight" },
        // Timber railings around outer edge (leaving -z open for path entry)
        { op: "box", x0: -6, y0: 2, z0: 5, x1: 6, y1: 4, z1: 6, color: "timber" },
        { op: "box", x0: 5, y0: 2, z0: -5, x1: 6, y1: 4, z1: 5, color: "timber", mirrorX: true },
        // Pavilion columns & roof over rear center
        { op: "box", x0: 4, y0: 2, z0: -4, x1: 5, y1: 8, z1: -3, color: "timber", mirrorX: true },
        { op: "box", x0: 4, y0: 2, z0: 2, x1: 5, y1: 8, z1: 3, color: "timber", mirrorX: true },
        { op: "box", x0: -3, y0: 2, z0: 1, x1: 3, y1: 3, z1: 2, color: "timberLight" },
        { op: "box", x0: 5, y0: 4, z0: 5, x1: 6, y1: 6, z1: 6, color: "lanternGlow", emit: 1.0, mirrorX: true },
        { op: "roofPyramid", x0: -6, yBase: 8, z0: -5, x1: 6, z1: 4, color: "daiTile", trim: "gold" },
        { op: "put", x: 0, y: 11, z: 0, color: "accent", emit: 0.9 },
      ],
      parts: [],
    },
    name,
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// 13s. 八卦城志铜钟日晷亭 (Central Taiji Plaza Sundial & Memorial Stele)
export function buildBaguaSundialSteleBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "八卦城志铜钟日晷亭",
      description:
        "矗立于太极广场东侧的石雕日晷与青铜铭文碑亭，镌刻八卦古城四环建制与周天节气刻度。",
      category: "prop",
      scaleClass: "small",
      palette: {
        qingStone: "#8d9399",
        stoneLight: "#cfd3d8",
        tealSlate: "#2d5d63",
        cinnabar: "#b5332a",
        gold: "#ebb93c",
        bronze: "#8f6c38",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, radius: 4.2, color: "qingStone" },
        { op: "cylinder", axis: "y", cx: 0, y0: 1, y1: 2, cz: 0, radius: 3.0, color: "stoneLight" },
        { op: "box", x0: -1, y0: 2, z0: -1, x1: 1, y1: 7, z1: 1, color: "tealSlate" },
        { op: "box", x0: -2, y0: 2, z0: 0, x1: 2, y1: 7, z1: 1, color: "cinnabar", mirrorX: true },
        { op: "box", x0: -3, y0: 7, z0: -2, x1: 3, y1: 8, z1: 2, color: "gold" },
      ],
      parts: [
        {
          name: "taiji-sundial-ring",
          kind: "spinY",
          speed: 0.35,
          pivot: [0, 9.2, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 1.9, innerR: 1.2, color: "gold", emit: 0.65 },
            { op: "box", x0: 0, y0: 0, z0: -1, x1: 1, y1: 2, z1: 1, color: "bronze" },
          ],
        },
      ],
    },
    "八卦城志铜钟日晷亭",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

export function ensureBaguaIsland(state: {
  creations: WorldCreation[];
  paths: WorldPath[];
  props: WorldProp[];
  terrainZones: WorldTerrainZone[];
  villagers: WorldVillager[];
}): { changed: boolean; details: string[] } {
  const details: string[] = [];
  let changed = false;

  const ensureCreation = (spec: {
    id: string;
    x: number;
    z: number;
    yaw: number;
    builder: () => VoxelBlueprint;
    activity: string;
    statusLine: string;
    createdAtOffset: number;
  }) => {
    const existing = state.creations.find((c) => c.id === spec.id);
    if (existing) {
      if (spec.id === BAGUA_CREATION_IDS.taijiPavilion) {
        const bp = spec.builder();
        const fxDiff = Math.abs((existing.blueprint?.stats?.footprintX || 0) - (bp.stats?.footprintX || 0));
        if (fxDiff >= 2) {
          existing.blueprint = bp;
          changed = true;
          details.push(`rescaled Bagua Taiji Altar blueprint -> ${bp.stats?.footprintX}x${bp.stats?.footprintZ}`);
        }
      }
      if (
        Math.abs(existing.x - spec.x) > 0.1 ||
        Math.abs(existing.z - spec.z) > 0.1 ||
        Math.abs(existing.yaw - spec.yaw) > 0.01
      ) {
        existing.x = spec.x;
        existing.z = spec.z;
        existing.yaw = spec.yaw;
        if (existing.behavior.type === "landmark") {
          existing.behavior.facingYaw = spec.yaw;
        }
        changed = true;
        details.push(`realigned Bagua landmark "${existing.name}" -> [${spec.x}, ${spec.z}]`);
      }
      return;
    }
    const bp = spec.builder();
    state.creations.push({
      id: spec.id,
      name: bp.name,
      description: bp.description,
      category: bp.category,
      scaleClass: bp.scaleClass,
      x: spec.x,
      z: spec.z,
      yaw: spec.yaw,
      blueprint: bp,
      behavior: {
        type: "landmark",
        facingYaw: spec.yaw,
        activity: spec.activity,
        statusLine: spec.statusLine,
      },
      integratedLevel: 2,
      createdAt: 1793000000000 + spec.createdAtOffset,
      isSeed: false,
    });
    changed = true;
    details.push(`added Bagua landmark "${bp.name}" at [${spec.x}, ${spec.z}]`);
  };

  // 1. Center Taiji Pavilion + 8 Later Heaven Bagua Landmarks inside the 4-Layer Octagonal Sectors
  // Inspired by Tekes Bagua City: 4 concentric octagonal rings (corner radii 40.04m, 85.8m, 140.14m, 194.48m — +30% expanded)
  // linked corner-to-corner by 8 radial main avenues radiating outward from the Ring 1 vertices
  // (never intruding inside the open circular Taiji Plaza inside Ring 1).
  // Each of the 8 Trigram palaces sits cleanly inside the spacious Layer 2->3 Bagua wedge (r = 104.4m)
  // facing inward toward Taiji Plaza [498.24, 0].
  const CX = BAGUA_ISLAND_CENTER[0];
  const SECTOR_RADIUS = 104.4;
  const WEDGE_OFFSET = Math.PI / 8;

  const sectorSpec = (angle: number) => {
    const [x, z] = radialPt(angle, SECTOR_RADIUS);
    const yaw = Number(Math.atan2(CX - x, -z).toFixed(4));
    return { x, z, yaw };
  };

  ensureCreation({
    id: BAGUA_CREATION_IDS.taijiPavilion,
    x: CX,
    z: 0,
    yaw: -Math.PI / 2, // West main approach faces Cross-Sea Bridge
    builder: buildBaguaTaijiPavilionBlueprint,
    activity: "中天太极观景揽胜",
    statusLine: "四层八角八卦城正中太极石坛与八角三重檐观景楼",
    createdAtOffset: 100,
  });

  // 坎 N sector (-PI/2 + PI/8 = -3*PI/8)
  const kanPos = sectorSpec(-Math.PI / 2 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.kanWaterwheel,
    ...kanPos,
    builder: buildBaguaKanWaterwheelBlueprint,
    activity: "坎水筒车昼夜汲水",
    statusLine: "坎宫青砖水阁旁悠悠转动的川西木制筒车",
    createdAtOffset: 200,
  });

  // 艮 NE sector (-PI/4 + PI/8 = -PI/8)
  const genPos = sectorSpec(-Math.PI / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.genMaze,
    ...genPos,
    builder: buildBaguaGenMazeBlueprint,
    activity: "艮山石庭八卦寻幽",
    statusLine: "艮宫山石道观与川西迷踪照壁院落",
    createdAtOffset: 300,
  });

  // 震 E sector (0 + PI/8 = +PI/8)
  const zhenPos = sectorSpec(0 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.zhenDrumtower,
    ...zhenPos,
    builder: buildBaguaZhenDrumtowerBlueprint,
    activity: "震雷古楼鸣鼓迎春",
    statusLine: "震宫重檐青砖鼓楼，苍竹掩映大鼓微摆",
    createdAtOffset: 400,
  });

  // 巽 SE sector (PI/4 + PI/8 = 3*PI/8)
  const xunPos = sectorSpec(Math.PI / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.xunWindmill,
    ...xunPos,
    builder: buildBaguaXunWindmillBlueprint,
    activity: "巽风纸鸢铜铃迎风",
    statusLine: "巽宫木构风铃阁楼，檐铃轻摆纸鸢旋舞",
    createdAtOffset: 500,
  });

  // 离 S sector (PI/2 + PI/8 = 5*PI/8)
  const liPos = sectorSpec(Math.PI / 2 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.liStage,
    ...liPos,
    builder: buildBaguaLiStageBlueprint,
    activity: "离火川剧古台灯明",
    statusLine: "离宫朱柱万年古戏台，灯笼璀璨流光溢彩",
    createdAtOffset: 600,
  });

  // 坤 SW sector (3*PI/4 + PI/8 = 7*PI/8)
  const kunPos = sectorSpec((3 * Math.PI) / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.kunCourtyard,
    ...kunPos,
    builder: buildBaguaKunCourtyardBlueprint,
    activity: "坤地川西四合院居",
    statusLine: "坤宫青砖马头墙围合传统蜀风四合院",
    createdAtOffset: 700,
  });

  // 兑 W sector (-PI + PI/8 = -7*PI/8, flanking West Bagua Arrival Avenue)
  const duiPos = sectorSpec(-Math.PI + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.duiPavilion,
    ...duiPos,
    builder: buildBaguaDuiPavilionBlueprint,
    activity: "兑泽临池茗茶迎客",
    statusLine: "兑宫荷风迎宾阁，临兑门大道与荷池迎接旅人",
    createdAtOffset: 800,
  });

  // 乾 NW sector (-3*PI/4 + PI/8 = -5*PI/8)
  const qianPos = sectorSpec((-3 * Math.PI) / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.qianObservatory,
    ...qianPos,
    builder: buildBaguaQianObservatoryBlueprint,
    activity: "乾天浑仪观星文昌",
    statusLine: "乾宫仿阆中贡院风文昌阁与黄铜浑天仪",
    createdAtOffset: 900,
  });

  // Eight Outer Ceremonial Gate Archways (八门石牌坊) guarding Ring 4 outer corners (r = 205.5m)
  BAGUA_GATE_DEFS.forEach((gdef, idx) => {
    const [gx, gz] = radialPt(gdef.angle, 205.5);
    const gateYaw = Number(Math.atan2(CX - gx, -gz).toFixed(4));
    ensureCreation({
      id: `bagua-gate-${gdef.dir}`,
      x: gx,
      z: gz,
      yaw: gateYaw,
      builder: () => buildBaguaGateBlueprint(gdef.gateName, gdef.trigramLabel, gdef.accentHex),
      activity: `镇守八卦${gdef.gateName}门户`,
      statusLine: `川西八卦城四环外垣${gdef.trigramLabel}门户牌坊（${gdef.gateName}）`,
      createdAtOffset: 910 + idx * 10,
    });
  });

  // Ring 1-2 Inner Ward Commercial, Cultural & Interactive Courtyards (r = 58.8m, facing outward toward Ring 2)
  const innerWardSpec = (angle: number) => {
    const [x, z] = radialPt(angle, 58.8);
    const yaw = Number(Math.atan2(x - CX, z).toFixed(4));
    return { x, z, yaw };
  };
  const innerKunPos = innerWardSpec((3 * Math.PI) / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerTeahouse,
    ...innerKunPos,
    builder: buildBaguaTeahouseBlueprint,
    activity: "二环坊市煮茶待客",
    statusLine: "川西盖碗茶香飘溢二环，竹廊红灯迎接八方来客",
    createdAtOffset: 1010,
  });

  const innerLiPos = innerWardSpec(Math.PI / 2 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerSilkshop,
    ...innerLiPos,
    builder: buildBaguaSilkShopBlueprint,
    activity: "蜀锦刺绣坊市呈祥",
    statusLine: "五彩蜀锦与灯彩垂挂檐前，织就川西八卦城流光",
    createdAtOffset: 1020,
  });

  const innerXunPos = innerWardSpec(Math.PI / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerGuqin,
    ...innerXunPos,
    builder: buildBaguaGuqinDeckBlueprint,
    activity: "流觞丝竹古琴奏鸣",
    statusLine: "踏上八枚玉键或按 E 弹奏古韵五声清音",
    createdAtOffset: 1030,
  });

  const innerZhenPos = innerWardSpec(0 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerApothecary,
    ...innerZhenPos,
    builder: buildBaguaApothecaryBlueprint,
    activity: "青囊百草堂制药香",
    statusLine: "苍翠药圃围绕医馆，翡翠药葫芦悬于檐顶",
    createdAtOffset: 1040,
  });

  const innerGenPos = innerWardSpec(-Math.PI / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerChess,
    ...innerGenPos,
    builder: buildBaguaChessCourtBlueprint,
    activity: "九宫石台对弈切磋",
    statusLine: "艮山内坊青石弈台，可点按九宫棋格与棋灵对弈",
    createdAtOffset: 1050,
  });

  const innerKanPos = innerWardSpec(-Math.PI / 2 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerAstrology,
    ...innerKanPos,
    builder: buildBaguaAstrologyBlueprint,
    activity: "天机星盘推演周天",
    statusLine: "坎北内坊星象算馆，琉璃顶上星盘流转不息",
    createdAtOffset: 1060,
  });

  const innerQianPos = innerWardSpec((-3 * Math.PI) / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.innerBookstore,
    ...innerQianPos,
    builder: buildBaguaBookstoreBlueprint,
    activity: "阆中墨香品读典籍",
    statusLine: "青砖书斋书香盈院，展藏八卦古籍与蜀中诗画",
    createdAtOffset: 1070,
  });

  // Ring 3-4 Outer Craft, Culinary & Gallery Ward (r = 155.5m, facing inward toward Ring 3)
  const outerWardSpec = (angle: number) => {
    const [x, z] = radialPt(angle, 155.5);
    const yaw = Number(Math.atan2(CX - x, -z).toFixed(4));
    return { x, z, yaw };
  };
  const outerZhenPos = outerWardSpec(0 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerForge,
    ...outerZhenPos,
    builder: buildBaguaForgeBlueprint,
    activity: "红炉铸剑铜钟试鸣",
    statusLine: "震东外坊铁匠工坊，炉火明灭间砂轮飞转砥砺神兵",
    createdAtOffset: 1110,
  });

  const outerXunPos = outerWardSpec(Math.PI / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerTavern,
    ...outerXunPos,
    builder: buildBaguaTavernBlueprint,
    activity: "醉仙酒肆灯火迎宾",
    statusLine: "三环外坊朱漆二层川味酒肆，酒旗摇曳夜色温暖",
    createdAtOffset: 1120,
  });

  const outerLiPos = outerWardSpec(Math.PI / 2 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerLightsOut,
    ...outerLiPos,
    builder: buildBaguaLightsOutAltarBlueprint,
    activity: "离火九宫点星启阵",
    statusLine: "可点击九宫符石或按 E 切换星辉，全亮唤醒天枢金芒",
    createdAtOffset: 1130,
  });

  const outerKunPos = outerWardSpec((3 * Math.PI) / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerInn,
    ...outerKunPos,
    builder: buildBaguaInnBlueprint,
    activity: "悦来客栈旅人小憩",
    statusLine: "川西马头墙木构客栈，开门迎接远赴八卦城之客",
    createdAtOffset: 1140,
  });

  const outerGenPos = outerWardSpec(-Math.PI / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerCurio,
    ...outerGenPos,
    builder: buildBaguaCurioGalleryBlueprint,
    activity: "灵石奇珍阁观玉赏矿",
    statusLine: "艮北外坊青瓷穹顶展馆，陈列蓬莱寒玉与八卦晶矿",
    createdAtOffset: 1150,
  });

  const outerDuiPos = outerWardSpec(Math.PI + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerLighthouse,
    ...outerDuiPos,
    builder: buildBaguaLighthouseBlueprint,
    activity: "望海灯楼巡航守望",
    statusLine: "兑西外坊八角航标灯楼，明灯苍穹遥迎主岛归客",
    createdAtOffset: 1160,
  });

  const outerQianPos = outerWardSpec((-3 * Math.PI) / 4 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerPagoda,
    ...outerQianPos,
    builder: buildBaguaPagodaBlueprint,
    activity: "凌霄文塔登高望远",
    statusLine: "乾西北外坊五重飞檐古塔，俯瞰四环八门与海天一色",
    createdAtOffset: 1170,
  });

  const outerKanPos = outerWardSpec(-Math.PI / 2 + WEDGE_OFFSET);
  ensureCreation({
    id: BAGUA_CREATION_IDS.outerDyehouse,
    ...outerKanPos,
    builder: buildBaguaDyehouseBlueprint,
    activity: "古法酿醋青蓝扎染",
    statusLine: "坎北外坊保宁醋染水轩，青布随风轻摆、醋香醇厚",
    createdAtOffset: 1180,
  });

  // Ring 3-4 Market Flank Street Stalls (r = 146.5m, ±0.19 rad off sector centers)
  const marketNoodleAngle = Math.PI / 4 + WEDGE_OFFSET - 0.19;
  const [mnX, mnZ] = radialPt(marketNoodleAngle, 146.5);
  ensureCreation({
    id: BAGUA_CREATION_IDS.marketNoodles,
    x: mnX,
    z: mnZ,
    yaw: Number(Math.atan2(CX - mnX, -mnZ).toFixed(4)),
    builder: buildBaguaNoodleStallBlueprint,
    activity: "担担面摊煮面飘香",
    statusLine: "巽位醉仙酒肆街角食摊，热气腾腾一碗地道川味担担面",
    createdAtOffset: 1210,
  });

  const marketOperaAngle = Math.PI / 2 + WEDGE_OFFSET + 0.19;
  const [moX, moZ] = radialPt(marketOperaAngle, 146.5);
  ensureCreation({
    id: BAGUA_CREATION_IDS.marketOpera,
    x: moX,
    z: moZ,
    yaw: Number(Math.atan2(CX - moX, -moZ).toFixed(4)),
    builder: buildBaguaOperaStallBlueprint,
    activity: "川剧脸谱画糖迎客",
    statusLine: "离南外坊彩绘川剧脸谱与金丝转盘糖画民俗摊坊",
    createdAtOffset: 1220,
  });

  // Central Taiji East Axis Sundial & Memorial Stele
  ensureCreation({
    id: BAGUA_CREATION_IDS.courtyardStele,
    x: CX + 26.8,
    z: 0,
    yaw: Number((-Math.PI / 2).toFixed(4)),
    builder: buildBaguaSundialSteleBlueprint,
    activity: "观测日晷八卦古碑",
    statusLine: "太极广场东侧石雕日晷铜钟碑亭，镌刻八卦建城仪制",
    createdAtOffset: 1230,
  });

  // Ring 4 Outer Coastal Cliff Viewing Piers (r = 224m along East & West sector midlines)
  const [pierEX, pierEZ] = radialPt(0 + WEDGE_OFFSET, 224.0);
  ensureCreation({
    id: BAGUA_CREATION_IDS.shorePierE,
    x: pierEX,
    z: pierEZ,
    yaw: Number((0 + WEDGE_OFFSET - Math.PI / 2).toFixed(4)),
    builder: () =>
      buildBaguaShorePierBlueprint(
        "东震观澜听涛台",
        "东门外海崖悬挑木质观澜平台，迎旭日东升与大鹏掠海，观东海白沫涛声。",
        "#46e87a",
      ),
    activity: "临海观澜听涛赏景",
    statusLine: "八卦城东崖木栈观景台，适合远眺大海与等待大鹏掠空",
    createdAtOffset: 1240,
  });

  const [pierWX, pierWZ] = radialPt(Math.PI + WEDGE_OFFSET, 224.0);
  ensureCreation({
    id: BAGUA_CREATION_IDS.shorePierW,
    x: pierWX,
    z: pierWZ,
    yaw: Number((Math.PI + WEDGE_OFFSET - Math.PI / 2).toFixed(4)),
    builder: () =>
      buildBaguaShorePierBlueprint(
        "兑泽望岛栈桥亭",
        "西岸海崖飞檐观海木亭，隔碧蓝海峡遥望主岛灯火与群帆。",
        "#64dcff",
      ),
    activity: "隔海遥望主岛风物",
    statusLine: "八卦城西崖临海栈桥木亭，可将西侧海峡风光尽收眼底",
    createdAtOffset: 1250,
  });

  // Prune retired bridge approach paths, legacy stub paths, and any inner-ring radial0 stubs if loaded from a persisted snapshot
  const obsoleteIds = [
    "path-bridge-west-approach",
    "path-bridge-east-approach",
    "path-bagua-dui-spur",
    "path-bagua-taiji-west-plaza",
    ...BAGUA_RADIAL_DIRS.map((d) => `path-bagua-radial0-${d}`),
  ];
  for (const obsoleteId of obsoleteIds) {
    const idx = state.paths.findIndex((p) => p.id === obsoleteId);
    if (idx >= 0) {
      state.paths.splice(idx, 1);
      changed = true;
      details.push(`removed obsolete Bagua/bridge path "${obsoleteId}"`);
    }
  }

  // 2. Authentic 4-Layer Sharp Straight-Edge Octagonal Rings + 8 Corner-to-Corner Radial Avenues
  // All 4 concentric rings are strictly linear octagons whose 8 vertices sit on the 8 Bagua axes (k * π/4).
  // The 8 radial main avenues link Ring 1 corners -> Ring 2 corners -> Ring 3 corners -> Ring 4 corners
  // strictly outside Ring 1, leaving the innermost circular Taiji Altar Plaza unobstructed.
  const ensurePath = (p: WorldPath) => {
    const existing = state.paths.find((ex) => ex.id === p.id);
    if (existing) {
      const sameClosed = Boolean(existing.closed) === Boolean(p.closed);
      const sameLinear = Boolean(existing.linear) === Boolean(p.linear);
      const samePts =
        existing.kind === p.kind &&
        sameClosed &&
        sameLinear &&
        existing.points.length === p.points.length &&
        existing.points.every(
          (pt, idx) =>
            Math.abs(pt[0] - p.points[idx][0]) < 0.05 && Math.abs(pt[1] - p.points[idx][1]) < 0.05,
        );
      if (samePts) return;
      existing.kind = p.kind;
      existing.points = p.points;
      existing.closed = p.closed;
      existing.linear = p.linear;
      changed = true;
      details.push(`updated Bagua path "${p.id}" (${p.kind})`);
      return;
    }
    state.paths.push(p);
    changed = true;
    details.push(`added Bagua path "${p.id}" (${p.kind})`);
  };

  // 4 Concentric Straight-Edged Octagonal Rings around [498.24, 0] (corner radii 40.04m, 85.8m, 140.14m, 194.48m)
  ensurePath({
    id: "path-bagua-inner-ring",
    kind: "road",
    closed: true,
    linear: true,
    points: buildOctagonRingPoints(CX, 0, 40.04),
  });
  ensurePath({
    id: "path-bagua-ring-2",
    kind: "road",
    closed: true,
    linear: true,
    points: buildOctagonRingPoints(CX, 0, 85.8),
  });
  ensurePath({
    id: "path-bagua-ring-3",
    kind: "road",
    closed: true,
    linear: true,
    points: buildOctagonRingPoints(CX, 0, 140.14),
  });
  ensurePath({
    id: "path-bagua-outer-ring",
    kind: "road",
    closed: true,
    linear: true,
    points: buildOctagonRingPoints(CX, 0, 194.48),
  });

  // ALL 8 Bagua Radial Main Roads running dead-straight from Ring 1's 8 corners (40.04m)
  // outward corner-to-corner across Rings 2, 3, and 4 (40.04m -> 85.8m -> 140.14m -> 194.48m),
  // with NO segments penetrating inside the innermost Ring 1 Taiji Plaza.
  const radialDefs: Array<{ dir: string; angle: number }> = [
    { dir: "e", angle: 0 },
    { dir: "se", angle: Math.PI / 4 },
    { dir: "s", angle: Math.PI / 2 },
    { dir: "sw", angle: (3 * Math.PI) / 4 },
    { dir: "w", angle: Math.PI },
    { dir: "nw", angle: (-3 * Math.PI) / 4 },
    { dir: "n", angle: -Math.PI / 2 },
    { dir: "ne", angle: -Math.PI / 4 },
  ];
  const RING2_APOTHEM = 85.8 * Math.cos(WEDGE_OFFSET); // ~79.27m perpendicular edge distance along sector midline
  for (const rdef of radialDefs) {
    // Ring 1 corner (40.04m) <-> Ring 2 corner (85.8m)
    ensurePath({
      id: `path-bagua-radial-${rdef.dir}`,
      kind: "road",
      linear: true,
      points: [radialPt(rdef.angle, 43.6), radialPt(rdef.angle, 82.2)],
    });
    // Ring 2 corner (85.8m) <-> Ring 3 corner (140.14m)
    ensurePath({
      id: `path-bagua-radial2-${rdef.dir}`,
      kind: "road",
      linear: true,
      points: [radialPt(rdef.angle, 89.4), radialPt(rdef.angle, 136.6)],
    });
    // Ring 3 corner (140.14m) <-> Ring 4 corner (194.48m)
    ensurePath({
      id: `path-bagua-radial3-${rdef.dir}`,
      kind: "road",
      linear: true,
      points: [radialPt(rdef.angle, 143.7), radialPt(rdef.angle, 190.9)],
    });
    // Outer ceremonial gate stone approach leading out of Ring 4 directly under the open gate archway (r = 197.8 -> 213.5)
    ensurePath({
      id: `path-bagua-gate-${rdef.dir}`,
      kind: "cobblestone",
      linear: true,
      points: [radialPt(rdef.angle, 197.8), radialPt(rdef.angle, 213.5)],
    });
    // Orthogonal (90° right-angle) cobblestone walkway linking each Trigram palace courtyard
    // perpendicularly straight onto Ring 2's flat edge midpoint
    const sectorAngle = rdef.angle + WEDGE_OFFSET;
    ensurePath({
      id: `path-bagua-court-${rdef.dir}`,
      kind: "cobblestone",
      linear: true,
      points: [
        radialPt(sectorAngle, Number((RING2_APOTHEM + 3.7).toFixed(1))),
        radialPt(sectorAngle, 95.1),
      ],
    });
    // Orthogonal cobblestone spur linking Ring 1-2 inner ward buildings straight to Ring 2 inner curb
    if (rdef.dir !== "w") {
      ensurePath({
        id: `path-bagua-inner-spur-${rdef.dir}`,
        kind: "cobblestone",
        linear: true,
        points: [
          radialPt(sectorAngle, 64.5),
          radialPt(sectorAngle, Number((RING2_APOTHEM - 3.7).toFixed(1))),
        ],
      });
    }
    // Orthogonal cobblestone spur linking Ring 3-4 outer craft/tavern ward buildings straight to Ring 3 outer curb
    if (BAGUA_OUTER_SPUR_DIRS.includes(rdef.dir as (typeof BAGUA_OUTER_SPUR_DIRS)[number])) {
      const RING3_APOTHEM = 140.14 * Math.cos(WEDGE_OFFSET); // ~129.47m
      ensurePath({
        id: `path-bagua-outer-spur-${rdef.dir}`,
        kind: "cobblestone",
        linear: true,
        points: [
          radialPt(sectorAngle, Number((RING3_APOTHEM + 3.7).toFixed(1))),
          radialPt(sectorAngle, 148.5),
        ],
      });
    }
  }

  // Coastal cliff wooden pier approaches extending cleanly from Ring 4 outer curb (r = 183.4 -> 216.0)
  const RING4_APOTHEM = 194.48 * Math.cos(WEDGE_OFFSET); // ~179.67m
  ensurePath({
    id: "path-bagua-shore-e",
    kind: "cobblestone",
    linear: true,
    points: [
      radialPt(0 + WEDGE_OFFSET, Number((RING4_APOTHEM + 3.7).toFixed(1))),
      radialPt(0 + WEDGE_OFFSET, 216.5),
    ],
  });
  ensurePath({
    id: "path-bagua-shore-w",
    kind: "cobblestone",
    linear: true,
    points: [
      radialPt(Math.PI + WEDGE_OFFSET, Number((RING4_APOTHEM + 3.7).toFixed(1))),
      radialPt(Math.PI + WEDGE_OFFSET, 216.5),
    ],
  });

  // 3. Bagua Island Terrain Zones (Stone Taiji Plaza + Biome Gardens)
  const ensureZone = (z: WorldTerrainZone) => {
    const existing = state.terrainZones.find((ex) => ex.id === z.id);
    if (existing) {
      if (
        existing.biome === z.biome &&
        Math.abs(existing.x - z.x) < 0.1 &&
        Math.abs(existing.z - z.z) < 0.1 &&
        Math.abs(existing.radius - z.radius) < 0.1
      ) {
        return;
      }
      existing.biome = z.biome;
      existing.x = z.x;
      existing.z = z.z;
      existing.radius = z.radius;
      changed = true;
      details.push(`updated Bagua terrain zone "${z.id}"`);
      return;
    }
    if (state.terrainZones.length >= 48) return;
    state.terrainZones.push(z);
    changed = true;
    details.push(`added Bagua terrain zone "${z.id}"`);
  };

  ensureZone({
    id: "zone-bagua-taiji-plaza",
    biome: "stone_plaza",
    x: CX,
    z: 0,
    radius: 33.3,
  });
  ensureZone({
    id: "zone-bagua-gen-moss",
    biome: "misty_moss",
    x: genPos.x,
    z: genPos.z,
    radius: 21.5,
  });
  ensureZone({
    id: "zone-bagua-zhen-moss",
    biome: "misty_moss",
    x: zhenPos.x,
    z: zhenPos.z,
    radius: 21.5,
  });
  ensureZone({
    id: "zone-bagua-li-plaza",
    biome: "stone_plaza",
    x: liPos.x,
    z: liPos.z,
    radius: 20.5,
  });
  ensureZone({
    id: "zone-bagua-xun-grove",
    biome: "autumn_grove",
    x: xunPos.x,
    z: xunPos.z,
    radius: 21.0,
  });
  ensureZone({
    id: "zone-bagua-kun-meadow",
    biome: "meadow_clover",
    x: kunPos.x,
    z: kunPos.z,
    radius: 21.0,
  });
  ensureZone({
    id: "zone-bagua-qian-plaza",
    biome: "stone_plaza",
    x: qianPos.x,
    z: qianPos.z,
    radius: 20.5,
  });
  ensureZone({
    id: "zone-bagua-dui-plaza",
    biome: "sandy_shore",
    x: duiPos.x,
    z: duiPos.z,
    radius: 19.5,
  });
  ensureZone({
    id: "zone-bagua-inner-teahouse-plaza",
    biome: "stone_plaza",
    x: innerKunPos.x,
    z: innerKunPos.z,
    radius: 11.5,
  });
  ensureZone({
    id: "zone-bagua-inner-silk-plaza",
    biome: "autumn_grove",
    x: innerLiPos.x,
    z: innerLiPos.z,
    radius: 11.5,
  });
  ensureZone({
    id: "zone-bagua-inner-herb-moss",
    biome: "misty_moss",
    x: innerZhenPos.x,
    z: innerZhenPos.z,
    radius: 11.5,
  });
  ensureZone({
    id: "zone-bagua-outer-tavern-plaza",
    biome: "stone_plaza",
    x: outerXunPos.x,
    z: outerXunPos.z,
    radius: 15.5,
  });
  ensureZone({
    id: "zone-bagua-outer-inn-clover",
    biome: "meadow_clover",
    x: outerKunPos.x,
    z: outerKunPos.z,
    radius: 15.0,
  });
  ensureZone({
    id: "zone-bagua-outer-lighthouse-plaza",
    biome: "stone_plaza",
    x: outerDuiPos.x,
    z: outerDuiPos.z,
    radius: 15.0,
  });
  ensureZone({
    id: "zone-bagua-outer-pagoda-grove",
    biome: "autumn_grove",
    x: outerQianPos.x,
    z: outerQianPos.z,
    radius: 15.5,
  });
  ensureZone({
    id: "zone-bagua-outer-dyehouse-moss",
    biome: "misty_moss",
    x: outerKanPos.x,
    z: outerKanPos.z,
    radius: 15.0,
  });

  // 4. Scenic Props (Signs, Lotus Pond, Courtyard Lanterns, Benches)
  const ensureProp = (p: WorldProp) => {
    const existing = state.props.find((ex) => ex.id === p.id);
    if (existing) {
      if (
        existing.kind === p.kind &&
        Math.abs(existing.x - p.x) < 0.1 &&
        Math.abs(existing.z - p.z) < 0.1 &&
        Math.abs(existing.yaw - p.yaw) < 0.01 &&
        existing.label === p.label &&
        existing.radius === p.radius
      ) {
        return;
      }
      existing.kind = p.kind;
      existing.x = p.x;
      existing.z = p.z;
      existing.yaw = p.yaw;
      existing.label = p.label;
      existing.radius = p.radius;
      changed = true;
      details.push(`updated Bagua prop "${p.id}"`);
      return;
    }
    state.props.push(p);
    changed = true;
    details.push(`added Bagua prop "${p.id}"`);
  };

  // Prune retired bridgehead signposts & legacy ping-pong shuttle stops if present in a persisted snapshot
  const obsoletePropIds = [
    "prop-bagua-bridge-west-sign",
    "prop-bagua-bridge-east-sign",
    "prop-bagua-stop-plaza",
    "prop-bagua-stop-gate",
    "prop-bagua-stop-ring2",
    "prop-bagua-stop-taiji",
  ];
  for (const obsoletePropId of obsoletePropIds) {
    const idx = state.props.findIndex((pr) => pr.id === obsoletePropId);
    if (idx >= 0) {
      state.props.splice(idx, 1);
      changed = true;
      details.push(`removed obsolete bridge/shuttle prop "${obsoletePropId}"`);
    }
  }

  ensureProp({
    id: "prop-bagua-taiji-sign",
    kind: "signpost",
    x: CX - 25.7,
    z: -7.4,
    yaw: -Math.PI / 2,
    label: "中天太极广场 · 折叠空间传送阵",
  });
  ensureProp({
    id: "prop-bagua-dui-pond",
    kind: "pond",
    x: CX - 54.3,
    z: -22.9,
    yaw: 0,
    radius: 9.1,
    label: "兑泽荷风莲池",
  });
  ensureProp({
    id: "prop-bagua-kan-pond",
    kind: "pond",
    x: CX + 44.5,
    z: -99.2,
    yaw: 0,
    radius: 8.2,
    label: "坎宫玄武玉泉",
  });
  // Place 4 plaza lanterns cleanly inside inter-radial sector wedges (22.5° off axes) so all 8 radial roads stay unobstructed
  const [lnwX, lnwZ] = radialPt(-Math.PI + WEDGE_OFFSET, 28.0);
  const [lswX, lswZ] = radialPt(Math.PI / 2 + WEDGE_OFFSET, 28.0);
  const [lneX, lneZ] = radialPt(-Math.PI / 2 + WEDGE_OFFSET, 28.0);
  const [lseX, lseZ] = radialPt(0 + WEDGE_OFFSET, 28.0);
  ensureProp({
    id: "prop-bagua-lantern-nw",
    kind: "lamp_post",
    x: lnwX,
    z: lnwZ,
    yaw: 0,
  });
  ensureProp({
    id: "prop-bagua-lantern-sw",
    kind: "lamp_post",
    x: lswX,
    z: lswZ,
    yaw: 0,
  });
  ensureProp({
    id: "prop-bagua-lantern-ne",
    kind: "lamp_post",
    x: lneX,
    z: lneZ,
    yaw: 0,
  });
  ensureProp({
    id: "prop-bagua-lantern-se",
    kind: "lamp_post",
    x: lseX,
    z: lseZ,
    yaw: 0,
  });
  // Outer Ring-3 garden lanterns & market benches inside sector wedges
  const [loeX, loeZ] = radialPt(0 + WEDGE_OFFSET, 118.5);
  const [lowX, lowZ] = radialPt(-Math.PI + WEDGE_OFFSET, 118.5);
  const [lonX, lonZ] = radialPt(-Math.PI / 2 + WEDGE_OFFSET, 118.5);
  const [losX, losZ] = radialPt(Math.PI / 2 + WEDGE_OFFSET, 118.5);
  ensureProp({ id: "prop-bagua-lantern-outer-e", kind: "lamp_post", x: loeX, z: loeZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-lantern-outer-w", kind: "lamp_post", x: lowX, z: lowZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-lantern-outer-n", kind: "lamp_post", x: lonX, z: lonZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-lantern-outer-s", kind: "lamp_post", x: losX, z: losZ, yaw: 0 });

  ensureProp({
    id: "prop-bagua-bench-west",
    kind: "bench",
    x: CX - 61.5,
    z: 4.8,
    yaw: 0,
  });
  ensureProp({
    id: "prop-bagua-bench-south",
    kind: "bench",
    x: CX - 5.2,
    z: 62.9,
    yaw: Math.PI / 2,
  });
  ensureProp({
    id: "prop-bagua-bench-east",
    kind: "bench",
    x: CX + 62.4,
    z: 4.8,
    yaw: 0,
  });
  ensureProp({
    id: "prop-bagua-bench-north",
    kind: "bench",
    x: CX + 4.8,
    z: -62.5,
    yaw: Math.PI / 2,
  });

  // Ring-4 outer corner lanterns, market benches, garden blossoms & tree clusters
  const [lr4neX, lr4neZ] = radialPt(-Math.PI / 4 + WEDGE_OFFSET, 171.5);
  const [lr4seX, lr4seZ] = radialPt(Math.PI / 4 + WEDGE_OFFSET, 171.5);
  const [lr4swX, lr4swZ] = radialPt((3 * Math.PI) / 4 + WEDGE_OFFSET, 171.5);
  const [lr4nwX, lr4nwZ] = radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET, 171.5);
  ensureProp({ id: "prop-bagua-lantern-ring4-ne", kind: "lamp_post", x: lr4neX, z: lr4neZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-lantern-ring4-se", kind: "lamp_post", x: lr4seX, z: lr4seZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-lantern-ring4-sw", kind: "lamp_post", x: lr4swX, z: lr4swZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-lantern-ring4-nw", kind: "lamp_post", x: lr4nwX, z: lr4nwZ, yaw: 0 });

  const [boseX, boseZ] = radialPt(Math.PI / 4 + WEDGE_OFFSET + 0.08, 144.0);
  const [boswX, boswZ] = radialPt((3 * Math.PI) / 4 + WEDGE_OFFSET - 0.08, 144.0);
  ensureProp({
    id: "prop-bagua-bench-outer-se",
    kind: "bench",
    x: boseX,
    z: boseZ,
    yaw: Number((Math.PI / 4 + WEDGE_OFFSET + Math.PI).toFixed(3)),
  });
  ensureProp({
    id: "prop-bagua-bench-outer-sw",
    kind: "bench",
    x: boswX,
    z: boswZ,
    yaw: Number(((3 * Math.PI) / 4 + WEDGE_OFFSET + Math.PI).toFixed(3)),
  });

  const [flDuiX, flDuiZ] = radialPt(-Math.PI + WEDGE_OFFSET - 0.14, 65.5);
  const [flTaiN_X, flTaiN_Z] = radialPt(-Math.PI / 2 + WEDGE_OFFSET, 30.8);
  const [flTaiS_X, flTaiS_Z] = radialPt(Math.PI / 2 + WEDGE_OFFSET, 30.8);
  ensureProp({ id: "prop-bagua-flower-dui", kind: "flower_patch", x: flDuiX, z: flDuiZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-flower-taiji-n", kind: "flower_patch", x: flTaiN_X, z: flTaiN_Z, yaw: 0 });
  ensureProp({ id: "prop-bagua-flower-taiji-s", kind: "flower_patch", x: flTaiS_X, z: flTaiS_Z, yaw: 0 });

  const [trInNeX, trInNeZ] = radialPt(-Math.PI / 4 + WEDGE_OFFSET + 0.16, 61.5);
  const [trInSeX, trInSeZ] = radialPt(Math.PI / 4 + WEDGE_OFFSET - 0.16, 61.5);
  const [trOutNeX, trOutNeZ] = radialPt(-Math.PI / 4 + WEDGE_OFFSET - 0.14, 158.0);
  const [trOutSwX, trOutSwZ] = radialPt((3 * Math.PI) / 4 + WEDGE_OFFSET + 0.14, 158.0);
  const [trOutNwX, trOutNwZ] = radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET + 0.15, 160.0);
  const [trOutNX, trOutNZ] = radialPt(-Math.PI / 2 + WEDGE_OFFSET - 0.15, 160.0);
  ensureProp({ id: "prop-bagua-tree-inner-ne", kind: "tree_cluster", x: trInNeX, z: trInNeZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-tree-inner-se", kind: "tree_cluster", x: trInSeX, z: trInSeZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-tree-outer-ne", kind: "tree_cluster", x: trOutNeX, z: trOutNeZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-tree-outer-sw", kind: "tree_cluster", x: trOutSwX, z: trOutSwZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-tree-outer-nw", kind: "tree_cluster", x: trOutNwX, z: trOutNwZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-tree-outer-n", kind: "tree_cluster", x: trOutNX, z: trOutNZ, yaw: 0 });

  const [bowX, bowZ] = radialPt(Math.PI + WEDGE_OFFSET + 0.08, 144.0);
  const [bonX, bonZ] = radialPt(-Math.PI / 2 + WEDGE_OFFSET + 0.08, 144.0);
  ensureProp({
    id: "prop-bagua-bench-outer-w",
    kind: "bench",
    x: bowX,
    z: bowZ,
    yaw: Number((Math.PI + WEDGE_OFFSET + Math.PI).toFixed(3)),
  });
  ensureProp({
    id: "prop-bagua-bench-outer-n",
    kind: "bench",
    x: bonX,
    z: bonZ,
    yaw: Number((-Math.PI / 2 + WEDGE_OFFSET + Math.PI).toFixed(3)),
  });
  const [flOutWX, flOutWZ] = radialPt(Math.PI + WEDGE_OFFSET - 0.14, 152.0);
  const [flOutNwX, flOutNwZ] = radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET - 0.14, 152.0);
  ensureProp({ id: "prop-bagua-flower-outer-w", kind: "flower_patch", x: flOutWX, z: flOutWZ, yaw: 0 });
  ensureProp({ id: "prop-bagua-flower-outer-nw", kind: "flower_patch", x: flOutNwX, z: flOutNwZ, yaw: 0 });

  // Ring-2 Octagonal Sightseeing Loop Stations (3 stations balanced cleanly around Ring 2)
  const stopDuiPos = radialPt(-Math.PI + WEDGE_OFFSET, Number(RING2_APOTHEM.toFixed(2)));
  const stopKanPos = radialPt(-Math.PI / 2 + WEDGE_OFFSET, Number(RING2_APOTHEM.toFixed(2)));
  const stopLiPos = radialPt(Math.PI / 2 + WEDGE_OFFSET, Number(RING2_APOTHEM.toFixed(2)));
  const curbDuiPos = radialPt(-Math.PI + WEDGE_OFFSET, Number((RING2_APOTHEM - 4.2).toFixed(1)));
  const curbKanPos = radialPt(-Math.PI / 2 + WEDGE_OFFSET, Number((RING2_APOTHEM - 4.2).toFixed(1)));
  const curbLiPos = radialPt(Math.PI / 2 + WEDGE_OFFSET, Number((RING2_APOTHEM - 4.2).toFixed(1)));

  ensureProp({
    id: "prop-bagua-stop-dui",
    kind: "bus_stop",
    x: curbDuiPos[0],
    z: curbDuiPos[1],
    yaw: Number((-Math.PI + WEDGE_OFFSET + Math.PI * 0.5).toFixed(3)),
    label: "二环·兑泽荷风站",
  });
  ensureProp({
    id: "prop-bagua-stop-kan",
    kind: "bus_stop",
    x: curbKanPos[0],
    z: curbKanPos[1],
    yaw: Number((-Math.PI / 2 + WEDGE_OFFSET + Math.PI * 0.5).toFixed(3)),
    label: "二环·坎水玄武站",
  });
  ensureProp({
    id: "prop-bagua-stop-li",
    kind: "bus_stop",
    x: curbLiPos[0],
    z: curbLiPos[1],
    yaw: Number((Math.PI / 2 + WEDGE_OFFSET + Math.PI * 0.5).toFixed(3)),
    label: "二环·离火古台站",
  });

  // 5. Bagua City Full-Ring Sightseeing Loop Shuttle (16-waypoint closed Ring-2 octagonal circuit)
  const shuttleWaypoints: [number, number][] = [];
  for (let side = 0; side < 8; side++) {
    const cornerAngle = side * (Math.PI / 4);
    const midAngle = cornerAngle + WEDGE_OFFSET;
    shuttleWaypoints.push(radialPt(cornerAngle, 85.8));
    shuttleWaypoints.push(radialPt(midAngle, Number(RING2_APOTHEM.toFixed(2))));
  }
  const shuttleStops = [
    {
      id: "stop-bagua-dui-loop",
      name: "二环·兑泽荷风站",
      x: stopDuiPos[0],
      z: stopDuiPos[1],
      dwellSec: 2.0,
      nearCreationId: BAGUA_CREATION_IDS.duiPavilion,
    },
    {
      id: "stop-bagua-kan-loop",
      name: "二环·坎水玄武站",
      x: stopKanPos[0],
      z: stopKanPos[1],
      dwellSec: 2.0,
      nearCreationId: BAGUA_CREATION_IDS.kanWaterwheel,
    },
    {
      id: "stop-bagua-li-loop",
      name: "二环·离火古台站",
      x: stopLiPos[0],
      z: stopLiPos[1],
      dwellSec: 2.0,
      nearCreationId: BAGUA_CREATION_IDS.liStage,
    },
  ];
  const existingShuttle = state.creations.find((c) => c.id === BAGUA_CREATION_IDS.shuttleBus);
  if (!existingShuttle) {
    const bp = buildBaguaShuttleBlueprint();
    state.creations.push({
      id: BAGUA_CREATION_IDS.shuttleBus,
      name: "八卦城环城观光专车",
      description:
        "沿八卦城二环八角坊市街道周而复始循环巡游的朱漆黄铜观光巴士，串联八卦八宫驿站与集市。",
      category: bp.category,
      scaleClass: bp.scaleClass,
      x: stopDuiPos[0],
      z: stopDuiPos[1],
      yaw: 0,
      blueprint: bp,
      behavior: {
        type: "vehicle_route",
        speed: 6.4,
        loopMode: "loop",
        waypoints: shuttleWaypoints,
        stops: shuttleStops,
        statusLine: "正在八卦城二环八角坊市环线循环观光接驳",
      },
      integratedLevel: 2,
      createdAt: 1793000001050,
      isSeed: false,
    });
    changed = true;
    details.push("added Bagua City Ring-2 Loop Sightseeing Shuttle");
  } else {
    const curBeh = existingShuttle.behavior;
    const isOldShuttle =
      curBeh?.type !== "vehicle_route" ||
      curBeh.loopMode !== "loop" ||
      (curBeh.waypoints?.length || 0) < 16 ||
      (curBeh.stops || []).some((s) => s.id === "stop-bagua-west-gate");
    if (isOldShuttle) {
      const bp = buildBaguaShuttleBlueprint();
      existingShuttle.name = "八卦城环城观光专车";
      existingShuttle.description =
        "沿八卦城二环八角坊市街道周而复始循环巡游的朱漆黄铜观光巴士，串联八卦八宫驿站与集市。";
      existingShuttle.x = stopDuiPos[0];
      existingShuttle.z = stopDuiPos[1];
      existingShuttle.behavior = {
        type: "vehicle_route",
        speed: 6.4,
        loopMode: "loop",
        waypoints: shuttleWaypoints,
        stops: shuttleStops,
        statusLine: "正在八卦城二环八角坊市环线循环观光接驳",
      };
      changed = true;
      details.push("upgraded Bagua Sightseeing Shuttle to Ring-2 closed octagonal loop");
    }
  }

  // 6. Bagua City Residents (Ring-2 transit loop riders + palace courtyard strollers)
  const ensureVillager = (v: WorldVillager) => {
    const existing = state.villagers.find((ex) => ex.id === v.id);
    if (existing) {
      const hasLegacyStops =
        Array.isArray(existing.stops) &&
        existing.stops.some(
          (st) =>
            Number(st?.[0]) < 250 ||
            (v.usesTransit &&
              (Math.abs(Number(st?.[0]) - 305.5) < 1.0 ||
                Math.abs(Number(st?.[0]) - 412.4) < 1.0 ||
                Math.abs(Number(st?.[0]) - 455.2) < 1.0)),
        );
      if (hasLegacyStops) {
        existing.homeX = v.homeX;
        existing.homeZ = v.homeZ;
        existing.stops = v.stops;
        changed = true;
        details.push(`rerouted Bagua villager "${v.name}" onto Ring-2 loop stations`);
      }
      return;
    }
    state.villagers.push(v);
    changed = true;
    details.push(`added Bagua villager "${v.name}"`);
  };

  ensureVillager({
    id: "villager-bagua-lin",
    name: "林清雅",
    role: "artist",
    hatColor: "#e8ba4e",
    shirtColor: "#2d786a",
    homeX: curbDuiPos[0],
    homeZ: curbDuiPos[1],
    stops: [curbDuiPos, curbKanPos, curbLiPos],
    usesTransit: true,
  });
  ensureVillager({
    id: "villager-bagua-su",
    name: "苏砚舟",
    role: "commuter",
    hatColor: "#b83c32",
    shirtColor: "#4b6d8a",
    homeX: curbKanPos[0],
    homeZ: curbKanPos[1],
    stops: [curbKanPos, curbLiPos, curbDuiPos],
    usesTransit: true,
  });
  ensureVillager({
    id: "villager-bagua-chen",
    name: "陈望舒",
    role: "student",
    hatColor: "#64dcff",
    shirtColor: "#8b5fbf",
    homeX: curbLiPos[0],
    homeZ: curbLiPos[1],
    stops: [curbLiPos, curbDuiPos, curbKanPos],
    usesTransit: true,
  });
  ensureVillager({
    id: "villager-bagua-mu",
    name: "木槿",
    role: "gardener",
    hatColor: "#46e87a",
    shirtColor: "#d99242",
    homeX: CX - 22,
    homeZ: -12,
    stops: [
      [CX - 22, -12],
      [CX + 18, -14],
      [CX + 20, 14],
      [CX - 18, 16],
    ],
    usesTransit: false,
  });
  ensureVillager({
    id: "villager-bagua-zhao",
    name: "赵子昂",
    role: "explorer",
    hatColor: "#ffa042",
    shirtColor: "#a8443a",
    homeX: CX - 56,
    homeZ: -10,
    stops: [
      [CX - 56, -10],
      [CX - 34, -22],
      [CX - 34, 18],
    ],
    usesTransit: false,
  });
  ensureVillager({
    id: "villager-bagua-yun",
    name: "云舒",
    role: "baker",
    hatColor: "#f4be3b",
    shirtColor: "#508a80",
    homeX: CX + 4,
    homeZ: 48,
    stops: [
      [CX + 4, 48],
      [CX + 44, 34],
      [CX - 38, 42],
    ],
    usesTransit: false,
  });

  // Bagua City Interactive Specialty NPCs (Taiji Keeper, Teahouse Host, Herbalist, Scholar, Blacksmith, Innkeeper)
  ensureVillager({
    id: "villager-bagua-daoist",
    name: "天机道长",
    role: "explorer",
    hatColor: "#f4be3b",
    shirtColor: "#265a78",
    homeX: CX - 22.5,
    homeZ: 14.5,
    stops: [
      [CX - 22.5, 14.5],
      [CX + 22.5, 14.5],
      [CX + 22.5, -14.5],
      [CX - 22.5, -14.5],
    ],
    usesTransit: false,
  });

  const teaFront = radialPt((3 * Math.PI) / 4 + WEDGE_OFFSET, 66.5);
  const teaSide = radialPt((3 * Math.PI) / 4 + WEDGE_OFFSET + 0.09, 68.5);
  ensureVillager({
    id: "villager-bagua-tea",
    name: "沈茶娘",
    role: "baker",
    hatColor: "#5ec4a8",
    shirtColor: "#c95d4c",
    homeX: teaFront[0],
    homeZ: teaFront[1],
    stops: [
      teaFront,
      teaSide,
      radialPt((3 * Math.PI) / 4 + WEDGE_OFFSET - 0.08, 69.0),
    ],
    usesTransit: false,
  });

  const herbFront = radialPt(0 + WEDGE_OFFSET, 66.5);
  ensureVillager({
    id: "villager-bagua-herb",
    name: "白郎中",
    role: "gardener",
    hatColor: "#78c26d",
    shirtColor: "#d9ccb0",
    homeX: herbFront[0],
    homeZ: herbFront[1],
    stops: [
      herbFront,
      radialPt(0 + WEDGE_OFFSET + 0.09, 68.5),
      radialPt(0 + WEDGE_OFFSET - 0.09, 68.5),
    ],
    usesTransit: false,
  });

  const scholarFront = radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET, 66.5);
  ensureVillager({
    id: "villager-bagua-scholar",
    name: "陆夫子",
    role: "student",
    hatColor: "#465896",
    shirtColor: "#33737a",
    homeX: scholarFront[0],
    homeZ: scholarFront[1],
    stops: [
      scholarFront,
      radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET + 0.08, 69.2),
      radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET - 0.08, 69.2),
    ],
    usesTransit: false,
  });

  const smithFront = radialPt(0 + WEDGE_OFFSET, 146.5);
  ensureVillager({
    id: "villager-bagua-smith",
    name: "公孙铁匠",
    role: "commuter",
    hatColor: "#d98236",
    shirtColor: "#434952",
    homeX: smithFront[0],
    homeZ: smithFront[1],
    stops: [
      smithFront,
      radialPt(0 + WEDGE_OFFSET + 0.05, 143.5),
      radialPt(0 + WEDGE_OFFSET - 0.05, 143.5),
    ],
    usesTransit: false,
  });

  const tavernFront = radialPt(Math.PI / 4 + WEDGE_OFFSET, 146.5);
  ensureVillager({
    id: "villager-bagua-innkeeper",
    name: "花月掌柜",
    role: "artist",
    hatColor: "#e04f44",
    shirtColor: "#8a3b61",
    homeX: tavernFront[0],
    homeZ: tavernFront[1],
    stops: [
      tavernFront,
      radialPt(Math.PI / 4 + WEDGE_OFFSET + 0.06, 143.0),
      radialPt(Math.PI / 4 + WEDGE_OFFSET - 0.06, 143.0),
    ],
    usesTransit: false,
  });

  const pagodaFront = radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET, 146.5);
  ensureVillager({
    id: "villager-bagua-keeper",
    name: "守塔陈翁",
    role: "explorer",
    hatColor: "#c98cff",
    shirtColor: "#465878",
    homeX: pagodaFront[0],
    homeZ: pagodaFront[1],
    stops: [
      pagodaFront,
      radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET + 0.06, 143.5),
      radialPt((-3 * Math.PI) / 4 + WEDGE_OFFSET - 0.06, 143.5),
    ],
    usesTransit: false,
  });

  const dyeFront = radialPt(-Math.PI / 2 + WEDGE_OFFSET, 146.5);
  ensureVillager({
    id: "villager-bagua-dyer",
    name: "苏染娘",
    role: "artist",
    hatColor: "#38a39c",
    shirtColor: "#2b5ba8",
    homeX: dyeFront[0],
    homeZ: dyeFront[1],
    stops: [
      dyeFront,
      radialPt(-Math.PI / 2 + WEDGE_OFFSET + 0.06, 143.5),
      radialPt(-Math.PI / 2 + WEDGE_OFFSET - 0.06, 143.5),
    ],
    usesTransit: false,
  });

  const lighthouseFront = radialPt(Math.PI + WEDGE_OFFSET, 146.5);
  ensureVillager({
    id: "villager-bagua-lighthouse",
    name: "戚舵手",
    role: "commuter",
    hatColor: "#64f0ff",
    shirtColor: "#9c3830",
    homeX: lighthouseFront[0],
    homeZ: lighthouseFront[1],
    stops: [
      lighthouseFront,
      radialPt(Math.PI + WEDGE_OFFSET + 0.06, 143.5),
      radialPt(Math.PI + WEDGE_OFFSET - 0.06, 143.5),
    ],
    usesTransit: false,
  });

  const operaFront = radialPt(marketOperaAngle, 140.5);
  ensureVillager({
    id: "villager-bagua-opera",
    name: "魏班主",
    role: "baker",
    hatColor: "#ebb93c",
    shirtColor: "#c9332b",
    homeX: operaFront[0],
    homeZ: operaFront[1],
    stops: [
      operaFront,
      radialPt(marketOperaAngle - 0.04, 139.0),
      radialPt(marketOperaAngle + 0.04, 139.0),
    ],
    usesTransit: false,
  });

  // 7. Mythic Sky Guardian — 扶摇大鹏 (autonomous multi-island soaring & random portal teleportation)
  const existingDapeng = state.creations.find((c) => c.id === BAGUA_CREATION_IDS.dapengRoc);
  if (!existingDapeng) {
    const rocBp = buildDapengRocBlueprint();
    state.creations.push({
      id: BAGUA_CREATION_IDS.dapengRoc,
      name: rocBp.name,
      description: rocBp.description,
      category: rocBp.category,
      scaleClass: rocBp.scaleClass,
      x: 245,
      z: -18,
      yaw: Math.PI * 0.42,
      blueprint: rocBp,
      behavior: {
        type: "fly_circle",
        roamMode: "islands_portal",
        speed: 14.5,
        altitude: 26,
        centerX: 250,
        centerZ: 0,
        radius: 135,
        statusLine: "正扶摇巡游诸岛天穹 · 可自主穿越传送阵随机跃迁",
      },
      integratedLevel: 2,
      createdAt: 1793000001090,
      isSeed: false,
    });
    changed = true;
    details.push("added soaring mythic Dapeng Roc over world islands");
  } else if (
    existingDapeng.behavior?.type !== "fly_circle" ||
    existingDapeng.behavior.roamMode !== "islands_portal"
  ) {
    existingDapeng.behavior = {
      type: "fly_circle",
      roamMode: "islands_portal",
      speed: 14.5,
      altitude: 26,
      centerX: 250,
      centerZ: 0,
      radius: 135,
      statusLine: "正扶摇巡游诸岛天穹 · 可自主穿越传送阵随机跃迁",
    };
    changed = true;
    details.push("upgraded Dapeng Roc flight behavior to multi-island portal roaming");
  }

  return { changed, details };
}
