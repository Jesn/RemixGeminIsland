import * as THREE from "three";

// Eight Later Heaven Bagua Trigrams mapped by atan2(dz, dx) around East Bagua Center
export const TRIGRAMS = [
  { id: "zhen", name: "震", element: "雷", symbol: "☳", angle: 0, colorHex: "#46e87a", freq: 329.63 },
  { id: "xun", name: "巽", element: "风", symbol: "☴", angle: Math.PI * 0.25, colorHex: "#2ee6c5", freq: 392.0 },
  { id: "li", name: "离", element: "火", symbol: "☲", angle: Math.PI * 0.5, colorHex: "#ff5a36", freq: 440.0 },
  { id: "kun", name: "坤", element: "地", symbol: "☷", angle: Math.PI * 0.75, colorHex: "#f4be3b", freq: 293.66 },
  { id: "dui", name: "兑", element: "泽", symbol: "☱", angle: Math.PI, colorHex: "#64dcff", freq: 523.25 },
  { id: "qian", name: "乾", element: "天", symbol: "☰", angle: -Math.PI * 0.75, colorHex: "#c98cff", freq: 587.33 },
  { id: "kan", name: "坎", element: "水", symbol: "☵", angle: -Math.PI * 0.5, colorHex: "#338eff", freq: 261.63 },
  { id: "gen", name: "艮", element: "山", symbol: "☶", angle: -Math.PI * 0.25, colorHex: "#ffa042", freq: 349.23 },
];

export const MAIN_PORTAL_POS = [11.5, 5.5];

export const PALACE_TRIGRAM_MAP = {
  "bagua-zhen-drumtower": 0,
  "bagua-xun-windmill": 1,
  "bagua-li-stage": 2,
  "bagua-kun-courtyard": 3,
  "bagua-dui-pavilion": 4,
  "bagua-qian-observatory": 5,
  "bagua-kan-waterwheel": 6,
  "bagua-gen-maze": 7,
};

export function getBaguaPortalPos(baguaCenterX = 498.24, baguaCenterZ = 0) {
  return [baguaCenterX - 23.4, baguaCenterZ];
}

export function resolveTrigramIndexForPoint(dx, dz) {
  if (Math.hypot(dx, dz) < 0.25) return 4; // Default West ("兑") facing the bridge / portal
  const ang = Math.atan2(dz, dx);
  const oct = Math.round(ang / (Math.PI * 0.25));
  return ((oct % 8) + 8) % 8;
}

