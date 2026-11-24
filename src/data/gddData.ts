export const GENERATED_ASSETS = {
  heroCitadel: '/src/assets/images/fig1_ciudadela_valdris.jpg',
  siegeBridge: '/src/assets/images/fig2_asedio_puente_valdris.jpg',
  qualityLineup: '/src/assets/images/fig3_escala_calidad_valdris.jpg',
  relicLoot: '/src/assets/images/fig4_estudio_botin_reliquias.jpg',
  catacombsAltar: '/src/assets/images/fig5_catacumbas_cofre_sellado.jpg',
  throneDuel: '/src/assets/images/fig6_salon_trono_duelo.jpg',
  biomesVista: '/src/assets/images/fig7_biomas_marismas_agujas.jpg',
  biomeMiasmaMarshes: '/src/assets/images/biome_miasma_marshes_1794869216604.jpg',
  biomeForestSpires: '/src/assets/images/biome_forest_spires_1794869217760.jpg',
  gameLogo: '/assets/aistudio/image_c05930f7_b8d13f83.jpg',
  studioLogo: '/assets/aistudio/image_39f1f35b_65d24a02.jpg',
  stormMiasmaBaseline: '/src/assets/images/storm_miasma_baseline_1795189921786.jpg',
  stormWinterBlizzard: '/src/assets/images/storm_winter_blizzard_1795189920008.jpg',
  stormSummerHeat: '/src/assets/images/storm_summer_heat_1795189920090.jpg',
  skinDarkSantaFrost: '/src/assets/images/skin_dark_santa_frost_1795189919775.jpg',
  skinSummerAshSolstice: '/src/assets/images/skin_summer_ash_solstice_1795189920293.jpg',
  eventHalloweenValdris: '/src/assets/images/event_halloween_valdris_1795190239316.jpg',
  skinHalloweenWarden: '/src/assets/images/skin_halloween_warden_1795190239202.jpg',
  ue5PrototypePreviewVideo: '/assets/aistudio/ue5_standalone_preview.mp4',
  ue5PrototypePoster: '/assets/aistudio/ue5_standalone_poster.jpg',
} as const;

export interface FichaEntry {
  label: string;
  value: string;
}

export const FICHA_TECNICA: FichaEntry[] = [
  { label: 'Work Title', value: 'Valdris Chronicle: Last Relic (Episode I) - The Last Relic' },
  {
    label: 'Studio & Contact',
    value: 'Dimpz Games · isaacgestrada94@gmail.com · +52 33 1835 9421',
  },
  {
    label: 'Classification',
    value: 'Literary Work / Master Video Game Design Document',
  },
  {
    label: 'Genre',
    value: 'Tactical TPS Battle Royale / Dark Medieval Action / PvPvE',
  },
  {
    label: 'Scale & Modes',
    value:
      '200 Players (Oath Mode: Duos, Trios & Quads united with shared victory | Wanderer Mode: Solo 1 vs 199, single survivor)',
  },
  {
    label: 'Target Engine',
    value: 'Unreal Engine 5 (Replication Graph, Direct3D 12)',
  },
  {
    label: 'Filing Edition',
    value: 'Original IP Edition · 2026-11-16',
  },
];

export const GAME_MODES = [
  {
    id: 'juramento',
    name: 'Oath Mode',
    subtitle: 'Duos, Trios & Quads - Shared Squad Victory',
    summary:
      'Duos, Trios, and Quads never split, have zero friendly fire, and claim victory together - crowning team ranks by Kills, Assists, and Team Healing Magic.',
    rules: [
      'During Acts I through III, a fallen squadmate respawns in 60 seconds as long as at least 1 ally remains alive.',
      'If all remaining teammates fall before the 60s timer completes, the entire squad is eliminated instantly.',
      'Starting in Act IV (Black Bell), all respawns are permanently disabled for the rest of the match.',
      'Post-match Coronation & Time Alive EXP: Kills, Assists, Team Healing Magic, and Time Alive award EXP; top squadmate is crowned King, 2nd Captain, 3rd Colonel, and last Sergeant.',
    ],
    respawnWindow: '60s in Acts I-III · No respawn from Act IV',
    winCondition: 'Joint squad victory with Throne Hall Hierarchy (King, Captain, Colonel, Sergeant)',
  },
  {
    id: 'errante',
    name: 'Wanderer Mode',
    subtitle: 'Solo 1 vs 199 - Sole Survivor',
    summary:
      'Extreme individual survival with zero alliances from the very first second.',
    rules: [
      'Every combatant fights solely for themselves against 199 rival Warriors and Valdris PvE wildlife.',
      'Zero resurrection mechanics; heuristic telemetry flags and penalizes illicit teaming.',
      'The only game mode where strictly 1 sole victor claims the Iron Crown in the Throne Hall.',
    ],
    respawnWindow: 'No respawn from match start',
    winCondition: '1 sole survivor in the Throne Hall',
  },
] as const;

export interface MatchAct {
  id: string;
  number: string;
  name: string;
  timeRange: string;
  survivors: string;
  respawnStatus: string;
  respawnActive: boolean;
  summary: string;
  keyEvents: string[];
  image: string;
  caption: string;
}

export const MATCH_ACTS: MatchAct[] = [
  {
    id: 'act-1',
    number: 'Act I',
    name: 'The Landfall',
    timeRange: '0:00 - 4:00',
    survivors: '200 → 130',
    respawnStatus: '60s Respawn Active',
    respawnActive: true,
    summary:
      'Insertion along the outer coasts and forests of Valdris. Rapid scavenging of basic stashes, Tier I monster hunts, and opening skirmishes.',
    keyEvents: [
      'Everyone starts identically as a Warrior: traveler rags, iron knife, and 2 minor vials.',
      'Duos, Trios, and Quads stay united with a 60s respawn timer while 1+ ally survives.',
      'First encounters with Valdris Marauders (Tier I) at roadside camps and patrols.',
    ],
    image: GENERATED_ASSETS.heroCitadel,
    caption: 'Figure 1: The Citadel of Valdris under The Abyssal Ash and outer landing coasts.',
  },
  {
    id: 'act-2',
    number: 'Act II',
    name: 'The Hunt',
    timeRange: '4:00 - 9:00',
    survivors: '130 → 60',
    respawnStatus: '60s Respawn Active',
    respawnActive: true,
    summary:
      'First constriction of The Abyssal Ash. Sealed Altar-Chests (Epic) emerge guarded by spectral sentinels and Tier II-III PvE beasts.',
    keyEvents: [
      'PvPvE clashes around runic light beacons visible up to 70m when breaking Altar seals.',
      'Squad rotation from the Miasma Marshes and Forest of Spires toward the walled periphery.',
      'If every member of a company falls before the 60s timer finishes, the squad wipes immediately.',
    ],
    image: GENERATED_ASSETS.catacombsAltar,
    caption: 'Figure 5: Sealed Altar-Chest and Spectral Guardians defending high-tier loot.',
  },
  {
    id: 'act-3',
    number: 'Act III',
    name: 'The Siege',
    timeRange: '9:00 - 14:00',
    survivors: '60 → 16',
    respawnStatus: 'Final Act with 60s Respawn',
    respawnActive: true,
    summary:
      'Convergence inside The Citadel of Valdris. Vertical warfare across battlements, drawbridges, inner courtyards, and subterranean catacombs.',
    keyEvents: [
      'Company clashes over the Citadel drawbridge using Bastion and Cataclysm Ether Seals.',
      'Raids into the Catacombs of the Nameless King for Ossuary Keys and Cursed Relics.',
      'Final tactical window to recover fallen allies before the Black Bell tolls.',
    ],
    image: GENERATED_ASSETS.siegeBridge,
    caption: 'Figure 2: The Siege - Company clash across the Citadel of Valdris drawbridge.',
  },
  {
    id: 'act-4',
    number: 'Act IV',
    name: 'The Black Bell',
    timeRange: '14:00 - 16:00',
    survivors: 'Last 16 Companies / 4',
    respawnStatus: 'NO RESPAWN',
    respawnActive: false,
    summary:
      'Toll of the Black Bell: all squadmate respawns are permanently disabled, the Catacombs seal shut, and the Ash Herald (Tier IV) spawns.',
    keyEvents: [
      'Permanent death: every elimination is final in both Oath Mode and Wanderer Mode.',
      'Desperate ascent up the 3 sole escape stairways before subterranean sealing.',
      'Global compass marker reveals the Black Bell Executioner (3.00x HP, 35% base / 50% Omni-Lv.100 Gold Tier).',
    ],
    image: GENERATED_ASSETS.throneDuel,
    caption: 'Figure 6: Acts IV-V - Toll of the Black Bell echoing through the Citadel vaults.',
  },
  {
    id: 'act-5',
    number: 'Act V',
    name: 'The Judgment',
    timeRange: '16:00 - Finale',
    survivors: 'Throne Hall Finale',
    respawnStatus: 'NO RESPAWN · Sudden Death',
    respawnActive: false,
    summary:
      'Decisive no-respawn showdown in the Throne Hall beneath The Abyssal Ash. The winning company enters the Coronation: top kills & impact claims King, followed by Captain, Colonel, and Sergeant (or 1 sole King in Wanderer Mode).',
    keyEvents: [
      'High-stakes Parry and Riposte duels (1.60x damage ignoring 35% armor) with endgame loadouts.',
      'Winning Squad Coronation: ranked by Kills, Assists, and Team Healing Magic (#1 King, #2 Captain, #3 Colonel, Last Sergeant).',
      'Time Alive EXP plus Kills, Assists, and Team Healing Magic payouts settle all General & Mastery levels.',
    ],
    image: GENERATED_ASSETS.throneDuel,
    caption: 'Figure 6: The Judgment - Final Parry duel and Throne Hall Coronation.',
  },
];

export interface VictoryRankSpec {
  id: 'king' | 'captain' | 'colonel' | 'sergeant';
  orderLabel: string;
  title: string;
  accentHex: string;
  rule: string;
  expBonusPct: number;
  ceremonyReward: string;
}

export const VICTORY_HIERARCHY_RANKS: VictoryRankSpec[] = [
  {
    id: 'king',
    orderLabel: '1st in Squad (Top Kills & Score)',
    title: 'King',
    accentHex: '#D4AF37',
    rule: 'Player on the winning team with the highest Eliminations (plus Assists & Team Healing Magic weight).',
    expBonusPct: 35,
    ceremonyReward: 'Crowned with The Iron Crown in the Throne Hall · +35% Victory EXP Bonus',
  },
  {
    id: 'captain',
    orderLabel: '2nd in Squad',
    title: 'Captain',
    accentHex: '#C8D0DC',
    rule: 'Second-highest contributor across Kills, Assists, and Squad Healing Magic.',
    expBonusPct: 22,
    ceremonyReward: 'First Officer Royal Blade Banner · +22% Victory EXP Bonus',
  },
  {
    id: 'colonel',
    orderLabel: '3rd in Squad',
    title: 'Colonel',
    accentHex: '#C89B3C',
    rule: 'Third-highest contributor across Kills, Assists, and Squad Healing Magic.',
    expBonusPct: 15,
    ceremonyReward: 'Citadel Field Marshal Standard · +15% Victory EXP Bonus',
  },
  {
    id: 'sergeant',
    orderLabel: '4th / Last in Squad',
    title: 'Sergeant',
    accentHex: '#4F9E68',
    rule: 'Final member of the winning squad - still honored for Survival Time, Assists, and Support.',
    expBonusPct: 10,
    ceremonyReward: 'Oathguard Quartermaster Signet · +10% Victory EXP Bonus',
  },
];

export interface SquadMateInput {
  id: string;
  name: string;
  role: string;
  kills: number;
  assists: number;
  teamHealingHp: number;
  minutesAlive: number;
}

export function computeSquadContributionScore(member: SquadMateInput): number {
  return member.kills * 100 + member.assists * 45 + Math.floor(member.teamHealingHp / 25);
}

export function computeMatchExpBreakdown(member: SquadMateInput, rankExpBonusPct: number) {
  const combatExp = member.kills * 140 + member.assists * 65;
  const healingSupportExp = Math.round(member.teamHealingHp / 15);
  const timeAliveExp = Math.round(member.minutesAlive * 20);
  const baseTotal = combatExp + healingSupportExp + timeAliveExp;
  const rankBonusExp = Math.round(baseTotal * (rankExpBonusPct / 100));
  return {
    combatExp,
    healingSupportExp,
    timeAliveExp,
    rankBonusExp,
    totalExp: baseTotal + rankBonusExp,
  };
}

export interface QualityTier {
  id: string;
  name: string;
  colorName: string;
  hex: string;
  badgeText: string;
  subtitle: string;
  description: string;
}

export const QUALITY_TIERS: QualityTier[] = [
  {
    id: 'gris',
    name: 'Rusted Forge',
    colorName: 'Grey - Common',
    hex: '#8C929AC9',
    badgeText: 'Grey · Common',
    subtitle: 'Baseline survival gear',
    description: 'Baseline stats with no passive effects. Act I starting point.',
  },
  {
    id: 'verde',
    name: 'Tempered Steel',
    colorName: 'Green - Upgrade',
    hex: '#4F9E68',
    badgeText: 'Green · Upgrade',
    subtitle: '+15% base stat boost',
    description: '+15% base stats and faster stamina recovery rate.',
  },
  {
    id: 'azul',
    name: 'Astral Alchemy',
    colorName: 'Blue - Elemental',
    hex: '#3E82C7',
    badgeText: 'Blue · Elemental',
    subtitle: 'Combat elemental infusion',
    description:
      'Imbues weapons and armor with elemental affixes: Embers, Frost, Miasma, or Voltaic.',
  },
  {
    id: 'morado',
    name: 'Cursed Relic',
    colorName: 'Purple - Passives',
    hex: '#9461C9',
    badgeText: 'Purple · Passives',
    subtitle: 'Rule-bending combat passives',
    description:
      'Grants combat-altering passives (lifesteal on executions, ethereal phase on dodge).',
  },
  {
    id: 'dorado',
    name: 'Royal Vestige',
    colorName: 'Gold - Unique',
    hex: '#D4AF37',
    badgeText: 'Gold · Unique',
    subtitle: 'Match-unique legendary stat data',
    description:
      'Unique legendary combat data per match granting maximum stats, affixes, and ultimate abilities - completely decoupled from equipped Cosmetic Skins.',
  },
];

