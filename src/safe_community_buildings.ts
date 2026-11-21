import type { VoxelBlueprint, WorldCreation, WorldPath } from "./types";
import { normalizeAndGroundBlueprint } from "./voxel_dsl";

export interface SafeBuildingPlacementSpec {
  id: string;
  x: number;
  z: number;
  yaw: number;
  spurKind: "cobblestone" | "cottage_road";
  spurPoints: [number, number][];
  creatorPrompt: string;
  activity: string;
  statusLine: string;
  buildBlueprint: () => VoxelBlueprint;
}

function buildHospitalWellnessBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "草溪综合医院",
      description:
        "为岛上居民提供安心医疗护理与健康休养的三层社区医院。",
      category: "building",
      scaleClass: "large",
      palette: {
        stoneBase: "#cfc9be",
        wallCream: "#f6f2e9",
        terracotta: "#c96a4b",
        trimWhite: "#ffffff",
        emeraldCross: "#2ea36b",
        glassSoft: "#bce7f5",
        glassWarm: "#ffe7a8",
        railSteel: "#8d9aa6",
        helipadGray: "#5d6670",
        helipadMark: "#f7d44c",
        planterGreen: "#4ea04b",
      },
      ops: [
        // Ground-floor wings & central hall flush at Y = 0
        { op: "roundedBox", x0: -17, y0: 0, z0: -10, x1: 17, y1: 10, z1: 8, radius: 1.5, color: "wallCream" },
        { op: "box", x0: -17, y0: 0, z0: -10, x1: 17, y1: 2, z1: 8, color: "stoneBase" },
        // Second & third central floors with wraparound safety-railed recovery terraces
        { op: "roundedBox", x0: -12, y0: 10, z0: -9, x1: 12, y1: 19, z1: 7, radius: 1.4, color: "wallCream" },
        { op: "roundedBox", x0: -8, y0: 19, z0: -7, x1: 8, y1: 26, z1: 5, radius: 1.2, color: "wallCream" },
        // Safety railings around side solarium roofs (Y = 10..12)
        { op: "box", x0: 12, y0: 10, z0: -9, x1: 17, y1: 12, z1: -8, color: "railSteel", mirrorX: true },
        { op: "box", x0: 12, y0: 10, z0: 7, x1: 17, y1: 12, z1: 8, color: "railSteel", mirrorX: true },
        { op: "box", x0: 16, y0: 10, z0: -9, x1: 17, y1: 12, z1: 8, color: "railSteel", mirrorX: true },
        // Terracotta cornice bands & rooftop rescue pad
        { op: "box", x0: -13, y0: 18, z0: -10, x1: 13, y1: 20, z1: 8, color: "terracotta" },
        { op: "box", x0: -9, y0: 26, z0: -8, x1: 9, y1: 27, z1: 6, color: "terracotta" },
        { op: "cylinder", axis: "y", cx: 0, y0: 27, y1: 28, cz: -1, radius: 5.2, color: "helipadGray" },
        { op: "ring", axis: "y", cx: 0, y0: 28, y1: 29, cz: -1, outerR: 4.8, innerR: 4.0, color: "helipadMark", emit: 0.5 },
        // +Z Accessible front portico canopy, gentle entrance ramp & emerald wellness cross
        { op: "box", x0: -6, y0: 0, z0: 8, x1: 6, y1: 1, z1: 12, color: "stoneBase" },
        { op: "box", x0: -6, y0: 7, z0: 8, x1: 6, y1: 9, z1: 12, color: "trimWhite" },
        { op: "pillars", x0: -5, y0: 1, z0: 8, x1: 5, y1: 7, z1: 11, color: "trimWhite" },
        { op: "arch", cx: 0, y0: 1, cz: 8, halfSpan: 3, height: 6, depth: 2, axis: "z", color: "glassWarm" },
        // Green wellness cross on upper +Z facade
        { op: "box", x0: -1, y0: 20, z0: 5, x1: 1, y1: 25, z1: 6, color: "emeraldCross", emit: 0.7 },
        { op: "box", x0: -3, y0: 22, z0: 5, x1: 3, y1: 23, z1: 6, color: "emeraldCross", emit: 0.7 },
        // Sunlit ward windows & front herb planters
        { op: "windowRow", wall: "+z", y: 4, start: -14, end: -8, every: 3, width: 2, height: 4, bounds: { x0: -17, z0: -10, x1: 17, z1: 8 }, color: "glassSoft", emit: 0.45 },
        { op: "windowRow", wall: "+z", y: 4, start: 8, end: 14, every: 3, width: 2, height: 4, bounds: { x0: -17, z0: -10, x1: 17, z1: 8 }, color: "glassSoft", emit: 0.45 },
        { op: "windowRow", wall: "+z", y: 12, start: -9, end: 9, every: 4, width: 2, height: 4, bounds: { x0: -12, z0: -9, x1: 12, z1: 7 }, color: "glassWarm", emit: 0.55 },
        { op: "windowRow", wall: "-z", y: 4, start: -13, end: 13, every: 4, width: 2, height: 4, bounds: { x0: -17, z0: -10, x1: 17, z1: 8 }, color: "glassSoft", emit: 0.4 },
        { op: "box", x0: 7, y0: 1, z0: 8, x1: 13, y1: 3, z1: 10, color: "planterGreen", mirrorX: true },
      ],
      parts: [],
    },
    "草溪综合医院",
  );
}

function buildPlanetariumObservatoryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "星光天文馆与观象台",
      description:
        "供游客在晴朗夜晚观测星空与星座奥秘的公共铜顶天文观测台。",
      category: "building",
      scaleClass: "large",
      palette: {
        sandstoneDark: "#b59d7e",
        sandstone: "#dfd0b8",
        sandstoneBright: "#f3eadb",
        copperPatina: "#499e8d",
        copperDark: "#327366",
        brass: "#e0b145",
        glassStar: "#7ec8e8",
        warmGlow: "#ffe59e",
      },
      ops: [
        // Drum rotunda grounded flush at Y = 0
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 3, cz: -1, radius: 14.5, color: "sandstoneDark" },
        { op: "cylinder", axis: "y", cx: 0, y0: 3, y1: 15, cz: -1, radius: 13.2, color: "sandstone" },
        { op: "ring", axis: "y", cx: 0, y0: 14, y1: 17, cz: -1, outerR: 14.2, innerR: 12.2, color: "sandstoneBright" },
        // Safety balustrade ring around observation deck (Y = 17..19)
        { op: "ring", axis: "y", cx: 0, y0: 17, y1: 19, cz: -1, outerR: 14.0, innerR: 13.1, color: "brass" },
        // Copper observatory dome & brass telescope shutter slit
        { op: "dome", cx: 0, yBase: 16, cz: -1, radius: 11.2, color: "copperPatina" },
        { op: "box", x0: -2, y0: 19, z0: 5, x1: 2, y1: 26, z1: 10, color: "copperDark" },
        { op: "cylinder", axis: "z", cx: 0, cy: 22, z0: 7, z1: 12, radius: 1.4, color: "brass" },
        { op: "cylinder", axis: "z", cx: 0, cy: 22, z0: 11, z1: 12, radius: 1.0, color: "glassStar", emit: 0.85 },
        // Classical +Z portico entrance with columns & pediment
        { op: "box", x0: -7, y0: 0, z0: 10, x1: 7, y1: 2, z1: 16, color: "sandstoneDark" },
        { op: "pillars", x0: -6, y0: 2, z0: 11, x1: 6, y1: 12, z1: 15, color: "sandstoneBright" },
        { op: "roofGable", x0: -7, yBase: 12, z0: 10, x1: 7, z1: 16, rise: 4, axis: "z", color: "copperPatina", trim: "sandstoneBright" },
        { op: "arch", cx: 0, y0: 2, cz: 12, halfSpan: 3, height: 7, depth: 2, axis: "z", color: "warmGlow" },
      ],
      parts: [
        {
          name: "celestial-astrolabe",
          kind: "spinY",
          speed: 0.75,
          pivot: [0, 30.5, -1],
          ops: [
            { op: "ring", axis: "x", x0: -0.5, x1: 0.5, cy: 0, cz: 0, outerR: 2.2, innerR: 1.5, color: "brass" },
            { op: "sphere", cx: 0, cy: 0, cz: 0, rx: 0.9, ry: 0.9, rz: 0.9, color: "warmGlow", emit: 1.1 },
          ],
        },
      ],
    },
    "星光天文馆与观象台",
  );
}

function buildGrandPavilionHotelBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "日长石大饭店",
      description:
        "设有环绕式观景阳台与温馨客房的三层高山草甸度假酒店。",
      category: "building",
      scaleClass: "large",
      palette: {
        granite: "#8e8980",
        plasterWarm: "#f7eedb",
        timber: "#7a4e2d",
        roofSlate: "#3d5366",
        roofTrim: "#e8dcc4",
        awningCoral: "#d95b43",
        windowGold: "#ffe39c",
        balconyIron: "#3b4048",
        flowerBox: "#5aa84f",
      },
      ops: [
        // Stone ground foundation & main 3-story lodge body
        { op: "box", x0: -16, y0: 0, z0: -10, x1: 16, y1: 3, z1: 9, color: "granite" },
        { op: "roundedBox", x0: -15, y0: 3, z0: -9, x1: 15, y1: 21, z1: 8, radius: 1.2, color: "plasterWarm" },
        // Half-timbered structural bands & wraparound safety balconies at Y = 10 and Y = 16
        { op: "box", x0: -16, y0: 9, z0: -10, x1: 16, y1: 10, z1: 10, color: "timber" },
        { op: "box", x0: -16, y0: 10, z0: 9, x1: 16, y1: 12, z1: 10, color: "balconyIron" },
        { op: "box", x0: -16, y0: 15, z0: -10, x1: 16, y1: 16, z1: 10, color: "timber" },
        { op: "box", x0: -16, y0: 16, z0: 9, x1: 16, y1: 18, z1: 10, color: "balconyIron" },
        // Steep pitched slate roof + central cross-gable dormer & twin stone chimneys
        { op: "roofGable", x0: -16, yBase: 21, z0: -10, x1: 16, z1: 9, rise: 8, axis: "x", color: "roofSlate", trim: "roofTrim" },
        { op: "roofGable", x0: -6, yBase: 21, z0: -9, x1: 6, z1: 10, rise: 8, axis: "z", color: "roofSlate", trim: "roofTrim" },
        { op: "box", x0: 11, y0: 21, z0: -6, x1: 14, y1: 31, z1: -3, color: "granite", mirrorX: true },
        // Welcoming +Z lobby porte-cochere awning & glowing arched doors
        { op: "box", x0: -6, y0: 0, z0: 9, x1: 6, y1: 1, z1: 13, color: "granite" },
        { op: "box", x0: -6, y0: 6, z0: 8, x1: 6, y1: 8, z1: 13, color: "awningCoral" },
        { op: "pillars", x0: -5, y0: 1, z0: 9, x1: 5, y1: 6, z1: 12, color: "timber" },
        { op: "arch", cx: 0, y0: 1, cz: 8, halfSpan: 3, height: 6, depth: 2, axis: "z", color: "windowGold" },
        // Warm illuminated guest room windows
        { op: "windowRow", wall: "+z", y: 4, start: -12, end: -7, every: 4, width: 2, height: 4, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowGold", emit: 0.7 },
        { op: "windowRow", wall: "+z", y: 4, start: 7, end: 12, every: 4, width: 2, height: 4, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowGold", emit: 0.7 },
        { op: "windowRow", wall: "+z", y: 11, start: -12, end: 12, every: 4, width: 2, height: 3, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowGold", emit: 0.65 },
        { op: "windowRow", wall: "+z", y: 17, start: -12, end: 12, every: 4, width: 2, height: 3, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowGold", emit: 0.65 },
        { op: "windowRow", wall: "-z", y: 11, start: -12, end: 12, every: 4, width: 2, height: 3, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowGold", emit: 0.55 },
        { op: "box", x0: 7, y0: 1, z0: 9, x1: 13, y1: 3, z1: 11, color: "flowerBox", mirrorX: true },
      ],
      parts: [],
    },
    "日长石大饭店",
  );
}

function buildMaritimeMuseumBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "海港海事与安全陈列馆",
      description:
        "配备屋顶航标灯塔的海岸航海文化博物馆暨海上救援瞭望台。",
      category: "building",
      scaleClass: "large",
      palette: {
        seaGranite: "#7d858d",
        cedarPlank: "#b87b4b",
        whiteclap: "#f4f6f8",
        navyRoof: "#2c4663",
        brass: "#e8b842",
        beaconAmber: "#ffcf4d",
        glassAqua: "#b5e6f5",
        warmLamp: "#ffe8a3",
        lifeOrange: "#eb6536",
      },
      ops: [
        { op: "box", x0: -15, y0: 0, z0: -10, x1: 15, y1: 3, z1: 10, color: "seaGranite" },
        // Sheltered wrap-front timber veranda with safety railings on +Z
        { op: "box", x0: -14, y0: 3, z0: 7, x1: 14, y1: 5, z1: 10, color: "whiteclap" },
        { op: "pillars", x0: -14, y0: 3, z0: 7, x1: 14, y1: 9, z1: 10, color: "whiteclap" },
        { op: "box", x0: -15, y0: 9, z0: 6, x1: 15, y1: 10, z1: 11, color: "navyRoof" },
        // Main exhibition hall & clerestory monitor
        { op: "roundedBox", x0: -14, y0: 3, z0: -9, x1: 14, y1: 15, z1: 7, radius: 1.0, color: "cedarPlank" },
        { op: "roofGable", x0: -15, yBase: 15, z0: -10, x1: 15, z1: 8, rise: 6, axis: "x", color: "navyRoof", trim: "whiteclap" },
        // Central octagonal-style lookout cupola & brass lantern gallery (Y = 20..28)
        { op: "roundedBox", x0: -4, y0: 20, z0: -4, x1: 4, y1: 26, z1: 4, radius: 1.4, color: "whiteclap" },
        { op: "box", x0: -5, y0: 25, z0: -5, x1: 5, y1: 27, z1: 5, color: "brass" },
        { op: "roofPyramid", x0: -5, yBase: 27, z0: -5, x1: 5, z1: 5, color: "navyRoof", trim: "whiteclap" },
        // Entrance arch & mounted orange safety life-rings flanking doorway
        { op: "arch", cx: 0, y0: 3, cz: 7, halfSpan: 3, height: 6, depth: 2, axis: "z", color: "warmLamp" },
        { op: "ring", axis: "z", cx: 6, cy: 6, z0: 7, z1: 8, outerR: 1.6, innerR: 0.8, color: "lifeOrange", mirrorX: true },
        { op: "windowRow", wall: "+z", y: 11, start: -10, end: 10, every: 4, width: 2, height: 3, bounds: { x0: -14, z0: -9, x1: 14, z1: 7 }, color: "glassAqua", emit: 0.5 },
        { op: "windowRow", wall: "-z", y: 6, start: -10, end: 10, every: 4, width: 2, height: 5, bounds: { x0: -14, z0: -9, x1: 14, z1: 7 }, color: "glassAqua", emit: 0.45 },
      ],
      parts: [
        {
          name: "coastal-safety-beacon",
          kind: "spinY",
          speed: 1.25,
          pivot: [0, 34.5, 0],
          ops: [
            { op: "box", x0: -1.5, y0: 0, z0: -0.6, x1: 1.5, y1: 1.2, z1: 0.6, color: "beaconAmber", emit: 1.35 },
          ],
        },
      ],
    },
    "海港海事与安全陈列馆",
  );
}

function buildPublicLibraryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "草溪中央图书馆",
      description:
        "拥有高挑拱窗、宽敞石阶与宁静阅览长廊的红砖石灰岩公共图书馆。",
      category: "building",
      scaleClass: "large",
      palette: {
        limestone: "#dfd6c5",
        limestoneDark: "#bfb39e",
        brickWarm: "#b5523c",
        copperRoof: "#438f7c",
        trimCream: "#f7f2e7",
        windowAmber: "#ffe49e",
        stainedRose: "#68b5e8",
        brass: "#d9a93d",
      },
      ops: [
        { op: "box", x0: -16, y0: 0, z0: -10, x1: 16, y1: 3, z1: 9, color: "limestoneDark" },
        { op: "roundedBox", x0: -15, y0: 3, z0: -9, x1: 15, y1: 17, z1: 8, radius: 1.0, color: "brickWarm" },
        // Limestone corner quoins & entablature frieze
        { op: "pillars", x0: -15, y0: 3, z0: -9, x1: 15, y1: 17, z1: 8, color: "limestone" },
        { op: "box", x0: -16, y0: 16, z0: -10, x1: 16, y1: 18, z1: 9, color: "limestone" },
        { op: "roofGable", x0: -16, yBase: 18, z0: -10, x1: 16, z1: 9, rise: 7, axis: "x", color: "copperRoof", trim: "trimCream" },
        // +Z Classical colonnade portico, wide steps with stone safety cheek-walls, & rose window
        { op: "box", x0: -7, y0: 0, z0: 9, x1: 7, y1: 3, z1: 13, color: "limestone" },
        { op: "box", x0: 6, y0: 3, z0: 9, x1: 7, y1: 5, z1: 13, color: "limestoneDark", mirrorX: true },
        { op: "pillars", x0: -6, y0: 3, z0: 9, x1: 6, y1: 15, z1: 12, color: "trimCream" },
        { op: "roofGable", x0: -7, yBase: 15, z0: 8, x1: 7, z1: 13, rise: 5, axis: "z", color: "copperRoof", trim: "trimCream" },
        { op: "cylinder", axis: "z", cx: 0, cy: 17, z0: 12, z1: 13, radius: 1.8, color: "stainedRose", emit: 0.65 },
        { op: "arch", cx: 0, y0: 3, cz: 8, halfSpan: 3, height: 7, depth: 2, axis: "z", color: "windowAmber" },
        // Tall reading-room windows
        { op: "windowRow", wall: "+z", y: 6, start: -12, end: -8, every: 4, width: 2, height: 7, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowAmber", emit: 0.7 },
        { op: "windowRow", wall: "+z", y: 6, start: 8, end: 12, every: 4, width: 2, height: 7, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowAmber", emit: 0.7 },
        { op: "windowRow", wall: "-z", y: 6, start: -12, end: 12, every: 4, width: 2, height: 7, bounds: { x0: -15, z0: -9, x1: 15, z1: 8 }, color: "windowAmber", emit: 0.6 },
      ],
      parts: [],
    },
    "草溪中央图书馆",
  );
}

function buildSafetyEngineeringAcademyBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "矿山安全与地质学院",
      description:
        "紧邻东北植物园、负责传授土木工程与结构安全知识的专业学院。",
      category: "building",
      scaleClass: "large",
      palette: {
        sandstone: "#d8c7ad",
        slateDark: "#3e4954",
        terracotta: "#c46d45",
        trimLight: "#f4efe4",
        skylight: "#a8e0f0",
        warmHall: "#ffe49c",
        brass: "#dfb041",
        hedge: "#4a9c47",
      },
      ops: [
        // Twin skylit drafting wings + central arched hall flush at Y = 0
        { op: "box", x0: -16, y0: 0, z0: -9, x1: 16, y1: 2, z1: 9, color: "slateDark" },
        { op: "roundedBox", x0: -16, y0: 2, z0: -8, x1: -6, y1: 15, z1: 8, radius: 1.0, color: "sandstone", mirrorX: true },
        { op: "roundedBox", x0: -7, y0: 2, z0: -9, x1: 7, y1: 18, z1: 7, radius: 1.0, color: "trimLight" },
        // Pitched slate wing roofs with glass skylights & central bell/weather tower
        { op: "roofGable", x0: 6, yBase: 15, z0: -9, x1: 16, z1: 9, rise: 5, axis: "z", color: "slateDark", trim: "trimLight", mirrorX: true },
        { op: "box", x0: 9, y0: 18, z0: -5, x1: 13, y1: 20, z1: 5, color: "skylight", emit: 0.5, mirrorX: true },
        { op: "roofPyramid", x0: -7, yBase: 18, z0: -9, x1: 7, z1: 7, color: "terracotta", trim: "trimLight" },
        { op: "cylinder", axis: "y", cx: 0, y0: 23, y1: 27, cz: -1, radius: 1.2, color: "brass" },
        // +Z Courtyard archway & safety railing planters
        { op: "box", x0: -6, y0: 0, z0: 7, x1: 6, y1: 2, z1: 11, color: "sandstone" },
        { op: "arch", cx: 0, y0: 2, cz: 7, halfSpan: 3, height: 7, depth: 2, axis: "z", color: "warmHall" },
        { op: "box", x0: 7, y0: 2, z0: 8, x1: 14, y1: 4, z1: 10, color: "hedge", mirrorX: true },
        { op: "windowRow", wall: "+z", y: 6, start: -14, end: -8, every: 3, width: 2, height: 5, bounds: { x0: -16, z0: -8, x1: 16, z1: 8 }, color: "warmHall", emit: 0.6 },
        { op: "windowRow", wall: "+z", y: 6, start: 8, end: 14, every: 3, width: 2, height: 5, bounds: { x0: -16, z0: -8, x1: 16, z1: 8 }, color: "warmHall", emit: 0.6 },
      ],
      parts: [
        {
          name: "rooftop-anemometer",
          kind: "spinY",
          speed: 1.4,
          pivot: [0, 29.5, -1],
          ops: [
            { op: "box", x0: -2.2, y0: 0, z0: -0.4, x1: 2.2, y1: 0.6, z1: 0.4, color: "brass" },
            { op: "box", x0: -0.4, y0: 0, z0: -2.2, x1: 0.4, y1: 0.6, z1: 2.2, color: "brass" },
          ],
        },
      ],
    },
    "矿山安全与地质学院",
  );
}

function buildConcertSymphonyHallBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "松风交响音乐厅",
      description:
        "带有优雅铜制声学屋顶与明亮前厅的雪松木石灰岩音乐大厅。",
      category: "building",
      scaleClass: "large",
      palette: {
        limestone: "#e6dfd1",
        stoneDark: "#9b9589",
        cedarWarm: "#a8683c",
        copperBright: "#4ca38f",
        glassFoyer: "#ffe8a6",
        goldTrim: "#ebbd46",
      },
      ops: [
        { op: "roundedBox", x0: -15, y0: 0, z0: -11, x1: 15, y1: 3, z1: 11, radius: 1.5, color: "stoneDark" },
        // Acoustic cedar auditorium & glass +Z grand foyer
        { op: "roundedBox", x0: -13, y0: 3, z0: -10, x1: 13, y1: 15, z1: 5, radius: 2.0, color: "cedarWarm" },
        { op: "roundedBox", x0: -11, y0: 3, z0: 4, x1: 11, y1: 12, z1: 10, radius: 1.5, color: "glassFoyer", emit: 0.68 },
        { op: "pillars", x0: -11, y0: 3, z0: 4, x1: 11, y1: 12, z1: 10, color: "limestone" },
        // Tiered sweeping copper acoustic shells overhead
        { op: "cylinder", axis: "x", x0: -14, x1: 14, cy: 14, cz: -4, radius: 7.5, color: "copperBright" },
        { op: "cylinder", axis: "x", x0: -12, x1: 12, cy: 12, cz: 3, radius: 5.5, color: "copperBright" },
        { op: "box", x0: -12, y0: 12, z0: 8, x1: 12, y1: 13, z1: 11, color: "limestone" },
        // Golden lyre emblem & wide +Z entrance arch
        { op: "ring", axis: "z", cx: 0, cy: 15, z0: 8, z1: 9, outerR: 2.2, innerR: 1.1, color: "goldTrim", emit: 0.6 },
        { op: "arch", cx: 0, y0: 3, cz: 9, halfSpan: 3, height: 6, depth: 2, axis: "z", color: "limestone" },
      ],
      parts: [],
    },
    "松风交响音乐厅",
  );
}

function buildHerbalApothecaryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "柳溪草本药铺",
      description:
        "设有无障碍门廊、为街坊调配草本花茶、绷带与传统药剂的社区药坊。",
      category: "building",
      scaleClass: "medium",
      palette: {
        stone: "#9c968c",
        stucco: "#f7f1e3",
        sageRoof: "#588f6b",
        timber: "#7d5130",
        emerald: "#2fa66a",
        windowWarm: "#ffe49c",
        herbGreen: "#4da349",
        lavender: "#9d74db",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "stone" },
        { op: "roundedBox", x0: -9, y0: 2, z0: -7, x1: 9, y1: 11, z1: 6, radius: 1.0, color: "stucco" },
        { op: "roofGable", x0: -10, yBase: 11, z0: -8, x1: 10, z1: 7, rise: 6, axis: "z", color: "sageRoof", trim: "timber" },
        // Sheltered +Z porch & green cross gable emblem
        { op: "box", x0: -6, y0: 0, z0: 6, x1: 6, y1: 2, z1: 10, color: "stone" },
        { op: "pillars", x0: -5, y0: 2, z0: 6, x1: 5, y1: 8, z1: 9, color: "timber" },
        { op: "box", x0: -6, y0: 8, z0: 6, x1: 6, y1: 9, z1: 10, color: "sageRoof" },
        { op: "arch", cx: 0, y0: 2, cz: 6, halfSpan: 2, height: 5, depth: 1, axis: "z", color: "windowWarm" },
        { op: "box", x0: -1, y0: 12, z0: 6, x1: 1, y1: 15, z1: 7, color: "emerald", emit: 0.65 },
        { op: "box", x0: -2, y0: 13, z0: 6, x1: 2, y1: 14, z1: 7, color: "emerald", emit: 0.65 },
        // Herb planter boxes
        { op: "box", x0: 6, y0: 2, z0: 6, x1: 9, y1: 4, z1: 8, color: "herbGreen", mirrorX: true },
        { op: "box", x0: 6, y0: 4, z0: 6, x1: 9, y1: 5, z1: 8, color: "lavender", mirrorX: true },
      ],
      parts: [],
    },
    "柳溪草本药铺",
  );
}

function buildCopperKettleBakeryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "铜壶匠心面包茶屋",
      description:
        "每日新鲜出炉酵母面包与肉桂甜点的半木结构社区面包茶坊。",
      category: "building",
      scaleClass: "medium",
      palette: {
        brickOven: "#b34d38",
        creamPlaster: "#faefd9",
        oakBeam: "#6e4427",
        shingleBrown: "#8c5432",
        coralAwning: "#e06348",
        creamStripe: "#fff9ec",
        warmDisplay: "#ffe291",
        copper: "#d47c42",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "brickOven" },
        { op: "box", x0: -9, y0: 2, z0: -7, x1: 9, y1: 12, z1: 7, color: "creamPlaster" },
        { op: "pillars", x0: -9, y0: 2, z0: -7, x1: 9, y1: 12, z1: 7, color: "oakBeam" },
        { op: "roofGable", x0: -10, yBase: 12, z0: -8, x1: 10, z1: 8, rise: 6, axis: "x", color: "shingleBrown", trim: "oakBeam" },
        // Tall brick hearth chimney on +X
        { op: "box", x0: 7, y0: 2, z0: -4, x1: 11, y1: 20, z1: 0, color: "brickOven" },
        // Striped +Z bakery awning & glowing pastry window
        { op: "box", x0: -8, y0: 7, z0: 7, x1: 8, y1: 9, z1: 10, color: "coralAwning" },
        { op: "box", x0: -5, y0: 7, z0: 7, x1: -2, y1: 9, z1: 10, color: "creamStripe", mirrorX: true },
        { op: "box", x0: -7, y0: 3, z0: 6, x1: -2, y1: 7, z1: 8, color: "warmDisplay", emit: 0.75, mirrorX: true },
        { op: "arch", cx: 0, y0: 2, cz: 7, halfSpan: 2, height: 5, depth: 1, axis: "z", color: "oakBeam" },
        // Hanging copper kettle emblem above entrance
        { op: "sphere", cx: 0, cy: 10.5, cz: 8.5, rx: 1.4, ry: 1.2, rz: 1.4, color: "copper" },
      ],
      parts: [],
    },
    "铜壶匠心面包茶屋",
  );
}

function buildPotteryKilnStudioBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "苜蓿田制陶窑工坊",
      description:
        "配备经典砖砌瓶形陶窑、烧制手工釉面陶器的陶土砖瓦工作坊。",
      category: "building",
      scaleClass: "medium",
      palette: {
        stone: "#9c9488",
        ochreWall: "#ebd5b3",
        kilnBrick: "#ad4d36",
        tileRoof: "#c9663e",
        timber: "#784c2c",
        cobaltVase: "#3d82c4",
        tealVase: "#3da69c",
        windowGlow: "#ffe39a",
      },
      ops: [
        { op: "box", x0: -11, y0: 0, z0: -8, x1: 11, y1: 2, z1: 8, color: "stone" },
        { op: "roundedBox", x0: -10, y0: 2, z0: -7, x1: 5, y1: 11, z1: 7, radius: 1.0, color: "ochreWall" },
        { op: "roofGable", x0: -11, yBase: 11, z0: -8, x1: 6, z1: 8, rise: 5, axis: "x", color: "tileRoof", trim: "timber" },
        // Iconic round brick bottle-kiln anchored on +X side (Y = 0..20)
        { op: "cylinder", axis: "y", cx: 7.5, y0: 0, y1: 9, cz: -1, radius: 4.2, color: "kilnBrick" },
        { op: "cone", cx: 7.5, y0: 9, y1: 19, cz: -1, rBottom: 4.2, rTop: 1.5, color: "kilnBrick" },
        { op: "ring", axis: "y", cx: 7.5, y0: 18, y1: 20, cz: -1, outerR: 1.9, innerR: 0.9, color: "stone" },
        // +Z Workshop veranda & colorful ceramic vase display shelf
        { op: "arch", cx: -2, y0: 2, cz: 7, halfSpan: 2, height: 5, depth: 1, axis: "z", color: "windowGlow" },
        { op: "box", x0: -9, y0: 2, z0: 7, x1: -5, y1: 4, z1: 9, color: "timber" },
        { op: "cylinder", axis: "y", cx: -8, y0: 4, y1: 6, cz: 8, radius: 0.8, color: "cobaltVase" },
        { op: "cylinder", axis: "y", cx: -6, y0: 4, y1: 6, cz: 8, radius: 0.8, color: "tealVase" },
      ],
      parts: [],
    },
    "苜蓿田制陶窑工坊",
  );
}

function buildAlpineRescueLodgeBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "北风草甸护林站",
      description:
        "保障步道安全并为徒步游客提供温暖庇护的云杉花岗岩护林木屋。",
      category: "building",
      scaleClass: "medium",
      palette: {
        granite: "#7d8287",
        spruceLog: "#8a5832",
        pineRoof: "#2f5e45",
        trimGold: "#e6b84c",
        hearthGlow: "#ffdd87",
        lantern: "#fff0a6",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 3, z1: 9, color: "granite" },
        { op: "roundedBox", x0: -9, y0: 3, z0: -7, x1: 9, y1: 11, z1: 6, radius: 1.0, color: "spruceLog" },
        { op: "roofGable", x0: -10, yBase: 11, z0: -8, x1: 10, z1: 7, rise: 7, axis: "z", color: "pineRoof", trim: "trimGold" },
        // +Z Timber safety-railed porch & stone chimney
        { op: "pillars", x0: -8, y0: 3, z0: 6, x1: 8, y1: 9, z1: 9, color: "spruceLog" },
        { op: "box", x0: -9, y0: 3, z0: 8, x1: -3, y1: 5, z1: 9, color: "trimGold", mirrorX: true },
        { op: "box", x0: -9, y0: 9, z0: 6, x1: 9, y1: 10, z1: 10, color: "pineRoof" },
        { op: "box", x0: -10, y0: 3, z0: -4, x1: -8, y1: 19, z1: 0, color: "granite" },
        { op: "arch", cx: 0, y0: 3, cz: 6, halfSpan: 2, height: 5, depth: 1, axis: "z", color: "hearthGlow" },
        { op: "sphere", cx: 0, cy: 14, cz: 7.5, rx: 1.2, ry: 1.2, rz: 0.8, color: "lantern", emit: 1.1 },
      ],
      parts: [],
    },
    "北风草甸护林站",
  );
}

function buildClockworkToyshopBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "银溪发条玩具店",
      description:
        "精心打造木质小火车、八音盒与发条人偶的尖顶社区玩具工坊。",
      category: "building",
      scaleClass: "medium",
      palette: {
        stone: "#b5afa4",
        mintWall: "#cbe8dc",
        berryRoof: "#a8445b",
        creamTrim: "#fcf6e8",
        brass: "#e6b63e",
        pinwheelCyan: "#4ec4e6",
        pinwheelGold: "#ffcf4a",
        windowGlow: "#ffe69e",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "stone" },
        { op: "roundedBox", x0: -9, y0: 2, z0: -7, x1: 6, y1: 12, z1: 7, radius: 1.0, color: "mintWall" },
        { op: "roofGable", x0: -10, yBase: 12, z0: -8, x1: 7, z1: 8, rise: 6, axis: "z", color: "berryRoof", trim: "creamTrim" },
        // Storybook corner turret on +X/+Z with conical roof (Y = 0..22)
        { op: "cylinder", axis: "y", cx: 7, y0: 0, y1: 15, cz: 5, radius: 3.4, color: "mintWall" },
        { op: "cone", cx: 7, y0: 15, y1: 22, cz: 5, rBottom: 4.0, rTop: 0.5, color: "berryRoof" },
        // Bay display window & +Z shop doorway
        { op: "box", x0: -7, y0: 3, z0: 7, x1: -2, y1: 8, z1: 9, color: "windowGlow", emit: 0.75 },
        { op: "arch", cx: 2, y0: 2, cz: 7, halfSpan: 2, height: 5, depth: 1, axis: "z", color: "creamTrim" },
        { op: "ring", axis: "z", cx: -1, cy: 14, z0: 7, z1: 8, outerR: 1.8, innerR: 0.9, color: "brass" },
      ],
      parts: [
        {
          name: "turret-pinwheel",
          kind: "spinY",
          speed: 1.5,
          pivot: [7, 24.5, 5],
          ops: [
            { op: "box", x0: -2.0, y0: 0, z0: -0.4, x1: 2.0, y1: 0.6, z1: 0.4, color: "pinwheelCyan", emit: 0.4 },
            { op: "box", x0: -0.4, y0: 0, z0: -2.0, x1: 0.4, y1: 0.6, z1: 2.0, color: "pinwheelGold", emit: 0.4 },
          ],
        },
      ],
    },
    "银溪发条玩具店",
  );
}

function buildCitrusOrangerieBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "阳光柑橘温室花房",
      description:
        "在室内柑橘树荫下供应现榨鲜橙汁的石灰岩玻璃花园餐厅。",
      category: "building",
      scaleClass: "medium",
      palette: {
        limestone: "#e8dec9",
        stoneBase: "#bfb49f",
        ironGreen: "#356e59",
        glassSun: "#c2edf5",
        citrusLeaf: "#439946",
        orangeFruit: "#f58d2c",
        warmGlow: "#ffe9a8",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 9, color: "stoneBase" },
        { op: "roundedBox", x0: -9, y0: 2, z0: -7, x1: 9, y1: 11, z1: 7, radius: 1.0, color: "glassSun", emit: 0.4 },
        { op: "pillars", x0: -9, y0: 2, z0: -7, x1: 9, y1: 11, z1: 7, color: "limestone" },
        { op: "box", x0: -10, y0: 11, z0: -8, x1: 10, y1: 12, z1: 8, color: "limestone" },
        { op: "roofPyramid", x0: -9, yBase: 12, z0: -7, x1: 9, z1: 7, color: "glassSun", trim: "ironGreen" },
        // Indoor citrus trees visible inside & flanking +Z entrance terrace
        { op: "arch", cx: 0, y0: 2, cz: 7, halfSpan: 3, height: 6, depth: 1, axis: "z", color: "limestone" },
        { op: "sphere", cx: 6, cy: 5, cz: 8, rx: 1.8, ry: 2.0, rz: 1.8, color: "citrusLeaf", mirrorX: true },
        { op: "sphere", cx: 6, cy: 6, cz: 9, rx: 0.7, ry: 0.7, rz: 0.7, color: "orangeFruit", emit: 0.5, mirrorX: true },
      ],
      parts: [],
    },
    "阳光柑橘温室花房",
  );
}

function buildLifeguardSupplyDepotBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "草坪救生与安全物资站",
      description:
        "储备路灯灯笼、急救箱与水上救援装备的洁白社区安全服务站。",
      category: "building",
      scaleClass: "medium",
      palette: {
        stone: "#9aa1a8",
        whiteBoard: "#f6f8fa",
        navyRoof: "#2c4c70",
        rescueOrange: "#ee6435",
        brassLamp: "#ffd970",
        glass: "#bce6f5",
      },
      ops: [
        { op: "box", x0: -10, y0: 0, z0: -8, x1: 10, y1: 2, z1: 8, color: "stone" },
        { op: "roundedBox", x0: -9, y0: 2, z0: -7, x1: 9, y1: 11, z1: 7, radius: 1.0, color: "whiteBoard" },
        { op: "roofGable", x0: -10, yBase: 11, z0: -8, x1: 10, z1: 8, rise: 5, axis: "z", color: "navyRoof", trim: "whiteBoard" },
        // Wide equipment bay arch on +Z & orange safety life-buoy emblem
        { op: "arch", cx: 0, y0: 2, cz: 7, halfSpan: 3, height: 6, depth: 1, axis: "z", color: "rescueOrange" },
        { op: "ring", axis: "z", cx: 0, cy: 13, z0: 7, z1: 8, outerR: 1.7, innerR: 0.8, color: "rescueOrange" },
        { op: "box", x0: 5, y0: 6, z0: 7, x1: 6, y1: 8, z1: 8, color: "brassLamp", emit: 1.1, mirrorX: true },
        { op: "windowRow", wall: "-z", y: 5, start: -6, end: 6, every: 4, width: 2, height: 3, bounds: { x0: -9, z0: -7, x1: 9, z1: 7 }, color: "glass", emit: 0.45 },
      ],
      parts: [],
    },
    "草坪救生与安全物资站",
  );
}

function buildHoneyPreserveCreameryBlueprint(): VoxelBlueprint {
  return normalizeAndGroundBlueprint(
    {
      name: "金巢蜜意冰淇淋屋",
      description:
        "现场搅拌野花蜂蜜冰淇淋与熬制浆果酱的八角形琥珀屋顶甜品小屋。",
      category: "building",
      scaleClass: "medium",
      palette: {
        stone: "#ada393",
        creamWall: "#fdf3dc",
        amberRoof: "#d9922b",
        honeyGold: "#f7c242",
        timber: "#82532f",
        lavender: "#9c73db",
        windowGlow: "#ffe699",
      },
      ops: [
        { op: "cylinder", axis: "y", cx: 0, y0: 0, y1: 2, cz: 0, radius: 10.2, color: "stone" },
        // Wrap-around porch safety rail & central cottage drum
        { op: "ring", axis: "y", cx: 0, y0: 2, y1: 4, cz: 0, outerR: 10.0, innerR: 9.0, color: "timber" },
        { op: "clear", x0: -3, y0: 2, z0: 7, x1: 3, y1: 5, z1: 11 },
        { op: "cylinder", axis: "y", cx: 0, y0: 2, y1: 11, cz: 0, radius: 7.8, color: "creamWall" },
        { op: "cone", cx: 0, y0: 11, y1: 18, cz: 0, rBottom: 9.5, rTop: 1.2, color: "amberRoof" },
        { op: "sphere", cx: 0, cy: 18.8, cz: 0, rx: 1.4, ry: 1.6, rz: 1.4, color: "honeyGold", emit: 0.6 },
        // +Z Tasting window & lavender planters
        { op: "arch", cx: 0, y0: 2, cz: 7, halfSpan: 2, height: 5, depth: 2, axis: "z", color: "windowGlow" },
        { op: "box", x0: 4, y0: 2, z0: 8, x1: 7, y1: 4, z1: 10, color: "lavender", mirrorX: true },
      ],
      parts: [],
    },
    "金巢蜜意冰淇淋屋",
  );
}

