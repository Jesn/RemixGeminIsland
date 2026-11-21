import * as d3 from "d3";

export function createBaguaD3Hud(containerEl) {
  if (!containerEl) {
    return {
      update() {},
      setCollapsed() {},
      destroy() {},
    };
  }

  let collapsed = false;
  const WAVE_LEN = 42;
  const waveHistory = new Array(WAVE_LEN).fill(0.5);
  let lastWavePush = 0;

  // Build structural DOM inside #bagua-energy-hud (styling lives in styles.css)
  containerEl.innerHTML = "";
  const headerEl = document.createElement("div");
  headerEl.className = "bagua-hud-header";

  const titleWrap = document.createElement("div");
  titleWrap.className = "bagua-hud-title-wrap";
  const badgeEl = document.createElement("span");
  badgeEl.className = "bagua-hud-badge";
  badgeEl.textContent = "☱ 兑·泽";
  const titleEl = document.createElement("span");
  titleEl.className = "bagua-hud-title";
  titleEl.textContent = "八卦灵脉流场";
  titleWrap.append(badgeEl, titleEl);

  const controlsWrap = document.createElement("div");
  controlsWrap.className = "bagua-hud-controls";
  const hzEl = document.createElement("span");
  hzEl.className = "bagua-hud-hz";
  hzEl.textContent = "7.83 Hz";
  const toggleBtn = document.createElement("button");
  toggleBtn.type = "button";
  toggleBtn.className = "bagua-hud-toggle";
  toggleBtn.setAttribute("aria-label", "折叠或展开八卦灵脉面板");
  toggleBtn.textContent = "−";
  controlsWrap.append(hzEl, toggleBtn);
  headerEl.append(titleWrap, controlsWrap);

  const bodyEl = document.createElement("div");
  bodyEl.className = "bagua-hud-body";

  const radarWrap = document.createElement("div");
  radarWrap.className = "bagua-hud-radar-wrap";

  const waveWrap = document.createElement("div");
  waveWrap.className = "bagua-hud-wave-wrap";
  const waveMeta = document.createElement("div");
  waveMeta.className = "bagua-hud-wave-meta";
  const yinyangLabel = document.createElement("span");
  yinyangLabel.className = "bagua-hud-yinyang";
  yinyangLabel.textContent = "阴阳平衡 50%";
  const resonanceLabel = document.createElement("span");
  resonanceLabel.className = "bagua-hud-resonance";
  resonanceLabel.textContent = "共鸣 0/8";
  const proxLabel = document.createElement("span");
  proxLabel.className = "bagua-hud-prox";
  proxLabel.textContent = "全岛监测";
  waveMeta.append(yinyangLabel, resonanceLabel, proxLabel);

  waveWrap.appendChild(waveMeta);
  bodyEl.append(radarWrap, waveWrap);
  containerEl.append(headerEl, bodyEl);
  headerEl.title = "拖动可自由移动位置 · 双击复位";

  let currentX = 14;
  let currentY = 14;
  let customPos = null; // null = default non-blocking peripheral corner; { x, y } = user-dragged position
  let dragState = null;

  function getPanelDims() {
    return {
      vw: window.innerWidth || 1280,
      vh: window.innerHeight || 800,
      panelW: containerEl.offsetWidth || (collapsed ? 198 : 214),
      panelH: containerEl.offsetHeight || (collapsed ? 42 : 275),
    };
  }

  function clampPos(x, y, bottomMargin = 10) {
    const { vw, vh, panelW, panelH } = getPanelDims();
    const padX = 10;
    const padTop = 10;
    const maxX = Math.max(padX, vw - panelW - padX);
    const maxY = Math.max(padTop, vh - panelH - bottomMargin);
    return {
      x: Math.max(padX, Math.min(maxX, x)),
      y: Math.max(padTop, Math.min(maxY, y)),
    };
  }

  function applyTransform(x, y) {
    currentX = Math.round(x);
    currentY = Math.round(y);
    containerEl.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  }

  function computeDefaultPos(avoidTopLeftHint) {
    const { panelW } = getPanelDims();
    const x = 14;
    let y = avoidTopLeftHint ? 52 : 14;

    const camControlsEl = document.getElementById("cam-controls");
    if (camControlsEl) {
      const cr = camControlsEl.getBoundingClientRect();
      if (cr.width > 0 && x + panelW > cr.left - 10) {
        y = Math.max(y, Math.round(cr.bottom + 10));
      }
    }

    return clampPos(x, y, 86);
  }

  toggleBtn.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
  });

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    collapsed = !collapsed;
    containerEl.classList.toggle("is-collapsed", collapsed);
    toggleBtn.textContent = collapsed ? "+" : "−";
    if (customPos) {
      customPos = clampPos(customPos.x, customPos.y, 10);
      applyTransform(customPos.x, customPos.y);
    }
  });

  headerEl.addEventListener("dblclick", (e) => {
    if (e.target.closest(".bagua-hud-toggle")) return;
    e.stopPropagation();
    customPos = null;
    const walkHint = document.getElementById("walk-esc-hint");
    const avoidTopLeftHint = Boolean(walkHint && !walkHint.hidden);
    const pos = computeDefaultPos(avoidTopLeftHint);
    applyTransform(pos.x, pos.y);
  });

  containerEl.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".bagua-hud-toggle")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    dragState = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startPosX: currentX,
      startPosY: currentY,
    };
    containerEl.classList.add("is-dragging");
    try {
      containerEl.setPointerCapture(e.pointerId);
    } catch {
      // Ignore synthetic pointer events without active capture
    }
  });

  containerEl.addEventListener("pointermove", (e) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    e.stopPropagation();
    const dx = e.clientX - dragState.startClientX;
    const dy = e.clientY - dragState.startClientY;
    const clamped = clampPos(dragState.startPosX + dx, dragState.startPosY + dy, 10);
    customPos = clamped;
    applyTransform(clamped.x, clamped.y);
  });

  const endDrag = (e) => {
    if (!dragState || e.pointerId !== dragState.pointerId) return;
    e.stopPropagation();
    dragState = null;
    containerEl.classList.remove("is-dragging");
    try {
      if (containerEl.hasPointerCapture(e.pointerId)) {
        containerEl.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore release errors
    }
  };
  containerEl.addEventListener("pointerup", endDrag);
  containerEl.addEventListener("pointercancel", endDrag);
  containerEl.addEventListener("lostpointercapture", endDrag);
  containerEl.addEventListener("wheel", (e) => e.stopPropagation(), { passive: true });

  // ── 1. D3 Radial 8-Trigram Radar SVG ─────────────────────────────────────
  const R_SIZE = 152;
  const R_CX = R_SIZE * 0.5;
  const R_CY = R_SIZE * 0.5;
  const R_MAX = 48;

  const radarSvg = d3
    .select(radarWrap)
    .append("svg")
    .attr("viewBox", `0 0 ${R_SIZE} ${R_SIZE}`)
    .attr("class", "bagua-d3-radar-svg")
    .attr("aria-label", "八卦方位实时能量雷达");

  const radarDefs = radarSvg.append("defs");
  const areaGrad = radarDefs
    .append("radialGradient")
    .attr("id", "bagua-radar-grad")
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "55%");
  const areaGradStop0 = areaGrad.append("stop").attr("offset", "0%").attr("stop-color", "#64dcff").attr("stop-opacity", 0.58);
  const areaGradStop1 = areaGrad.append("stop").attr("offset", "100%").attr("stop-color", "#2ee6c5").attr("stop-opacity", 0.14);

  const radarG = radarSvg.append("g").attr("transform", `translate(${R_CX}, ${R_CY})`);

  // Concentric reference octagons
  for (const frac of [0.38, 0.68, 1.0]) {
    const octPts = d3.range(8).map((i) => {
      const a = (i / 8) * Math.PI * 2;
      return [Math.cos(a) * R_MAX * frac, Math.sin(a) * R_MAX * frac];
    });
    radarG
      .append("polygon")
      .attr("points", octPts.map((p) => p.join(",")).join(" "))
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.14)")
      .attr("stroke-width", frac === 1 ? 1.1 : 0.7);
  }

  // Axis spokes
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    radarG
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", Math.cos(a) * R_MAX)
      .attr("y2", Math.sin(a) * R_MAX)
      .attr("stroke", "rgba(255,255,255,0.12)")
      .attr("stroke-width", 0.75);
  }

  const radialAreaGen = d3
    .areaRadial()
    .angle((d) => d.angle + Math.PI * 0.5)
    .innerRadius(10)
    .outerRadius((d) => 12 + d.energy * (R_MAX - 12))
    .curve(d3.curveCatmullRomClosed);

  const radialLineGen = d3
    .lineRadial()
    .angle((d) => d.angle + Math.PI * 0.5)
    .radius((d) => 12 + d.energy * (R_MAX - 12))
    .curve(d3.curveCatmullRomClosed);

  const radarAreaPath = radarG
    .append("path")
    .attr("fill", "url(#bagua-radar-grad)");

  const radarLinePath = radarG
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#64dcff")
    .attr("stroke-width", 1.8);

  const vertexNodesG = radarG.append("g");
  const labelNodesG = radarG.append("g");

  // Center Taiji indicator dot
  radarG
    .append("circle")
    .attr("r", 6.5)
    .attr("fill", "rgba(18, 28, 34, 0.9)")
    .attr("stroke", "rgba(255, 224, 140, 0.72)")
    .attr("stroke-width", 1.2);
  const centerCoreDot = radarG
    .append("circle")
    .attr("r", 2.8)
    .attr("fill", "#64dcff");

  // ── 2. D3 Real-Time Flux Waveform SVG ────────────────────────────────────
  const W_WIDTH = 178;
  const W_HEIGHT = 44;
  const waveSvg = d3
    .select(waveWrap)
    .append("svg")
    .attr("viewBox", `0 0 ${W_WIDTH} ${W_HEIGHT}`)
    .attr("class", "bagua-d3-wave-svg")
    .attr("aria-label", "八卦能量实时波动曲线");

  const xScale = d3.scaleLinear().domain([0, WAVE_LEN - 1]).range([2, W_WIDTH - 2]);
  const yScale = d3.scaleLinear().domain([0, 1]).range([W_HEIGHT - 4, 4]);

  const waveAreaGen = d3
    .area()
    .x((_, i) => xScale(i))
    .y0(W_HEIGHT - 2)
    .y1((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  const waveLineGen = d3
    .line()
    .x((_, i) => xScale(i))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  // Subtle horizontal reference lines
  waveSvg
    .append("line")
    .attr("x1", 2)
    .attr("x2", W_WIDTH - 2)
    .attr("y1", yScale(0.5))
    .attr("y2", yScale(0.5))
    .attr("stroke", "rgba(255,255,255,0.1)")
    .attr("stroke-dasharray", "3,3");

  const waveAreaPath = waveSvg
    .append("path")
    .attr("fill", "rgba(100, 220, 255, 0.22)");

  const waveLinePath = waveSvg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#64dcff")
    .attr("stroke-width", 1.75);

  function update(nowMs, { visible, telemetry, avoidTopLeftHint = false } = {}) {
    if (!visible || !telemetry) {
      containerEl.hidden = true;
      return;
    }
    containerEl.hidden = false;

    const tri = telemetry.activeTrigram;
    const accent = tri?.colorHex || "#64dcff";

    badgeEl.textContent = `${tri.symbol} ${tri.name}·${tri.element}`;
    badgeEl.style.color = accent;
    badgeEl.style.borderColor = `${accent}66`;
    hzEl.textContent = `${telemetry.fluxHz.toFixed(2)} Hz`;

    const yyPct = Math.round(telemetry.yinYangBalance * 100);
    yinyangLabel.textContent = `阴阳 ${yyPct}%`;
    const litCount = Number(telemetry.activatedCount || 0);
    resonanceLabel.textContent = telemetry.grandActive || litCount >= 8 ? "8/8 太极冲霄" : `八宫 ${litCount}/8`;
    resonanceLabel.classList.toggle("is-complete", litCount >= 8);
    proxLabel.textContent = telemetry.teleporting
      ? "折叠跃迁"
      : telemetry.grandActive
        ? "大阵圆满"
        : telemetry.proximity > 0.35
          ? "灵脉共鸣"
          : "监测中";
    proxLabel.style.color =
      telemetry.proximity > 0.35 || telemetry.teleporting || telemetry.grandActive ? accent : "";

    // Push scrolling waveform sample at ~20Hz
    if (nowMs - lastWavePush >= 50) {
      lastWavePush = nowMs;
      waveHistory.push(Math.max(0.05, Math.min(0.95, telemetry.waveformSample)));
      if (waveHistory.length > WAVE_LEN) waveHistory.shift();
    }

    if (!collapsed) {
      const tris = telemetry.trigrams;
      areaGradStop0.attr("stop-color", accent);
      areaGradStop1.attr("stop-color", accent);
      radarAreaPath.datum(tris).attr("d", radialAreaGen);
      radarLinePath.datum(tris).attr("d", radialLineGen).attr("stroke", accent);
      centerCoreDot.attr("fill", accent);

      const dots = vertexNodesG.selectAll("circle").data(tris, (d) => d.id);
      dots
        .join("circle")
        .attr("cx", (d) => Math.cos(d.angle) * (12 + d.energy * (R_MAX - 12)))
        .attr("cy", (d) => Math.sin(d.angle) * (12 + d.energy * (R_MAX - 12)))
        .attr("r", (d) => (d.active ? 4.2 : d.palaceLit ? 3.5 : 2.3))
        .attr("fill", (d) => d.colorHex)
        .attr("stroke", (d) => (d.active ? "#ffffff" : d.palaceLit ? "#ffd776" : "none"))
        .attr("stroke-width", (d) => (d.active ? 1.35 : d.palaceLit ? 1.2 : 0));

      const labels = labelNodesG.selectAll("text").data(tris, (d) => d.id);
      labels
        .join("text")
        .attr("x", (d) => Math.cos(d.angle) * (R_MAX + 15))
        .attr("y", (d) => Math.sin(d.angle) * (R_MAX + 15) + 3.5)
        .attr("text-anchor", "middle")
        .attr("font-size", (d) => (d.active || d.palaceLit ? "10.5px" : "9.5px"))
        .attr("font-weight", (d) => (d.active || d.palaceLit ? "700" : "500"))
        .attr("fill", (d) =>
          d.active ? d.colorHex : d.palaceLit ? "#ffd776" : "rgba(232,240,236,0.72)",
        )
        .text((d) => d.name);

      waveAreaPath.datum(waveHistory).attr("d", waveAreaGen).attr("fill", `${accent}33`);
      waveLinePath.datum(waveHistory).attr("d", waveLineGen).attr("stroke", accent);
    }

    if (!dragState) {
      const target = customPos
        ? clampPos(customPos.x, customPos.y, 10)
        : computeDefaultPos(avoidTopLeftHint);
      if (customPos) customPos = target;
      applyTransform(target.x, target.y);
    }
  }

  return {
    update,
    setCollapsed(next) {
      collapsed = Boolean(next);
      containerEl.classList.toggle("is-collapsed", collapsed);
      toggleBtn.textContent = collapsed ? "+" : "−";
    },
    destroy() {
      containerEl.innerHTML = "";
    },
  };
}
