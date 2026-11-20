import { jsPDF } from 'jspdf';
import { GENERATED_ASSETS, type PitchSlide } from '../data/gddData';

interface LoadedImageResult {
  dataUrl: string;
}

async function loadCroppedJpeg(
  src: string,
  targetAspect = 16 / 9,
  topFocus = false
): Promise<LoadedImageResult | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const outW = 1120;
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
          sy = topFocus ? Math.max(0, (img.naturalHeight - sh) * 0.14) : (img.naturalHeight - sh) / 2;
        }

        ctx.fillStyle = '#0B0B0D';
        ctx.fillRect(0, 0, outW, outH);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.9) });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawSlideChrome(doc: jsPDF, W: number, H: number, footerRight: string) {
  // Deep Obsidian background
  doc.setFillColor(11, 11, 13);
  doc.rect(0, 0, W, H, 'F');

  // Subtle inner frame border
  doc.setDrawColor(46, 42, 36);
  doc.setLineWidth(0.35);
  doc.rect(8, 8, W - 16, H - 16);

  // Top gold accent rule
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.6);
  doc.line(14, 15, W - 14, 15);

  // Footer rule & brand mark
  doc.setDrawColor(42, 42, 48);
  doc.setLineWidth(0.3);
  doc.line(14, H - 14, W - 14, H - 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(200, 155, 60);
  doc.text('VALDRIS CHRONICLE: LAST RELIC', 14, H - 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 150, 139);
  doc.text('Dimpz Games · isaacgestrada94@gmail.com · +52 33 1835 9421', 74, H - 9.5);
  doc.text(footerRight, W - 14, H - 9.5, { align: 'right' });
}

