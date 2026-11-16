export type QualityTierKey = 'gris' | 'verde' | 'azul' | 'morado' | 'dorado';

export type CombatSkillKey = 'sword' | 'club' | 'axe' | 'distance' | 'magic';

export type WarriorArchetypeId =
  | 'sword-warrior'
  | 'club-warrior'
  | 'axe-warrior'
  | 'archer'
  | 'wizard'
  | 'druid';

export type SetFocusType = 'Attack' | 'Defense' | 'Hybrid';

export type Weapon3DModelType = 'sword' | 'club' | 'axe' | 'bow' | 'staff' | 'totem-staff';
export type Shield3DModelType = 'buckler' | 'kite' | 'tower' | 'orb-ward';
export type Helm3DStyle = 'open' | 'nasal' | 'winged' | 'horned' | 'crowned' | 'hooded';

export interface Visual3DConfig {
  weaponModel: Weapon3DModelType;
  shieldModel: Shield3DModelType;
  helmStyle: Helm3DStyle;
  pauldronScale: number;
  silhouetteBulk: number;
  primaryHex: string;
  secondaryHex: string;
  trimHex: string;
  emissiveHex: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
}

export interface EquipmentSetSpec {
  id: string;
  setNumber: number;
  professionId: WarriorArchetypeId;
  professionLabel: string;
  name: string;
  tierKey: QualityTierKey;
  tierLabel: string;
  tierHex: string;
  archetypeTitle: string;
  focusType: SetFocusType;
  focusTarget: string;
  focusAdvantage: string;
  minGeneralLevel: number;
  attackSkill: CombatSkillKey;
  attackSkillLabel: string;
  minAttackMastery: number;
  minDefenseLevel: number;
  weaponName: string;
  weaponAttack: number;
  armorName: string;
  armorDefense: number;
  shieldName: string;
  shieldDefense: number;
  baseShieldBlockPct: number;
  setBonus: string;
  designImageSrc: string;
  visualDesignNote: string;
  visual3D: Visual3DConfig;
}

interface TierTemplate {
  tierKey: QualityTierKey;
  tierLabel: string;
  tierHex: string;
  tierPrimary: string;
  tierSecondary: string;
  tierTrim: string;
  tierEmissive: string;
  emissiveIntensity: number;
  metalness: number;
  roughness: number;
}

const TIER_TEMPLATES: Record<QualityTierKey, TierTemplate> = {
  gris: {
    tierKey: 'gris',
    tierLabel: 'Rusted Forge (Common)',
    tierHex: '#8C929A',
    tierPrimary: '#52575F',
    tierSecondary: '#3E332B',
    tierTrim: '#6E737B',
    tierEmissive: '#000000',
    emissiveIntensity: 0,
    metalness: 0.45,
    roughness: 0.78,
  },
  verde: {
    tierKey: 'verde',
    tierLabel: 'Tempered Steel (Green)',
    tierHex: '#4F9E68',
    tierPrimary: '#5A6B62',
    tierSecondary: '#36443B',
    tierTrim: '#5B9A6E',
    tierEmissive: '#225438',
    emissiveIntensity: 0.16,
    metalness: 0.65,
    roughness: 0.54,
  },
  azul: {
    tierKey: 'azul',
    tierLabel: 'Astral Alchemy (Blue)',
    tierHex: '#3E82C7',
    tierPrimary: '#2D4866',
    tierSecondary: '#1B2838',
    tierTrim: '#5AA4E8',
    tierEmissive: '#2A88E5',
    emissiveIntensity: 0.48,
    metalness: 0.78,
    roughness: 0.42,
  },
  morado: {
    tierKey: 'morado',
    tierLabel: 'Cursed Relic (Purple)',
    tierHex: '#9461C9',
    tierPrimary: '#26212E',
    tierSecondary: '#15121A',
    tierTrim: '#8E5CD0',
    tierEmissive: '#9B4DFF',
    emissiveIntensity: 0.75,
    metalness: 0.85,
    roughness: 0.34,
  },
  dorado: {
    tierKey: 'dorado',
    tierLabel: 'Royal Vestige (Gold)',
    tierHex: '#D4AF37',
    tierPrimary: '#2C2418',
    tierSecondary: '#1A150F',
    tierTrim: '#E2BD4B',
    tierEmissive: '#F2B830',
    emissiveIntensity: 0.85,
    metalness: 0.92,
    roughness: 0.28,
  },
};

interface SetSeed {
  name: string;
  tierKey: QualityTierKey;
  focusType: SetFocusType;
  focusTarget: string;
  focusAdvantage: string;
  weaponName: string;
  armorName: string;
  shieldName: string;
}

interface ProfessionBlueprint {
  professionId: WarriorArchetypeId;
  professionLabel: string;
  attackSkill: CombatSkillKey;
  attackSkillLabel: string;
  weaponModel: Weapon3DModelType;
  defaultShieldModel: Shield3DModelType;
  baseBulk: number;
  baseWeaponAtk: number;
  baseArmorDef: number;
  baseShieldDef: number;
  baseBlockPct: number;
  tintHex: string;
  seeds: SetSeed[];
}

const PROGRESSION_CURVE = [
  { minLv: 1, minMastery: 1, minDef: 1 },
  { minLv: 5, minMastery: 5, minDef: 4 },
  { minLv: 10, minMastery: 10, minDef: 8 },
  { minLv: 15, minMastery: 15, minDef: 12 },
  { minLv: 22, minMastery: 22, minDef: 18 },
  { minLv: 30, minMastery: 28, minDef: 24 },
  { minLv: 38, minMastery: 36, minDef: 30 },
  { minLv: 46, minMastery: 44, minDef: 38 },
  { minLv: 55, minMastery: 52, minDef: 45 },
  { minLv: 64, minMastery: 60, minDef: 52 },
  { minLv: 72, minMastery: 68, minDef: 60 },
  { minLv: 80, minMastery: 76, minDef: 68 },
  { minLv: 88, minMastery: 82, minDef: 74 },
  { minLv: 95, minMastery: 88, minDef: 80 },
  { minLv: 100, minMastery: 95, minDef: 86 },
] as const;

