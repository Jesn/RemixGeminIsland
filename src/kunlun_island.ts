import type {
  VoxelBlueprint,
  WorldCreation,
  WorldPath,
  WorldProp,
  WorldTerrainZone,
  WorldVillager,
} from "./types";
import { normalizeAndGroundBlueprint } from "./voxel_dsl";

export const KUNLUN_ISLAND_CENTER: [number, number] = [340, -480];
export const KUNLUN_ISLAND_RADIUS = 134;
export const KUNLUN_PORTAL_POS: [number, number] = [340, -460];

export const KUNLUN_CREATION_IDS = {
  jadePalace: "kunlun-jade-palace",
  frostForge: "kunlun-frost-forge",
  hotSpring: "kunlun-hot-spring",
} as const;

export const KUNLUN_PROTECTED_PATH_IDS = new Set([
  "path-kunlun-plaza-walk",
  "path-kunlun-west-trail",
  "path-kunlun-east-trail",
]);

export const KUNLUN_PROTECTED_PROP_IDS = new Set([
  "prop-kunlun-sign",
  "prop-kunlun-spring-pond",
  "prop-kunlun-lantern-w",
  "prop-kunlun-lantern-e",
  "prop-kunlun-bench",
]);

export function getKunlunCoastWarp(theta: number): number {
  return (
    7.5 * Math.cos(3 * theta + 0.6) +
    5.2 * Math.sin(4 * theta - 0.8) +
    3.4 * Math.cos(5 * theta)
  );
}

/**
 * Signed distance (in meters) inward from the flat alpine-frost plateau edge of
 * 蓬莱玄霜仙岛 (`[340, -480]`).
 */
export function getKunlunIslandInlandMargin(x: number, z: number): number {
  const dx = x - KUNLUN_ISLAND_CENTER[0];
  const dz = z - KUNLUN_ISLAND_CENTER[1];
  const dist = Math.hypot(dx, dz);
  const theta = dist > 1e-4 ? Math.atan2(dz, dx) : 0;
  return KUNLUN_ISLAND_RADIUS + getKunlunCoastWarp(theta) - dist;
}