export const SAFE_COMMUNITY_BUILDING_SPECS: SafeBuildingPlacementSpec[] = [
  // 7 Large Civic & Community Safety Landmarks
  {
    id: "c-safe-bld-01",
    x: -24.0,
    z: -98.5,
    yaw: 0,
    spurKind: "cobblestone",
    spurPoints: [
      [-24.0, -90.5],
      [-23.9, -86.8],
    ],
    creatorPrompt: "一座温馨的三层社区医院与健康休养馆",
    activity: "在阳光病房中悉心照料小镇居民康复",
    statusLine: "服务北部片区的市政医院与健康护理中心",
    buildBlueprint: buildHospitalWellnessBlueprint,
  },
  {
    id: "c-safe-bld-02",
    x: 85.0,
    z: -50.5,
    yaw: -0.785,
    spurKind: "cobblestone",
    spurPoints: [
      [79.5, -45.2],
      [77.0, -42.8],
    ],
    creatorPrompt: "砂岩材质的铜顶天文馆与星象观象台",
    activity: "转动黄铜星盘与望远镜追踪璀璨星座",
    statusLine: "东环路旁的公共天文馆与星象观测台",
    buildBlueprint: buildPlanetariumObservatoryBlueprint,
  },
  {
    id: "c-safe-bld-03",
    x: 43.5,
    z: 45.0,
    yaw: 0,
    spurKind: "cobblestone",
    spurPoints: [
      [43.6, 52.2],
      [43.7, 56.2],
    ],
    creatorPrompt: "带有安全观景阳台的三层高山草甸大饭店",
    activity: "在温暖的门廊灯笼下热情迎接八方来客",
    statusLine: "东南环路上接待海岛旅人的三层度假酒店",
    buildBlueprint: buildGrandPavilionHotelBlueprint,
  },
  {
    id: "c-safe-bld-04",
    x: -29.0,
    z: 88.0,
    yaw: 3.142,
    spurKind: "cobblestone",
    spurPoints: [
      [-29.0, 80.5],
      [-28.9, 76.8],
    ],
    creatorPrompt: "海滨航海文化陈列馆与救援瞭望塔",
    activity: "点亮琥珀色海岸航标灯照亮南部海域",
    statusLine: "守望南部海岸线的海事陈列馆与安全灯塔",
    buildBlueprint: buildMaritimeMuseumBlueprint,
  },
  {
    id: "c-safe-bld-05",
    x: -86.0,
    z: 42.0,
    yaw: 2.356,
    spurKind: "cobblestone",
    spurPoints: [
      [-80.6, 36.6],
      [-78.2, 34.2],
    ],
    creatorPrompt: "拥有拱形采光阅读窗的红砖石灰岩公共图书馆",
    activity: "在洒满阳光的阅览室举办安静阅读分享会",
    statusLine: "西南环路旁的公共阅览大厅与社区图书馆",
    buildBlueprint: buildPublicLibraryBlueprint,
  },
  {
    id: "c-safe-bld-06",
    x: 134.0,
    z: -94.0,
    yaw: -1.571,
    spurKind: "cobblestone",
    spurPoints: [
      [126.5, -94.0],
      [119.4, -94.1],
    ],
    creatorPrompt: "矿区路旁的工程与结构安全地质学院",
    activity: "监测草甸风速并传授安全建筑工艺",
    statusLine: "植物园对面的结构安全与地质学院",
    buildBlueprint: buildSafetyEngineeringAcademyBlueprint,
  },
  {
    id: "c-safe-bld-07",
    x: -92.5,
    z: -58.5,
    yaw: 0.785,
    spurKind: "cobblestone",
    spurPoints: [
      [-86.8, -52.8],
      [-80.2, -46.2],
    ],
    creatorPrompt: "雪松木与紫铜声学屋顶的交响音乐厅",
    activity: "在铜制声学穹顶下奏响悠扬的夜间室内乐",
    statusLine: "西北环线旁的声学交响音乐厅",
    buildBlueprint: buildConcertSymphonyHallBlueprint,
  },

  // 8 Medium Neighborhood Craft, Food & Wellness Buildings
  {
    id: "c-safe-bld-08",
    x: 30.5,
    z: -45.5,
    yaw: -1.571,
    spurKind: "cobblestone",
    spurPoints: [
      [25.2, -45.5],
      [20.8, -45.5],
    ],
    creatorPrompt: "温馨的草本药铺与社区健康诊所",
    activity: "冲泡洋甘菊花茶并打理窗台薰衣草花箱",
    statusLine: "邻里草本药铺与健康小诊所",
    buildBlueprint: buildHerbalApothecaryBlueprint,
  },
  {
    id: "c-safe-bld-09",
    x: 90.5,
    z: 3.0,
    yaw: -1.571,
    spurKind: "cobblestone",
    spurPoints: [
      [85.2, 3.0],
      [81.6, 2.9],
    ],
    creatorPrompt: "半木结构的手工酸面包坊与茶室",
    activity: "烘焙外脆里软的酸面包并斟满温暖下午茶",
    statusLine: "东环路上的半木结构面包坊与茶室",
    buildBlueprint: buildCopperKettleBakeryBlueprint,
  },
  {
    id: "c-safe-bld-10",
    x: -99.0,
    z: -9.0,
    yaw: 2.356,
    spurKind: "cottage_road",
    spurPoints: [
      [-95.0, -13.0],
      [-92.6, -15.5],
    ],
    creatorPrompt: "带砖砌瓶形窑炉的红瓦制陶工坊",
    activity: "在砖砌瓶窑中烧制钴蓝与青瓷陶瓶",
    statusLine: "西区乡道旁的陶瓷工坊与制陶窑",
    buildBlueprint: buildPotteryKilnStudioBlueprint,
  },
  {
    id: "c-safe-bld-11",
    x: 55.0,
    z: -79.5,
    yaw: -0.785,
    spurKind: "cobblestone",
    spurPoints: [
      [51.2, -75.6],
      [48.6, -73.0],
    ],
    creatorPrompt: "云杉与花岗岩修建的公园护林安全木屋",
    activity: "点亮林间步道提灯并指引徒步者平安归来",
    statusLine: "东北外环路旁的公园护林安全木屋",
    buildBlueprint: buildAlpineRescueLodgeBlueprint,
  },
  {
    id: "c-safe-bld-12",
    x: -42.5,
    z: 25.0,
    yaw: 3.142,
    spurKind: "cottage_road",
    spurPoints: [
      [-42.5, 19.6],
      [-42.4, 12.4],
    ],
    creatorPrompt: "屋顶风车不停旋转的粉彩发条玩具店",
    activity: "在屋顶风车转动下制作精巧的手工木制玩具",
    statusLine: "西南小路旁的邻里发条玩具店",
    buildBlueprint: buildClockworkToyshopBlueprint,
  },
  {
    id: "c-safe-bld-13",
    x: 76.0,
    z: 62.5,
    yaw: -2.356,
    spurKind: "cobblestone",
    spurPoints: [
      [72.2, 58.7],
      [69.6, 56.2],
    ],
    creatorPrompt: "阳光通透的石灰岩玻璃柑橘温室咖啡馆",
    activity: "在室内柑橘树荫下现榨清甜橙汁",
    statusLine: "东南环路上的阳光玻璃柑橘花房",
    buildBlueprint: buildCitrusOrangerieBlueprint,
  },
  {
    id: "c-safe-bld-14",
    x: 54.0,
    z: 3.5,
    yaw: -3.142,
    spurKind: "cobblestone",
    spurPoints: [
      [54.0, -1.8],
      [54.0, -5.4],
    ],
    creatorPrompt: "洁白清新的社区水上救生与提灯安全物资站",
    activity: "保养救生圈、急救包与步道黄铜提灯",
    statusLine: "东城区社区安全与提灯物资补给站",
    buildBlueprint: buildLifeguardSupplyDepotBlueprint,
  },
  {
    id: "c-safe-bld-15",
    x: -60.0,
    z: 69.0,
    yaw: 2.356,
    spurKind: "cobblestone",
    spurPoints: [
      [-56.2, 65.2],
      [-53.6, 62.6],
    ],
    creatorPrompt: "八角形琥珀瓦顶的野花蜂蜜与浆果冰淇淋店",
    activity: "现制野花蜂蜜冰淇淋并灌装香甜浆果酱",
    statusLine: "西南区八角形蜂蜜冰淇淋与果酱小屋",
    buildBlueprint: buildHoneyPreserveCreameryBlueprint,
  },
];

export function ensureSafeCommunityBuildings(state: {
  creations: WorldCreation[];
  paths: WorldPath[];
}): boolean {
  let changed = false;

  for (let i = 0; i < SAFE_COMMUNITY_BUILDING_SPECS.length; i++) {
    const spec = SAFE_COMMUNITY_BUILDING_SPECS[i];
    const existing = state.creations.find((c) => c.id === spec.id);
    if (!existing) {
      const bp = spec.buildBlueprint();
      state.creations.push({
        id: spec.id,
        name: bp.name,
        description: bp.description,
        creatorPrompt: spec.creatorPrompt,
        category: "building",
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
        createdAt: 1794434000000 + i * 1000,
        isSeed: false,
      });
      changed = true;
    }

    const spurId = `spur-${spec.id}`;
    if (!state.paths.some((p) => p.id === spurId)) {
      state.paths.push({
        id: spurId,
        kind: spec.spurKind,
        points: spec.spurPoints.map(([px, pz]) => [px, pz]),
      });
      changed = true;
    }
  }

  return changed;
}