function makeSoftGlowTexture() {
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 31);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.32, "rgba(255,255,255,0.75)");
  g.addColorStop(0.7, "rgba(255,255,255,0.18)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeBaguaArrayTexture() {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  const cx = size * 0.5;
  const cy = size * 0.5;

  ctx.clearRect(0, 0, size, size);

  // Concentric mystic rune rings
  const ringSpecs = [
    { r: 472, lw: 5, alpha: 0.72, dash: [] },
    { r: 446, lw: 3, alpha: 0.55, dash: [14, 10] },
    { r: 368, lw: 4, alpha: 0.68, dash: [] },
    { r: 344, lw: 2, alpha: 0.45, dash: [8, 12] },
    { r: 266, lw: 3, alpha: 0.52, dash: [20, 8] },
  ];
  for (const rs of ringSpecs) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, rs.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${rs.alpha})`;
    ctx.lineWidth = rs.lw;
    ctx.setLineDash(rs.dash);
    ctx.stroke();
    ctx.restore();
  }

  // Dual rotated octagons inside outer rune band
  for (const rotOffset of [0, Math.PI / 8]) {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * Math.PI * 2 + rotOffset;
      const x = cx + Math.cos(a) * 412;
      const y = cy + Math.sin(a) * 412;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = rotOffset === 0 ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.34)";
    ctx.lineWidth = rotOffset === 0 ? 4 : 2;
    ctx.stroke();
    ctx.restore();
  }

  // 8 Trigram spokes + glyphs + ancient bar symbols
  for (let i = 0; i < 8; i++) {
    const tri = TRIGRAMS[i];
    const a = tri.angle;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);

    // Radial energy spoke
    const grad = ctx.createLinearGradient(255, 0, 468, 0);
    grad.addColorStop(0, "rgba(255,255,255,0.12)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.75)");
    grad.addColorStop(1, "rgba(255,255,255,0.15)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(266, 0);
    ctx.lineTo(362, 0);
    ctx.stroke();

    // Trigram symbol & Hanzi
    ctx.translate(405, 0);
    ctx.rotate(Math.PI * 0.5);
    ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 44px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
    ctx.fillText(tri.symbol, 0, -14);
    ctx.font = "700 22px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
    ctx.fillText(tri.name, 0, 22);
    ctx.restore();
  }

  // Degree tick marks along outer circle
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const isMajor = i % 8 === 0;
    const r0 = isMajor ? 452 : 460;
    const r1 = 470;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
    ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
    ctx.strokeStyle = isMajor ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)";
    ctx.lineWidth = isMajor ? 4 : 2;
    ctx.stroke();
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeVortexBandTexture() {
  const w = 512;
  const h = 256;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);

  // Diagonal luminous ribbons for ascending portal vortex
  for (let i = 0; i < 16; i++) {
    const x0 = (i / 16) * w;
    const g = ctx.createLinearGradient(x0, h, x0 + 64, 0);
    g.addColorStop(0, "rgba(100, 220, 255, 0.0)");
    g.addColorStop(0.22, i % 2 === 0 ? "rgba(90, 240, 210, 0.55)" : "rgba(244, 190, 68, 0.45)");
    g.addColorStop(0.55, "rgba(255, 255, 255, 0.85)");
    g.addColorStop(0.88, "rgba(140, 175, 255, 0.35)");
    g.addColorStop(1, "rgba(100, 220, 255, 0.0)");
    ctx.strokeStyle = g;
    ctx.lineWidth = i % 2 === 0 ? 12 : 7;
    ctx.beginPath();
    ctx.moveTo(x0, h);
    ctx.bezierCurveTo(x0 + 40, h * 0.65, x0 - 20, h * 0.35, x0 + 48, 0);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Synthesize Bagua trigram resonance + sampled environmental audio (water/breeze/temple bell) + spatial fold WebAudio cue
function createBaguaAudioSynth() {
  let ctx = null;
  let waterSampleBuffer = null;
  let windSampleBuffer = null;
  let bellSampleBuffer = null;
  let ambientNodes = null;
  let disposed = false;

  const ensureCtx = (allowCreate = true) => {
    if (disposed || typeof window === "undefined") return null;
    if (!allowCreate) {
      return ctx && ctx.state === "running" ? ctx : null;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!ctx) {
      try {
        ctx = new AudioCtx();
      } catch {
        return null;
      }
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  };

  function buildWaterSampleBuffer(ac) {
    const sr = ac.sampleRate;
    const dur = 4.0;
    const len = Math.floor(sr * dur);
    const buf = ac.createBuffer(2, len, sr);
    const fadeLen = Math.floor(sr * 0.18);

    // Pre-generate stochastic stream droplet events that wrap seamlessly over `len`
    const droplets = [];
    for (let k = 0; k < 104; k++) {
      droplets.push({
        pos: Math.floor(Math.random() * len),
        freq: 620 + Math.random() * 1280,
        amp: 0.045 + Math.random() * 0.085,
        tau: 0.016 + Math.random() * 0.022,
        pan: Math.random(),
      });
    }

    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      let lp = 0;

      // Extra overhang samples at end for clean crossfade wrap
      const raw = new Float32Array(len + fadeLen);
      for (let i = 0; i < raw.length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.950 * b2 + white * 0.048;
        const pink = b0 + b1 + b2 + white * 0.055;
        lp += (pink - lp) * 0.18;

        const tSec = i / sr;
        // Gentle integer-cycle brook eddy modulation over 4.0s
        const swirl =
          0.72 +
          0.16 * Math.sin(2 * Math.PI * 0.5 * tSec + ch * 1.4) +
          0.12 * Math.cos(2 * Math.PI * 1.25 * tSec + ch * 2.1);
        raw[i] = lp * swirl * 0.85;
      }

      // Layer natural water droplet resonances
      for (const d of droplets) {
        const chGain = ch === 0 ? 1 - d.pan * 0.45 : 0.55 + d.pan * 0.45;
        const decaySamples = Math.floor(d.tau * 5.0 * sr);
        for (let j = 0; j < decaySamples; j++) {
          const idx = (d.pos + j) % len;
          const tauSec = j / sr;
          const chirpFreq = d.freq * (1 + tauSec * 4.5);
          const env = Math.exp(-tauSec / d.tau) * (1 - Math.exp(-tauSec / 0.0015));
          raw[idx] += Math.sin(2 * Math.PI * chirpFreq * tauSec) * env * d.amp * chGain;
        }
      }

      // Seamless crossfade wrap across [0 .. fadeLen]
      for (let i = 0; i < len; i++) {
        if (i < fadeLen) {
          const w = i / fadeLen;
          data[i] = raw[i] * w + raw[len + i] * (1 - w);
        } else {
          data[i] = raw[i];
        }
      }
    }
    return buf;
  }

  function buildWindSampleBuffer(ac) {
    const sr = ac.sampleRate;
    const dur = 4.5;
    const len = Math.floor(sr * dur);
    const buf = ac.createBuffer(2, len, sr);
    const fadeLen = Math.floor(sr * 0.22);

    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      const raw = new Float32Array(len + fadeLen);
      let b0 = 0;
      let b1 = 0;
      let lp = 0;
      for (let i = 0; i < raw.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.996 * b0 + w * 0.032;
        b1 = 0.972 * b1 + w * 0.045;
        lp += ((b0 + b1) - lp) * 0.075;
        const tSec = i / sr;
        const gust = 0.65 + 0.35 * Math.sin((2 * Math.PI * 2 * tSec) / dur + ch * 1.2);
        raw[i] = lp * gust * 1.35;
      }
      for (let i = 0; i < len; i++) {
        if (i < fadeLen) {
          const w = i / fadeLen;
          data[i] = raw[i] * w + raw[len + i] * (1 - w);
        } else {
          data[i] = raw[i];
        }
      }
    }
    return buf;
  }

  function buildBellSampleBuffer(ac) {
    const sr = ac.sampleRate;
    const dur = 3.4;
    const len = Math.floor(sr * dur);
    const buf = ac.createBuffer(2, len, sr);
    const baseFreq = 440;
    const partials = [
      { ratio: 0.5, amp: 0.16, tau: 2.15 },
      { ratio: 1.0, amp: 0.54, tau: 1.60 },
      { ratio: 1.183, amp: 0.17, tau: 0.95 },
      { ratio: 1.505, amp: 0.14, tau: 0.88 },
      { ratio: 2.0, amp: 0.21, tau: 0.72 },
      { ratio: 2.756, amp: 0.08, tau: 0.42 },
    ];

    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      const stereoDetune = ch === 0 ? -0.55 : 0.55;
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        const attack = 1 - Math.exp(-t / 0.0085);
        const tailFade = t > dur - 0.15 ? Math.max(0, (dur - t) / 0.15) : 1;
        let s = 0;
        for (const p of partials) {
          const f = baseFreq * p.ratio + stereoDetune * p.ratio;
          s += Math.sin(2 * Math.PI * f * t) * p.amp * Math.exp(-t / p.tau);
        }
        // Subtle felt mallet transient
        if (t < 0.045) {
          s += (Math.random() * 2 - 1) * 0.06 * Math.exp(-t / 0.009);
        }
        data[i] = s * attack * tailFade * 0.72;
      }
    }
    return buf;
  }

  function ensureSampleBuffers(ac) {
    if (!waterSampleBuffer) waterSampleBuffer = buildWaterSampleBuffer(ac);
    if (!windSampleBuffer) windSampleBuffer = buildWindSampleBuffer(ac);
    if (!bellSampleBuffer) bellSampleBuffer = buildBellSampleBuffer(ac);
  }

  function ensureAmbientNodes(ac) {
    if (disposed || ambientNodes || ac.state !== "running") return ambientNodes;
    try {
      ensureSampleBuffers(ac);

      const masterGain = ac.createGain();
      masterGain.gain.setValueAtTime(0.9, ac.currentTime);
      masterGain.connect(ac.destination);

      // Flowing water stream sampler chain
      const waterSrc = ac.createBufferSource();
      waterSrc.buffer = waterSampleBuffer;
      waterSrc.loop = true;

      const waterFilter = ac.createBiquadFilter();
      waterFilter.type = "bandpass";
      waterFilter.frequency.setValueAtTime(760, ac.currentTime);
      waterFilter.Q.setValueAtTime(1.15, ac.currentTime);

      const waterPanner = ac.createStereoPanner ? ac.createStereoPanner() : null;
      const waterGain = ac.createGain();
      waterGain.gain.setValueAtTime(0.0001, ac.currentTime);

      waterSrc.connect(waterFilter);
      if (waterPanner) {
        waterFilter.connect(waterPanner);
        waterPanner.connect(waterGain);
      } else {
        waterFilter.connect(waterGain);
      }
      waterGain.connect(masterGain);
      waterSrc.start(0);

      // Soft breeze & bamboo texture sampler chain
      const windSrc = ac.createBufferSource();
      windSrc.buffer = windSampleBuffer;
      windSrc.loop = true;

      const windFilter = ac.createBiquadFilter();
      windFilter.type = "lowpass";
      windFilter.frequency.setValueAtTime(480, ac.currentTime);
      windFilter.Q.setValueAtTime(0.7, ac.currentTime);

      const windGain = ac.createGain();
      windGain.gain.setValueAtTime(0.0001, ac.currentTime);

      windSrc.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      windSrc.start(0);

      ambientNodes = {
        masterGain,
        waterSrc,
        waterFilter,
        waterPanner,
        waterGain,
        windSrc,
        windFilter,
        windGain,
      };
      return ambientNodes;
    } catch {
      return null;
    }
  }

  function playSampledBell(
    trigramIdx,
    { gainScale = 1.0, isSympathetic = false, energy = 0.55, pan = 0, fluxHz = 8.0 } = {},
  ) {
    const ac = ensureCtx(!isSympathetic);
    if (!ac) return;
    if (ac.state !== "running" && isSympathetic) return;

    try {
      ensureSampleBuffers(ac);
      const tri = TRIGRAMS[((trigramIdx % 8) + 8) % 8] || TRIGRAMS[4];
      const now = ac.currentTime;
      const normFlux = Math.max(0, Math.min(1, (fluxHz - 7.4) / 6.5));
      const baseRate =
        (tri.freq / 440) *
        (isSympathetic ? 2.0 : 1.0) *
        (1 + (energy - 0.5) * 0.025 + (normFlux - 0.5) * 0.012);

      const triggerVoice = (rate, peakGain, delaySec) => {
        const src = ac.createBufferSource();
        src.buffer = bellSampleBuffer;
        src.playbackRate.setValueAtTime(Math.max(0.25, Math.min(3.5, rate)), now + delaySec);

        const lp = ac.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(
          isSympathetic ? 2800 : 1450 + energy * 2100 + normFlux * 650,
          now + delaySec,
        );

        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.0001, now + delaySec);
        gain.gain.exponentialRampToValueAtTime(peakGain, now + delaySec + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delaySec + (isSympathetic ? 1.85 : 2.9));

        src.connect(lp);
        if (ac.createStereoPanner) {
          const panner = ac.createStereoPanner();
          panner.pan.setValueAtTime(Math.max(-0.7, Math.min(0.7, pan)), now + delaySec);
          lp.connect(panner);
          panner.connect(gain);
        } else {
          lp.connect(gain);
        }
        gain.connect(ac.destination);
        src.start(now + delaySec);
        src.stop(now + delaySec + 3.2);
      };

      const mainPeak = (isSympathetic ? 0.032 : 0.088) * gainScale;
      triggerVoice(baseRate, mainPeak, 0);

      // Sympathetic fifth overtone chime on manual / strong altar resonance
      if (!isSympathetic && gainScale >= 1.0) {
        triggerVoice(baseRate * 1.5, 0.038 * gainScale, 0.09);
      }
    } catch {
      // Ignore WebAudio voice allocation errors
    }
  }

  function playAltarPulse(trigramIdx, opts = {}) {
    const ac = ensureCtx(true);
    if (!ac) return;
    ensureAmbientNodes(ac);
    playSampledBell(trigramIdx, {
      gainScale: Math.min(1.25, Math.max(0.55, opts.strength ?? 1.0)),
      isSympathetic: false,
      energy: opts.energy ?? 0.65,
      pan: opts.pan ?? 0,
      fluxHz: opts.fluxHz ?? 8.2,
    });
  }

  function syncAmbient({
    active = false,
    proximity = 0,
    interactionWeight = 0,
    trigramIdx = 4,
    energy = 0.5,
    fluxHz = 7.83,
    waveSample = 0.5,
    pulseStrength = 0,
    pan = 0,
  }) {
    const ac = ensureCtx(false);
    if (!ac) return;
    if (!ambientNodes && active) {
      ensureAmbientNodes(ac);
    }
    if (!ambientNodes) return;

    const now = ac.currentTime;
    const tri = TRIGRAMS[((trigramIdx % 8) + 8) % 8] || TRIGRAMS[4];
    const normFlux = Math.max(0, Math.min(1, (fluxHz - 7.4) / 6.5));
    const presence = active ? Math.max(proximity, interactionWeight) : 0;

    // Synchronize sampled flowing water rate & resonant frequency with Bagua energy wave
    const targetWaterGain =
      presence * (0.068 + 0.038 * waveSample + 0.022 * normFlux + Math.min(0.035, pulseStrength * 0.025));
    const targetWaterRate = 0.86 + normFlux * 0.34 + (tri.freq / 587 - 0.5) * 0.08;
    const targetWaterFreq =
      420 + waveSample * 660 + (tri.freq - 260) * 1.15 + normFlux * 320 + pulseStrength * 280;
    const targetWaterQ = 1.0 + energy * 1.35;

    ambientNodes.waterGain.gain.setTargetAtTime(Math.max(0.0001, targetWaterGain), now, 0.08);
    ambientNodes.waterSrc.playbackRate.setTargetAtTime(
      Math.max(0.65, Math.min(1.45, targetWaterRate)),
      now,
      0.06,
    );
    ambientNodes.waterFilter.frequency.setTargetAtTime(
      Math.max(260, Math.min(2600, targetWaterFreq)),
      now,
      0.05,
    );
    ambientNodes.waterFilter.Q.setTargetAtTime(targetWaterQ, now, 0.08);
    if (ambientNodes.waterPanner) {
      ambientNodes.waterPanner.pan.setTargetAtTime(Math.max(-0.65, Math.min(0.65, pan)), now, 0.08);
    }

    // Soft breeze & bamboo texture synced to trigram energy
    const targetWindGain = presence * (0.024 + 0.022 * energy + normFlux * 0.01);
    const targetWindFreq = 320 + waveSample * 380 + normFlux * 240;
    ambientNodes.windGain.gain.setTargetAtTime(Math.max(0.0001, targetWindGain), now, 0.12);
    ambientNodes.windFilter.frequency.setTargetAtTime(targetWindFreq, now, 0.10);
  }

  function unlock() {
    const ac = ensureCtx(true);
    if (ac && ac.state === "running") {
      ensureAmbientNodes(ac);
    }
  }

  function playSpaceFoldSequence(fromIdx, toIdx) {
    const ac = ensureCtx(true);
    if (!ac) return;
    ensureAmbientNodes(ac);
    const fromTri = TRIGRAMS[((fromIdx % 8) + 8) % 8] || TRIGRAMS[4];
    const toTri = TRIGRAMS[((toIdx % 8) + 8) % 8] || TRIGRAMS[0];
    const now = ac.currentTime;

    // 1. Deep spatial gravity compression -> dimensional release sub-bass sweep
    const subOsc = ac.createOscillator();
    const subGain = ac.createGain();
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.setValueAtTime(3.6, now);
    filter.frequency.setValueAtTime(240, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.54);
    filter.frequency.exponentialRampToValueAtTime(260, now + 1.18);

    subOsc.type = "sawtooth";
    subOsc.frequency.setValueAtTime(132, now);
    subOsc.frequency.exponentialRampToValueAtTime(44, now + 0.54);
    subOsc.frequency.exponentialRampToValueAtTime(164, now + 0.82);
    subOsc.frequency.exponentialRampToValueAtTime(66, now + 1.18);

    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.115, now + 0.16);
    subGain.gain.exponentialRampToValueAtTime(0.16, now + 0.54);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.22);

    subOsc.connect(filter);
    filter.connect(subGain);
    subGain.connect(ac.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.24);

    // 2. Ethereal dual-harmonic Bagua rising warp sweep across stereo field
    const depOsc = ac.createOscillator();
    const depFifth = ac.createOscillator();
    const depGain = ac.createGain();
    const depPan = ac.createStereoPanner ? ac.createStereoPanner() : null;
    depOsc.type = "sine";
    depFifth.type = "triangle";
    depOsc.frequency.setValueAtTime(fromTri.freq, now);
    depOsc.frequency.exponentialRampToValueAtTime(toTri.freq * 2.0, now + 0.56);
    depFifth.frequency.setValueAtTime(fromTri.freq * 1.5, now);
    depFifth.frequency.exponentialRampToValueAtTime(toTri.freq * 3.0, now + 0.56);

    depGain.gain.setValueAtTime(0.0001, now);
    depGain.gain.exponentialRampToValueAtTime(0.075, now + 0.08);
    depGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);

    depOsc.connect(depGain);
    depFifth.connect(depGain);
    if (depPan) {
      depPan.pan.setValueAtTime(-0.55, now);
      depPan.pan.linearRampToValueAtTime(0.55, now + 0.56);
      depGain.connect(depPan);
      depPan.connect(ac.destination);
    } else {
      depGain.connect(ac.destination);
    }
    depOsc.start(now);
    depFifth.start(now);
    depOsc.stop(now + 0.64);
    depFifth.stop(now + 0.64);

    // 3. Singularity midpoint crystal shimmer + sampled Bagua temple bell arrival resonance (t = 0.54s)
    const arrOsc1 = ac.createOscillator();
    const arrOsc2 = ac.createOscillator();
    const arrGain = ac.createGain();
    arrOsc1.type = "sine";
    arrOsc2.type = "triangle";
    arrOsc1.frequency.setValueAtTime(toTri.freq * 2, now + 0.54);
    arrOsc1.frequency.exponentialRampToValueAtTime(toTri.freq * 2.5, now + 1.15);
    arrOsc2.frequency.setValueAtTime(toTri.freq * 3, now + 0.54);
    arrGain.gain.setValueAtTime(0.0001, now + 0.52);
    arrGain.gain.exponentialRampToValueAtTime(0.105, now + 0.60);
    arrGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.32);
    arrOsc1.connect(arrGain);
    arrOsc2.connect(arrGain);
    arrGain.connect(ac.destination);
    arrOsc1.start(now + 0.52);
    arrOsc2.start(now + 0.52);
    arrOsc1.stop(now + 1.35);
    arrOsc2.stop(now + 1.35);

    // Sampled bronze temple bell resonance burst on arrival
    setTimeout(() => {
      if (!disposed) {
        playSampledBell(toIdx, { gainScale: 1.08, isSympathetic: false, energy: 0.92, pan: -0.25, fluxHz: 12.5 });
      }
    }, 540);
    setTimeout(() => {
      if (!disposed) {
        playSampledBell((toIdx + 2) % 8, { gainScale: 0.62, isSympathetic: true, energy: 0.85, pan: 0.28, fluxHz: 11.2 });
      }
    }, 670);
  }

  function dispose() {
    disposed = true;
    if (ambientNodes) {
      try {
        ambientNodes.waterSrc.stop();
        ambientNodes.windSrc.stop();
        ambientNodes.masterGain.disconnect();
      } catch {
        // Ignore teardown errors
      }
      ambientNodes = null;
    }
    if (ctx) {
      try {
        ctx.close();
      } catch {
        // Ignore close errors
      }
      ctx = null;
    }
  }

  function playGrandResonanceChord() {
    const ac = ensureCtx(true);
    if (!ac) return;
    ensureAmbientNodes(ac);
    const chord = [0, 1, 2, 4, 5]; // Pentatonic Zhen-Xun-Li-Dui-Qian cascade
    chord.forEach((triIdx, stepIdx) => {
      setTimeout(() => {
        if (!disposed) {
          playSampledBell(triIdx, {
            gainScale: 1.15,
            isSympathetic: false,
            energy: 0.95,
            pan: (stepIdx - 2) * 0.25,
            fluxHz: 13.5,
          });
        }
      }, stepIdx * 120);
    });
  }

  return {
    unlock,
    playAltarPulse,
    playSampledBell,
    playGrandResonanceChord,
    syncAmbient,
    playSpaceFoldSequence,
    dispose,
  };
}

export function createBaguaMysticSystem({
  scene,
  baguaCenterX = 498.24,
  baguaCenterZ = 0,
  onTeleportSwap = null,
  onTeleportComplete = null,
  onAltarPulse = null,
  onPalaceActivated = null,
  onGrandResonance = null,
}) {
  const root = new THREE.Group();
  scene.add(root);

  const glowTex = makeSoftGlowTexture();
  const baguaTex = makeBaguaArrayTexture();
  const vortexTex = makeVortexBandTexture();
  const synth = createBaguaAudioSynth();

  // ── 1. Center Taiji Altar Rotating Bagua Light Array & Flowing Particles ───
  const altarGroup = new THREE.Group();
  altarGroup.position.set(baguaCenterX, 0, baguaCenterZ);
  root.add(altarGroup);

  const altarColor = new THREE.Color(TRIGRAMS[4].colorHex);
  const targetAltarColor = new THREE.Color(TRIGRAMS[4].colorHex);

  // Outer inscribed rotating rune disc (surrounds the 8.7m altar smoothly at r = 9.4..21.4m)
  const runeDiscGeo = new THREE.RingGeometry(9.4, 21.4, 96);
  runeDiscGeo.rotateX(-Math.PI / 2);
  const runeDiscMat = new THREE.MeshBasicMaterial({
    map: baguaTex,
    color: new THREE.Color("#64dcff"),
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const runeDiscMesh = new THREE.Mesh(runeDiscGeo, runeDiscMat);
  runeDiscMesh.position.y = 0.09;
  runeDiscMesh.raycast = () => {};
  altarGroup.add(runeDiscMesh);

  // Counter-rotating inner mystic halo ring
  const innerRingGeo = new THREE.RingGeometry(8.8, 9.8, 64);
  innerRingGeo.rotateX(-Math.PI / 2);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ffd776"),
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRingMesh.position.y = 0.11;
  innerRingMesh.raycast = () => {};
  altarGroup.add(innerRingMesh);

  // 8 directional trigram sector light wedges
  const sectorWedges = [];
  for (let i = 0; i < 8; i++) {
    const tri = TRIGRAMS[i];
    const wedgeGeo = new THREE.RingGeometry(10.6, 20.4, 12, 1, tri.angle - Math.PI / 8 + 0.03, Math.PI / 4 - 0.06);
    wedgeGeo.rotateX(-Math.PI / 2);
    const wedgeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(tri.colorHex),
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const wedge = new THREE.Mesh(wedgeGeo, wedgeMat);
    wedge.position.y = 0.075;
    wedge.raycast = () => {};
    altarGroup.add(wedge);
    sectorWedges.push({ mesh: wedge, mat: wedgeMat, baseColor: new THREE.Color(tri.colorHex) });
  }

  // Expanding pulse shockwave ring
  const pulseGeo = new THREE.RingGeometry(0.86, 1.0, 64);
  pulseGeo.rotateX(-Math.PI / 2);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#64dcff"),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const pulseRingMesh = new THREE.Mesh(pulseGeo, pulseMat);
  pulseRingMesh.position.y = 0.16;
  pulseRingMesh.visible = false;
  pulseRingMesh.raycast = () => {};
  altarGroup.add(pulseRingMesh);

  // Invisible hit cylinder on Taiji Altar so clicking / tapping triggers Bagua pulse
  const altarHitMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(10.6, 10.6, 10.4, 24),
    new THREE.MeshBasicMaterial({ visible: false }),
  );
  altarHitMesh.position.set(0, 5.2, 0);
  altarHitMesh.userData.baguaInteractKind = "altar";
  altarGroup.add(altarHitMesh);

  // 220 spiraling flowing light particles around Taiji Altar
  const PARTICLE_COUNT = 220;
  const pPos = new Float32Array(PARTICLE_COUNT * 3);
  const pCol = new Float32Array(PARTICLE_COUNT * 3);
  const pMeta = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const sector = i % 8;
    const baseR = 9.4 + (i % 13) * 0.94;
    const ang = (sector / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
    const y = 0.45 + Math.random() * 18.8;
    pMeta.push({
      sector,
      baseR,
      ang,
      y,
      speed: 0.42 + (i % 7) * 0.09,
      riseSpeed: 0.8 + (i % 5) * 0.32,
      phase: Math.random() * Math.PI * 2,
    });
    pPos[i * 3] = Math.cos(ang) * baseR;
    pPos[i * 3 + 1] = y;
    pPos[i * 3 + 2] = Math.sin(ang) * baseR;
    const c = new THREE.Color(TRIGRAMS[sector].colorHex);
    pCol[i * 3] = c.r;
    pCol[i * 3 + 1] = c.g;
    pCol[i * 3 + 2] = c.b;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const particleMat = new THREE.PointsMaterial({
    size: 0.92,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const altarParticles = new THREE.Points(particleGeo, particleMat);
  altarParticles.raycast = () => {};
  altarGroup.add(altarParticles);

  // ── 2. Linked Teleportation Portals (Main Island Plaza <-> Bagua Taiji Plaza)
  const baguaPortalXZ = getBaguaPortalPos(baguaCenterX, baguaCenterZ);
  const portals = [
    {
      id: "main_to_bagua",
      island: "main",
      x: MAIN_PORTAL_POS[0],
      z: MAIN_PORTAL_POS[1],
      destX: baguaPortalXZ[0],
      destZ: baguaPortalXZ[1],
      destIsland: "bagua",
      destArriveOffsetX: -3.2, // Step toward Taiji Altar when arriving on Bagua? Wait: baguaPortalXZ is at cx - 18, altar is at cx (+x)
      destArriveOffsetZ: 0,
      destYaw: -Math.PI * 0.5, // Look East toward Taiji Altar!
      label: "传送至 八卦城太极坛",
      trigramIdx: 4, // West/Dui resonance
      accentHex: "#64dcff",
    },
    {
      id: "bagua_to_main",
      island: "bagua",
      x: baguaPortalXZ[0],
      z: baguaPortalXZ[1],
      destX: MAIN_PORTAL_POS[0],
      destZ: MAIN_PORTAL_POS[1],
      destIsland: "main",
      destArriveOffsetX: -3.0,
      destArriveOffsetZ: -1.4,
      destYaw: 0.62,
      label: "传送回 主岛中央广场",
      trigramIdx: 0, // East/Zhen resonance
      accentHex: "#ffd56b",
    },
  ];
  // Arrival offset on Bagua Portal should move +3.2m East toward Taiji Altar (cx - 14.8, 0)
  portals[0].destArriveOffsetX = 3.2;

  const portalVisuals = portals.map((spec) => {
    const g = new THREE.Group();
    g.position.set(spec.x, 0, spec.z);
    root.add(g);

    const accent = new THREE.Color(spec.accentHex);
    const padMat = new THREE.MeshStandardMaterial({
      color: "#2b333d",
      roughness: 0.62,
      metalness: 0.25,
    });
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.55, 2.85, 0.22, 8), padMat);
    pad.position.y = 0.11;
    pad.rotation.y = Math.PI / 8;
    pad.receiveShadow = true;
    pad.castShadow = true;
    g.add(pad);

    const rimMat = new THREE.MeshStandardMaterial({
      color: "#eab84a",
      emissive: accent,
      emissiveIntensity: 0.55,
      roughness: 0.35,
      metalness: 0.45,
    });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(2.38, 0.09, 10, 8), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.rotation.z = Math.PI / 8;
    rim.position.y = 0.23;
    g.add(rim);

    // Glowing rune disc on portal floor
    const floorRuneGeo = new THREE.CircleGeometry(2.25, 48);
    floorRuneGeo.rotateX(-Math.PI / 2);
    const floorRuneMat = new THREE.MeshBasicMaterial({
      map: baguaTex,
      color: accent,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const floorRune = new THREE.Mesh(floorRuneGeo, floorRuneMat);
    floorRune.position.y = 0.245;
    g.add(floorRune);

    // Rising translucent vortex column
    const vortexMat = new THREE.MeshBasicMaterial({
      map: vortexTex,
      color: accent,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const vortexCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.78, 1.92, 4.4, 32, 1, true), vortexMat);
    vortexCyl.position.y = 2.42;
    g.add(vortexCyl);

    // Floating rotating portal rings + tilted gyroscopic Bagua astrolabe rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.94, 0.052, 8, 48),
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.65;
    g.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.56, 0.042, 8, 48),
      new THREE.MeshBasicMaterial({
        color: "#ffd875",
        transparent: true,
        opacity: 0.78,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 1.55;
    g.add(ring2);

    const gyroOuter = new THREE.Mesh(
      new THREE.TorusGeometry(2.38, 0.044, 8, 8),
      new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    gyroOuter.position.y = 2.72;
    gyroOuter.rotation.set(0.48, 0.2, 0.32);
    g.add(gyroOuter);

    const gyroInner = new THREE.Mesh(
      new THREE.TorusGeometry(1.92, 0.038, 8, 8),
      new THREE.MeshBasicMaterial({
        color: "#ffe184",
        transparent: true,
        opacity: 0.68,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    gyroInner.position.y = 2.72;
    gyroInner.rotation.set(-0.56, 0.35, -0.4);
    g.add(gyroInner);

    // Subtle vertical astral beacon beam so teleport portals read as dimensional gates from afar
    const beaconMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const beaconBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 1.35, 22, 16, 1, true), beaconMat);
    beaconBeam.position.y = 11.2;
    beaconBeam.raycast = () => {};
    g.add(beaconBeam);

    // Expanding ground rune ripple ring
    const groundWaveMat = new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const groundWaveGeo = new THREE.RingGeometry(0.88, 1.0, 48);
    groundWaveGeo.rotateX(-Math.PI / 2);
    const groundWave = new THREE.Mesh(groundWaveGeo, groundWaveMat);
    groundWave.position.y = 0.075;
    groundWave.raycast = () => {};
    g.add(groundWave);

    // 4 orbiting crystal satellites around the vortex column
    const satellites = [];
    for (let sIdx = 0; sIdx < 4; sIdx++) {
      const satMesh = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.22, 0),
        new THREE.MeshStandardMaterial({
          color: "#ffffff",
          emissive: sIdx % 2 === 0 ? accent : new THREE.Color("#ffd875"),
          emissiveIntensity: 1.85,
          roughness: 0.18,
          metalness: 0.25,
        }),
      );
      satMesh.raycast = () => {};
      g.add(satMesh);
      satellites.push(satMesh);
    }

    // Floating hovering octahedral crystal core overhead
    const coreMat = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      emissive: accent,
      emissiveIntensity: 1.75,
      roughness: 0.15,
      metalness: 0.2,
    });
    const coreMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), coreMat);
    coreMesh.position.y = 5.05;
    g.add(coreMesh);

    // Rising portal motes
    const mCount = 48;
    const mPos = new Float32Array(mCount * 3);
    for (let i = 0; i < mCount; i++) {
      const a = (i / mCount) * Math.PI * 2;
      const r = 1.05 + (i % 5) * 0.24;
      mPos[i * 3] = Math.cos(a) * r;
      mPos[i * 3 + 1] = (i / mCount) * 5.4;
      mPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const mGeo = new THREE.BufferGeometry();
    mGeo.setAttribute("position", new THREE.BufferAttribute(mPos, 3));
    const motes = new THREE.Points(
      mGeo,
      new THREE.PointsMaterial({
        size: 0.62,
        map: glowTex,
        color: accent,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    g.add(motes);

    // Clickable hit volume for Ortho/Pan/Orbit click-to-teleport
    const hitMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.8, 5.6, 16),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    hitMesh.position.y = 2.8;
    hitMesh.userData.baguaInteractKind = "portal";
    hitMesh.userData.portalId = spec.id;
    g.add(hitMesh);

    return {
      spec,
      group: g,
      floorRune,
      floorRuneMat,
      vortexCyl,
      vortexMat,
      ring1,
      ring2,
      gyroOuter,
      gyroInner,
      beaconBeam,
      beaconMat,
      groundWave,
      groundWaveMat,
      satellites,
      coreMesh,
      coreMat,
      motes,
      mGeo,
      hitMesh,
    };
  });

  // Glowing ground ley-line conduit connecting Bagua Portal to Taiji Altar
  const conduitGeo = new THREE.PlaneGeometry(14.8, 0.84);
  conduitGeo.rotateX(-Math.PI / 2);
  const conduitMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#64dcff"),
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const conduitMesh = new THREE.Mesh(conduitGeo, conduitMat);
  conduitMesh.position.set(baguaCenterX - 15.8, 0.065, baguaCenterZ);
  conduitMesh.raycast = () => {};
  root.add(conduitMesh);

  // ── 2b. Eight-Palace Trigram Mechanisms & Grand Ascendance Sky Column ─────
  const palaceGroup = new THREE.Group();
  root.add(palaceGroup);
  const palaceNodes = [];
  const palaceActivated = new Array(8).fill(false);
  let grandResonanceTimer = 0;
  let grandCompletedOnce = false;

  const grandBeamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ffe082"),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const grandBeamMesh = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 6.2, 86, 32, 1, true), grandBeamMat);
  grandBeamMesh.position.set(0, 43, 0);
  grandBeamMesh.visible = false;
  grandBeamMesh.raycast = () => {};
  altarGroup.add(grandBeamMesh);

  const grandInnerMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#64dcff"),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const grandInnerMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 2.2, 92, 24, 1, true), grandInnerMat);
  grandInnerMesh.position.set(0, 46, 0);
  grandInnerMesh.visible = false;
  grandInnerMesh.raycast = () => {};
  altarGroup.add(grandInnerMesh);

  function registerPalaces(palaceList = []) {
    while (palaceGroup.children.length > 0) {
      const ch = palaceGroup.children[0];
      palaceGroup.remove(ch);
    }
    palaceNodes.length = 0;

    for (const item of palaceList) {
      const triIdx =
        typeof item.trigramIdx === "number"
          ? ((item.trigramIdx % 8) + 8) % 8
          : PALACE_TRIGRAM_MAP[item.id];
      if (typeof triIdx !== "number") continue;
      const tri = TRIGRAMS[triIdx] || TRIGRAMS[0];
      const accent = new THREE.Color(tri.colorHex);

      // Place shrine sigil slightly toward the palace front courtyard along facing yaw
      const yaw = Number(item.yaw || 0);
      const sx = Number(item.x || 0) + Math.sin(yaw) * 7.8;
      const sz = Number(item.z || 0) + Math.cos(yaw) * 7.8;

      const pg = new THREE.Group();
      pg.position.set(sx, 0, sz);
      palaceGroup.add(pg);

      const sigilMat = new THREE.MeshBasicMaterial({
        map: baguaTex,
        color: accent,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const sigilDisc = new THREE.Mesh(new THREE.RingGeometry(1.15, 2.45, 36), sigilMat);
      sigilDisc.rotation.x = -Math.PI / 2;
      sigilDisc.position.y = 0.09;
      sigilDisc.raycast = () => {};
      pg.add(sigilDisc);

      const orbMat = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: accent,
        emissiveIntensity: 0.95,
        roughness: 0.2,
        metalness: 0.25,
      });
      const orbMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.46, 0), orbMat);
      orbMesh.position.y = 2.6;
      orbMesh.raycast = () => {};
      pg.add(orbMesh);

      const pillarMat = new THREE.MeshBasicMaterial({
        color: accent,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const pillarMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 1.35, 36, 16, 1, true), pillarMat);
      pillarMesh.position.y = 18;
      pillarMesh.visible = false;
      pillarMesh.raycast = () => {};
      pg.add(pillarMesh);

      const hitMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 4.8, 12),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      hitMesh.position.y = 2.4;
      hitMesh.userData.baguaInteractKind = "palace";
      hitMesh.userData.palaceId = item.id;
      hitMesh.userData.trigramIdx = triIdx;
      pg.add(hitMesh);

      palaceNodes.push({
        id: item.id,
        name: item.name || `${tri.name}宫`,
        palaceX: Number(item.x || 0),
        palaceZ: Number(item.z || 0),
        x: sx,
        z: sz,
        trigramIdx: triIdx,
        tri,
        group: pg,
        sigilDisc,
        sigilMat,
        orbMesh,
        orbMat,
        pillarMesh,
        pillarMat,
        hitMesh,
        burst: 0,
      });
    }
  }

  // ── 3. Camera-attached 3D Folded-Space Warp Tunnel + Hyperspace Stars + World Rift Bursts ──
  const foldUniforms = {
    uProgress: { value: 0 },
    uIntensity: { value: 0 },
    uFlash: { value: 0 },
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color("#64dcff") },
    uColorB: { value: new THREE.Color("#ffd56b") },
  };
  const warpRig = new THREE.Group();
  warpRig.visible = false;
  warpRig.renderOrder = 999;
  root.add(warpRig);

  const warpTunnelGeo = new THREE.CylinderGeometry(2.9, 0.42, 20, 48, 16, true);
  warpTunnelGeo.rotateX(Math.PI / 2); // Align tunnel axis along -Z/+Z
  const warpTunnelMat = new THREE.ShaderMaterial({
    uniforms: foldUniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform float uProgress;
      uniform float uIntensity;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec3 p = position;
        float pinch = sin(uv.y * 3.14159265) * uIntensity * 0.48;
        float twist = (uv.y - 0.5) * (2.4 * uIntensity);
        float c = cos(twist);
        float s = sin(twist);
        vec2 rxy = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
        p.xy = rxy * (1.0 - pinch * 0.48);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uProgress;
      uniform float uIntensity;
      uniform float uFlash;
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec2 vUv;
      void main() {
        float ang = vUv.x * 6.2831853 + vUv.y * 3.6 * uIntensity;
        float radial = vUv.y;
        float streaks = pow(max(0.0, sin(ang * 12.0 + uTime * 11.5)), 5.0);
        float fineStreaks = pow(max(0.0, cos(ang * 24.0 - uTime * 15.0 + radial * 10.0)), 6.0);
        float rings = pow(max(0.0, sin(radial * 28.0 - uProgress * 28.0)), 4.0);
        float octGrid = pow(max(0.0, cos(ang * 8.0) * sin(radial * 16.0 - uProgress * 20.0)), 3.0);
        float edgeMask = smoothstep(0.0, 0.28, radial) * (1.0 - smoothstep(0.75, 1.0, radial));
        vec3 mixCol = mix(uColorA, uColorB, 0.5 + 0.5 * sin(ang * 3.0 + uProgress * 9.42));
        vec3 prismCol = mix(mixCol, vec3(0.86, 0.58, 1.0), fineStreaks * 0.55);
        vec3 finalCol = mix(prismCol, vec3(1.0, 0.97, 0.86), uFlash * 0.65);
        float alpha = (uIntensity * (0.34 * rings + 0.72 * streaks + 0.45 * fineStreaks + 0.3 * octGrid) + uFlash * 0.35) * (0.32 + 0.68 * edgeMask);
        gl_FragColor = vec4(finalCol * (1.55 + uFlash * 0.9), clamp(alpha, 0.0, 0.96));
      }
    `,
  });
  const warpTunnelMesh = new THREE.Mesh(warpTunnelGeo, warpTunnelMat);
  warpTunnelMesh.position.set(0, 0, -8.5);
  warpTunnelMesh.renderOrder = 999;
  warpTunnelMesh.frustumCulled = false;
  warpTunnelMesh.raycast = () => {};
  warpRig.add(warpTunnelMesh);

  // Hyperspace high-velocity starlight / rune motes rushing toward camera inside warpRig
  const WARP_STAR_COUNT = 160;
  const warpStarPos = new Float32Array(WARP_STAR_COUNT * 3);
  const warpStarCols = new Float32Array(WARP_STAR_COUNT * 3);
  const warpStarMeta = [];
  for (let i = 0; i < WARP_STAR_COUNT; i++) {
    const ang = (i / WARP_STAR_COUNT) * Math.PI * 2 + (i % 7) * 0.31;
    const rad = 0.55 + ((i * 17) % 100) * 0.022;
    const zPos = -18 + ((i * 13) % 100) * 0.19;
    warpStarMeta.push({ ang, rad, speed: 18 + (i % 9) * 3.2 });
    warpStarPos[i * 3] = Math.cos(ang) * rad;
    warpStarPos[i * 3 + 1] = Math.sin(ang) * rad;
    warpStarPos[i * 3 + 2] = zPos;
    const isGold = i % 3 === 0;
    warpStarCols[i * 3] = isGold ? 1.0 : 0.45;
    warpStarCols[i * 3 + 1] = isGold ? 0.88 : 0.92;
    warpStarCols[i * 3 + 2] = isGold ? 0.48 : 1.0;
  }
  const warpStarGeo = new THREE.BufferGeometry();
  warpStarGeo.setAttribute("position", new THREE.BufferAttribute(warpStarPos, 3));
  warpStarGeo.setAttribute("color", new THREE.BufferAttribute(warpStarCols, 3));
  const warpStarMat = new THREE.PointsMaterial({
    size: 0.34,
    map: glowTex,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  });
  const warpStarPoints = new THREE.Points(warpStarGeo, warpStarMat);
  warpStarPoints.renderOrder = 1000;
  warpStarPoints.frustumCulled = false;
  warpStarPoints.raycast = () => {};
  warpRig.add(warpStarPoints);

  // World-space Departure & Arrival Dimensional Rift Shockwaves (spectacular in both Walk & Aerial Pan/Orbit!)
  function createDimensionalRiftBurst(colorHex) {
    const g = new THREE.Group();
    g.visible = false;
    root.add(g);

    const beamMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 3.6, 56, 24, 1, true), beamMat);
    beam.position.y = 28;
    beam.raycast = () => {};
    g.add(beam);

    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ffe58f"),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const ringGeo = new THREE.RingGeometry(0.76, 1.0, 48);
    ringGeo.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.12;
    ring.raycast = () => {};
    g.add(ring);

    const domeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorHex),
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dome = new THREE.Mesh(new THREE.IcosahedronGeometry(1.0, 1), domeMat);
    dome.position.y = 2.6;
    dome.raycast = () => {};
    g.add(dome);

    return { group: g, beam, beamMat, ring, ringMat, dome, domeMat };
  }
  const depBurst = createDimensionalRiftBurst("#64dcff");
  const arrBurst = createDimensionalRiftBurst("#ffd56b");

  // Secondary non-intrusive 3D rift burst pool for sky creatures (e.g., Dapeng Roc portal jumps)
  const creatureRiftSlots = [0, 1].map(() => ({
    active: false,
    elapsed: 0,
    duration: 1.05,
    fromBurst: createDimensionalRiftBurst("#ffd56b"),
    toBurst: createDimensionalRiftBurst("#64dcff"),
  }));

  function triggerCreaturePortalJump({
    fromX,
    fromY = 2.4,
    fromZ,
    toX,
    toY = 2.4,
    toZ,
    colorHex = "#ffd56b",
    viewerX = 0,
    viewerZ = 0,
    ogMode = false,
  }) {
    if (ogMode) return;
    const slot = creatureRiftSlots.find((s) => !s.active) || creatureRiftSlots[0];
    slot.active = true;
    slot.elapsed = 0;
    slot.duration = 1.05;
    slot.fromBurst.group.position.set(fromX, Math.max(0.2, fromY * 0.45), fromZ);
    slot.fromBurst.beamMat.color.set(colorHex);
    slot.fromBurst.domeMat.color.set(colorHex);
    slot.toBurst.group.position.set(toX, Math.max(0.2, toY * 0.45), toZ);
    slot.toBurst.beamMat.color.set("#64dcff");
    slot.toBurst.domeMat.color.set("#64dcff");

    // Audible subtle mythic bell & spatial shimmer only if the player is nearby
    const distFrom = Math.hypot(viewerX - fromX, viewerZ - fromZ);
    const distTo = Math.hypot(viewerX - toX, viewerZ - toZ);
    if (Math.min(distFrom, distTo) < 92) {
      try {
        synth.playSampledBell?.(activeIndex, {
          gainScale: 0.42,
          isSympathetic: true,
          energy: 0.78,
          pan: 0,
          fluxHz,
        });
      } catch {
        // ignore audio errors
      }
    }
  }

  // ── 4. Dynamic Runtime State & Physics Spring-Damper ───────────────────────
  let activeIndex = 4;
  let pulseWave = 0; // 0..1 expanding pulse animation
  let pulseBoost = 0; // lingering glow boost
  let playerProximity = 0; // 0..1 near Taiji Altar
  let lastAutoPulseAt = -10;
  let lastTriggerAt = -10;
  let wasNearAltar = false;

  const trigramEnergies = TRIGRAMS.map((_, i) => 0.48 + (i % 3) * 0.08);
  let lastWaveSample = 0.5;
  let prevWaveSample = 0.5;
  let fluxHz = 7.83;
  let interactionHoldSec = 0;
  let sympatheticChimeCooldown = 0;

  // Physics-simulated spring-damper for Folded Space ("折叠空间") warp
  const foldState = {
    active: false,
    elapsed: 0,
    duration: 1.18,
    swapped: false,
    portal: null,
    cooldownUntil: -10,
    // Spring variables: displacement `stretch` & `fovOffset`
    stretch: 0,
    stretchVel: 0,
    fovOffset: 0,
    fovVel: 0,
    rollOffset: 0,
    zoomMultiplier: 1,
    tunnelIntensity: 0,
  };

  function triggerAltarPulse(trigramIdx = activeIndex, strength = 1.0, playSound = true, { fromRemote = false } = {}) {
    const idx = ((trigramIdx % 8) + 8) % 8;
    activeIndex = idx;
    targetAltarColor.set(TRIGRAMS[idx].colorHex);
    pulseWave = 0.001;
    pulseBoost = Math.min(1.5, Math.max(pulseBoost, strength));
    trigramEnergies[idx] = Math.min(1.0, trigramEnergies[idx] + 0.42 * strength);
    if (playSound) {
      interactionHoldSec = Math.max(interactionHoldSec, strength >= 1.1 ? 12.5 : 6.5);
      synth.playAltarPulse(idx, {
        strength,
        energy: trigramEnergies[idx],
        pan: Math.cos(TRIGRAMS[idx].angle) * 0.38,
        fluxHz,
      });
    }
    if (!fromRemote) {
      onAltarPulse?.(TRIGRAMS[idx], strength, { fromRemote: false });
    }
  }

  function triggerGrandResonance({ playSound = true, fromRemote = false } = {}) {
    grandResonanceTimer = 7.2;
    grandCompletedOnce = true;
    pulseBoost = 1.5;
    pulseWave = 0.001;
    for (let i = 0; i < 8; i++) {
      trigramEnergies[i] = 1.0;
      palaceActivated[i] = true;
    }
    for (const pn of palaceNodes) {
      pn.burst = 1.2;
    }
    if (playSound) {
      interactionHoldSec = Math.max(interactionHoldSec, 15.0);
      synth.playGrandResonanceChord();
    }
    onGrandResonance?.({ fromRemote });
  }

  function activatePalace(trigramIdx, { fromRemote = false, palaceName = "", playSound = true } = {}) {
    const idx = ((trigramIdx % 8) + 8) % 8;
    const wasLit = Boolean(palaceActivated[idx]);
    palaceActivated[idx] = true;
    const node = palaceNodes.find((n) => n.trigramIdx === idx);
    if (node) {
      node.burst = 1.35;
    }
    triggerAltarPulse(idx, wasLit ? 1.15 : 1.4, playSound, { fromRemote: true });

    const activatedCount = palaceActivated.filter(Boolean).length;
    const isNowComplete = activatedCount === 8;
    const firstFullCompletion = isNowComplete && !grandCompletedOnce;

    onPalaceActivated?.({
      trigram: TRIGRAMS[idx],
      palaceName: palaceName || node?.name || `${TRIGRAMS[idx].name}宫`,
      wasLit,
      activatedCount,
      isComplete: isNowComplete,
      fromRemote,
    });

    if (firstFullCompletion) {
      triggerGrandResonance({ playSound, fromRemote });
    } else if (isNowComplete && grandResonanceTimer <= 0.5 && !wasLit) {
      triggerGrandResonance({ playSound, fromRemote });
    }

    return {
      trigramIdx: idx,
      wasLit,
      activatedCount,
      grandTriggered: firstFullCompletion,
    };
  }

  function startFoldTeleport(portalOrId, { simTime = performance.now() * 0.001, fromAutoWalk = false } = {}) {
    if (foldState.active) return false;
    if (fromAutoWalk && simTime < foldState.cooldownUntil) return false;

    const portal =
      typeof portalOrId === "string"
        ? portals.find((p) => p.id === portalOrId)
        : portalOrId;
    if (!portal) return false;

    const destIdx = portal.destIsland === "bagua" ? 4 : 0;
    foldState.active = true;
    foldState.elapsed = 0;
    foldState.swapped = false;
    foldState.portal = portal;
    foldState.stretch = 0;
    foldState.stretchVel = 5.4;
    foldState.fovOffset = 0;
    foldState.fovVel = 190;
    foldState.rollOffset = 0;
    foldState.cooldownUntil = simTime + 3.2;

    foldUniforms.uColorA.value.set(portal.accentHex);
    foldUniforms.uColorB.value.set(TRIGRAMS[destIdx].colorHex);
    foldUniforms.uFlash.value = 0;

    depBurst.group.position.set(portal.x, 0, portal.z);
    depBurst.beamMat.color.set(portal.accentHex);
    depBurst.domeMat.color.set(portal.accentHex);
    arrBurst.group.position.set(portal.destX, 0, portal.destZ);
    arrBurst.beamMat.color.set(TRIGRAMS[destIdx].colorHex);
    arrBurst.domeMat.color.set(TRIGRAMS[destIdx].colorHex);

    triggerAltarPulse(destIdx, 1.45, false);
    synth.playSpaceFoldSequence(portal.trigramIdx, destIdx);
    return true;
  }

  function step(dt, t, ctx = {}) {
    const {
      viewerX = 0,
      viewerZ = 0,
      fpActive = false,
      activeCamera = null,
      spaceFoldOverlayEl = null,
      ogMode = false,
    } = ctx;

    // Determine player/viewer distance to Bagua Center Taiji Altar
    const dx = viewerX - baguaCenterX;
    const dz = viewerZ - baguaCenterZ;
    const distToAltar = Math.hypot(dx, dz);
    const onBagua = viewerX >= baguaCenterX * 0.5;

    const nextProx = distToAltar < 60 ? Math.max(0, Math.min(1, 1 - (distToAltar - 11.5) / 48.5)) : 0;
    playerProximity += (nextProx - playerProximity) * Math.min(1, dt * 6.5);

    if (onBagua && distToAltar < 62 && distToAltar > 1.2) {
      const dirIdx = resolveTrigramIndexForPoint(dx, dz);
      if (dirIdx !== activeIndex && t - lastTriggerAt > 0.35) {
        activeIndex = dirIdx;
        targetAltarColor.set(TRIGRAMS[dirIdx].colorHex);
        if (playerProximity > 0.35 && t - lastAutoPulseAt > 1.15) {
          lastAutoPulseAt = t;
          triggerAltarPulse(dirIdx, 0.85, fpActive && !ogMode);
        }
      }
    } else if (!onBagua && !foldState.active) {
      // Gentle ambient rotation through trigrams when viewed from afar
      const ambientIdx = Math.floor((t * 0.25) % 8);
      if (ambientIdx !== activeIndex) {
        activeIndex = ambientIdx;
        targetAltarColor.set(TRIGRAMS[ambientIdx].colorHex);
      }
    }

    // Trigger welcome pulse on entering altar proximity zone (< 25.4m)
    const isNearNow = distToAltar < 25.4;
    if (isNearNow && !wasNearAltar && t - lastAutoPulseAt > 2.2) {
      lastAutoPulseAt = t;
      triggerAltarPulse(activeIndex, 1.15, fpActive && !ogMode);
    }
    wasNearAltar = isNearNow;

    altarColor.lerp(targetAltarColor, Math.min(1, dt * 5.2));
    runeDiscMat.color.copy(altarColor);
    conduitMat.color.copy(altarColor);

    // Rotate concentric Bagua rune rings
    const rotRate = 0.22 + playerProximity * 0.38 + pulseBoost * 0.45;
    runeDiscMesh.rotation.y += dt * rotRate;
    innerRingMesh.rotation.y -= dt * (rotRate * 1.45);
    innerRingMat.opacity = 0.55 + 0.28 * Math.sin(t * 2.8) + pulseBoost * 0.2;
    runeDiscMat.opacity = 0.48 + playerProximity * 0.26 + Math.min(0.26, pulseBoost * 0.22);

    // Pulse 8 directional trigram wedges & compute real-time D3 telemetry energies
    let energySum = 0;
    for (let i = 0; i < 8; i++) {
      const isAct = i === activeIndex;
      const harmonic =
        0.5 +
        0.22 * Math.sin(t * (1.45 + i * 0.17) + i * 0.85) +
        0.12 * Math.cos(t * 2.7 - i * 1.1);
      const targetE = Math.min(
        1.0,
        Math.max(
          0.18,
          harmonic + (isAct ? 0.22 + playerProximity * 0.16 + pulseBoost * 0.18 : 0),
        ),
      );
      trigramEnergies[i] += (targetE - trigramEnergies[i]) * Math.min(1, dt * 7.5);
      energySum += trigramEnergies[i];

      const sw = sectorWedges[i];
      sw.mat.opacity = isAct
        ? 0.26 + 0.14 * Math.sin(t * 4.5) + playerProximity * 0.18 + pulseBoost * 0.25
        : 0.06 + trigramEnergies[i] * 0.09;
    }

    prevWaveSample = lastWaveSample;
    lastWaveSample =
      0.5 +
      0.24 * Math.sin(t * 4.2 + activeIndex * 0.6) * (0.65 + pulseBoost * 0.5 + playerProximity * 0.35) +
      0.14 * Math.cos(t * 9.1);
    fluxHz = 7.4 + (energySum / 8) * 2.8 + pulseBoost * 3.1 + (foldState.active ? 5.5 : 0);

    // Environmental audio synchronization with Bagua directional energy fluctuation
    if (interactionHoldSec > 0) {
      interactionHoldSec = Math.max(0, interactionHoldSec - dt);
    }
    if (sympatheticChimeCooldown > 0) {
      sympatheticChimeCooldown = Math.max(0, sympatheticChimeCooldown - dt);
    }
    const interactionWeight = Math.min(1, interactionHoldSec / 3.0);
    const walkProximity = fpActive && onBagua ? playerProximity : 0;
    const ambientActive = !ogMode && (interactionHoldSec > 0 || walkProximity > 0.12);
    const spatialPan = Math.max(-0.65, Math.min(0.65, -dx / 28));
    synth.syncAmbient({
      active: ambientActive,
      proximity: walkProximity,
      interactionWeight,
      trigramIdx: activeIndex,
      energy: trigramEnergies[activeIndex],
      fluxHz,
      waveSample: Math.max(0, Math.min(1, lastWaveSample)),
      pulseStrength: pulseBoost,
      pan: spatialPan,
    });
    if (
      ambientActive &&
      (interactionHoldSec > 0 || walkProximity > 0.45) &&
      prevWaveSample < 0.72 &&
      lastWaveSample >= 0.72 &&
      sympatheticChimeCooldown <= 0
    ) {
      sympatheticChimeCooldown = 2.6;
      synth.playSampledBell(activeIndex, {
        gainScale: Math.max(0.45, Math.max(walkProximity, interactionWeight * 0.85)),
        isSympathetic: true,
        energy: trigramEnergies[activeIndex],
        pan: spatialPan,
        fluxHz,
      });
    }

    // Expanding radial pulse wave
    if (pulseWave > 0) {
      pulseWave += dt * 1.15;
      if (pulseWave >= 1) {
        pulseWave = 0;
        pulseRingMesh.visible = false;
      } else {
        pulseRingMesh.visible = true;
        const easeOut = 1 - Math.pow(1 - pulseWave, 3);
        const rad = 9.0 + easeOut * 20.0;
        pulseRingMesh.scale.setScalar(rad);
        pulseMat.color.copy(altarColor);
        pulseMat.opacity = (1 - pulseWave) * 0.82;
      }
    }
    pulseBoost = Math.max(0, pulseBoost - dt * 0.85);

    // Spiraling flowing light particles around Taiji Altar
    const posArr = particleGeo.attributes.position.array;
    const colArr = particleGeo.attributes.color.array;
    const pSpeedMult = 1 + playerProximity * 0.8 + pulseBoost * 1.2;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const m = pMeta[i];
      m.ang += dt * m.speed * pSpeedMult;
      m.y += dt * m.riseSpeed * pSpeedMult;
      if (m.y > 21.4) m.y = 0.3;
      const radialBreath = Math.sin(t * 2.4 + m.phase) * (0.45 + playerProximity * 0.45);
      const r = m.baseR + radialBreath + pulseWave * 1.25;
      posArr[i * 3] = Math.cos(m.ang) * r;
      posArr[i * 3 + 1] = m.y;
      posArr[i * 3 + 2] = Math.sin(m.ang) * r;

      // Blend particle hues smoothly toward active trigram when interacting / approaching
      const triColor = sectorWedges[m.sector].baseColor;
      const blendToActive = Math.min(0.85, playerProximity * 0.55 + pulseBoost * 0.5);
      colArr[i * 3] = triColor.r + (altarColor.r - triColor.r) * blendToActive;
      colArr[i * 3 + 1] = triColor.g + (altarColor.g - triColor.g) * blendToActive;
      colArr[i * 3 + 2] = triColor.b + (altarColor.b - triColor.b) * blendToActive;
    }
    particleGeo.attributes.position.needsUpdate = true;
    particleGeo.attributes.color.needsUpdate = true;
    particleMat.size = 0.88 + playerProximity * 0.25 + pulseBoost * 0.35;

    // Animate both linked portals (with overdrive surge when teleportation is active!)
    const portalOverdrive = foldState.active ? 1 + foldState.tunnelIntensity * 4.5 : 1;
    for (let pvIdx = 0; pvIdx < portalVisuals.length; pvIdx++) {
      const pv = portalVisuals[pvIdx];
      pv.floorRune.rotation.y += dt * 0.78 * portalOverdrive;
      pv.vortexCyl.rotation.y -= dt * 1.35 * portalOverdrive;
      pv.vortexMat.opacity = foldState.active ? 0.62 + 0.25 * foldState.tunnelIntensity : 0.48 + 0.08 * Math.sin(t * 2.4 + pvIdx);
      if (vortexTex) {
        vortexTex.offset.x = (t * 0.24) % 1;
      }
      pv.ring1.position.y = 0.68 + Math.sin(t * 2.2) * 0.16;
      pv.ring1.rotation.z += dt * 1.18 * portalOverdrive;
      pv.ring2.position.y = 1.65 + Math.cos(t * 2.6) * 0.22;
      pv.ring2.rotation.z -= dt * 1.48 * portalOverdrive;
      pv.gyroOuter.rotation.x += dt * 0.65 * portalOverdrive;
      pv.gyroOuter.rotation.y += dt * 0.92 * portalOverdrive;
      pv.gyroInner.rotation.z -= dt * 1.15 * portalOverdrive;
      pv.gyroInner.rotation.x -= dt * 0.55 * portalOverdrive;

      pv.beaconBeam.rotation.y += dt * 0.55 * portalOverdrive;
      pv.beaconMat.opacity = (0.14 + 0.05 * Math.sin(t * 2.1 + pvIdx)) * (foldState.active ? 1.8 : 1.0);

      const wavePhase = (t * 0.55 + pvIdx * 0.5) % 1;
      pv.groundWave.scale.setScalar(2.4 + wavePhase * 3.8);
      pv.groundWaveMat.opacity = (1 - wavePhase) * (foldState.active ? 0.75 : 0.42);

      for (let sIdx = 0; sIdx < pv.satellites.length; sIdx++) {
        const sat = pv.satellites[sIdx];
        const sAng = t * (1.8 * portalOverdrive) + (sIdx * Math.PI * 0.5);
        const sRad = 2.05 + Math.sin(t * 2.5 + sIdx) * 0.22;
        sat.position.set(
          Math.cos(sAng) * sRad,
          2.05 + Math.sin(t * 2.9 + sIdx * 1.57) * 1.15,
          Math.sin(sAng) * sRad,
        );
        sat.rotation.y += dt * 2.4;
      }

      pv.coreMesh.position.y = 5.05 + Math.sin(t * 2.8) * 0.24;
      pv.coreMesh.rotation.y += dt * 1.5 * portalOverdrive;
      pv.coreMesh.rotation.x = Math.sin(t * 1.7) * 0.25;
      pv.coreMat.emissiveIntensity = foldState.active ? 2.8 : 1.75;

      const mp = pv.mGeo.attributes.position.array;
      for (let i = 0; i < mp.length / 3; i++) {
        mp[i * 3 + 1] += dt * 2.15 * portalOverdrive;
        if (mp[i * 3 + 1] > 5.4) mp[i * 3 + 1] = 0.2;
      }
      pv.mGeo.attributes.position.needsUpdate = true;
    }

    // Animate Eight-Palace Trigram Shrines & Grand Ascendance Column
    for (const pn of palaceNodes) {
      const lit = Boolean(palaceActivated[pn.trigramIdx]);
      pn.burst = Math.max(0, pn.burst - dt * 0.72);
      pn.sigilDisc.rotation.y += dt * (lit ? 1.15 : 0.38);
      pn.sigilMat.opacity = lit
        ? 0.76 + 0.16 * Math.sin(t * 3.5 + pn.trigramIdx)
        : 0.34 + 0.12 * Math.sin(t * 2.0 + pn.trigramIdx);
      pn.orbMesh.position.y = 2.55 + Math.sin(t * 2.6 + pn.trigramIdx) * 0.22;
      pn.orbMesh.rotation.y += dt * (lit ? 2.1 : 0.7);
      pn.orbMesh.scale.setScalar((lit ? 1.28 : 0.88) + pn.burst * 0.32);
      pn.orbMat.emissiveIntensity = lit ? 2.0 + pn.burst * 1.4 : 0.85;
      if (lit) {
        pn.pillarMesh.visible = true;
        pn.pillarMesh.rotation.y -= dt * 1.4;
        pn.pillarMat.opacity = 0.24 + 0.1 * Math.sin(t * 3.8 + pn.trigramIdx) + pn.burst * 0.32;
      } else {
        pn.pillarMesh.visible = false;
      }
    }

    if (grandResonanceTimer > 0) {
      grandResonanceTimer = Math.max(0, grandResonanceTimer - dt);
      const fade = Math.min(1, grandResonanceTimer / 1.4) * Math.min(1, (7.2 - grandResonanceTimer) / 0.55);
      grandBeamMesh.visible = !ogMode;
      grandInnerMesh.visible = !ogMode;
      grandBeamMesh.rotation.y += dt * 1.8;
      grandInnerMesh.rotation.y -= dt * 2.6;
      grandBeamMat.opacity = 0.34 * fade + 0.08 * Math.sin(t * 8.0) * fade;
      grandInnerMat.opacity = 0.58 * fade;
    } else {
      grandBeamMesh.visible = false;
      grandInnerMesh.visible = false;
    }

    // ── Physics-Simulated "Folded Space" (折叠空间) Teleport Solver ─────────
    if (foldState.active) {
      foldState.elapsed += dt;
      const u = Math.min(1, foldState.elapsed / foldState.duration);
      const swapPoint = 0.48;

      // Spring-damper physical fold impulse: builds outward stretch up to singularity swapPoint, then snaps back with damped oscillation
      const targetStretch = u < swapPoint ? Math.sin((u / swapPoint) * (Math.PI * 0.5)) * 1.32 : 0;
      const kSpring = 122.0;
      const damping = 11.8;
      const accel = (targetStretch - foldState.stretch) * kSpring - foldState.stretchVel * damping;
      foldState.stretchVel += accel * dt;
      foldState.stretch += foldState.stretchVel * dt;

      const targetFov =
        u < swapPoint
          ? Math.pow(u / swapPoint, 1.32) * 44.0
          : -Math.sin(((u - swapPoint) / (1 - swapPoint)) * Math.PI) * 12.5;
      const fovAccel = (targetFov - foldState.fovOffset) * 145.0 - foldState.fovVel * 13.5;
      foldState.fovVel += fovAccel * dt;
      foldState.fovOffset += foldState.fovVel * dt;

      foldState.zoomMultiplier = Math.max(0.58, 1.0 - Math.max(0, foldState.stretch) * 0.34);
      const env = Math.sin(u * Math.PI);
      foldState.tunnelIntensity = Math.min(1, env * 1.32);
      const flashPeak = Math.exp(-Math.pow((u - swapPoint) / 0.085, 2));
      foldState.rollOffset = Math.sin(u * Math.PI * 2) * 0.042 * foldState.tunnelIntensity;

      if (!foldState.swapped && u >= swapPoint) {
        foldState.swapped = true;
        const p = foldState.portal;
        if (p && onTeleportSwap) {
          onTeleportSwap({
            destX: p.destX + (p.destArriveOffsetX || 0),
            destZ: p.destZ + (p.destArriveOffsetZ || 0),
            destIsland: p.destIsland,
            destYaw: p.destYaw,
            portal: p,
          });
        }
      }

      // World-space Departure Singularity Collapse (u < 0.56) & Arrival Rift Shockwave Nova (u >= 0.42)
      if (!ogMode) {
        if (u < 0.58) {
          const du = Math.min(1, u / 0.54);
          depBurst.group.visible = true;
          depBurst.beam.rotation.y += dt * 4.5;
          depBurst.beamMat.opacity = Math.sin(du * Math.PI) * 0.72;
          depBurst.ring.scale.setScalar(8.5 * (1 - du * 0.85) + 1.2);
          depBurst.ringMat.opacity = Math.sin(du * Math.PI) * 0.85;
          depBurst.dome.scale.setScalar(Math.max(0.25, (1 - du) * 5.8));
          depBurst.dome.rotation.y += dt * 3.8;
          depBurst.domeMat.opacity = Math.sin(du * Math.PI) * 0.68;
        } else {
          depBurst.group.visible = false;
        }

        if (u >= 0.42) {
          const au = Math.min(1, (u - 0.42) / 0.58);
          const easeOut = 1 - Math.pow(1 - au, 3);
          arrBurst.group.visible = true;
          arrBurst.beam.rotation.y -= dt * 3.8;
          arrBurst.beamMat.opacity = (1 - au) * 0.82;
          arrBurst.ring.scale.setScalar(1.4 + easeOut * 16.5);
          arrBurst.ringMat.opacity = (1 - au) * 0.92;
          arrBurst.dome.scale.setScalar(1.1 + easeOut * 8.4);
          arrBurst.dome.rotation.y -= dt * 2.6;
          arrBurst.domeMat.opacity = (1 - au) * 0.62;
        } else {
          arrBurst.group.visible = false;
        }
      } else {
        depBurst.group.visible = false;
        arrBurst.group.visible = false;
      }

      if (activeCamera) {
        warpRig.visible = !ogMode;
        warpRig.position.copy(activeCamera.position);
        warpRig.quaternion.copy(activeCamera.quaternion);
        foldUniforms.uProgress.value = u;
        foldUniforms.uIntensity.value = foldState.tunnelIntensity;
        foldUniforms.uFlash.value = flashPeak;
        foldUniforms.uTime.value = t;

        // Advance hyperspace starlight stream along tunnel Z toward camera
        const starArr = warpStarGeo.attributes.position.array;
        const starSpeedBoost = 1 + foldState.tunnelIntensity * 1.8 + flashPeak * 1.4;
        for (let i = 0; i < WARP_STAR_COUNT; i++) {
          const sm = warpStarMeta[i];
          let zVal = starArr[i * 3 + 2] + dt * sm.speed * starSpeedBoost;
          if (zVal > 0.6) zVal = -18.5;
          const squeeze = 1 - foldState.tunnelIntensity * 0.25;
          const rotAng = sm.ang + u * 2.2;
          starArr[i * 3] = Math.cos(rotAng) * sm.rad * squeeze;
          starArr[i * 3 + 1] = Math.sin(rotAng) * sm.rad * squeeze;
          starArr[i * 3 + 2] = zVal;
        }
        warpStarGeo.attributes.position.needsUpdate = true;
        warpStarMat.opacity = Math.min(0.95, foldState.tunnelIntensity * 0.85 + flashPeak * 0.35);
      }

      if (spaceFoldOverlayEl && !ogMode) {
        const stretchPx = Math.max(0, foldState.stretch);
        const blurPx = (foldState.tunnelIntensity * 6.2 + flashPeak * 4.5).toFixed(2);
        const scaleX = (1 + stretchPx * 0.14).toFixed(3);
        const scaleY = (1 - stretchPx * 0.055).toFixed(3);
        spaceFoldOverlayEl.hidden = false;
        spaceFoldOverlayEl.style.opacity = String(Math.min(0.98, foldState.tunnelIntensity * 0.88 + flashPeak * 0.42).toFixed(3));
        spaceFoldOverlayEl.style.transform = `scale(${scaleX}, ${scaleY})`;
        spaceFoldOverlayEl.style.backdropFilter = `blur(${blurPx}px)`;
        spaceFoldOverlayEl.style.setProperty("--fold-flash", flashPeak.toFixed(3));
        spaceFoldOverlayEl.style.setProperty("--fold-rot", `${(u * 210).toFixed(1)}deg`);
      }

      if (u >= 1) {
        foldState.active = false;
        foldState.fovOffset = 0;
        foldState.fovVel = 0;
        foldState.stretch = 0;
        foldState.stretchVel = 0;
        foldState.rollOffset = 0;
        foldState.zoomMultiplier = 1;
        foldState.tunnelIntensity = 0;
        warpRig.visible = false;
        depBurst.group.visible = false;
        arrBurst.group.visible = false;
        foldUniforms.uFlash.value = 0;
        if (spaceFoldOverlayEl) {
          spaceFoldOverlayEl.hidden = true;
          spaceFoldOverlayEl.style.opacity = "0";
          spaceFoldOverlayEl.style.transform = "scale(1, 1)";
          spaceFoldOverlayEl.style.backdropFilter = "none";
          spaceFoldOverlayEl.style.setProperty("--fold-flash", "0");
        }
        onTeleportComplete?.(foldState.portal);
      }
    } else {
      warpRig.visible = false;
      depBurst.group.visible = false;
      arrBurst.group.visible = false;
      if (spaceFoldOverlayEl && !spaceFoldOverlayEl.hidden) {
        spaceFoldOverlayEl.hidden = true;
      }
    }

    // Step world-space creature portal rift bursts (Dapeng Roc teleporting across islands)
    for (const slot of creatureRiftSlots) {
      if (!slot.active) {
        slot.fromBurst.group.visible = false;
        slot.toBurst.group.visible = false;
        continue;
      }
      slot.elapsed += dt;
      const cu = Math.min(1, slot.elapsed / slot.duration);
      const env = Math.sin(cu * Math.PI);
      const easeOut = 1 - Math.pow(1 - cu, 3);

      slot.fromBurst.group.visible = !ogMode && cu < 0.72;
      if (slot.fromBurst.group.visible) {
        const fu = Math.min(1, cu / 0.72);
        slot.fromBurst.beam.rotation.y += dt * 4.2;
        slot.fromBurst.beamMat.opacity = Math.sin(fu * Math.PI) * 0.62;
        slot.fromBurst.ring.scale.setScalar(7.4 * (1 - fu * 0.78) + 1.0);
        slot.fromBurst.ringMat.opacity = Math.sin(fu * Math.PI) * 0.78;
        slot.fromBurst.dome.scale.setScalar(Math.max(0.3, (1 - fu) * 5.2));
        slot.fromBurst.dome.rotation.y += dt * 3.4;
        slot.fromBurst.domeMat.opacity = Math.sin(fu * Math.PI) * 0.65;
      }

      slot.toBurst.group.visible = !ogMode && cu >= 0.12;
      if (slot.toBurst.group.visible) {
        const tu = Math.min(1, (cu - 0.12) / 0.88);
        slot.toBurst.beam.rotation.y -= dt * 3.6;
        slot.toBurst.beamMat.opacity = (1 - tu) * 0.72 * env;
        slot.toBurst.ring.scale.setScalar(1.6 + easeOut * 14.2);
        slot.toBurst.ringMat.opacity = (1 - tu) * 0.85;
        slot.toBurst.dome.scale.setScalar(1.2 + easeOut * 7.6);
        slot.toBurst.dome.rotation.y -= dt * 2.8;
        slot.toBurst.domeMat.opacity = (1 - tu) * 0.58;
      }

      if (cu >= 1) {
        slot.active = false;
        slot.fromBurst.group.visible = false;
        slot.toBurst.group.visible = false;
      }
    }
  }

  function getPortalNearPoint(x, z, maxRadius = 2.1) {
    for (const p of portals) {
      if (Math.hypot(x - p.x, z - p.z) <= maxRadius) {
        return p;
      }
    }
    return null;
  }

  function getNearPalace(x, z, maxRadius = 6.2) {
    let best = null;
    let bestDist = Infinity;
    for (const pn of palaceNodes) {
      const d = Math.hypot(x - pn.x, z - pn.z);
      if (d <= maxRadius && d < bestDist) {
        bestDist = d;
        best = pn;
      }
    }
    return best;
  }

  function isNearAltar(x, z, maxRadius = 15.0) {
    return Math.hypot(x - baguaCenterX, z - baguaCenterZ) <= maxRadius;
  }

  function pickInteractiveTarget(raycaster) {
    if (!raycaster) return null;
    const hitTargets = [
      altarHitMesh,
      ...portalVisuals.map((pv) => pv.hitMesh),
      ...palaceNodes.map((pn) => pn.hitMesh),
    ];
    const hits = raycaster.intersectObjects(hitTargets, false);
    if (!hits || hits.length === 0) return null;
    const obj = hits[0].object;
    if (obj.userData?.baguaInteractKind === "portal") {
      return {
        kind: "portal",
        portal: portals.find((p) => p.id === obj.userData.portalId) || null,
      };
    }
    if (obj.userData?.baguaInteractKind === "palace") {
      const node = palaceNodes.find((n) => n.id === obj.userData.palaceId);
      return {
        kind: "palace",
        palaceId: obj.userData.palaceId,
        trigramIdx: obj.userData.trigramIdx,
        palaceName: node?.name || "",
      };
    }
    if (obj.userData?.baguaInteractKind === "altar") {
      const hitPt = hits[0].point;
      const trigIdx = resolveTrigramIndexForPoint(hitPt.x - baguaCenterX, hitPt.z - baguaCenterZ);
      return { kind: "altar", trigramIdx: trigIdx };
    }
    return null;
  }

  function getTelemetry() {
    const tri = TRIGRAMS[activeIndex] || TRIGRAMS[4];
    const activatedCount = palaceActivated.filter(Boolean).length;
    return {
      trigrams: TRIGRAMS.map((item, idx) => ({
        ...item,
        energy: trigramEnergies[idx],
        active: idx === activeIndex,
        palaceLit: Boolean(palaceActivated[idx]),
      })),
      activeIndex,
      activeTrigram: tri,
      activatedCount,
      grandActive: grandResonanceTimer > 0,
      fluxHz,
      yinYangBalance: 0.5 + (trigramEnergies[2] - trigramEnergies[6]) * 0.35,
      proximity: playerProximity,
      pulseStrength: Math.min(1, pulseBoost),
      waveformSample: lastWaveSample,
      teleporting: foldState.active,
    };
  }

  function dispose() {
    synth.dispose();
    scene.remove(root);
    glowTex.dispose();
    baguaTex.dispose();
    vortexTex.dispose();
  }

  return {
    portals,
    step,
    registerPalaces,
    activatePalace,
    triggerGrandResonance,
    triggerAltarPulse,
    startFoldTeleport,
    triggerCreaturePortalJump,
    unlockAudio: () => synth.unlock(),
    getPortalNearPoint,
    getNearPalace,
    isNearAltar,
    pickInteractiveTarget,
    getTelemetry,
    getFoldState: () => foldState,
    getCooldownRemaining: (simTime) => Math.max(0, foldState.cooldownUntil - simTime),
    dispose,
  };
}