// ---------------------------------------------------------------------------
// 1. 瑶池凌霄仙阁 (Frost-Jade Alpine Sky Pavilion at Kunlun Center)
// ---------------------------------------------------------------------------
export function buildKunlunJadePalaceBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "瑶池凌霄仙阁",
      description:
        "矗立于蓬莱玄霜仙岛极巅的白玉玄冰双层仙阁，飞檐缀霜晶，阁顶凌霄寒玉环日夜旋映极光。",
      category: "building",
      scaleClass: "colossal",
      palette: {
        marble: "#edf4f8",
        marbleShade: "#cbd9e4",
        frostSlate: "#4c6278",
        jadeIce: "#7ef2ff",
        glacier: "#3fb2d4",
        eaveBlue: "#263d54",
        silverTrim: "#c2d4e2",
        goldAccent: "#f5cb66",
        warmLantern: "#ffd98a",
        cedar: "#63412d",
      },
      ops: [
        // Stepped octagonal white-marble frost plinth Y=0..3
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, radius: 13.5, color: "marbleShade" },
        { op: "cylinder", axis: "y", cx: 0, y0: 1, y1: 2, cz: 0, radius: 11.5, color: "marble" },
        { op: "cylinder", axis: "y", cx: 0, y0: 2, y1: 3, cz: 0, radius: 9.2, color: "frostSlate" },

        // South grand approach staircase (+Z front)
        { op: "stairs", x0: -3, y0: 0, z0: 9, steps: 3, width: 6, dir: "-z", color: "marble" },

        // Ground-floor sanctuary walls & jade crystal pillars Y=3..13
        { op: "cylinder", axis: "y", cx: 0, y0: 3, y1: 13, cz: 0, radius: 6.2, color: "marble" },
        { op: "box", x0: -2, y0: 3, z0: 5, x1: 2, y1: 10, z1: 7, color: "warmLantern", emit: 0.9 },
        { op: "box", x0: -2, y0: 3, z0: -7, x1: 2, y1: 10, z1: -5, color: "jadeIce", emit: 0.95 },
        { op: "box", x0: 5, y0: 4, z0: -2, x1: 7, y1: 10, z1: 2, color: "jadeIce", emit: 0.85, mirrorX: true },

        // 8 Frost-jade corner colonnade pillars around perimeter
        { op: "cylinder", axis: "y", cx: 7.4, y0: 3, y1: 13, cz: 0, radius: 0.75, color: "glacier", mirrorX: true },
        { op: "cylinder", axis: "y", cx: 0, y0: 3, y1: 13, cz: -7.4, radius: 0.75, color: "glacier" },
        { op: "cylinder", axis: "y", cx: 5.4, y0: 3, y1: 13, cz: 5.4, radius: 0.75, color: "glacier", mirrorX: true },
        { op: "cylinder", axis: "y", cx: 5.4, y0: 3, y1: 13, cz: -5.4, radius: 0.75, color: "glacier", mirrorX: true },

        // Lower upturned sapphire-slate eave roof Y=13..17
        { op: "cone", cx: 0, y0: 13, y1: 17, cz: 0, rBottom: 10.6, rTop: 5.8, color: "eaveBlue" },
        { op: "ring", axis: "y", cx: 0, y0: 13, y1: 14, cz: 0, outerR: 11.0, innerR: 9.2, color: "silverTrim" },

        // Upper sky gallery & warm lantern windows Y=17..25
        { op: "cylinder", axis: "y", cx: 0, y0: 17, y1: 25, cz: 0, radius: 4.8, color: "frostSlate" },
        { op: "ring", axis: "y", cx: 0, y0: 17, y1: 19, cz: 0, outerR: 6.4, innerR: 4.8, color: "cedar" },
        { op: "box", x0: -1, y0: 19, z0: -5, x1: 1, y1: 23, z1: 5, color: "warmLantern", emit: 1.0 },
        { op: "box", x0: -5, y0: 19, z0: -1, x1: 5, y1: 23, z1: 1, color: "jadeIce", emit: 1.0 },

        // Upper frost roof & gilded finial base Y=25..33
        { op: "cone", cx: 0, y0: 25, y1: 31, cz: 0, rBottom: 8.2, rTop: 1.2, color: "eaveBlue" },
        { op: "ring", axis: "y", cx: 0, y0: 25, y1: 26, cz: 0, outerR: 8.5, innerR: 6.8, color: "jadeIce", emit: 0.7 },
        { op: "cylinder", axis: "y", cx: 0, y0: 31, y1: 33, cz: 0, radius: 0.8, color: "goldAccent" },
      ],
      parts: [
        {
          // Levitating spinning frost-halo crystal spire safely separated at Y=36..41 (3 voxels clear above y=33 spire)
          name: "kunlun-frost-halo",
          kind: "spinY",
          speed: 0.72,
          pivot: [0, 36.5, 0],
          ops: [
            { op: "ring", axis: "y", cx: 0, y0: 0, y1: 1, cz: 0, outerR: 3.6, innerR: 2.3, color: "jadeIce", emit: 1.2 },
            { op: "box", x0: -4, y0: 0, z0: 0, x1: 4, y1: 1, z1: 1, color: "goldAccent", emit: 0.6 },
            { op: "box", x0: 0, y0: 0, z0: -4, x1: 1, y1: 1, z1: 4, color: "goldAccent", emit: 0.6 },
            { op: "sphere", cx: 0, cy: 2.6, cz: 0, rx: 1.5, ry: 2.0, rz: 1.5, color: "jadeIce", emit: 1.4 },
          ],
        },
      ],
    },
    "瑶池凌霄仙阁",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// ---------------------------------------------------------------------------
