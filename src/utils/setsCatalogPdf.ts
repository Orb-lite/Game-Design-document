import { jsPDF } from 'jspdf';
import type { EquipmentSetSpec } from '../data/equipmentSets';
import { getRenderedSetArtwork, getSetStyleProfile } from '../components/setArtworkRenderer';

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

function drawCatalogChrome(
  doc: jsPDF,
  subtitle: string,
  pageNum: number,
  totalPages: number
) {
  doc.setFillColor(11, 11, 13);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F');

  doc.setDrawColor(42, 40, 36);
  doc.setLineWidth(0.3);
  doc.rect(7, 7, PAGE_W - 14, PAGE_H - 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 155, 60);
  doc.text('VALDRIS CHRONICLE: LAST RELIC  |  90 LAUNCH SKINS & UNRELATED LOGICAL DATA', MARGIN_X, 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 150, 139);
  doc.text(pdfSafe(subtitle), PAGE_W - MARGIN_X, 12.5, { align: 'right' });

  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, 14.5, PAGE_W - MARGIN_X, 14.5);

  doc.setDrawColor(42, 42, 48);
  doc.setLineWidth(0.25);
  doc.line(MARGIN_X, PAGE_H - 12.5, PAGE_W - MARGIN_X, PAGE_H - 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(156, 150, 139);
  doc.text('Original IP Edition · World of Valdris · Unreal Engine 5', MARGIN_X, PAGE_H - 8.5);
  doc.text(`Page ${pageNum} / ${totalPages}`, PAGE_W - MARGIN_X, PAGE_H - 8.5, {
    align: 'right',
  });
}

export async function exportSetsCatalogToPdf(
  sets: EquipmentSetSpec[],
  filterSummary: string,
  filename: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  if (sets.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const perPage = 3;
  const totalPages = Math.ceil(sets.length / perPage);
  onProgress?.(0, sets.length);

  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    if (pageIdx > 0) {
      doc.addPage('a4', 'portrait');
    }
    drawCatalogChrome(
      doc,
      `${filterSummary} (${sets.length} Set${sets.length === 1 ? '' : 's'})`,
      pageIdx + 1,
      totalPages
    );

    const slice = sets.slice(pageIdx * perPage, (pageIdx + 1) * perPage);
    for (let slot = 0; slot < slice.length; slot++) {
      const set = slice[slot];
      const style = getSetStyleProfile(set);
      const cardY = 20 + slot * 86;
      const cardH = 81;

      doc.setFillColor(20, 20, 23);
      doc.setDrawColor(56, 52, 44);
      doc.setLineWidth(0.35);
      doc.rect(MARGIN_X, cardY, CONTENT_W, cardH, 'FD');

      // Left 4:3 rendered artwork frame
      const artW = 68;
      const artH = 51;
      const artX = MARGIN_X + 3.5;
      const artY = cardY + 3.5;

      const renderedUrl = await getRenderedSetArtwork(set);
      try {
        doc.addImage(renderedUrl, 'JPEG', artX, artY, artW, artH);
      } catch {
        doc.setFillColor(12, 12, 16);
        doc.rect(artX, artY, artW, artH, 'F');
      }

      // Material finish tag under artwork
      doc.setFillColor(14, 14, 17);
      doc.setDrawColor(46, 46, 54);
      doc.rect(artX, artY + artH + 2.5, artW, 20.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.1);
      doc.setTextColor(200, 155, 60);
      doc.text('DATA REQS (UNLINKED TO SKIN)', artX + 2.5, artY + artH + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(225, 220, 210);
      doc.text(
        pdfSafe(
          `General: Lv.${set.minGeneralLevel} | ${set.attackSkillLabel}: ${set.minAttackMastery}`
        ),
        artX + 2.5,
        artY + artH + 11.8
      );
      doc.text(
        pdfSafe(`Defense Lv: ${set.minDefenseLevel} | Focus: ${set.focusType}`),
        artX + 2.5,
        artY + artH + 16.2
      );
      doc.setTextColor(156, 150, 139);
      doc.text(pdfSafe(`Finish: ${style.materialLabel}`), artX + 2.5, artY + artH + 20.5);

      // Right details column
      const rx = artX + artW + 5;
      const rw = CONTENT_W - artW - 12;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      doc.setTextColor(200, 155, 60);
      doc.text(
        pdfSafe(
          `LAUNCH SKIN #${String(set.setNumber).padStart(2, '0')}/15  ·  ${set.professionLabel.toUpperCase()}  ·  VISUAL LAYER`
        ),
        rx,
        cardY + 7.5
      );

      doc.setFont('times', 'bold');
      doc.setFontSize(13.5);
      doc.setTextColor(246, 239, 226);
      doc.text(pdfSafe(set.name), rx, cardY + 14);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.2);
      doc.setTextColor(212, 206, 195);
      const noteLines = doc.splitTextToSize(pdfSafe(set.visualDesignNote), rw);
      doc.text(noteLines.slice(0, 2), rx, cardY + 19.5);

      // Equipment loadout box
      let iy = cardY + 29;
      doc.setDrawColor(46, 46, 54);
      doc.line(rx, iy - 1.5, rx + rw, iy - 1.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.7);
      doc.setTextColor(156, 150, 139);
      doc.text('Weapon:', rx, iy + 2.5);
      doc.text('Armor:', rx, iy + 7);
      doc.text('Shield / Offhand:', rx, iy + 11.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(234, 230, 223);
      doc.text(pdfSafe(`${set.weaponName} (Atk ${set.weaponAttack})`), rx + 26, iy + 2.5);
      doc.text(pdfSafe(`${set.armorName} (Def ${set.armorDefense})`), rx + 26, iy + 7);
      doc.text(
        pdfSafe(
          `${set.shieldName} (Def ${set.shieldDefense} · ${set.baseShieldBlockPct}% Block)`
        ),
        rx + 26,
        iy + 11.5
      );

      iy += 16;
      // Stats highlight row
      doc.setFillColor(14, 14, 17);
      doc.setDrawColor(46, 46, 54);
      doc.rect(rx, iy, rw, 10, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.9);
      doc.setTextColor(200, 155, 60);
      doc.text(
        pdfSafe(
          `Attack: ${set.weaponAttack}   |   Total Def: ${set.armorDefense + set.shieldDefense}   |   Shield Block: ${set.baseShieldBlockPct}%   |   Type: ${set.focusType}`
        ),
        rx + 3,
        iy + 6.3
      );

      iy += 13;
      // Set perk & tactical explanation
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.3);
      doc.setTextColor(212, 175, 55);
      doc.text(
        pdfSafe(`Logical Data & Dual Unlock (Organic 100% Weapon Mastery OR Store Auto-Max): ${set.focusTarget}`),
        rx,
        iy + 1.5
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.9);
      doc.setTextColor(212, 206, 195);
      const perkLines = doc.splitTextToSize(pdfSafe(set.focusAdvantage), rw);
      doc.text(perkLines.slice(0, 3), rx, iy + 5.8);

      onProgress?.(pageIdx * perPage + slot + 1, sets.length);
    }
  }

  doc.save(filename);
}
