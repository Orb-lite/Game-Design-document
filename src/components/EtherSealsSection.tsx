import { useState } from 'react';
import {
  ETHER_SEALS,
  GENERATED_ASSETS,
  getWarriorArchetype,
  type PlayerCombatProfile,
  type SealCategory,
} from '../data/gddData';
import { MediaFrame } from './MediaFrame';

type SealFilter = 'All' | SealCategory;

const FILTER_OPTIONS: SealFilter[] = [
  'All',
  'Control & Terrain',
  'Offensive',
  'Mobility & Survival',
];

interface EtherSealsSectionProps {
  profile: PlayerCombatProfile;
  onChangeProfile: (next: PlayerCombatProfile) => void;
  onCastSpell: (kind: 'offensive' | 'support') => void;
}

export function EtherSealsSection({
  profile,
  onChangeProfile,
  onCastSpell,
}: EtherSealsSectionProps) {
  const [filter, setFilter] = useState<SealFilter>('All');
  const [equippedIds, setEquippedIds] = useState<string[]>([
    'bastion',
    'ejecucion',
    'traslacion',
  ]);

  const activeArchetype = getWarriorArchetype(profile);

  const filteredSeals =
    filter === 'All'
      ? ETHER_SEALS
      : ETHER_SEALS.filter((seal) => seal.category === filter);

  const equippedSeals = equippedIds
    .map((id) => ETHER_SEALS.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const totalEtherCost = equippedSeals.reduce((acc, s) => acc + s.etherCost, 0);

  const toggleEquip = (sealId: string) => {
    setEquippedIds((prev) => {
      if (prev.includes(sealId)) {
        return prev.filter((id) => id !== sealId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), sealId];
      }
      return [...prev, sealId];
    });
  };

  const computeSealOutput = (
    magicBase: number,
    magicScale: number,
    magicUnit: 'damage' | 'barrier' | 'healing' | 'control'
  ) => {
    if (magicUnit === 'control') {
      if (magicBase === 8) {
        const range = 8 + profile.magicLevel * magicScale;
        return `${range.toFixed(1)}m range`;
      }
      const slow = Math.min(80, Math.round(magicBase + profile.magicLevel * magicScale));
      return `${slow}% slow`;
    }
    const power = Math.round(
      magicBase * (1 + profile.magicLevel * 0.018) + profile.generalLevel * 0.45 + magicScale * 0.5
    );
    return `${power} ${magicUnit}`;
  };

  return (
    <section id="sellos" className="border-t border-white/10 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                04 · The 8 Ether Seals &amp; Magic Level Scaling (Wizard / Druid)
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
                Every Spell Increases Your Magic Level in Combat
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D4CEC3]">
                Every spell, barrier, and heal across all 8 Ether Seals scales directly from your{' '}
                <strong className="text-[#F6EFE2]">Magic Level</strong> and{' '}
                <strong className="text-[#F6EFE2]">General Level</strong>. Casting offensive seals
                pushes a Warrior toward <strong className="text-[#F6EFE2]">Wizard</strong>, whereas
                healing and protective barriers orient them toward{' '}
                <strong className="text-[#F6EFE2]">Druid</strong>.
              </p>
            </div>

            {/* Magic Level Slider + 3-Slot Ether Loadout Builder */}
            <div className="mt-8 rounded-lg border border-white/10 bg-[#141417] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="text-sm font-semibold text-[#F6EFE2]">
                  3 Active Slots · {activeArchetype.title}
                </h3>
                <span className="font-mono-tabular text-xs text-[#C89B3C]">
                  ML {profile.magicLevel} ({profile.magicXp}% EXP) · Rotation: {totalEtherCost}{' '}
                  Ether
                </span>
              </div>

              <div className="mt-3 border-b border-white/10 pb-4">
                <div className="flex justify-between text-xs">
                  <label htmlFor="seals-magic-level" className="text-[#D4CEC3]">
                    Adjust Magic Level (scales all spell output)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                    ML {profile.magicLevel}
                  </span>
                </div>
                <input
                  id="seals-magic-level"
                  type="range"
                  min={1}
                  max={150}
                  value={profile.magicLevel}
                  onChange={(e) =>
                    onChangeProfile({ ...profile, magicLevel: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full accent-[#C89B3C]"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((slotIdx) => {
                  const seal = equippedSeals[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className="flex flex-col justify-between rounded-md border border-white/10 bg-[#0F0F12] p-3.5"
                    >
                      {seal ? (
                        <>
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#9C968B]">
                              <span>Slot {slotIdx + 1}</span>
                              <span className="font-mono-tabular text-[#C89B3C]">
                                {seal.etherCost} Ether
                              </span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#F6EFE2]">
                              {seal.name}
                            </p>
                            <p className="font-mono-tabular mt-0.5 text-[11px] text-[#D4AF37]">
                              {computeSealOutput(
                                seal.magicBase,
                                seal.magicScale,
                                seal.magicUnit
                              )}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleEquip(seal.id)}
                            className="mt-3 text-left text-xs font-medium text-[#B8B1A6] underline-offset-4 hover:text-[#EAE6DF] hover:underline"
                          >
                            Remove
                          </button>
                        </>
                      ) : (
                        <div className="py-3 text-xs text-[#736E66]">
                          Slot {slotIdx + 1} empty · Select a Seal below
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <MediaFrame
              src={GENERATED_ASSETS.relicLoot}
              alt="Loot Study: Royal Vestige, engraved Ether Seals, and Vial Belt"
              caption="Figure 4: Loot Study - Royal Vestige, engraved Ether Seals, and Belt of Vials."
              aspectClass="aspect-[4/3] lg:h-full"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div
            className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#141417] p-1"
            role="tablist"
            aria-label="Filter Ether Seals by category"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(option)}
                  className={`rounded-md px-3.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? 'bg-[#25252D] text-[#F6EFE2]'
                      : 'text-[#9C968B] hover:text-[#EAE6DF]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#9C968B]">
            Cast any Seal to gain Magic EXP and steer between Wizard and Druid.
          </p>
        </div>

        {/* 8 Ether Seals Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {filteredSeals.map((seal) => {
            const isEquipped = equippedIds.includes(seal.id);
            const sealPower = computeSealOutput(
              seal.magicBase,
              seal.magicScale,
              seal.magicUnit
            );
            const castOrientation: 'offensive' | 'support' =
              seal.category === 'Offensive' ? 'offensive' : 'support';
            return (
              <article
                key={seal.id}
                className={`flex flex-col justify-between rounded-lg border p-5 transition-colors ${
                  isEquipped
                    ? 'border-[#C89B3C]/60 bg-[#18181E]'
                    : 'border-white/10 bg-[#141417]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-[#9C968B]">
                    <span className="truncate">{seal.category}</span>
                    <span className="font-mono-tabular shrink-0 text-[#C89B3C]">
                      {seal.etherCost} Ether
                    </span>
                  </div>

                  <h3 className="font-display mt-2.5 text-base font-semibold text-[#F6EFE2]">
                    {seal.name}
                  </h3>
                  <p className="text-xs text-[#9C968B]">
                    {seal.alias} · <span className="font-mono-tabular">{seal.timing}</span>
                  </p>
                  <p className="font-mono-tabular mt-1.5 text-xs font-semibold text-[#D4AF37]">
                    Live Output (ML {profile.magicLevel}): {sealPower}
                  </p>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#D4CEC3]">{seal.effect}</p>
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => onCastSpell(castOrientation)}
                    className="w-full rounded-md border border-white/15 bg-[#0F0F12] px-3 py-1.5 text-xs font-medium text-[#EAE6DF] transition-colors hover:border-[#C89B3C]/60"
                  >
                    Cast Spell (+Magic EXP)
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleEquip(seal.id)}
                    className={`w-full rounded-md px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                      isEquipped
                        ? 'border border-[#C89B3C]/50 bg-[#C89B3C]/15 text-[#F6EFE2] hover:bg-[#C89B3C]/25'
                        : 'border border-white/15 bg-white/[0.04] text-[#EAE6DF] hover:bg-white/[0.08]'
                    }`}
                  >
                    {isEquipped ? 'Equipped in Slot' : 'Equip Seal'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