const PROFESSION_BLUEPRINTS: ProfessionBlueprint[] = [
  {
    professionId: 'sword-warrior',
    professionLabel: 'Sword Warrior',
    attackSkill: 'sword',
    attackSkillLabel: 'Sword Level',
    weaponModel: 'sword',
    defaultShieldModel: 'kite',
    baseBulk: 1.0,
    baseWeaponAtk: 16,
    baseArmorDef: 18,
    baseShieldDef: 8,
    baseBlockPct: 26,
    tintHex: '#7A8594',
    seeds: [
      {
        name: 'Rustic Landfall Set',
        tierKey: 'gris',
        focusType: 'Hybrid',
        focusTarget: 'Act I Survival / Basic Edge',
        focusAdvantage: '+5% stamina regeneration while sprinting and +4% light slash precision.',
        weaponName: 'Rusted Iron Shortsword',
        armorName: 'Worn Chainmail Hauberk (4-Piece)',
        shieldName: 'Reinforced Wooden Buckler',
      },
      {
        name: 'Shorewatch Sentinel Set',
        tierKey: 'gris',
        focusType: 'Defense',
        focusTarget: 'Starter Shield Block',
        focusAdvantage: '+8% shield stability when absorbing thrusts in early-act skirmishes.',
        weaponName: 'Weathered Iron Gladius',
        armorName: 'Padded Gambeson with Iron Pauldrons',
        shieldName: 'Riveted Coastal Round Shield',
      },
      {
        name: 'Wandering Duelist Set',
        tierKey: 'gris',
        focusType: 'Attack',
        focusTarget: 'Light Slashing Tempo',
        focusAdvantage: '+10% combo chain speed on slashing strikes and +6% thrust damage.',
        weaponName: 'Curved Mercenary Saber',
        armorName: 'Common Fencing Breastplate',
        shieldName: 'Slim Grey-Steel Buckler',
      },
      {
        name: 'Tempered Watchman Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Parry & Shield Guard',
        focusAdvantage: '+15% stamina recovery and +120ms defensive Parry timing window.',
        weaponName: 'Tempered Bastard Sword',
        armorName: 'Tempered Iron Brigandine (4-Piece)',
        shieldName: 'Tempered Round Steel Shield',
      },
      {
        name: 'Vanguard Blademaster Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Slashing Power & Bleed',
        focusAdvantage: '+14% slashing damage in 3-hit combos and applies light bleed (2s).',
        weaponName: 'Tempered Long Rapier',
        armorName: 'Articulated Vanguard Cuirass',
        shieldName: 'Spiked Light Parrying Shield',
      },
      {
        name: 'Valdris Rampart Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Frontline Melee Mitigation',
        focusAdvantage: '-12% incoming frontal physical damage while maintaining high guard.',
        weaponName: 'Garrison Broadsword',
        armorName: 'Half-Plate Rampart Mail',
        shieldName: 'Tempered Iron Pavise',
      },
      {
        name: 'Astral Voltaic Blade Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'Voltaic Elemental Strikes',
        focusAdvantage: 'Imbues every slash with Voltaic lightning: +18% damage vs shields and 2m arc.',
        weaponName: 'Voltaic Alchemy Greatsword',
        armorName: 'Runic Copper Light Plate',
        shieldName: 'Astral Conductor Kite Shield',
      },
      {
        name: 'Bridgeward Frost Set',
        tierKey: 'azul',
        focusType: 'Defense',
        focusTarget: 'Elemental Defense & Chill Guard',
        focusAdvantage: 'Blocking attacks chills attackers (-20% attack speed for 2.5s).',
        weaponName: 'Frost-Edged Longsword',
        armorName: 'Tempered Glacial Blue Cuirass',
        shieldName: 'Glacial Crystal Aegis',
      },
      {
        name: 'Ember Captain Set',
        tierKey: 'azul',
        focusType: 'Hybrid',
        focusTarget: 'Fiery Riposte + Medium Defense',
        focusAdvantage: '+16% Riposte damage with Embers burn and +10% fire resistance.',
        weaponName: 'Ember-Forged Bastard Sword',
        armorName: 'Astral Scaled Battle Plate',
        shieldName: 'Flame-Runed Kite Shield',
      },
      {
        name: 'Cursed Silent Executioner Set',
        tierKey: 'morado',
        focusType: 'Attack',
        focusTarget: 'Executioner Slashes & Penetration',
        focusAdvantage: '+22% damage against targets <40% HP and lifesteals 10% on executions.',
        weaponName: 'Cursed Executioner Greatsword',
        armorName: 'Black Shadowsteel Spiked Plate',
        shieldName: 'Serrated Blood Ward Shield',
      },
      {
        name: 'Obsidian Bastion Set',
        tierKey: 'morado',
        focusType: 'Defense',
        focusTarget: 'Heavy Block & Damage Reflection',
        focusAdvantage: 'Successful blocks reflect 18% damage back and cut block stamina cost by 25%.',
        weaponName: 'Obsidian Sentinel Blade',
        armorName: 'Cursed Heavy Obsidian Cuirass',
        shieldName: 'Catacomb Tower Shield',
      },
      {
        name: 'Fallen King Spectral Set',
        tierKey: 'morado',
        focusType: 'Hybrid',
        focusTarget: 'Ethereal Dodge + Counter-Slash',
        focusAdvantage: 'Turns ethereal for 0.4s on dodge; next slash ignores 25% target armor.',
        weaponName: 'Runeblade of the Fallen King',
        armorName: 'Spectral Fine-Plate Harness',
        shieldName: 'Shadowed Parry Aegis',
      },
      {
        name: 'Vestige of the Iron Crown Set',
        tierKey: 'dorado',
        focusType: 'Attack',
        focusTarget: 'Lethal Riposte & Sovereign Edge',
        focusAdvantage: '1.60x Riposte ignores 45% armor and unleashes a 4m golden slashing wave.',
        weaponName: 'Royal Crown Greatsword (Vestige)',
        armorName: 'Golden Armor of the Last King',
        shieldName: 'Royal Shield of Valdris',
      },
      {
        name: 'Vestige of the Eternal Sentinel Set',
        tierKey: 'dorado',
        focusType: 'Defense',
        focusTarget: 'Impenetrable Shield Fortress',
        focusAdvantage: '+18% crit mitigation and every Parry restores 45 HP + 25 Ether.',
        weaponName: 'Ceremonial Bastion Sword',
        armorName: 'Imperial Gold-Filigree Cuirass',
        shieldName: 'Grand Golden Bulwark of Valdris',
      },
      {
        name: 'Supreme Broken Oath Set',
        tierKey: 'dorado',
        focusType: 'Hybrid',
        focusTarget: 'Total Sword & Defense Mastery',
        focusAdvantage: '+20% slashing speed and grants an automatic 180 HP barrier upon kill.',
        weaponName: 'Supreme Blade of the First Oath',
        armorName: 'Royal Broken Oath Plate',
        shieldName: 'Sovereign Crown Kite Shield',
      },
    ],
  },
  {
    professionId: 'club-warrior',
    professionLabel: 'Club Warrior',
    attackSkill: 'club',
    attackSkillLabel: 'Club Level',
    weaponModel: 'club',
    defaultShieldModel: 'tower',
    baseBulk: 1.12,
    baseWeaponAtk: 17,
    baseArmorDef: 22,
    baseShieldDef: 11,
    baseBlockPct: 30,
    tintHex: '#8C7A6B',
    seeds: [
      {
        name: 'Militia Cudgel Set',
        tierKey: 'gris',
        focusType: 'Attack',
        focusTarget: 'Early Blunt Impact',
        focusAdvantage: '+8% heavy impact damage against leather and chainmail armor.',
        weaponName: 'Iron-Shod Oak Club',
        armorName: 'Padded Jerkin with Iron Pauldrons',
        shieldName: 'Thick Plank Wooden Shield',
      },
      {
        name: 'Rustic Reeve Set',
        tierKey: 'gris',
        focusType: 'Defense',
        focusTarget: 'Anti-Knockback Stance',
        focusAdvantage: '+15% knockback resistance while keeping your shield raised.',
        weaponName: 'Common Iron Short Mace',
        armorName: 'Leather & Iron Ring Mail',
        shieldName: 'Dark Oak Round Shield',
      },
      {
        name: 'Initiate Bonebreaker Set',
        tierKey: 'gris',
        focusType: 'Hybrid',
        focusTarget: 'Guard & Stamina Attrition',
        focusAdvantage: 'Each mace hit drains +12% extra stamina from blocking opponents.',
        weaponName: 'Rough Camp Warhammer',
        armorName: 'Rusted Light Plate Cuirass',
        shieldName: 'Short Iron Pavise',
      },
      {
        name: 'Watchman Hammer Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Tower Shield Guard',
        focusAdvantage: '+12% damage mitigation when blocking projectiles and blunt blows.',
        weaponName: 'Tempered Flanged Mace',
        armorName: 'Tempered Ring-Plate Cuirass',
        shieldName: 'Reinforced Kite Shield',
      },
      {
        name: 'Skullcrusher Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Blunt Crusher & Stagger',
        focusAdvantage: 'Heavy blows extend enemy stagger duration by +0.35s.',
        weaponName: 'Tempered Warhammer',
        armorName: 'Live-Iron Heavy Plate',
        shieldName: 'Heavy Steel Buckler',
      },
      {
        name: 'Courtyard Warden Set',
        tierKey: 'verde',
        focusType: 'Hybrid',
        focusTarget: 'Shield Bash + Mace Combo',
        focusAdvantage: 'Striking right after a successful block deals +15% guaranteed blunt damage.',
        weaponName: 'Tempered Morningstar',
        armorName: 'Citadel Heavy Breastplate',
        shieldName: 'Riveted Steel Warden Shield',
      },
      {
        name: 'Rampart Thunder Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'Voltaic Shockwave Slam',
        focusAdvantage: 'Special attacks release a 3.5m Voltaic burst that shreds -15% armor.',
        weaponName: 'Voltaic Siege Hammer',
        armorName: 'Runic Cobalt Heavy Armor',
        shieldName: 'Stormbronze Kite Shield',
      },
      {
        name: 'Glacial Bastion Set',
        tierKey: 'azul',
        focusType: 'Defense',
        focusTarget: 'Elemental Ward & Mobile Wall',
        focusAdvantage: '+22% Embers/Frost resistance and -18% damage taken while stationary blocking.',
        weaponName: 'Deep-Frost War Mace',
        armorName: 'Arcane Ice Heavy Cuirass',
        shieldName: 'Blue Crystal Tower Shield',
      },
      {
        name: 'Miasma Templar Set',
        tierKey: 'azul',
        focusType: 'Hybrid',
        focusTarget: 'Anti-Miasma + Toxic Concussion',
        focusAdvantage: '+30% resistance to Mire toxic water and reduces enemy healing by 20%.',
        weaponName: 'Alchemical Miasma Flail',
        armorName: 'Hermetic Anti-Miasma Plate',
        shieldName: 'Astral Purifier Bulwark',
      },
      {
        name: 'Ossuary Nameless King Set',
        tierKey: 'morado',
        focusType: 'Attack',
        focusTarget: 'Total Armor Shatter',
        focusAdvantage: 'Shatters -25% enemy armor for 4s and drains 12% HP on executions.',
        weaponName: 'Ossuary War Mace',
        armorName: 'Cursed Black Obsidian Plate',
        shieldName: 'Sealed Ossuary Bulwark',
      },
      {
        name: 'Catacomb Colossus Set',
        tierKey: 'morado',
        focusType: 'Defense',
        focusTarget: 'Unstaggerable Juggernaut',
        focusAdvantage: 'Immune to light interrupts during charged swings and +16% physical mitigation.',
        weaponName: 'Gravedigger Greatmace',
        armorName: 'Colossal Bone & Iron Cuirass',
        shieldName: 'Grand Catacomb Tower Shield',
      },
      {
        name: 'Cursed Bellbearer Set',
        tierKey: 'morado',
        focusType: 'Hybrid',
        focusTarget: 'AoE Concussion + Cursed Ward',
        focusAdvantage: '2.5m shockwave stun every 8s; shield generates a 60 HP barrier on block.',
        weaponName: 'Resonant Ash Warhammer',
        armorName: 'Shadow Bellbearer Plate',
        shieldName: 'Black-Bronze Sepulcher Shield',
      },
      {
        name: 'Vestige of the Iron Titan Set',
        tierKey: 'dorado',
        focusType: 'Defense',
        focusTarget: 'Maximum Plating & 360° Guard',
        focusAdvantage: 'Reduces damage taken from behind by 30% and grants +20% block efficiency.',
        weaponName: 'Ceremonial Titan Mace',
        armorName: 'Imperial Heavy Plate of Valdris',
        shieldName: 'Supreme Golden Lion Bastion',
      },
      {
        name: 'Vestige of the Realmcrusher Set',
        tierKey: 'dorado',
        focusType: 'Attack',
        focusTarget: 'Seismic Blunt Impact',
        focusAdvantage: 'Every heavy impact ignores 40% armor and triggers a seismic stagger wave.',
        weaponName: 'Royal Demolition Greatmaul',
        armorName: 'Sovereign Golden Shock Plate',
        shieldName: 'Gilded Guardbreaker Shield',
      },
      {
        name: 'Sovereign Fortress Set',
        tierKey: 'dorado',
        focusType: 'Hybrid',
        focusTarget: 'Unstoppable Siege Breacher',
        focusAdvantage: '+18% blunt damage vs shielded foes and +25% stamina regeneration.',
        weaponName: 'Supreme Crown Greatmace',
        armorName: 'Royal Gold & Obsidian Plate',
        shieldName: 'Unbreakable Aegis of Valdris',
      },
    ],
  },
  {
    professionId: 'axe-warrior',
    professionLabel: 'Axe Warrior',
    attackSkill: 'axe',
    attackSkillLabel: 'Axe Level',
    weaponModel: 'axe',
    defaultShieldModel: 'buckler',
    baseBulk: 1.08,
    baseWeaponAtk: 19,
    baseArmorDef: 17,
    baseShieldDef: 7,
    baseBlockPct: 24,
    tintHex: '#8E5348',
    seeds: [
      {
        name: 'Coastal Chopper Set',
        tierKey: 'gris',
        focusType: 'Attack',
        focusTarget: 'Early Raw Cleave',
        focusAdvantage: '+10% raw cleave damage on the opening strike of every engagement.',
        weaponName: 'Rusted Hand Axe',
        armorName: 'Common Leather & Scale Jerkin',
        shieldName: 'Small Wooden Roundel',
      },
      {
        name: 'Spires Feller Set',
        tierKey: 'gris',
        focusType: 'Hybrid',
        focusTarget: 'Swing Tempo + Cover Break',
        focusAdvantage: '+12% damage vs wooden barricades and +6% lateral strafe speed.',
        weaponName: 'Long Woodcutter Axe',
        armorName: 'Rustic Studded Leather',
        shieldName: 'Iron-Rimmed Buckler',
      },
      {
        name: 'Tribal Warden Set',
        tierKey: 'gris',
        focusType: 'Defense',
        focusTarget: 'Early Bleed Resistance',
        focusAdvantage: '-20% incoming bleed duration and +5% base armor.',
        weaponName: 'Thick Iron Short Axe',
        armorName: 'Worn Heavy Chain Hauberk',
        shieldName: 'Hide & Iron Round Shield',
      },
      {
        name: 'Siege Woodsman Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Shield & Cover Destruction',
        focusAdvantage: '+18% bonus damage against enemy shields and Bastion Seal walls.',
        weaponName: 'Tempered Battle Axe',
        armorName: 'Riveted Vanguard Armor (4-Piece)',
        shieldName: 'Short Iron Pavise',
      },
      {
        name: 'Trench Butcher Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Sweeping Arc Hemorrhage',
        focusAdvantage: 'Heavy sweeping arcs apply stacking bleed (up to 3 stacks).',
        weaponName: 'Tempered Bearded Axe',
        armorName: 'Light High-Pauldron Cuirass',
        shieldName: 'Bladed Steel Bracer Shield',
      },
      {
        name: 'Iron Squire Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Aggressive Axe Counter-Block',
        focusAdvantage: '+10% instant counter-chop trigger chance after blocking with shield.',
        weaponName: 'Tempered Francisca Axe',
        armorName: 'Tempered Medium Steel Cuirass',
        shieldName: 'Vanguard Kite Shield',
      },
      {
        name: 'Forge-Ember Ravager Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'Fiery Cleave (Embers)',
        focusAdvantage: 'Every cleave leaves an Embers trail burning 18% bonus damage over 3s.',
        weaponName: 'Astral Embers Greataxe',
        armorName: 'Bronze Plate with Glowing Ember Veins',
        shieldName: 'Ember-Forged War Shield',
      },
      {
        name: 'Frost Berserker Set',
        tierKey: 'azul',
        focusType: 'Hybrid',
        focusTarget: 'Raw Damage + Glacial Plating',
        focusAdvantage: 'Gain +3% axe damage per 10% missing HP and +15% Frost resistance.',
        weaponName: 'Northern Frost Cleaver',
        armorName: 'Blue Ice Scaled Plate',
        shieldName: 'Runic Glacial Round Shield',
      },
      {
        name: 'Voltaic Defender Set',
        tierKey: 'azul',
        focusType: 'Defense',
        focusTarget: 'Melee Trade Damage Reduction',
        focusAdvantage: 'Reduces incoming heavy melee damage by 14% while swinging or blocking.',
        weaponName: 'Runic Copper Battle Axe',
        armorName: 'Storm-Reinforced Plate',
        shieldName: 'Astral Conductor Pavise',
      },
      {
        name: 'Abyssal Executioner Set',
        tierKey: 'morado',
        focusType: 'Attack',
        focusTarget: 'Peak Raw & Crit Cleaving',
        focusAdvantage: 'Special cleave hits for 1.45x damage and ignores 25% target armor.',
        weaponName: 'Abyssal Executioner Axe',
        armorName: 'Jagged Purple Ash-Forged Plate',
        shieldName: 'Cursed Executioner Buckler',
      },
      {
        name: 'Crimson Rampart Set',
        tierKey: 'morado',
        focusType: 'Defense',
        focusTarget: 'Squad Frontline Sustain',
        focusAdvantage: 'Blocking drains 25 HP and reduces damage by 18% when facing 2+ attackers.',
        weaponName: 'Blood Crescent Halberd-Axe',
        armorName: 'Crimson Heavy Steel Cuirass',
        shieldName: 'Crimson Tower Shield',
      },
      {
        name: 'Oathbrothers Siege Set',
        tierKey: 'morado',
        focusType: 'Hybrid',
        focusTarget: 'Bridge & Gate Squad Pressure',
        focusAdvantage: '+15% axe cleave near allies and -12% damage taken on bridges and gates.',
        weaponName: 'Cursed Double Siege Axe',
        armorName: 'Cursed Vanguard Plate',
        shieldName: 'Iron Oath Shield',
      },
      {
        name: 'Vestige of the Ash Herald Set',
        tierKey: 'dorado',
        focusType: 'Attack',
        focusTarget: 'Royal Cleave Shockwave',
        focusAdvantage: 'Impacts release a golden ash blast shredding -30% armor in a 3m radius.',
        weaponName: 'Greataxe of the Black Bell',
        armorName: 'Royal Golden-Ash Cuirass',
        shieldName: 'Sovereign Ash Aegis',
      },
      {
        name: 'Vestige of the Warlord Set',
        tierKey: 'dorado',
        focusType: 'Defense',
        focusTarget: 'Anti-Crit Immovable Plating',
        focusAdvantage: 'Reduces all incoming critical damage by 25% and never staggers on mace hits.',
        weaponName: 'Royal Golden Bastion Axe',
        armorName: 'Colossal Dark-Gold Armor',
        shieldName: 'Great Shield of the Iron Crown',
      },
      {
        name: 'Supreme Last Cleaver Set',
        tierKey: 'dorado',
        focusType: 'Hybrid',
        focusTarget: 'Throne Hall Execution',
        focusAdvantage: '+24% raw axe damage and restores 100% stamina after every kill.',
        weaponName: 'Double-Headed King Cleaver',
        armorName: 'Royal Last Cleaver Harness',
        shieldName: 'Golden-Edged Sovereign Shield',
      },
    ],
  },
  {
    professionId: 'archer',
    professionLabel: 'Archer',
    attackSkill: 'distance',
    attackSkillLabel: 'Distance Level',
    weaponModel: 'bow',
    defaultShieldModel: 'buckler',
    baseBulk: 0.9,
    baseWeaponAtk: 17,
    baseArmorDef: 13,
    baseShieldDef: 6,
    baseBlockPct: 18,
    tintHex: '#56785E',
    seeds: [
      {
        name: 'Woodland Patrol Set',
        tierKey: 'gris',
        focusType: 'Hybrid',
        focusTarget: 'Act I Mobility & Twin Volley',
        focusAdvantage: 'Zero movement penalty while aiming dual hand crossbows (1 per hand).',
        weaponName: 'Dual Rustic Yew Crossbows (1 per hand)',
        armorName: 'Cured Leather Doublet (4-Piece)',
        shieldName: 'Off-Hand Crossbow + Light Bracer',
      },
      {
        name: 'Silent Hunter Set',
        tierKey: 'gris',
        focusType: 'Attack',
        focusTarget: 'Close/Mid-Range Twin Burst',
        focusAdvantage: '+10% bolt velocity when alternating shots from both hand crossbows.',
        weaponName: 'Dual Short Hunting Crossbows (1 per hand)',
        armorName: 'Grey Stalker Cloak & Leather',
        shieldName: 'Left Crossbow + Quick-Draw Bracer',
      },
      {
        name: 'Palisade Lookout Set',
        tierKey: 'gris',
        focusType: 'Defense',
        focusTarget: 'Bolt Evasion & Roll Cover',
        focusAdvantage: '-12% incoming projectile damage and +8% dodge roll speed with dual crossbows.',
        weaponName: 'Dual Light Timber Crossbows (1 per hand)',
        armorName: 'Reinforced Lookout Gambeson',
        shieldName: 'Twin Crossbow + Forearm Buckler',
      },
      {
        name: 'Spires Tracker Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Simultaneous Reload & Headshot Crit',
        focusAdvantage: '+16% dual-crossbow reload speed and +8% critical headshot damage.',
        weaponName: 'Dual Tempered Steel Crossbows (1 per hand)',
        armorName: 'Reinforced Olive Brigandine',
        shieldName: 'Tempered Off-Hand Crossbow + Riveted Bracer',
      },
      {
        name: 'Agile Skirmisher Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Defensive Dodge & Disengage',
        focusAdvantage: 'Dodging costs 20% less stamina and cuts incoming damage by 15% mid-volley.',
        weaponName: 'Dual Rapid-Fire Hand Crossbows (1 per hand)',
        armorName: 'Light Green Scale Hauberk',
        shieldName: 'Left Crossbow + Forearm Guard',
      },
      {
        name: 'Canopy Sentinel Set',
        tierKey: 'verde',
        focusType: 'Hybrid',
        focusTarget: 'High-Ground Crossfire Advantage',
        focusAdvantage: '+14% crossfire damage when firing from +3m elevation and +10% light armor.',
        weaponName: 'Dual Compound Spire Crossbows (1 per hand)',
        armorName: 'Light Sentinel Brigandine',
        shieldName: 'Off-Hand Crossbow + Dorsal Pavise',
      },
      {
        name: 'Spires Voltaic Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'Twin Voltaic Burst & Slow',
        focusAdvantage: 'Both hands fire electrified bolts (-15% enemy speed and +12% effective range).',
        weaponName: 'Dual Voltaic Repeating Crossbows (1 per hand)',
        armorName: 'Spires Cobalt Scale Armor (4-Piece)',
        shieldName: 'Voltaic Left Crossbow + Runic Bracer',
      },
      {
        name: 'Mire Miasma Set',
        tierKey: 'azul',
        focusType: 'Defense',
        focusTarget: 'Toxic Immunity & Acoustic Stealth',
        focusAdvantage: 'Partial Miasma pool immunity (-45% DoT) and reduces PvP audio footprint to 15m.',
        weaponName: 'Dual Alchemical Miasma Crossbows (1 per hand)',
        armorName: 'Sealed Marshwalker Harness',
        shieldName: 'Off-Hand Crossbow + Purifier Bracer',
      },
      {
        name: 'Frost Falcon Set',
        tierKey: 'azul',
        focusType: 'Hybrid',
        focusTarget: 'Glacial Kiting Control',
        focusAdvantage: 'Every third alternating volley chills foes for 1.2s and boosts backpedal speed +12%.',
        weaponName: 'Dual Astral Frost Crossbows (1 per hand)',
        armorName: 'Fur & Ice Light Mail',
        shieldName: 'Glacial Left Crossbow + Crystal Bracer',
      },
      {
        name: 'Cursed Lethal Shadow Set',
        tierKey: 'morado',
        focusType: 'Attack',
        focusTarget: 'Dual Armor Piercing',
        focusAdvantage: 'Synchronized charged shots pierce 30% heavy armor and inflict bleeding.',
        weaponName: 'Dual Shadow-Ether Heavy Crossbows (1 per hand)',
        armorName: 'Spiked Cursed Leather Trenchcoat',
        shieldName: 'Shadow Left Crossbow + Dark Buckler',
      },
      {
        name: 'Ethereal Stalker Set',
        tierKey: 'morado',
        focusType: 'Defense',
        focusTarget: 'Ethereal Phase & Ranged Guard',
        focusAdvantage: 'Phase ethereal on dodge (0.5s i-frames) and +18% ranged damage reduction.',
        weaponName: 'Dual Spectral Catacomb Crossbows (1 per hand)',
        armorName: 'Purple Mist Light Mail',
        shieldName: 'Spectral Left Crossbow + Arm Aegis',
      },
      {
        name: 'Siege Crossbowman Set',
        tierKey: 'morado',
        focusType: 'Hybrid',
        focusTarget: 'Anti-Tower Shield Duelist',
        focusAdvantage: 'Twin volleys shred enemy tower shield stamina guard 25% faster.',
        weaponName: 'Dual Cursed Repeating Crossbows (1 per hand)',
        armorName: 'Reinforced Siege Brigandine',
        shieldName: 'Cursed Off-Hand Crossbow + Light Pavise',
      },
      {
        name: 'Vestige of the Abyssal Wind Set',
        tierKey: 'dorado',
        focusType: 'Attack',
        focusTarget: 'Lethal Twin-Bolt Throne Ballistics',
        focusAdvantage: '1.75x dual-bolt crits; every kill instantly reloads both crossbows and restores Ether.',
        weaponName: 'Dual Sovereign Dragon Crossbows (1 per hand)',
        armorName: 'Royal Light Armor of Valdris',
        shieldName: 'Royal Left Crossbow + Golden Bracer',
      },
      {
        name: 'Vestige of the High Tower Warden Set',
        tierKey: 'dorado',
        focusType: 'Defense',
        focusTarget: 'Mobile Deflection & Ballistic Guard',
        focusAdvantage: 'Golden bracer deflects 35% incoming projectile damage without slowing fire rate.',
        weaponName: 'Dual Royal High-Tower Crossbows (1 per hand)',
        armorName: 'Gold-Filigree Light Cuirass',
        shieldName: 'Royal Left Crossbow + Vanguard Shield',
      },
      {
        name: 'Supreme Eye of the Crown Set',
        tierKey: 'dorado',
        focusType: 'Hybrid',
        focusTarget: 'Absolute Dual-Crossbow Dominance',
        focusAdvantage: 'Marks hit targets (+15% squad damage) and grants +14% base movement speed.',
        weaponName: 'Dual Supreme Crown Crossbows (1 per hand)',
        armorName: 'Golden Royal Hunter Armor',
        shieldName: 'Royal Twin Crossbow + Eye Aegis',
      },
    ],
  },
  {
    professionId: 'wizard',
    professionLabel: 'Wizard',
    attackSkill: 'magic',
    attackSkillLabel: 'Magic Level',
    weaponModel: 'staff',
    defaultShieldModel: 'orb-ward',
    baseBulk: 0.92,
    baseWeaponAtk: 16,
    baseArmorDef: 12,
    baseShieldDef: 8,
    baseBlockPct: 22,
    tintHex: '#4E72B0',
    seeds: [
      {
        name: 'Wandering Acolyte Set',
        tierKey: 'gris',
        focusType: 'Attack',
        focusTarget: 'Starter Arcane Output',
        focusAdvantage: '+8% starter spell damage and -5% Ether consumption.',
        weaponName: 'Runestone Wooden Staff',
        armorName: 'Reinforced Traveler Robe',
        shieldName: 'Minor Grey Quartz Orb',
      },
      {
        name: 'Ruin Scribe Set',
        tierKey: 'gris',
        focusType: 'Defense',
        focusTarget: 'Ether Pool & Barrier Sustain',
        focusAdvantage: '+12% out-of-combat Ether regeneration and +6% physical mitigation.',
        weaponName: 'Iron Scribe Rod',
        armorName: 'Cloth & Light Chain Doublet',
        shieldName: 'Ironbound Defensive Tome',
      },
      {
        name: 'Ash Apprentice Set',
        tierKey: 'gris',
        focusType: 'Hybrid',
        focusTarget: 'Act I Fast Cast',
        focusAdvantage: '-10% channeling time on starter offensive runes and Ether Seals.',
        weaponName: 'Dark Iron Short Scepter',
        armorName: 'Padded Mantle with Iron Pauldrons',
        shieldName: 'Brass Guardian Focus',
      },
      {
        name: 'Tempest Sorcerer Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Chain Lightning Seals',
        focusAdvantage: '+15% Seal of Storm damage and +1 additional chain bounce.',
        weaponName: 'Tempered Conductor Scepter',
        armorName: 'Fine-Plated Green Battlerobe',
        shieldName: 'Voltaic Amber Focus Orb',
      },
      {
        name: 'Ward Conjurer Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Magic Resist & Bastion Walls',
        focusAdvantage: 'Seal of Bastion gains +25% wall durability and you take -12% magic damage.',
        weaponName: 'Green Crystal Conduit Staff',
        armorName: 'Light Conjurer Breastplate',
        shieldName: 'Tempered Crystal Aegis',
      },
      {
        name: 'Battle Scholar Set',
        tierKey: 'verde',
        focusType: 'Hybrid',
        focusTarget: 'Medium Plating + Magic Power',
        focusAdvantage: 'Cast Ether Seals at full walk speed and gain +60 max Ether capacity.',
        weaponName: 'Etched Steel Scepter',
        armorName: 'Tempered Scholar Half-Mail',
        shieldName: 'Green Runic Buckler Focus',
      },
      {
        name: 'Astral Alchemy Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'Amplified ML Elemental Scaling',
        focusAdvantage: 'Infuses spells with Voltaic/Embers and boosts Magic Level scaling by +18%.',
        weaponName: 'Scepter of Astral Ash',
        armorName: 'Runic-Plated Astral Mantle',
        shieldName: 'Lesser Crystal Aegis',
      },
      {
        name: 'Arcane Gravity Set',
        tierKey: 'azul',
        focusType: 'Defense',
        focusTarget: 'Area Denial & Aegis Ward',
        focusAdvantage: '+20% Seal of Gravity radius and +15% Seal of Aegis barrier capacity.',
        weaponName: 'Astral Anchor Staff',
        armorName: 'Dark Sapphire Light Plate',
        shieldName: 'Gravity Barrier Orb',
      },
      {
        name: 'Fiery Cataclysm Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'AoE Siege Detonation',
        focusAdvantage: 'Seal of Cataclysm deals +22% damage to structures and burns 4s longer.',
        weaponName: 'Concentrated Ember Scepter',
        armorName: 'Blue-Flame Runic Vestments',
        shieldName: 'Astral Cinder Focus',
      },
      {
        name: 'Cursed Shadowlance Set',
        tierKey: 'morado',
        focusType: 'Attack',
        focusTarget: 'Single-Target Spell Execution',
        focusAdvantage: 'Seal of Execution ignores 35% armor and refunds 3s cooldown on hit.',
        weaponName: 'Cursed Execution Scepter',
        armorName: 'Shadowed Runic-Weave Armor',
        shieldName: 'Cursed Grimoire of Valdris',
      },
      {
        name: 'Ethereal Archconjurer Set',
        tierKey: 'morado',
        focusType: 'Defense',
        focusTarget: 'Permanent Ether Mana-Shield',
        focusAdvantage: 'Converts 20% incoming damage to Ether drain; Translation turns you ethereal.',
        weaponName: 'Purple Mist Greatstaff',
        armorName: 'Obsidian Arcane Plate',
        shieldName: 'Floating Pure Aegis Shield',
      },
      {
        name: 'Cursed Tempest Set',
        tierKey: 'morado',
        focusType: 'Hybrid',
        focusTarget: 'Rapid 3-Seal Rotation',
        focusAdvantage: '-15% cooldown across all 3 equipped Seals and +18% elemental resistance.',
        weaponName: 'Supreme Storm Rod',
        armorName: 'Armored Violet-Ash Mantle',
        shieldName: 'Sealed Storm Orb',
      },
      {
        name: 'Vestige of the Archmagister Set',
        tierKey: 'dorado',
        focusType: 'Attack',
        focusTarget: 'Supreme Throne-Hall Arcana',
        focusAdvantage: '+28% damage on all offensive spells; Execution & Cataclysm ignite golden trails.',
        weaponName: 'Royal Scepter of Golden Ash',
        armorName: 'Imperial Archmagister Plate',
        shieldName: 'Sovereign Crown Orb',
      },
      {
        name: 'Vestige of the Astral Citadel Set',
        tierKey: 'dorado',
        focusType: 'Defense',
        focusTarget: 'Arcane Immunity & Reflective Ward',
        focusAdvantage: 'Seal of Aegis absorbs +40% more damage and reflects 25% as voltaic shock.',
        weaponName: 'Throne Guardian Greatstaff',
        armorName: 'Royal Gold-Runed Plate',
        shieldName: 'Royal Floating Aegis of Valdris',
      },
      {
        name: 'Supreme Lord of Ether Set',
        tierKey: 'dorado',
        focusType: 'Hybrid',
        focusTarget: 'Endless Act V Ether Flow',
        focusAdvantage: 'Every cast refunds 15% Ether after 2s and accelerates casting speed by +20%.',
        weaponName: 'Grand Scepter of the First Arcanist',
        armorName: 'Supreme Gold & Ether Harness',
        shieldName: 'Sovereign Focus of the Last Relic',
      },
    ],
  },
  {
    professionId: 'druid',
    professionLabel: 'Druid',
    attackSkill: 'magic',
    attackSkillLabel: 'Magic Level',
    weaponModel: 'totem-staff',
    defaultShieldModel: 'orb-ward',
    baseBulk: 0.96,
    baseWeaponAtk: 14,
    baseArmorDef: 15,
    baseShieldDef: 10,
    baseBlockPct: 26,
    tintHex: '#4E8C62',
    seeds: [
      {
        name: 'Coastal Herbalist Set',
        tierKey: 'gris',
        focusType: 'Defense',
        focusTarget: 'Starter Healing & Survival',
        focusAdvantage: '+12% healing potency on Vitality Vials and starter restoration spells.',
        weaponName: 'Gnarled Ash Crook',
        armorName: 'Common Leather & Moss Tunic',
        shieldName: 'Living-Wood Shield Charm',
      },
      {
        name: 'Forest Wayfarer Set',
        tierKey: 'gris',
        focusType: 'Hybrid',
        focusTarget: 'Act I Cleansing & Mobility',
        focusAdvantage: '+15% poison resistance and +5% stamina regeneration.',
        weaponName: 'Light Root-Carved Staff',
        armorName: 'Green Traveler Gambeson',
        shieldName: 'Reinforced Bark Buckler',
      },
      {
        name: 'Rustic Thornweaver Set',
        tierKey: 'gris',
        focusType: 'Attack',
        focusTarget: 'Early Nature Attrition',
        focusAdvantage: '+9% nature magic damage against unshielded targets.',
        weaponName: 'Iron-Bound Thorn Rod',
        armorName: 'Leather Breastplate with Pauldrons',
        shieldName: 'Common Bone Totem Focus',
      },
      {
        name: 'Spires Ranger-Druid Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Squad Heal Armor Buff',
        focusAdvantage: 'Applied heals grant targets +10% temporary armor for 4s.',
        weaponName: 'Tempered Living-Wood Staff',
        armorName: 'Green Leather & Iron Harness',
        shieldName: 'Living Oak Round Shield',
      },
      {
        name: 'Mire Purifier Set',
        tierKey: 'verde',
        focusType: 'Defense',
        focusTarget: 'Anti-Miasma Immunity & Ward',
        focusAdvantage: 'Cuts Miasma poison damage by 35% and boosts Purifying Vials by +20%.',
        weaponName: 'Bronze Purifier Scepter',
        armorName: 'Sealed Anti-Miasma Scale Coat',
        shieldName: 'Green Amber Aegis',
      },
      {
        name: 'Rootbound Shaman Set',
        tierKey: 'verde',
        focusType: 'Attack',
        focusTarget: 'Area Control & Thorns',
        focusAdvantage: 'Seal of Gravity deals continuous nature DoT scaled by Magic Level.',
        weaponName: 'Lesser Astral Root Totem',
        armorName: 'Ritual Warden Brigandine',
        shieldName: 'Runestone Nature Focus',
      },
      {
        name: 'Astral Sap Set',
        tierKey: 'azul',
        focusType: 'Defense',
        focusTarget: 'Squad AoE Restoration (ML)',
        focusAdvantage: '+22% Seal of Restoration output and shares healing within a 6m radius.',
        weaponName: 'Luminous Sap Greatstaff',
        armorName: 'Emerald-Filigree Light Plate',
        shieldName: 'Emerald Ether Orb',
      },
      {
        name: 'White-Ash Sentinel Set',
        tierKey: 'azul',
        focusType: 'Hybrid',
        focusTarget: 'Healing Bastion + Cleanse',
        focusAdvantage: 'Seal of Bastion heals nearby allies for 18 HP/s and grants +15% elemental resist.',
        weaponName: 'Astral Oak Scepter',
        armorName: 'Blue-Scale Medium Harness',
        shieldName: 'Runebark Kite Shield',
      },
      {
        name: 'Blighted Miasma Set',
        tierKey: 'azul',
        focusType: 'Attack',
        focusTarget: 'Corrosive Miasma DoT',
        focusAdvantage: 'Spells inflict corrosive Miasma (-15% enemy healing & armor for 4s).',
        weaponName: 'Astral Spore Rod',
        armorName: 'Dark Astral Swamp Cuirass',
        shieldName: 'Crystal Venom Totem',
      },
      {
        name: 'Cursed Stolen-Life Set',
        tierKey: 'morado',
        focusType: 'Hybrid',
        focusTarget: 'Squad Arcane Lifesteal',
        focusAdvantage: '18% of all magic damage dealt heals the lowest-HP ally in your squad.',
        weaponName: 'Crimson-Sap Ossuary Staff',
        armorName: 'Cursed Black-Bark Plate',
        shieldName: 'Preservation Crimson Orb',
      },
      {
        name: 'Undying Grove Guardian Set',
        tierKey: 'morado',
        focusType: 'Defense',
        focusTarget: 'Barriers & Crit Reduction',
        focusAdvantage: '+28% Seal of Aegis duration and -22% damage taken inside The Abyssal Ash.',
        weaponName: 'Sacred Catacomb Crook',
        armorName: 'Heavy Iron & Moss Cuirass',
        shieldName: 'Living Obsidian Greatshield',
      },
      {
        name: 'Elderwood Wrath Set',
        tierKey: 'morado',
        focusType: 'Attack',
        focusTarget: 'Offensive Nature Sorcery',
        focusAdvantage: '+20% control spell damage and shatters enemy wooden/crystal shields.',
        weaponName: 'Ancestral Fury Totem',
        armorName: 'Black-Thorn Scaled Plate',
        shieldName: 'Cursed Living-Root Focus',
      },
      {
        name: 'Vestige of the White Tree Set',
        tierKey: 'dorado',
        focusType: 'Defense',
        focusTarget: 'Supreme Act V Preservation',
        focusAdvantage: 'Seal of Restoration heals +35% in AoE and cleanses all Miasma & bleed stacks.',
        weaponName: 'Grand Royal Staff of the White Tree',
        armorName: 'Royal Golden-Leaf Plate',
        shieldName: 'Sovereign Aegis of Eternal Life',
      },
      {
        name: 'Vestige of the Verdant Tempest Set',
        tierKey: 'dorado',
        focusType: 'Attack',
        focusTarget: 'Elemental Chain Detonation',
        focusAdvantage: '+26% chain spell damage; Gravity fields detonate on expiration.',
        weaponName: 'Elder Crown Totem Scepter',
        armorName: 'Golden Royal Thorn Cuirass',
        shieldName: 'Living-Ash Golden Orb',
      },
      {
        name: 'Supreme Custodian of Valdris Set',
        tierKey: 'dorado',
        focusType: 'Hybrid',
        focusTarget: 'Perfect Healing + Damage Balance',
        focusAdvantage: 'Projects a constant +12% armor squad aura and +20% Magic Level power.',
        weaponName: 'Supreme Staff of the First Druid',
        armorName: 'Imperial Custodian Harness',
        shieldName: 'Royal Shield of the Verdant Oath',
      },
    ],
  },
];

