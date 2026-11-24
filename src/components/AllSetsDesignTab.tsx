import { useEffect, useRef, useState } from 'react';
import { Download, FileText, Search, Shield, Sword } from 'lucide-react';
import {
  EQUIPMENT_SETS,
  PROFESSION_SET_LIST,
  computeDefenseStats,
  type EquipmentSetSpec,
  type QualityTierKey,
  type SetFocusType,
  type WarriorArchetypeId,
} from '../data/gddData';
import { exportSetsCatalogToPdf } from '../utils/setsCatalogPdf';
import {
  getCachedSetArtwork,
  getRenderedSetArtwork,
  getSetStyleProfile,
  triggerFileDownload,
} from './setArtworkRenderer';

type ProfessionFilter = 'all' | WarriorArchetypeId;
type TierFilter = 'all' | QualityTierKey;
type FocusFilter = 'all' | SetFocusType;

function SetDesignCard({ set }: { set: EquipmentSetSpec }) {
  const cardRef = useRef<HTMLElement | null>(null);
  const [artworkUrl, setArtworkUrl] = useState<string>(
    () => getCachedSetArtwork(set.id) ?? set.designImageSrc
  );
  const [downloadingSheet, setDownloadingSheet] = useState(false);

  const styleProfile = getSetStyleProfile(set);
  const minDefStats = computeDefenseStats(
    set.armorDefense,
    set.shieldDefense,
    set.minDefenseLevel,
    set.baseShieldBlockPct
  );

  useEffect(() => {
    const cached = getCachedSetArtwork(set.id);
    if (cached) {
      setArtworkUrl(cached);
      return;
    }

    let cancelled = false;
    const node = cardRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      getRenderedSetArtwork(set).then((url) => {
        if (!cancelled) setArtworkUrl(url);
      });
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          getRenderedSetArtwork(set).then((url) => {
            if (!cancelled) setArtworkUrl(url);
          });
        }
      },
      { rootMargin: '320px' }
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [set]);

  const handleDownloadJpg = async () => {
    const url = await getRenderedSetArtwork(set);
    const safeSlug = set.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    triggerFileDownload(url, `${set.id}_${safeSlug}.jpg`);
  };

  const handleDownloadSetPdf = async () => {
    if (downloadingSheet) return;
    try {
      setDownloadingSheet(true);
      const safeSlug = set.name.toLowerCase().replace(/[^a-z0-9]+/g, '_');
      await exportSetsCatalogToPdf(
        [set],
        `${set.professionLabel} · Set #${String(set.setNumber).padStart(2, '0')}`,
        `${set.id}_${safeSlug}_Sheet.pdf`
      );
    } finally {
      setDownloadingSheet(false);
    }
  };

  return (
    <article
      ref={cardRef}
      className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141417] transition-colors hover:border-white/20"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#101014] px-4 py-2.5 text-xs">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: set.tierHex }}
              aria-hidden="true"
            />
            <span className="font-mono-tabular text-[11px] font-semibold text-[#C89B3C]">
              SKIN #{String(set.setNumber).padStart(2, '0')}/15
            </span>
            <span className="truncate text-[11px] text-[#B8B1A6]">{set.professionLabel}</span>
          </div>
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${
              set.focusType === 'Attack'
                ? 'bg-[#C85A3C]/20 text-[#F09A82]'
                : set.focusType === 'Defense'
                ? 'bg-[#3E82C7]/20 text-[#91C6FF]'
                : 'bg-[#C89B3C]/20 text-[#E5C168]'
            }`}
          >
            {set.focusType} Focus
          </span>
        </div>

        {/* 3D Rendered Artwork */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#09090C]">
          <img
            src={artworkUrl}
            alt={`${set.name} (${set.professionLabel}) Launch Cosmetic Skin - ${set.visualDesignNote}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-top"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#09090C] via-[#09090C]/75 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-3.5 pb-2.5 text-[11px]">
            <span className="font-semibold" style={{ color: set.tierHex }}>
              Cosmetic Skin · Zero Stat Lock
            </span>
            <span className="font-mono-tabular text-[#F6EFE2]">
              Visual Mesh Only
            </span>
          </div>
        </div>

        {/* Set Title & Visual Craft Explanation */}
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">{set.name}</h3>
          <p className="mt-1 text-[11px] font-semibold text-[#C89B3C]">
            Skin Material Finish: {styleProfile.materialLabel}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#D4CEC3]">{set.visualDesignNote}</p>

          {/* Logical Data Reference (Unrelated to Cosmetic Skin) */}
          <dl className="mt-3.5 space-y-1.5 rounded-md border border-white/10 bg-[#0F0F12] p-3 text-[11px]">
            <div className="mb-1.5 flex items-center justify-between border-b border-white/10 pb-1 text-[10px]">
              <span className="font-semibold uppercase tracking-wider text-[#9C968B]">
                Unrelated Logical Stat Data ({set.tierLabel})
              </span>
              <span className="font-mono-tabular text-[#D4AF37]">Zero Skin Coupling</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <dt className="shrink-0 text-[#9C968B]">Weapon</dt>
              <dd className="text-right font-medium text-[#EAE6DF]">
                {set.weaponName}{' '}
                <span className="font-mono-tabular text-[#E59E88]">(Atk {set.weaponAttack})</span>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-2">
              <dt className="shrink-0 text-[#9C968B]">Armor</dt>
              <dd className="text-right font-medium text-[#EAE6DF]">
                {set.armorName}{' '}
                <span className="font-mono-tabular text-[#91C6FF]">(Def {set.armorDefense})</span>
              </dd>
            </div>
            <div className="flex items-start justify-between gap-2">
              <dt className="shrink-0 text-[#9C968B]">Shield / Offhand</dt>
              <dd className="text-right font-medium text-[#EAE6DF]">
                {set.shieldName}{' '}
                <span className="font-mono-tabular text-[#91C6FF]">
                  (Def {set.shieldDefense} · {set.baseShieldBlockPct}% Blk)
                </span>
              </dd>
            </div>
          </dl>

          {/* Tactical Perk & Combat Math */}
          <div className="mt-3 rounded-md border border-white/10 bg-[#0F0F12] p-3">
            <p className="text-[11px] font-semibold text-[#D4AF37]">
              {set.focusTarget}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#B8B1A6]">{set.focusAdvantage}</p>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-2 text-[10px] text-[#9C968B]">
              <span>
                Data Req: Lv.{set.minGeneralLevel} · {set.attackSkillLabel} {set.minAttackMastery} ·
                Def Lv.{set.minDefenseLevel}
              </span>
              <span className="font-mono-tabular text-[#EAE6DF]">
                Mitigation @ min Def: {minDefStats.mitigationPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Footer Actions */}
      <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-[#101014] px-4 py-3">
        <button
          type="button"
          onClick={handleDownloadJpg}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#C89B3C]/50 bg-[#C89B3C]/10 px-3 py-1.5 text-[11px] font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/20"
        >
          <Download className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
          <span>Image (.jpg)</span>
        </button>
        <button
          type="button"
          disabled={downloadingSheet}
          onClick={handleDownloadSetPdf}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-[#EAE6DF] transition-colors hover:bg-white/[0.09] disabled:opacity-50"
        >
          <FileText className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
          <span>{downloadingSheet ? 'Exporting...' : 'Set Sheet (.pdf)'}</span>
        </button>
      </div>
    </article>
  );
}