export interface ContainerDropRow {
  id: string;
  container: string;
  gris: number;
  verde: number;
  azul: number;
  morado: number;
  dorado: number;
  affixRule: string;
}

export const CONTAINER_DROP_TABLE: ContainerDropRow[] = [
  {
    id: 'cofre-comun',
    container: 'Common Chest / Rustic Stash',
    gris: 70,
    verde: 25,
    azul: 5,
    morado: 0,
    dorado: 0,
    affixRule: 'No affixes or 1 minor secondary affix (+5% Stamina).',
  },
  {
    id: 'altar-cofre',
    container: 'Sealed Altar-Chest (Tier II)',
    gris: 10,
    verde: 35,
    azul: 40,
    morado: 12,
    dorado: 3,
    affixRule: '1-2 elemental affixes (Embers, Frost, Miasma, Voltaic).',
  },
  {
    id: 'boveda-catacumba',
    container: 'Catacomb Vault (Tier III)',
    gris: 0,
    verde: 10,
    azul: 35,
    morado: 41,
    dorado: 14,
    affixRule: '2-3 major affixes + 1 rule-altering combat passive.',
  },
  {
    id: 'botin-heraldo',
    container: 'Ash Herald Spoils (Tier IV)',
    gris: 0,
    verde: 0,
    azul: 0,
    morado: 65,
    dorado: 35,
    affixRule: '3 maximum affixes + legendary passive or Royal Vestige ultimate.',
  },
];

import {
  EQUIPMENT_SETS,
  PROFESSION_SET_LIST,
  type CombatSkillKey,
  type EquipmentSetSpec,
  type QualityTierKey,
  type SetFocusType,
  type Visual3DConfig,
  type WarriorArchetypeId,
} from './equipmentSets';

export {
  EQUIPMENT_SETS,
  PROFESSION_SET_LIST,
  type CombatSkillKey,
  type EquipmentSetSpec,
  type QualityTierKey,
  type SetFocusType,
  type Visual3DConfig,
  type WarriorArchetypeId,
};

export interface WarriorArchetypeSpec {
  id: WarriorArchetypeId;
  title: string;
  spanishTitle: string;
  dominantSkill: CombatSkillKey;
  description: string;
  recommendedLoot: string;
}

export interface PlayerCombatProfile {
  generalLevel: number;
  swordLevel: number;
  clubLevel: number;
  axeLevel: number;
  distanceLevel: number;
  magicLevel: number;
  defenseLevel: number;
  weaponMasteryPct: number;
  swordXp: number;
  clubXp: number;
  axeXp: number;
  distanceXp: number;
  magicXp: number;
  defenseXp: number;
  offensiveSpellCasts: number;
  supportSpellCasts: number;
}

export function hasOmniMastery100(profile: PlayerCombatProfile): boolean {
  return (
    profile.swordLevel >= 100 &&
    profile.clubLevel >= 100 &&
    profile.axeLevel >= 100 &&
    profile.distanceLevel >= 100 &&
    profile.magicLevel >= 100 &&
    profile.defenseLevel >= 100
  );
}

export function getGoldLootCapPct(profile: PlayerCombatProfile): number {
  return hasOmniMastery100(profile) ? 50 : 35;
}

export function computeMatchmakingBracket(profile: PlayerCombatProfile) {
  const topAttackSkill = Math.max(
    profile.swordLevel,
    profile.clubLevel,
    profile.axeLevel,
    profile.distanceLevel,
    profile.magicLevel
  );
  const omniUnlocked = hasOmniMastery100(profile);
  const weaponMasteryWeight = profile.weaponMasteryPct * 0.25;
  const combatPowerIndex = Math.round(
    profile.generalLevel * 0.55 +
      topAttackSkill * 0.45 +
      profile.defenseLevel * 0.35 +
      weaponMasteryWeight +
      (omniUnlocked ? 35 : 0)
  );

  let bracketLabel = 'Bracket I · Novice Vanguard (Lv. 1-39 Band)';
  let queueParityNote =
    'Paired strictly against low-level Warriors & matched Weapon Mastery tiers (35% Gold Cap lobby).';

  if (omniUnlocked || combatPowerIndex >= 175) {
    bracketLabel = 'Bracket IV · Omni-Master Apex (50% Gold Cap Parity)';
    queueParityNote =
      'Matched exclusively against high-mastery Warriors with full Lv.100+ & 100% Weapon Mastery parity - zero mismatch vs newcomers.';
  } else if (combatPowerIndex >= 130 || profile.weaponMasteryPct >= 100) {
    bracketLabel = 'Bracket III · Mastered Citadel Tier (Equalized Mastery)';
    queueParityNote =
      'Any 100% Weapon Mastery (bought via Skin or organic) elevates MMR into Mastered lobbies where opponents also field max Weapon Mastery.';
  } else if (combatPowerIndex >= 85) {
    bracketLabel = 'Bracket II · Proven Challenger (Lv. 40-79 Band)';
    queueParityNote =
      'Balanced mid-tier Valdris lobby enforcing tight ±15 Combat Index variance and highest-squadmate anti-smurf anchoring.';
  }

  return {
    combatPowerIndex,
    bracketLabel,
    queueParityNote,
    goldCapParity: getGoldLootCapPct(profile),
  };
}

export const WARRIOR_ARCHETYPES: Record<WarriorArchetypeId, WarriorArchetypeSpec> = {
  'sword-warrior': {
    id: 'sword-warrior',
    title: 'Sword Warrior',
    spanishTitle: 'Edge & Riposte Specialist',
    dominantSkill: 'sword',
    description:
      'Warrior specialized in technical Parry duels, Riposte (1.60x), and rapid slashing combos.',
    recommendedLoot: 'Executioner Greatsword, Bastard Sword, Dual Daggers, and medium plate.',
  },
  'club-warrior': {
    id: 'club-warrior',
    title: 'Club Warrior',
    spanishTitle: 'Crushing Shock Juggernaut',
    dominantSkill: 'club',
    description:
      'Heavy blunt specialist built to shatter enemy guards, stagger squads, and crush heavy plating.',
    recommendedLoot: 'Ossuary War Mace, Siege Hammer, and heavy bastion cuirass.',
  },
  'axe-warrior': {
    id: 'axe-warrior',
    title: 'Axe Warrior',
    spanishTitle: 'Brutal Cleave Vanguard',
    dominantSkill: 'axe',
    description:
      'Raw-impact brawler prioritizing the highest base per-hit weapon attack and relentless melee pressure.',
    recommendedLoot: 'Abyssal Executioner Axe, Double Siege Axe, and reinforced greaves.',
  },
  archer: {
    id: 'archer',
    title: 'Archer',
    spanishTitle: 'Dual Hand-Crossbow Marksman',
    dominantSkill: 'distance',
    description:
      'Ranged Warrior wielding one rapid hand crossbow in each hand (1 per hand) for twin volleys, high agility, and elevation control.',
    recommendedLoot: 'Dual Voltaic Crossbows (1 per hand), twin runic bolts, and light brigandine.',
  },
  wizard: {
    id: 'wizard',
    title: 'Wizard',
    spanishTitle: 'Offensive Arcane Caster',
    dominantSkill: 'magic',
    description:
      'Warrior who channeled their mastery into destructive sorcery: high Magic Level and offensive Ether Seals.',
    recommendedLoot: 'Astral Ash Scepter, Cataclysm, Execution, and Storm Seals.',
  },
  druid: {
    id: 'druid',
    title: 'Druid',
    spanishTitle: 'Preservation & Ward Caster',
    dominantSkill: 'magic',
    description:
      'Warrior who directed Magic Level toward preservation, squad healing, Miasma cleansing, and defensive barriers.',
    recommendedLoot: 'Restoration, Aegis, and Bastion Seals alongside Purifying Elixirs.',
  },
};

export function getWarriorArchetype(profile: PlayerCombatProfile): WarriorArchetypeSpec {
  const entries: { key: CombatSkillKey; value: number }[] = [
    { key: 'sword', value: profile.swordLevel },
    { key: 'club', value: profile.clubLevel },
    { key: 'axe', value: profile.axeLevel },
    { key: 'distance', value: profile.distanceLevel },
    { key: 'magic', value: profile.magicLevel },
  ];

  entries.sort((a, b) => b.value - a.value);
  const top = entries[0].key;

  if (top === 'sword') return WARRIOR_ARCHETYPES['sword-warrior'];
  if (top === 'club') return WARRIOR_ARCHETYPES['club-warrior'];
  if (top === 'axe') return WARRIOR_ARCHETYPES['axe-warrior'];
  if (top === 'distance') return WARRIOR_ARCHETYPES.archer;

  return profile.supportSpellCasts > profile.offensiveSpellCasts
    ? WARRIOR_ARCHETYPES.druid
    : WARRIOR_ARCHETYPES.wizard;
}

export interface CombatSkillSpec {
  key: CombatSkillKey;
  label: string;
  archetypeLabel: string;
  weapons: string;
  lootPriority: string;
  scalingNote: string;
}

export const COMBAT_SKILLS: CombatSkillSpec[] = [
  {
    key: 'sword',
    label: 'Sword Level',
    archetypeLabel: 'Sword Warrior',
    weapons: 'Greatswords, Bastard Swords & Daggers',
    lootPriority: 'High-edge blades and medium/heavy armor built for Riposte.',
    scalingNote: 'Every sword swing earns Sword EXP and scales slashing damage.',
  },
  {
    key: 'club',
    label: 'Club Level',
    archetypeLabel: 'Club Warrior',
    weapons: 'Ossuary Maces & Siege Warhammers',
    lootPriority: 'Armor-crushing blunt weapons and heavy shock plating.',
    scalingNote: 'Every mace strike earns Club EXP and scales guard break power.',
  },
  {
    key: 'axe',
    label: 'Axe Level',
    archetypeLabel: 'Axe Warrior',
    weapons: 'Abyssal Executioner Axe & Double Siege Axe',
    lootPriority: 'Highest base Attack axes and vanguard armor pieces.',
    scalingNote: 'Every axe chop earns Axe EXP and scales raw cleave impact.',
  },
  {
    key: 'distance',
    label: 'Distance Level',
    archetypeLabel: 'Archer',
    weapons: 'Dual Hand Crossbows (1 crossbow per hand)',
    lootPriority: 'Matching pairs of Voltaic Crossbows, twin bolts, and mobility leather.',
    scalingNote: 'Every alternating twin-crossbow shot raises Distance EXP and ranged damage.',
  },
  {
    key: 'magic',
    label: 'Magic Level',
    archetypeLabel: 'Wizard / Druid',
    weapons: 'Astral Scepters, Runes & the 8 Ether Seals',
    lootPriority: 'Ash Scepters, offensive Seals (Wizard), or healing/barrier Seals (Druid).',
    scalingNote: 'Every spell cast increases Magic Level and scales all spell output.',
  },
];

export const UNIVERSAL_SLOTS = [
  {
    slot: 'Base Designation & Separate Mastery Axes',
    detail:
      'Every Warrior trains 3 isolated progression tracks: (1) Attack Type Level (Sword, Club, Axe, Distance, Magic), (2) Defense Level, and (3) Standalone Weapon Mastery (0%-100%), kept completely separate from Attack Type and Defense levels.',
  },
  {
    slot: 'Logical Gear Data Slots (Stats & Synergies Only)',
    detail:
      '2 Quick-Swap Weapons, 4 Armor Data Slots (Helm, Cuirass, Greaves, Boots), Shield/Off-hand, and 4 Vial Belt Slots strictly modify numerical Attack, Defense, Block %, Affixes, and Build Synergies - never altering your visible 3D mesh by default.',
  },
  {
    slot: 'Cosmetic Slots & Dual Weapon Mastery Unlock',
    detail:
      'All 90 Episode I skins live in independent Transmog Slots unrelated to gear stats. Buying a skin auto-masterizes its weapon to Max Weapon Attack inside the separate Weapon Mastery track (without altering Attack Type or Defense Level); earning that Weapon Mastery organically unlocks the weapon skin for free.',
  },
];

export type SealCategory = 'Control & Terrain' | 'Offensive' | 'Mobility & Survival';

export interface EtherSeal {
  id: string;
  name: string;
  alias: string;
  category: SealCategory;
  timing: string;
  etherCost: number;
  magicBase: number;
  magicScale: number;
  magicUnit: 'damage' | 'barrier' | 'healing' | 'control';
  effect: string;
}