export async function exportPitchDeckToPdf(
  slides: PitchSlide[],
  coverImageSrc: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // True 16:9 Widescreen Presentation (297mm x 167mm)
  const W = 297;
  const H = 167;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [W, H],
  });

  const totalSteps = slides.length + 1;
  onProgress?.(0, totalSteps);

  // --- COVER SLIDE (Page 1) ---
  doc.setFillColor(11, 11, 13);
  doc.rect(0, 0, W, H, 'F');

  const [coverImg, gameLogoImg, studioLogoImg] = await Promise.all([
    loadCroppedJpeg(coverImageSrc, 16 / 9, false),
    loadCroppedJpeg(GENERATED_ASSETS.gameLogo, 4 / 3, false),
    loadCroppedJpeg(GENERATED_ASSETS.studioLogo, 4 / 3, false),
  ]);
  if (coverImg) {
    doc.addImage(coverImg.dataUrl, 'JPEG', 12, 12, W - 24, H - 24);
    // Dark editorial scrim across left & bottom for crisp legibility
    doc.setFillColor(11, 11, 13);
    doc.setGState(doc.GState({ opacity: 0.78 }));
    doc.rect(12, 12, 178, H - 24, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));
  }

  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, W - 24, H - 24);

  if (gameLogoImg) {
    doc.setFillColor(12, 12, 15);
    doc.setDrawColor(200, 155, 60);
    doc.setLineWidth(0.5);
    doc.rect(200, 22, 74, 55.5, 'FD');
    doc.addImage(gameLogoImg.dataUrl, 'JPEG', 201, 23, 72, 53.5);
  }
  if (studioLogoImg) {
    doc.setFillColor(12, 12, 15);
    doc.setDrawColor(90, 82, 68);
    doc.setLineWidth(0.45);
    doc.rect(200, 86, 74, 55.5, 'FD');
    doc.addImage(studioLogoImg.dataUrl, 'JPEG', 201, 87, 72, 53.5);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(200, 155, 60);
  doc.text('DIMPZ GAMES · EXECUTIVE COMMERCIAL PITCH DECK', 22, 34);

  doc.setFont('times', 'bold');
  doc.setFontSize(40);
  doc.setTextColor(246, 239, 226);
  doc.text('The Last Relic', 22, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(212, 206, 195);
  const subtitleLines = doc.splitTextToSize(
    '200-Player Tactical Dark-Fantasy PvPvE Battle Royale in Unreal Engine 5. Dynamic Warrior Progression, 6 Specializations, 90 Modular 3D Sets, Magic Level & Defense Level.',
    144
  );
  doc.text(subtitleLines, 22, 67);

  // Key highlight strip on Cover
  doc.setDrawColor(200, 155, 60);
  doc.setLineWidth(0.4);
  doc.line(22, 108, 162, 108);

  const metrics = [
    ['MATCH SCALE', '200 Warriors'],
    ['LOOP DURATION', '5 Acts · 15–18m'],
    ['3D ARMORY', '90 Sets (Lv.1–100+)'],
    ['MONETIZATION', 'Zero Pay-to-Win'],
  ];
  metrics.forEach(([label, value], i) => {
    const mx = 22 + i * 36;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(156, 150, 139);
    doc.text(label, mx, 117);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(246, 239, 226);
    doc.text(value, mx, 124);
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(184, 177, 166);
  doc.text(
    'Oath Mode (Duos / Trios / Squads)  ·  Wanderer Mode (Solo 1 vs 199)  ·  Universe of Valdris',
    22,
    H - 22
  );

  onProgress?.(1, totalSteps);

  // --- CONTENT SLIDES ---
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    doc.addPage([W, H], 'landscape');
    drawSlideChrome(doc, W, H, `Slide ${slide.code}`);

    // Section kicker
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(200, 155, 60);
    doc.text(`SLIDE ${slide.code}  ·  ${slide.section.toUpperCase()}`, 14, 24);

    // Left column: Title, Key Message, Bullets
    const leftX = 14;
    const leftW = 128;

    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(246, 239, 226);
    const titleLines = doc.splitTextToSize(slide.title, leftW);
    doc.text(titleLines, leftX, 34);

    let cursorY = 34 + titleLines.length * 7.8 + 3;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    doc.setTextColor(212, 175, 55);
    const quoteLines = doc.splitTextToSize(slide.keyMessage, leftW);
    doc.text(quoteLines, leftX, cursorY);

    cursorY += quoteLines.length * 5.2 + 4;
    doc.setDrawColor(50, 50, 58);
    doc.setLineWidth(0.3);
    doc.line(leftX, cursorY, leftX + leftW, cursorY);
    cursorY += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.8);
    doc.setTextColor(212, 206, 195);

    for (const bullet of slide.bullets) {
      doc.setFillColor(200, 155, 60);
      doc.rect(leftX, cursorY - 2.3, 1.8, 1.8, 'F');
      const bLines = doc.splitTextToSize(bullet, leftW - 6);
      doc.text(bLines, leftX + 5, cursorY);
      cursorY += bLines.length * 4.8 + 4.5;
    }

    // Right column: Either 3D Showcase Grid or 16:9 Slide Artwork
    const rightX = 150;
    const rightY = 23;
    const rightW = 133;
    const rightH = 119;

    if (slide.showcaseItems && slide.showcaseItems.length > 0) {
      if (slide.showcaseTitle) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(200, 155, 60);
        doc.text(slide.showcaseTitle.toUpperCase(), rightX, rightY + 3);
      }

      const items = slide.showcaseItems;
      const cols = items.length === 5 ? 3 : 3;
      const gap = 3.5;
      const cardW = (rightW - gap * (cols - 1)) / cols;
      const cardH = 52;
      const startGridY = rightY + 7;

      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const cx = rightX + col * (cardW + gap);
        const cy = startGridY + row * (cardH + gap);

        doc.setFillColor(20, 20, 23);
        doc.setDrawColor(54, 54, 62);
        doc.setLineWidth(0.3);
        doc.rect(cx, cy, cardW, cardH, 'FD');

        const thumb = await loadCroppedJpeg(item.image, 4 / 3, true);
        const imgH = 35;
        if (thumb) {
          doc.addImage(thumb.dataUrl, 'JPEG', cx + 1, cy + 1, cardW - 2, imgH);
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(246, 239, 226);
        doc.text(item.label, cx + 2.5, cy + imgH + 6);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(184, 177, 166);
        doc.text(item.sublabel, cx + 2.5, cy + imgH + 11.5);
      }
    } else {
      const boxH = 82;
      const boxY = rightY + (rightH - boxH) / 2 - 4;
      doc.setFillColor(20, 20, 23);
      doc.setDrawColor(60, 56, 48);
      doc.setLineWidth(0.35);
      doc.rect(rightX, boxY, rightW, boxH, 'FD');

      const art = await loadCroppedJpeg(slide.image, 16 / 9, false);
      if (art) {
        doc.addImage(art.dataUrl, 'JPEG', rightX + 1.2, boxY + 1.2, rightW - 2.4, boxH - 2.4);
      }

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(156, 150, 139);
      doc.text(`${slide.section} — Valdris Visual Reference`, rightX, boxY + boxH + 6);
    }

    onProgress?.(i + 2, totalSteps);
  }

  doc.save('The_Last_Relic_Pitch_Deck_EN.pdf');
}