// 2. 玄冰炼星台 (Obsidian & Frost-Crystal Astral Forge Terrace)
// ---------------------------------------------------------------------------
export function buildKunlunFrostForgeBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "玄冰炼星台",
      description:
        "以深海玄武岩与万年寒冰筑成的观星祭炼台，半空悬停自转的冰魄星核汇聚天地清气。",
      category: "building",
      scaleClass: "large",
      palette: {
        basalt: "#28313e",
        basaltLight: "#435166",
        snow: "#eef6fc",
        frostBlue: "#6ae6ff",
        iceCore: "#b6f7ff",
        gold: "#f2c15a",
      },
      ops: [
        // Circular obsidian stepped terrace Y=0..3
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 2, cz: 0, radius: 9.5, color: "basalt" },
        { op: "cylinder", axis: "y", cx: 0, y0: 2, y1: 3, cz: 0, radius: 7.4, color: "basaltLight" },
        { op: "ring", axis: "y", cx: 0, y0: 3, y1: 4, cz: 0, outerR: 7.2, innerR: 5.5, color: "snow" },
        // Glowing frost crucible basin Y=3..6
        { op: "cylinder", axis: "y", cx: 0, y0: 3, y1: 5, cz: 0, radius: 3.4, color: "frostBlue", emit: 1.1 },
        // 4 Outer obsidian monolith obelisks around the terrace
        { op: "box", x0: 6, y0: 3, z0: -1, x1: 8, y1: 12, z1: 1, color: "basalt", mirrorX: true },
        { op: "box", x0: 6, y0: 12, z0: -1, x1: 8, y1: 14, z1: 1, color: "frostBlue", emit: 1.2, mirrorX: true },
        { op: "box", x0: -1, y0: 3, z0: -8, x1: 1, y1: 12, z1: -6, color: "basalt" },
        { op: "box", x0: -1, y0: 12, z0: -8, x1: 1, y1: 14, z1: -6, color: "frostBlue", emit: 1.2 },
        { op: "box", x0: -1, y0: 3, z0: 6, x1: 1, y1: 10, z1: 8, color: "basalt" },
        { op: "box", x0: -1, y0: 10, z0: 6, x1: 1, y1: 11, z1: 8, color: "gold", emit: 0.7 },
      ],
      parts: [
        {
          // Floating frost-star crystal core bobbing safely at Y=10..15 inside clear center
          name: "frost-star-core",
          kind: "bob",
          speed: 1.5,
          amp: 0.75,
          pivot: [0, 12.2, 0],
          ops: [
            { op: "sphere", cx: 0, cy: 0, cz: 0, rx: 2.0, ry: 2.5, rz: 2.0, color: "frostBlue", emit: 1.4 },
            { op: "box", x0: -3, y0: -1, z0: -1, x1: 3, y1: 1, z1: 1, color: "iceCore", emit: 1.1 },
            { op: "box", x0: -1, y0: -1, z0: -3, x1: 1, y1: 1, z1: 3, color: "gold", emit: 0.7 },
          ],
        },
      ],
    },
    "玄冰炼星台",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

// ---------------------------------------------------------------------------
// 3. 寒山灵泉亭 (Timber & Moss Hot-Spring Sanctuary Pavilion)
// ---------------------------------------------------------------------------
export function buildKunlunHotSpringBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "寒山灵泉亭",
      description:
        "依傍蓬莱地热灵泉而筑的雪松木亭，暖灯微明、泉雾氤氲，与周边雪原形成温润对比。",
      category: "building",
      scaleClass: "large",
      palette: {
        stone: "#6e7a84",
        timber: "#754b2c",
        timberLight: "#a16a3f",
        moss: "#4c9658",
        tile: "#2c3d4f",
        snowCap: "#eff7fc",
        warmGlow: "#ffe296",
        springWater: "#3ad1cf",
      },
      ops: [
        // Flagstone & cedar bath deck Y=0..2
        { op: "box", x0: -8, y0: 0, z0: -8, x1: 8, y1: 2, z1: 8, color: "stone" },
        { op: "box", x0: -6, y0: 2, z0: -6, x1: 6, y1: 3, z1: 6, color: "timberLight" },
        // Inner warm thermal pool inlaid on the deck Y=2..3
        { op: "box", x0: -3, y0: 2, z0: -3, x1: 3, y1: 3, z1: 3, color: "springWater", emit: 0.75 },
        // Four corner cedar pavilion columns Y=3..11
        { op: "box", x0: 5, y0: 3, z0: 5, x1: 6, y1: 11, z1: 6, color: "timber", mirrorX: true },
        { op: "box", x0: 5, y0: 3, z0: -6, x1: 6, y1: 11, z1: -5, color: "timber", mirrorX: true },
        // Hanging warm lanterns under beams
        { op: "box", x0: 4, y0: 8, z0: 4, x1: 5, y1: 10, z1: 5, color: "warmGlow", emit: 1.3, mirrorX: true },
        // Stepped pyramid tiled roof topped with crisp alpine snow blanket Y=11..17
        { op: "roofPyramid", x0: -8, yBase: 11, z0: -8, x1: 8, y1: 17, color: "tile", trim: "snowCap" },
        { op: "box", x0: -2, y0: 17, z0: -2, x1: 2, y1: 18, z1: 2, color: "snowCap" },
      ],
      parts: [
        {
          // Gently rising warm steam wisp floating cleanly at Y=5.2..7.5 inside pavilion center
          name: "spring-steam-wisp",
          kind: "bob",
          speed: 1.15,
          amp: 0.45,
          pivot: [0, 6.2, 0],
          ops: [
            { op: "sphere", cx: 0, cy: 0, cz: 0, rx: 1.8, ry: 0.9, rz: 1.8, color: "snowCap", emit: 0.45 },
          ],
        },
      ],
    },
    "寒山灵泉亭",
    { keepPlinth: false, skipAutoRepair: true },
  );
}

