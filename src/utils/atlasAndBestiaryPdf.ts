import { jsPDF } from 'jspdf';
import {
  BESTIARY_CREATURES,
  BIOMES,
  type BestiaryCreature,
  type BiomeSpec,
} from '../data/gddData';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 12;
const CONTENT_W = PAGE_W - MARGIN_X * 2; // 186mm

function pdfSafe(input: string): string {
  return input
    .replace(/\u2014/g, ' - ')
    .replace(/\u2013/g, '-')
    .replace(/[\u2012\u2015\u2212]/g, '-')
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2192/g, '->')
    .replace(/\u2190/g, '<-')
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    .replace(/\u0394/g, 'Delta ')
    .replace(/\u00D7/g, 'x')
    .replace(/\u2022/g, '-')
    .replace(/\u00B7/g, ' | ')
    .replace(/\s{2,}/g, ' ')
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, '');
}

async function loadJpeg(src: string, targetAspect: number): Promise<string | null> {
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
          sy = (img.naturalHeight - sh) / 2;
        }
        ctx.fillStyle = '#0B0B0D';
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawChrome(doc: jsPDF, title: string, rightLabel: string, pageNum: number) {
  doc.setFillColor(11, 11, 13);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
  doc.setDrawColor(42, 40, 36);
  doc.setLineWidth(0.3);
  doc.rect(7, 7, PAGE_W - 14, PAGE_H - 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text(`THE LAST RELIC  |  ${title}`, MARGIN_X, 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 150, 139);
  doc.text(pdfSafe(rightLabel), PAGE_W - MARGIN_X, 12.5, { align: 'right' });

  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, 14.5, PAGE_W - MARGIN_X, 14.5);

  doc.setDrawColor(42, 42, 48);
  doc.setLineWidth(0.25);
  doc.line(MARGIN_X, PAGE_H - 12.5, PAGE_W - MARGIN_X, PAGE_H - 12.5);
  doc.setFontSize(7.5);
  doc.text('Original IP Edition · World of Valdris · Unreal Engine 5', MARGIN_X, PAGE_H - 8.5);
  doc.text(`Page ${pageNum}`, PAGE_W - MARGIN_X, PAGE_H - 8.5, { align: 'right' });
}

export async function exportBiomesAtlasToPdf(
  biomes: BiomeSpec[] = BIOMES,
  onProgress?: (cur: number, tot: number) => void
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const perPage = 2;
  const totalPages = Math.ceil(biomes.length / perPage);

  for (let p = 0; p < totalPages; p++) {
    if (p > 0) doc.addPage('a4', 'portrait');
    drawChrome(doc, 'STRATEGIC BIOMES ATLAS', '4 Regions of Valdris', p + 1);

    const slice = biomes.slice(p * perPage, (p + 1) * perPage);
    for (let idx = 0; idx < slice.length; idx++) {
      const b = slice[idx];
      const cy = 20 + idx * 129;
      const ch = 123;

      doc.setFillColor(20, 20, 23);
      doc.setDrawColor(58, 54, 46);
      doc.rect(MARGIN_X, cy, CONTENT_W, ch, 'FD');

      const art = await loadJpeg(b.image, 16 / 9);
      if (art) {
        doc.addImage(art, 'JPEG', MARGIN_X + 3, cy + 3, 96, 54);
      }

      const rx = MARGIN_X + 103;
      const rw = CONTENT_W - 106;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(200, 155, 60);
      doc.text(pdfSafe(`${b.location.toUpperCase()}  ·  ${b.acts.toUpperCase()}`), rx, cy + 8);

      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(246, 239, 226);
      doc.text(pdfSafe(b.name), rx, cy + 15);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.4);
      doc.setTextColor(212, 206, 195);
      const dLines = doc.splitTextToSize(pdfSafe(b.description), rw);
      doc.text(dLines.slice(0, 5), rx, cy + 21);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(212, 175, 55);
      doc.text(pdfSafe(`Ash Closure: ${b.ashClosureWindow}`), rx, cy + 46);
      doc.setTextColor(184, 177, 166);
      const lootLines = doc.splitTextToSize(pdfSafe(`Loot: ${b.lootFocus}`), rw);
      doc.text(lootLines.slice(0, 2), rx, cy + 51);

      // Bottom details block
      let by = cy + 62;
      doc.setDrawColor(46, 46, 54);
      doc.line(MARGIN_X + 3, by - 2, PAGE_W - MARGIN_X - 3, by - 2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(200, 155, 60);
      doc.text('ENVIRONMENTAL HAZARDS & TACTICAL CONTROL', MARGIN_X + 4, by + 2.5);
      by += 6.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.1);
      doc.setTextColor(212, 206, 195);
      b.environmentalHazards.forEach((hz) => {
        doc.text(pdfSafe(`- ${hz}`), MARGIN_X + 5, by);
        by += 4.5;
      });

      by += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(156, 150, 139);
      doc.text(
        pdfSafe(`Native Beasts: ${b.nativeBeasts.join(', ')}`),
        MARGIN_X + 4,
        by
      );
      doc.text(
        pdfSafe(
          `Recommended Roles: ${b.recommendedSpecializations.join(', ')}  |  Seals: ${b.recommendedSeals.join(', ')}`
        ),
        MARGIN_X + 4,
        by + 5
      );

      onProgress?.(p * perPage + idx + 1, biomes.length);
    }
  }

  doc.save('The_Last_Relic_Biomes_Atlas_EN.pdf');
}

