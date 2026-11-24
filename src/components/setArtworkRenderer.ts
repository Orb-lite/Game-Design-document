import type { EquipmentSetSpec, QualityTierKey } from '../data/equipmentSets';

export type SetVisualFxType =
  | 'weathered'
  | 'tempered'
  | 'lightning'
  | 'frost'
  | 'embers'
  | 'miasma'
  | 'cursed'
  | 'royal-gold';

export interface SetStyleProfile {
  fxType: SetVisualFxType;
  armorTintHex: string;
  auraHex: string;
  secondaryAuraHex: string;
  saturation: number;
  contrast: number;
  brightness: number;
  sepia: number;
  zoom: number;
  panX: number;
  panY: number;
  materialLabel: string;
}

function hashSetId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getSetStyleProfile(set: EquipmentSetSpec): SetStyleProfile {
  const text = `${set.name} ${set.focusTarget} ${set.focusAdvantage} ${set.weaponName}`.toLowerCase();
  const variantIdx = (set.setNumber - 1) % 3; // 0, 1, 2 within each tier

  let fxType: SetVisualFxType = 'weathered';
  let armorTintHex = '#6C727A';
  let auraHex = '#8C929A';
  let secondaryAuraHex = '#484D54';
  let saturation = 0.85;
  let contrast = 1.05;
  let brightness = 1.0;
  let sepia = 0;
  let materialLabel = 'Forged Iron';

  if (set.tierKey === 'gris') {
    fxType = 'weathered';
    saturation = 0.38 + variantIdx * 0.12;
    contrast = 1.02 + variantIdx * 0.04;
    brightness = 0.92 + variantIdx * 0.03;
    sepia = variantIdx === 0 ? 0.32 : variantIdx === 1 ? 0.12 : 0.22;
    armorTintHex = variantIdx === 0 ? '#7E6553' : variantIdx === 1 ? '#6A7582' : '#736C64';
    auraHex = variantIdx === 0 ? '#9B7D65' : variantIdx === 1 ? '#8793A2' : '#968B7E';
    secondaryAuraHex = '#2E2B29';
    materialLabel =
      variantIdx === 0
        ? 'Rusted Iron & Worn Leather'
        : variantIdx === 1
        ? 'Dull Iron Chainmail'
        : 'Weathered Militia Bronze';
  } else if (set.tierKey === 'verde') {
    fxType = 'tempered';
    saturation = 0.95 + variantIdx * 0.1;
    contrast = 1.1;
    brightness = 1.02;
    armorTintHex = variantIdx === 0 ? '#4B8E64' : variantIdx === 1 ? '#628B57' : '#3E7B6E';
    auraHex = variantIdx === 0 ? '#5FBF7D' : variantIdx === 1 ? '#85C46C' : '#4CC2A8';
    secondaryAuraHex = '#1F422D';
    materialLabel =
      variantIdx === 0
        ? 'Tempered Green Steel'
        : variantIdx === 1
        ? 'Reinforced Olive Brigandine'
        : 'Tempered Copper-Green Alloy';
  } else if (set.tierKey === 'azul') {
    saturation = 1.15;
    contrast = 1.14;
    brightness = 1.04;

    if (text.includes('frost') || text.includes('ice') || text.includes('glacial')) {
      fxType = 'frost';
      armorTintHex = '#5CC8FF';
      auraHex = '#8CE2FF';
      secondaryAuraHex = '#19496B';
      materialLabel = 'Glacial Astral Frost Steel';
    } else if (text.includes('ember') || text.includes('fiery') || text.includes('cataclysm') || text.includes('flame')) {
      fxType = 'embers';
      armorTintHex = '#D97236';
      auraHex = '#FF8D42';
      secondaryAuraHex = '#5C2211';
      materialLabel = 'Ember-Infused Astral Alloy';
    } else if (text.includes('miasma') || text.includes('swamp') || text.includes('spore') || text.includes('sap')) {
      fxType = 'miasma';
      armorTintHex = '#38B87C';
      auraHex = '#5CE89A';
      secondaryAuraHex = '#174A33';
      materialLabel = 'Anti-Miasma Sealed Plates';
    } else {
      fxType = 'lightning';
      armorTintHex = '#3E8CE8';
      auraHex = '#68BCFF';
      secondaryAuraHex = '#163561';
      materialLabel = 'Voltaic Astral Runic Copper';
    }
  } else if (set.tierKey === 'morado') {
    fxType = text.includes('blood') || text.includes('crimson') || text.includes('stolen life')
      ? 'embers'
      : 'cursed';
    saturation = 1.12;
    contrast = 1.22;
    brightness = 0.96;
    if (fxType === 'embers') {
      armorTintHex = '#A83254';
      auraHex = '#E04D75';
      secondaryAuraHex = '#3E1123';
      materialLabel = 'Cursed Crimson Obsidian';
    } else {
      armorTintHex = variantIdx === 0 ? '#8E54D6' : variantIdx === 1 ? '#6E4AC4' : '#A966E0';
      auraHex = variantIdx === 0 ? '#B77BFF' : variantIdx === 1 ? '#9370FF' : '#D094FF';
      secondaryAuraHex = '#2A1447';
      materialLabel =
        variantIdx === 0
          ? 'Abyssal Runic Obsidian'
          : variantIdx === 1
          ? 'Catacomb Sepulchral Steel'
          : 'Spectral Cursed Plate & Weave';
    }
  } else {
    // 'dorado' - Royal Vestige (Gold)
    fxType = 'royal-gold';
    saturation = 1.25;
    contrast = 1.18;
    brightness = 1.07;
    sepia = 0.35;
    armorTintHex = variantIdx === 0 ? '#E0B43E' : variantIdx === 1 ? '#F0C95A' : '#C98F2C';
    auraHex = variantIdx === 0 ? '#FFD45C' : variantIdx === 1 ? '#FFE38A' : '#F5A623';
    secondaryAuraHex = '#4F350D';
    materialLabel =
      variantIdx === 0
        ? 'Royal Gold & Imperial Ebony'
        : variantIdx === 1
        ? 'Crowned Gold Filigree'
        : 'Incandescent Vestige Gold';
  }

  // Distinct framing subtly shifts between Attack, Defense, and Hybrid sets
  const zoom =
    set.focusType === 'Attack'
      ? 1.08 + variantIdx * 0.03
      : set.focusType === 'Defense'
      ? 1.0 + variantIdx * 0.02
      : 1.04 + variantIdx * 0.025;
  const panX = set.focusType === 'Attack' ? -0.04 : set.focusType === 'Defense' ? 0.04 : 0;
  const panY = variantIdx === 1 ? -0.02 : variantIdx === 2 ? 0.015 : 0;

  return {
    fxType,
    armorTintHex,
    auraHex,
    secondaryAuraHex,
    saturation,
    contrast,
    brightness,
    sepia,
    zoom,
    panX,
    panY,
    materialLabel,
  };
}