export const ETHER_SEALS: EtherSeal[] = [
  {
    id: 'bastion',
    name: 'Seal of Bastion',
    alias: 'Ether Wall',
    category: 'Control & Terrain',
    timing: '8s duration',
    etherCost: 35,
    magicBase: 280,
    magicScale: 4.5,
    magicUnit: 'barrier',
    effect:
      'Raises a solid arcane crystal wall for 8 seconds to seal fortress gates, block bolts, isolate targets, or create open-field cover. Durability scales with Magic Level.',
  },
  {
    id: 'gravedad',
    name: 'Seal of Gravity',
    alias: 'Abyssal Anchor',
    category: 'Control & Terrain',
    timing: '6s duration',
    etherCost: 40,
    magicBase: 60,
    magicScale: 0.2,
    magicUnit: 'control',
    effect:
      'Projects a ground gravity well slowing enemies by 60%+ and locking out movement skills. Radius and residual damage scale with Magic Level.',
  },
  {
    id: 'ejecucion',
    name: 'Seal of Execution',
    alias: 'Shadow Lance',
    category: 'Offensive',
    timing: '18s CD',
    etherCost: 40,
    magicBase: 115,
    magicScale: 1.9,
    magicUnit: 'damage',
    effect:
      'Fires a concentrated dark-energy projectile scaled by Magic Level that pierces armor; ideal for finishing weakened targets in 1v1 duels.',
  },
  {
    id: 'cataclismo',
    name: 'Seal of Cataclysm',
    alias: 'Emberfall',
    category: 'Offensive',
    timing: '24s CD',
    etherCost: 45,
    magicBase: 98,
    magicScale: 1.65,
    magicUnit: 'damage',
    effect:
      'Calls down an area firestorm detonation scaled by Magic Level to break stacked squad formations and destroy wooden barricades.',
  },
  {
    id: 'tormenta',
    name: 'Seal of Storm',
    alias: 'Voltaic Chain',
    category: 'Offensive',
    timing: '20s CD',
    etherCost: 35,
    magicBase: 86,
    magicScale: 1.45,
    magicUnit: 'damage',
    effect:
      'Unleashes a lightning arc scaled by Magic Level that chains between up to 3 nearby enemies, punishing tightly grouped squads.',
  },
  {
    id: 'traslacion',
    name: 'Seal of Translation',
    alias: 'Spectral Step',
    category: 'Mobility & Survival',
    timing: '14s CD',
    etherCost: 25,
    magicBase: 8,
    magicScale: 0.04,
    magicUnit: 'control',
    effect:
      'Teleports the caster 8+ meters forward (bonus range from Magic Level) to blink across low battlements, grates, or behind a rival.',
  },
  {
    id: 'egida',
    name: 'Seal of Aegis',
    alias: 'Ether Shroud',
    category: 'Mobility & Survival',
    timing: '6s duration',
    etherCost: 30,
    magicBase: 320,
    magicScale: 4.8,
    magicUnit: 'barrier',
    effect:
      'Wraps the user in an arcane barrier for 6 seconds whose absorption pool scales with Magic Level, absorbing incoming hits by consuming Ether.',
  },
  {
    id: 'restauracion',
    name: 'Seal of Restoration',
    alias: 'Vital Pulse',
    category: 'Mobility & Survival',
    timing: '28s CD',
    etherCost: 55,
    magicBase: 165,
    magicScale: 2.8,
    magicUnit: 'healing',
    effect:
      'Converts a large Ether charge into an emergency burst heal scaled directly by Magic Level and General Level.',
  },
];

export interface PveTierSpec {
  id: string;
  tierLabel: string;
  difficulty: string;
  acts: string;
  enemies: string;
  chestMechanic: string;
  scalingErrante: string;
  scalingJuramento: string;
  pvpRisk: string;
  hpMultiplierMax: number;
  drops: {
    gris: number;
    verde: number;
    azul: number;
    morado: number;
    dorado: number;
  };
  guaranteedRule: string;
}

export const PVE_DIFFICULTY_TIERS: PveTierSpec[] = [
  {
    id: 'tier-1',
    tierLabel: 'Tier I',
    difficulty: 'Difficulty I - Low (Early Looting)',
    acts: 'Acts I-II',
    enemies: 'Valdris Marauders (Withered Mercenary 0.45x HP, Mire Leech 0.52x HP)',
    chestMechanic: 'Camp Stash & Patrol Pack (fast 1.5s unsealed looting).',
    scalingErrante: '1x HP (1-2 foes)',
    scalingJuramento: '1.4x HP (3-foe patrol)',
    pvpRisk: '25m (low audio footprint, no map ping)',
    hpMultiplierMax: 0.52,
    drops: { gris: 62, verde: 30, azul: 8, morado: 0, dorado: 0 },
    guaranteedRule: '1-2 starter gear pieces + 1 guaranteed Belt Vial.',
  },
  {
    id: 'tier-2',
    tierLabel: 'Tier II',
    difficulty: 'Difficulty II - Medium (Sealed Altar-Chest)',
    acts: 'Acts II-III',
    enemies: 'Spectral Guardians (Altar Sentinel 0.90x HP, Spires Watcher 0.75x HP)',
    chestMechanic: 'Chest remains invulnerable until both guardians fall; 3.0s unseal channel.',
    scalingErrante: '1x HP (2 guardians)',
    scalingJuramento: '1.75x HP (+1 Watcher)',
    pvpRisk: '70m (runic pillar of light visible on unseal)',
    hpMultiplierMax: 0.9,
    drops: { gris: 8, verde: 30, azul: 44, morado: 15, dorado: 3 },
    guaranteedRule: 'Altar-Chest guaranteed Astral Alchemy drop + 1 Ether Seal.',
  },
  {
    id: 'tier-3',
    tierLabel: 'Tier III',
    difficulty: 'Difficulty III - High (Catacomb Bosses)',
    acts: 'Acts II-IV',
    enemies: 'Horrors of the Nameless King (Ossuary Knight 1.80x HP, Catacomb Wyrm 2.20x HP)',
    chestMechanic: 'Boss drops the Ossuary Key to unlock the 3-chest vault (4.5s channel).',
    scalingErrante: '1x HP',
    scalingJuramento: '2.2x HP (enraged phase)',
    pvpRisk: '120m + Stairway Echo Ping',
    hpMultiplierMax: 2.2,
    drops: { gris: 0, verde: 5, azul: 32, morado: 49, dorado: 14 },
    guaranteedRule:
      'Minimum 1 Cursed Relic (Purple) + 14% base Gold Tier (35% cap -> 50% if all Attack, Magic & Defense ≥ Lv.100).',
  },
  {
    id: 'tier-4',
    tierLabel: 'Tier IV',
    difficulty: 'Difficulty IV - Extreme (Black Bell)',
    acts: 'Acts IV-V',
    enemies: 'Herald of The Abyssal Ash (Black Bell Executioner 3.00x HP)',
    chestMechanic:
      'Instant direct drop on killing blow; Gold Tier scales up to 35% base cap, rising to 50% at All Masteries Lv.100+.',
    scalingErrante: '1x HP',
    scalingJuramento: 'Duo 1.35x / Trio 1.75x / Quad 2.2x HP',
    pvpRisk: 'Global (permanent Citadel compass marker)',
    hpMultiplierMax: 3.0,
    drops: { gris: 0, verde: 0, azul: 0, morado: 78, dorado: 22 },
    guaranteedRule:
      'Guaranteed Cursed Relic + 22% base Gold Tier (35% cap -> 50% w/ All Attack, Magic & Defense Lv.100+) + Vials.',
  },
];

export interface BiomeSpec {
  id: string;
  name: string;
  location: string;
  threat: string;
  acts: string;
  description: string;
  tacticalNotes: string;
  image: string;
  caption: string;
  elevationProfile: string;
  ashClosureWindow: string;
  lootFocus: string;
  environmentalHazards: string[];
  nativeBeasts: string[];
  recommendedSpecializations: string[];
  recommendedSeals: string[];
}

export const BIOMES: BiomeSpec[] = [
  {
    id: 'ciudadela',
    name: 'The Citadel of Valdris',
    location: 'Continent Center',
    threat: 'Mass PvP Clashes & Tier IV',
    acts: 'Acts III, IV & V',
    description:
      'Three-tier fortress featuring battlements, drawbridges, inner courtyards, and linked basements; decisive stage of The Siege and The Judgment in the Throne Hall.',
    tacticalNotes:
      'Ether Wall seals portcullises and bridges; the toll of the Black Bell locks the final ring here.',
    image: GENERATED_ASSETS.siegeBridge,
    caption: 'The Citadel of Valdris - Battlements, drawbridges, and Throne Hall.',
    elevationProfile: '3 Vertical Fortress Tiers + Central Throne Hall Arena',
    ashClosureWindow: 'Safe Center through Act V (Throne Hall Sudden Death)',
    lootFocus: 'Tier III-IV Endgame Spoils · 35% Base -> 50% Omni-Mastery Gold Cap',
    environmentalHazards: [
      'Retracting Drawbridges & Narrow Rampart Chokepoints under crossbow fire',
      'Throne Hall Pillar Collapse & Tightening Abyssal Ash Ring in Act V',
      'Global Compass Beacon exposing squads engaging the Black Bell Executioner',
    ],
    nativeBeasts: ['Black Bell Executioner (Tier IV Boss)', 'Altar Sentinel (Courtyard Altars)'],
    recommendedSpecializations: ['Sword Warrior', 'Club Warrior', 'Wizard', 'Druid'],
    recommendedSeals: ['Seal of Bastion', 'Seal of Cataclysm', 'Seal of Restoration'],
  },
  {
    id: 'marismas',
    name: 'The Miasma Marshes',
    location: 'Western Flank',
    threat: 'Tier I Monsters & Toxic Pools',
    acts: 'Acts I-II',
    description:
      'Sunken hamlets linked by wooden catwalks above toxic waters; requires Purifying Elixirs or Astral Alchemy boots to cross safely without poison DoT.',
    tacticalNotes:
      'Ideal for quiet early looting (25m PvP noise radius) and choke-point ambushes on narrow walkways.',
    image: GENERATED_ASSETS.biomeMiasmaMarshes,
    caption: 'The Miasma Marshes - Sunken wooden catwalks over glowing toxic waters.',
    elevationProfile: 'Low-Lying Bog Basins & Elevated Timber Walkways',
    ashClosureWindow: 'Consumed by Abyssal Ash at end of Act II (9:00)',
    lootFocus: 'Tier I-II Stashes, Purifying Elixirs & Anti-Miasma Boots',
    environmentalHazards: [
      'Toxic Miasma Floodwaters inflicting scaling poison DoT without Purifying Elixir',
      'Rotting Catwalk Chokepoints forcing single-file crossings or blink escapes',
      'Dense Swamp Fog reducing mid-range visual spotting beyond 40m',
    ],
    nativeBeasts: ['Mire Leech (Tier I)', 'Withered Mercenary (Tier I)'],
    recommendedSpecializations: ['Druid', 'Axe Warrior', 'Club Warrior'],
    recommendedSeals: ['Seal of Restoration', 'Seal of Translation', 'Seal of Storm'],
  },
  {
    id: 'catacumbas',
    name: 'Catacombs of the Nameless King',
    location: 'Underneath Valdris',
    threat: 'Tier III Bosses & 120m Echo',
    acts: 'Acts II-IV (Sealed in Act IV)',
    description:
      'Torch-lit subterranean labyrinth housing Cursed Relics; forces squads to fight over the sole 3 escape stairways before the Abyssal Ash seals the depths.',
    tacticalNotes:
      'Slaying the Ossuary Knight or Wyrm awards the Ossuary Key for the 3-chest Vault (4.5s).',
    image: GENERATED_ASSETS.catacombsAltar,
    caption: 'Catacombs of the Nameless King - Subterranean vaults guarded by Tier III Horrors.',
    elevationProfile: 'Subterranean Crypt Chambers · 3 Sole Ascent Stairways',
    ashClosureWindow: 'Sealed Permanently at Act IV Black Bell (14:00)',
    lootFocus: 'Cursed Relics (Purple) & 14% Base Gold Tier (3-Chest Ossuary Vault)',
    environmentalHazards: [
      'Permanent Subterranean Lockout at 14:00 traps late-staying squads',
      '120m Stairway Echo Audio Ping broadcasts boss kills to Citadel patrols above',
      'Zero Escape Roofs: tight stone vaults amplify AoE Cataclysm & Gravity Wells',
    ],
    nativeBeasts: ['Ossuary Knight (Tier III Boss)', 'Catacomb Wyrm (Tier III Boss)'],
    recommendedSpecializations: ['Club Warrior', 'Sword Warrior', 'Axe Warrior', 'Wizard'],
    recommendedSeals: ['Seal of Gravity', 'Seal of Bastion', 'Seal of Execution'],
  },
  {
    id: 'bosque',
    name: 'The Forest of Spires',
    location: 'Eastern Flank',
    threat: 'Tier II Guardians & Verticality',
    acts: 'Acts I-III',
    description:
      'Colossal ancient trees laced with lookout platforms and suspension bridges - built for vertical ambushes with Dual Hand Crossbows (1 per hand) and Seal of Translation.',
    tacticalNotes:
      'Seal of Translation (8m+) chains leaps across tree canopies while Watchers guard Altar-Chests below.',
    image: GENERATED_ASSETS.biomeForestSpires,
    caption: 'The Forest of Spires - High treehouse platforms and swaying rope bridges.',
    elevationProfile: 'Multi-Tier Redwood Canopies, Rope Bridges & Forest Floor Altars',
    ashClosureWindow: 'Overrun by Abyssal Ash late in Act III (13:30)',
    lootFocus: 'Sealed Altar-Chests (Tier II Astral Alchemy) & Ether Seals',
    environmentalHazards: [
      'Extreme Fall Damage from high lookout decks and narrow suspension bridges',
      '70m Vertical Runic Light Pillars when unsealing Altar-Chests on the forest floor',
      '3D Ambush Angles from canopy snipers wielding Dual Hand Crossbows',
    ],
    nativeBeasts: ['Spires Watcher (Tier II)', 'Altar Sentinel (Tier II)', 'Withered Mercenary (Tier I)'],
    recommendedSpecializations: ['Archer', 'Sword Warrior', 'Wizard'],
    recommendedSeals: ['Seal of Translation', 'Seal of Aegis', 'Seal of Execution'],
  },
];