export async function exportBestiaryToPdf(
  creatures: BestiaryCreature[] = BESTIARY_CREATURES,
  lobbyAvgLv = 80,
  onProgress?: (cur: number, tot: number) => void
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const effLv = lobbyAvgLv + 100;
  const baseWarriorHp =
    effLv <= 8 ? 150 + (effLv - 1) * 5 : 185 + (effLv - 8) * 10;

  const perPage = 2;
  const totalPages = Math.ceil(creatures.length / perPage);

  for (let p = 0; p < totalPages; p++) {
    if (p > 0) doc.addPage('a4', 'portrait');
    drawChrome(
      doc,
      'VALDRIS PVE BESTIARY COMPENDIUM',
      `Scaling @ Lv_avg ${lobbyAvgLv} (Effective Lv.${effLv})`,
      p + 1
    );

    const slice = creatures.slice(p * perPage, (p + 1) * perPage);
    for (let idx = 0; idx < slice.length; idx++) {
      const c = slice[idx];
      const cy = 20 + idx * 129;
      const ch = 123;
      const soloHp = Math.round(baseWarriorHp * c.hpMultiplier);

      doc.setFillColor(20, 20, 23);
      doc.setDrawColor(58, 54, 46);
      doc.rect(MARGIN_X, cy, CONTENT_W, ch, 'FD');

      const art = await loadJpeg(c.image, 4 / 3);
      if (art) {
        doc.addImage(art, 'JPEG', MARGIN_X + 3, cy + 3, 76, 57);
      }

      const rx = MARGIN_X + 83;
      const rw = CONTENT_W - 86;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(200, 155, 60);
      doc.text(
        pdfSafe(`${c.tierLabel.toUpperCase()}  ·  ${c.acts.toUpperCase()}  ·  ${c.pvpAlertRadius.toUpperCase()}`),
        rx,
        cy + 8
      );

      doc.setFont('times', 'bold');
      doc.setFontSize(14.5);
      doc.setTextColor(246, 239, 226);
      doc.text(pdfSafe(c.name), rx, cy + 14.5);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.setTextColor(184, 177, 166);
      doc.text(pdfSafe(c.title), rx, cy + 19.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.3);
      doc.setTextColor(212, 206, 195);
      const loreLines = doc.splitTextToSize(pdfSafe(c.lore), rw);
      doc.text(loreLines.slice(0, 4), rx, cy + 25.5);

      doc.setFillColor(14, 14, 17);
      doc.setDrawColor(46, 46, 54);
      doc.rect(rx, cy + 44, rw, 15.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(212, 175, 55);
      doc.text(
        pdfSafe(
          `HP Multiplier: ${c.hpMultiplier.toFixed(2)}x (${soloHp.toLocaleString('en-US')} HP @ Lv_avg ${lobbyAvgLv})  |  Base EXP: ${c.baseExpReward}`
        ),
        rx + 3,
        cy + 49.5
      );
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(184, 177, 166);
      doc.text(pdfSafe(`Habitat: ${c.biomeLabel}`), rx + 3, cy + 55.2);

      // Combat Behavior & Counterplay bottom block
      let by = cy + 65;
      doc.setDrawColor(46, 46, 54);
      doc.line(MARGIN_X + 3, by - 2, PAGE_W - MARGIN_X - 3, by - 2);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(200, 155, 60);
      doc.text('COMBAT BEHAVIOR & TELEMETRY', MARGIN_X + 4, by + 2.5);
      by += 6.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.1);
      doc.setTextColor(212, 206, 195);
      c.combatBehavior.forEach((beh) => {
        doc.text(pdfSafe(`- ${beh}`), MARGIN_X + 5, by);
        by += 4.5;
      });

      by += 2.5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.1);
      doc.setTextColor(79, 158, 104);
      const cpLines = doc.splitTextToSize(
        pdfSafe(`Counterplay: ${c.counterplayTip}`),
        CONTENT_W - 8
      );
      doc.text(cpLines.slice(0, 2), MARGIN_X + 4, by);
      by += cpLines.slice(0, 2).length * 4 + 2;

      doc.setTextColor(212, 175, 55);
      doc.text(pdfSafe(`Weakness: ${c.weakness}`), MARGIN_X + 4, by);
      doc.setTextColor(184, 177, 166);
      const dropLines = doc.splitTextToSize(
        pdfSafe(`Guaranteed Drops: ${c.guaranteedDrops}`),
        CONTENT_W - 8
      );
      doc.text(dropLines.slice(0, 2), MARGIN_X + 4, by + 4.8);

      onProgress?.(p * perPage + idx + 1, creatures.length);
    }
  }

  doc.save('The_Last_Relic_Bestiary_Compendium_EN.pdf');
}