function getHelmStyle(tierKey: QualityTierKey, professionId: WarriorArchetypeId): Helm3DStyle {
  if (professionId === 'archer' && (tierKey === 'gris' || tierKey === 'verde')) {
    return 'hooded';
  }
  if (professionId === 'wizard' || professionId === 'druid') {
    if (tierKey === 'gris' || tierKey === 'verde') return 'hooded';
    if (tierKey === 'dorado') return 'crowned';
    return 'winged';
  }
  if (tierKey === 'gris') return 'open';
  if (tierKey === 'verde') return 'nasal';
  if (tierKey === 'azul') return 'winged';
  if (tierKey === 'morado') return 'horned';
  return 'crowned';
}

const SET_DESIGN_ARTWORK = {
  // Common Grey (Tier 1)
  commonSword: '/src/assets/images/design_common_militia_1794866344038.jpg',
  commonClub: '/src/assets/images/club_common_gris_1794866766119.jpg',
  commonAxe: '/src/assets/images/axe_common_gris_1794866767001.jpg',
  archerCommonDual: '/src/assets/images/archer_common_dual_1794866400265.jpg',
  commonAcolyte: '/src/assets/images/design_common_acolyte_1794866344860.jpg',
  commonDruid: '/src/assets/images/druid_common_gris_1794866780692.jpg',
  // Tempered Green (Tier 2)
  greenSword: '/src/assets/images/design_green_brigandine_1794866345739.jpg',
  greenClubHammer: '/src/assets/images/design_green_hammer_1794866345927.jpg',
  greenAxe: '/src/assets/images/axe_green_verde_1794866766634.jpg',
  archerGreenDual: '/src/assets/images/archer_green_dual_1794866401333.jpg',
  greenWizard: '/src/assets/images/wizard_green_scholar_1794866771000.jpg',
  // Astral Blue (Tier 3)
  blueSword: '/src/assets/images/set_3d_sword_warrior_1794866044091.jpg',
  blueFrostSword: '/src/assets/images/blue_frost_knight_1794866405059.jpg',
  blueClub: '/src/assets/images/club_blue_astral_1794866767108.jpg',
  blueEmberAxe: '/src/assets/images/blue_ember_berserker_1794866405825.jpg',
  blueFrostAxe: '/src/assets/images/axe_blue_frost_1794866768723.jpg',
  blueBronzeAxe: '/src/assets/images/set_3d_axe_warrior_1794866044857.jpg',
  archerBlueDual: '/src/assets/images/archer_blue_dual_1794866401810.jpg',
  blueWizard: '/src/assets/images/set_3d_wizard_1794866046119.jpg',
  blueDruid: '/src/assets/images/set_3d_druid_1794866045747.jpg',
  // Cursed Purple (Tier 4)
  purpleSword: '/src/assets/images/design_purple_executioner_1794866346655.jpg',
  purpleClub: '/src/assets/images/set_3d_club_warrior_1794866044520.jpg',
  purpleAxe: '/src/assets/images/axe_purple_morado_1794866768149.jpg',
  archerPurpleDual: '/src/assets/images/archer_purple_dual_1794866401837.jpg',
  purpleNecromage: '/src/assets/images/design_purple_necromage_1794866348385.jpg',
  purpleDruid: '/src/assets/images/druid_purple_cursed_1794866771101.jpg',
  // Royal Gold (Tier 5)
  goldSword: '/src/assets/images/design_gold_sovereign_1794866348165.jpg',
  goldClub: '/src/assets/images/gold_titan_mace_1794866403815.jpg',
  goldAxe: '/src/assets/images/design_gold_warlord_1794866348771.jpg',
  archerGoldDual: '/src/assets/images/archer_gold_dual_v2_1794866421057.jpg',
  goldWizard: '/src/assets/images/design_gold_archmage_1794866349586.jpg',
  goldDruid: '/src/assets/images/gold_druid_oak_1794866405000.jpg',
} as const;

