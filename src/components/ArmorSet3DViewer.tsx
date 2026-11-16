import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { type EquipmentSetSpec } from '../data/equipmentSets';
import {
  getCachedSetArtwork,
  getRenderedSetArtwork,
  getSetStyleProfile,
  triggerFileDownload,
} from './setArtworkRenderer';

interface ArmorSet3DViewerProps {
  activeSet: EquipmentSetSpec;
}

type InspectFocus = 'completo' | 'armadura' | 'arma';

export function ArmorSet3DViewer({ activeSet }: ArmorSet3DViewerProps) {
  const [inspectFocus, setInspectFocus] = useState<InspectFocus>('completo');
  const baseSrc = activeSet.designImageSrc;
  const [renderedSrc, setRenderedSrc] = useState<string>(
    () => getCachedSetArtwork(activeSet.id) ?? baseSrc
  );
  const [imgError, setImgError] = useState(false);

  const styleProfile = getSetStyleProfile(activeSet);

  useEffect(() => {
    let cancelled = false;
    setImgError(false);

    const cached = getCachedSetArtwork(activeSet.id);
    if (cached) {
      setRenderedSrc(cached);
      return;
    }

    setRenderedSrc(baseSrc);

    getRenderedSetArtwork(activeSet).then((uniqueDataUrl) => {
      if (!cancelled) {
        setRenderedSrc(uniqueDataUrl);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeSet, baseSrc]);

  const handleDownloadArtwork = async () => {
    const url = await getRenderedSetArtwork(activeSet);
    const safeSlug = activeSet.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    triggerFileDownload(url, `${activeSet.id}_${safeSlug}.jpg`);
  };

  const zoomClass =
    inspectFocus === 'armadura'
      ? 'scale-125 object-[50%_24%]'
      : inspectFocus === 'arma'
      ? 'scale-125 object-[26%_52%]'
      : 'scale-100 object-center';

  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#0C0C10]">
      {/* Top Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#121216] px-4 py-2.5 text-xs">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: activeSet.tierHex }}
            aria-hidden="true"
          />
          <span className="font-display font-semibold text-[#F6EFE2] truncate">
            {activeSet.name}
          </span>
        </div>
        <span className="font-mono-tabular text-[11px] text-[#9C968B] whitespace-nowrap">
          Set #{String(activeSet.setNumber).padStart(2, '0')}/15 · {activeSet.professionLabel}
        </span>
      </div>

      {/* High-Detail Per-Set 3D Render Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#09090C]">
        {!imgError ? (
          <img
            src={renderedSrc}
            alt={`Unique 3D design for ${activeSet.name} (${activeSet.professionLabel}): ${activeSet.visualDesignNote}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className={`h-full w-full object-cover transition-transform duration-500 ${zoomClass}`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
            <p className="font-display text-lg font-semibold text-[#F6EFE2]">
              {activeSet.name}
            </p>
            <p className="mt-1 text-xs text-[#9C968B]">
              {activeSet.armorName} · {activeSet.weaponName}
            </p>
          </div>
        )}

        {/* Bottom Caption Strip */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#09090C] via-[#09090C]/85 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 px-4 pb-3 text-xs">
          <div className="max-w-md">
            <p className="font-semibold" style={{ color: activeSet.tierHex }}>
              {activeSet.tierLabel} · {styleProfile.materialLabel}
            </p>
            <p className="mt-0.5 text-[11px] text-[#EAE6DF]">
              {activeSet.visualDesignNote}
            </p>
          </div>
          <span className="font-mono-tabular text-[11px] font-semibold text-[#F6EFE2]">
            {activeSet.focusType} Focus · Atk {activeSet.weaponAttack} / Def{' '}
            {activeSet.armorDefense + activeSet.shieldDefense}
          </span>
        </div>
      </div>

      {/* Compact Frame Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#121216] px-4 py-2.5 text-xs">
        <div className="flex items-center gap-1">
          {(
            [
              ['completo', 'Full Set'],
              ['armadura', 'Helm & Cuirass'],
              ['arma', 'Weapon Detail'],
            ] as [InspectFocus, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setInspectFocus(key)}
              className={`rounded px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors ${
                inspectFocus === key
                  ? 'bg-[#C89B3C] text-[#0B0B0D]'
                  : 'bg-[#1A1A20] text-[#B8B1A6] hover:text-[#F6EFE2]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleDownloadArtwork}
          className="inline-flex items-center gap-1.5 rounded border border-[#C89B3C]/50 bg-[#C89B3C]/10 px-2.5 py-1 text-[11px] font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/20"
        >
          <Download className="h-3 w-3 text-[#C89B3C]" aria-hidden="true" />
          <span>Download Artwork (.jpg)</span>
        </button>
      </div>
    </div>
  );
}