export const MATH_FORMULAS = [
  {
    title: 'Retroactive Damage Ledger EXP',
    formula: 'EXP_Awarded = Base_EXP * (%_Damage_Share) * ΔLevel_Factor * SameYear_Event_2x',
    note: 'ΔLevel Much Higher (+50 lv+): 1.50x-2.50x · Higher (+21 to +49): 1.20x-1.49x · Similar (-20 to +20): 1.00x · Lower (-21 or less): 0.15x-0.60x. Players who already won that current year Loot Event earn 2x EXP for that match across Monsters, Bosses & Players (resets each year with brand-new loot).',
  },
  {
    title: 'Universal Vitality (Warrior HP Curve)',
    formula: 'HP(Lv ≤ 8) = 150 + (Lv - 1) * 5   |   HP(Lv ≥ 9) = 185 + (Lv - 8) * 10',
    note: 'Lv. 1 = 150 HP · Lv. 8 = 185 HP · Lv. 100 = 1,105 HP · Lv. 200 = 2,105 HP · Lv. 300 = 3,105 HP.',
  },
  {
    title: 'Ether Resource Pool',
    formula: 'Max_Ether = 100 + 15 * (Lv - 1)',
    note: 'Scales linearly with effective level to sustain 3-Seal tactical spell rotations.',
  },
  {
    title: 'Weapon Damage by Attack Type, Separate Weapon Mastery & General Level',
    formula:
      'Net_Dmg = [(Weapon_Atk * (1 + Weapon_Mastery * 0.12)) * (1 + Attack_Type_Lv * 0.015) + General_Lv * 0.35] * Factor * 0.60 * (100 / (100 + Armor))',
    note: 'Attack_Type_Lv (Sword/Club/Axe/Distance) and Defense_Level are earned strictly in combat. Separate Weapon_Mastery (0.00-1.00) auto-maxes to 1.00 (Max Weapon Attack) on Skin purchase or unlocks the Weapon Skin for free at 100% organic completion.',
  },
  {
    title: 'Spell Output & Healing Power (Magic Level)',
    formula:
      'Spell_Power = [Spell_Base * (1 + Magic_Level * 0.018) + General_Lv * 0.45] * (100 / (100 + Armor))',
    note: 'All spells (Ether Seals, Runes, and Astral Scepters) scale directly with Magic Level and General Level.',
  },
  {
    title: 'Armor, Shield & Defense Level Mitigation',
    formula:
      'Effective_Armor = (Armor_Def + Shield_Def) * (1 + Defense_Level * 0.014)   |   Mitigation = Armor / (100 + Armor)',
    note: 'Every shield block or absorbed hit grants Defense EXP. Shields add active block reduction (25%-68%) boosted by Defense Level.',
  },
  {
    title: 'Vial Belt Recovery',
    formula: 'Total_Recovery = Vial_Base + (Lv * Vial_Multiplier)',
    note: '1.0s shared cooldown across Belt Vials with a 0.8s consumption channel.',
  },
  {
    title: 'Winning Squad Coronation Score (King / Captain / Colonel / Sergeant)',
    formula: 'Squad_Score = (Kills * 100) + (Assists * 45) + floor(Team_Healing_HP / 25)',
    note: 'Orders the winning squad: #1 is crowned King, #2 Captain, #3 Colonel, and Last/4th Sergeant. Assists & Team Healing Magic count alongside Kills.',
  },
  {
    title: 'Match EXP & Omni-Mastery Gold Loot Cap (35% → 50%)',
    formula:
      'Match_EXP = [(Kills * 140) + (Assists * 65) + (Healing / 15) + (Min * 20)] * (1 + Rank) * SameYear_Event_2x   |   Gold_Cap = 50% if All_Atk & Mag & Def >= 100 else 35%',
    note: 'Reaching Lv.100+ organically in ALL Attack Types (Sword, Club, Axe, Distance), Magic, and Defense elevates the Gold Tier drop cap from 35% to 50%. Every minute alive awards +20 EXP; already winning this year Loot Event grants 2x EXP for that match across Monsters, Bosses & Players (resets next year for brand-new annual loot).',
  },
  {
    title: 'Fair-Match Power Matchmaking (Zero Store Advantage)',
    formula:
      'MM_Index = 0.55*GenLv + 0.45*TopAtk + 0.35*DefLv + 0.25*WeaponMastery% + (Omni100 ? 35 : 0)   |   Oath Anchor = Max_Squad_MM',
    note: 'Matchmaking includes Weapon Mastery % & Omni-Lv.100 status. Buying a skin (100% Weapon Mastery) or reaching 50% Gold Cap places you vs. equally maxed opponents (±15 band, anti-smurf Oath Anchor).',
  },
];

export function computeDefenseStats(
  armorDef: number,
  shieldDef: number,
  defenseLevel: number,
  baseShieldBlockPct: number
) {
  const baseTotalDef = armorDef + shieldDef;
  const effectiveArmor = baseTotalDef * (1 + defenseLevel * 0.014);
  const mitigationPct = (effectiveArmor / (100 + effectiveArmor)) * 100;
  const shieldBlockPct = Math.min(80, baseShieldBlockPct + defenseLevel * 0.12);
  const combinedBlockedMitigationPct =
    100 - (100 - mitigationPct) * (1 - shieldBlockPct / 100);

  return {
    baseTotalDef,
    effectiveArmor,
    mitigationPct,
    shieldBlockPct,
    combinedBlockedMitigationPct,
  };
}

export interface BalanceRuneRow {
  name: string;
  tier: 'Tier S' | 'Tier A';
  reqLevel: string;
  scalingPerLv: string;
  valueLv100: string;
  costCd: string;
}

export const BALANCE_RUNES: BalanceRuneRow[] = [
  { name: 'Execution Rune', tier: 'Tier S', reqLevel: 'Lv. 40 / ML 35', scalingPerLv: '+0.77 / ML', valueLv100: '194 dmg', costCd: '40 Ether / 18s CD' },
  { name: 'Intense Healing Rune', tier: 'Tier S', reqLevel: 'Lv. 20 / ML 20', scalingPerLv: '+0.81 / ML', valueLv100: '216 heal', costCd: '30 Ether / 12s CD' },
  { name: 'Seal of Aegis', tier: 'Tier S', reqLevel: 'Lv. 50 / ML 40', scalingPerLv: '+3.20 / ML', valueLv100: '663 shield', costCd: '30 Ether / 26s CD' },
  { name: 'Seal of Translation', tier: 'Tier S', reqLevel: 'Lv. 1 / ML 1', scalingPerLv: '+0.01m / ML', valueLv100: '9.9m range', costCd: '25 Ether / 14s CD' },
  { name: 'Seal of Restoration', tier: 'Tier A', reqLevel: 'Lv. 60 / ML 45', scalingPerLv: '+2.20 / ML', valueLv100: '384 heal', costCd: '55 Ether / 28s CD' },
  { name: 'Cataclysm Rune', tier: 'Tier A', reqLevel: 'Lv. 35 / ML 30', scalingPerLv: '+0.63 / ML', valueLv100: '159 dmg', costCd: '45 Ether / 24s CD' },
  { name: 'Voltaic Rune', tier: 'Tier A', reqLevel: 'Lv. 25 / ML 25', scalingPerLv: '+0.55 / ML', valueLv100: '138 dmg', costCd: '35 Ether / 20s CD' },
  { name: 'Squad Regen Rune', tier: 'Tier A', reqLevel: 'Lv. 30 / ML 28', scalingPerLv: '+1.75 / ML', valueLv100: '401 heal', costCd: '45 Ether / 22s CD' },
  { name: 'Abyssal Rupture Seal', tier: 'Tier A', reqLevel: 'Lv. 45 / ML 35', scalingPerLv: '+0.40 / ML', valueLv100: '121 dmg', costCd: '30 Ether / 16s CD' },
];

export interface BalanceWeaponRow {
  id: string;
  name: string;
  skillType: CombatSkillKey;
  skillLabel: string;
  attackLevel: number;
  tier: 'Tier S' | 'Tier A' | 'Tier B' | 'Tier C';
  reqLevel: string;
  lightAttack: string;
  specialAttack: string;
  baseDamage: string;
}

export const BALANCE_WEAPONS: BalanceWeaponRow[] = [
  { id: 'hacha-abisal', name: 'Abyssal Executioner Axe', skillType: 'axe', skillLabel: 'Axe Level', attackLevel: 50, tier: 'Tier S', reqLevel: 'Lv. 42+', lightAttack: '1.04x / 1.02s', specialAttack: '1.45x / 5.2s (Cleave -20% Armor)', baseDamage: 'Atk 50 + Axe + Lv' },
  { id: 'mandoble-verdugo', name: 'Executioner Greatsword', skillType: 'sword', skillLabel: 'Sword Level', attackLevel: 48, tier: 'Tier S', reqLevel: 'Lv. 40+', lightAttack: '1.00x / 0.95s', specialAttack: '1.35x / 4.5s (Riposte 1.60x -35% Armor)', baseDamage: 'Atk 48 + Sword + Lv' },
  { id: 'maza-osaria', name: 'Ossuary War Mace', skillType: 'club', skillLabel: 'Club Level', attackLevel: 46, tier: 'Tier S', reqLevel: 'Lv. 38+', lightAttack: '0.96x / 0.90s', specialAttack: '1.40x / 5.0s (Guard Break -25% Armor)', baseDamage: 'Atk 46 + Club + Lv' },
  { id: 'ballesta-voltaica', name: 'Dual Voltaic Crossbows (1/hand)', skillType: 'distance', skillLabel: 'Distance Level', attackLevel: 42, tier: 'Tier S', reqLevel: 'Lv. 35+', lightAttack: '0.88x / 0.75s', specialAttack: '1.50x / 6s (Twin Burst -15% Spd)', baseDamage: 'Atk 42 + Distance + Lv' },
  { id: 'hacha-asedio', name: 'Double Siege Axe', skillType: 'axe', skillLabel: 'Axe Level', attackLevel: 41, tier: 'Tier A', reqLevel: 'Lv. 24+', lightAttack: '0.90x / 0.85s', specialAttack: '1.32x / 5.5s (Sweeping Arc)', baseDamage: 'Atk 41 + Axe + Lv' },
  { id: 'cetro-ceniza', name: 'Astral Ash Scepter', skillType: 'magic', skillLabel: 'Magic Level', attackLevel: 40, tier: 'Tier A', reqLevel: 'Lv. 25+', lightAttack: '0.78x / 0.80s', specialAttack: '1.20x / 8s (4m Arcane Knockback)', baseDamage: 'Atk 40 + Magic + Lv' },
  { id: 'martillo-asedio', name: 'Siege Warhammer', skillType: 'club', skillLabel: 'Club Level', attackLevel: 39, tier: 'Tier A', reqLevel: 'Lv. 20+', lightAttack: '0.85x / 0.85s', specialAttack: '1.28x / 6s (0.8s Stagger)', baseDamage: 'Atk 39 + Club + Lv' },
  { id: 'espada-bastarda', name: 'Bastard Sword & Shield', skillType: 'sword', skillLabel: 'Sword Level', attackLevel: 38, tier: 'Tier A', reqLevel: 'Lv. 15+', lightAttack: '0.82x / 0.65s', specialAttack: '1.15x / 5.5s (0.6s Stagger)', baseDamage: 'Atk 38 + Sword + Lv' },
  { id: 'dagas-catacumba', name: 'Dual Catacomb Daggers', skillType: 'sword', skillLabel: 'Sword Level', attackLevel: 34, tier: 'Tier B', reqLevel: 'Lv. 20+', lightAttack: '0.64x / 0.45s', specialAttack: '1.30x / 7s (+20% vs <35% HP)', baseDamage: 'Atk 34 + Sword + Lv' },
  { id: 'ballestas-rusticas', name: 'Dual Rustic Crossbows (1/hand)', skillType: 'distance', skillLabel: 'Distance Level', attackLevel: 22, tier: 'Tier C', reqLevel: 'Lv. 1+', lightAttack: '0.72x / 0.60s', specialAttack: '1.05x / 4s (Twin Bolt + 2s Bleed)', baseDamage: 'Atk 22 + Distance + Lv' },
];

export interface BalancePotionRow {
  name: string;
  tier: 'Tier S' | 'Tier A' | 'Tier B';
  reqLevel: string;
  scalingPerLv: string;
  effectLv100_200: string;
  useTiming: string;
}

export const BALANCE_POTIONS: BalancePotionRow[] = [
  { name: 'Master Crimson Elixir', tier: 'Tier S', reqLevel: 'Lv. 120', scalingPerLv: '+1.85 / lv', effectLv100_200: '405 / 590 HP', useTiming: '1.0s CD / 0.8s Cast' },
  { name: 'Anti-Miasma Purifying Elixir', tier: 'Tier S', reqLevel: 'Lv. 1', scalingPerLv: '+0.60 / lv', effectLv100_200: '200 / 260 HP (4s HoT)', useTiming: '1.0s CD / 0.8s Cast' },
  { name: 'Tempered Crimson Vial', tier: 'Tier A', reqLevel: 'Lv. 50', scalingPerLv: '+1.10 / lv', effectLv100_200: '250 / 360 HP', useTiming: '1.0s CD / 0.8s Cast' },
  { name: 'Concentrated Ether Vial', tier: 'Tier A', reqLevel: 'Lv. 1', scalingPerLv: '+1.25 / lv', effectLv100_200: '215 / 340 Ether', useTiming: '1.0s CD / 0.8s Cast' },
  { name: 'Starter Minor Crimson Vial', tier: 'Tier B', reqLevel: 'Lv. 1', scalingPerLv: '+0.50 / lv', effectLv100_200: '130 / 180 HP', useTiming: '1.0s CD / 0.8s Cast' },
];

export interface DecoupledPillarSpec {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  summary: string;
  bullets: string[];
}