function resolveSetArtwork(
  professionId: WarriorArchetypeId,
  tierKey: QualityTierKey,
  setNumber: number,
  _focusType: SetFocusType
): { designImageSrc: string; visualDesignNote: string } {
  if (professionId === 'sword-warrior') {
    if (tierKey === 'gris') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.commonSword,
        visualDesignNote: 'Rusted chainmail, iron kettle helm, shortsword, and wooden buckler',
      };
    }
    if (tierKey === 'verde') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.greenSword,
        visualDesignNote: 'Riveted olive brigandine, nasal spangenhelm, bastard sword, and kite shield',
      };
    }
    if (tierKey === 'azul') {
      return {
        designImageSrc:
          setNumber === 8
            ? SET_DESIGN_ARTWORK.blueFrostSword
            : SET_DESIGN_ARTWORK.blueSword,
        visualDesignNote:
          setNumber === 8
            ? 'Glacial steel cuirass with frost crystals, horned helm, and ice-edged blade'
            : 'Astral blue plate with winged gold helm, runic greatsword, and kite shield',
      };
    }
    if (tierKey === 'morado') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.purpleSword,
        visualDesignNote: 'Spiked black obsidian armor, tattered cloak, and abyssal purple greatsword',
      };
    }
    return {
      designImageSrc: SET_DESIGN_ARTWORK.goldSword,
      visualDesignNote: 'Imperial black-and-gold filigree plate, crowned helm, and royal greatsword',
    };
  }

  if (professionId === 'club-warrior') {
    if (tierKey === 'gris') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.commonClub,
        visualDesignNote: 'Padded gambeson, rusted iron pauldrons, kettle helm, iron-shod club, and plank shield',
      };
    }
    if (tierKey === 'verde') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.greenClubHammer,
        visualDesignNote: 'Riveted green steel plate, sallet helm, warhammer, and iron pavise shield',
      };
    }
    if (tierKey === 'azul') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.blueClub,
        visualDesignNote: 'Cobalt plate with horned helm, glowing blue voltaic mace, and runic kite shield',
      };
    }
    if (tierKey === 'morado') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.purpleClub,
        visualDesignNote: 'Heavy horned ossuary armor, violet runic greatmace, and cursed tower shield',
      };
    }
    return {
      designImageSrc: SET_DESIGN_ARTWORK.goldClub,
      visualDesignNote: 'Colossal imperial gold-obsidian armor, titan greatmace, and lion tower shield',
    };
  }

  if (professionId === 'axe-warrior') {
    if (tierKey === 'gris') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.commonAxe,
        visualDesignNote: 'Fur and leather over worn mail, iron cap, bearded hand axe, and wooden roundel',
      };
    }
    if (tierKey === 'verde') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.greenAxe,
        visualDesignNote: 'Olive studded brigandine, spangenhelm, tempered battle axe, and kite shield',
      };
    }
    if (tierKey === 'azul') {
      return {
        designImageSrc:
          setNumber === 7
            ? SET_DESIGN_ARTWORK.blueEmberAxe
            : setNumber === 8
            ? SET_DESIGN_ARTWORK.blueFrostAxe
            : SET_DESIGN_ARTWORK.blueBronzeAxe,
        visualDesignNote:
          setNumber === 7
            ? 'Charred bronze plates with glowing ember veins, fiery greataxe, and forged shield'
            : setNumber === 8
            ? 'Blue glacial scaled armor with frost shards, ice axe, and runic round shield'
            : 'Dark vanguard steel plates, runic double battle axe, and buckler',
      };
    }
    if (tierKey === 'morado') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.purpleAxe,
        visualDesignNote: 'Spiked obsidian armor with violet runes, abyssal double-axe, and black shield',
      };
    }
    return {
      designImageSrc: SET_DESIGN_ARTWORK.goldAxe,
      visualDesignNote: 'Colossal gold-and-obsidian plating, winged pauldrons, and royal double-headed axe',
    };
  }

  if (professionId === 'archer') {
    if (tierKey === 'gris') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.archerCommonDual,
        visualDesignNote: 'Coarse wool hood, worn leather doublet, and 1 rustic crossbow per hand',
      };
    }
    if (tierKey === 'verde') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.archerGreenDual,
        visualDesignNote: 'Olive brigandine with steel pauldrons and 1 tempered crossbow per hand',
      };
    }
    if (tierKey === 'azul') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.archerBlueDual,
        visualDesignNote: 'Cobalt scaled armor, runic eye mask, and 1 voltaic repeating crossbow per hand',
      };
    }
    if (tierKey === 'morado') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.archerPurpleDual,
        visualDesignNote: 'Spiked shadow trenchcoat, violet cowl mask, and 1 cursed crossbow per hand',
      };
    }
    return {
      designImageSrc: SET_DESIGN_ARTWORK.archerGoldDual,
      visualDesignNote: 'Imperial gold-and-ebony brigandine, crowned hood, and 1 royal crossbow per hand',
    };
  }

  if (professionId === 'wizard') {
    if (tierKey === 'gris') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.commonAcolyte,
        visualDesignNote: 'Patched grey robes, rusted iron pauldron, gnarled staff, and tome',
      };
    }
    if (tierKey === 'verde') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.greenWizard,
        visualDesignNote: 'Green battlerobe with steel pauldrons, crystal staff, and runic orb',
      };
    }
    if (tierKey === 'azul') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.blueWizard,
        visualDesignNote: 'Blue-and-gold astral vestments with crystalline scepter and geometric orb',
      };
    }
    if (tierKey === 'morado') {
      return {
        designImageSrc: SET_DESIGN_ARTWORK.purpleNecromage,
        visualDesignNote: 'Arcane obsidian plates, horned mask, and chained cursed grimoire',
      };
    }
    return {
      designImageSrc: SET_DESIGN_ARTWORK.goldWizard,
      visualDesignNote: 'Imperial white-and-gold vestments, solar crown, and floating astrolabe',
    };
  }

  // druid
  if (tierKey === 'gris') {
    return {
      designImageSrc: SET_DESIGN_ARTWORK.commonDruid,
      visualDesignNote: 'Herbalist leather and moss, wooden pauldrons, ash crook, and bark charm',
    };
  }
  if (tierKey === 'verde' || tierKey === 'azul') {
    return {
      designImageSrc: SET_DESIGN_ARTWORK.blueDruid,
      visualDesignNote: 'Living-bark armor plates, stag-antler crown, and emerald totem staff',
    };
  }
  if (tierKey === 'morado') {
    return {
      designImageSrc: SET_DESIGN_ARTWORK.purpleDruid,
      visualDesignNote: 'Thorny obsidian bark, dark antlers, ossuary totem staff, and crimson orb',
    };
  }
  return {
    designImageSrc: SET_DESIGN_ARTWORK.goldDruid,
    visualDesignNote: 'Royal white-ash and gold vestments, golden stag crown, and emerald orb',
  };
}

