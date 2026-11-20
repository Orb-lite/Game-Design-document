import { useState } from 'react';
import { Calendar, CloudSnow, Flame, Ghost, Gift, Layers, Sparkles, Sun, Wind } from 'lucide-react';
import {
  BALANCE_POTIONS,
  BALANCE_RUNES,
  BALANCE_WEAPONS,
  BIOMES,
  DECOUPLED_SYSTEM_PILLARS,
  EQUIPMENT_SETS,
  GENERATED_ASSETS,
  MATH_FORMULAS,
  PROFESSION_SET_LIST,
  SEASONAL_LIVE_OPS,
  UE5_PILLARS,
  computeDefenseStats,
  computeMatchmakingBracket,
  getWarriorArchetype,
  type CombatSkillKey,
  type PlayerCombatProfile,
  type WarriorArchetypeId,
} from '../data/gddData';
import { MediaFrame } from './MediaFrame';

type BalanceTab = 'sets' | 'armas' | 'runas' | 'viales';

interface BiomesAndMathSectionProps {
  profile: PlayerCombatProfile;
  onChangeProfile: (next: PlayerCombatProfile) => void;
}

function getMasteryLevel(profile: PlayerCombatProfile, key: CombatSkillKey): number {
  switch (key) {
    case 'sword':
      return profile.swordLevel;
    case 'club':
      return profile.clubLevel;
    case 'axe':
      return profile.axeLevel;
    case 'distance':
      return profile.distanceLevel;
    case 'magic':
      return profile.magicLevel;
  }
}