export const DECOUPLED_SYSTEM_PILLARS: DecoupledPillarSpec[] = [
  {
    id: 'stats-vs-visuals',
    code: 'PILLAR A',
    title: 'Decoupled Modular Progression & 3 Separate Mastery Axes',
    subtitle: 'Stats vs. Visuals · Isolated Weapon Mastery vs. Attack Type & Defense',
    summary:
      'Valdris Chronicle: Last Relic (Episode I) decouples in-match Logical Gear Data from independent Cosmetic Slots (the 90 launch 3D skins) and isolates a dedicated Weapon Mastery track completely separate from Attack Type Level and Defense Level.',
    bullets: [
      'Logical Gear vs. Launch Skins: Equipped gear modifies numerical Attack, Defense, Block %, and affixes only - leaving your 3D mesh unchanged. The 90 3D designs serve independently as Episode I Launch Cosmetic Skins with zero stat binding.',
      'Separate Weapon Mastery Track: Every weapon features a standalone Weapon Mastery gauge strictly isolated from Attack Type Level (Sword/Club/Axe/Distance/Magic) and Defense Level.',
      'Dual Unlock Symmetry: Purchasing a weapon skin immediately masterizes that weapon\'s separate Weapon Mastery to 100% Max Weapon Attack (without modifying Attack Type or Defense Level); completing that Weapon Mastery organically unlocks the weapon\'s Cosmetic Skin for free.',
    ],
  },
  {
    id: 'technical-combat-integrity',
    code: 'PILLAR B',
    title: 'Technical Architecture & Tactical Combat Precision',
    subtitle: 'Visual Mesh Override vs. Invariant Hitboxes & Frame Data',
    summary:
      'To safeguard high-precision PvPvE duels across 200 concurrent Warriors in Unreal Engine 5, Skins alter client visuals only and Weapon Mastery remains strictly capped at each weapon\'s canonical organic ceiling.',
    bullets: [
      'Rendering-Only Overrides: Equipped skins swap only Modular Skeletal Mesh components, PBR material instances, textures, and non-intrusive GPU Niagara VFX trails.',
      'Locked Collision & Frame Data: Canonical Hitboxes, Hurtboxes, swing arc geometry, active Parry windows, Riposte recovery timings, and Dodge Invulnerability Frames (i-Frames) remain 100% invariant and server-authoritative.',
      'Bounded Parity & Fair-Match Matchmaking: Whenever a Skin auto-maxes Weapon Mastery to 100% (or a Warrior unlocks Omni-Lv.100\'s 50% Gold Cap), Server Matchmaking updates their Combat Power Index - pairing them strictly with equivalent-power opponents inside tight Lv_avg lobbies.',
    ],
  },
  {
    id: 'ethical-live-ops',
    code: 'PILLAR C',
    title: 'Ethical Monetization & Fair-Match Live-Ops',
    subtitle: 'Power-Weighted Lobby Parity + Direct Skin Storefront',
    summary:
      'True Zero Pay-to-Win requires Fair-Match Matchmaking: any purchased Skin granting 100% Separate Weapon Mastery immediately queues that Warrior into Mastered Brackets alongside equal-power organic players, while Attack Type, Defense Level, and Anti-Smurf squad anchoring protect every lobby.',
    bullets: [
      'Fair-Match Bracket Isolation: MM_Index weighs General Level, Attack/Defense Levels, active Weapon Mastery %, and Omni-Lv.100 50%-cap status - preventing maxed veterans or skin-mastered buyers from facing unmastered newcomers.',
      'Anti-Smurf Oath Squad Anchor: In Oath Mode (Duos/Trios/Quads), matchmaking anchors to the highest-rated squadmate so veterans cannot smurf into beginner lobbies.',
      'Protected Progression & Multi-Episode Scale: Attack Type Level, Defense Level, and the 50% Omni-Lv.100 Gold Cap remain strictly non-purchasable across Episode I and future Valdris Chronicle Episodes.',
    ],
  },
];

export const UE5_PILLARS = [
  {
    title: 'Replication Graph & Spatial Relevancy (50-80m)',
    detail:
      'High-frequency replication for parry frames, dual-crossbow bolts, and Ether Seals inside a 50-80m combat radius, conserving bandwidth across the rest of the 200-player map.',
  },
  {
    title: 'Fair-Match Server Authority & 3-Track Mastery Ledger',
    detail:
      'Server authority enforces power-weighted MM_Index lobby brackets (matching Weapon Mastery %, Attack Type, Defense Level & 35%/50% Gold Cap parity), anti-smurf Oath squad anchoring, Lv_avg + 100 PvE scaling, and Coronation.',
  },
  {
    title: 'Decoupled Cosmetic Mesh Swapping & Canonical Frame Data',
    detail:
      'Cosmetic Skins swap Modular Skeletal Meshes, PBR materials, textures, and non-intrusive Niagara VFX via independent Transmog Slots - while Hitboxes, Hurtboxes, Animation Timings, and Invulnerability Frames remain 100% locked and unaffected.',
  },
  {
    title: 'Multi-Layer Anti-Cheat Defense',
    detail:
      'Kernel-level memory/DLL injection shielding, server-side anti-ESP occlusion culling (hidden foes, bosses, and sealed chests never replicate without valid LOS), speed/dupe physics validation, and heuristic auto-parry (<80ms) & solo teaming telemetry.',
  },
];

export interface PitchShowcaseItem {
  label: string;
  sublabel: string;
  image: string;
  accentHex: string;
}

export interface PitchSlide {
  index: number;
  code: string;
  section: string;
  title: string;
  keyMessage: string;
  bullets: string[];
  image: string;
  showcaseTitle?: string;
  showcaseItems?: PitchShowcaseItem[];
}

