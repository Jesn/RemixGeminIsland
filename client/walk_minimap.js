import {
  BAGUA_ISLAND_CENTER_X,
  BAGUA_ISLAND_CENTER_Z,
  BAGUA_ISLAND_HALF_EXTENT,
  ISLAND_HALF_EXTENT,
  ISLAND_SUPERELLIPSE_EXP,
  KUNLUN_ISLAND_CENTER_X,
  KUNLUN_ISLAND_CENTER_Z,
  KUNLUN_ISLAND_RADIUS,
  getIslandCoastWarp,
} from "./voxel/meadow_engine.js";
import { TRIGRAMS } from "./voxel/bagua_effects.js";

const ISLAND_META = {
  main: {
    key: "main",
    label: "草坪主岛",
    cx: 0,
    cz: 0,
    halfSpan: 184,
    landFill: "#3d7a47",
    beachStroke: "rgba(234, 211, 156, 0.55)",
    waterBg: "rgba(18, 44, 58, 0.72)",
  },
  bagua: {
    key: "bagua",
    label: "川西八卦城",
    cx: BAGUA_ISLAND_CENTER_X,
    cz: BAGUA_ISLAND_CENTER_Z,
    halfSpan: 256,
    landFill: "#386b4c",
    beachStroke: "rgba(214, 194, 152, 0.55)",
    waterBg: "rgba(15, 36, 48, 0.78)",
  },
  kunlun: {
    key: "kunlun",
    label: "蓬莱雪岛",
    cx: KUNLUN_ISLAND_CENTER_X,
    cz: KUNLUN_ISLAND_CENTER_Z,
    halfSpan: 152,
    landFill: "#5a7c8c",
    beachStroke: "rgba(205, 232, 244, 0.65)",
    waterBg: "rgba(14, 30, 48, 0.78)",
  },
};

function getIslandCoastPolygon(islandKey) {
  const pts = [];
  if (islandKey === "bagua") {
    const R = BAGUA_ISLAND_HALF_EXTENT;
    const K = R * (Math.SQRT2 - 1);
    const cx = BAGUA_ISLAND_CENTER_X;
    const cz = BAGUA_ISLAND_CENTER_Z;
    const verts = [
      [R, -K],
      [R, K],
      [K, R],
      [-K, R],
      [-R, K],
      [-R, -K],
      [-K, -R],
      [K, -R],
    ];
    for (const [dx, dz] of verts) pts.push([cx + dx, cz + dz]);
    return pts;
  }

  if (islandKey === "kunlun") {
    const steps = 84;
    for (let i = 0; i < steps; i++) {
      const th = (i / steps) * Math.PI * 2;
      const r =
        KUNLUN_ISLAND_RADIUS +
        7.4 * Math.cos(3 * th + 0.8) +
        4.8 * Math.sin(5 * th - 0.5);
      pts.push([
        KUNLUN_ISLAND_CENTER_X + Math.cos(th) * r,
        KUNLUN_ISLAND_CENTER_Z + Math.sin(th) * r,
      ]);
    }
    return pts;
  }

  const steps = 96;
  const p = ISLAND_SUPERELLIPSE_EXP;
  for (let i = 0; i < steps; i++) {
    const th = (i / steps) * Math.PI * 2;
    const c = Math.abs(Math.cos(th));
    const s = Math.abs(Math.sin(th));
    const denom = Math.pow(Math.pow(c, p) + Math.pow(s, p), 1 / p) || 1;
    const r = (ISLAND_HALF_EXTENT + getIslandCoastWarp(th)) / denom;
    pts.push([Math.cos(th) * r, Math.sin(th) * r]);
  }
  return pts;
}

function getBiomeFill(biome) {
  switch (biome) {
    case "stone_plaza":
      return "rgba(218, 212, 198, 0.24)";
    case "autumn_grove":
      return "rgba(214, 146, 72, 0.22)";
    case "misty_moss":
      return "rgba(76, 178, 128, 0.22)";
    case "sandy_shore":
      return "rgba(232, 206, 148, 0.26)";
    case "snow_frost":
      return "rgba(225, 242, 255, 0.34)";
    case "volcanic_basalt":
      return "rgba(72, 74, 84, 0.32)";
    default:
      return "rgba(128, 206, 108, 0.16)";
  }
}

