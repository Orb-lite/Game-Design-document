import { useState } from 'react';
import {
  BALANCE_WEAPONS,
  COMBAT_SKILLS,
  CONTAINER_DROP_TABLE,
  EQUIPMENT_SETS,
  ETHER_SEALS,
  GENERATED_ASSETS,
  PROFESSION_SET_LIST,
  PVE_DIFFICULTY_TIERS,
  QUALITY_TIERS,
  UNIVERSAL_SLOTS,
  computeDefenseStats,
  getGoldLootCapPct,
  getWarriorArchetype,
  hasOmniMastery100,
  type CombatSkillKey,
  type PlayerCombatProfile,
  type QualityTierKey,
  type SetFocusType,
  type WarriorArchetypeId,
} from '../data/gddData';
import { ArmorSet3DViewer } from './ArmorSet3DViewer';
import { MediaFrame } from './MediaFrame';
import { getSetStyleProfile } from './setArtworkRenderer';

interface LootAndPveSectionProps {
  profile: PlayerCombatProfile;
  onChangeProfile: (next: PlayerCombatProfile) => void;
  onTrainAttack: (skill: 'sword' | 'club' | 'axe' | 'distance') => void;
  onTrainDefense: () => void;
  onCastSpell: (kind: 'offensive' | 'support') => void;
}

interface SimulatedLootResult {
  quality: string;
  hex: string;
  itemName: string;
  itemSkill: CombatSkillKey;
  itemSkillLabel: string;
  attackLevel: number;
  affixes: string;
  recommendation: string;
  isOptimalForPlayer: boolean;
  effectiveGoldChance: number;
}

const ELEMENTAL_AFFIXES = ['Embers', 'Frost', 'Miasma', 'Voltaic'];
const CURSED_PASSIVES = [
  'Vitality Lifesteal on Execution',
  'Ethereal Phase on Dodge (0.4s)',
  'Ether Echo on Completed Parry',
];

type SetTierFilter = 'all' | QualityTierKey;
type SetFocusFilter = 'all' | SetFocusType;

