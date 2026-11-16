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
} as const;

export interface FichaEntry {
  label: string;
  value: string;
}

export const FICHA_TECNICA: FichaEntry[] = [
  { label: 'Work Title', value: 'The Last Relic' },
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
    subtitle: 'Duos, Trios & Quads — Shared Squad Victory',
    summary:
      'Duos, Trios, and Quads never split, have zero friendly fire, and claim victory together—crowning team ranks by Kills, Assists, and Team Healing Magic.',
    rules: [
      'During Acts I through III, a fallen squadmate respawns in 60 seconds as long as at least 1 ally remains alive.',
      'If all remaining teammates fall before the 60s timer completes, the entire squad is eliminated instantly.',
      'Starting in Act IV (Black Bell), all respawns are permanently disabled for the rest of the match.',
      'Post-match Coronation & Time Alive EXP: Kills, Assists, Team Healing Magic, and Time Alive award EXP; top squadmate is crowned King, 2nd Captain, 3rd Colonel, and last Sergeant.',
    ],
    respawnWindow: '60s in Acts I–III · No respawn from Act IV',
    winCondition: 'Joint squad victory with Throne Hall Hierarchy (King, Captain, Colonel, Sergeant)',
  },
  {
    id: 'errante',
    name: 'Wanderer Mode',
    subtitle: 'Solo 1 vs 199 — Sole Survivor',
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
    timeRange: '0:00 – 4:00',
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
    timeRange: '4:00 – 9:00',
    survivors: '130 → 60',
    respawnStatus: '60s Respawn Active',
    respawnActive: true,
    summary:
      'First constriction of The Abyssal Ash. Sealed Altar-Chests (Epic) emerge guarded by spectral sentinels and Tier II–III PvE beasts.',
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
    timeRange: '9:00 – 14:00',
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
    caption: 'Figure 2: The Siege — Company clash across the Citadel of Valdris drawbridge.',
  },
  {
    id: 'act-4',
    number: 'Act IV',
    name: 'The Black Bell',
    timeRange: '14:00 – 16:00',
    survivors: 'Last 16 Companies / 4',
    respawnStatus: 'NO RESPAWN',
    respawnActive: false,
    summary:
      'Toll of the Black Bell: all squadmate respawns are permanently disabled, the Catacombs seal shut, and the Ash Herald (Tier IV) spawns.',
    keyEvents: [
      'Permanent death: every elimination is final in both Oath Mode and Wanderer Mode.',
      'Desperate ascent up the 3 sole escape stairways before subterranean sealing.',
      'Global compass marker reveals the Black Bell Executioner (3.00x HP, up to 35% Gold Tier).',
    ],
    image: GENERATED_ASSETS.throneDuel,
    caption: 'Figure 6: Acts IV–V — Toll of the Black Bell echoing through the Citadel vaults.',
  },
  {
    id: 'act-5',
    number: 'Act V',
    name: 'The Judgment',
    timeRange: '16:00 – Finale',
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
    caption: 'Figure 6: The Judgment — Final Parry duel and Throne Hall Coronation.',
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
    rule: 'Final member of the winning squad—still honored for Survival Time, Assists, and Support.',
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
    colorName: 'Grey — Common',
    hex: '#8C929AC9',
    badgeText: 'Grey · Common',
    subtitle: 'Baseline survival gear',
    description: 'Baseline stats with no passive effects. Act I starting point.',
  },
  {
    id: 'verde',
    name: 'Tempered Steel',
    colorName: 'Green — Upgrade',
    hex: '#4F9E68',
    badgeText: 'Green · Upgrade',
    subtitle: '+15% base stat boost',
    description: '+15% base stats and faster stamina recovery rate.',
  },
  {
    id: 'azul',
    name: 'Astral Alchemy',
    colorName: 'Blue — Elemental',
    hex: '#3E82C7',
    badgeText: 'Blue · Elemental',
    subtitle: 'Combat elemental infusion',
    description:
      'Imbues weapons and armor with elemental affixes: Embers, Frost, Miasma, or Voltaic.',
  },
  {
    id: 'morado',
    name: 'Cursed Relic',
    colorName: 'Purple — Passives',
    hex: '#9461C9',
    badgeText: 'Purple · Passives',
    subtitle: 'Rule-bending combat passives',
    description:
      'Grants combat-altering passives (lifesteal on executions, ethereal phase on dodge).',
  },
  {
    id: 'dorado',
    name: 'Royal Vestige',
    colorName: 'Gold — Unique',
    hex: '#D4AF37',
    badgeText: 'Gold · Unique',
    subtitle: 'Match-unique legendary pieces',
    description:
      'Unique legendary relics per match that reshape character silhouette and grant ultimate abilities.',
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
    affixRule: '1–2 elemental affixes (Embers, Frost, Miasma, Voltaic).',
  },
  {
    id: 'boveda-catacumba',
    container: 'Catacomb Vault (Tier III)',
    gris: 0,
    verde: 10,
    azul: 35,
    morado: 41,
    dorado: 14,
    affixRule: '2–3 major affixes + 1 rule-altering combat passive.',
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
  swordXp: number;
  clubXp: number;
  axeXp: number;
  distanceXp: number;
  magicXp: number;
  defenseXp: number;
  offensiveSpellCasts: number;
  supportSpellCasts: number;
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
    slot: 'Base Designation: Warrior',
    detail:
      'Every player begins as an unspecialized Warrior. Combat hits train your weapon mastery (Sword, Club, Axe, Distance) while spell casts raise Magic Level—letting you pivot roles live mid-match.',
  },
  {
    slot: 'Two Quick-Swap Weapons',
    detail:
      'Instantly toggle between melee and ranged/magic kits (e.g., Greatsword, War Mace, or Greataxe + Dual Crossbows or Scepter) tuned to your highest mastery.',
  },
  {
    slot: '4 Armor Pieces & Belt of Vials (Keys 1–4)',
    detail:
      'Helm, Cuirass, Greaves, and hybrid Boots plus the 4-slot Vial Belt (1. Vitality, 2. Ether, 3. Stamina, 4. Purifying Elixir).',
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
    difficulty: 'Difficulty I — Low (Early Looting)',
    acts: 'Acts I–II',
    enemies: 'Valdris Marauders (Withered Mercenary 0.45x HP, Mire Leech 0.52x HP)',
    chestMechanic: 'Camp Stash & Patrol Pack (fast 1.5s unsealed looting).',
    scalingErrante: '1x HP (1–2 foes)',
    scalingJuramento: '1.4x HP (3-foe patrol)',
    pvpRisk: '25m (low audio footprint, no map ping)',
    hpMultiplierMax: 0.52,
    drops: { gris: 62, verde: 30, azul: 8, morado: 0, dorado: 0 },
    guaranteedRule: '1–2 starter gear pieces + 1 guaranteed Belt Vial.',
  },
  {
    id: 'tier-2',
    tierLabel: 'Tier II',
    difficulty: 'Difficulty II — Medium (Sealed Altar-Chest)',
    acts: 'Acts II–III',
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
    difficulty: 'Difficulty III — High (Catacomb Bosses)',
    acts: 'Acts II–IV',
    enemies: 'Horrors of the Nameless King (Ossuary Knight 1.80x HP, Catacomb Wyrm 2.20x HP)',
    chestMechanic: 'Boss drops the Ossuary Key to unlock the 3-chest vault (4.5s channel).',
    scalingErrante: '1x HP',
    scalingJuramento: '2.2x HP (enraged phase)',
    pvpRisk: '120m + Stairway Echo Ping',
    hpMultiplierMax: 2.2,
    drops: { gris: 0, verde: 5, azul: 32, morado: 49, dorado: 14 },
    guaranteedRule: 'Minimum 1 Cursed Relic (Purple) + 14% base Gold Tier (35% max cap with Mastery).',
  },
  {
    id: 'tier-4',
    tierLabel: 'Tier IV',
    difficulty: 'Difficulty IV — Extreme (Black Bell)',
    acts: 'Acts IV–V',
    enemies: 'Herald of The Abyssal Ash (Black Bell Executioner 3.00x HP)',
    chestMechanic: 'Instant direct drop on killing blow; Gold Tier scales up to strict 35% cap.',
    scalingErrante: '1x HP',
    scalingJuramento: 'Duo 1.35x / Trio 1.75x / Quad 2.2x HP',
    pvpRisk: 'Global (permanent Citadel compass marker)',
    hpMultiplierMax: 3.0,
    drops: { gris: 0, verde: 0, azul: 0, morado: 78, dorado: 22 },
    guaranteedRule: 'Guaranteed Cursed Relic + 22% base Gold Tier (35% strict cap) + Vials.',
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
    caption: 'The Citadel of Valdris — Battlements, drawbridges, and Throne Hall.',
    elevationProfile: '3 Vertical Fortress Tiers + Central Throne Hall Arena',
    ashClosureWindow: 'Safe Center through Act V (Throne Hall Sudden Death)',
    lootFocus: 'Tier III–IV Endgame Spoils · Up to 35% Gold Tier Cap',
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
    acts: 'Acts I–II',
    description:
      'Sunken hamlets linked by wooden catwalks above toxic waters; requires Purifying Elixirs or Astral Alchemy boots to cross safely without poison DoT.',
    tacticalNotes:
      'Ideal for quiet early looting (25m PvP noise radius) and choke-point ambushes on narrow walkways.',
    image: GENERATED_ASSETS.biomeMiasmaMarshes,
    caption: 'The Miasma Marshes — Sunken wooden catwalks over glowing toxic waters.',
    elevationProfile: 'Low-Lying Bog Basins & Elevated Timber Walkways',
    ashClosureWindow: 'Consumed by Abyssal Ash at end of Act II (9:00)',
    lootFocus: 'Tier I–II Stashes, Purifying Elixirs & Anti-Miasma Boots',
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
    acts: 'Acts II–IV (Sealed in Act IV)',
    description:
      'Torch-lit subterranean labyrinth housing Cursed Relics; forces squads to fight over the sole 3 escape stairways before the Abyssal Ash seals the depths.',
    tacticalNotes:
      'Slaying the Ossuary Knight or Wyrm awards the Ossuary Key for the 3-chest Vault (4.5s).',
    image: GENERATED_ASSETS.catacombsAltar,
    caption: 'Catacombs of the Nameless King — Subterranean vaults guarded by Tier III Horrors.',
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
    acts: 'Acts I–III',
    description:
      'Colossal ancient trees laced with lookout platforms and suspension bridges—built for vertical ambushes with Dual Hand Crossbows (1 per hand) and Seal of Translation.',
    tacticalNotes:
      'Seal of Translation (8m+) chains leaps across tree canopies while Watchers guard Altar-Chests below.',
    image: GENERATED_ASSETS.biomeForestSpires,
    caption: 'The Forest of Spires — High treehouse platforms and swaying rope bridges.',
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
    formula: 'EXP_Awarded = Base_EXP * (%_Damage_Share) * ΔLevel_Factor',
    note: 'ΔLevel Much Higher (+50 lv+): 1.50x–2.50x · Higher (+21 to +49): 1.20x–1.49x · Similar (-20 to +20): 1.00x · Lower (-21 or less): 0.15x–0.60x.',
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
    title: 'Weapon Damage by Mastery & General Level',
    formula:
      'Net_Dmg = [Weapon_Atk * (1 + Mastery * 0.015) + General_Lv * 0.35] * Attack_Factor * 0.60 * (100 / (100 + Armor))',
    note: 'Mastery maps to Sword, Club, Axe, or Distance Level depending on equipped weapon. Each strike earns skill EXP.',
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
    note: 'Every shield block or absorbed hit grants Defense EXP. Shields add active block reduction (25%–68%) boosted by Defense Level.',
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
    title: 'Match EXP from Kills, Assists, Healing Magic & Time Alive',
    formula:
      'Match_EXP = [(Kills * 140) + (Assists * 65) + (Team_Healing / 15) + (Minutes_Alive * 20)] * (1 + Rank_Bonus)',
    note: 'Every minute alive continuously grants +20 General EXP; team healing casts (Seal of Restoration / Aegis) & assists directly convert into EXP and squad rank.',
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

export const UE5_PILLARS = [
  {
    title: 'Replication Graph & Spatial Relevancy (50–80m)',
    detail:
      'High-frequency replication for parry frames, dual-crossbow bolts, and Ether Seals inside a 50–80m combat radius, conserving bandwidth across the rest of the 200-player map.',
  },
  {
    title: 'Server Authority, Coronation Ledger & Time Alive EXP',
    detail:
      'Full server-side authority over Match-Up brackets (Lv_avg), Warrior HP curves, PvE monsters at Lv_avg + 100, Retroactive EXP Ledger, Assists & Team Healing tracking, Time Alive EXP ticks, and the Winning Squad Coronation (King, Captain, Colonel, Sergeant).',
  },
  {
    title: 'Modular Skeletal Mesh & Niagara GPU VFX',
    detail:
      'One unified base Skeletal Mesh dynamically swaps all 4 armor slots across the 90 armor sets and 5 Quality Tiers with GPU-driven Niagara elemental emitters.',
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
    code: '01 / 12',
    section: 'Concept & Hook',
    title: 'The Last Relic — 200-Warrior Tactical PvPvE Battle Royale',
    keyMessage: '"200 Souls. 5 Acts. One Single Iron Crown."',
    bullets: [
      'Dark-fantasy Battle Royale built in Unreal Engine 5 uniting directional melee parry combat, dual-crossbow ballistics, and Ether magic.',
      'Two crisp game modes: Oath Mode (Duos, Trios & Quads united with shared victory) and Wanderer Mode (Solo 1 vs 199).',
      'Dynamic Warrior identity featuring 6 evolving specializations, 90 modular 3D sets, and fast 15–18 minute matches.',
    ],
    image: GENERATED_ASSETS.heroCitadel,
  },
  {
    index: 2,
    code: '02 / 12',
    section: 'Market Opportunity',
    title: 'Bridging High-Tempo Battle Royale & Tactical Action Combat',
    keyMessage: 'Capturing players underserved by modern military gunplay shooters.',
    bullets: [
      'Saturated firearm BR market leaves massive whitespace for a 200-player dark-medieval combat title with physical hitboxes.',
      'Classless live match progression: every player enters identically as a Warrior and evolves dynamically via the weapons or spells they use.',
      'Ethical Zero Pay-to-Win commerce: revenue driven strictly by cosmetic 3D armor skins, weapon variants, and seasonal Battle Passes.',
    ],
    image: GENERATED_ASSETS.siegeBridge,
  },
  {
    index: 3,
    code: '03 / 12',
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
    code: '04 / 12',
    section: 'Core 5-Act Match Loop',
    title: 'Tactical Match Lifecycle in 15–18 Minutes',
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
    code: '05 / 12',
    section: 'Pillar 1: Dynamic Warrior (6 Professions)',
    title: 'Warrior Identity: 6 Evolving Combat Specializations',
    keyMessage: 'Weapon hits train Weapon Mastery; spell casts raise Magic Level and define your role.',
    bullets: [
      '3 Melee Masteries: Sword Warrior (Parry/Riposte 1.60x), Club Warrior (armor-crushing maces), and Axe Warrior (highest raw cleave).',
      '1 Dual Ballistic Mastery: Archer wielding Dual Hand Crossbows (1 crossbow per hand) for alternating twin volleys and high mobility.',
      '2 Arcane Masteries via Magic Level: Wizard (offensive sorcery) and Druid (squad healing, Miasma cleansing, and barriers).',
    ],
    image: GENERATED_ASSETS.qualityLineup,
    showcaseTitle: '3D Visual Designs — All 6 Warrior Specializations',
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
    code: '06 / 12',
    section: 'Pillar 2: 90 Modular 3D Armor Sets (Lv. 1–100+)',
    title: '15 Distinct Sets per Profession with Attack & Defense Perks',
    keyMessage: '90 unique armor sets scaling from Rusted Forge (Grey) to Royal Vestige (Gold).',
    bullets: [
      'Each of the 6 professions unlocks 15 progressive armor sets (Lv. 1 to Lv. 100+) gated by General Level, Weapon Mastery, and Defense Level.',
      'True tactical specialization: every set explicitly boosts Attack (bleed, embers, piercing), Defense (block, reflect, anti-Miasma), or Hybrid play.',
      'Weapon-accurate & Tier-accurate 3D renders: helms, pauldrons, shields, and signature weapons (e.g., Archer dual crossbows) transform visually at every tier.',
    ],
    image: GENERATED_ASSETS.relicLoot,
    showcaseTitle: 'Visual Quality Tier Progression (Common Grey → Royal Gold)',
    showcaseItems: [
      {
        label: 'Tier 1 · Grey',
        sublabel: 'Rusted Forge (Lv. 1+)',
        image: '/src/assets/images/axe_common_gris_1794866767001.jpg',
        accentHex: '#8C929A',
      },
      {
        label: 'Tier 2 · Green',
        sublabel: 'Tempered Steel (Lv. 15+)',
        image: '/src/assets/images/design_green_hammer_1794866345927.jpg',
        accentHex: '#4F9E68',
      },
      {
        label: 'Tier 3 · Blue',
        sublabel: 'Astral Alchemy (Lv. 38+)',
        image: '/src/assets/images/blue_frost_knight_1794866405059.jpg',
        accentHex: '#3E82C7',
      },
      {
        label: 'Tier 4 · Purple',
        sublabel: 'Cursed Relic (Lv. 64+)',
        image: '/src/assets/images/archer_purple_dual_1794866401837.jpg',
        accentHex: '#9461C9',
      },
      {
        label: 'Tier 5 · Gold',
        sublabel: 'Royal Vestige (Lv. 88+)',
        image: '/src/assets/images/gold_titan_mace_1794866403815.jpg',
        accentHex: '#D4AF37',
      },
    ],
  },
  {
    index: 7,
    code: '07 / 12',
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
    code: '08 / 12',
    section: 'Pillar 4: 8 Ether Seals & Magic Level',
    title: 'Magic Level Spell Scaling Across 3 Equippable Slots',
    keyMessage: 'Casting spells trains Magic Level and scales damage, barriers, and squad healing.',
    bullets: [
      'Every spell cast grants Magic EXP—naturally diverging high-magic Warriors into offensive Wizards or supportive Druids.',
      'Direct scaling formula: Spell_Power = [Base * (1 + Magic_Level * 0.018) + General_Lv * 0.45] across all 8 Ether Seals.',
      'Spatial control & outplay tools: Bastion (8s crystal wall), Gravity (60%+ slow well), and Translation (8m+ blink).',
    ],
    image: GENERATED_ASSETS.relicLoot,
  },
  {
    index: 9,
    code: '09 / 12',
    section: 'Pillar 5: PvPvE Ecosystem & Warrior HP Curve',
    title: '4 PvE Difficulty Tiers, Warrior HP Curve & 35% Gold Cap',
    keyMessage: 'Endgame relics require defeating guardians dynamically scaled at Lv_avg + 100.',
    bullets: [
      'Universal Warrior HP Curve: HP(Lv≤8) = 150 + (Lv-1)*5; HP(Lv≥9) = 185 + (Lv-8)*10 (Lv. 100 = 1,105 HP · Lv. 200 = 2,105 HP).',
      '4 dynamic PvE tiers ranging from Marauders (0.45x HP) to the Black Bell Executioner (3.00x HP), with Gold Tier drops strictly capped at 35%.',
      'Total Contribution EXP & Coronation: Kills, Assists, Squad Healing Magic (Druid/Wizard support), and Survival Time Alive all feed EXP and determine King / Captain / Colonel / Sergeant honors.',
    ],
    image: GENERATED_ASSETS.catacombsAltar,
  },
  {
    index: 10,
    code: '10 / 12',
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
    code: '11 / 12',
    section: 'UE5 Engineering & Anti-Cheat',
    title: 'Authoritative Architecture for 200 Concurrent Warriors',
    keyMessage: 'Locked 60+ FPS scalability, modular 3D gear, and competitive security.',
    bullets: [
      'Replication Graph (50–80m) paired with Modular Skeletal Meshes & Niagara GPU VFX to render 90 armor sets seamlessly.',
      '100% Server Authority over Retroactive EXP Ledger payouts, Weapon Mastery, Defense Level mitigation, and loot drops.',
      'Multi-layer Anti-Cheat: kernel memory protection, server-side anti-ESP occlusion culling, and <80ms auto-parry heuristic telemetry.',
    ],
    image: GENERATED_ASSETS.siegeBridge,
  },
  {
    index: 12,
    code: '12 / 12',
    section: 'Roadmap & Commercial Model',
    title: 'Go-To-Market Plan & Ethical Zero Pay-to-Win Economy',
    keyMessage: '100% fair competitive play driven strictly by skill, build craft, and teamwork.',
    bullets: [
      'Closed Beta milestone validating live balance telemetry across all 6 professions, 90 sets, and full 200-Warrior matches.',
      'Seasonal Battle Pass & Storefront featuring cosmetic 3D armor skins, dual-crossbow finishes, shields, and Niagara Ether auras.',
      'Ironclad Zero Pay-to-Win Pledge: zero Attack, Defense, Shield Block, or Magic Level advantages can ever be purchased.',
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
    acts: 'Acts I–II',
    biomeIds: ['marismas', 'bosque'],
    biomeLabel: 'Outer Coasts, Forest Edges & Roadside Camps',
    hpMultiplier: 0.45,
    baseExpReward: 180,
    pvpAlertRadius: '25m Low Audio',
    image: '/src/assets/images/beast_withered_mercenary_1794869217917.jpg',
    lore: 'Former levies of Valdris consumed by The Abyssal Ash, condemned to patrol ruined roadside camps clutching rusted blades long after their minds turned to cinder.',
    combatBehavior: [
      'Telegraphed 2-hit rusted sword slash with generous Parry window.',
      'Patrols in packs of 1–2 (Wanderer Mode) or 3 (Oath Mode) near Camp Stashes.',
      'Drops aggro beyond 30m, making stealth disengagement easy.',
    ],
    counterplayTip: 'Trigger a crisp Parry on the overhead swing for an instant 1.60x Riposte execution and fast Sword/Club/Axe Mastery XP.',
    weakness: 'Physical Cleave & Fire Embers',
    guaranteedDrops: '1–2 Starter Grey/Green pieces + 1 guaranteed Belt Vial (62% Grey / 30% Green / 8% Blue).',
  },
  {
    id: 'mire-leech',
    name: 'Mire Leech',
    title: 'Armored Toxic Bog Predator',
    tierLabel: 'Tier I',
    tierHex: '#4F9E68',
    difficulty: 'Low · Marsh Ambush',
    acts: 'Acts I–II',
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
    acts: 'Acts II–III',
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
    acts: 'Acts I–III',
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
    acts: 'Acts II–IV',
    biomeIds: ['catacumbas'],
    biomeLabel: 'Catacombs of the Nameless King',
    hpMultiplier: 1.8,
    baseExpReward: 1150,
    pvpAlertRadius: '120m + Stairway Echo Ping',
    image: '/src/assets/images/beast_ossuary_knight_1794869230733.jpg',
    lore: 'Forged from the fused skulls and cursed obsidian armor of the Nameless King’s honor guard. It guards the Ossuary Key deep below Valdris until the Black Bell seals the crypts.',
    combatBehavior: [
      'Performs delayed overhead greatsword slams that bait premature Parries.',
      'Enrages at 40% HP in Oath Mode (2.2x HP scaling), radiating cursed purple Shockwaves.',
      'Requires disciplined stamina management in tight torch-lit corridors.',
    ],
    counterplayTip: 'Bait the triple combo inside wide crypt junctions; drop Seal of Bastion to seal side tunnels against third-party PvP squads.',
    weakness: 'Armor-Piercing Riposte & Guard Break (-25% Armor)',
    guaranteedDrops: 'Drops Ossuary Key (unlocks 3-chest Vault: 49% Purple, 14% base Gold -> 35% cap w/ Mastery).',
  },
  {
    id: 'catacomb-wyrm',
    name: 'Catacomb Wyrm',
    title: 'Blind Bone-Plated Crypt Serpent',
    tierLabel: 'Tier III',
    tierHex: '#9461C9',
    difficulty: 'High · Catacomb Vault Boss',
    acts: 'Acts II–IV',
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
    difficulty: 'Extreme · Act IV–V World Boss',
    acts: 'Acts IV–V',
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
      'Executes massive cleave sweeps—high risk, massive reward while rival squads close in for the Throne Hall.',
    ],
    counterplayTip: 'Assign a high-Defense Club/Sword tank with a Tower Shield & Seal of Aegis while Druid supports with Seal of Restoration (+Team Healing EXP) and Wizards cast from ramparts.',
    weakness: 'Coordinated Squad Focus & Mastery +15%/+30% PvE Bonus',
    guaranteedDrops: 'Direct Spoils on Kill: 1+ Cursed Relic + 22% Base Gold Tier (up to 35% Cap w/ Mastery) + Master Elixirs.',
  },
];

