import type { VoxelBlueprint, WorldCreation } from "./types";
import { normalizeAndGroundBlueprint } from "./voxel_dsl";

export function isRacecourseCreation(creation: Pick<WorldCreation, "id" | "name" | "creatorPrompt">): boolean {
  if (creation.id === "c-mwvo0nnd-bb15de") return true;
  const text = `${creation.name || ""} ${creation.creatorPrompt || ""}`;
  return /赛马场|跑马场|racecourse|racetrack/i.test(text);
}

export function buildRectangularRacecourseBlueprint(): VoxelBlueprint {
  const raw: Record<string, unknown> = {
    version: 1,
    name: "青草赛马场",
    description:
      "八卦城西南区域的长方形青草赛马场，环绕沙土跑道配有白色围栏、观赛看台与起跑终点拱门，骏马在内场竞逐飞驰。",
    category: "building",
    scaleClass: "colossal",
    palette: {
      turf: "#4da846",
      turfLight: "#69c657",
      sand: "#d9b478",
      sandCurb: "#c49b5e",
      rail: "#f7f9fb",
      timber: "#7a4c2a",
      roof: "#b83c32",
      gold: "#f2be38",
      cream: "#f4ede0",
      glow: "#ffe28a",
      leaf: "#3f8f3b",
    },
    ops: [
      // Base rectangular turf apron (54 x 30 voxels -> crisp ~1.8:1 rectangle)
      { op: "box", x0: -27, y0: 0, z0: -15, x1: 27, y1: 1, z1: 15, color: "turf" },

      // Rectangular sand/dirt racing track loop at y=1 (non-overlapping 4 strips)
      { op: "box", x0: -24, y0: 1, z0: -11, x1: 24, y1: 2, z1: -4, color: "sand" },
      { op: "box", x0: -24, y0: 1, z0: 4, x1: 24, y1: 2, z1: 11, color: "sand" },
      { op: "box", x0: -24, y0: 1, z0: -4, x1: -16, y1: 2, z1: 4, color: "sand" },
      { op: "box", x0: 16, y0: 1, z0: -4, x1: 24, y1: 2, z1: 4, color: "sand" },

      // Central emerald grass infield at y=1
      { op: "box", x0: -16, y0: 1, z0: -4, x1: 16, y1: 2, z1: 4, color: "turfLight" },

      // Outer white paddock rails along perimeter (y=2)
      { op: "line", x0: -25, y0: 2, z0: -12, x1: 25, y1: 2, z1: -12, color: "rail" },
      { op: "line", x0: -25, y0: 2, z0: 12, x1: 25, y1: 2, z1: 12, color: "rail" },
      { op: "line", x0: -25, y0: 2, z0: -11, x1: -25, y1: 2, z1: 11, color: "rail" },
      { op: "line", x0: 25, y0: 2, z0: -11, x1: 25, y1: 2, z1: 11, color: "rail" },

      // Inner white infield rails (y=2)
      { op: "line", x0: -16, y0: 2, z0: -4, x1: 16, y1: 2, z1: -4, color: "rail" },
      { op: "line", x0: -16, y0: 2, z0: 4, x1: 16, y1: 2, z1: 4, color: "rail" },
      { op: "line", x0: -16, y0: 2, z0: -3, x1: -16, y1: 2, z1: 3, color: "rail" },
      { op: "line", x0: 16, y0: 2, z0: -3, x1: 16, y1: 2, z1: 3, color: "rail" },

      // Inner turf steeplechase hurdles & landscaped corner shrubs
      { op: "box", x0: -8, y0: 2, z0: -1, x1: -7, y1: 3, z1: 2, color: "rail" },
      { op: "box", x0: 7, y0: 2, z0: -1, x1: 8, y1: 3, z1: 2, color: "rail" },
      { op: "box", x0: -1, y0: 2, z0: -1, x1: 1, y1: 3, z1: 1, color: "gold" },
      { op: "sphere", cx: -13, cy: 2.5, cz: 0, rx: 1.4, ry: 1.3, rz: 1.4, color: "leaf", mirrorX: true },

      // North Grandstand (tiered bleachers + timber posts + crimson gable canopy)
      { op: "box", x0: -13, y0: 1, z0: -15, x1: 13, y1: 2, z1: -13, color: "timber" },
      { op: "box", x0: -12, y0: 2, z0: -15, x1: 12, y1: 3, z1: -13, color: "cream" },
      { op: "box", x0: -11, y0: 3, z0: -15, x1: 11, y1: 4, z1: -14, color: "cream" },
      { op: "pillars", x0: -12, y0: 4, z0: -15, x1: 12, y1: 8, z1: -13, color: "timber" },
      {
        op: "roofGable",
        x0: -13,
        yBase: 8,
        z0: -15,
        x1: 13,
        z1: -12,
        rise: 3,
        axis: "x",
        color: "roof",
        trim: "gold",
      },
      // Grandstand warm stadium lanterns & twin roof pennants
      { op: "box", x0: 10, y0: 6, z0: -13, x1: 11, y1: 7, z1: -12, color: "glow", emit: 0.95, mirrorX: true },
      { op: "box", x0: 11, y0: 11, z0: -14, x1: 12, y1: 14, z1: -13, color: "gold", mirrorX: true },

      // Road-Facing Main Entrance Gatehouse (z=13..15, directly facing spur road)
      { op: "box", x0: -4, y0: 1, z0: 13, x1: 4, y1: 2, z1: 15, color: "cream" },
      { op: "box", x0: 4, y0: 1, z0: 13, x1: 6, y1: 3, z1: 15, color: "cream", mirrorX: true },
      { op: "box", x0: 4, y0: 3, z0: 13, x1: 6, y1: 10, z1: 15, color: "timber", mirrorX: true },
      { op: "box", x0: -6, y0: 10, z0: 13, x1: 6, y1: 11, z1: 15, color: "timber" },
      {
        op: "roofGable",
        x0: -7,
        yBase: 11,
        z0: 12,
        x1: 7,
        z1: 15,
        rise: 3,
        axis: "x",
        color: "roof",
        trim: "gold",
      },
      { op: "box", x0: 6, y0: 7, z0: 14, x1: 7, y1: 8, z1: 15, color: "glow", emit: 0.95, mirrorX: true },

      // Track Finish / Starting Gate Arch across the front straight (z=4..11, offset to x=8..10 to keep gate sightline open)
      { op: "box", x0: 8, y0: 2, z0: 3, x1: 10, y1: 8, z1: 4, color: "rail" },
      { op: "box", x0: 8, y0: 2, z0: 11, x1: 10, y1: 8, z1: 12, color: "rail" },
      { op: "box", x0: 8, y0: 8, z0: 3, x1: 10, y1: 9, z1: 12, color: "roof" },
      { op: "box", x0: 8, y0: 9, z0: 6, x1: 10, y1: 10, z1: 9, color: "gold", emit: 0.7 },

      // Corner fence posts for silhouette
      { op: "box", x0: 24, y0: 2, z0: 11, x1: 25, y1: 4, z1: 12, color: "gold", mirrorX: true },
      { op: "box", x0: 24, y0: 2, z0: -12, x1: 25, y1: 4, z1: -11, color: "gold", mirrorX: true },
    ],
    parts: [],
  };

  return normalizeAndGroundBlueprint(raw, "青草赛马场", {
    contextText: "青草赛马场 长方形 跑马场",
  });
}

export function upgradeRacecourseCreationInPlace(creation: WorldCreation): boolean {
  if (!isRacecourseCreation(creation)) return false;
  const fx = creation.blueprint?.stats?.footprintX ?? 0;
  const fz = creation.blueprint?.stats?.footprintZ ?? 0;
  const hasGatehouse = Boolean(
    creation.blueprint?.ops?.some((op) => op.op === "roofGable" && op.z1 === 15),
  );
  const alreadyUpgraded =
    fx >= 48 && fz <= 32 && (creation.blueprint?.parts?.length ?? 0) === 0 && hasGatehouse;
  if (alreadyUpgraded) return false;

  const bp = buildRectangularRacecourseBlueprint();
  creation.name = bp.name;
  creation.description = bp.description;
  creation.scaleClass = bp.scaleClass;
  creation.blueprint = bp;
  creation.behavior = {
    type: "landmark",
    facingYaw: typeof creation.yaw === "number" ? creation.yaw : -3.142,
    activity: "赛马场骏马竞驰",
    statusLine: "八卦城西南长方形青草赛马场，五匹骏马正在跑道上飞驰竞逐。",
  };
  return true;
}
