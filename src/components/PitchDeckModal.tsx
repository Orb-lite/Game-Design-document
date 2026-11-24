import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react';
import { GENERATED_ASSETS, PITCH_DECK_SLIDES } from '../data/gddData';
import { exportPitchDeckToPdf } from '../utils/pitchDeckPdf';
import { MediaFrame } from './MediaFrame';

interface PitchDeckModalProps {
  isOpen: boolean;
  activeSlideIndex: number;
  onChangeSlide: (index: number) => void;
  onClose: () => void;
}

export function PitchDeckModal({
  isOpen,
  activeSlideIndex,
  onChangeSlide,
  onClose,
}: PitchDeckModalProps) {
  const [pdfProgress, setPdfProgress] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onChangeSlide(Math.min(PITCH_DECK_SLIDES.length - 1, activeSlideIndex + 1));
      } else if (e.key === 'ArrowLeft') {
        onChangeSlide(Math.max(0, activeSlideIndex - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, activeSlideIndex, onChangeSlide, onClose]);

  if (!isOpen) return null;

  const slide = PITCH_DECK_SLIDES[activeSlideIndex] ?? PITCH_DECK_SLIDES[0];

  const handleDownloadPdf = async () => {
    if (pdfProgress) return;
    try {
      setPdfProgress('Preparing PDF...');
      await exportPitchDeckToPdf(
        PITCH_DECK_SLIDES,
        GENERATED_ASSETS.heroCitadel,
        (current, total) => {
          setPdfProgress(`Generating ${current}/${total}...`);
        }
      );
    } finally {
      setPdfProgress(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#08080A]/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Commercial Pitch Deck - ${slide.section}`}
    >
      {/* Presentation Top Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3 text-xs text-[#9C968B]">
          <span className="font-display font-semibold text-[#F6EFE2]">The Last Relic</span>
          <span aria-hidden="true">·</span>
          <span>Commercial Pitch Deck</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular text-[#C89B3C]">{slide.code}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={Boolean(pdfProgress)}
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-md border border-[#C89B3C]/60 bg-[#C89B3C]/15 px-3 py-1.5 text-xs font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/25 disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
            <span>{pdfProgress ?? 'Download PDF (16:9)'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-[#EAE6DF] transition-colors hover:bg-white/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C89B3C]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div className="flex flex-1 items-center overflow-y-auto px-6 py-8">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
              Slide {slide.code} · {slide.section}
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
              {slide.title}
            </h2>
            <p className="mt-4 text-base font-medium text-[#EAE6DF] italic">
              {slide.keyMessage}
            </p>

            <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm leading-relaxed text-[#D4CEC3]">
              {slide.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#C89B3C]" aria-hidden="true" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            {slide.showcaseItems && slide.showcaseItems.length > 0 ? (
              <div className="rounded-xl border border-white/15 bg-[#121216] p-4">
                {slide.showcaseTitle && (
                  <p className="mb-3 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
                    {slide.showcaseTitle}
                  </p>
                )}
                <div
                  className={`grid gap-2.5 ${
                    slide.showcaseItems.length === 6 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'
                  }`}
                >
                  {slide.showcaseItems.map((item) => (
                    <div
                      key={item.label}
                      className="overflow-hidden rounded-lg border border-white/10 bg-[#0A0A0D]"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#08080A]">
                        <img
                          src={item.image}
                          alt={item.label}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div
                        className="border-t-2 px-2.5 py-2"
                        style={{ borderTopColor: item.accentHex }}
                      >
                        <p className="truncate text-xs font-semibold text-[#F6EFE2]">
                          {item.label}
                        </p>
                        <p className="truncate text-[10px] text-[#9C968B]">{item.sublabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <MediaFrame
                src={slide.image}
                alt={slide.title}
                aspectClass="aspect-video"
                priority
              />
            )}
          </div>
        </div>
      </div>

      {/* Slide Navigator Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {PITCH_DECK_SLIDES.map((s, idx) => (
              <button
                key={s.index}
                type="button"
                onClick={() => onChangeSlide(idx)}
                className={`font-mono-tabular rounded px-2.5 py-1 text-xs transition-colors ${
                  idx === activeSlideIndex
                    ? 'bg-[#C89B3C] font-semibold text-[#0B0B0D]'
                    : 'bg-white/[0.04] text-[#9C968B] hover:text-[#EAE6DF]'
                }`}
              >
                {String(s.index).padStart(2, '0')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={activeSlideIndex === 0}
              onClick={() => onChangeSlide(Math.max(0, activeSlideIndex - 1))}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3.5 py-2 text-xs font-medium text-[#EAE6DF] transition-colors hover:bg-white/[0.06] disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span>Previous</span>
            </button>
            <button
              type="button"
              disabled={activeSlideIndex === PITCH_DECK_SLIDES.length - 1}
              onClick={() =>
                onChangeSlide(Math.min(PITCH_DECK_SLIDES.length - 1, activeSlideIndex + 1))
              }
              className="inline-flex items-center gap-1.5 rounded-md bg-[#C89B3C] px-3.5 py-2 text-xs font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A] disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