export function BiomesAndMathSection({ profile, onChangeProfile }: BiomesAndMathSectionProps) {
  const [selectedBiomeId, setSelectedBiomeId] = useState<string>(BIOMES[0].id);
  const [balanceTab, setBalanceTab] = useState<BalanceTab>('sets');
  const [balanceProfessionFilter, setBalanceProfessionFilter] =
    useState<WarriorArchetypeId>('sword-warrior');

  // Interactive UE5 Math Simulator state
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>(BALANCE_WEAPONS[0].id);
  const [selectedDefenseSetId, setSelectedDefenseSetId] = useState<string>(
    'set-club-warrior-10'
  );
  const [lobbyAvgLv, setLobbyAvgLv] = useState<number>(80);
  const [attackFactor, setAttackFactor] = useState<number>(1.35);
  const [dmgSharePct, setDmgSharePct] = useState<number>(65);
  const [deltaBracket, setDeltaBracket] = useState<number>(1.25);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    SEASONAL_LIVE_OPS.stormPhases[1].id
  );

  const activeBiome = BIOMES.find((b) => b.id === selectedBiomeId) ?? BIOMES[0];
  const activeSeason =
    SEASONAL_LIVE_OPS.stormPhases.find((s) => s.id === selectedSeasonId) ??
    SEASONAL_LIVE_OPS.stormPhases[0];
  const selectedWeapon =
    BALANCE_WEAPONS.find((w) => w.id === selectedWeaponId) ?? BALANCE_WEAPONS[0];
  const selectedDefenseSet =
    EQUIPMENT_SETS.find((s) => s.id === selectedDefenseSetId) ?? EQUIPMENT_SETS[0];
  const activeArchetype = getWarriorArchetype(profile);
  const matchmakingInfo = computeMatchmakingBracket(profile);

  const activeSkillLv = getMasteryLevel(profile, selectedWeapon.skillType);

  // Defense Level + Armor + Shield Protection computation
  const defenseStats = computeDefenseStats(
    selectedDefenseSet.armorDefense,
    selectedDefenseSet.shieldDefense,
    profile.defenseLevel,
    selectedDefenseSet.baseShieldBlockPct
  );
  const effectiveArmor = defenseStats.effectiveArmor;

  // Exact GDD formulas including weapon attack level, skill mastery, general level, and Defense Level armor
  const warriorHp =
    profile.generalLevel <= 8
      ? 150 + (profile.generalLevel - 1) * 5
      : 185 + (profile.generalLevel - 8) * 10;
  const maxEther = 100 + 15 * (profile.generalLevel - 1);
  const pveEffectiveLv = lobbyAvgLv + 100;
  const pveBaseWarrior =
    pveEffectiveLv <= 8
      ? 150 + (pveEffectiveLv - 1) * 5
      : 185 + (pveEffectiveLv - 8) * 10;
  const armorMitigation = 100 / (100 + effectiveArmor);

  const weaponMasteryFactor = 1 + (profile.weaponMasteryPct / 100) * 0.12;
  const rawWeaponPower =
    selectedWeapon.attackLevel * weaponMasteryFactor * (1 + activeSkillLv * 0.015) +
    profile.generalLevel * 0.35;
  const netPvpWeaponDmg = rawWeaponPower * attackFactor * 0.6 * armorMitigation;
  const netRiposte =
    rawWeaponPower * 1.6 * 0.6 * (100 / (100 + effectiveArmor * 0.65));

  const netMagicRuneDmg =
    (115 * (1 + profile.magicLevel * 0.018) + profile.generalLevel * 0.45) * armorMitigation;
  const retroExp = Math.round(1200 * (dmgSharePct / 100) * deltaBracket);

  // Incoming 200 raw hit protection preview
  const incomingHit = 200;
  const hitAfterArmor = incomingHit * armorMitigation;
  const hitAfterShieldBlock = hitAfterArmor * (1 - defenseStats.shieldBlockPct / 100);

  // Compare net damage across the best weapon of each of the 5 masteries
  const skillDamageComparison = [
    {
      label: 'Axe Warrior (Abyssal Axe Atk 50)',
      lv: profile.axeLevel,
      dmg:
        (50 * (1 + profile.axeLevel * 0.015) + profile.generalLevel * 0.35) *
        attackFactor *
        0.6 *
        armorMitigation,
    },
    {
      label: 'Sword Warrior (Greatsword Atk 48)',
      lv: profile.swordLevel,
      dmg:
        (48 * (1 + profile.swordLevel * 0.015) + profile.generalLevel * 0.35) *
        attackFactor *
        0.6 *
        armorMitigation,
    },
    {
      label: 'Club Warrior (Ossuary Mace Atk 46)',
      lv: profile.clubLevel,
      dmg:
        (46 * (1 + profile.clubLevel * 0.015) + profile.generalLevel * 0.35) *
        attackFactor *
        0.6 *
        armorMitigation,
    },
    {
      label: 'Archer (Dual Crossbows Atk 42)',
      lv: profile.distanceLevel,
      dmg:
        (42 * (1 + profile.distanceLevel * 0.015) + profile.generalLevel * 0.35) *
        attackFactor *
        0.6 *
        armorMitigation,
    },
    {
      label: `${activeArchetype.id === 'druid' ? 'Druid' : 'Wizard'} (Rune / ML)`,
      lv: profile.magicLevel,
      dmg: netMagicRuneDmg,
    },
  ];

  return (
    <>
      {/* Section 06: Combat & 4 Biomes */}
      <section id="biomas" className="border-t border-white/10 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                06 · Tactical TPS Combat &amp; Biomes of Valdris
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
                Physical Hitboxes, Parry &amp; 4 Strategic Biomes
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#B8B1A6]">
              Greatswords trace real physical arcs; a crisp Parry shatters enemy guard and opens
              Riposte (1.60x ignoring 35% armor). Every kill drops a physical loot stash.
            </p>
          </div>

          <div
            className="mb-8 grid grid-cols-1 gap-2 rounded-lg border border-white/10 bg-[#141417] p-1.5 sm:grid-cols-2 lg:grid-cols-4"
            role="tablist"
            aria-label="Select Valdris biome"
          >
            {BIOMES.map((biome) => {
              const isSelected = biome.id === activeBiome.id;
              return (
                <button
                  key={biome.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedBiomeId(biome.id)}
                  className={`rounded-md px-3.5 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-[#222228] text-[#F6EFE2]'
                      : 'text-[#9C968B] hover:bg-white/[0.04] hover:text-[#EAE6DF]'
                  }`}
                >
                  <span className="block text-[11px] text-[#C89B3C] truncate">
                    {biome.location}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold truncate">
                    {biome.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <MediaFrame
                src={activeBiome.image}
                alt={activeBiome.name}
                caption={activeBiome.caption}
                aspectClass="aspect-video lg:h-full"
              />
            </div>

            <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-5 lg:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9C968B]">
                  <span className="font-semibold text-[#C89B3C]">{activeBiome.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeBiome.acts}</span>
                </div>
                <h3 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
                  {activeBiome.name}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#D4CEC3]">
                  {activeBiome.description}
                </p>

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-xs font-medium tracking-wider text-[#9C968B] uppercase">
                    Tactical Advantage
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#B8B1A6]">
                    {activeBiome.tacticalNotes}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                <span className="text-[#9C968B]">Primary Threat</span>
                <span className="font-semibold text-[#EAE6DF]">{activeBiome.threat}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-lg border border-white/10 bg-[#141417] p-6">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="text-xs tracking-wider text-[#9C968B] uppercase">
                  Figure 7 · Contrasting Flanks of Valdris
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold text-[#F6EFE2]">
                  The Miasma Marshes (West) &amp; The Forest of Spires (East)
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-[#B8B1A6]">
                  While the marshes demand Purifying Elixirs and tight control over low catwalks,
                  the Forest of Spires rewards vertical mobility via Seal of Translation and Twin
                  Hand-Crossbow ambushes from high canopies.
                </p>
              </div>
              <div className="lg:col-span-7">
                <MediaFrame
                  src={GENERATED_ASSETS.biomesVista}
                  alt="Contrasting Biomes: The Miasma Marshes and The Forest of Spires"
                  aspectClass="aspect-video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 07 & 08: Math Specification, Live Simulator, Balance Tables & UE5 */}
      <section id="matematica" className="border-t border-white/10 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                07 &amp; 08 · Mathematical Spec, Defense Scaling &amp; UE5 Architecture
              </p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
                Weapon Damage, Defense Level &amp; Balance Tables
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#B8B1A6]">
              Simulate the combined impact of weapon base Attack, Weapon Mastery, General Level, and
              Armor + Shield mitigation scaled by Defense Level.
            </p>
          </div>

          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Simulator */}
            <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-6">
              <h3 className="font-display text-xl font-semibold text-[#F6EFE2]">
                Combat Offense &amp; Defense Math Simulator
              </h3>
              <p className="mt-1 text-xs text-[#9C968B]">
                Select an offensive weapon alongside any defender armor &amp; shield set.
              </p>

              <div className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sim-weapon" className="block text-[#D4CEC3]">
                      Attacking Weapon
                    </label>
                    <select
                      id="sim-weapon"
                      value={selectedWeapon.id}
                      onChange={(e) => setSelectedWeaponId(e.target.value)}
                      className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0F0F12] px-2.5 py-2 text-xs text-[#EAE6DF]"
                    >
                      {BALANCE_WEAPONS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} (Atk {w.attackLevel} · {w.skillLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sim-def-set" className="block text-[#D4CEC3]">
                      Armor &amp; Shield Set
                    </label>
                    <select
                      id="sim-def-set"
                      value={selectedDefenseSet.id}
                      onChange={(e) => setSelectedDefenseSetId(e.target.value)}
                      className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0F0F12] px-2.5 py-2 text-xs text-[#EAE6DF]"
                    >
                      {PROFESSION_SET_LIST.map((prof) => (
                        <optgroup key={prof.id} label={`${prof.label} (15 Sets)`}>
                          {EQUIPMENT_SETS.filter((s) => s.professionId === prof.id).map((s) => (
                            <option key={s.id} value={s.id}>
                              #{String(s.setNumber).padStart(2, '0')} {s.name} (Def{' '}
                              {s.armorDefense + s.shieldDefense} · Blk {s.baseShieldBlockPct}%)
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <label htmlFor="sim-lv" className="text-[#D4CEC3]">
                      Warrior General Level
                    </label>
                    <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                      Lv. {profile.generalLevel}
                    </span>
                  </div>
                  <input
                    id="sim-lv"
                    type="range"
                    min={1}
                    max={300}
                    value={profile.generalLevel}
                    onChange={(e) =>
                      onChangeProfile({ ...profile, generalLevel: Number(e.target.value) })
                    }
                    className="mt-1.5 w-full accent-[#C89B3C]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="flex justify-between">
                      <label htmlFor="sim-active-skill" className="text-[#D4CEC3]">
                        {selectedWeapon.skillLabel}
                      </label>
                      <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                        Lv. {activeSkillLv}
                      </span>
                    </div>
                    <input
                      id="sim-active-skill"
                      type="range"
                      min={1}
                      max={150}
                      value={activeSkillLv}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (selectedWeapon.skillType === 'sword') {
                          onChangeProfile({ ...profile, swordLevel: val });
                        } else if (selectedWeapon.skillType === 'club') {
                          onChangeProfile({ ...profile, clubLevel: val });
                        } else if (selectedWeapon.skillType === 'axe') {
                          onChangeProfile({ ...profile, axeLevel: val });
                        } else if (selectedWeapon.skillType === 'distance') {
                          onChangeProfile({ ...profile, distanceLevel: val });
                        } else {
                          onChangeProfile({ ...profile, magicLevel: val });
                        }
                      }}
                      className="mt-1.5 w-full accent-[#C89B3C]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between">
                      <label htmlFor="sim-defense-direct" className="text-[#D4CEC3]">
                        Defense Level (Armor &amp; Shields)
                      </label>
                      <span className="font-mono-tabular font-semibold text-[#3E82C7]">
                        Def {profile.defenseLevel}
                      </span>
                    </div>
                    <input
                      id="sim-defense-direct"
                      type="range"
                      min={1}
                      max={150}
                      value={profile.defenseLevel}
                      onChange={(e) =>
                        onChangeProfile({ ...profile, defenseLevel: Number(e.target.value) })
                      }
                      className="mt-1.5 w-full accent-[#3E82C7]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <label htmlFor="sim-weapon-mastery" className="text-[#D4CEC3]">
                      Separate Weapon Mastery (Distinct from Attack Type &amp; Defense Lv)
                    </label>
                    <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                      {profile.weaponMasteryPct}% (×{weaponMasteryFactor.toFixed(2)} Base Atk
                      {profile.weaponMasteryPct >= 100 ? ' · Skin Unlocked' : ''})
                    </span>
                  </div>
                  <input
                    id="sim-weapon-mastery"
                    type="range"
                    min={0}
                    max={100}
                    value={profile.weaponMasteryPct}
                    onChange={(e) =>
                      onChangeProfile({ ...profile, weaponMasteryPct: Number(e.target.value) })
                    }
                    className="mt-1.5 w-full accent-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="sim-factor" className="block text-[#D4CEC3]">
                      Attack Factor
                    </label>
                    <select
                      id="sim-factor"
                      value={attackFactor}
                      onChange={(e) => setAttackFactor(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0F0F12] px-2.5 py-2 text-xs text-[#EAE6DF]"
                    >
                      <option value={1.0}>1.00x (Light)</option>
                      <option value={1.35}>1.35x (Special)</option>
                      <option value={1.5}>1.50x (Burst)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sim-share" className="block text-[#D4CEC3]">
                      % Ledger Share
                    </label>
                    <input
                      id="sim-share"
                      type="number"
                      min={1}
                      max={100}
                      value={dmgSharePct}
                      onChange={(e) =>
                        setDmgSharePct(Math.max(1, Math.min(100, Number(e.target.value) || 1)))
                      }
                      className="font-mono-tabular mt-1.5 w-full rounded-md border border-white/15 bg-[#0F0F12] px-2.5 py-2 text-xs text-[#EAE6DF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="sim-delta" className="block text-[#D4CEC3]">
                      ΔLevel Factor
                    </label>
                    <select
                      id="sim-delta"
                      value={deltaBracket}
                      onChange={(e) => setDeltaBracket(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-md border border-white/15 bg-[#0F0F12] px-2.5 py-2 text-xs text-[#EAE6DF]"
                    >
                      <option value={2.0}>2.00x (Much Higher +50+)</option>
                      <option value={1.25}>1.25x (Higher +21..49)</option>
                      <option value={1.0}>1.00x (Similar -20..+20)</option>
                      <option value={0.4}>0.40x (Lower -21 or less)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between">
                    <label htmlFor="sim-lobby" className="text-[#D4CEC3]">
                      Lobby Average Level (Lv_avg)
                    </label>
                    <span className="font-mono-tabular font-semibold text-[#EAE6DF]">
                      {lobbyAvgLv} → PvE Lv. {pveEffectiveLv} (Herald{' '}
                      {Math.round(pveBaseWarrior * 3).toLocaleString('en-US')} HP)
                    </span>
                  </div>
                  <input
                    id="sim-lobby"
                    type="range"
                    min={1}
                    max={250}
                    value={lobbyAvgLv}
                    onChange={(e) => setLobbyAvgLv(Number(e.target.value))}
                    className="mt-1.5 w-full accent-[#C89B3C]"
                  />
                </div>
              </div>

              {/* Computed Telemetry Readout */}
              <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                <div className="rounded-md border border-white/[0.08] bg-[#0F0F12] p-3">
                  <dt className="text-[11px] text-[#9C968B]">HP / Ether Pool</dt>
                  <dd className="font-mono-tabular mt-1 text-sm font-semibold text-[#F6EFE2]">
                    {warriorHp.toLocaleString('en-US')} HP · {maxEther} Ether
                  </dd>
                </div>
                <div className="rounded-md border border-white/[0.08] bg-[#0F0F12] p-3">
                  <dt className="text-[11px] text-[#9C968B]">Net Weapon Dmg</dt>
                  <dd className="font-mono-tabular mt-1 text-base font-semibold text-[#C89B3C]">
                    {netPvpWeaponDmg.toFixed(1)}
                  </dd>
                </div>
                <div className="rounded-md border border-white/[0.08] bg-[#0F0F12] p-3">
                  <dt className="text-[11px] text-[#9C968B]">Riposte (-35% Armor)</dt>
                  <dd className="font-mono-tabular mt-1 text-base font-semibold text-[#D4AF37]">
                    {netRiposte.toFixed(1)}
                  </dd>
                </div>
                <div className="rounded-md border border-white/[0.08] bg-[#0F0F12] p-3">
                  <dt className="text-[11px] text-[#9C968B]">Effective Armor</dt>
                  <dd className="font-mono-tabular mt-1 text-base font-semibold text-[#3E82C7]">
                    {effectiveArmor.toFixed(0)} ({defenseStats.mitigationPct.toFixed(1)}%)
                  </dd>
                </div>
                <div className="rounded-md border border-white/[0.08] bg-[#0F0F12] p-3">
                  <dt className="text-[11px] text-[#9C968B]">Shield Block</dt>
                  <dd className="font-mono-tabular mt-1 text-base font-semibold text-[#4F9E68]">
                    {defenseStats.shieldBlockPct.toFixed(1)}% ({defenseStats.combinedBlockedMitigationPct.toFixed(1)}% total)
                  </dd>
                </div>
                <div className="rounded-md border border-white/[0.08] bg-[#0F0F12] p-3">
                  <dt className="text-[11px] text-[#9C968B]">200 Raw Hit → Net</dt>
                  <dd className="font-mono-tabular mt-1 text-sm font-semibold text-[#EAE6DF]">
                    {hitAfterArmor.toFixed(0)} unblk · {hitAfterShieldBlock.toFixed(0)} blk
                  </dd>
                </div>
              </dl>

              {/* Cross-Mastery Comparison & Fair-Match Matchmaking Bracket */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="rounded-md border border-[#C89B3C]/30 bg-[#0F0F12] p-3.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-[#C89B3C]">
                      Fair-Match Matchmaking · Index {matchmakingInfo.combatPowerIndex}
                    </span>
                    <span className="font-mono-tabular text-[11px] text-[#4F9E68]">
                      Lobby Cap Parity: {matchmakingInfo.goldCapParity}% Gold
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-[#F6EFE2]">
                    {matchmakingInfo.bracketLabel}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#9C968B]">
                    {matchmakingInfo.queueParityNote}
                  </p>
                </div>

                <p className="mt-4 text-[11px] font-medium text-[#9C968B] uppercase">
                  Cross-Mastery Output (vs {selectedDefenseSet.name}) · EXP{' '}
                  {retroExp.toLocaleString('en-US')}
                </p>
                <div className="mt-2.5 space-y-2">
                  {skillDamageComparison.map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-xs">
                      <span className="text-[#D4CEC3]">
                        {row.label}{' '}
                        <span className="font-mono-tabular text-[#9C968B]">(Lv. {row.lv})</span>
                      </span>
                      <span className="font-mono-tabular font-semibold text-[#F6EFE2]">
                        {row.dmg.toFixed(1)} net dmg
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulas List */}
            <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-6">
              <h3 className="font-display text-xl font-semibold text-[#F6EFE2]">
                Deterministic Engine Formulas
              </h3>
              <dl className="mt-4 divide-y divide-white/[0.08]">
                {MATH_FORMULAS.map((item) => (
                  <div key={item.title} className="py-3.5 first:pt-0 last:pb-0">
                    <dt className="text-xs font-semibold text-[#F6EFE2]">{item.title}</dt>
                    <dd className="font-mono-tabular mt-1.5 rounded bg-[#0F0F12] px-3 py-2 text-xs text-[#C89B3C]">
                      {item.formula}
                    </dd>
                    <dd className="mt-1.5 text-[11px] leading-relaxed text-[#9C968B]">
                      {item.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Tabbed Balance Tables */}
          <div className="mb-16 rounded-lg border border-white/10 bg-[#141417]">
            <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                  Combat &amp; Equipment Set Balance Tables
                </h3>
                <p className="text-xs text-[#9C968B]">
                  Scaled by Mastery (Sword, Club, Axe, Distance, Magic), Defense Level, and General
                  Level.
                </p>
              </div>
              <div
                className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#0F0F12] p-1"
                role="tablist"
                aria-label="Balance tables"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={balanceTab === 'sets'}
                  onClick={() => setBalanceTab('sets')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    balanceTab === 'sets'
                      ? 'bg-[#222228] text-[#F6EFE2]'
                      : 'text-[#9C968B] hover:text-[#EAE6DF]'
                  }`}
                >
                  Sets &amp; Defense
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={balanceTab === 'armas'}
                  onClick={() => setBalanceTab('armas')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    balanceTab === 'armas'
                      ? 'bg-[#222228] text-[#F6EFE2]'
                      : 'text-[#9C968B] hover:text-[#EAE6DF]'
                  }`}
                >
                  Weapons &amp; Masteries
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={balanceTab === 'runas'}
                  onClick={() => setBalanceTab('runas')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    balanceTab === 'runas'
                      ? 'bg-[#222228] text-[#F6EFE2]'
                      : 'text-[#9C968B] hover:text-[#EAE6DF]'
                  }`}
                >
                  Runes &amp; Spells (ML)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={balanceTab === 'viales'}
                  onClick={() => setBalanceTab('viales')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    balanceTab === 'viales'
                      ? 'bg-[#222228] text-[#F6EFE2]'
                      : 'text-[#9C968B] hover:text-[#EAE6DF]'
                  }`}
                >
                  Potions &amp; Vials
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {balanceTab === 'sets' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0F0F12] px-6 py-3">
                    <span className="text-xs text-[#9C968B]">
                      Filter 15 sets by profession (90 total sets):
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {PROFESSION_SET_LIST.map((prof) => (
                        <button
                          key={prof.id}
                          type="button"
                          onClick={() => setBalanceProfessionFilter(prof.id)}
                          className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                            balanceProfessionFilter === prof.id
                              ? 'bg-[#C89B3C] text-[#0B0B0D]'
                              : 'bg-[#1A1A20] text-[#B8B1A6] hover:text-[#F6EFE2]'
                          }`}
                        >
                          {prof.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <table className="w-full min-w-[920px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[#9C968B] uppercase">
                        <th className="px-6 py-3.5 font-medium">Set / Tier</th>
                        <th className="px-4 py-3.5 font-medium">Focus / Perk</th>
                        <th className="px-4 py-3.5 font-medium">Min. Lv</th>
                        <th className="px-4 py-3.5 font-medium">Min. Mastery</th>
                        <th className="px-4 py-3.5 font-medium">Min. Defense</th>
                        <th className="px-4 py-3.5 font-medium text-right">Weapon (Atk)</th>
                        <th className="px-4 py-3.5 font-medium text-right">Base Def (Arm+Shd)</th>
                        <th className="px-6 py-3.5 font-medium text-right">Shield Block</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
                      {EQUIPMENT_SETS.filter(
                        (s) => s.professionId === balanceProfessionFilter
                      ).map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.025]">
                          <td className="px-6 py-3.5">
                            <div className="font-semibold text-[#F6EFE2]">
                              #{String(row.setNumber).padStart(2, '0')} · {row.name}
                            </div>
                            <div className="text-[11px]" style={{ color: row.tierHex }}>
                              {row.tierLabel}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`font-semibold ${
                                row.focusType === 'Attack'
                                  ? 'text-[#E06C5A]'
                                  : row.focusType === 'Defense'
                                  ? 'text-[#3E82C7]'
                                  : 'text-[#D4AF37]'
                              }`}
                            >
                              {row.focusType}
                            </span>
                            <div className="mt-0.5 text-[11px] text-[#9C968B]">
                              {row.focusTarget}
                            </div>
                          </td>
                          <td className="font-mono-tabular px-4 py-3.5">
                            Lv. {row.minGeneralLevel}+
                          </td>
                          <td className="font-mono-tabular px-4 py-3.5 text-[#C89B3C]">
                            {row.attackSkillLabel} {row.minAttackMastery}
                          </td>
                          <td className="font-mono-tabular px-4 py-3.5 text-[#3E82C7]">
                            Def {row.minDefenseLevel}
                          </td>
                          <td className="font-mono-tabular px-4 py-3.5 text-right font-semibold text-[#F6EFE2]">
                            Atk {row.weaponAttack}
                          </td>
                          <td className="font-mono-tabular px-4 py-3.5 text-right">
                            {row.armorDefense} + {row.shieldDefense} (
                            {row.armorDefense + row.shieldDefense})
                          </td>
                          <td className="font-mono-tabular px-6 py-3.5 text-right font-semibold text-[#4F9E68]">
                            {row.baseShieldBlockPct}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {balanceTab === 'armas' && (
                <table className="w-full min-w-[780px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#9C968B] uppercase">
                      <th className="px-6 py-3.5 font-medium">Weapon</th>
                      <th className="px-4 py-3.5 font-medium">Mastery</th>
                      <th className="px-4 py-3.5 font-medium text-right">Attack</th>
                      <th className="px-4 py-3.5 font-medium">Tier</th>
                      <th className="px-4 py-3.5 font-medium">Req.</th>
                      <th className="px-4 py-3.5 font-medium">Light Attack</th>
                      <th className="px-6 py-3.5 font-medium">Special Attack</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
                    {BALANCE_WEAPONS.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.025]">
                        <td className="px-6 py-3.5 font-semibold text-[#F6EFE2]">{row.name}</td>
                        <td className="px-4 py-3.5 text-[#C89B3C]">{row.skillLabel}</td>
                        <td className="font-mono-tabular px-4 py-3.5 text-right font-semibold text-[#F6EFE2]">
                          Atk {row.attackLevel}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-[#C89B3C]">{row.tier}</td>
                        <td className="font-mono-tabular px-4 py-3.5">{row.reqLevel}</td>
                        <td className="font-mono-tabular px-4 py-3.5">{row.lightAttack}</td>
                        <td className="font-mono-tabular px-6 py-3.5 text-[#F6EFE2]">
                          {row.specialAttack}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {balanceTab === 'runas' && (
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#9C968B] uppercase">
                      <th className="px-6 py-3.5 font-medium">Rune / Seal</th>
                      <th className="px-4 py-3.5 font-medium">Tier</th>
                      <th className="px-4 py-3.5 font-medium">Req. (Lv / ML)</th>
                      <th className="px-4 py-3.5 font-medium">Scaling / ML</th>
                      <th className="px-4 py-3.5 font-medium">Value @ ML 100</th>
                      <th className="px-6 py-3.5 font-medium">Cost / Cooldown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
                    {BALANCE_RUNES.map((row) => (
                      <tr key={row.name} className="hover:bg-white/[0.025]">
                        <td className="px-6 py-3.5 font-semibold text-[#F6EFE2]">{row.name}</td>
                        <td className="px-4 py-3.5 font-semibold text-[#C89B3C]">{row.tier}</td>
                        <td className="font-mono-tabular px-4 py-3.5">{row.reqLevel}</td>
                        <td className="font-mono-tabular px-4 py-3.5">{row.scalingPerLv}</td>
                        <td className="font-mono-tabular px-4 py-3.5 text-[#F6EFE2]">
                          {row.valueLv100}
                        </td>
                        <td className="font-mono-tabular px-6 py-3.5 text-[#9C968B]">
                          {row.costCd}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {balanceTab === 'viales' && (
                <table className="w-full min-w-[680px] text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[#9C968B] uppercase">
                      <th className="px-6 py-3.5 font-medium">Vial / Elixir</th>
                      <th className="px-4 py-3.5 font-medium">Tier</th>
                      <th className="px-4 py-3.5 font-medium">Req.</th>
                      <th className="px-4 py-3.5 font-medium">Scaling / Lv</th>
                      <th className="px-4 py-3.5 font-medium">Output @ Lv 100 / 200</th>
                      <th className="px-6 py-3.5 font-medium">Use Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
                    {BALANCE_POTIONS.map((row) => (
                      <tr key={row.name} className="hover:bg-white/[0.025]">
                        <td className="px-6 py-3.5 font-semibold text-[#F6EFE2]">{row.name}</td>
                        <td className="px-4 py-3.5 font-semibold text-[#C89B3C]">{row.tier}</td>
                        <td className="font-mono-tabular px-4 py-3.5">{row.reqLevel}</td>
                        <td className="font-mono-tabular px-4 py-3.5">{row.scalingPerLv}</td>
                        <td className="font-mono-tabular px-4 py-3.5 text-[#F6EFE2]">
                          {row.effectLv100_200}
                        </td>
                        <td className="font-mono-tabular px-6 py-3.5 text-[#9C968B]">
                          {row.useTiming}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Section 08: Decoupled Architecture, UE5 Networking & Ethical Live-Ops */}
          <div className="space-y-10">
            <div>
              <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                08 · Decoupled Equipment, Combat Frame Integrity &amp; Live-Ops (Episode I)
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2] lg:text-3xl">
                Logical Gear Data vs. Cosmetic Skin Layer — Zero Pay-to-Win Architecture
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
                {DECOUPLED_SYSTEM_PILLARS.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between rounded-lg border border-[#C89B3C]/25 bg-[#141417] p-6"
                  >
                    <div>
                      <p className="font-mono-tabular text-[11px] font-semibold text-[#C89B3C]">
                        {item.code}
                      </p>
                      <h3 className="font-display mt-1.5 text-lg font-semibold text-[#F6EFE2]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#D4AF37]">{item.subtitle}</p>
                      <p className="mt-3 text-xs leading-relaxed text-[#D4CEC3]">{item.summary}</p>
                      <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#B8B1A6]">
                        {item.bullets.map((b) => (
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
                  </article>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                Unreal Engine 5 Architecture, Networking (200 Players) &amp; Anti-Cheat
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {UE5_PILLARS.map((pillar, idx) => (
                  <article
                    key={pillar.title}
                    className="rounded-lg border border-white/10 bg-[#141417] p-6"
                  >
                    <p className="font-mono-tabular text-xs text-[#C89B3C]">0{idx + 1}</p>
                    <h3 className="font-display mt-2 text-lg font-semibold text-[#F6EFE2]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#B8B1A6]">
                      {pillar.detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Seasonal Live-Ops & Holiday Events: 4-Season Dynamic Storm & World Cycle */}
            <div
              id="seasonal-live-ops"
              className="space-y-8 border-t border-white/10 pt-10"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                    {SEASONAL_LIVE_OPS.eyebrow}
                  </p>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2] text-balance lg:text-3xl">
                    {SEASONAL_LIVE_OPS.title}
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-relaxed text-[#B8B1A6]">
                  {SEASONAL_LIVE_OPS.lead}
                </p>
              </div>

              {/* Marquee Holiday Events: Halloween & Dark Santa's Wish */}
              <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
                <div className="flex flex-col gap-2 border-b border-white/10 pb-5 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
                      <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Limited-Time World Events &amp; Cosmetic Contracts</span>
                    </div>
                    <h4 className="font-display mt-1.5 text-2xl font-semibold text-[#F6EFE2]">
                      Annual Holiday Live-Ops Beats — Halloween &amp; Dark Santa&apos;s Wish
                    </h4>
                  </div>
                  <p className="max-w-md text-xs leading-relaxed text-[#B8B1A6]">
                    Fair-match PvPvE twists, themed boss variants, and direct cosmetic contract unlocks—zero stat or mastery pay-to-win.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {SEASONAL_LIVE_OPS.holidayEvents.map((ev) => (
                    <article
                      key={ev.id}
                      className="flex flex-col overflow-hidden rounded-md border border-white/10 bg-[#0F0F12]"
                    >
                      <div className="aspect-video w-full overflow-hidden bg-[#08080A]">
                        <img
                          src={ev.image}
                          alt={`${ev.seasonTag} — ${ev.title}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex items-center justify-between gap-2 text-[11px] text-[#9C968B]">
                            <span
                              className="inline-flex items-center gap-1.5 font-semibold"
                              style={{ color: ev.accentHex }}
                            >
                              {ev.id === 'halloween-hollow-bell' ? (
                                <Ghost className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : ev.id === 'dark-santas-wish' ? (
                                <Gift className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              <span>{ev.seasonTag}</span>
                            </span>
                            <span className="font-mono-tabular whitespace-nowrap">{ev.window}</span>
                          </div>

                          <h5 className="font-display mt-1.5 text-xl font-semibold text-[#F6EFE2]">
                            {ev.title}
                          </h5>
                          <p className="mt-2.5 text-xs leading-relaxed text-[#D4CEC3]">
                            {ev.atmosphere}
                          </p>
                          <p className="mt-2.5 text-xs leading-relaxed text-[#B8B1A6]">
                            <strong className="text-[#EAE6DF]">PvPvE Event Twist: </strong>
                            {ev.gameplayTwist}
                          </p>
                        </div>

                        <dl className="mt-4 space-y-2 border-t border-white/10 pt-3 text-[11px]">
                          <div>
                            <dt className="text-[#9C968B]">Active Storm Pairing</dt>
                            <dd className="font-medium text-[#EAE6DF]">{ev.stormPairing}</dd>
                          </div>
                          <div>
                            <dt className="text-[#9C968B]">Event Cosmetic Reward</dt>
                            <dd className="font-semibold text-[#C89B3C]">{ev.rewardSkin}</dd>
                          </div>
                        </dl>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              {/* Interactive Storm Season Selector + Spotlight Preview */}
              <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
                <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#D4CEC3]">
                    <Layers className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                    <span>Real-World Calendar Environmental Storm &amp; Lighting Variants</span>
                  </div>

                  <div
                    className="grid grid-cols-1 gap-1.5 rounded-lg border border-white/10 bg-[#0F0F12] p-1 sm:grid-cols-3"
                    role="tablist"
                    aria-label="Select seasonal storm variant"
                  >
                    {SEASONAL_LIVE_OPS.stormPhases.map((phase) => {
                      const isActive = phase.id === activeSeason.id;
                      return (
                        <button
                          key={phase.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setSelectedSeasonId(phase.id)}
                          className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                            isActive
                              ? 'bg-[#C89B3C] text-[#0B0B0D]'
                              : 'text-[#B8B1A6] hover:text-[#F6EFE2]'
                          }`}
                        >
                          {phase.id === 'winter' ? (
                            <CloudSnow className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : phase.id === 'summer' ? (
                            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Wind className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          <span>{phase.seasonLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Season Spotlight Split */}
                <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <MediaFrame
                      key={activeSeason.id}
                      src={activeSeason.image}
                      alt={`${activeSeason.seasonLabel} — ${activeSeason.title}`}
                      caption={`${activeSeason.seasonLabel} Storm Variant · ${activeSeason.ue5Tech}`}
                      aspectClass="aspect-video lg:h-full"
                    />
                  </div>

                  <div className="flex flex-col justify-between rounded-md border border-white/10 bg-[#0F0F12] p-6 lg:col-span-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#9C968B]">
                        <span
                          className="font-semibold"
                          style={{ color: activeSeason.accentHex }}
                        >
                          {activeSeason.seasonLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">{activeSeason.calendarWindow}</span>
                      </div>

                      <h4 className="font-display mt-2.5 text-2xl font-semibold text-[#F6EFE2]">
                        {activeSeason.title}
                      </h4>

                      <p className="mt-3 text-sm leading-relaxed text-[#D4CEC3]">
                        {activeSeason.description}
                      </p>
                    </div>

                    <dl className="mt-6 space-y-3 border-t border-white/10 pt-4 text-xs">
                      <div>
                        <dt className="text-[#9C968B]">UE5 Niagara VFX &amp; Shader Layer</dt>
                        <dd className="mt-0.5 font-medium text-[#EAE6DF]">
                          {activeSeason.ue5Tech}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#9C968B]">Seasonal Live-Ops Event Pairing</dt>
                        <dd className="mt-0.5 font-semibold text-[#C89B3C]">
                          {activeSeason.eventPairing}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                {/* Full 3-Season Storm Matrix Cards */}
                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {SEASONAL_LIVE_OPS.stormPhases.map((phase) => {
                    const isSelected = phase.id === activeSeason.id;
                    return (
                      <button
                        key={phase.id}
                        type="button"
                        onClick={() => setSelectedSeasonId(phase.id)}
                        className={`flex flex-col overflow-hidden rounded-md border text-left transition-colors ${
                          isSelected
                            ? 'border-[#C89B3C]/70 bg-[#18181D]'
                            : 'border-white/10 bg-[#0F0F12] hover:border-white/25'
                        }`}
                      >
                        <div className="aspect-video w-full overflow-hidden bg-[#0B0B0D]">
                          <img
                            src={phase.image}
                            alt={`${phase.seasonLabel}: ${phase.title}`}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div>
                            <div className="flex items-center gap-2 text-[11px] text-[#9C968B]">
                              <span
                                className="font-semibold"
                                style={{ color: phase.accentHex }}
                              >
                                {phase.seasonLabel}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">{phase.calendarWindow}</span>
                            </div>
                            <h5 className="font-display mt-1 text-base font-semibold text-[#F6EFE2]">
                              {phase.title}
                            </h5>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#B8B1A6]">
                              {phase.description}
                            </p>
                          </div>
                          <p className="mt-3 border-t border-white/[0.08] pt-2.5 text-[11px] font-medium text-[#D4CEC3]">
                            {phase.ue5Tech}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Why This Works for Production & Live-Ops */}
              <div className="rounded-lg border border-[#C89B3C]/35 bg-[#141417] p-6 lg:p-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <p className="text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
                      Art Pipeline &amp; Retention Strategy
                    </p>
                    <h4 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
                      {SEASONAL_LIVE_OPS.productionAdvantage.title}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-[#D4CEC3]">
                      {SEASONAL_LIVE_OPS.productionAdvantage.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
                    {SEASONAL_LIVE_OPS.productionAdvantage.partnerPoints.map((pt) => (
                      <div
                        key={pt.audience}
                        className="rounded-md border border-white/10 bg-[#0F0F12] p-5"
                      >
                        <p className="text-xs font-semibold text-[#C89B3C]">{pt.audience}</p>
                        <p className="mt-2 text-xs leading-relaxed text-[#B8B1A6]">
                          {pt.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Climate-Reactive Seasonal Event Skins */}
              <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
                <div className="flex flex-col gap-3 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
                      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{SEASONAL_LIVE_OPS.climateReactiveSkins.eyebrow}</span>
                    </div>
                    <h4 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
                      {SEASONAL_LIVE_OPS.climateReactiveSkins.title}
                    </h4>
                  </div>
                  <p className="max-w-lg text-xs leading-relaxed text-[#B8B1A6]">
                    {SEASONAL_LIVE_OPS.climateReactiveSkins.summary}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {SEASONAL_LIVE_OPS.climateReactiveSkins.showcase.map((skin) => (
                    <article
                      key={skin.id}
                      className="flex flex-col overflow-hidden rounded-md border border-white/10 bg-[#0F0F12]"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-[#08080A]">
                        <img
                          src={skin.image}
                          alt={`${skin.eventTitle} — ${skin.skinName}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#9C968B]">
                            <span className="font-semibold" style={{ color: skin.accentHex }}>
                              {skin.eventTitle}
                            </span>
                          </div>
                          <h5 className="font-display mt-1.5 text-lg font-semibold text-[#F6EFE2]">
                            {skin.skinName}
                          </h5>
                          <p className="mt-2.5 text-xs leading-relaxed text-[#D4CEC3]">
                            {skin.detail}
                          </p>
                        </div>
                        <p className="mt-4 border-t border-white/10 pt-3 text-[11px] font-medium text-[#9C968B]">
                          Storm Reaction · <span className="text-[#EAE6DF]">{skin.seasonTag}</span>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
