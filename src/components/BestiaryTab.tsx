import { useState } from 'react';
import { Download, FileText, MapPin, Search, Shield, Skull, Swords } from 'lucide-react';
import { BESTIARY_CREATURES, type BestiaryCreature } from '../data/gddData';
import { exportBestiaryToPdf } from '../utils/atlasAndBestiaryPdf';
import { triggerFileDownload } from './setArtworkRenderer';

interface BestiaryTabProps {
  onOpenBiomes?: () => void;
}

type BeastTierFilter = 'all' | 'Tier I' | 'Tier II' | 'Tier III' | 'Tier IV';
type SquadScaleId = 'solo' | 'duo' | 'trio' | 'quad';

const SQUAD_MULTIPLIERS: { id: SquadScaleId; label: string; factorForTier: (c: BestiaryCreature) => number }[] = [
  { id: 'solo', label: 'Wanderer (Solo 1.0x)', factorForTier: () => 1 },
  {
    id: 'duo',
    label: 'Oath Duo',
    factorForTier: (c) =>
      c.tierLabel === 'Tier I' ? 1.2 : c.tierLabel === 'Tier II' ? 1.35 : c.tierLabel === 'Tier III' ? 1.5 : 1.35,
  },
  {
    id: 'trio',
    label: 'Oath Trio',
    factorForTier: (c) =>
      c.tierLabel === 'Tier I' ? 1.3 : c.tierLabel === 'Tier II' ? 1.55 : c.tierLabel === 'Tier III' ? 1.85 : 1.75,
  },
  {
    id: 'quad',
    label: 'Oath Quad',
    factorForTier: (c) =>
      c.tierLabel === 'Tier I' ? 1.4 : c.tierLabel === 'Tier II' ? 1.75 : c.tierLabel === 'Tier III' ? 2.2 : 2.2,
  },
];

