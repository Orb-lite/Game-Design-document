import { jsPDF } from 'jspdf';
import {
  BALANCE_POTIONS,
  BALANCE_RUNES,
  BALANCE_WEAPONS,
  BIOMES,
  CONTAINER_DROP_TABLE,
  DECOUPLED_SYSTEM_PILLARS,
  EQUIPMENT_SETS,
  ETHER_SEALS,
  FICHA_TECNICA,
  GAME_MODES,
  GENERATED_ASSETS,
  MATCH_ACTS,
  MATH_FORMULAS,
  PROFESSION_SET_LIST,
  PVE_DIFFICULTY_TIERS,
  QUALITY_TIERS,
  SEASONAL_LIVE_OPS,
  UE5_PILLARS,
  UNIVERSAL_SLOTS,
  VICTORY_HIERARCHY_RANKS,
  WARRIOR_ARCHETYPES,
  STUDIO_IDENTITY,
  CO_PITCHING_ALLIANCE,
} from '../data/gddData';
import { PROFESSION_3D_RENDER_ASSETS } from '../data/equipmentSets';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 12;
const CONTENT_W = PAGE_W - MARGIN_X * 2; // 186mm
const TOP_Y = 20;
const BOTTOM_Y = PAGE_H - 16; // 281mm

function pdfSafe(input: string): string {
  return input
    .replace(/→/g, '->')
    .replace(/←/g, '<-')
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/Δ/g, 'Delta ')
    .replace(/×/g, 'x')
    .replace(/•/g, '-')
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, '');
}

async function loadCroppedJpeg(
  src: string,
  targetAspect = 16 / 9,
  topFocus = false
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const outW = 960;
        const outH = Math.round(outW / targetAspect);
        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const srcAspect = img.naturalWidth / Math.max(1, img.naturalHeight);
        let sx = 0;
        let sy = 0;
        let sw = img.naturalWidth;
        let sh = img.naturalHeight;

        if (srcAspect > targetAspect) {
          sw = img.naturalHeight * targetAspect;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / targetAspect;
          sy = topFocus
            ? Math.max(0, (img.naturalHeight - sh) * 0.12)
            : (img.naturalHeight - sh) / 2;
        }

        ctx.fillStyle = '#0B0B0D';
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawPageChrome(doc: jsPDF, sectionHeader: string, pageNum: number) {
  doc.setFillColor(11, 11, 13);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  // Subtle perimeter frame
  doc.setDrawColor(42, 40, 36);
  doc.setLineWidth(0.3);
  doc.rect(7, 7, PAGE_W - 14, PAGE_H - 14);

  // Header line
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text('THE LAST RELIC  |  MASTER DESIGN DOCUMENT', MARGIN_X, 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 150, 139);
  doc.text(pdfSafe(sectionHeader), PAGE_W - MARGIN_X, 12.5, { align: 'right' });

  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, 14.5, PAGE_W - MARGIN_X, 14.5);

  // Footer line
  doc.setDrawColor(42, 42, 48);
  doc.setLineWidth(0.25);
  doc.line(MARGIN_X, PAGE_H - 12.5, PAGE_W - MARGIN_X, PAGE_H - 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(156, 150, 139);
  doc.text('Dimpz Games  ·  Original IP Edition  ·  World of Valdris  ·  Unreal Engine 5', MARGIN_X, PAGE_H - 8.5);
  doc.text(`Page ${pageNum}`, PAGE_W - MARGIN_X, PAGE_H - 8.5, { align: 'right' });
}

function drawSectionHeading(doc: jsPDF, y: number, kicker: string, title: string): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text(pdfSafe(kicker.toUpperCase()), MARGIN_X, y);

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(title), MARGIN_X, y + 6);

  doc.setDrawColor(56, 52, 44);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, y + 8.5, PAGE_W - MARGIN_X, y + 8.5);
  return y + 13;
}