export const PITCH_DECK_SLIDES: PitchSlide[] = [
  {
    index: 1,
    code: '01 / 14',
    section: 'Concept & Hook',
    title: 'The Last Relic - 200-Warrior Tactical PvPvE Battle Royale',
    keyMessage: '"200 Souls. 5 Acts. One Single Iron Crown."',
    bullets: [
      'Dark-fantasy Battle Royale built in Unreal Engine 5 uniting directional melee parry combat, dual-crossbow ballistics, and Ether magic.',
      'Two crisp game modes: Oath Mode (Duos, Trios & Quads united with shared victory) and Wanderer Mode (Solo 1 vs 199).',
      'Dynamic Warrior identity featuring 6 evolving specializations, 90 modular 3D sets, and fast 15-18 minute matches.',
    ],
    image: GENERATED_ASSETS.heroCitadel,
  },
  {
    index: 2,
    code: '02 / 14',
    section: 'Market Opportunity',
    title: 'Bridging High-Tempo Battle Royale & Tactical Action Combat',
    keyMessage: 'Capturing players underserved by modern military gunplay shooters.',
    bullets: [
      'Saturated firearm BR market leaves massive whitespace for a 200-player dark-medieval combat title with server-authoritative physical hitboxes.',
      'Decoupled Logical Gear vs. 90 Launch Skins + Separate Weapon Mastery: buying a skin maxes its isolated Weapon Mastery only (never Attack Type or Defense Level), while organic Weapon Mastery unlocks that skin for free.',
      'Ethical Live-Ops in Valdris Chronicle: Last Relic (Episode I) scales cleanly across future Episodes without selling Attack Type Level, Defense Level, or loot drop rates.',
    ],
    image: GENERATED_ASSETS.siegeBridge,
  },
  {
    index: 3,
    code: '03 / 14',
    section: 'Universe & Fantasy',
    title: 'The Cursed Continent of Valdris',
    keyMessage: 'A shattered realm devoured by The Abyssal Ash.',
    bullets: [
      'The Abyssal Ash serves as an escalating arcane storm ring funneling 200 Warriors from outer shores into the Citadel.',
      'Grounded UE5 dark-medieval aesthetic: ruined battlements, toxic Miasma swamps, canopy spires, and bone-lined catacombs.',
      'True egalitarian match start: every Warrior spawns in traveler rags and forges their legend up to The Iron Crown.',
    ],
    image: GENERATED_ASSETS.heroCitadel,
  },
  {
    index: 4,
    code: '04 / 14',
    section: 'Core 5-Act Match Loop',
    title: 'Tactical Match Lifecycle in 15-18 Minutes',
    keyMessage: 'Relentless pacing: early-game squad respawn giving way to Black Bell sudden death.',
    bullets: [
      'Acts I & II (Landfall & The Hunt): starter stashes, Sealed Altar-Chests, and 60s teammate respawn while 1+ ally stands.',
      'Act III (The Siege): multi-squad clashes across Citadel drawbridges, ramparts, and underground Catacomb vaults.',
      'Acts IV & V (Black Bell & Judgment): respawns lock off; surviving time awards continuous EXP and the winning squad crowns King (#1), Captain (#2), Colonel (#3), and Sergeant (Last) by Kills, Assists & Team Healing.',
    ],
    image: GENERATED_ASSETS.throneDuel,
  },
  {
    index: 5,
    code: '05 / 14',
    section: 'Pillar 1: Dynamic Warrior (6 Professions)',
    title: 'Warrior Identity: 6 Evolving Combat Specializations',
    keyMessage: 'Weapon hits train Weapon Mastery; spell casts raise Magic Level and define your role.',
    bullets: [
      '3 Melee Masteries: Sword Warrior (Parry/Riposte 1.60x), Club Warrior (armor-crushing maces), and Axe Warrior (highest raw cleave).',
      '1 Dual Ballistic Mastery: Archer wielding Dual Hand Crossbows (1 crossbow per hand) for alternating twin volleys and high mobility.',
      '2 Arcane Masteries via Magic Level: Wizard (offensive sorcery) and Druid (squad healing, Miasma cleansing, and barriers).',
    ],
    image: GENERATED_ASSETS.qualityLineup,
    showcaseTitle: '3D Visual Designs - All 6 Warrior Specializations',
    showcaseItems: [
      {
        label: 'Sword Warrior',
        sublabel: 'Greatsword + Kite Shield',
        image: '/src/assets/images/set_3d_sword_warrior_1794866044091.jpg',
        accentHex: '#3E82C7',
      },
      {
        label: 'Club Warrior',
        sublabel: 'War Mace + Tower Shield',
        image: '/src/assets/images/club_blue_astral_1794866767108.jpg',
        accentHex: '#3E82C7',
      },
      {
        label: 'Axe Warrior',
        sublabel: 'Double-Headed Axe',
        image: '/src/assets/images/blue_ember_berserker_1794866405825.jpg',
        accentHex: '#E06C5A',
      },
      {
        label: 'Archer (Dual)',
        sublabel: '1 Crossbow per Hand',
        image: '/src/assets/images/archer_blue_dual_1794866401810.jpg',
        accentHex: '#4F9E68',
      },
      {
        label: 'Wizard',
        sublabel: 'Astral Scepter + Orb (ML)',
        image: '/src/assets/images/set_3d_wizard_1794866046119.jpg',
        accentHex: '#9461C9',
      },
      {
        label: 'Druid',
        sublabel: 'Totem Staff + Sap (ML)',
        image: '/src/assets/images/set_3d_druid_1794866045747.jpg',
        accentHex: '#4F9E68',
      },
    ],
  },
  {
    index: 6,
    code: '06 / 14',
    section: 'Pillar 2: Decoupled Stats Data, Separate Mastery & 90 Launch Skins',
    title: 'Unrelated Logical Gear Sets, Launch Skins & Dual Weapon Mastery',
    keyMessage: '90 Launch Skins unlock organically via Weapon Mastery OR auto-max Weapon Mastery upon purchase.',
    bullets: [
      'Complete Visual/Logic Separation: equipping in-match gear alters numerical stats, affixes, and synergies only (never default 3D visuals), while 90 3D designs form Episode I\'s independent Launch Skins.',
      'Separate Weapon Mastery Track: isolated from Attack Type Level (Sword/Club/Axe/Distance/Magic) and Defense Level - preventing any bypass of core combat skill progression.',
      'Dual-Path Symmetry: buying a weapon skin auto-masterizes its Weapon Mastery to Max Weapon Attack immediately; earning that Weapon Mastery organically unlocks that weapon\'s skin for free.',
    ],
    image: GENERATED_ASSETS.relicLoot,
    showcaseTitle: 'Episode I Launch Cosmetic Skins (Unrelated to Logical Gear Stats)',
    showcaseItems: [
      {
        label: 'Tier 1 · Grey',
        sublabel: 'Rusted Forge (Skin Line)',
        image: '/src/assets/images/axe_common_gris_1794866767001.jpg',
        accentHex: '#8C929A',
      },
      {
        label: 'Tier 2 · Green',
        sublabel: 'Tempered Steel (Skin Line)',
        image: '/src/assets/images/design_green_hammer_1794866345927.jpg',
        accentHex: '#4F9E68',
      },
      {
        label: 'Tier 3 · Blue',
        sublabel: 'Astral Alchemy (Skin Line)',
        image: '/src/assets/images/blue_frost_knight_1794866405059.jpg',
        accentHex: '#3E82C7',
      },
      {
        label: 'Tier 4 · Purple',
        sublabel: 'Cursed Relic (Skin Line)',
        image: '/src/assets/images/archer_purple_dual_1794866401837.jpg',
        accentHex: '#9461C9',
      },
      {
        label: 'Tier 5 · Gold',
        sublabel: 'Royal Vestige (Skin Line)',
        image: '/src/assets/images/gold_titan_mace_1794866403815.jpg',
        accentHex: '#D4AF37',
      },
    ],
  },
  {
    index: 7,
    code: '07 / 14',
    section: 'Pillar 3: Defense Level, Armor & Shields',
    title: 'Real Armor Mitigation & Active Shield Blocking Math',
    keyMessage: 'Defense Level turns every defensive gear piece into measurable survivability.',
    bullets: [
      'Server formula: Effective_Armor = (Armor_Def + Shield_Def) * (1 + Defense_Level * 0.014) feeding continuous physical mitigation.',
      'Role-tailored shields: agile Bucklers, balanced Kite Shields, Tower Shields (up to 80% combined block), and Ether Orbs.',
      'Dedicated Defense perks: attacker freeze on block, 18% damage reflection, -45% Miasma mitigation, and crit protection.',
    ],
    image: GENERATED_ASSETS.catacombsAltar,
  },
  {
    index: 8,
    code: '08 / 14',
    section: 'Pillar 4: 8 Ether Seals & Magic Level',
    title: 'Magic Level Spell Scaling Across 3 Equippable Slots',
    keyMessage: 'Casting spells trains Magic Level and scales damage, barriers, and squad healing.',
    bullets: [
      'Every spell cast grants Magic EXP - naturally diverging high-magic Warriors into offensive Wizards or supportive Druids.',
      'Direct scaling formula: Spell_Power = [Base * (1 + Magic_Level * 0.018) + General_Lv * 0.45] across all 8 Ether Seals.',
      'Spatial control & outplay tools: Bastion (8s crystal wall), Gravity (60%+ slow well), and Translation (8m+ blink).',
    ],
    image: GENERATED_ASSETS.relicLoot,
  },
  {
    index: 9,
    code: '09 / 14',
    section: 'Pillar 5: PvPvE Ecosystem & Warrior HP Curve',
    title: '4 PvE Difficulty Tiers, Warrior HP Curve & 50% Omni-Mastery Gold Cap',
    keyMessage: 'Endgame relics scale Lv_avg + 100, and true Omni-Mastery Lv.100 elevates Gold drops to 50%.',
    bullets: [
      'Universal Warrior HP Curve: HP(Lv≤8) = 150 + (Lv-1)*5; HP(Lv≥9) = 185 + (Lv-8)*10 (Lv. 100 = 1,105 HP · Lv. 200 = 2,105 HP).',
      '4 dynamic PvE tiers up to Black Bell Executioner (3.00x HP): Gold Tier loot starts capped at 35% and unlocks up to 50% when all Attack Types, Magic & Defense reach Lv.100.',
      'Total Contribution EXP & Coronation: Kills, Assists, Squad Healing Magic (Druid/Wizard support), and Survival Time Alive all feed EXP and determine King / Captain / Colonel / Sergeant honors.',
    ],
    image: GENERATED_ASSETS.catacombsAltar,
  },
  {
    index: 10,
    code: '10 / 14',
    section: 'World Design & 4 Strategic Biomes',
    title: 'The Multi-Level Battlefield of Valdris',
    keyMessage: 'Four distinct environments engineered to reward every Warrior build.',
    bullets: [
      'The Citadel (Center): battlements, drawbridges, and the Throne Hall for mass squad sieges and final duels.',
      'The Miasma Marshes (West): toxic floodwaters rewarding Anti-Miasma defensive sets and Purifying Elixirs.',
      'The Catacombs (Underground): tight corridors favoring Sword/Club/Axe Warriors vs Tier III Horrors before Act IV sealing.',
      'The Forest of Spires (East): towering canopies ideal for Dual-Crossbow Archers (1 per hand) and Seal of Translation leaps.',
    ],
    image: GENERATED_ASSETS.biomesVista,
  },
  {
    index: 11,
    code: '11 / 14',
    section: 'UE5 Engineering, Hitbox Integrity & Anti-Cheat',
    title: 'Decoupled Skin Rendering & Server-Authoritative Combat Precision',
    keyMessage: 'Skins alter visual meshes, materials & VFX only - preserving exact Hitboxes, Timings & i-Frames.',
    bullets: [
      'Strict Render-Layer Isolation: Cosmetic Slots swap only Skeletal Meshes, PBR materials, textures, and non-intrusive Niagara VFX trails.',
      'Invariant Combat Frame Data: Canonical Hitboxes, Hurtboxes, swing arcs, active Parry windows, and Dodge i-Frames stay 100% locked for PvPvE integrity.',
      'Replication Graph (50-80m) + Multi-Layer Anti-Cheat: kernel protection, server anti-ESP occlusion culling, and <80ms auto-parry telemetry.',
    ],
    image: GENERATED_ASSETS.siegeBridge,
  },
  {
    index: 12,
    code: '12 / 14',
    section: 'Seasonal Live-Ops · Full-Season World Storms',
    title: 'Full-Season Storm & Lighting Cycle - Winter, Summer & Autumn',
    keyMessage: 'Each environment & storm transformation persists across the entire season (zero map rebuilds), hosting timed loot events inside.',
    bullets: [
      'Spring & Autumn - Toxic Miasma Gas (Full Seasons · Mar-May & Sep-Nov): Baseline emerald-violet creeping fog rolling from the Miasma Marshes across all of Spring & Autumn.',
      'Winter - Glacial Ice Storm (Entire Winter Season · Dec-Feb): Sub-zero blizzard, freezing vignettes & snow-dusted Citadel remain active all winter, hosting the 2-week Dark Santa loot event.',
      'Summer - Scorching Heat Storm (Entire Summer Season · Jun-Aug): Blistering heatwave, heat-haze post-processing & ember-ash storms span all of Summer, opening with a 1-week Solstice loot event.',
      'Studio & Publisher Advantage: Full-season visual freshness with modular UE5 Niagara VFX & shaders, paired with urgent timed cosmetic loot drops.',
    ],
    image: GENERATED_ASSETS.stormWinterBlizzard,
    showcaseTitle: 'Full-Season Storm & Atmosphere Environments (UE5 Presets)',
    showcaseItems: [
      {
        label: 'Spring & Autumn',
        sublabel: 'Toxic Miasma (Full Seasons)',
        image: GENERATED_ASSETS.stormMiasmaBaseline,
        accentHex: '#4F9E68',
      },
      {
        label: 'Winter Storm',
        sublabel: 'Glacial Ice (All Dec-Feb)',
        image: GENERATED_ASSETS.stormWinterBlizzard,
        accentHex: '#3E82C7',
      },
      {
        label: 'Summer Storm',
        sublabel: 'Scorching Heat (All Jun-Aug)',
        image: GENERATED_ASSETS.stormSummerHeat,
        accentHex: '#E06C5A',
      },
    ],
  },
  {
    index: 13,
    code: '13 / 14',
    section: "Limited-Time Loot Events · Halloween, Dark Santa & Reactive Skins",
    title: "Limited-Time Holiday Loot Rituals (1-2 Weeks) & Reactive Skins",
    keyMessage: 'Always-Open 24/7 Queue + 1 Attempt Every 24h runs strictly during marked loot dates inside each full-season storm world.',
    bullets: [
      'Halloween - Wish or Threat (1 Week · Oct 25 - Nov 1 · 1 Entry / 24h): Pick WISH (Spectral Harvester Plate / Hollow Executioner Cloak) or THREAT (curse + Cursed VFX; loss locks 24h).',
      "Midwinter - Dark Santa's Wish (2 Weeks · Dec 24 - Jan 7 · 1 Entry / 24h): Lock a Gold-Tier set via Wish UI inside the winter storm and defeat Dark Santa (24h loss cooldown).",
      'Summer Solstice - Solar-Ash (1 Week · Jun 21 - Jun 28): Summer kickoff inside Scorching Heat Storm; Solar Eclipse Altars unlock climate-reactive skins.',
      'Same-Year Replay Bonus (2x Match EXP): Already won this year? Re-entering grants 2x EXP for that match (Monsters, Bosses & Players) - resets next year with brand-new loot.',
    ],
    image: GENERATED_ASSETS.eventHalloweenValdris,
    showcaseTitle: 'Limited-Time Loot Arenas & Climate-Reactive Event Skins',
    showcaseItems: [
      {
        label: 'Halloween Event',
        sublabel: 'Night of the Hollow Bell',
        image: GENERATED_ASSETS.eventHalloweenValdris,
        accentHex: '#9461C9',
      },
      {
        label: 'Winter Holiday',
        sublabel: "Dark Santa's Wish Blizzard",
        image: GENERATED_ASSETS.stormWinterBlizzard,
        accentHex: '#3E82C7',
      },
      {
        label: 'Summer Solstice',
        sublabel: 'Solar-Ash Reckoning',
        image: GENERATED_ASSETS.stormSummerHeat,
        accentHex: '#E06C5A',
      },
      {
        label: 'Hollow Lantern',
        sublabel: 'Halloween Miasma Skin',
        image: GENERATED_ASSETS.skinHalloweenWarden,
        accentHex: '#9461C9',
      },
      {
        label: 'Dark Santa Set',
        sublabel: 'Winter Frost-Reactive Skin',
        image: GENERATED_ASSETS.skinDarkSantaFrost,
        accentHex: '#3E82C7',
      },
      {
        label: 'Solar-Ash Set',
        sublabel: 'Summer Ember Dual Xbows',
        image: GENERATED_ASSETS.skinSummerAshSolstice,
        accentHex: '#C89B3C',
      },
    ],
  },
  {
    index: 14,
    code: '14 / 14',
    section: 'Live-Ops Monetization, Fair Matchmaking & Episode Scale',
    title: 'Valdris Chronicle: Last Relic (Episode I) - Fair-Match Ethical Economy',
    keyMessage: 'Power-weighted Matchmaking guarantees every 200-player lobby stays 100% Fair Match.',
    bullets: [
      'Fair-Match Bracket Parity: Separate Weapon Mastery % (whether purchased via Skin or organic) and Omni-Lv.100 50% Loot status are weighted in MM_Index - zero unfair power mismatch inside any lobby.',
      'Anti-Smurf Squad Anchor: Oath Mode queues anchor to the highest squadmate rating so maxed veterans & buyers match strictly against equivalent rivals.',
      'Multi-Episode Scalability: Attack Type Level, Defense Level & 50% Gold Cap stay strictly combat-earned while direct Skins & Holiday Events scale cleanly across future Episodes.',
    ],
    image: GENERATED_ASSETS.throneDuel,
  },
];

export interface BestiaryCreature {
  id: string;
  name: string;
  title: string;
  tierLabel: 'Tier I' | 'Tier II' | 'Tier III' | 'Tier IV';
  tierHex: string;
  difficulty: string;
  acts: string;
  biomeIds: string[];
  biomeLabel: string;
  hpMultiplier: number;
  baseExpReward: number;
  pvpAlertRadius: string;
  image: string;
  lore: string;
  combatBehavior: string[];
  counterplayTip: string;
  weakness: string;
  guaranteedDrops: string;
}

