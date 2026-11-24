import { useState } from 'react';
import { Compass, Download, FileText, MapPin, ShieldAlert, Skull } from 'lucide-react';
import { BIOMES, type BiomeSpec } from '../data/gddData';
import { exportBiomesAtlasToPdf } from '../utils/atlasAndBestiaryPdf';
import { triggerFileDownload } from './setArtworkRenderer';

interface BiomesTabProps {
  onOpenBestiary?: () => void;
}

type BiomePhaseFilter = 'all' | 'early' | 'mid' | 'endgame';

export function BiomesTab({ onOpenBestiary }: BiomesTabProps) {
  const [phaseFilter, setPhaseFilter] = useState<BiomePhaseFilter>('all');
  const [pdfProgress, setPdfProgress] = useState<string | null>(null);

  const filteredBiomes = BIOMES.filter((b) => {
    if (phaseFilter === 'early') return b.id === 'marismas' || b.id === 'bosque';
    if (phaseFilter === 'mid') return b.id === 'catacumbas' || b.id === 'bosque';
    if (phaseFilter === 'endgame') return b.id === 'ciudadela' || b.id === 'catacumbas';
    return true;
  });

  const handleDownloadAtlasPdf = async () => {
    if (pdfProgress) return;
    try {
      setPdfProgress('Preparing Atlas PDF...');
      await exportBiomesAtlasToPdf(filteredBiomes, (cur, tot) => {
        setPdfProgress(`Generating (${cur}/${tot})...`);
      });
    } finally {
      setPdfProgress(null);
    }
  };

  const handleDownloadBiomeArt = (biome: BiomeSpec) => {
    triggerFileDownload(biome.image, `Valdris_Biome_${biome.id}.jpg`);
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Top Strategic Atlas Banner */}
        <div className="rounded-xl border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                World of Valdris · Multi-Level PvPvE Geography
              </p>
              <h1 className="font-display mt-2 text-3xl font-bold text-[#F6EFE2] text-balance lg:text-4xl">
                Strategic Biomes Atlas
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#B8B1A6]">
                Four interlocking regions built for 200-Warrior Battle Royale rotations beneath The
                Abyssal Ash - combining toxic marsh catwalks, vertical tree canopies, claustrophobic
                catacombs, and the three-tier Citadel Throne Hall.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={Boolean(pdfProgress)}
                onClick={handleDownloadAtlasPdf}
                className="inline-flex items-center gap-2 rounded-md bg-[#C89B3C] px-4 py-2.5 text-xs font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A] disabled:opacity-60"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>{pdfProgress ?? 'Download Biomes Atlas (PDF)'}</span>
              </button>
              {onOpenBestiary && (
                <button
                  type="button"
                  onClick={onOpenBestiary}
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#EAE6DF] transition-colors hover:bg-white/[0.08]"
                >
                  <Skull className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                  <span>Inspect Valdris Bestiary</span>
                </button>
              )}
            </div>
          </div>

          {/* Phase Filter Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['all', 'All 4 Biomes'],
                  ['early', 'Acts I-II · Outer Flanks'],
                  ['mid', 'Acts II-III · Sanctums & Canopies'],
                  ['endgame', 'Acts IV-V · Black Bell & Citadel'],
                ] as [BiomePhaseFilter, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPhaseFilter(key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    phaseFilter === key
                      ? 'bg-[#C89B3C] text-[#0B0B0D]'
                      : 'bg-[#0F0F12] text-[#B8B1A6] hover:text-[#F6EFE2]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#9C968B]">
              Every minute survived across Valdris grants +20 Base EXP toward endgame progression.
            </span>
          </div>
        </div>

        {/* Unfolded Biome Detail Cards */}
        <div className="mt-8 space-y-8">
          {filteredBiomes.map((biome, index) => (
            <article
              key={biome.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-[#141417]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual Key Art + Download */}
                <div
                  className={`flex flex-col justify-between bg-[#0B0B0D] lg:col-span-6 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <img
                      src={biome.image}
                      alt={biome.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/70 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 pb-3 text-xs">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#C89B3C]">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{biome.location}</span>
                      </span>
                      <span className="font-mono-tabular text-[#F6EFE2]">{biome.acts}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#101014] px-4 py-3 text-xs">
                    <span className="text-[#9C968B]">{biome.caption}</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadBiomeArt(biome)}
                      className="inline-flex items-center gap-1.5 rounded border border-[#C89B3C]/50 bg-[#C89B3C]/10 px-2.5 py-1 text-[11px] font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/20"
                    >
                      <Download className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                      <span>Download Concept (.jpg)</span>
                    </button>
                  </div>
                </div>

                {/* Full Tactical Geography Breakdown */}
                <div
                  className={`flex flex-col justify-between p-6 lg:col-span-6 lg:p-8 ${
                    index % 2 === 1 ? 'lg:order-1' : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#C89B3C] uppercase tracking-wider">
                        {biome.threat}
                      </span>
                      <span className="text-[#9C968B]">{biome.elevationProfile}</span>
                    </div>

                    <h2 className="font-display mt-2 text-2xl font-bold text-[#F6EFE2] lg:text-3xl">
                      {biome.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#D4CEC3]">
                      {biome.description}
                    </p>

                    <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-[#0F0F12] p-4 text-xs sm:grid-cols-2">
                      <div>
                        <p className="text-[#9C968B]">Abyssal Ash Closure</p>
                        <p className="mt-1 font-semibold text-[#EAE6DF]">
                          {biome.ashClosureWindow}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#9C968B]">Primary Loot Profile</p>
                        <p className="mt-1 font-semibold text-[#D4AF37]">{biome.lootFocus}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#9C968B] uppercase">
                        <ShieldAlert className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                        <span>Environmental Hazards &amp; Rotation Rules</span>
                      </p>
                      <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#B8B1A6]">
                        {biome.environmentalHazards.map((hz) => (
                          <li key={hz} className="flex items-start gap-2">
                            <span
                              className="mt-1.5 h-1 w-1 shrink-0 bg-[#C89B3C]"
                              aria-hidden="true"
                            />
                            <span>{hz}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Native Beasts, Roles & Seals */}
                  <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#9C968B]">Native PvE Threats:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {biome.nativeBeasts.map((beast) => (
                          <button
                            key={beast}
                            type="button"
                            onClick={onOpenBestiary}
                            className="rounded border border-white/15 bg-[#0F0F12] px-2 py-0.5 text-[11px] font-medium text-[#EAE6DF] transition-colors hover:border-[#C89B3C]/60 hover:text-[#C89B3C]"
                          >
                            {beast}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#9C968B]">Favored Specializations:</span>
                      <span className="font-medium text-[#F6EFE2]">
                        {biome.recommendedSpecializations.join(' · ')}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[#9C968B]">Key Ether Seals:</span>
                      <span className="font-medium text-[#91C6FF]">
                        {biome.recommendedSeals.join(' · ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Comparison Summary Matrix */}
        <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-[#141417]">
          <div className="flex items-center gap-2 border-b border-white/10 px-6 py-4">
            <Compass className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
            <h2 className="font-display text-lg font-semibold text-[#F6EFE2]">
              Match Rotation &amp; Abyssal Ash Timing Matrix
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#101014] text-[#9C968B]">
                  <th className="px-5 py-3 font-medium">Region</th>
                  <th className="px-5 py-3 font-medium">Flank</th>
                  <th className="px-5 py-3 font-medium">Active Acts</th>
                  <th className="px-5 py-3 font-medium">Ash Seal / Closure</th>
                  <th className="px-5 py-3 font-medium">Tactical Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#EAE6DF]">
                {BIOMES.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-3 font-semibold text-[#F6EFE2]">{b.name}</td>
                    <td className="px-5 py-3 text-[#C89B3C]">{b.location}</td>
                    <td className="px-5 py-3 font-mono-tabular">{b.acts}</td>
                    <td className="px-5 py-3 text-[#B8B1A6]">{b.ashClosureWindow}</td>
                    <td className="px-5 py-3 text-[#D4CEC3]">{b.lootFocus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