function drawFocusSigil(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  set: EquipmentSetSpec,
  profile: SetStyleProfile
) {
  ctx.save();
  const cx = width * 0.5;
  const cy = height * 0.48;

  ctx.strokeStyle = profile.auraHex;
  ctx.fillStyle = profile.auraHex;

  if (set.focusType === 'Attack') {
    // Dynamic offensive slash arcs & spearpoint chevron behind warrior
    ctx.globalAlpha = 0.24;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx - 40, cy, 240, -Math.PI * 0.72, Math.PI * 0.35);
    ctx.stroke();

    ctx.globalAlpha = 0.14;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(width * 0.14, height * 0.78);
    ctx.lineTo(width * 0.84, height * 0.16);
    ctx.stroke();

    // Inner cross-blade ring
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, 195, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (set.focusType === 'Defense') {
    // Fortified hexagonal bastion shield ward behind warrior
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 3.5;
    for (const r of [255, 215, 175]) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3 - Math.PI / 2;
        const px = cx + Math.cos(ang) * r;
        const py = cy + Math.sin(ang) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  } else {
    // Hybrid concentric Valdris oath rings
    ctx.globalAlpha = 0.22;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 235, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 2;
    ctx.setLineDash([16, 10]);
    ctx.beginPath();
    ctx.arc(cx, cy, 268, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4 cardinal diamond markers
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 4; i++) {
      const ang = (i * Math.PI) / 2;
      const mx = cx + Math.cos(ang) * 235;
      const my = cy + Math.sin(ang) * 235;
      ctx.beginPath();
      ctx.moveTo(mx, my - 10);
      ctx.lineTo(mx + 10, my);
      ctx.lineTo(mx, my + 10);
      ctx.lineTo(mx - 10, my);
      ctx.closePath();
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawElementalFx(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  profile: SetStyleProfile,
  rand: () => number
) {
  ctx.save();

  if (profile.fxType === 'lightning') {
    ctx.strokeStyle = profile.auraHex;
    ctx.shadowColor = profile.auraHex;
    ctx.shadowBlur = 14;
    for (let b = 0; b < 5; b++) {
      ctx.globalAlpha = 0.45 + rand() * 0.4;
      ctx.lineWidth = 1.5 + rand() * 2;
      let bx = width * (0.2 + rand() * 0.6);
      let by = height * (0.15 + rand() * 0.55);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      for (let seg = 0; seg < 6; seg++) {
        bx += (rand() - 0.5) * 85;
        by += (rand() - 0.3) * 65;
        ctx.lineTo(bx, by);
      }
      ctx.stroke();
    }
  } else if (profile.fxType === 'frost') {
    // Frost haze + crisp ice diamond shards
    for (let i = 0; i < 24; i++) {
      const px = width * (0.12 + rand() * 0.76);
      const py = height * (0.12 + rand() * 0.76);
      const sz = 4 + rand() * 9;
      ctx.globalAlpha = 0.28 + rand() * 0.45;
      ctx.fillStyle = '#C9F3FF';
      ctx.beginPath();
      ctx.moveTo(px, py - sz);
      ctx.lineTo(px + sz * 0.45, py);
      ctx.lineTo(px, py + sz);
      ctx.lineTo(px - sz * 0.45, py);
      ctx.closePath();
      ctx.fill();
    }
  } else if (profile.fxType === 'embers' || profile.fxType === 'royal-gold') {
    ctx.shadowColor = profile.auraHex;
    ctx.shadowBlur = 10;
    const count = profile.fxType === 'royal-gold' ? 42 : 34;
    for (let i = 0; i < count; i++) {
      const px = width * (0.1 + rand() * 0.8);
      const py = height * (0.1 + rand() * 0.8);
      const r = 1.5 + rand() * 3.5;
      ctx.globalAlpha = 0.35 + rand() * 0.55;
      ctx.fillStyle = i % 3 === 0 ? '#FFF2B2' : profile.auraHex;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (profile.fxType === 'miasma' || profile.fxType === 'cursed') {
    for (let i = 0; i < 16; i++) {
      const px = width * (0.18 + rand() * 0.64);
      const py = height * (0.35 + rand() * 0.55);
      const radius = 35 + rand() * 75;
      const mist = ctx.createRadialGradient(px, py, 2, px, py, radius);
      mist.addColorStop(0, profile.auraHex);
      mist.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.12 + rand() * 0.14;
      ctx.fillStyle = mist;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let s = 0; s < 22; s++) {
      ctx.globalAlpha = 0.4 + rand() * 0.4;
      ctx.fillStyle = profile.auraHex;
      ctx.beginPath();
      ctx.arc(width * (0.15 + rand() * 0.7), height * (0.18 + rand() * 0.68), 1.8 + rand() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (profile.fxType === 'tempered') {
    // Clean metallic forge glints
    for (let i = 0; i < 18; i++) {
      const px = width * (0.2 + rand() * 0.6);
      const py = height * (0.2 + rand() * 0.65);
      ctx.globalAlpha = 0.35 + rand() * 0.4;
      ctx.fillStyle = profile.auraHex;
      ctx.beginPath();
      ctx.arc(px, py, 1.5 + rand() * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

export function renderUniqueSetImage(
  sourceImg: HTMLImageElement,
  set: EquipmentSetSpec
): string {
  const width = 960;
  const height = 720;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceImg.src;

  const profile = getSetStyleProfile(set);
  const rand = seededRandom(hashSetId(set.id));

  // 1. Studio obsidian backdrop
  ctx.fillStyle = '#09090C';
  ctx.fillRect(0, 0, width, height);

  // 2. Volumetric tier-tinted studio spotlight
  const spotX = width * (set.focusType === 'Attack' ? 0.44 : set.focusType === 'Defense' ? 0.56 : 0.5);
  const spotY = height * 0.42;
  const spotlight = ctx.createRadialGradient(spotX, spotY, 30, spotX, spotY, 460);
  spotlight.addColorStop(0, profile.secondaryAuraHex);
  spotlight.addColorStop(0.55, 'rgba(14, 15, 22, 0.7)');
  spotlight.addColorStop(1, '#09090C');
  ctx.fillStyle = spotlight;
  ctx.fillRect(0, 0, width, height);

  // 3. Draw background Attack / Defense tactical sigil geometry
  drawFocusSigil(ctx, width, height, set, profile);

  // 4. Composite high-detail 3D base render cleanly preserving true PBR armor materials
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const octx = offscreen.getContext('2d');
  if (octx) {
    // Keep filters subtle so unique armor textures, gold filigree, and leather remain sharp
    const filterBrightness = Math.min(1.08, Math.max(0.95, profile.brightness));
    const filterContrast = Math.min(1.16, Math.max(1.02, profile.contrast));
    const filterSaturate = Math.min(1.18, Math.max(0.88, profile.saturation));
    octx.filter = `saturate(${filterSaturate}) contrast(${filterContrast}) brightness(${filterBrightness})`;
    const drawW = width * profile.zoom;
    const drawH = height * profile.zoom;
    const dx = (width - drawW) / 2 + profile.panX * width;
    const dy = (height - drawH) / 2 + profile.panY * height;
    octx.drawImage(sourceImg, dx, dy, drawW, drawH);
    octx.filter = 'none';

    // Gentle variant rim glaze so sets within the same tier still feel subtly distinct
    const tintStrength =
      profile.fxType === 'frost' || profile.fxType === 'embers' || profile.fxType === 'miasma'
        ? 0.22
        : 0.1;
    octx.globalCompositeOperation = 'color';
    octx.globalAlpha = tintStrength;
    octx.fillStyle = profile.armorTintHex;
    octx.fillRect(0, 0, width, height);

    octx.globalCompositeOperation = 'soft-light';
    octx.globalAlpha = 0.24;
    octx.fillStyle = profile.auraHex;
    octx.fillRect(0, 0, width, height);
    octx.globalCompositeOperation = 'source-over';
    octx.globalAlpha = 1;

    // Blend onto main stage preserving full detail
    ctx.globalCompositeOperation = 'lighten';
    ctx.drawImage(offscreen, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  // 5. Elemental / Tier foreground FX (lightning bolts, ice crystals, fire embers, cursed mist, royal gold dust)
  drawElementalFx(ctx, width, height, profile, rand);

  // 6. Subtle tier border vignette framing
  const edgeGrad = ctx.createRadialGradient(width / 2, height / 2, height * 0.38, width / 2, height / 2, width * 0.72);
  edgeGrad.addColorStop(0, 'rgba(0,0,0,0)');
  edgeGrad.addColorStop(1, 'rgba(6, 6, 9, 0.72)');
  ctx.fillStyle = edgeGrad;
  ctx.fillRect(0, 0, width, height);

  // Thin precision corner accent lines colored by Tier
  ctx.save();
  ctx.strokeStyle = set.tierHex as QualityTierKey | string;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  const m = 16;
  const len = 26;
  // Top-left & Top-right corners
  ctx.beginPath();
  ctx.moveTo(m, m + len);
  ctx.lineTo(m, m);
  ctx.lineTo(m + len, m);
  ctx.moveTo(width - m - len, m);
  ctx.lineTo(width - m, m);
  ctx.lineTo(width - m, m + len);
  ctx.stroke();
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.92);
}

const RENDERED_SET_CACHE = new Map<string, string>();
const BASE_IMAGE_CACHE = new Map<string, HTMLImageElement>();
const IN_FLIGHT_RENDERS = new Map<string, Promise<string>>();

export function loadBaseSetImage(src: string): Promise<HTMLImageElement> {
  const existing = BASE_IMAGE_CACHE.get(src);
  if (existing && existing.complete && existing.naturalWidth > 0) {
    return Promise.resolve(existing);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      BASE_IMAGE_CACHE.set(src, img);
      resolve(img);
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export async function getRenderedSetArtwork(set: EquipmentSetSpec): Promise<string> {
  const cached = RENDERED_SET_CACHE.get(set.id);
  if (cached) return cached;

  const pending = IN_FLIGHT_RENDERS.get(set.id);
  if (pending) return pending;

  const promise = loadBaseSetImage(set.designImageSrc)
    .then((img) => {
      const rendered = renderUniqueSetImage(img, set);
      RENDERED_SET_CACHE.set(set.id, rendered);
      return rendered;
    })
    .catch(() => set.designImageSrc)
    .finally(() => {
      IN_FLIGHT_RENDERS.delete(set.id);
    });

  IN_FLIGHT_RENDERS.set(set.id, promise);
  return promise;
}

export function getCachedSetArtwork(setId: string): string | undefined {
  return RENDERED_SET_CACHE.get(setId);
}

export function triggerFileDownload(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