function getSkillValue(profile: PlayerCombatProfile, key: CombatSkillKey): number {
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

export function LootAndPveSection({
  profile,
  onChangeProfile,
  onTrainAttack,
  onTrainDefense,
  onCastSpell,
}: LootAndPveSectionProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>(QUALITY_TIERS[4].id);
  const [selectedContainerId, setSelectedContainerId] = useState<string>(
    CONTAINER_DROP_TABLE[2].id
  );
  const [selectedSetProfession, setSelectedSetProfession] =
    useState<WarriorArchetypeId>('sword-warrior');
  const [setFocusFilter, setSetFocusFilter] = useState<SetFocusFilter>('all');
  const [setTierFilter, setSetTierFilter] = useState<SetTierFilter>('all');
  const [selectedSetId, setSelectedSetId] = useState<string>('set-sword-warrior-13');
  const [simulatedDrop, setSimulatedDrop] = useState<SimulatedLootResult | null>(null);

  const activeQuality =
    QUALITY_TIERS.find((t) => t.id === selectedTierId) ?? QUALITY_TIERS[0];
  const activeContainer =
    CONTAINER_DROP_TABLE.find((c) => c.id === selectedContainerId) ??
    CONTAINER_DROP_TABLE[0];

  const activeArchetype = getWarriorArchetype(profile);
  const masteryRank = Math.floor(profile.generalLevel / 100);
  const pveDamageBonus = masteryRank * 15;
  const omniMasteryUnlocked = hasOmniMastery100(profile);
  const activeGoldCap = getGoldLootCapPct(profile);
  const rawBoostedGold =
    activeContainer.dorado > 0
      ? activeContainer.dorado + masteryRank * 4 + (omniMasteryUnlocked ? 24 : 0)
      : 0;
  const effectiveGoldChance = Math.min(activeGoldCap, rawBoostedGold);
  const goldDelta = effectiveGoldChance - activeContainer.dorado;
  const effectiveMorado = Math.max(0, activeContainer.morado - goldDelta);

  const rankedSkills = [...COMBAT_SKILLS]
    .map((skill) => ({
      ...skill,
      level: getSkillValue(profile, skill.key),
    }))
    .sort((a, b) => b.level - a.level);

  const topSkill = rankedSkills[0];

  const professionSets = EQUIPMENT_SETS.filter(
    (s) => s.professionId === selectedSetProfession
  );

  const filteredSets = professionSets.filter((s) => {
    const matchesTier = setTierFilter === 'all' || s.tierKey === setTierFilter;
    const matchesFocus = setFocusFilter === 'all' || s.focusType === setFocusFilter;
    return matchesTier && matchesFocus;
  });

  const inspectedSet =
    filteredSets.find((s) => s.id === selectedSetId) ??
    filteredSets[0] ??
    professionSets[0] ??
    EQUIPMENT_SETS[0];

  const handleSelectProfessionTab = (profId: WarriorArchetypeId) => {
    setSelectedSetProfession(profId);
    const firstMatch = EQUIPMENT_SETS.find(
      (s) =>
        s.professionId === profId &&
        (setTierFilter === 'all' || s.tierKey === setTierFilter) &&
        (setFocusFilter === 'all' || s.focusType === setFocusFilter)
    );
    if (firstMatch) {
      setSelectedSetId(firstMatch.id);
    }
  };

  const applyPreset = (preset: WarriorArchetypeId) => {
    setSimulatedDrop(null);
    setSelectedSetProfession(preset);
    const firstProfSet = EQUIPMENT_SETS.find(
      (s) => s.professionId === preset && s.tierKey === 'dorado'
    );
    if (firstProfSet) {
      setSelectedSetId(firstProfSet.id);
    }
    const base = {
      ...profile,
      generalLevel: 120,
      swordXp: 25,
      clubXp: 25,
      axeXp: 25,
      distanceXp: 25,
      magicXp: 25,
      defenseXp: 25,
    };

    if (preset === 'sword-warrior') {
      onChangeProfile({
        ...base,
        swordLevel: 94,
        clubLevel: 26,
        axeLevel: 34,
        distanceLevel: 30,
        magicLevel: 38,
        defenseLevel: 76,
      });
    } else if (preset === 'club-warrior') {
      onChangeProfile({
        ...base,
        swordLevel: 30,
        clubLevel: 94,
        axeLevel: 40,
        distanceLevel: 20,
        magicLevel: 32,
        defenseLevel: 84,
      });
    } else if (preset === 'axe-warrior') {
      onChangeProfile({
        ...base,
        swordLevel: 36,
        clubLevel: 32,
        axeLevel: 96,
        distanceLevel: 22,
        magicLevel: 28,
        defenseLevel: 78,
      });
    } else if (preset === 'archer') {
      onChangeProfile({
        ...base,
        swordLevel: 32,
        clubLevel: 18,
        axeLevel: 20,
        distanceLevel: 95,
        magicLevel: 40,
        defenseLevel: 46,
      });
    } else if (preset === 'wizard') {
      onChangeProfile({
        ...base,
        swordLevel: 22,
        clubLevel: 16,
        axeLevel: 18,
        distanceLevel: 35,
        magicLevel: 98,
        defenseLevel: 42,
        offensiveSpellCasts: 14,
        supportSpellCasts: 3,
      });
    } else {
      onChangeProfile({
        ...base,
        swordLevel: 24,
        clubLevel: 28,
        axeLevel: 18,
        distanceLevel: 30,
        magicLevel: 98,
        defenseLevel: 68,
        offensiveSpellCasts: 4,
        supportSpellCasts: 15,
      });
    }
  };

  const handleSimulateOpen = () => {
    const roll = Math.random() * 100;
    let cumulative = 0;

    const pickedWeapon =
      BALANCE_WEAPONS[Math.floor(Math.random() * BALANCE_WEAPONS.length)];
    const pickedSeal =
      ETHER_SEALS[Math.floor(Math.random() * ETHER_SEALS.length)];
    const dropIsMagicSeal = Math.random() < 0.25;

    const itemSkill: CombatSkillKey = dropIsMagicSeal
      ? 'magic'
      : pickedWeapon.skillType;
    const itemSkillLabel = dropIsMagicSeal
      ? 'Magic Level'
      : pickedWeapon.skillLabel;
    const itemName = dropIsMagicSeal ? pickedSeal.name : pickedWeapon.name;
    const attackLevel = dropIsMagicSeal ? 0 : pickedWeapon.attackLevel;
    const playerAffinity = getSkillValue(profile, itemSkill);
    const isOptimal = playerAffinity >= topSkill.level - 12;

    const recommendation = isOptimal
      ? `Optimal pick-up (${activeArchetype.title}): strong synergy with your ${itemSkillLabel} (${playerAffinity}).`
      : `Pass to a squadmate: your ${itemSkillLabel} is ${playerAffinity} while your primary archetype is ${activeArchetype.title} (${topSkill.label} ${topSkill.level}).`;

    const brackets: {
      label: string;
      hex: string;
      chance: number;
      affixBuilder: () => string;
    }[] = [
      {
        label: 'Royal Vestige (Gold — Unique)',
        hex: '#D4AF37',
        chance: effectiveGoldChance,
        affixBuilder: () =>
          `3 max affixes · Royal Vestige Ultimate + ${
            CURSED_PASSIVES[Math.floor(Math.random() * CURSED_PASSIVES.length)]
          }`,
      },
      {
        label: 'Cursed Relic (Purple — Passives)',
        hex: '#9461C9',
        chance: effectiveMorado,
        affixBuilder: () =>
          `2–3 major affixes · Passive: ${
            CURSED_PASSIVES[Math.floor(Math.random() * CURSED_PASSIVES.length)]
          }`,
      },
      {
        label: 'Astral Alchemy (Blue — Elemental)',
        hex: '#3E82C7',
        chance: activeContainer.azul,
        affixBuilder: () =>
          `1–2 elemental affixes (${
            ELEMENTAL_AFFIXES[Math.floor(Math.random() * ELEMENTAL_AFFIXES.length)]
          })`,
      },
      {
        label: 'Tempered Steel (Green — Upgrade)',
        hex: '#4F9E68',
        chance: activeContainer.verde,
        affixBuilder: () => '+15% base stats · Faster stamina recovery',
      },
      {
        label: 'Rusted Forge (Grey — Common)',
        hex: '#8C929A',
        chance: activeContainer.gris,
        affixBuilder: () => 'Baseline stats without passives (+5% optional Stamina)',
      },
    ];

    for (const bracket of brackets) {
      cumulative += bracket.chance;
      if (roll <= cumulative && bracket.chance > 0) {
        setSimulatedDrop({
          quality: bracket.label,
          hex: bracket.hex,
          itemName,
          itemSkill,
          itemSkillLabel,
          attackLevel,
          affixes: bracket.affixBuilder(),
          recommendation,
          isOptimalForPlayer: isOptimal,
          effectiveGoldChance,
        });
        return;
      }
    }

    setSimulatedDrop({
      quality: 'Rusted Forge (Grey — Common)',
      hex: '#8C929A',
      itemName,
      itemSkill,
      itemSkillLabel,
      attackLevel,
      affixes: 'Baseline survival stats',
      recommendation,
      isOptimalForPlayer: isOptimal,
      effectiveGoldChance,
    });
  };

  return (
    <section id="botin" className="border-t border-white/10 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section 03 Header */}
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#9C968B] uppercase">
              03 · Warrior, Masteries, Defense Level &amp; 90 Equipment Sets
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
              Dynamic Masteries, Level-Gated Sets &amp; Shield Protection
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#B8B1A6]">
            Every player enters Valdris as a <strong className="text-[#F6EFE2]">Warrior</strong>.
            Train weapon strikes or spells live to evolve your specialization and raise{' '}
            <strong className="text-[#F6EFE2]">Defense Level</strong> to multiply armor and shield
            mitigation.
          </p>
        </div>

        {/* Figure 3: 5-Tier Lineup */}
        <div className="mb-12">
          <MediaFrame
            src={GENERATED_ASSETS.qualityLineup}
            alt="Valdris Quality Scale: Rusted Forge, Tempered Steel, Astral Alchemy, Cursed Relic, and Royal Vestige"
            caption="Figure 3: Valdris Quality Scale — Visual silhouette progression from Rusted Forge (Grey) up to Royal Vestige (Gold)."
            aspectClass="aspect-video"
          />
        </div>

        {/* Dynamic Warrior Designation & In-Combat Progression */}
        <div className="mb-14 rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs text-[#9C968B]">
                Base Designation: Warrior · Automatic Specialization by Top Skill
              </p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-2xl font-semibold text-[#F6EFE2]">
                  {activeArchetype.title}
                </h3>
                <span className="text-sm text-[#C89B3C]">
                  {activeArchetype.spanishTitle} · General Lv. {profile.generalLevel} · Defense{' '}
                  {profile.defenseLevel}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[#B8B1A6]">
                {activeArchetype.description} Priority loot: {activeArchetype.recommendedLoot}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ['sword-warrior', 'Sword Warrior'],
                  ['club-warrior', 'Club Warrior'],
                  ['axe-warrior', 'Axe Warrior'],
                  ['archer', 'Archer'],
                  ['wizard', 'Wizard'],
                  ['druid', 'Druid'],
                ] as [WarriorArchetypeId, string][]
              ).map(([presetId, label]) => (
                <button
                  key={presetId}
                  type="button"
                  onClick={() => applyPreset(presetId)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeArchetype.id === presetId
                      ? 'border-[#C89B3C] bg-[#C89B3C]/15 text-[#F6EFE2]'
                      : 'border-white/15 bg-[#0F0F12] text-[#B8B1A6] hover:border-white/30 hover:text-[#F6EFE2]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Combat XP Actions including Defense */}
          <div className="mt-5 border-b border-white/10 pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-[#EAE6DF]">
                In-Combat Training (Weapons, Magic &amp; Shield Blocking)
              </p>
              <span className="text-[11px] text-[#9C968B]">
                +50% EXP per action · Level up at 100%
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              <button
                type="button"
                onClick={() => onTrainAttack('sword')}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Strike (Sword)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#C89B3C]">
                  Sword {profile.swordLevel} · {profile.swordXp}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => onTrainAttack('club')}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Smash (Club)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#C89B3C]">
                  Club {profile.clubLevel} · {profile.clubXp}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => onTrainAttack('axe')}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Cleave (Axe)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#C89B3C]">
                  Axe {profile.axeLevel} · {profile.axeXp}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => onTrainAttack('distance')}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Fire (Dual Crossbows)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#C89B3C]">
                  Dist. {profile.distanceLevel} · {profile.distanceXp}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => onCastSpell('offensive')}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Cast (Wizard)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#D4AF37]">
                  ML {profile.magicLevel} · {profile.magicXp}%
                </span>
              </button>

              <button
                type="button"
                onClick={() => onCastSpell('support')}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Cast (Druid)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#4F9E68]">
                  ML {profile.magicLevel} · {profile.magicXp}%
                </span>
              </button>

              <button
                type="button"
                onClick={onTrainDefense}
                className="rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-left transition-colors hover:border-[#C89B3C]/60"
              >
                <span className="block text-xs font-semibold text-[#F6EFE2]">
                  Block (Shield)
                </span>
                <span className="font-mono-tabular mt-0.5 block text-[11px] text-[#3E82C7]">
                  Def {profile.defenseLevel} · {profile.defenseXp}%
                </span>
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Skill Sliders */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="prof-sword" className="font-medium text-[#EAE6DF]">
                    Sword Level (Sword Warrior)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                    Lv. {profile.swordLevel}
                  </span>
                </div>
                <input
                  id="prof-sword"
                  type="range"
                  min={1}
                  max={150}
                  value={profile.swordLevel}
                  onChange={(e) =>
                    onChangeProfile({ ...profile, swordLevel: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full accent-[#C89B3C]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="prof-club" className="font-medium text-[#EAE6DF]">
                    Club Level (Club Warrior)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                    Lv. {profile.clubLevel}
                  </span>
                </div>
                <input
                  id="prof-club"
                  type="range"
                  min={1}
                  max={150}
                  value={profile.clubLevel}
                  onChange={(e) =>
                    onChangeProfile({ ...profile, clubLevel: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full accent-[#C89B3C]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="prof-axe" className="font-medium text-[#EAE6DF]">
                    Axe Level (Axe Warrior)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                    Lv. {profile.axeLevel}
                  </span>
                </div>
                <input
                  id="prof-axe"
                  type="range"
                  min={1}
                  max={150}
                  value={profile.axeLevel}
                  onChange={(e) =>
                    onChangeProfile({ ...profile, axeLevel: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full accent-[#C89B3C]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="prof-distance" className="font-medium text-[#EAE6DF]">
                    Distance Level (Dual-Crossbow Archer)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                    Lv. {profile.distanceLevel}
                  </span>
                </div>
                <input
                  id="prof-distance"
                  type="range"
                  min={1}
                  max={150}
                  value={profile.distanceLevel}
                  onChange={(e) =>
                    onChangeProfile({ ...profile, distanceLevel: Number(e.target.value) })
                  }
                  className="mt-1.5 w-full accent-[#C89B3C]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="prof-magic" className="font-medium text-[#EAE6DF]">
                    Magic Level (Wizard / Druid)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                    ML {profile.magicLevel}
                  </span>
                </div>
                <input
                  id="prof-magic"
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

              <div>
                <div className="flex justify-between text-xs">
                  <label htmlFor="prof-defense" className="font-medium text-[#EAE6DF]">
                    Defense Level (Armor &amp; Shields)
                  </label>
                  <span className="font-mono-tabular font-semibold text-[#3E82C7]">
                    Def {profile.defenseLevel}
                  </span>
                </div>
                <input
                  id="prof-defense"
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

              <div className="sm:col-span-2 rounded-md border border-[#C89B3C]/30 bg-[#0F0F12] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <label htmlFor="prof-weapon-mastery" className="font-semibold text-[#F6EFE2]">
                    Separate Weapon Mastery (Isolated from Attack Type &amp; Defense Lv)
                  </label>
                  <span
                    className={`font-mono-tabular font-semibold ${
                      profile.weaponMasteryPct >= 100 ? 'text-[#4F9E68]' : 'text-[#C89B3C]'
                    }`}
                  >
                    {profile.weaponMasteryPct}%{' '}
                    {profile.weaponMasteryPct >= 100
                      ? '· MAX ATTACK · SKIN UNLOCKED'
                      : '· In Progress'}
                  </span>
                </div>
                <input
                  id="prof-weapon-mastery"
                  type="range"
                  min={0}
                  max={100}
                  value={profile.weaponMasteryPct}
                  onChange={(e) =>
                    onChangeProfile({ ...profile, weaponMasteryPct: Number(e.target.value) })
                  }
                  className="mt-2 w-full accent-[#C89B3C]"
                />
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#B8B1A6]">
                  <span>
                    Organic 100% mastery unlocks the Weapon Skin for free; Store purchase
                    auto-maxes this separate track without touching Attack Type or Defense Level.
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onChangeProfile({
                          ...profile,
                          weaponMasteryPct: Math.min(100, profile.weaponMasteryPct + 25),
                        })
                      }
                      className="rounded border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#EAE6DF] hover:bg-white/[0.09]"
                    >
                      +25% Organic Mastery
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChangeProfile({
                          ...profile,
                          weaponMasteryPct: 100,
                        })
                      }
                      className="rounded border border-[#C89B3C]/50 bg-[#C89B3C]/15 px-2.5 py-1 text-[11px] font-semibold text-[#F6EFE2] hover:bg-[#C89B3C]/25"
                    >
                      Buy Skin (Auto-Max Weapon Mastery Only)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Loot Priority Ranking */}
            <div className="rounded-md border border-white/10 bg-[#0F0F12] p-4 lg:col-span-5">
              <p className="text-xs font-semibold text-[#C89B3C]">
                Recommended Loot ({activeArchetype.title})
              </p>
              <div className="mt-3 divide-y divide-white/[0.06]">
                {rankedSkills.map((skill, idx) => {
                  const priorityStatus =
                    idx === 0
                      ? 'Top Priority'
                      : skill.level >= topSkill.level - 15
                      ? 'Viable Secondary'
                      : 'Yield to Squad';
                  return (
                    <div
                      key={skill.key}
                      className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#F6EFE2]">
                          {skill.label}{' '}
                          <span className="font-mono-tabular text-[#C89B3C]">
                            ({skill.level})
                          </span>
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#9C968B]">
                          {skill.lootPriority}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-medium whitespace-nowrap ${
                          idx === 0
                            ? 'text-[#D4AF37]'
                            : skill.level >= topSkill.level - 15
                            ? 'text-[#EAE6DF]'
                            : 'text-[#736E66]'
                        }`}
                      >
                        {priorityStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Complete 90-Set Armory Catalog (15 sets per profession x 6 professions) + Interactive 3D Viewer */}
        <div className="mb-14 rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs tracking-wider text-[#9C968B] uppercase">
                  Decoupled Data &amp; Visual Catalog · 90 Sets (Stats) + 90 Launch Skins (Visual)
                </p>
                <h3 className="font-display mt-1 text-2xl font-semibold text-[#F6EFE2]">
                  Logical Stat Sets &amp; Unrelated Episode I Launch Cosmetic Skins
                </h3>
                <p className="mt-1 text-xs text-[#9C968B]">
                  In-match looted Sets modify combat stats, affixes, and build synergies only—never
                  altering default 3D visuals. All 90 3D designs shown below serve independently as
                  Valdris&apos;s first visible Launch Cosmetic Skins inside Cosmetic Transmog Slots
                  (completely unrelated to equipped gear stats).
                </p>
              </div>
              <div className="font-mono-tabular text-xs text-[#C89B3C]">
                Showing {filteredSets.length} / {professionSets.length} sets for{' '}
                <strong className="text-[#F6EFE2]">{inspectedSet.professionLabel}</strong>
              </div>
            </div>

            {/* Profession Tabs (6 Professions, 15 Sets Each) */}
            <div
              className="grid grid-cols-2 gap-1.5 rounded-lg border border-white/10 bg-[#0F0F12] p-1.5 sm:grid-cols-3 lg:grid-cols-6"
              role="tablist"
              aria-label="Select profession to browse its 15 armor sets"
            >
              {PROFESSION_SET_LIST.map((prof) => {
                const isSelected = selectedSetProfession === prof.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleSelectProfessionTab(prof.id)}
                    className={`rounded-md px-3 py-2 text-left transition-colors ${
                      isSelected
                        ? 'bg-[#222228] text-[#F6EFE2]'
                        : 'text-[#9C968B] hover:bg-white/[0.04] hover:text-[#EAE6DF]'
                    }`}
                  >
                    <span className="block text-xs font-semibold truncate">{prof.label}</span>
                    <span className="font-mono-tabular block text-[11px] text-[#C89B3C]">
                      15 Sets · {prof.skillLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Focus & Tier Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#0F0F12] p-1">
                <span className="px-2 text-[11px] text-[#9C968B]">Focus:</span>
                {(
                  [
                    ['all', 'All'],
                    ['Attack', 'Attack'],
                    ['Defense', 'Defense'],
                    ['Hybrid', 'Hybrid'],
                  ] as [SetFocusFilter, string][]
                ).map(([focusKey, label]) => (
                  <button
                    key={focusKey}
                    type="button"
                    onClick={() => setSetFocusFilter(focusKey)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                      setFocusFilter === focusKey
                        ? 'bg-[#C89B3C] text-[#0B0B0D]'
                        : 'text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#0F0F12] p-1">
                <span className="px-2 text-[11px] text-[#9C968B]">Tier:</span>
                {(
                  [
                    ['all', 'All'],
                    ['gris', 'Common'],
                    ['verde', 'Green'],
                    ['azul', 'Blue'],
                    ['morado', 'Purple'],
                    ['dorado', 'Gold'],
                  ] as [SetTierFilter, string][]
                ).map(([tierKey, label]) => (
                  <button
                    key={tierKey}
                    type="button"
                    onClick={() => setSetTierFilter(tierKey)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                      setTierFilter === tierKey
                        ? 'bg-[#222228] text-[#F6EFE2]'
                        : 'text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive 15-Set Selector + Live 3D Set Showcase */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Scrollable 15-Set List for Selected Profession */}
            <div className="lg:col-span-5">
              <div className="max-h-[700px] space-y-2.5 overflow-y-auto pr-1">
                {filteredSets.length === 0 ? (
                  <div className="rounded-lg border border-white/10 bg-[#0F0F12] p-6 text-center text-xs text-[#9C968B]">
                    No armor sets match the current filters. Adjust Focus or Quality Tier.
                  </div>
                ) : (
                  filteredSets.map((set) => {
                    const isSelected = set.id === inspectedSet.id;
                    const currentAttackSkill = getSkillValue(profile, set.attackSkill);
                    const unlocked =
                      profile.generalLevel >= set.minGeneralLevel &&
                      currentAttackSkill >= set.minAttackMastery &&
                      profile.defenseLevel >= set.minDefenseLevel;
                    const styleMeta = getSetStyleProfile(set);

                    return (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => setSelectedSetId(set.id)}
                        className={`w-full rounded-lg border p-3 text-left transition-colors ${
                          isSelected
                            ? 'border-[#C89B3C] bg-[#1B1B21]'
                            : 'border-white/10 bg-[#0F0F12] hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={set.designImageSrc}
                            alt={`3D Thumbnail for ${set.name}`}
                            referrerPolicy="no-referrer"
                            className="h-12 w-16 shrink-0 rounded border border-white/15 bg-[#09090C] object-cover object-top"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 text-[11px]">
                              <span
                                className="inline-flex items-center gap-1.5 truncate font-semibold"
                                style={{ color: set.tierHex }}
                              >
                                <span
                                  className="inline-block h-2 w-2 shrink-0 rounded-sm"
                                  style={{ backgroundColor: styleMeta.auraHex }}
                                  aria-hidden="true"
                                />
                                #{String(set.setNumber).padStart(2, '0')} · {set.tierLabel}
                              </span>
                              <span
                                className={`shrink-0 font-semibold whitespace-nowrap ${
                                  set.focusType === 'Attack'
                                    ? 'text-[#E06C5A]'
                                    : set.focusType === 'Defense'
                                    ? 'text-[#3E82C7]'
                                    : 'text-[#D4AF37]'
                                }`}
                              >
                                {set.focusType} · Lv.{set.minGeneralLevel}+
                              </span>
                            </div>

                            <p className="font-display mt-1 truncate text-sm font-semibold text-[#F6EFE2]">
                              {set.name}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-[#9C968B]">
                              {set.focusTarget} · {styleMeta.materialLabel}
                            </p>
                          </div>
                        </div>

                        <div className="font-mono-tabular mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2 text-[11px] text-[#D4CEC3]">
                          <span>
                            Atk {set.weaponAttack} · Def {set.armorDefense + set.shieldDefense} ·
                            Blk {set.baseShieldBlockPct}%
                          </span>
                          <span className={unlocked ? 'text-[#4F9E68]' : 'text-[#9C968B]'}>
                            {unlocked ? 'Unlocked' : `Req. M${set.minAttackMastery}/D${set.minDefenseLevel}`}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: 3D Design Viewport + Selected Set Full Inspection */}
            <div className="flex flex-col gap-5 lg:col-span-7">
              <ArmorSet3DViewer activeSet={inspectedSet} />

              {(() => {
                const currentAttackSkill = getSkillValue(profile, inspectedSet.attackSkill);
                const meetsGeneral = profile.generalLevel >= inspectedSet.minGeneralLevel;
                const meetsAttackMastery = currentAttackSkill >= inspectedSet.minAttackMastery;
                const meetsDefense = profile.defenseLevel >= inspectedSet.minDefenseLevel;
                const fullyUnlocked = meetsGeneral && meetsAttackMastery && meetsDefense;
                const defStats = computeDefenseStats(
                  inspectedSet.armorDefense,
                  inspectedSet.shieldDefense,
                  profile.defenseLevel,
                  inspectedSet.baseShieldBlockPct
                );

                return (
                  <div className="rounded-lg border border-white/10 bg-[#0F0F12] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold" style={{ color: inspectedSet.tierHex }}>
                            {inspectedSet.tierLabel}
                          </span>
                          <span className="text-[#736E66]" aria-hidden="true">
                            ·
                          </span>
                          <span
                            className={`font-semibold ${
                              inspectedSet.focusType === 'Attack'
                                ? 'text-[#E06C5A]'
                                : inspectedSet.focusType === 'Defense'
                                ? 'text-[#3E82C7]'
                                : 'text-[#D4AF37]'
                            }`}
                          >
                            {inspectedSet.focusType} Focus
                          </span>
                        </div>
                        <h4 className="font-display mt-1 text-xl font-semibold text-[#F6EFE2]">
                          {inspectedSet.name}
                        </h4>
                      </div>
                      <span className="font-mono-tabular text-xs font-semibold text-[#C89B3C]">
                        Lv. {inspectedSet.minGeneralLevel}+ Required
                      </span>
                    </div>

                    {/* Focus Advantage Box */}
                    <div className="mt-4 rounded border border-white/[0.08] bg-[#141417] p-3.5">
                      <p className="text-[11px] font-semibold tracking-wider text-[#C89B3C] uppercase">
                        Tactical Advantage: {inspectedSet.focusTarget}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#EAE6DF]">
                        {inspectedSet.focusAdvantage}
                      </p>
                    </div>

                    {/* Weapon + Armor + Shield breakdown */}
                    <dl className="mt-4 space-y-2 text-xs">
                      <div className="flex items-start justify-between gap-2">
                        <dt className="text-[#9C968B]">Weapon · {inspectedSet.weaponName}</dt>
                        <dd className="font-mono-tabular shrink-0 font-semibold text-[#C89B3C]">
                          Atk {inspectedSet.weaponAttack}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <dt className="text-[#9C968B]">Armor · {inspectedSet.armorName}</dt>
                        <dd className="font-mono-tabular shrink-0 text-[#EAE6DF]">
                          Def {inspectedSet.armorDefense}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-2">
                        <dt className="text-[#9C968B]">Shield / Off-Hand · {inspectedSet.shieldName}</dt>
                        <dd className="font-mono-tabular shrink-0 text-[#EAE6DF]">
                          Def {inspectedSet.shieldDefense} · Blk.{' '}
                          {inspectedSet.baseShieldBlockPct}%
                        </dd>
                      </div>
                    </dl>

                    {/* Mastery & Defense Requirements + Live Protection Readout */}
                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
                      <div className="rounded border border-white/[0.08] bg-[#141417] p-3 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-[#9C968B]">Min. Attack Mastery</span>
                          <span
                            className={`font-mono-tabular font-semibold ${
                              meetsAttackMastery ? 'text-[#4F9E68]' : 'text-[#E06C5A]'
                            }`}
                          >
                            {inspectedSet.attackSkillLabel} {inspectedSet.minAttackMastery}
                          </span>
                        </div>
                        <div className="mt-1.5 flex justify-between">
                          <span className="text-[#9C968B]">Min. Defense Level</span>
                          <span
                            className={`font-mono-tabular font-semibold ${
                              meetsDefense ? 'text-[#4F9E68]' : 'text-[#E06C5A]'
                            }`}
                          >
                            Defense {inspectedSet.minDefenseLevel}
                          </span>
                        </div>
                        <p
                          className={`mt-2 border-t border-white/[0.06] pt-2 font-semibold ${
                            fullyUnlocked ? 'text-[#4F9E68]' : 'text-[#C89B3C]'
                          }`}
                        >
                          {fullyUnlocked
                            ? 'All requirements met for this Warrior.'
                            : `Missing: ${!meetsGeneral ? `Lv.${inspectedSet.minGeneralLevel} ` : ''}${
                                !meetsAttackMastery
                                  ? `${inspectedSet.attackSkillLabel} ${inspectedSet.minAttackMastery} `
                                  : ''
                              }${!meetsDefense ? `Defense ${inspectedSet.minDefenseLevel}` : ''}`}
                        </p>
                      </div>

                      <div className="rounded border border-white/[0.08] bg-[#141417] p-3 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#9C968B]">
                            Live Protection (Def {profile.defenseLevel})
                          </span>
                          <span className="font-mono-tabular font-semibold text-[#3E82C7]">
                            {defStats.effectiveArmor.toFixed(0)} Eff. Arm.
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[#D4CEC3]">
                          <span>Passive mitigation:</span>
                          <span className="font-mono-tabular font-semibold text-[#F6EFE2]">
                            {defStats.mitigationPct.toFixed(1)}%
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[#D4CEC3]">
                          <span>While shield blocking:</span>
                          <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                            {defStats.combinedBlockedMitigationPct.toFixed(1)}% reduced
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Interactive 5 Tiers Inspector */}
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
              {QUALITY_TIERS.map((tier) => {
                const isSelected = tier.id === activeQuality.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                      isSelected
                        ? 'border-[#C89B3C]/60 bg-[#1B1B21] text-[#F6EFE2]'
                        : 'border-white/10 bg-[#141417] text-[#9C968B] hover:border-white/20 hover:text-[#EAE6DF]'
                    }`}
                  >
                    <span
                      className="block h-1.5 w-8 rounded-full"
                      style={{ backgroundColor: tier.hex }}
                      aria-hidden="true"
                    />
                    <span className="mt-2.5 block text-xs font-semibold text-[#F6EFE2] truncate">
                      {tier.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#9C968B] truncate">
                      {tier.colorName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-[#141417] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#9C968B]">{activeQuality.colorName}</p>
                  <h3 className="font-display mt-1 text-2xl font-semibold text-[#F6EFE2]">
                    {activeQuality.name}
                  </h3>
                </div>
                <span
                  className="h-3 w-12 rounded-sm"
                  style={{ backgroundColor: activeQuality.hex }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-[#C89B3C]">{activeQuality.subtitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-[#D4CEC3]">
                {activeQuality.description}
              </p>
            </div>
          </div>

          {/* Universal Character Slots */}
          <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-5">
            <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
              Decoupled Warrior Slots (Data vs. Cosmetics)
            </h3>
            <dl className="mt-4 divide-y divide-white/[0.08]">
              {UNIVERSAL_SLOTS.map((item) => (
                <div key={item.slot} className="py-3.5 first:pt-0 last:pb-0">
                  <dt className="text-sm font-semibold text-[#EAE6DF]">{item.slot}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-[#B8B1A6]">{item.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Master Loot Table & Mastery Cap Simulator */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#141417] lg:col-span-7">
            <div className="border-b border-white/10 px-5 py-4">
              <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                Master Drop Rates &amp; Affix Table
              </h3>
              <p className="mt-1 text-xs text-[#9C968B]">
                Select any container row to simulate opening it as {activeArchetype.title}.
              </p>
            </div>
            <table className="w-full min-w-[580px] text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#9C968B] uppercase">
                  <th className="px-4 py-3 font-medium">Container</th>
                  <th className="px-3 py-3 font-medium text-right">Grey</th>
                  <th className="px-3 py-3 font-medium text-right">Green</th>
                  <th className="px-3 py-3 font-medium text-right">Blue</th>
                  <th className="px-3 py-3 font-medium text-right">Purple</th>
                  <th className="px-3 py-3 font-medium text-right text-[#D4AF37]">Gold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
                {CONTAINER_DROP_TABLE.map((row) => {
                  const isActive = row.id === activeContainer.id;
                  return (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedContainerId(row.id);
                        setSimulatedDrop(null);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-[#F6EFE2]">{row.container}</div>
                        <div className="mt-0.5 text-[11px] text-[#9C968B]">{row.affixRule}</div>
                      </td>
                      <td className="font-mono-tabular px-3 py-3.5 text-right">{row.gris}%</td>
                      <td className="font-mono-tabular px-3 py-3.5 text-right">{row.verde}%</td>
                      <td className="font-mono-tabular px-3 py-3.5 text-right">{row.azul}%</td>
                      <td className="font-mono-tabular px-3 py-3.5 text-right">{row.morado}%</td>
                      <td className="font-mono-tabular px-3 py-3.5 text-right font-semibold text-[#D4AF37]">
                        {row.dorado}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Interactive Container & Mastery Simulator */}
          <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-5">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#F6EFE2]">
                Loot Simulator &amp; Omni-Mastery Cap (35% → 50%)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#9C968B]">
                Base Gold Tier drop rate caps at 35%, expanding to{' '}
                <strong className="text-[#D4AF37]">50%</strong> once all Attack Types (Sword, Club,
                Axe, Distance), Magic, and Defense organically reach Lv. 100+.
              </p>

              <div className="mt-4 rounded-md border border-white/10 bg-[#0F0F12] p-3 text-[11px]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-[#EAE6DF]">
                    All Attack, Magic &amp; Defense ≥ Lv. 100
                  </span>
                  <span
                    className={`font-mono-tabular font-semibold ${
                      omniMasteryUnlocked ? 'text-[#4F9E68]' : 'text-[#C89B3C]'
                    }`}
                  >
                    {omniMasteryUnlocked ? 'UNLOCKED · 50% CAP' : 'LOCKED · 35% BASE CAP'}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1.5 font-mono-tabular text-[10px]">
                  {[
                    ['Sword', profile.swordLevel],
                    ['Club', profile.clubLevel],
                    ['Axe', profile.axeLevel],
                    ['Dist.', profile.distanceLevel],
                    ['Magic', profile.magicLevel],
                    ['Def.', profile.defenseLevel],
                  ].map(([lbl, val]) => (
                    <span
                      key={String(lbl)}
                      className={`rounded px-1.5 py-0.5 ${
                        Number(val) >= 100
                          ? 'bg-[#4F9E68]/15 text-[#7AD696]'
                          : 'bg-white/[0.04] text-[#9C968B]'
                      }`}
                    >
                      {lbl} {val}/100
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onChangeProfile({
                      ...profile,
                      generalLevel: Math.max(100, profile.generalLevel),
                      swordLevel: 100,
                      clubLevel: 100,
                      axeLevel: 100,
                      distanceLevel: 100,
                      magicLevel: 100,
                      defenseLevel: 100,
                    });
                    setSimulatedDrop(null);
                  }}
                  className="mt-2.5 w-full rounded border border-[#C89B3C]/45 bg-[#C89B3C]/10 px-2.5 py-1 text-[11px] font-semibold text-[#F6EFE2] hover:bg-[#C89B3C]/20"
                >
                  Simulate All Attack, Magic &amp; Defense @ Lv. 100 (Unlock 50% Cap)
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="mastery-level-slider" className="text-[#D4CEC3]">
                      Warrior General Level
                    </label>
                    <span className="font-mono-tabular font-semibold text-[#C89B3C]">
                      Lv. {profile.generalLevel} · Mastery {masteryRank} (+{pveDamageBonus}% PvE
                      Dmg)
                    </span>
                  </div>
                  <input
                    id="mastery-level-slider"
                    type="range"
                    min={1}
                    max={500}
                    step={10}
                    value={profile.generalLevel}
                    onChange={(e) => {
                      onChangeProfile({
                        ...profile,
                        generalLevel: Number(e.target.value),
                      });
                      setSimulatedDrop(null);
                    }}
                    className="mt-2 w-full accent-[#C89B3C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-md border border-white/[0.08] bg-[#0F0F12] p-3.5 text-xs">
                  <div>
                    <span className="text-[#9C968B]">Active Container</span>
                    <p className="mt-0.5 font-semibold text-[#EAE6DF] truncate">
                      {activeContainer.container}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#9C968B]">Gold Tier Chance</span>
                    <p className="font-mono-tabular mt-0.5 font-semibold text-[#D4AF37]">
                      {effectiveGoldChance}%{' '}
                      <span className="font-normal text-[#9C968B]">({activeGoldCap}% Cap)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleSimulateOpen}
                className="w-full rounded-md bg-[#C89B3C] px-4 py-2.5 text-sm font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C89B3C]"
              >
                Open Container
              </button>

              {simulatedDrop && (
                <div className="mt-4 rounded-md border border-white/10 bg-[#0F0F12] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold" style={{ color: simulatedDrop.hex }}>
                      {simulatedDrop.quality}
                    </span>
                    <span className="font-mono-tabular text-[11px] text-[#9C968B]">
                      {simulatedDrop.itemSkillLabel}
                      {simulatedDrop.attackLevel > 0 ? ` · Atk ${simulatedDrop.attackLevel}` : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[#F6EFE2]">
                    {simulatedDrop.itemName}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#D4CEC3]">
                    {simulatedDrop.affixes}
                  </p>
                  <p
                    className={`mt-2.5 border-t border-white/10 pt-2 text-xs font-medium ${
                      simulatedDrop.isOptimalForPlayer ? 'text-[#4F9E68]' : 'text-[#C89B3C]'
                    }`}
                  >
                    {simulatedDrop.recommendation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 05: PvE Difficulty Tiers & Seal Gating */}
        <div className="border-t border-white/10 pt-16">
          <div className="mb-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
            <div className="flex flex-col justify-center lg:col-span-6">
              <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                05 · PvE Monster Difficulty Tiers (Sealed PvPvE Loot)
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2] lg:text-3xl">
                Seal Gating &amp; Dynamic Lv_avg + 100 Scaling
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#D4CEC3]">
                Valdris locks its strongest chests behind four progressive PvE threat tiers. The
                Match-Up System pairs 200 players into fair brackets and spawns every creature at
                Effective Level = Lv_avg + 100 using the Warrior HP curve multiplied by Tier
                (0.45x to 3.00x).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#B8B1A6]">
                The server maintains a Retroactive Net-Damage Ledger per monster and pays out EXP on
                death based on each player&apos;s % damage share and ΔLevel (0.15x – 2.50x).
              </p>
            </div>

            <div className="lg:col-span-6">
              <MediaFrame
                src={GENERATED_ASSETS.catacombsAltar}
                alt="Sealed Altar-Chest and Catacombs of the Nameless King Guardians"
                caption="Figure 5: Sealed Altar-Chest and Catacomb Guardians of the Nameless King (Tier III)."
                aspectClass="aspect-[4/3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {PVE_DIFFICULTY_TIERS.map((tier) => (
              <article
                key={tier.id}
                className="rounded-lg border border-white/10 bg-[#141417] p-6"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#9C968B]">
                  <span className="font-semibold text-[#C89B3C]">{tier.tierLabel}</span>
                  <span>{tier.acts}</span>
                </div>
                <h4 className="font-display mt-2 text-lg font-semibold text-[#F6EFE2]">
                  {tier.difficulty}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#D4CEC3]">{tier.enemies}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#9C968B]">{tier.chestMechanic}</p>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <dt className="text-[#9C968B]">Wanderer / Oath Scaling</dt>
                    <dd className="font-mono-tabular mt-0.5 text-[#EAE6DF]">
                      {tier.scalingErrante} · {tier.scalingJuramento}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#9C968B]">PvP Exposure Risk</dt>
                    <dd className="mt-0.5 text-[#EAE6DF]">{tier.pvpRisk}</dd>
                  </div>
                </dl>

                <div className="mt-4 border-t border-white/10 pt-3 text-[11px] text-[#B8B1A6]">
                  <span className="font-semibold text-[#D4AF37]">Guaranteed Drop:</span>{' '}
                  {tier.guaranteedRule}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