export async function exportMainPageToPdf(
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalSteps = 13;
  let pageCount = 1;
  onProgress?.(0, totalSteps);

  // Preload visual assets used across pages
  const [
    heroArt,
    biomesArt,
    siegeArt,
    catacombsArt,
    gameLogoArt,
    studioLogoArt,
    stormMiasmaArt,
    stormWinterArt,
    stormSummerArt,
    skinWinterArt,
    skinSummerArt,
    eventHalloweenArt,
    skinHalloweenArt,
    ...profThumbs
  ] = await Promise.all([
    loadCroppedJpeg(GENERATED_ASSETS.heroCitadel, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.biomesVista, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.siegeBridge, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.catacombsAltar, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.gameLogo, 4 / 3, false),
    loadCroppedJpeg(GENERATED_ASSETS.studioLogo, 4 / 3, false),
    loadCroppedJpeg(GENERATED_ASSETS.stormMiasmaBaseline, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.stormWinterBlizzard, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.stormSummerHeat, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.skinDarkSantaFrost, 4 / 3, true),
    loadCroppedJpeg(GENERATED_ASSETS.skinSummerAshSolstice, 4 / 3, true),
    loadCroppedJpeg(GENERATED_ASSETS.eventHalloweenValdris, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.skinHalloweenWarden, 4 / 3, true),
    ...PROFESSION_SET_LIST.map((p) =>
      loadCroppedJpeg(PROFESSION_3D_RENDER_ASSETS[p.id], 4 / 3, true)
    ),
  ]);
  onProgress?.(2, totalSteps);

  const addNewPage = (headerLabel: string): number => {
    doc.addPage('a4', 'portrait');
    pageCount += 1;
    drawPageChrome(doc, headerLabel, pageCount);
    return TOP_Y;
  };

  // ============================================================================
  // PAGE 1: COVER HERO, KEY STATS, WORK SHEET & GAME MODES
  // ============================================================================
  drawPageChrome(doc, '01 · Overview, Registry & Game Modes', pageCount);
  let y = TOP_Y;

  // Hero visual banner
  const heroH = 56;
  doc.setFillColor(20, 20, 23);
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.45);
  doc.rect(MARGIN_X, y, CONTENT_W, heroH, 'FD');

  if (heroArt) {
    doc.addImage(heroArt, 'JPEG', MARGIN_X + 0.6, y + 0.6, CONTENT_W - 1.2, heroH - 1.2);
    doc.setFillColor(11, 11, 13);
    doc.setGState(doc.GState({ opacity: 0.78 }));
    doc.rect(MARGIN_X + 0.6, y + 0.6, 118, heroH - 1.2, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  if (gameLogoArt) {
    doc.setFillColor(12, 12, 15);
    doc.setDrawColor(200, 155, 60);
    doc.rect(MARGIN_X + 123, y + 5, 29, 22, 'FD');
    doc.addImage(gameLogoArt, 'JPEG', MARGIN_X + 123.5, y + 5.5, 28, 21);
  }
  if (studioLogoArt) {
    doc.setFillColor(12, 12, 15);
    doc.setDrawColor(140, 126, 98);
    doc.rect(MARGIN_X + 154.5, y + 5, 29, 22, 'FD');
    doc.addImage(studioLogoArt, 'JPEG', MARGIN_X + 155, y + 5.5, 28, 21);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(200, 155, 60);
  doc.text('DIMPZ GAMES  ·  ORIGINAL IP EDITION  ·  WORLD OF VALDRIS', MARGIN_X + 5, y + 9.5);

  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(246, 239, 226);
  doc.text('The Last Relic', MARGIN_X + 5, y + 19.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.4);
  doc.setTextColor(225, 220, 210);
  const heroDesc = doc.splitTextToSize(
    'Tactical TPS Battle Royale / Dark Medieval Action / PvPvE for 200 Players in Unreal Engine 5. Two hundred souls descend upon Valdris beneath The Abyssal Ash to claim The Iron Crown.',
    108
  );
  doc.text(heroDesc, MARGIN_X + 5, y + 26.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(200, 155, 60);
  doc.text('Figure 1: Key Art & Official Dimpz Games / Title Emblems', MARGIN_X + 5, y + heroH - 3.5);

  y += heroH + 4;

  // 4-Column Structural Strip
  const statStrip = [
    ['Match Scale', '200 Players'],
    ['5-Act Match Loop', '15–18 Minutes'],
    ['Gold Cap (Mastery)', '35% -> 50% @ Lv.100'],
    ['Engine & Replication', 'UE5 · 50–80m'],
  ];
  const statW = (CONTENT_W - 9) / 4;
  statStrip.forEach(([label, val], idx) => {
    const sx = MARGIN_X + idx * (statW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(48, 48, 56);
    doc.setLineWidth(0.25);
    doc.rect(sx, y, statW, 13, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(156, 150, 139);
    doc.text(label, sx + 3, y + 4.6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(idx === 2 ? 212 : 246, idx === 2 ? 175 : 239, idx === 2 ? 55 : 226);
    doc.text(val, sx + 3, y + 10.4);
  });
  y += 17.5;

  // Work Identification Sheet
  y = drawSectionHeading(doc, y, 'Registry & Technical Specification', 'Work Identification Sheet');
  doc.setFillColor(20, 20, 23);
  doc.setDrawColor(48, 48, 56);
  const fichaStartY = y;
  let fy = y + 3.6;
  FICHA_TECNICA.forEach((entry, i) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(156, 150, 139);
    doc.text(pdfSafe(entry.label), MARGIN_X + 4, fy);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(234, 230, 223);
    const valLines = doc.splitTextToSize(pdfSafe(entry.value), CONTENT_W - 44);
    doc.text(valLines, MARGIN_X + 40, fy);
    fy += Math.max(4.9, valLines.length * 3.6 + 1.5);
    if (i < FICHA_TECNICA.length - 1) {
      doc.setDrawColor(36, 36, 42);
      doc.line(MARGIN_X + 4, fy - 1.2, PAGE_W - MARGIN_X - 4, fy - 1.2);
    }
  });
  doc.setDrawColor(48, 48, 56);
  doc.rect(MARGIN_X, fichaStartY, CONTENT_W, fy - fichaStartY + 1, 'D');
  y = fy + 5;

  // Section 01: Universe & Game Modes
  y = drawSectionHeading(
    doc,
    y,
    '01 · Universe, Identity & Game Modes',
    'The Cursed Continent of Valdris — Oath & Wanderer Modes'
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(212, 206, 195);
  const loreLines = doc.splitTextToSize(
    'Across the cursed continent of Valdris, every blood moon unleashes The Abyssal Ash—an arcane storm born from the kingdom\'s ancient broken oath. No fixed classes or rigid bloodlines bind you: every player begins identically as a Warrior and forges their discipline through weapons and Ether Seals.',
    CONTENT_W
  );
  doc.text(loreLines, MARGIN_X, y);
  y += loreLines.length * 4 + 4;

  const modeW = (CONTENT_W - 4) / 2;
  GAME_MODES.forEach((mode, idx) => {
    const mx = MARGIN_X + idx * (modeW + 4);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(mx, y, modeW, 74, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(mode.name), mx + 4, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(mode.subtitle), mx + 4, y + 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(212, 206, 195);
    const sumLines = doc.splitTextToSize(pdfSafe(mode.summary), modeW - 8);
    doc.text(sumLines, mx + 4, y + 16.5);

    let ry = y + 16.5 + sumLines.length * 3.5 + 2.5;
    mode.rules.forEach((rule) => {
      doc.setFillColor(200, 155, 60);
      doc.rect(mx + 4, ry - 1.6, 1.2, 1.2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(184, 177, 166);
      const rLines = doc.splitTextToSize(pdfSafe(rule), modeW - 11);
      doc.text(rLines, mx + 7, ry);
      ry += rLines.length * 3.2 + 1.5;
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(200, 155, 60);
    doc.text(`Respawn: ${pdfSafe(mode.respawnWindow)}`, mx + 4, y + 66.5);
    doc.setTextColor(246, 239, 226);
    const winLines = doc.splitTextToSize(`Win: ${pdfSafe(mode.winCondition)}`, modeW - 8);
    doc.text(winLines, mx + 4, y + 70.5);
  });

  onProgress?.(3, totalSteps);

  // ============================================================================
  // PAGE 2: 5-ACT MATCH CYCLE & THRONE HALL CORONATION HIERARCHY
  // ============================================================================
  y = addNewPage('02 · 5-Act Match Loop & Coronation Hierarchy');
  y = drawSectionHeading(
    doc,
    y,
    '02 · Tactical Match Lifecycle',
    'The 5-Act Match Loop & Black Bell Sudden Death'
  );

  MATCH_ACTS.forEach((act) => {
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(act.respawnActive ? 60 : 120, act.respawnActive ? 60 : 52, act.respawnActive ? 68 : 48);
    doc.rect(MARGIN_X, y, CONTENT_W, 27, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(200, 155, 60);
    doc.text(`${act.number} — ${act.name}`, MARGIN_X + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(184, 177, 166);
    doc.text(
      pdfSafe(`${act.timeRange}  |  Survivors: ${act.survivors}  |  ${act.respawnStatus}`),
      PAGE_W - MARGIN_X - 4,
      y + 5.5,
      { align: 'right' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(234, 230, 223);
    const actSum = doc.splitTextToSize(pdfSafe(act.summary), CONTENT_W - 8);
    doc.text(actSum, MARGIN_X + 4, y + 10.5);

    let ky = y + 10.5 + actSum.length * 3.5 + 1.5;
    doc.setFontSize(6.9);
    doc.setTextColor(172, 166, 156);
    act.keyEvents.slice(0, 2).forEach((ev) => {
      const eLines = doc.splitTextToSize(`- ${pdfSafe(ev)}`, CONTENT_W - 10);
      doc.text(eLines, MARGIN_X + 5, ky);
      ky += eLines.length * 3.2;
    });

    y += 29.5;
  });

  y += 2;
  y = drawSectionHeading(
    doc,
    y,
    'Throne Hall Victory Honors & Progression Payout',
    'Winning Squad Coronation (King, Captain, Colonel, Sergeant) & Survival EXP'
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(212, 206, 195);
  const rankIntro = doc.splitTextToSize(
    'When a squad wins in Oath Mode, team members are ranked by Squad_Score = (Kills * 100) + (Assists * 45) + floor(Team_Healing_HP / 25). Every minute alive awards +20 EXP, alongside Kills (+140), Assists (+65), and Squad Healing Magic (+1 EXP per 15 HP healed).',
    CONTENT_W
  );
  doc.text(rankIntro, MARGIN_X, y);
  y += rankIntro.length * 3.8 + 4;

  const rankW = (CONTENT_W - 4) / 2;
  VICTORY_HIERARCHY_RANKS.forEach((rank, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const rx = MARGIN_X + col * (rankW + 4);
    const ry = y + row * 28;

    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(70, 62, 46);
    doc.rect(rx, ry, rankW, 25.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(rank.orderLabel.toUpperCase()), rx + 4, ry + 5);

    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(rank.title), rx + 4, ry + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(212, 175, 55);
    doc.text(`+${rank.expBonusPct}% Victory EXP`, rx + rankW - 4, ry + 11, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.9);
    doc.setTextColor(184, 177, 166);
    const ruleLines = doc.splitTextToSize(pdfSafe(rank.rule), rankW - 8);
    doc.text(ruleLines, rx + 4, ry + 16);
  });

  onProgress?.(4, totalSteps);

  // ============================================================================
  // PAGE 3: WARRIOR PROGRESSION, 6 SPECIALIZATIONS, LOOT TIERS & DROP RATES
  // ============================================================================
  y = addNewPage('03 · Decoupled Slots, Specializations & Loot Data');
  y = drawSectionHeading(
    doc,
    y,
    '03 · Decoupled Progression & Combat Mastery',
    'Base Warrior, Unrelated Stat Data Slots vs. Cosmetic Slots'
  );

  // Universal slots strip
  const slotW = (CONTENT_W - 6) / 3;
  UNIVERSAL_SLOTS.forEach((slot, idx) => {
    const sx = MARGIN_X + idx * (slotW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(48, 48, 56);
    doc.rect(sx, y, slotW, 24, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(200, 155, 60);
    const sHead = doc.splitTextToSize(pdfSafe(slot.slot), slotW - 6);
    doc.text(sHead, sx + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(184, 177, 166);
    const sBody = doc.splitTextToSize(pdfSafe(slot.detail), slotW - 6);
    doc.text(sBody, sx + 3, y + 10.5);
  });
  y += 28;

  // 6 Specializations with 3D render thumbnails (2 rows x 3 columns)
  const specW = (CONTENT_W - 6) / 3;
  const specH = 54;
  PROFESSION_SET_LIST.forEach((prof, idx) => {
    const spec = WARRIOR_ARCHETYPES[prof.id];
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const px = MARGIN_X + col * (specW + 3);
    const py = y + row * (specH + 3.5);

    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(px, py, specW, specH, 'FD');

    const thumb = profThumbs[idx];
    if (thumb) {
      doc.addImage(thumb, 'JPEG', px + 1, py + 1, specW - 2, 27);
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(spec.title), px + 3, py + 32.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.6);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(spec.spanishTitle), px + 3, py + 36.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(184, 177, 166);
    const dLines = doc.splitTextToSize(pdfSafe(spec.description), specW - 6);
    doc.text(dLines.slice(0, 3), px + 3, py + 40);
  });
  y += specH * 2 + 11;

  // 5 Quality Tiers + Container Drop Table
  y = drawSectionHeading(
    doc,
    y,
    '5 Quality Tiers & Loot Economy',
    'Grey Common -> Royal Gold (35% Base · 50% Omni-Mastery Lv.100)'
  );

  const tierW = (CONTENT_W - 8) / 5;
  QUALITY_TIERS.forEach((qt, idx) => {
    const tx = MARGIN_X + idx * (tierW + 2);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(58, 56, 62);
    doc.rect(tx, y, tierW, 24, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(qt.name), tx + 2.5, y + 5);

    doc.setFontSize(6.3);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(qt.badgeText), tx + 2.5, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(184, 177, 166);
    const qLines = doc.splitTextToSize(pdfSafe(qt.description), tierW - 5);
    doc.text(qLines.slice(0, 3), tx + 2.5, y + 13);
  });
  y += 28;

  // Container Drop Table
  doc.setFillColor(26, 26, 30);
  doc.rect(MARGIN_X, y, CONTENT_W, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(200, 155, 60);
  doc.text('Container / Source', MARGIN_X + 3, y + 4.4);
  doc.text('Grey', MARGIN_X + 66, y + 4.4);
  doc.text('Green', MARGIN_X + 78, y + 4.4);
  doc.text('Blue', MARGIN_X + 91, y + 4.4);
  doc.text('Purple', MARGIN_X + 103, y + 4.4);
  doc.text('Gold', MARGIN_X + 117, y + 4.4);
  doc.text('Affix Rule', MARGIN_X + 129, y + 4.4);
  y += 6.5;

  CONTAINER_DROP_TABLE.forEach((row, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 17 : 21, idx % 2 === 0 ? 17 : 21, idx % 2 === 0 ? 20 : 25);
    doc.rect(MARGIN_X, y, CONTENT_W, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.7);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(row.container), MARGIN_X + 3, y + 5.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(184, 177, 166);
    doc.text(`${row.gris}%`, MARGIN_X + 66, y + 5.2);
    doc.text(`${row.verde}%`, MARGIN_X + 78, y + 5.2);
    doc.text(`${row.azul}%`, MARGIN_X + 91, y + 5.2);
    doc.text(`${row.morado}%`, MARGIN_X + 103, y + 5.2);
    doc.setTextColor(212, 175, 55);
    doc.text(`${row.dorado}%`, MARGIN_X + 117, y + 5.2);

    doc.setTextColor(172, 166, 156);
    const affLines = doc.splitTextToSize(pdfSafe(row.affixRule), 55);
    doc.text(affLines[0] ?? '', MARGIN_X + 129, y + 5.2);
    y += 8;
  });

  onProgress?.(5, totalSteps);

  // ============================================================================
  // PAGES 4 & 5: COMPLETE 90 MODULAR 3D ARMOR SETS (15 SETS x 6 SPECIALIZATIONS)
  // ============================================================================
  const renderProfessionBatch = (
    profIds: string[],
    headerText: string,
    subTitle: string
  ) => {
    y = addNewPage(headerText);
    y = drawSectionHeading(
      doc,
      y,
      '03B · Logical Gear Sets (Stats) + 90 Episode I Launch Skins (Visual Only — Unrelated)',
      subTitle
    );

    profIds.forEach((pid) => {
      const profInfo = PROFESSION_SET_LIST.find((p) => p.id === pid);
      const sets = EQUIPMENT_SETS.filter((s) => s.professionId === pid);
      if (!profInfo || sets.length === 0) return;

      // Profession subheader bar
      doc.setFillColor(28, 25, 20);
      doc.setDrawColor(200, 155, 60);
      doc.setLineWidth(0.25);
      doc.rect(MARGIN_X, y, CONTENT_W, 6.2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(246, 239, 226);
      doc.text(
        pdfSafe(`${profInfo.label} (15 Progressive Sets · ${profInfo.skillLabel})`),
        MARGIN_X + 3,
        y + 4.3
      );
      y += 6.2;

      // Column headers
      doc.setFillColor(20, 20, 24);
      doc.rect(MARGIN_X, y, CONTENT_W, 4.8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(156, 150, 139);
      doc.text('#', MARGIN_X + 2, y + 3.4);
      doc.text('Set Name', MARGIN_X + 8, y + 3.4);
      doc.text('Tier', MARGIN_X + 52, y + 3.4);
      doc.text('Focus', MARGIN_X + 70, y + 3.4);
      doc.text('Req (Lv/Mst/Def)', MARGIN_X + 84, y + 3.4);
      doc.text('Atk / Arm+Shd (Blk)', MARGIN_X + 112, y + 3.4);
      doc.text('Set Bonus / Perk', MARGIN_X + 144, y + 3.4);
      y += 4.8;

      sets.forEach((s, rIdx) => {
        doc.setFillColor(rIdx % 2 === 0 ? 14 : 18, rIdx % 2 === 0 ? 14 : 18, rIdx % 2 === 0 ? 17 : 22);
        doc.rect(MARGIN_X, y, CONTENT_W, 4.25, 'F');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.8);
        doc.setTextColor(156, 150, 139);
        doc.text(String(s.setNumber).padStart(2, '0'), MARGIN_X + 2, y + 3.05);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(234, 230, 223);
        doc.text(pdfSafe(s.name).slice(0, 28), MARGIN_X + 8, y + 3.05);

        doc.setFont('helvetica', 'normal');
        const shortTier =
          s.tierKey === 'gris'
            ? 'Grey'
            : s.tierKey === 'verde'
              ? 'Green'
              : s.tierKey === 'azul'
                ? 'Blue'
                : s.tierKey === 'morado'
                  ? 'Purple'
                  : 'Gold';
        doc.setTextColor(
          s.tierKey === 'dorado' ? 212 : 184,
          s.tierKey === 'dorado' ? 175 : 177,
          s.tierKey === 'dorado' ? 55 : 166
        );
        doc.text(shortTier, MARGIN_X + 52, y + 3.05);

        doc.setTextColor(200, 155, 60);
        doc.text(s.focusType, MARGIN_X + 70, y + 3.05);

        doc.setTextColor(184, 177, 166);
        doc.text(
          `Lv.${s.minGeneralLevel} / ${s.minAttackMastery} / ${s.minDefenseLevel}`,
          MARGIN_X + 84,
          y + 3.05
        );
        doc.text(
          `${s.weaponAttack} Atk | ${s.armorDefense + s.shieldDefense} Def (${s.baseShieldBlockPct}%)`,
          MARGIN_X + 112,
          y + 3.05
        );

        doc.setTextColor(212, 206, 195);
        doc.text(pdfSafe(s.focusAdvantage).slice(0, 34), MARGIN_X + 144, y + 3.05);
        y += 4.25;
      });
      y += 3.2;
    });
  };

  renderProfessionBatch(
    ['sword-warrior', 'club-warrior', 'axe-warrior'],
    '03B · 45 Melee Logical Sets & Launch Skins',
    'Sword, Club & Axe — Pure Stat Data Unlinked From Visual Skins'
  );
  onProgress?.(6, totalSteps);

  renderProfessionBatch(
    ['archer', 'wizard', 'druid'],
    '03B · 45 Ranged & Arcane Logical Sets & Launch Skins',
    'Dual-Crossbow Archer (1/Hand), Wizard & Druid (Data vs. Visuals)'
  );
  onProgress?.(7, totalSteps);

  // ============================================================================
  // PAGE 6: SECTION 04 (8 ETHER SEALS) & SECTION 05 (4 PVE TIERS)
  // ============================================================================
  y = addNewPage('04 · 8 Ether Seals & 05 · PvE Difficulty Tiers');
  y = drawSectionHeading(
    doc,
    y,
    '04 · Arcane Magic System (3 Equippable Slots)',
    'The 8 Ether Seals — Direct Magic Level Scaling'
  );

  const sealW = (CONTENT_W - 4) / 2;
  ETHER_SEALS.forEach((seal, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sx = MARGIN_X + col * (sealW + 4);
    const sy = y + row * 24.5;

    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(50, 50, 58);
    doc.rect(sx, sy, sealW, 22, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(`${seal.name} (${seal.alias})`), sx + 3.5, sy + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(200, 155, 60);
    doc.text(
      pdfSafe(`${seal.category}  |  ${seal.timing}  |  ${seal.etherCost} Ether`),
      sx + 3.5,
      sy + 9
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(184, 177, 166);
    const eLines = doc.splitTextToSize(pdfSafe(seal.effect), sealW - 7);
    doc.text(eLines.slice(0, 3), sx + 3.5, sy + 12.8);
  });

  y += 24.5 * 4 + 4;
  y = drawSectionHeading(
    doc,
    y,
    '05 · PvPvE Monster Ecosystem (Lv_avg + 100 Scaling)',
    '4 PvE Difficulty Tiers & Drop Distributions'
  );

  PVE_DIFFICULTY_TIERS.forEach((tier) => {
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(MARGIN_X, y, CONTENT_W, 26.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(`${tier.difficulty} (${tier.acts})`), MARGIN_X + 4, y + 5.2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(212, 175, 55);
    doc.text(
      `Drops: G ${tier.drops.gris}% | Gr ${tier.drops.verde}% | B ${tier.drops.azul}% | P ${tier.drops.morado}% | Gold ${tier.drops.dorado}%`,
      PAGE_W - MARGIN_X - 4,
      y + 5.2,
      { align: 'right' }
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(`Enemies: ${tier.enemies}`), MARGIN_X + 4, y + 9.8);

    doc.setTextColor(184, 177, 166);
    const mechLines = doc.splitTextToSize(
      pdfSafe(`Mechanic: ${tier.chestMechanic}  |  Wanderer: ${tier.scalingErrante} · Oath: ${tier.scalingJuramento}`),
      CONTENT_W - 8
    );
    doc.text(mechLines, MARGIN_X + 4, y + 14);

    doc.setTextColor(212, 206, 195);
    doc.text(
      pdfSafe(`PvP Alert: ${tier.pvpRisk}  |  Guaranteed: ${tier.guaranteedRule}`),
      MARGIN_X + 4,
      y + 22.8
    );
    y += 28.8;
  });

  onProgress?.(8, totalSteps);

  // ============================================================================
  // PAGE 7: SECTION 06 (4 BIOMES OF VALDRIS) & SECTION 07A (MATH FORMULAS)
  // ============================================================================
  y = addNewPage('06 · Strategic Biomes & 07 · Server Math Formulas');
  y = drawSectionHeading(
    doc,
    y,
    '06 · World Design — Multi-Level Battlefield',
    'The 4 Strategic Biomes of Valdris'
  );

  // Biome image row (3 crisp frames)
  const imgBoxW = (CONTENT_W - 6) / 3;
  [
    { img: siegeArt, label: 'The Citadel of Valdris' },
    { img: catacombsArt, label: 'Catacombs of the Nameless King' },
    { img: biomesArt, label: 'Miasma Marshes & Forest of Spires' },
  ].forEach((bImg, idx) => {
    const bx = MARGIN_X + idx * (imgBoxW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(bx, y, imgBoxW, 32, 'FD');
    if (bImg.img) {
      doc.addImage(bImg.img, 'JPEG', bx + 0.8, y + 0.8, imgBoxW - 1.6, 25.5);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(bImg.label), bx + 2.5, y + 29.8);
  });
  y += 35;

  const biomeW = (CONTENT_W - 4) / 2;
  BIOMES.forEach((b, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = MARGIN_X + col * (biomeW + 4);
    const by = y + row * 28;

    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(48, 48, 56);
    doc.rect(bx, by, biomeW, 25.8, 'FD');

    doc.setFont('times', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(b.name), bx + 3.5, by + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.3);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(`${b.location} · ${b.acts} · ${b.threat}`), bx + 3.5, by + 8.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(184, 177, 166);
    const descL = doc.splitTextToSize(pdfSafe(`${b.description} ${b.tacticalNotes}`), biomeW - 7);
    doc.text(descL.slice(0, 3), bx + 3.5, by + 12.8);
  });
  y += 28 * 2 + 3;

  y = drawSectionHeading(
    doc,
    y,
    '07 · Deterministic Server Specifications',
    'Combat, Armor Mitigation, Coronation & Time Alive Math Formulas'
  );

  MATH_FORMULAS.forEach((f) => {
    doc.setFillColor(18, 18, 21);
    doc.setDrawColor(46, 46, 54);
    doc.rect(MARGIN_X, y, CONTENT_W, 11.4, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(f.title), MARGIN_X + 3, y + 3.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(6.1);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(f.formula), MARGIN_X + 3, y + 6.9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(172, 166, 156);
    const nLines = doc.splitTextToSize(pdfSafe(f.note), CONTENT_W - 6);
    doc.text(nLines[0] ?? '', MARGIN_X + 3, y + 10.1);
    y += 12.2;
  });

  onProgress?.(9, totalSteps);

  // ============================================================================
  // PAGE 8: BALANCE TABLES (RUNES, WEAPONS, POTIONS) & UE5 ARCHITECTURE
  // ============================================================================
  y = addNewPage('07B · Balance Tables & 08 · UE5 Architecture');
  y = drawSectionHeading(
    doc,
    y,
    '07B · Verified Balance Telemetry Tables',
    'Ether Runes, Signature Weapons & Belt Potions'
  );

  // 1. Weapons Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text('WEAPONS BALANCE TABLE (BY MASTERY SKILL)', MARGIN_X, y);
  y += 2;

  doc.setFillColor(26, 26, 30);
  doc.rect(MARGIN_X, y, CONTENT_W, 5.2, 'F');
  doc.setFontSize(6.2);
  doc.setTextColor(184, 177, 166);
  doc.text('Weapon Name', MARGIN_X + 2.5, y + 3.6);
  doc.text('Skill', MARGIN_X + 58, y + 3.6);
  doc.text('Tier', MARGIN_X + 82, y + 3.6);
  doc.text('Atk', MARGIN_X + 94, y + 3.6);
  doc.text('Light Attack', MARGIN_X + 104, y + 3.6);
  doc.text('Special Attack', MARGIN_X + 130, y + 3.6);
  y += 5.2;

  BALANCE_WEAPONS.forEach((w, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 15 : 19, idx % 2 === 0 ? 15 : 19, idx % 2 === 0 ? 18 : 23);
    doc.rect(MARGIN_X, y, CONTENT_W, 4.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(w.name), MARGIN_X + 2.5, y + 3.4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(184, 177, 166);
    doc.text(pdfSafe(w.skillLabel), MARGIN_X + 58, y + 3.4);
    doc.setTextColor(200, 155, 60);
    doc.text(w.tier, MARGIN_X + 82, y + 3.4);
    doc.setTextColor(234, 230, 223);
    doc.text(String(w.attackLevel), MARGIN_X + 94, y + 3.4);
    doc.setTextColor(172, 166, 156);
    doc.text(pdfSafe(w.lightAttack), MARGIN_X + 104, y + 3.4);
    doc.text(pdfSafe(w.specialAttack), MARGIN_X + 130, y + 3.4);
    y += 4.8;
  });
  y += 5;

  // 2. Runes Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text('ETHER RUNES & SEALS BALANCE TABLE (MAGIC LEVEL SCALING)', MARGIN_X, y);
  y += 2;

  doc.setFillColor(26, 26, 30);
  doc.rect(MARGIN_X, y, CONTENT_W, 5.2, 'F');
  doc.setFontSize(6.2);
  doc.setTextColor(184, 177, 166);
  doc.text('Rune / Seal', MARGIN_X + 2.5, y + 3.6);
  doc.text('Tier', MARGIN_X + 54, y + 3.6);
  doc.text('Requirement', MARGIN_X + 70, y + 3.6);
  doc.text('Scaling / ML', MARGIN_X + 102, y + 3.6);
  doc.text('Power @ ML 100', MARGIN_X + 130, y + 3.6);
  doc.text('Cost / Cooldown', MARGIN_X + 158, y + 3.6);
  y += 5.2;

  BALANCE_RUNES.forEach((r, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 15 : 19, idx % 2 === 0 ? 15 : 19, idx % 2 === 0 ? 18 : 23);
    doc.rect(MARGIN_X, y, CONTENT_W, 4.7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(r.name), MARGIN_X + 2.5, y + 3.3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 155, 60);
    doc.text(r.tier, MARGIN_X + 54, y + 3.3);
    doc.setTextColor(184, 177, 166);
    doc.text(pdfSafe(r.reqLevel), MARGIN_X + 70, y + 3.3);
    doc.text(pdfSafe(r.scalingPerLv), MARGIN_X + 102, y + 3.3);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(r.valueLv100), MARGIN_X + 130, y + 3.3);
    doc.setTextColor(172, 166, 156);
    doc.text(pdfSafe(r.costCd), MARGIN_X + 158, y + 3.3);
    y += 4.7;
  });
  y += 5;

  // 3. Potions Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text('VIAL BELT POTIONS & ELIXIRS (KEYS 1-4)', MARGIN_X, y);
  y += 2;

  doc.setFillColor(26, 26, 30);
  doc.rect(MARGIN_X, y, CONTENT_W, 5.2, 'F');
  doc.setFontSize(6.2);
  doc.setTextColor(184, 177, 166);
  doc.text('Elixir / Vial', MARGIN_X + 2.5, y + 3.6);
  doc.text('Tier', MARGIN_X + 62, y + 3.6);
  doc.text('Req Lv', MARGIN_X + 80, y + 3.6);
  doc.text('Scaling / Lv', MARGIN_X + 102, y + 3.6);
  doc.text('Effect (Lv 100 / 200)', MARGIN_X + 130, y + 3.6);
  doc.text('CD / Cast', MARGIN_X + 162, y + 3.6);
  y += 5.2;

  BALANCE_POTIONS.forEach((p, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 15 : 19, idx % 2 === 0 ? 15 : 19, idx % 2 === 0 ? 18 : 23);
    doc.rect(MARGIN_X, y, CONTENT_W, 4.7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(p.name), MARGIN_X + 2.5, y + 3.3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 155, 60);
    doc.text(p.tier, MARGIN_X + 62, y + 3.3);
    doc.setTextColor(184, 177, 166);
    doc.text(pdfSafe(p.reqLevel), MARGIN_X + 80, y + 3.3);
    doc.text(pdfSafe(p.scalingPerLv), MARGIN_X + 102, y + 3.3);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(p.effectLv100_200), MARGIN_X + 130, y + 3.3);
    doc.setTextColor(172, 166, 156);
    doc.text(pdfSafe(p.useTiming), MARGIN_X + 162, y + 3.3);
    y += 4.7;
  });
  y += 7;

  // Page 9: Section 08 — Decoupled Progression, Combat Integrity, Live-Ops & UE5 Architecture
  y = addNewPage('08 · Decoupled Gear, Combat Integrity & Live-Ops');
  y = drawSectionHeading(
    doc,
    y,
    '08 · Decoupled Modular Architecture & Live-Ops (Episode I)',
    'Logical Gear Data vs. Launch Cosmetic Skins — Zero Pay-to-Win'
  );

  DECOUPLED_SYSTEM_PILLARS.forEach((pillar) => {
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(84, 70, 42);
    doc.rect(MARGIN_X, y, CONTENT_W, 53.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.1);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(`${pillar.code}  ·  ${pillar.subtitle.toUpperCase()}`), MARGIN_X + 4, y + 5.2);

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(pillar.title), MARGIN_X + 4, y + 10.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(212, 206, 195);
    const sumLines = doc.splitTextToSize(pdfSafe(pillar.summary), CONTENT_W - 8);
    doc.text(sumLines.slice(0, 2), MARGIN_X + 4, y + 15.8);

    let by = y + 23.5;
    doc.setFontSize(6.5);
    doc.setTextColor(184, 177, 166);
    pillar.bullets.forEach((b) => {
      const bLines = doc.splitTextToSize(`- ${pdfSafe(b)}`, CONTENT_W - 10);
      const shown = bLines.slice(0, 2);
      doc.text(shown, MARGIN_X + 5, by);
      by += shown.length * 3.5 + 2.2;
    });

    y += 55.5;
  });

  y += 2;
  y = drawSectionHeading(
    doc,
    y,
    'Unreal Engine 5 Networking & Authoritative Security',
    'Replication Graph, Canonical Hitboxes & Multi-Layer Anti-Cheat'
  );

  const pilW = (CONTENT_W - 4) / 2;
  UE5_PILLARS.forEach((pil, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const px = MARGIN_X + col * (pilW + 4);
    const py = y + row * 28;

    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(px, py, pilW, 25.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.setTextColor(200, 155, 60);
    const pTitle = doc.splitTextToSize(pdfSafe(pil.title), pilW - 6);
    doc.text(pTitle, px + 3, py + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(184, 177, 166);
    const pBody = doc.splitTextToSize(pdfSafe(pil.detail), pilW - 6);
    doc.text(pBody.slice(0, 4), px + 3, py + 11.5);
  });

  // Compact Studio Ownership & Live GDD Registry strip (y = 271 to 279mm, cleanly above BOTTOM_Y = 281mm)
  const whoY = y + 57.5;
  doc.setFillColor(16, 16, 20);
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.3);
  doc.rect(MARGIN_X, whoY, CONTENT_W, 8.5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.6);
  doc.setTextColor(200, 155, 60);
  doc.text('STUDIO & ORIGINAL IP:', MARGIN_X + 3, whoY + 5.4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(234, 230, 223);
  doc.text(
    pdfSafe(
      `${STUDIO_IDENTITY.studioName}  |  ${STUDIO_IDENTITY.contactEmail}  |  ${STUDIO_IDENTITY.phoneDisplay}  |  ${STUDIO_IDENTITY.githubUrl}`
    ),
    MARGIN_X + 36,
    whoY + 5.4
  );

  onProgress?.(10, totalSteps);

  // ============================================================================
  // PAGE 10: HOLIDAY LOOT EVENTS (MARKED DATES ONLY) & CLIMATE-REACTIVE SKINS
  // ============================================================================
  y = addNewPage('09 · Limited-Time Holiday Loot Events & Reactive Skins');
  y = drawSectionHeading(
    doc,
    y,
    SEASONAL_LIVE_OPS.eyebrow,
    "Limited-Time Holiday Loot Events (1-2w) Inside Full-Season Worlds"
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(212, 206, 195);
  const holLead = doc.splitTextToSize(pdfSafe(SEASONAL_LIVE_OPS.lead), CONTENT_W);
  doc.text(holLead.slice(0, 2), MARGIN_X, y);
  y += 10.5;

  const holW = (CONTENT_W - 6) / 3;
  const holArts = [eventHalloweenArt, stormWinterArt, stormSummerArt];
  SEASONAL_LIVE_OPS.holidayEvents.forEach((ev, idx) => {
    const hx = MARGIN_X + idx * (holW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(hx, y, holW, 95, 'FD');

    const imgData = holArts[idx];
    if (imgData) {
      doc.addImage(imgData, 'JPEG', hx + 1, y + 1, holW - 2, 33);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(`${ev.seasonTag.toUpperCase()}  |  ${ev.window}`), hx + 3, y + 38.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(ev.title), hx + 3, y + 43.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.9);
    doc.setTextColor(212, 206, 195);
    const atmL = doc.splitTextToSize(pdfSafe(ev.atmosphere), holW - 6);
    doc.text(atmL.slice(0, 4), hx + 3, y + 48.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(184, 177, 166);
    const twL = doc.splitTextToSize(pdfSafe(`Twist: ${ev.gameplayTwist}`), holW - 6);
    doc.text(twL.slice(0, 4), hx + 3, y + 62.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.6);
    doc.setTextColor(200, 155, 60);
    const rwL = doc.splitTextToSize(pdfSafe(`Reward: ${ev.rewardSkin}`), holW - 6);
    doc.text(rwL.slice(0, 3), hx + 3, y + 81.5);
  });
  y += 101;

  // Climate-Reactive Seasonal Skins (3 columns)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.4);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.climateReactiveSkins.title.toUpperCase()), MARGIN_X, y);
  y += 3.2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(184, 177, 166);
  const reactSum = doc.splitTextToSize(
    pdfSafe(SEASONAL_LIVE_OPS.climateReactiveSkins.summary),
    CONTENT_W
  );
  doc.text(reactSum.slice(0, 2), MARGIN_X, y + 2);
  y += 10.5;

  const skinCardW = (CONTENT_W - 6) / 3;
  const skinArts = [skinHalloweenArt, skinWinterArt, skinSummerArt];
  SEASONAL_LIVE_OPS.climateReactiveSkins.showcase.forEach((skin, idx) => {
    const kx = MARGIN_X + idx * (skinCardW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(kx, y, skinCardW, 92, 'FD');

    const imgData = skinArts[idx];
    if (imgData) {
      doc.addImage(imgData, 'JPEG', kx + 1, y + 1, skinCardW - 2, 43);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.9);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(skin.eventTitle.toUpperCase()), kx + 3, y + 48.2);

    doc.setFont('times', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(246, 239, 226);
    const skTitle = doc.splitTextToSize(pdfSafe(skin.skinName), skinCardW - 6);
    doc.text(skTitle.slice(0, 1), kx + 3, y + 53);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.9);
    doc.setTextColor(184, 177, 166);
    const sLines = doc.splitTextToSize(pdfSafe(skin.detail), skinCardW - 6);
    doc.text(sLines.slice(0, 6), kx + 3, y + 58);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.6);
    doc.setTextColor(234, 230, 223);
    doc.text(pdfSafe(skin.seasonTag), kx + 3, y + 87.5);
  });

  onProgress?.(11, totalSteps);

  // ============================================================================
  // PAGE 11: FULL-SEASON DYNAMIC STORM & WORLD CYCLE + PRODUCTION ADVANTAGE
  // ============================================================================
  y = addNewPage('10 · Full-Season World Storms & Timed Loot Rituals');
  y = drawSectionHeading(
    doc,
    y,
    'Full-Season Environment Scenarios (All Winter / Summer / Spring-Autumn)',
    '4-Season Dynamic Storm & World Cycle'
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(212, 206, 195);
  const seasonLeadLines = doc.splitTextToSize(pdfSafe(SEASONAL_LIVE_OPS.lead), CONTENT_W);
  doc.text(seasonLeadLines.slice(0, 2), MARGIN_X, y);
  y += 11;

  const stormCardW = (CONTENT_W - 6) / 3;
  const stormArts = [stormMiasmaArt, stormWinterArt, stormSummerArt];
  SEASONAL_LIVE_OPS.stormPhases.forEach((phase, idx) => {
    const sx = MARGIN_X + idx * (stormCardW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(sx, y, stormCardW, 88, 'FD');

    const imgData = stormArts[idx];
    if (imgData) {
      doc.addImage(imgData, 'JPEG', sx + 1, y + 1, stormCardW - 2, 34);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(phase.seasonLabel.toUpperCase()), sx + 3, y + 39.5);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.0);
    doc.setTextColor(246, 239, 226);
    const tLines = doc.splitTextToSize(pdfSafe(phase.title), stormCardW - 6);
    doc.text(tLines.slice(0, 1), sx + 3, y + 44.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(184, 177, 166);
    const dLines = doc.splitTextToSize(pdfSafe(phase.description), stormCardW - 6);
    doc.text(dLines.slice(0, 5), sx + 3, y + 49.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(212, 206, 195);
    const uLines = doc.splitTextToSize(pdfSafe(phase.ue5Tech), stormCardW - 6);
    doc.text(uLines.slice(0, 2), sx + 3, y + 73);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.7);
    doc.setTextColor(200, 155, 60);
    const evL = doc.splitTextToSize(pdfSafe(phase.eventPairing), stormCardW - 6);
    doc.text(evL.slice(0, 2), sx + 3, y + 81.5);
  });
  y += 94;

  // Production & Live-Ops Advantage
  doc.setFillColor(22, 20, 17);
  doc.setDrawColor(120, 96, 48);
  doc.rect(MARGIN_X, y, CONTENT_W, 56, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.4);
  doc.setTextColor(200, 155, 60);
  doc.text('ART PIPELINE & RETENTION STRATEGY', MARGIN_X + 4, y + 6);

  doc.setFont('times', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.productionAdvantage.title), MARGIN_X + 4, y + 12.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(212, 206, 195);
  const advSumLines = doc.splitTextToSize(
    pdfSafe(SEASONAL_LIVE_OPS.productionAdvantage.summary),
    CONTENT_W - 8
  );
  doc.text(advSumLines.slice(0, 2), MARGIN_X + 4, y + 18);

  const ptW = (CONTENT_W - 12) / 2;
  SEASONAL_LIVE_OPS.productionAdvantage.partnerPoints.forEach((pt, idx) => {
    const px = MARGIN_X + 4 + idx * (ptW + 4);
    doc.setFillColor(15, 15, 18);
    doc.setDrawColor(56, 52, 44);
    doc.rect(px, y + 28, ptW, 24, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.9);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(pt.audience), px + 3, y + 33.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(184, 177, 166);
    const pLines = doc.splitTextToSize(pdfSafe(pt.detail), ptW - 6);
    doc.text(pLines.slice(0, 4), px + 3, y + 38.2);
  });
  y += 61;

  // Seasonal Event Lineup: 1 Attempt Every 24 Hours (Zero Pay-to-Win) (y = 199 to 278mm, safely < 281mm)
  doc.setFillColor(18, 18, 22);
  doc.setDrawColor(120, 96, 48);
  doc.rect(MARGIN_X, y, CONTENT_W, 79, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.1);
  doc.setTextColor(200, 155, 60);
  doc.text('24/7 QUEUE  |  MARKED LOOT DATES ONLY (1W HALLOWEEN · 2W DEC 24-JAN 7)  |  1 ENTRY / 24H', MARGIN_X + 4, y + 5.5);

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.title), MARGIN_X + 4, y + 11.2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(212, 206, 195);
  const qLead = doc.splitTextToSize(pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.lead), CONTENT_W - 8);
  doc.text(qLead.slice(0, 2), MARGIN_X + 4, y + 16);

  const qColW = (CONTENT_W - 12) / 2;
  // Left Box: Halloween — Wish or Threat
  const hx = MARGIN_X + 4;
  const qy = y + 25;
  doc.setFillColor(15, 15, 18);
  doc.setDrawColor(148, 97, 201);
  doc.rect(hx, qy, qColW, 50, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.halloween.title), hx + 3, y + 29.8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.4);
  doc.setTextColor(196, 161, 234);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.halloween.durationLabel), hx + 3, y + 33.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.9);
  doc.setTextColor(200, 155, 60);
  doc.text('WISH (STANDARD RULES):', hx + 3, y + 37.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.6);
  doc.setTextColor(184, 177, 166);
  const wL = doc.splitTextToSize(
    pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.halloween.wish.summary),
    qColW - 6
  );
  doc.text(wL.slice(0, 3), hx + 3, y + 40.6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.9);
  doc.setTextColor(196, 161, 234);
  doc.text('THREAT (CURSED STAKES / +VFX VARIANT):', hx + 3, y + 52.2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.6);
  doc.setTextColor(184, 177, 166);
  const tL = doc.splitTextToSize(
    pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.halloween.threat.summary),
    qColW - 6
  );
  doc.text(tL.slice(0, 4), hx + 3, y + 55.6);

  // Right Box: Midwinter — Dark Santa's Wish
  const mx = MARGIN_X + 8 + qColW;
  doc.setFillColor(15, 15, 18);
  doc.setDrawColor(62, 130, 199);
  doc.rect(mx, qy, qColW, 50, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.midwinter.title), mx + 3, y + 29.8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.4);
  doc.setTextColor(107, 168, 229);
  doc.text(pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.midwinter.durationLabel), mx + 3, y + 33.0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(212, 206, 195);
  const dsSum = doc.splitTextToSize(
    pdfSafe(SEASONAL_LIVE_OPS.eventQueueLineup.midwinter.summary),
    qColW - 6
  );
  doc.text(dsSum.slice(0, 4), mx + 3, y + 37.2);

  let dhy = y + 52.5;
  doc.setFontSize(5.7);
  doc.setTextColor(184, 177, 166);
  SEASONAL_LIVE_OPS.eventQueueLineup.midwinter.highlights.forEach((h) => {
    const hl = doc.splitTextToSize(`- ${pdfSafe(h)}`, qColW - 6);
    doc.text(hl.slice(0, 2), mx + 3, dhy);
    dhy += hl.slice(0, 2).length * 2.8 + 1.1;
  });

  onProgress?.(12, totalSteps);

  // ============================================================================
  // PAGE 12: COMMERCIAL CO-PITCHING & STUDIO ALLIANCE MODEL (VERTICAL SLICE)
  // ============================================================================
  y = addNewPage('11 · Commercial Co-Pitching & Studio Alliance Model');
  y = drawSectionHeading(
    doc,
    y,
    CO_PITCHING_ALLIANCE.eyebrow,
    CO_PITCHING_ALLIANCE.title
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.4);
  doc.setTextColor(212, 206, 195);
  const allianceLeadLines = doc.splitTextToSize(pdfSafe(CO_PITCHING_ALLIANCE.lead), CONTENT_W);
  doc.text(allianceLeadLines.slice(0, 2), MARGIN_X, y);
  y += 10.5;

  // 4-Metric Deal Strip
  const dealW = (CONTENT_W - 9) / 4;
  CO_PITCHING_ALLIANCE.executiveMetrics.forEach((m, idx) => {
    const mx = MARGIN_X + idx * (dealW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(56, 52, 44);
    doc.rect(mx, y, dealW, 11.5, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(156, 150, 139);
    doc.text(pdfSafe(m.label), mx + 2.5, y + 4.2);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(m.value), mx + 2.5, y + 9.2);
  });
  y += 15.5;

  // 1. Division of Labor (2 columns)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(246, 239, 226);
  doc.text('DIVISION OF LABOR (PHASE 1 — VERTICAL SLICE)', MARGIN_X, y);
  y += 2.8;

  const colW = (CONTENT_W - 4) / 2;
  CO_PITCHING_ALLIANCE.divisionOfLabor.forEach((track, idx) => {
    const tx = MARGIN_X + idx * (colW + 4);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(idx === 0 ? 120 : 65, idx === 0 ? 96 : 115, idx === 0 ? 48 : 80);
    doc.rect(tx, y, colW, 54, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(track.badge.toUpperCase()), tx + 3.5, y + 4.6);

    doc.setFont('times', 'bold');
    doc.setFontSize(9.4);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(track.role), tx + 3.5, y + 9.6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(212, 206, 195);
    const sumL = doc.splitTextToSize(pdfSafe(track.summary), colW - 7);
    doc.text(sumL.slice(0, 2), tx + 3.5, y + 14);

    let ty = y + 21.5;
    doc.setFontSize(5.9);
    doc.setTextColor(184, 177, 166);
    track.items.forEach((item) => {
      const iL = doc.splitTextToSize(`- ${pdfSafe(item)}`, colW - 8);
      const shown = iL.slice(0, 3);
      doc.text(shown, tx + 4, ty);
      ty += shown.length * 3.0 + 1.5;
    });
  });
  y += 58.5;

  // 2. Studio Value Proposition & ROI
  doc.setFillColor(22, 20, 17);
  doc.setDrawColor(120, 96, 48);
  doc.rect(MARGIN_X, y, CONTENT_W, 38, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(200, 155, 60);
  doc.text('STUDIO VALUE PROPOSITION & COMMERCIAL RETURN', MARGIN_X + 4, y + 4.8);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.8);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(CO_PITCHING_ALLIANCE.studioValueReturn.headline), MARGIN_X + 4, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.3);
  doc.setTextColor(212, 206, 195);
  const valSum = doc.splitTextToSize(pdfSafe(CO_PITCHING_ALLIANCE.studioValueReturn.summary), CONTENT_W - 8);
  doc.text(valSum.slice(0, 2), MARGIN_X + 4, y + 14.5);

  const pilColW = (CONTENT_W - 14) / 3;
  CO_PITCHING_ALLIANCE.studioValueReturn.pillars.forEach((p, idx) => {
    const px = MARGIN_X + 4 + idx * (pilColW + 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(p.title), px, y + 22.8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(184, 177, 166);
    const dL = doc.splitTextToSize(pdfSafe(p.detail), pilColW);
    doc.text(dL.slice(0, 3), px, y + 26.5);
  });
  y += 42.5;

  // 3. Testing & Scaling Roadmap
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(CO_PITCHING_ALLIANCE.testingRoadmap.title.toUpperCase()), MARGIN_X, y);
  y += 3;

  const rmW = (CONTENT_W - 6) / 3;
  CO_PITCHING_ALLIANCE.testingRoadmap.milestones.forEach((m, idx) => {
    const rx = MARGIN_X + idx * (rmW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(idx === 0 ? 120 : 50, idx === 0 ? 96 : 50, idx === 0 ? 48 : 58);
    doc.rect(rx, y, rmW, 27, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(m.phase.toUpperCase()), rx + 3, y + 4.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(156, 150, 139);
    doc.text(pdfSafe(m.status), rx + 3, y + 8.8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.9);
    doc.setTextColor(212, 206, 195);
    const mLines = doc.splitTextToSize(pdfSafe(m.detail), rmW - 6);
    doc.text(mLines.slice(0, 4), rx + 3, y + 13);
  });
  y += 31.5;

  // 4. Strict Vertical Slice Scope Cut (10-15 Min Demo)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(246, 239, 226);
  doc.text(pdfSafe(CO_PITCHING_ALLIANCE.verticalSliceScope.title.toUpperCase()), MARGIN_X, y);
  y += 3;

  const vsW = (CONTENT_W - 6) / 3;
  CO_PITCHING_ALLIANCE.verticalSliceScope.pillars.forEach((item, idx) => {
    const vx = MARGIN_X + idx * (vsW + 3);
    doc.setFillColor(20, 20, 23);
    doc.setDrawColor(50, 50, 58);
    doc.rect(vx, y, vsW, 25, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(200, 155, 60);
    doc.text(pdfSafe(item.slot.toUpperCase()), vx + 3, y + 4.6);

    doc.setFont('times', 'bold');
    doc.setFontSize(8.4);
    doc.setTextColor(246, 239, 226);
    doc.text(pdfSafe(item.name), vx + 3, y + 9.2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.9);
    doc.setTextColor(184, 177, 166);
    const vBody = doc.splitTextToSize(pdfSafe(item.detail), vsW - 6);
    doc.text(vBody.slice(0, 3), vx + 3, y + 13.5);
  });
  y += 29;

  // 5. Current Technical Status (Playable Prototype)
  doc.setFillColor(18, 18, 22);
  doc.setDrawColor(79, 158, 104);
  doc.rect(MARGIN_X, y, CONTENT_W, 26, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(154, 224, 175);
  doc.text(pdfSafe(CO_PITCHING_ALLIANCE.currentTechnicalStatus.title.toUpperCase()), MARGIN_X + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.1);
  doc.setTextColor(212, 206, 195);
  let statusY = y + 9.5;
  CO_PITCHING_ALLIANCE.currentTechnicalStatus.points.forEach((pt) => {
    const pL = doc.splitTextToSize(`- ${pdfSafe(pt.label)}: ${pdfSafe(pt.detail)}`, CONTENT_W - 8);
    doc.text(pL.slice(0, 2), MARGIN_X + 4, statusY);
    statusY += pL.slice(0, 2).length * 3.1 + 1.4;
  });

  onProgress?.(totalSteps, totalSteps);
  doc.save('The_Last_Relic_Main_Page_EN.pdf');
}