export function ensureKunlunIsland(state: {
  creations: WorldCreation[];
  paths: WorldPath[];
  props: WorldProp[];
  terrainZones: WorldTerrainZone[];
  villagers: WorldVillager[];
}): { changed: boolean; details: string[] } {
  const details: string[] = [];
  let changed = false;

  const [KCX, KCZ] = KUNLUN_ISLAND_CENTER;

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
        details.push(`realigned Kunlun landmark "${existing.name}"`);
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
      createdAt: 1794000000000 + spec.createdAtOffset,
      isSeed: false,
    });
    changed = true;
    details.push(`added Kunlun landmark "${bp.name}" at [${spec.x}, ${spec.z}]`);
  };

  // 1. Three Distinct Frost-Jade Landmarks across 蓬莱玄霜仙岛
  ensureCreation({
    id: KUNLUN_CREATION_IDS.jadePalace,
    x: KCX,
    z: KCZ - 14,
    yaw: 0, // Faces +Z south toward the portal arrival plaza at [340, -460]
    builder: buildKunlunJadePalaceBlueprint,
    activity: "凌霄飞檐映霜雪",
    statusLine: "蓬莱玄霜仙岛中枢白玉仙阁，阁顶寒玉环日夜流转灵气",
    createdAtOffset: 100,
  });

  ensureCreation({
    id: KUNLUN_CREATION_IDS.frostForge,
    x: KCX - 46,
    z: KCZ + 18,
    yaw: 0.72,
    builder: buildKunlunFrostForgeBlueprint,
    activity: "玄冰星核炼清气",
    statusLine: "玄武岩祭台上悬停自转的冰魄星核正汇聚北方极光",
    createdAtOffset: 200,
  });

  ensureCreation({
    id: KUNLUN_CREATION_IDS.hotSpring,
    x: KCX + 44,
    z: KCZ + 20,
    yaw: -0.68,
    builder: buildKunlunHotSpringBlueprint,
    activity: "寒山灵泉暖雾升",
    statusLine: "雪原之中难得的一方温润地热灵泉木亭，可供旅人歇脚",
    createdAtOffset: 300,
  });

  // 2. Winding Cobblestone & Boardwalk Trails connecting Portal Plaza [340, -460] & all 3 Shrines
  const ensurePath = (p: WorldPath) => {
    const existing = state.paths.find((ex) => ex.id === p.id);
    if (existing) return;
    state.paths.push(p);
    changed = true;
    details.push(`added Kunlun path "${p.id}"`);
  };

  ensurePath({
    id: "path-kunlun-plaza-walk",
    kind: "cobblestone",
    points: [
      [KCX, KCZ + 28],
      [KUNLUN_PORTAL_POS[0], KUNLUN_PORTAL_POS[1] + 2.5],
      [KCX, KCZ + 8],
      [KCX, KCZ - 4],
    ],
  });

  ensurePath({
    id: "path-kunlun-west-trail",
    kind: "cobblestone",
    points: [
      [KCX - 6, KCZ + 14],
      [KCX - 24, KCZ + 18],
      [KCX - 38, KCZ + 18],
    ],
  });

  ensurePath({
    id: "path-kunlun-east-trail",
    kind: "boardwalk",
    points: [
      [KCX + 6, KCZ + 14],
      [KCX + 22, KCZ + 19],
      [KCX + 36, KCZ + 20],
    ],
  });

  // 3. Kunlun Island Terrain Zones (snow_frost blanket + warm misty_moss hot spring + basalt forge)
  const ensureZone = (z: WorldTerrainZone) => {
    if (state.terrainZones.some((ex) => ex.id === z.id)) return;
    if (state.terrainZones.length >= 48) return;
    state.terrainZones.push(z);
    changed = true;
    details.push(`added Kunlun terrain zone "${z.id}"`);
  };

  ensureZone({
    id: "zone-kunlun-snow",
    biome: "snow_frost",
    x: KCX,
    z: KCZ,
    radius: 126,
  });
  ensureZone({
    id: "zone-kunlun-spring",
    biome: "misty_moss",
    x: KCX + 46,
    z: KCZ + 24,
    radius: 22,
  });
  ensureZone({
    id: "zone-kunlun-forge",
    biome: "volcanic_basalt",
    x: KCX - 46,
    z: KCZ + 18,
    radius: 18,
  });

  // 4. Scenic Props (Signpost, Steaming Spring Pond, Lanterns, Bench)
  const ensureProp = (p: WorldProp) => {
    if (state.props.some((ex) => ex.id === p.id)) return;
    state.props.push(p);
    changed = true;
    details.push(`added Kunlun prop "${p.id}"`);
  };

  ensureProp({
    id: "prop-kunlun-sign",
    kind: "signpost",
    x: KCX + 6.5,
    z: KCZ + 20,
    yaw: -0.35,
    label: "蓬莱玄霜仙岛 · 瑶池凌霄阁",
  });
  ensureProp({
    id: "prop-kunlun-spring-pond",
    kind: "pond",
    x: KCX + 59,
    z: KCZ + 33,
    yaw: 0,
    radius: 7.4,
    label: "寒山玉髓灵泉池",
  });
  ensureProp({
    id: "prop-kunlun-lantern-w",
    kind: "lamp_post",
    x: KCX - 7.5,
    z: KCZ + 12,
    yaw: 0,
  });
  ensureProp({
    id: "prop-kunlun-lantern-e",
    kind: "lamp_post",
    x: KCX + 7.5,
    z: KCZ + 12,
    yaw: 0,
  });
  ensureProp({
    id: "prop-kunlun-bench",
    kind: "bench",
    x: KCX + 16,
    z: KCZ + 17,
    yaw: Math.PI * 0.5,
  });

  // 5. Kunlun Island Residents
  const ensureVillager = (v: WorldVillager) => {
    if (state.villagers.some((ex) => ex.id === v.id)) return;
    state.villagers.push(v);
    changed = true;
    details.push(`added Kunlun villager "${v.name}"`);
  };

  ensureVillager({
    id: "villager-kunlun-miao",
    name: "云渺",
    role: "explorer",
    hatColor: "#7ef2ff",
    shirtColor: "#35658c",
    homeX: KCX - 14,
    homeZ: KCZ + 15,
    stops: [
      [KCX - 14, KCZ + 15],
      [KCX - 38, KCZ + 18],
      [KCX + 2, KCZ + 24],
    ],
    usesTransit: false,
  });
  ensureVillager({
    id: "villager-kunlun-han",
    name: "墨寒",
    role: "artist",
    hatColor: "#f5cb66",
    shirtColor: "#48706e",
    homeX: KCX + 16,
    homeZ: KCZ + 15,
    stops: [
      [KCX + 16, KCZ + 15],
      [KCX + 36, KCZ + 20],
      [KCX + 2, KCZ + 4],
    ],
    usesTransit: false,
  });

  return { changed, details };
}