export const BESTIARY_CREATURES: BestiaryCreature[] = [
  {
    id: 'withered-mercenary',
    name: 'Withered Mercenary',
    title: 'Hollow Footman of the Broken Oath',
    tierLabel: 'Tier I',
    tierHex: '#8C929A',
    difficulty: 'Low · Early Looting',
    acts: 'Acts I-II',
    biomeIds: ['marismas', 'bosque'],
    biomeLabel: 'Outer Coasts, Forest Edges & Roadside Camps',
    hpMultiplier: 0.45,
    baseExpReward: 180,
    pvpAlertRadius: '25m Low Audio',
    image: '/src/assets/images/beast_withered_mercenary_1794869217917.jpg',
    lore: 'Former levies of Valdris consumed by The Abyssal Ash, condemned to patrol ruined roadside camps clutching rusted blades long after their minds turned to cinder.',
    combatBehavior: [
      'Telegraphed 2-hit rusted sword slash with generous Parry window.',
      'Patrols in packs of 1-2 (Wanderer Mode) or 3 (Oath Mode) near Camp Stashes.',
      'Drops aggro beyond 30m, making stealth disengagement easy.',
    ],
    counterplayTip: 'Trigger a crisp Parry on the overhead swing for an instant 1.60x Riposte execution and fast Sword/Club/Axe Mastery XP.',
    weakness: 'Physical Cleave & Fire Embers',
    guaranteedDrops: '1-2 Starter Grey/Green pieces + 1 guaranteed Belt Vial (62% Grey / 30% Green / 8% Blue).',
  },
  {
    id: 'mire-leech',
    name: 'Mire Leech',
    title: 'Armored Toxic Bog Predator',
    tierLabel: 'Tier I',
    tierHex: '#4F9E68',
    difficulty: 'Low · Marsh Ambush',
    acts: 'Acts I-II',
    biomeIds: ['marismas'],
    biomeLabel: 'The Miasma Marshes (Western Flank)',
    hpMultiplier: 0.52,
    baseExpReward: 220,
    pvpAlertRadius: '25m Marsh Splash',
    image: '/src/assets/images/beast_mire_leech_1794869219069.jpg',
    lore: 'Bloated chitinous parasites mutated inside sunken marsh cesspools. Their translucent sacs pulse with concentrated Miasma bile capable of rotting untreated boots.',
    combatBehavior: [
      'Spits short-range Miasma bile globules across wooden catwalks.',
      'Latches onto Warriors standing in shallow bog water to drain Stamina.',
      'Ruptures on death into a 2m toxic puddle lasting 3 seconds.',
    ],
    counterplayTip: 'Kite along elevated timber catwalks with Dual Hand Crossbows or cleanse stacks using Purifying Elixirs.',
    weakness: 'Distance Piercing & Voltaic Shock',
    guaranteedDrops: 'Guaranteed Anti-Miasma Purifying Vial + Common/Tempered Marsh gear.',
  },
  {
    id: 'altar-sentinel',
    name: 'Altar Sentinel',
    title: 'Astral Bound Reliquary Warden',
    tierLabel: 'Tier II',
    tierHex: '#3E82C7',
    difficulty: 'Medium · Sealed Altar-Chest',
    acts: 'Acts II-III',
    biomeIds: ['bosque', 'ciudadela'],
    biomeLabel: 'Forest Floor Altars & Citadel Courtyards',
    hpMultiplier: 0.9,
    baseExpReward: 480,
    pvpAlertRadius: '70m Runic Light Pillar',
    image: '/src/assets/images/beast_altar_sentinel_1794869218763.jpg',
    lore: 'Hollow bronze-and-stone effigies animated by ancient royal wards. Until every Sentinel bound to a Sealed Altar-Chest falls, the reliquary lid remains utterly impervious to steel.',
    combatBehavior: [
      'Sweeps a rune-etched halberd in wide 180-degree arcs that punish clustered melee fighters.',
      'Projects an Astral shockwave slam requiring a dodge roll or Seal of Translation.',
      'Breaking the Altar seal afterward triggers a 70m vertical sky beacon for 3.0s.',
    ],
    counterplayTip: 'Have one Club Warrior shatter its poise while ranged Dual-Crossbow Archers or Wizards focus its glowing chest runes.',
    weakness: 'Blunt Crushing (Club Mastery) & Frost',
    guaranteedDrops: 'Unlocks Sealed Altar-Chest: guaranteed Astral Alchemy (Blue) item + 1 Ether Seal + 3% Gold.',
  },
  {
    id: 'spires-watcher',
    name: 'Spires Watcher',
    title: 'Canopy & Bark Ambush Stalker',
    tierLabel: 'Tier II',
    tierHex: '#4F9E68',
    difficulty: 'Medium · Canopy Pursuit',
    acts: 'Acts I-III',
    biomeIds: ['bosque'],
    biomeLabel: 'The Forest of Spires (Eastern Flank)',
    hpMultiplier: 0.75,
    baseExpReward: 410,
    pvpAlertRadius: '55m Canopy Screech',
    image: '/src/assets/images/beast_spires_watcher_1794869230946.jpg',
    lore: 'Twisted woodland horrors woven from iron-hard bark, moss, and stag bone. They crouch motionless along ancient trunks before pouncing across suspension bridges.',
    combatBehavior: [
      'Leaps rapidly between tree roots and low lookout decks to flank ranged Archers.',
      'Inflicts Bleed DoT on talon flurries if unblocked by a shield or Parry.',
      'Camouflages partially inside deep forest fog when idle.',
    ],
    counterplayTip: 'Pin Watchers down with Seal of Gravity when they lunge, or use high-block Kite/Tower Shields to absorb leap strikes.',
    weakness: 'Fire / Embers & Slashing Greatswords',
    guaranteedDrops: 'Tempered Steel & Astral Alchemy drops + Stamina/Vitality Belt Vials.',
  },
  {
    id: 'ossuary-knight',
    name: 'Ossuary Knight',
    title: 'Undead Sovereign of the Bone Vaults',
    tierLabel: 'Tier III',
    tierHex: '#9461C9',
    difficulty: 'High · Catacomb Boss',
    acts: 'Acts II-IV',
    biomeIds: ['catacumbas'],
    biomeLabel: 'Catacombs of the Nameless King',
    hpMultiplier: 1.8,
    baseExpReward: 1150,
    pvpAlertRadius: '120m + Stairway Echo Ping',
    image: '/src/assets/images/beast_ossuary_knight_1794869230733.jpg',
    lore: 'Forged from the fused skulls and cursed obsidian armor of the Nameless King\'s honor guard. It guards the Ossuary Key deep below Valdris until the Black Bell seals the crypts.',
    combatBehavior: [
      'Performs delayed overhead greatsword slams that bait premature Parries.',
      'Enrages at 40% HP in Oath Mode (2.2x HP scaling), radiating cursed purple Shockwaves.',
      'Requires disciplined stamina management in tight torch-lit corridors.',
    ],
    counterplayTip: 'Bait the triple combo inside wide crypt junctions; drop Seal of Bastion to seal side tunnels against third-party PvP squads.',
    weakness: 'Armor-Piercing Riposte & Guard Break (-25% Armor)',
    guaranteedDrops: 'Drops Ossuary Key (unlocks 3-chest Vault: 49% Purple, 14% base Gold -> 35% base cap / 50% w/ Omni-Lv.100).',
  },
  {
    id: 'catacomb-wyrm',
    name: 'Catacomb Wyrm',
    title: 'Blind Bone-Plated Crypt Serpent',
    tierLabel: 'Tier III',
    tierHex: '#9461C9',
    difficulty: 'High · Catacomb Vault Boss',
    acts: 'Acts II-IV',
    biomeIds: ['catacumbas'],
    biomeLabel: 'Subterranean Vaults beneath The Citadel',
    hpMultiplier: 2.2,
    baseExpReward: 1400,
    pvpAlertRadius: '120m Subterranean Roar',
    image: '/src/assets/images/beast_catacomb_wyrm_1794869231411.jpg',
    lore: 'A colossal sightless drake armored in calcified bone scales cracked with violet Abyssal fire. Guided purely by footsteps echoing across crypt flagstones.',
    combatBehavior: [
      'Burrows beneath loose crypt rubble and erupts toward the loudest sprinting target.',
      'Sweeps tail across tight stone bridges, knocking unprepared Warriors off ledges.',
      'Breathes a cone of Cursed Ash that drains both HP and Ether.',
    ],
    counterplayTip: 'Focus heavy maces or spells along the glowing violet spine fissures; watch the 14:00 Act IV timer so the 3 escape stairs do not seal behind you.',
    weakness: 'Exposed Violet Spine Fissures & Magic Burst',
    guaranteedDrops: 'Minimum 1 Cursed Relic (Purple) + Ossuary Vault Key + Master Crimson Elixir.',
  },
  {
    id: 'black-bell-executioner',
    name: 'Black Bell Executioner',
    title: 'Herald of The Abyssal Ash (Final Raid Boss)',
    tierLabel: 'Tier IV',
    tierHex: '#D4AF37',
    difficulty: 'Extreme · Act IV-V World Boss',
    acts: 'Acts IV-V',
    biomeIds: ['ciudadela'],
    biomeLabel: 'The Citadel of Valdris (Central Courtyard)',
    hpMultiplier: 3.0,
    baseExpReward: 2600,
    pvpAlertRadius: 'Global Citadel Compass Marker',
    image: '/src/assets/images/beast_ash_herald_1794869232687.jpg',
    lore: 'When the Black Bell tolls at 14:00, all respawns cease and this charred juggernaut steps from the ash storm. Wielding a bell-forged greataxe cracked with molten gold, it judges the final 16 survivors.',
    combatBehavior: [
      'Scales dynamically by lobby average (Lv_avg + 100) and squad size (Duo 1.35x / Trio 1.75x / Quad 2.2x HP).',
      'Strikes the war-bell axe into the flagstones to unleash a 15m seismic gold shockwave.',
      'Executes massive cleave sweeps - high risk, massive reward while rival squads close in for the Throne Hall.',
    ],
    counterplayTip: 'Assign a high-Defense Club/Sword tank with a Tower Shield & Seal of Aegis while Druid supports with Seal of Restoration (+Team Healing EXP) and Wizards cast from ramparts.',
    weakness: 'Coordinated Squad Focus & Mastery +15%/+30% PvE Bonus',
    guaranteedDrops: 'Direct Spoils on Kill: 1+ Cursed Relic + 22% Base Gold Tier (35% cap -> 50% w/ Omni-Lv.100 Mastery) + Master Elixirs.',
  },
];

export const STUDIO_IDENTITY = {
  studioName: 'Dimpz Games',
  franchiseTitle: 'Valdris Chronicle: Last Relic (Episode I)',
  githubUrl: 'https://github.com/Orb-lite/Game-Design-document',
  contactEmail: 'isaacgestrada94@gmail.com',
  phone: '+523318359421',
  phoneDisplay: '+52 33 1835 9421',
} as const;

export const CO_PITCHING_ALLIANCE = {
  eyebrow: 'Commercial Packaging · Publisher Co-Pitching Blueprint',
  title: 'Co-Pitching & Studio Alliance Model',
  lead: 'Engineered as a publisher-ready commercial package rather than an unverified megaproject. Phase 1 isolates a high-impact 10-15 minute Vertical Slice so partner art studios capture an 18-24 month funded production contract with zero upfront cash outlay.',
  executiveMetrics: [
    { label: 'Phase 1 Studio Window', value: '2-3 Months (In-Kind Art)' },
    { label: 'Target Publisher Deal', value: '18-24 Mo Funded Production' },
    { label: 'Vertical Slice Cut', value: '10-15 Min Playable Demo' },
    { label: 'Milestone Status', value: 'UE5 Combat Loop Active' },
  ],
  divisionOfLabor: [
    {
      role: 'Creator & Technical Lead Contribution (Phase 1)',
      badge: '$0 Upfront Studio Cost',
      accent: 'gold' as const,
      summary:
        'Core UE5 gameplay engineering, scalable multiplayer foundation, deterministic combat/loot math, and full publisher documentation delivered at zero upfront studio cost.',
      items: [
        'Core Gameplay & Combat Programming: Directional melee, tight Parry/Riposte windows, Dual Hand Crossbows, hit-stop, and responsive enemy/boss AI.',
        'Scalable Multiplayer Foundation: Server-authoritative combat architecture in UE5 built for small-squad co-op / PvP testing in Phase 1, designed to scale up to large-scale modes (Siege & 200-player Battle Royale via Replication Graph) during full production.',
        'Systems & Commercial Documentation: Deterministic combat/loot math, decoupled Gear/Skin economy, Full GDD, and Publisher Pitch Deck.',
      ],
    },
    {
      role: 'Art & Co-Development Studio Contribution',
      badge: 'In-Kind Investment (Phase 1)',
      accent: 'emerald' as const,
      summary:
        'Focused 2-3 month visual execution solely on the locked Vertical Slice scope - never speculative full-map Battle Royale assets.',
      items: [
        'Cohesive Dark Medieval Fantasy Art Direction, shaders, and lighting mood.',
        '1 complete playable Vertical Slice environment taken from graybox blockout to final PBR art.',
        '2-3 fully modeled, rigged, and animated characters/enemies + production UI/UX HUD pass + 60-90s Publisher Pitch Trailer.',
      ],
    },
  ],
  studioValueReturn: {
    headline: 'Why Investing 2-3 Months Locks In an 18-24 Month Production Contract',
    summary:
      'Once the Vertical Slice closes publisher financing, the partner studio transitions immediately from co-pitching partner into the Official Full-Production Vendor - eliminating speculative business risk.',
    pillars: [
      {
        title: 'Official Commercial Production Vendor',
        detail:
          'The studio bills its standard commercial production rates directly out of the publisher\'s funded development budget for the full 18-24 month roadmap.',
      },
      {
        title: 'Revenue Share or IP Co-Ownership',
        detail:
          'In addition to commercial production fees, the founding art partner secures a negotiated Rev-Share percentage or co-ownership stake in the Valdris Chronicle IP.',
      },
      {
        title: 'Asymmetric Studio ROI',
        detail:
          'Risking 2-3 months of focused Vertical Slice art to lock in 18-24 months of guaranteed publisher cashflow plus long-term live-ops upside.',
      },
    ],
  },
  verticalSliceScope: {
    title: 'Strict Vertical Slice Scope Cut (10-15 Minute Publisher Demo)',
    rationale:
      'Requesting Day-1 art for a 200-player Battle Royale island triggers immediate cost rejection. Phase 1 strictly isolates the core combat loop into a razor-sharp 10-15 minute showcase:',
    pillars: [
      {
        slot: '1 Environment',
        name: 'Catacombs of the Nameless King',
        detail:
          'Single high-contrast torchlit crypt arena & vault junction - compact enough for AAA lighting polish within 6-8 weeks.',
      },
      {
        slot: '2 Combat Styles',
        name: 'Sword & Shield vs. Dual Hand Crossbows',
        detail:
          'Proves both tactical close-quarters Parry/Riposte + Shield Block and high-mobility ranged Dual Crossbow (1 per hand) + Ether Seal spacing.',
      },
      {
        slot: '1 Signature Boss',
        name: 'Black Bell Executioner',
        detail:
          'Full boss encounter with clear attack telegraphs, poise break windows, and climax reward drop to close the 10-15 minute publisher demo.',
      },
    ],
  },
  testingRoadmap: {
    title: 'Testing & Scaling Roadmap',
    subtitle: 'Disciplined technical validation across controlled milestones before scaling full concurrency:',
    milestones: [
      {
        phase: 'Milestone 0',
        status: 'Current / Pre-Studio',
        detail:
          'Single-player / local graybox combat prototype proving core game feel (Catacombs arena + Black Bell Executioner mechanics).',
      },
      {
        phase: 'Milestone 1',
        status: 'Phase 1 - Vertical Slice (2-3 Mo)',
        detail:
          'Full visual polish with partner studio + small-scale multiplayer stress testing (2-4 player Co-op / PvP) to validate netcode responsiveness for the Publisher Pitch.',
      },
      {
        phase: 'Milestone 2',
        status: 'Full Production - Publisher Funded',
        detail:
          'Progressive scaling of lobby concurrency, Replication Graph optimization, dedicated server infrastructure, and rollout of large-scale modes (Siege Battles & 200-player Battle Royale) toward final build.',
      },
    ],
  },
  currentTechnicalStatus: {
    title: 'Current Technical Status (Playable Prototype)',
    summary:
      'Validated UE5 engineering core testing combat attacks, inventory loot, and set data before studio visual production:',
    previewTag: 'UE5 Standalone Preview (NetMode: Standalone | 64-bit Windows)',
    previewTitle: 'Gameplay Mechanics Testbed - Not Final UI, Art, or Biome',
    previewDisclaimer:
      'Early engineering preview only: this build does NOT represent the final UI, final character/environment art, or final biome. It runs strictly to test combat attacks, inventory loot pickups, and live equipment set data.',
    testScopeTags: ['Attack & Hit Detection', 'Inventory Loot Drops', 'Set Data & Stat Bindings'],
    points: [
      {
        label: 'Active Testbed Scope (Video Preview)',
        detail:
          'Demonstrates working combat attacks, inventory loot pickups, and equipment set data bindings using temporary placeholder UI, art, and test terrain.',
      },
      {
        label: 'Core Combat Loop Functional',
        detail:
          'Directional melee, Parry/Riposte timing, Dual Crossbow spacing, and base boss AI behaviors are implemented in UE5.',
      },
      {
        label: 'Iterative Netcode Approach',
        detail:
          'Built on a clean server-authoritative foundation tested periodically in controlled builds before scaling concurrency in full production.',
      },
    ],
  },
} as const;