function getShieldModel(
  tierKey: QualityTierKey,
  focusType: SetFocusType,
  defaultShield: Shield3DModelType
): Shield3DModelType {
  if (defaultShield === 'orb-ward') return 'orb-ward';
  if (focusType === 'Defense' && (tierKey === 'morado' || tierKey === 'dorado')) {
    return 'tower';
  }
  if (focusType === 'Attack' && (tierKey === 'gris' || tierKey === 'verde')) {
    return 'buckler';
  }
  return defaultShield;
}

export const EQUIPMENT_SETS: EquipmentSetSpec[] = PROFESSION_BLUEPRINTS.flatMap((prof) =>
  prof.seeds.map((seed, idx) => {
    const curve = PROGRESSION_CURVE[idx];
    const template = TIER_TEMPLATES[seed.tierKey];
    const tierFactor = idx; // 0..14

    const atkBoost = seed.focusType === 'Attack' ? 4 : seed.focusType === 'Hybrid' ? 2 : 0;
    const defBoost = seed.focusType === 'Defense' ? 9 : seed.focusType === 'Hybrid' ? 4 : 0;
    const blockBoost = seed.focusType === 'Defense' ? 6 : seed.focusType === 'Hybrid' ? 2 : 0;

    const weaponAttack = Math.round(prof.baseWeaponAtk + tierFactor * 3.2 + atkBoost);
    const armorDefense = Math.round(prof.baseArmorDef + tierFactor * 5.3 + defBoost);
    const shieldDefense = Math.round(
      prof.baseShieldDef + tierFactor * 2.7 + (seed.focusType === 'Defense' ? 5 : 1)
    );
    const baseShieldBlockPct = Math.min(
      68,
      Math.round(prof.baseBlockPct + tierFactor * 2.3 + blockBoost)
    );

    const pauldronScale =
      0.85 +
      tierFactor * 0.032 +
      (seed.focusType === 'Defense' ? 0.08 : 0) +
      (prof.baseBulk - 1) * 0.4;

    const silhouetteBulk =
      prof.baseBulk + tierFactor * 0.012 + (seed.focusType === 'Defense' ? 0.06 : 0);

    const artworkMeta = resolveSetArtwork(
      prof.professionId,
      seed.tierKey,
      idx + 1,
      seed.focusType
    );

    return {
      id: `set-${prof.professionId}-${String(idx + 1).padStart(2, '0')}`,
      setNumber: idx + 1,
      professionId: prof.professionId,
      professionLabel: prof.professionLabel,
      name: seed.name,
      tierKey: seed.tierKey,
      tierLabel: template.tierLabel,
      tierHex: template.tierHex,
      archetypeTitle: `${prof.professionLabel} · Set ${idx + 1}/15`,
      focusType: seed.focusType,
      focusTarget: seed.focusTarget,
      focusAdvantage: seed.focusAdvantage,
      minGeneralLevel: curve.minLv,
      attackSkill: prof.attackSkill,
      attackSkillLabel: prof.attackSkillLabel,
      minAttackMastery: curve.minMastery,
      minDefenseLevel:
        seed.focusType === 'Defense'
          ? Math.min(95, curve.minDef + 3)
          : curve.minDef,
      weaponName: seed.weaponName,
      weaponAttack,
      armorName: seed.armorName,
      armorDefense,
      shieldName: seed.shieldName,
      shieldDefense,
      baseShieldBlockPct,
      setBonus: `${seed.focusTarget}: ${seed.focusAdvantage}`,
      designImageSrc: artworkMeta.designImageSrc,
      visualDesignNote: artworkMeta.visualDesignNote,
      visual3D: {
        weaponModel: prof.weaponModel,
        shieldModel: getShieldModel(seed.tierKey, seed.focusType, prof.defaultShieldModel),
        helmStyle: getHelmStyle(seed.tierKey, prof.professionId),
        pauldronScale,
        silhouetteBulk,
        primaryHex: seed.tierKey === 'gris' ? prof.tintHex : template.tierPrimary,
        secondaryHex: template.tierSecondary,
        trimHex: template.tierTrim,
        emissiveHex: template.tierEmissive,
        emissiveIntensity: template.emissiveIntensity,
        metalness: template.metalness,
        roughness: template.roughness,
      },
    };
  })
);