export function AllSetsDesignTab() {
  const [professionFilter, setProfessionFilter] = useState<ProfessionFilter>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [focusFilter, setFocusFilter] = useState<FocusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogPdfProgress, setCatalogPdfProgress] = useState<string | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredSets = EQUIPMENT_SETS.filter((set) => {
    const matchesProf = professionFilter === 'all' || set.professionId === professionFilter;
    const matchesTier = tierFilter === 'all' || set.tierKey === tierFilter;
    const matchesFocus = focusFilter === 'all' || set.focusType === focusFilter;
    const matchesSearch =
      normalizedQuery === '' ||
      set.name.toLowerCase().includes(normalizedQuery) ||
      set.weaponName.toLowerCase().includes(normalizedQuery) ||
      set.armorName.toLowerCase().includes(normalizedQuery) ||
      set.focusAdvantage.toLowerCase().includes(normalizedQuery) ||
      set.visualDesignNote.toLowerCase().includes(normalizedQuery);
    return matchesProf && matchesTier && matchesFocus && matchesSearch;
  });

  const handleDownloadCatalogPdf = async (setsToExport: EquipmentSetSpec[], label: string, filename: string) => {
    if (catalogPdfProgress || setsToExport.length === 0) return;
    try {
      setCatalogPdfProgress(`Preparing PDF (0/${setsToExport.length})...`);
      await exportSetsCatalogToPdf(setsToExport, label, filename, (cur, tot) => {
        setCatalogPdfProgress(`Rendering PDF (${cur}/${tot})...`);
      });
    } finally {
      setCatalogPdfProgress(null);
    }
  };

  const activeProfGroups =
    professionFilter === 'all'
      ? PROFESSION_SET_LIST
      : PROFESSION_SET_LIST.filter((p) => p.id === professionFilter);

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Top Hero / Header Banner */}
        <div className="rounded-xl border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                Episode I Launch Cosmetic Catalog · 6 Professions × 15 Skins = 90 Visual Designs
              </p>
              <h1 className="font-display mt-2 text-3xl font-bold text-[#F6EFE2] text-balance lg:text-4xl">
                90 Launch Cosmetic Skins (Dual Unlock · Unrelated to Gear Data)
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#B8B1A6]">
                Equipped match gear alters{' '}
                <strong className="text-[#EAE6DF]">Logical Stats &amp; Build Data only</strong>.
                All 90 3D designs form Episode I&apos;s{' '}
                <strong className="text-[#EAE6DF]">Launch Cosmetic Skins</strong> with a{' '}
                <strong className="text-[#EAE6DF]">Separate Weapon Mastery Track</strong> (isolated
                from Attack Type Level &amp; Defense Level): earning organic Weapon Mastery unlocks
                that weapon&apos;s Skin for free, while direct Skin purchase immediately masterizes
                that weapon&apos;s Separate Mastery to its max attack tier without touching Attack
                Type or Defense Level.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={Boolean(catalogPdfProgress)}
                onClick={() =>
                  handleDownloadCatalogPdf(
                    EQUIPMENT_SETS,
                    'Episode I Launch Cosmetic Skins Catalog (90 Designs)',
                    'The_Last_Relic_90_Launch_Cosmetic_Skins_EN.pdf'
                  )
                }
                className="inline-flex items-center gap-2 rounded-md bg-[#C89B3C] px-4 py-2.5 text-xs font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A] disabled:opacity-60"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>{catalogPdfProgress ?? 'Download All 90 Skins Catalog (PDF)'}</span>
              </button>

              {filteredSets.length !== EQUIPMENT_SETS.length && filteredSets.length > 0 && (
                <button
                  type="button"
                  disabled={Boolean(catalogPdfProgress)}
                  onClick={() =>
                    handleDownloadCatalogPdf(
                      filteredSets,
                      `Filtered Catalog (${filteredSets.length} Sets)`,
                      `The_Last_Relic_Filtered_Sets_${filteredSets.length}_EN.pdf`
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-md border border-[#C89B3C]/60 bg-[#C89B3C]/15 px-4 py-2.5 text-xs font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/25 disabled:opacity-60"
                >
                  <Download className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                  <span>Download Filtered ({filteredSets.length} Sets PDF)</span>
                </button>
              )}
            </div>
          </div>

          {/* Summary Telemetry Strip */}
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 text-xs sm:grid-cols-4">
            <div>
              <dt className="text-[#9C968B]">Displayed Sets</dt>
              <dd className="font-mono-tabular mt-0.5 text-lg font-semibold text-[#F6EFE2]">
                {filteredSets.length} / {EQUIPMENT_SETS.length}
              </dd>
            </div>
            <div>
              <dt className="text-[#9C968B]">Specializations</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#EAE6DF]">
                <Sword className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                <span>6 Dynamic Warrior Paths</span>
              </dd>
            </div>
            <div>
              <dt className="text-[#9C968B]">Archer Kit Standard</dt>
              <dd className="mt-0.5 text-sm font-semibold text-[#4F9E68]">
                Dual Crossbows (1 per Hand)
              </dd>
            </div>
            <div>
              <dt className="text-[#9C968B]">Protection Math</dt>
              <dd className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#91C6FF]">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Armor + Shield + Defense Lv</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 rounded-xl border border-white/10 bg-[#141417] p-4 space-y-4">
          {/* Profession Tabs */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setProfessionFilter('all')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                professionFilter === 'all'
                  ? 'bg-[#C89B3C] text-[#0B0B0D]'
                  : 'bg-[#0F0F12] text-[#B8B1A6] hover:text-[#F6EFE2]'
              }`}
            >
              All 6 Professions (90)
            </button>
            {PROFESSION_SET_LIST.map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => setProfessionFilter(prof.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  professionFilter === prof.id
                    ? 'bg-[#C89B3C] text-[#0B0B0D]'
                    : 'bg-[#0F0F12] text-[#B8B1A6] hover:text-[#F6EFE2]'
                }`}
              >
                {prof.label} (15)
              </button>
            ))}
          </div>

          {/* Tier + Focus + Search */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ['all', 'All Tiers'],
                    ['gris', 'Grey'],
                    ['verde', 'Green'],
                    ['azul', 'Blue'],
                    ['morado', 'Purple'],
                    ['dorado', 'Gold'],
                  ] as [TierFilter, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTierFilter(key)}
                    className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      tierFilter === key
                        ? 'bg-[#282830] text-[#F6EFE2]'
                        : 'bg-[#0F0F12] text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <span className="hidden h-4 w-px bg-white/10 sm:inline-block" aria-hidden="true" />

              <div className="flex flex-wrap gap-1">
                {(
                  [
                    ['all', 'All Focus'],
                    ['Attack', 'Attack'],
                    ['Defense', 'Defense'],
                    ['Hybrid', 'Hybrid'],
                  ] as [FocusFilter, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFocusFilter(key)}
                    className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      focusFilter === key
                        ? 'bg-[#C89B3C] font-semibold text-[#0B0B0D]'
                        : 'bg-[#0F0F12] text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full lg:w-72">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#9C968B]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search set, weapon, armor, perk..."
                aria-label="Search armor sets"
                className="w-full rounded-md border border-white/10 bg-[#0F0F12] py-1.5 pr-3 pl-8 text-xs text-[#F6EFE2] placeholder-[#767067] focus:border-[#C89B3C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Unfolded Profession Sections */}
        {filteredSets.length === 0 ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#141417] p-12 text-center">
            <p className="font-display text-xl font-semibold text-[#F6EFE2]">
              No matching sets found
            </p>
            <p className="mt-2 text-xs text-[#9C968B]">
              Clear your search filter or choose another Tier / Focus combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setProfessionFilter('all');
                setTierFilter('all');
                setFocusFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-md bg-[#C89B3C] px-4 py-2 text-xs font-semibold text-[#0B0B0D]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {activeProfGroups.map((prof) => {
              const profFiltered = filteredSets.filter((s) => s.professionId === prof.id);
              if (profFiltered.length === 0) return null;

              return (
                <div key={prof.id}>
                  <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] tracking-widest text-[#C89B3C] uppercase">
                        {prof.skillLabel} · {profFiltered.length} Set
                        {profFiltered.length === 1 ? '' : 's'} Shown
                      </p>
                      <h2 className="font-display mt-1 text-2xl font-semibold text-[#F6EFE2]">
                        {prof.label}
                      </h2>
                    </div>

                    <button
                      type="button"
                      disabled={Boolean(catalogPdfProgress)}
                      onClick={() =>
                        handleDownloadCatalogPdf(
                          profFiltered,
                          `${prof.label} (${profFiltered.length} Sets)`,
                          `The_Last_Relic_${prof.id}_Sets_EN.pdf`
                        )
                      }
                      className="inline-flex items-center gap-1.5 self-start rounded-md border border-white/15 bg-[#141417] px-3 py-1.5 text-xs font-semibold text-[#EAE6DF] transition-colors hover:border-[#C89B3C]/60 hover:text-[#F6EFE2] disabled:opacity-50"
                    >
                      <Download className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                      <span>Download {prof.label} Pack (PDF)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {profFiltered.map((set) => (
                      <SetDesignCard key={set.id} set={set} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