export function BestiaryTab({ onOpenBiomes }: BestiaryTabProps) {
  const [tierFilter, setTierFilter] = useState<BeastTierFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lobbyAvgLv, setLobbyAvgLv] = useState<number>(80);
  const [squadScale, setSquadScale] = useState<SquadScaleId>('quad');
  const [pdfProgress, setPdfProgress] = useState<string | null>(null);

  const pveEffectiveLv = lobbyAvgLv + 100;
  const baseWarriorHp =
    pveEffectiveLv <= 8
      ? 150 + (pveEffectiveLv - 1) * 5
      : 185 + (pveEffectiveLv - 8) * 10;

  const activeScaler =
    SQUAD_MULTIPLIERS.find((s) => s.id === squadScale) ?? SQUAD_MULTIPLIERS[0];

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCreatures = BESTIARY_CREATURES.filter((c) => {
    const matchesTier = tierFilter === 'all' || c.tierLabel === tierFilter;
    const matchesSearch =
      normalizedQuery === '' ||
      c.name.toLowerCase().includes(normalizedQuery) ||
      c.title.toLowerCase().includes(normalizedQuery) ||
      c.biomeLabel.toLowerCase().includes(normalizedQuery) ||
      c.weakness.toLowerCase().includes(normalizedQuery) ||
      c.lore.toLowerCase().includes(normalizedQuery);
    return matchesTier && matchesSearch;
  });

  const handleDownloadCompendiumPdf = async () => {
    if (pdfProgress || filteredCreatures.length === 0) return;
    try {
      setPdfProgress('Preparing Bestiary PDF...');
      await exportBestiaryToPdf(filteredCreatures, lobbyAvgLv, (cur, tot) => {
        setPdfProgress(`Generating (${cur}/${tot})...`);
      });
    } finally {
      setPdfProgress(null);
    }
  };

  const handleDownloadCreatureArt = (creature: BestiaryCreature) => {
    triggerFileDownload(creature.image, `Valdris_Beast_${creature.id}.jpg`);
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Bestiary Hero & Live HP Scaler */}
        <div className="rounded-xl border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                PvPvE Monster Ecosystem · Server Scaling: Lv_avg + 100
              </p>
              <h1 className="font-display mt-2 text-3xl font-bold text-[#F6EFE2] text-balance lg:text-4xl">
                The Valdris Bestiary
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#B8B1A6]">
                Every monster and boss in The Last Relic scales dynamically against the lobby&apos;s
                average level (<span className="font-mono-tabular text-[#EAE6DF]">Lv_avg + 100</span>)
                and squad size, feeding the Retroactive Damage Ledger and the Gold Tier drop cap
                (35% base, rising to 50% at All Attack Types, Magic &amp; Defense Lv. 100+).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={Boolean(pdfProgress) || filteredCreatures.length === 0}
                onClick={handleDownloadCompendiumPdf}
                className="inline-flex items-center gap-2 rounded-md bg-[#C89B3C] px-4 py-2.5 text-xs font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A] disabled:opacity-60"
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                <span>{pdfProgress ?? 'Download Bestiary Compendium (PDF)'}</span>
              </button>
              {onOpenBiomes && (
                <button
                  type="button"
                  onClick={onOpenBiomes}
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-[#EAE6DF] transition-colors hover:bg-white/[0.08]"
                >
                  <MapPin className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                  <span>Explore Habitat Biomes</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Live Scaling Bar */}
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-white/10 pt-5 lg:grid-cols-12">
            <div className="rounded-lg border border-white/10 bg-[#0F0F12] p-4 lg:col-span-5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="bestiary-lv-avg" className="text-[#9C968B]">
                  Lobby Average Level (Lv_avg)
                </label>
                <span className="font-mono-tabular font-semibold text-[#F6EFE2]">
                  Lv. {lobbyAvgLv} → PvE Lv. {pveEffectiveLv}
                </span>
              </div>
              <input
                id="bestiary-lv-avg"
                type="range"
                min={10}
                max={200}
                step={5}
                value={lobbyAvgLv}
                onChange={(e) => setLobbyAvgLv(Number(e.target.value))}
                className="mt-2.5 w-full accent-[#C89B3C]"
              />
              <p className="mt-1.5 text-[11px] text-[#9C968B]">
                Base Warrior Curve @ PvE Lv.{pveEffectiveLv}:{' '}
                <span className="font-mono-tabular text-[#EAE6DF]">
                  {baseWarriorHp.toLocaleString('en-US')} HP
                </span>
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#0F0F12] p-4 lg:col-span-7">
              <p className="text-xs text-[#9C968B]">Match Squad Scaling Profile</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {SQUAD_MULTIPLIERS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSquadScale(s.id)}
                    className={`rounded px-2.5 py-2 text-[11px] font-semibold transition-colors ${
                      squadScale === s.id
                        ? 'bg-[#C89B3C] text-[#0B0B0D]'
                        : 'bg-[#17171C] text-[#B8B1A6] hover:text-[#F6EFE2]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-[#9C968B]">
                Adjusts all monster &amp; boss HP pools live across Oath Mode (Duos/Trios/Quads)
                and Wanderer Mode (Solo).
              </p>
            </div>
          </div>

          {/* Tier & Search Filters */}
          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['all', `All Threats (${BESTIARY_CREATURES.length})`],
                  ['Tier I', 'Tier I · Low (2)'],
                  ['Tier II', 'Tier II · Medium (2)'],
                  ['Tier III', 'Tier III · Catacomb Bosses (2)'],
                  ['Tier IV', 'Tier IV · Black Bell Boss (1)'],
                ] as [BeastTierFilter, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTierFilter(key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    tierFilter === key
                      ? 'bg-[#C89B3C] text-[#0B0B0D]'
                      : 'bg-[#0F0F12] text-[#B8B1A6] hover:text-[#F6EFE2]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#9C968B]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search monster, biome, weakness..."
                aria-label="Search Bestiary"
                className="w-full rounded-md border border-white/10 bg-[#0F0F12] py-1.5 pr-3 pl-8 text-xs text-[#F6EFE2] placeholder-[#767067] focus:border-[#C89B3C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Unfolded Creature Grid */}
        {filteredCreatures.length === 0 ? (
          <div className="mt-8 rounded-xl border border-white/10 bg-[#141417] p-12 text-center">
            <p className="font-display text-xl font-semibold text-[#F6EFE2]">
              No creatures match your filter
            </p>
            <button
              type="button"
              onClick={() => {
                setTierFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 rounded-md bg-[#C89B3C] px-4 py-2 text-xs font-semibold text-[#0B0B0D]"
            >
              Reset Bestiary Filter
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredCreatures.map((creature) => {
              const squadFactor = activeScaler.factorForTier(creature);
              const computedHp = Math.round(
                baseWarriorHp * creature.hpMultiplier * squadFactor
              );
              const soloHp = Math.round(baseWarriorHp * creature.hpMultiplier);

              return (
                <article
                  key={creature.id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141417]"
                >
                  <div>
                    {/* Card Top Strip */}
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-[#101014] px-5 py-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-sm"
                          style={{ backgroundColor: creature.tierHex }}
                          aria-hidden="true"
                        />
                        <span className="font-semibold" style={{ color: creature.tierHex }}>
                          {creature.tierLabel}
                        </span>
                        <span className="text-[#9C968B]">· {creature.difficulty}</span>
                      </div>
                      <span className="font-mono-tabular text-[11px] text-[#C89B3C]">
                        {creature.acts}
                      </span>
                    </div>

                    {/* Creature Concept Art */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#08080A]">
                      <img
                        src={creature.image}
                        alt={`${creature.name} - ${creature.title}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-top"
                      />
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#08080A] via-[#08080A]/80 to-transparent"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 px-5 pb-3.5">
                        <div>
                          <h2 className="font-display text-2xl font-bold text-[#F6EFE2]">
                            {creature.name}
                          </h2>
                          <p className="text-xs text-[#C89B3C] italic">{creature.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-[#9C968B] uppercase">Computed HP</p>
                          <p className="font-mono-tabular text-lg font-bold text-[#F6EFE2]">
                            {computedHp.toLocaleString('en-US')} HP
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Telemetry & Lore */}
                    <div className="p-5">
                      <dl className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-[#0F0F12] p-3 text-xs">
                        <div>
                          <dt className="text-[10px] text-[#9C968B]">Base Scale</dt>
                          <dd className="font-mono-tabular mt-0.5 font-semibold text-[#EAE6DF]">
                            {creature.hpMultiplier.toFixed(2)}x ({soloHp.toLocaleString('en-US')})
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] text-[#9C968B]">Base Kill EXP</dt>
                          <dd className="font-mono-tabular mt-0.5 font-semibold text-[#D4AF37]">
                            +{creature.baseExpReward} EXP
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] text-[#9C968B]">PvP Risk Ping</dt>
                          <dd className="mt-0.5 truncate font-semibold text-[#E59E88]">
                            {creature.pvpAlertRadius}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-4 text-xs leading-relaxed text-[#D4CEC3]">
                        {creature.lore}
                      </p>

                      <div className="mt-4">
                        <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#C89B3C] uppercase">
                          <Swords className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Combat Patterns</span>
                        </p>
                        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-[#B8B1A6]">
                          {creature.combatBehavior.map((b) => (
                            <li key={b} className="flex items-start gap-2">
                              <span
                                className="mt-1.5 h-1 w-1 shrink-0 bg-[#C89B3C]"
                                aria-hidden="true"
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 space-y-2 rounded-lg border border-white/10 bg-[#0F0F12] p-3.5 text-xs">
                        <div>
                          <span className="font-semibold text-[#4F9E68]">Counterplay: </span>
                          <span className="text-[#D4CEC3]">{creature.counterplayTip}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#E59E88]">Weakness: </span>
                          <span className="text-[#EAE6DF]">{creature.weakness}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#D4AF37]">Drops: </span>
                          <span className="text-[#B8B1A6]">{creature.guaranteedDrops}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#101014] px-5 py-3 text-xs">
                    <button
                      type="button"
                      onClick={onOpenBiomes}
                      className="inline-flex items-center gap-1.5 text-[#9C968B] transition-colors hover:text-[#C89B3C]"
                    >
                      <MapPin className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                      <span className="truncate max-w-[230px]">{creature.biomeLabel}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadCreatureArt(creature)}
                      className="inline-flex items-center gap-1.5 rounded border border-[#C89B3C]/50 bg-[#C89B3C]/10 px-2.5 py-1 text-[11px] font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/20"
                    >
                      <Download className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                      <span>Download Render (.jpg)</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Mastery Damage Note */}
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-white/10 bg-[#141417] p-5 text-xs text-[#B8B1A6] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-[#C89B3C]" aria-hidden="true" />
            <p>
              <span className="font-semibold text-[#F6EFE2]">Mastery PvE Advantage:</span>{' '}
              Warriors reaching General Lv.100 deal +15% PvE damage (+30% at Lv.200) and scale
              Tier III-IV Gold drop chances up to 35% base cap - rising to 50% upon reaching Lv.100
              in all Attack Types, Magic, and Defense.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 shrink-0 font-mono-tabular text-[#C89B3C]">
            <Skull className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Retroactive Damage Ledger Active</span>
          </span>
        </div>
      </div>
    </section>
  );
}