export const SEASONAL_LIVE_OPS = {
  eyebrow: 'Seasonal Live-Ops & Holiday Events',
  title: 'Full-Season Storm Worlds, Timed Loot Events & Reactive Skins',
  lead: 'Valdris Chronicle cleanly separates Full-Season Environmental Storms (transforming lighting, skybox & hazards across the entire Winter, Summer, or Spring/Autumn season with zero map rebuilds) from Limited-Time Holiday Loot Events (running strictly 1-2 weeks on marked dates):',
  cadenceRule: [
    {
      layer: 'Full-Season World Scenarios',
      duration: 'Entire Astronomical Season (3 Months)',
      detail:
        'Glacial Ice Storm spans all Winter (Dec-Feb), Scorching Heat Storm spans all Summer (Jun-Aug), and Toxic Miasma Gas spans all Spring & Autumn.',
    },
    {
      layer: 'Limited-Time Holiday Loot Events',
      duration: 'Strict Marked Dates Only (1-2 Weeks)',
      detail:
        'Exclusive Gold-Tier loot contracts & Wish/Threat rituals run only during marked windows: Halloween (1w: Oct 25-Nov 1), Dark Santa (2w: Dec 24-Jan 7), & Summer Kickoff (1w: Jun 21-28).',
    },
  ],
  eventQueueLineup: {
    title: 'Limited-Time Loot Lineup: 1 Attempt Every 24 Hours (Zero Pay-to-Win)',
    lead: 'While each seasonal weather scenario lasts the entire quarter, these marquee Loot Events open exclusively during their marked calendar dates on an Always-Open 24/7 Queue with a strict 1-Entry-Per-24h Personal Cooldown:',
    queueMetrics: [
      { label: 'Matchmaking Queue', value: 'Always-Open 24/7' },
      { label: 'Entry Cadence', value: '1 Attempt / 24h' },
      { label: 'Loot Event Windows', value: '1w-2w Marked Dates' },
      { label: 'Same-Year Replay', value: '2x Whole-Match EXP' },
    ],
    veteranBonus: {
      badge: 'Same-Year Replay Bonus · Resets Annually',
      title: 'Already Won This Year? Earn 2x Whole-Match EXP',
      multiplier: '2x EXP for That Match (Monsters, Bosses & Players)',
      rule: 'If you already won that specific Loot Event earlier in the same year, playing it again grants 2x EXP only for that match across Monsters, Bosses, and Players. Every following year resets completion and launches brand-new designed loot rewards, letting everyone win the new annual cosmetics fresh.',
    },
    halloween: {
      title: 'Halloween - Wish or Threat',
      durationLabel: 'Loot Event Window · 1 Week Only (Oct 25 - Nov 1)',
      prompt: 'Before entering their daily run, the UI forces a risk-reward choice:',
      targetSets: ['Spectral Harvester Plate', 'Hollow Executioner Cloak'],
      curses: [
        'Cursed Blood-Fog Visibility Reduction',
        'Disabled Minimap & Compass Radar',
        'Enraged World Boss Scaling',
        'Map-Wide Public Bounty Mark',
      ],
      wish: {
        label: 'WISH',
        summary:
          'Pick your target Halloween Gold-Tier cosmetic set (e.g., Spectral Harvester Plate or Hollow Executioner Cloak) and fight under standard rules to claim it on victory.',
      },
      threat: {
        label: 'THREAT',
        summary:
          'Voluntarily accept a match-wide curse (such as cursed blood-fog, disabled radar, enraged World Boss, or public bounty mark). Triumphing under Threat awards the chosen Gold-Tier set plus an exclusive Cursed VFX / Ether Seal variant - while defeat locks the player out for 24 hours.',
      },
    },
    midwinter: {
      title: "Midwinter - Dark Santa's Wish",
      durationLabel: 'Loot Event Window · 2 Weeks Only (Dec 24 - Jan 7)',
      summary:
        'Players lock in their desired Gold-Tier cosmetic set via the pre-match Wish UI and enter the full-winter snow arena during the 2-week Christmas & New Year loot window to defeat the Dark Santa encounter. Winners claim their selected set immediately to showcase in the Social Hub; losers wait 24 hours for their next attempt.',
      highlights: [
        'Loot Contract Window: Strictly 2 weeks (Christmas & New Year through Jan 7) inside the full-winter storm.',
        'Pre-Match Wish UI: Lock in your target Gold-Tier Winter set before queuing.',
        'Victory & Cooldown Rule: Instant unlock & Social Hub showcase on win; 24-hour lockout on defeat.',
      ],
    },
  },
  holidayEvents: [
    {
      id: 'halloween-hollow-bell',
      seasonTag: 'Halloween Loot · 1 Week',
      title: 'Night of the Hollow Bell (Wish or Threat)',
      window: 'Oct 25 - Nov 1 · 1 Entry / 24h',
      stormPairing: 'Full-Autumn Toxic Miasma Gas (Active All Autumn)',
      accentHex: '#9461C9',
      image: GENERATED_ASSETS.eventHalloweenValdris,
      atmosphere:
        "A giant blood-orange harvest moon hangs above Valdris while wrought-iron jack-o'-lantern braziers line Citadel drawbridges inside Autumn's baseline Miasma haze.",
      gameplayTwist:
        'Pre-match Wish or Threat loot ritual (1 week only): fight normally for a Gold-Tier set (Spectral Harvester Plate / Hollow Executioner Cloak) or accept a Threat curse for an exclusive Cursed VFX / Ether Seal.',
      rewardSkin: 'Gold-Tier Halloween Set + Optional Threat Cursed VFX / Ether Seal',
    },
    {
      id: 'dark-santas-wish',
      seasonTag: 'Midwinter Loot · 2 Weeks',
      title: "Dark Santa's Wish",
      window: 'Dec 24 - Jan 7 · 1 Entry / 24h',
      stormPairing: 'Full-Winter Glacial Ice Storm (Active All Dec-Feb)',
      accentHex: '#3E82C7',
      image: GENERATED_ASSETS.stormWinterBlizzard,
      atmosphere:
        'Framed inside the all-winter snowbound Citadel blizzard, crimson-iron Yule banners and Dark Santa altars spawn strictly for the 2-week Christmas & New Year loot run.',
      gameplayTwist:
        'During this 2-week loot window, players lock in a desired Gold-Tier set via the Wish UI and defeat Dark Santa inside the winter storm; defeat triggers a 24-hour personal cooldown.',
      rewardSkin: 'Chosen Gold-Tier Set + Instant Social Hub Showcase (Frostbound Hearth-Breaker)',
    },
    {
      id: 'solar-ash-solstice',
      seasonTag: 'Summer Loot · 1 Week',
      title: 'Solar-Ash Reckoning',
      window: 'Jun 21 - Jun 28 · June Summer Kickoff',
      stormPairing: 'Full-Summer Scorching Heat Storm (Active All Jun-Aug)',
      accentHex: '#E06C5A',
      image: GENERATED_ASSETS.stormSummerHeat,
      atmosphere:
        'Kicking off inside the all-summer Scorching Heat Storm, Solar Eclipse shrines ignite duel bounties across parched Citadel flagstones for one high-intensity opening week.',
      gameplayTwist:
        '1-week Summer opening loot contract: Solar Eclipse Altars fuel Ash-Guardian gauntlets for direct Solstice Skin progression while the Heat Storm remains active all summer.',
      rewardSkin: 'Sun-Baked Eclipse Sentinel Set (Solar Gold Plate & Dual Hand Crossbows)',
    },
  ],
  stormPhases: [
    {
      id: 'spring-autumn',
      seasonLabel: 'Spring & Autumn (Full Seasons)',
      title: 'Toxic Miasma Gas (Baseline)',
      calendarWindow: 'Entire Spring & Autumn (Mar-May · Sep-Nov)',
      accentHex: '#4F9E68',
      image: GENERATED_ASSETS.stormMiasmaBaseline,
      description:
        'Active throughout all of Spring and Autumn - the signature Valdris zone hazard rolls out of the Miasma Marshes with choking green-violet spores and low-visibility tension.',
      ue5Tech:
        'UE5 Volumetric Exponential Height Fog + modular emerald-violet Niagara spore ribbons.',
      eventPairing: "Hosts 1-Week Halloween Loot Event (Oct 25 - Nov 1)",
    },
    {
      id: 'winter',
      seasonLabel: 'Winter (Entire Season)',
      title: 'Glacial Ice Storm',
      calendarWindow: 'Entire Winter Season (Dec-Feb · 3 Months)',
      accentHex: '#3E82C7',
      image: GENERATED_ASSETS.stormWinterBlizzard,
      description:
        'Active across the entire Winter season - the toxic gas gives way to a lethal sub-zero blizzard bringing howling frost winds, freezing screen vignettes, and snow-dusted Citadel architecture all winter long.',
      ue5Tech:
        'World-aligned snow/ice shader mask + Sub-Zero Blizzard Niagara VFX & Frost Vignette post-process.',
      eventPairing: "Hosts 2-Week Dark Santa's Wish Loot Event (Dec 24 - Jan 7)",
    },
    {
      id: 'summer',
      seasonLabel: 'Summer (Entire Season)',
      title: 'Scorching Heat Storm',
      calendarWindow: 'Entire Summer Season (Jun-Aug · 3 Months)',
      accentHex: '#E06C5A',
      image: GENERATED_ASSETS.stormSummerHeat,
      description:
        'Active across the entire Summer season - the encroaching zone transforms into a blistering heatwave and ember-ash tempest featuring heat-haze distortion and dried-earth lighting.',
      ue5Tech:
        'Refractive heat-haze post-process material + Scorched Directional Sun preset & ember-ash Niagara swirl.',
      eventPairing: 'Hosts 1-Week Solar-Ash Reckoning Loot Event (Jun 21 - Jun 28)',
    },
  ],
  productionAdvantage: {
    title: 'Why This Works for Production & Live-Ops',
    summary:
      'Persistent Full-Season Storm environments keep Valdris visually transformed for months via modular UE5 Niagara VFX & shaders, while short 1-2 week Holiday Loot Events concentrate player urgency without map rebuilds.',
    partnerPoints: [
      {
        audience: 'Partner Art Studio Advantage',
        detail:
          'Zero map geometry rebuilds across seasons - one master world shifts atmosphere for 3-month stretches via reusable shader layers, volumetric fog profiles, and modular Niagara emitters.',
      },
      {
        audience: 'Publisher Retention Driver',
        detail:
          'Full-season weather resets sustain quarterly visual freshness, while timed 1-2 week holiday loot windows drive FOMO spikes with brand-new yearly loot designs (annual reset) and 2x match EXP (Monsters, Bosses & Players) for same-year repeat victors.',
      },
    ],
  },
  climateReactiveSkins: {
    eyebrow: 'Art Direction Synergy · Weather-Responsive Cosmetics',
    title: 'Climate-Reactive Seasonal Event Skins',
    summary:
      'Limited-time cosmetics earned during Holiday Events feature lightweight UE5 Material Parameter Collections that react dynamically to the active match storm - maximizing visual cohesion while keeping canonical hitboxes and combat timing 100% untouched.',
    showcase: [
      {
        id: 'halloween-lantern-warden',
        eventTitle: 'Halloween · Night of the Hollow Bell',
        skinName: 'Hollow Lantern Warden Set',
        seasonTag: 'Reactive Under Toxic Miasma Gas',
        accentHex: '#9461C9',
        image: GENERATED_ASSETS.skinHalloweenWarden,
        detail:
          "Carved iron jack-o'-lantern skull visor and jagged blackened plate housing a spirit-lit ribcage. Inside Autumn's Toxic Miasma Gas, emerald-violet soul flames and blade runes surge brighter.",
      },
      {
        id: 'dark-santas-wish',
        eventTitle: "Winter · Dark Santa's Wish Event",
        skinName: 'Frostbound Hearth-Breaker Set',
        seasonTag: 'Reactive Under Glacial Ice Storm',
        accentHex: '#3E82C7',
        image: GENERATED_ASSETS.skinDarkSantaFrost,
        detail:
          "Blackened gothic wrought iron layered with wolf-fur-trimmed crimson wool. Inside Winter's Glacial Ice Storm, rime frost crystals and glacial rune-glow intensify across pauldrons and axe edges.",
      },
      {
        id: 'solar-ash-solstice',
        eventTitle: 'Summer · Solar-Ash Reckoning Event',
        skinName: 'Sun-Baked Eclipse Sentinel Set',
        seasonTag: 'Reactive Under Scorching Heat Storm',
        accentHex: '#C89B3C',
        image: GENERATED_ASSETS.skinSummerAshSolstice,
        detail:
          "Tarnished eclipse gold and scorched obsidian armor wielding Dual Hand Crossbows (1 per hand). Under Summer's Scorching Heat Storm, engraved solar veins ignite with live ember trails and rising cinders.",
      },
    ],
  },
} as const;