export const PROFESSION_SET_LIST: {
  id: WarriorArchetypeId;
  label: string;
  skillLabel: string;
}[] = [
  { id: 'sword-warrior', label: 'Sword Warrior', skillLabel: 'Sword Level' },
  { id: 'club-warrior', label: 'Club Warrior', skillLabel: 'Club Level' },
  { id: 'axe-warrior', label: 'Axe Warrior', skillLabel: 'Axe Level' },
  { id: 'archer', label: 'Archer', skillLabel: 'Distance Level' },
  { id: 'wizard', label: 'Wizard', skillLabel: 'Magic Level' },
  { id: 'druid', label: 'Druid', skillLabel: 'Magic Level' },
];

export const PROFESSION_3D_RENDER_ASSETS: Record<WarriorArchetypeId, string> = {
  'sword-warrior': '/src/assets/images/set_3d_sword_warrior_1794866044091.jpg',
  'club-warrior': '/src/assets/images/set_3d_club_warrior_1794866044520.jpg',
  'axe-warrior': '/src/assets/images/set_3d_axe_warrior_1794866044857.jpg',
  archer: '/src/assets/images/archer_blue_dual_1794866401810.jpg',
  wizard: '/src/assets/images/set_3d_wizard_1794866046119.jpg',
  druid: '/src/assets/images/set_3d_druid_1794866045747.jpg',
};