export function createWalkMinimapController(containerEl, opts = {}) {
  if (!containerEl) {
    return {
      update() {},
      isExpanded: () => false,
      toggleExpanded() {},
      setExpanded() {},
      destroy() {},
    };
  }

  const { onExpandChange, onWaypointChange, onAutoNavigateToggle } = opts;

  let collapsed = false;
  let expanded = false;
  let rotateWithHeading = false;
  let waypoint = null; // { x, z, label, islandKey, creationId?, arrivalRadius? }
  let lastStaticSig = "";
  let lastRenderAt = 0;
  let hoveredLandmark = null;
  let lastData = null;
  let lastAutoNavigating = false;

  containerEl.innerHTML = "";

  const headerEl = document.createElement("div");
  headerEl.className = "walk-minimap-header";

  const titleGroup = document.createElement("div");
  titleGroup.className = "walk-minimap-title-group";
  const islandBadgeEl = document.createElement("span");
  islandBadgeEl.className = "walk-minimap-badge";
  islandBadgeEl.textContent = "草坪主岛";
  const regionEl = document.createElement("span");
  regionEl.className = "walk-minimap-region";
  regionEl.textContent = "中心区";
  titleGroup.append(islandBadgeEl, regionEl);

  const btnGroup = document.createElement("div");
  btnGroup.className = "walk-minimap-btns";

  const modeBtn = document.createElement("button");
  modeBtn.type = "button";
  modeBtn.className = "walk-minimap-icon-btn";
  modeBtn.textContent = "北↑";
  modeBtn.title = "切换北向固定 / 跟随视角旋转";

  const expandBtn = document.createElement("button");
  expandBtn.type = "button";
  expandBtn.className = "walk-minimap-icon-btn";
  expandBtn.textContent = "⤢";
  expandBtn.title = "放大地图设导航点 (M)";

  const collapseBtn = document.createElement("button");
  collapseBtn.type = "button";
  collapseBtn.className = "walk-minimap-icon-btn";
  collapseBtn.textContent = "−";
  collapseBtn.title = "折叠或展开小地图";

  btnGroup.append(modeBtn, expandBtn, collapseBtn);
  headerEl.append(titleGroup, btnGroup);

  const bodyEl = document.createElement("div");
  bodyEl.className = "walk-minimap-body";

  const canvasWrap = document.createElement("div");
  canvasWrap.className = "walk-minimap-canvas-wrap";

  const canvas = document.createElement("canvas");
  canvas.className = "walk-minimap-canvas";
  canvas.setAttribute("aria-label", "当前岛屿漫步小地图");
  canvasWrap.appendChild(canvas);

  const hoverTipEl = document.createElement("div");
  hoverTipEl.className = "walk-minimap-tip";
  hoverTipEl.hidden = true;
  canvasWrap.appendChild(hoverTipEl);

  const quickBar = document.createElement("div");
  quickBar.className = "walk-minimap-quickbar";
  quickBar.hidden = true;

  const footerEl = document.createElement("div");
  footerEl.className = "walk-minimap-footer";
  const footerTextEl = document.createElement("span");
  footerTextEl.className = "walk-minimap-footer-text";
  footerTextEl.textContent = "M 放大设标";
  const wpActionsEl = document.createElement("div");
  wpActionsEl.className = "walk-minimap-wp-actions";
  const autoNavBtn = document.createElement("button");
  autoNavBtn.type = "button";
  autoNavBtn.className = "walk-minimap-auto-nav";
  autoNavBtn.textContent = "自动前往";
  autoNavBtn.title = "自动漫步前往该定位点";
  autoNavBtn.hidden = true;
  const clearWpBtn = document.createElement("button");
  clearWpBtn.type = "button";
  clearWpBtn.className = "walk-minimap-clear-wp";
  clearWpBtn.textContent = "清除导航";
  clearWpBtn.hidden = true;
  wpActionsEl.append(autoNavBtn, clearWpBtn);
  footerEl.append(footerTextEl, wpActionsEl);

  bodyEl.append(canvasWrap, quickBar, footerEl);
  containerEl.append(headerEl, bodyEl);

  const offscreenCanvas = document.createElement("canvas");
  const offscreenCtx = offscreenCanvas.getContext("2d");
  const coastCache = new Map();

  function getCoast(key) {
    if (!coastCache.has(key)) {
      coastCache.set(key, getIslandCoastPolygon(key));
    }
    return coastCache.get(key);
  }

  function syncStateClasses() {
    containerEl.classList.toggle("is-collapsed", collapsed && !expanded);
    containerEl.classList.toggle("is-expanded", expanded);
    quickBar.hidden = !expanded;
    collapseBtn.hidden = expanded;
    collapseBtn.textContent = collapsed ? "+" : "−";
    expandBtn.textContent = expanded ? "×" : "⤢";
    expandBtn.title = expanded ? "收起大地图 (M / Esc)" : "放大地图设导航点 (M)";
    modeBtn.textContent = rotateWithHeading ? "随向" : "北↑";
    modeBtn.classList.toggle("is-active", rotateWithHeading);
  }

  function setExpanded(next) {
    const val = Boolean(next);
    if (expanded === val) return;
    expanded = val;
    if (expanded) collapsed = false;
    lastStaticSig = "";
    lastRenderAt = 0;
    hoveredLandmark = null;
    hoverTipEl.hidden = true;
    syncStateClasses();
    if (expanded && lastData) {
      rebuildQuickLandmarks(lastData);
    }
    onExpandChange?.(expanded);
  }

  function setWaypoint(nextWp) {
    waypoint = nextWp;
    autoNavBtn.hidden = !waypoint;
    clearWpBtn.hidden = !waypoint;
    if (!waypoint) {
      lastAutoNavigating = false;
      autoNavBtn.textContent = "自动前往";
      autoNavBtn.classList.remove("is-active");
    }
    onWaypointChange?.(waypoint);
    lastRenderAt = 0;
  }

  modeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    rotateWithHeading = !rotateWithHeading;
    syncStateClasses();
    lastRenderAt = 0;
    modeBtn.blur();
  });

  expandBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setExpanded(!expanded);
    expandBtn.blur();
  });

  collapseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    collapsed = !collapsed;
    syncStateClasses();
    lastRenderAt = 0;
    collapseBtn.blur();
  });

  autoNavBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!waypoint) return;
    const enable = !lastAutoNavigating;
    if (enable && expanded) {
      setExpanded(false);
    }
    onAutoNavigateToggle?.(waypoint, enable);
    lastRenderAt = 0;
    autoNavBtn.blur();
  });

  clearWpBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setWaypoint(null);
    clearWpBtn.blur();
  });

  containerEl.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  });

  function getDisplayPxSize() {
    if (expanded) {
      return Math.max(240, Math.min(360, Math.round(Math.min(window.innerWidth * 0.78, window.innerHeight * 0.56))));
    }
    return window.innerWidth <= 680 ? 142 : 170;
  }

  function worldToCanvas(wx, wz, meta, sizePx, centerWorldX, centerWorldZ, yaw, zoomScale = 1) {
    const scale = (sizePx / (meta.halfSpan * 2)) * zoomScale;
    const dx = (wx - centerWorldX) * scale;
    const dz = (wz - centerWorldZ) * scale;
    if (!rotateWithHeading) {
      return [sizePx * 0.5 + dx, sizePx * 0.5 + dz];
    }
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    return [
      sizePx * 0.5 + (dx * c - dz * s),
      sizePx * 0.5 + (dx * s + dz * c),
    ];
  }

  function canvasToWorld(cx, cy, meta, sizePx, centerWorldX, centerWorldZ, yaw, zoomScale = 1) {
    const scale = (sizePx / (meta.halfSpan * 2)) * zoomScale;
    const rx = cx - sizePx * 0.5;
    const ry = cy - sizePx * 0.5;
    let dx = rx;
    let dz = ry;
    if (rotateWithHeading) {
      const c = Math.cos(-yaw);
      const s = Math.sin(-yaw);
      dx = rx * c - ry * s;
      dz = rx * s + ry * c;
    }
    return [centerWorldX + dx / scale, centerWorldZ + dz / scale];
  }

  function rebuildQuickLandmarks(data) {
    quickBar.replaceChildren();
    if (!data) return;
    const targets = [];
    for (const p of data.portals || []) {
      targets.push({ x: p.x, z: p.z, label: p.label || "传送阵", kind: "portal" });
    }
    if (data.islandKey === "bagua") {
      targets.push({ x: BAGUA_ISLAND_CENTER_X, z: BAGUA_ISLAND_CENTER_Z, label: "太极坛", kind: "center" });
    } else if (data.islandKey === "main") {
      targets.push({ x: 0, z: -31, label: "钟楼车站", kind: "landmark" });
    }
    const candidates = [...(data.creations || [])].sort((a, b) => {
      const rank = (c) =>
        c.id === "c-mwvo0nnd-bb15de" || c.id === "seed-quarry-garden" || c.id === "kunlun-palace"
          ? 0
          : c.scaleClass === "colossal"
            ? 1
            : c.scaleClass === "large"
              ? 2
              : 3;
      return rank(a) - rank(b);
    });
    for (const c of candidates) {
      if (targets.length >= 6) break;
      if (
        c.scaleClass === "colossal" ||
        c.scaleClass === "large" ||
        c.id === "c-mwvo0nnd-bb15de" ||
        c.id === "seed-quarry-garden" ||
        c.id === "kunlun-palace"
      ) {
        if (!targets.some((t) => Math.hypot(t.x - c.x, t.z - c.z) < 12)) {
          const r = Math.hypot((c.worldSpanX || 6) * 0.5, (c.worldSpanZ || 6) * 0.5);
          targets.push({
            x: c.x,
            z: c.z,
            label: c.name,
            kind: "landmark",
            creationId: c.id,
            arrivalRadius: Math.min(18, Math.max(4.5, r + 2.5)),
          });
        }
      }
    }

    for (const tgt of targets.slice(0, 6)) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "walk-minimap-chip";
      if (tgt.kind === "portal") btn.classList.add("is-portal");
      btn.textContent = tgt.label.slice(0, 7);
      btn.title = `导航前往 ${tgt.label}`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setWaypoint({
          x: tgt.x,
          z: tgt.z,
          label: tgt.label,
          islandKey: data.islandKey,
          creationId: tgt.creationId || null,
          arrivalRadius: tgt.arrivalRadius || (tgt.kind === "portal" ? 3.2 : 4.0),
        });
        btn.blur();
      });
      quickBar.appendChild(btn);
    }
  }

  function findNearestLandmarkAtCanvas(cx, cy, data, meta, sizePx, centerX, centerZ, yaw) {
    if (!data) return null;
    const [wx, wz] = canvasToWorld(cx, cy, meta, sizePx, centerX, centerZ, yaw);
    let best = null;
    let bestD = 16 / (sizePx / (meta.halfSpan * 2));
    for (const p of data.portals || []) {
      const d = Math.hypot(p.x - wx, p.z - wz);
      if (d < bestD) {
        bestD = d;
        best = { x: p.x, z: p.z, label: p.label || "传送阵", arrivalRadius: 3.2 };
      }
    }
    for (const c of data.creations || []) {
      const d = Math.hypot(c.x - wx, c.z - wz);
      if (d < bestD) {
        bestD = d;
        const r = Math.hypot((c.worldSpanX || 6) * 0.5, (c.worldSpanZ || 6) * 0.5);
        best = {
          x: c.x,
          z: c.z,
          label: c.name,
          creationId: c.id,
          arrivalRadius: Math.min(18, Math.max(4.5, r + 2.5)),
        };
      }
    }
    return best;
  }

  canvas.addEventListener("pointermove", (e) => {
    if (!lastData || collapsed) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const meta = ISLAND_META[lastData.islandKey] || ISLAND_META.main;
    const sizePx = rect.width || getDisplayPxSize();
    const hit = findNearestLandmarkAtCanvas(
      cx,
      cy,
      lastData,
      meta,
      sizePx,
      meta.cx,
      meta.cz,
      lastData.player.yaw,
    );
    hoveredLandmark = hit;
    if (hit) {
      const dist = Math.round(Math.hypot(hit.x - lastData.player.x, hit.z - lastData.player.z));
      hoverTipEl.textContent = `${hit.label} · ${dist}m`;
      hoverTipEl.hidden = false;
    } else {
      hoverTipEl.hidden = true;
    }
  });

  canvas.addEventListener("pointerleave", () => {
    hoveredLandmark = null;
    hoverTipEl.hidden = true;
  });

  canvas.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!lastData || collapsed) return;
    if (!expanded) {
      setExpanded(true);
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const meta = ISLAND_META[lastData.islandKey] || ISLAND_META.main;
    const sizePx = rect.width || getDisplayPxSize();
    const hit = findNearestLandmarkAtCanvas(
      cx,
      cy,
      lastData,
      meta,
      sizePx,
      meta.cx,
      meta.cz,
      lastData.player.yaw,
    );
    if (hit) {
      setWaypoint({ ...hit, islandKey: lastData.islandKey });
    } else {
      const [wx, wz] = canvasToWorld(
        cx,
        cy,
        meta,
        sizePx,
        meta.cx,
        meta.cz,
        lastData.player.yaw,
      );
      setWaypoint({ x: wx, z: wz, label: "自定标点", islandKey: lastData.islandKey });
    }
  });

  function renderStaticBase(data, meta, sizePx, dpr) {
    if (!offscreenCtx) return;
    const px = Math.round(sizePx * dpr);
    offscreenCanvas.width = px;
    offscreenCanvas.height = px;

    const ctx = offscreenCtx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sizePx, sizePx);

    const scale = sizePx / (meta.halfSpan * 2);
    const toX = (wx) => sizePx * 0.5 + (wx - meta.cx) * scale;
    const toY = (wz) => sizePx * 0.5 + (wz - meta.cz) * scale;

    // 1. Water backdrop
    ctx.fillStyle = meta.waterBg;
    ctx.fillRect(0, 0, sizePx, sizePx);

    // Subtle sea coordinate rings
    ctx.strokeStyle = "rgba(130, 232, 220, 0.08)";
    ctx.lineWidth = 1;
    for (const rFrac of [0.24, 0.44]) {
      ctx.beginPath();
      ctx.arc(sizePx * 0.5, sizePx * 0.5, sizePx * rFrac, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Island terrain polygon + beach shoreline
    const coast = getCoast(meta.key);
    if (coast.length > 2) {
      ctx.save();
      ctx.beginPath();
      coast.forEach(([wx, wz], idx) => {
        const pxX = toX(wx);
        const pxY = toY(wz);
        if (idx === 0) ctx.moveTo(pxX, pxY);
        else ctx.lineTo(pxX, pxY);
      });
      ctx.closePath();
      ctx.fillStyle = meta.landFill;
      ctx.fill();
      ctx.lineWidth = 3.2;
      ctx.strokeStyle = meta.beachStroke;
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.stroke();
      ctx.clip();

      // 3. Terrain zones clipped to island
      for (const z of data.terrainZones || []) {
        const zx = toX(z.x);
        const zy = toY(z.z);
        const zr = Math.max(3, (z.radius || 14) * scale);
        ctx.beginPath();
        ctx.arc(zx, zy, zr, 0, Math.PI * 2);
        ctx.fillStyle = getBiomeFill(z.biome);
        ctx.fill();
      }

      // 4. Bagua Eight-Trigram subtle radial dividers
      if (meta.key === "bagua") {
        const cx = toX(meta.cx);
        const cz = toY(meta.cz);
        ctx.strokeStyle = "rgba(130, 232, 220, 0.14)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 8; i++) {
          const ang = (i * Math.PI) / 4 + Math.PI / 8;
          ctx.beginPath();
          ctx.moveTo(cx, cz);
          ctx.lineTo(cx + Math.cos(ang) * 242 * scale, cz + Math.sin(ang) * 242 * scale);
          ctx.stroke();
        }
        // Trigram glyphs on perimeter in expanded view or subtle markers
        ctx.fillStyle = "rgba(218, 252, 245, 0.56)";
        ctx.font = `${expanded ? 10 : 8}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const tri of TRIGRAMS) {
          const tx = cx + Math.cos(tri.angle) * 212 * scale;
          const ty = cz + Math.sin(tri.angle) * 212 * scale;
          ctx.fillText(tri.name, tx, ty);
        }
      }

      // 5. Roads & cobblestone paths
      for (const p of data.paths || []) {
        const pts = p.points;
        if (!Array.isArray(pts) || pts.length < 2) continue;
        const isMainRoad = p.kind === "road" || p.kind === "cobblestone";
        ctx.beginPath();
        pts.forEach(([px0, pz0], idx) => {
          const x0 = toX(px0);
          const y0 = toY(pz0);
          if (idx === 0) ctx.moveTo(x0, y0);
          else ctx.lineTo(x0, y0);
        });
        if (p.closed) ctx.closePath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(isMainRoad ? 2.2 : 1.2, (isMainRoad ? 4.4 : 2.3) * scale);
        ctx.strokeStyle =
          p.kind === "cobblestone"
            ? "rgba(222, 214, 194, 0.72)"
            : isMainRoad
              ? "rgba(240, 224, 184, 0.76)"
              : "rgba(224, 210, 174, 0.45)";
        ctx.stroke();
      }

      // 6. Buildings & Landmarks
      for (const c of data.creations || []) {
        const bx = toX(c.x);
        const bz = toY(c.z);
        const w = Math.max(2.6, (c.worldSpanX || 5) * scale);
        const h = Math.max(2.6, (c.worldSpanZ || 5) * scale);
        ctx.save();
        ctx.translate(bx, bz);
        ctx.rotate(-(c.yaw || 0));
        if (c.isRacecourse) {
          ctx.fillStyle = "rgba(217, 180, 120, 0.92)";
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
          ctx.strokeRect(-w * 0.5, -h * 0.5, w, h);
          ctx.fillStyle = "#52b64e";
          ctx.fillRect(-w * 0.28, -h * 0.22, w * 0.56, h * 0.44);
        } else {
          ctx.fillStyle =
            c.category === "building"
              ? "rgba(244, 232, 208, 0.88)"
              : "rgba(182, 224, 188, 0.78)";
          ctx.strokeStyle = "rgba(18, 28, 22, 0.55)";
          ctx.lineWidth = 0.8;
          ctx.fillRect(-w * 0.5, -h * 0.5, w, h);
          ctx.strokeRect(-w * 0.5, -h * 0.5, w, h);
        }
        ctx.restore();
      }

      // 7. Teleport Portals
      for (const p of data.portals || []) {
        const pxX = toX(p.x);
        const pxY = toY(p.z);
        ctx.beginPath();
        ctx.arc(pxX, pxY, expanded ? 5.2 : 3.8, 0, Math.PI * 2);
        ctx.fillStyle = "#5bf0ff";
        ctx.fill();
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  function drawDynamicFrame(now, data) {
    const meta = ISLAND_META[data.islandKey] || ISLAND_META.main;
    const sizePx = getDisplayPxSize();
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    if (canvas.width !== Math.round(sizePx * dpr) || canvas.height !== Math.round(sizePx * dpr)) {
      canvas.width = Math.round(sizePx * dpr);
      canvas.height = Math.round(sizePx * dpr);
      canvas.style.width = `${sizePx}px`;
      canvas.style.height = `${sizePx}px`;
    }

    const staticSig = `${meta.key}:${data.staticVersion}:${sizePx}:${dpr}:${expanded ? 1 : 0}`;
    if (staticSig !== lastStaticSig) {
      lastStaticSig = staticSig;
      renderStaticBase(data, meta, sizePx, dpr);
      if (expanded) rebuildQuickLandmarks(data);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, sizePx, sizePx);

    // Clear auto-reached waypoint (< clearDist) during manual exploration
    if (waypoint && waypoint.islandKey === data.islandKey) {
      const wpDist = Math.hypot(waypoint.x - data.player.x, waypoint.z - data.player.z);
      const clearDist = waypoint.arrivalRadius ? Math.max(4.5, waypoint.arrivalRadius + 0.5) : 5.5;
      if (wpDist < clearDist && !data.autoNavigating) {
        setWaypoint(null);
      }
    } else if (waypoint && waypoint.islandKey !== data.islandKey) {
      setWaypoint(null);
    }

    // Blit cached static island base (rotated around map center if heading-up)
    ctx.save();
    ctx.fillStyle = meta.waterBg;
    ctx.fillRect(0, 0, sizePx, sizePx);
    if (rotateWithHeading) {
      ctx.translate(sizePx * 0.5, sizePx * 0.5);
      ctx.rotate(data.player.yaw);
      ctx.translate(-sizePx * 0.5, -sizePx * 0.5);
    }
    ctx.drawImage(offscreenCanvas, 0, 0, sizePx, sizePx);
    ctx.restore();

    const toScreen = (wx, wz) =>
      worldToCanvas(wx, wz, meta, sizePx, meta.cx, meta.cz, data.player.yaw);

    // Moving vehicles on current island
    for (const v of data.vehicles || []) {
      const [vx, vy] = toScreen(v.x, v.z);
      ctx.beginPath();
      ctx.arc(vx, vy, expanded ? 2.8 : 2.1, 0, Math.PI * 2);
      ctx.fillStyle = "#ffc84d";
      ctx.fill();
    }

    // NPCs on current island
    for (const n of data.npcs || []) {
      const [nx, ny] = toScreen(n.x, n.z);
      ctx.beginPath();
      ctx.arc(nx, ny, n.specialist ? (expanded ? 2.6 : 1.9) : (expanded ? 2.0 : 1.4), 0, Math.PI * 2);
      ctx.fillStyle = n.specialist ? "#74ffda" : "rgba(255, 255, 255, 0.72)";
      ctx.fill();
    }

    // Other online players on same island
    for (const rp of data.remotePlayers || []) {
      const [rx, ry] = toScreen(rp.x, rp.z);
      ctx.beginPath();
      ctx.arc(rx, ry, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = "#ff85b3";
      ctx.fill();
    }

    // Player position + FOV cone
    const [px, py] = toScreen(data.player.x, data.player.z);

    // Active Waypoint dashed guide line & pin
    if (waypoint && waypoint.islandKey === data.islandKey) {
      const [wxp, wyp] = toScreen(waypoint.x, waypoint.z);
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(px, py);
      ctx.lineTo(wxp, wyp);
      ctx.strokeStyle = "rgba(255, 224, 102, 0.92)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.setLineDash([]);

      const pulse = 5 + Math.sin(now * 0.007) * 1.6;
      ctx.beginPath();
      ctx.arc(wxp, wyp, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 224, 102, 0.75)";
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(wxp, wyp, 3.3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffe066";
      ctx.fill();
      ctx.restore();
    }

    // Draw player FOV vision cone
    const coneAngle = rotateWithHeading
      ? -Math.PI * 0.5
      : Math.atan2(-Math.cos(data.player.yaw), -Math.sin(data.player.yaw));
    const fovHalf = 0.46;
    const coneR = expanded ? 28 : 20;

    ctx.save();
    const grad = ctx.createRadialGradient(px, py, 2, px, py, coneR);
    grad.addColorStop(0, "rgba(102, 244, 255, 0.58)");
    grad.addColorStop(1, "rgba(102, 244, 255, 0)");
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, coneR, coneAngle - fovHalf, coneAngle + fovHalf);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Player dot
    ctx.beginPath();
    ctx.arc(px, py, expanded ? 4.8 : 4.0, 0, Math.PI * 2);
    ctx.fillStyle = "#2cf2ff";
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    ctx.restore();

    // North Compass Badge (top-right inside canvas)
    const compassX = sizePx - 14;
    const compassY = 14;
    const northAng = rotateWithHeading ? data.player.yaw : 0;
    ctx.save();
    ctx.translate(compassX, compassY);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(10, 18, 22, 0.72)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.rotate(northAng);
    ctx.fillStyle = "#ff6d5e";
    ctx.font = "bold 9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("N", 0, 0.5);
    ctx.restore();

    // Expanded labels for key landmarks
    if (expanded) {
      ctx.save();
      ctx.font = "600 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (const p of data.portals || []) {
        const [lx, ly] = toScreen(p.x, p.z);
        ctx.fillStyle = "rgba(8, 16, 20, 0.78)";
        ctx.fillText(p.label || "传送阵", lx + 1, ly - 5);
        ctx.fillStyle = "#7cf4ff";
        ctx.fillText(p.label || "传送阵", lx, ly - 6);
      }
      ctx.restore();
    }

    // Update header & footer text
    islandBadgeEl.textContent = meta.label;
    regionEl.textContent = data.regionLabel || "";

    lastAutoNavigating = Boolean(data.autoNavigating);
    if (waypoint && waypoint.islandKey === data.islandKey) {
      const dist = Math.round(Math.hypot(waypoint.x - data.player.x, waypoint.z - data.player.z));
      footerTextEl.textContent = lastAutoNavigating
        ? `自动前往 ${waypoint.label} · ${dist}m`
        : `前往 ${waypoint.label} · ${dist}m`;
      autoNavBtn.hidden = false;
      autoNavBtn.textContent = lastAutoNavigating ? "停止导航" : "自动前往";
      autoNavBtn.classList.toggle("is-active", lastAutoNavigating);
      clearWpBtn.hidden = false;
    } else if (data.inside) {
      footerTextEl.textContent = "室内探索中（定位在门外）";
      autoNavBtn.hidden = true;
      clearWpBtn.hidden = true;
    } else if (data.portals?.length) {
      let minPortal = data.portals[0];
      let minD = Math.hypot(minPortal.x - data.player.x, minPortal.z - data.player.z);
      for (let i = 1; i < data.portals.length; i++) {
        const d = Math.hypot(data.portals[i].x - data.player.x, data.portals[i].z - data.player.z);
        if (d < minD) {
          minD = d;
          minPortal = data.portals[i];
        }
      }
      footerTextEl.textContent = expanded
        ? `点击地图设标 · 距${minPortal.label || "传送点"} ${Math.round(minD)}m`
        : `M 放大 · 距传送点 ${Math.round(minD)}m`;
      autoNavBtn.hidden = true;
      clearWpBtn.hidden = true;
    } else {
      footerTextEl.textContent = expanded ? "点击地图任意位置设导航标" : "M 放大地图设标";
      autoNavBtn.hidden = true;
      clearWpBtn.hidden = true;
    }
  }

  syncStateClasses();

  return {
    update(now, data) {
      const visible = Boolean(data?.visible);
      containerEl.hidden = !visible;
      if (!visible) {
        if (expanded) setExpanded(false);
        return;
      }
      lastData = data;
      if (collapsed && !expanded) {
        const meta = ISLAND_META[data.islandKey] || ISLAND_META.main;
        islandBadgeEl.textContent = meta.label;
        regionEl.textContent = data.regionLabel || "";
        return;
      }
      if (now - lastRenderAt < 45) return;
      lastRenderAt = now;
      drawDynamicFrame(now, data);
    },
    isExpanded: () => expanded,
    toggleExpanded: () => setExpanded(!expanded),
    setExpanded,
    getWaypoint: () => waypoint,
    clearWaypoint: () => setWaypoint(null),
    destroy() {
      containerEl.innerHTML = "";
    },
  };
}
