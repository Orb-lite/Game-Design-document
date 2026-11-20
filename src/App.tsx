import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { AllSetsDesignTab } from './components/AllSetsDesignTab';
import { BestiaryTab } from './components/BestiaryTab';
import { BiomesAndMathSection } from './components/BiomesAndMathSection';
import { BiomesTab } from './components/BiomesTab';
import { EtherSealsSection } from './components/EtherSealsSection';
import { LootAndPveSection } from './components/LootAndPveSection';
import { MatchCycleSection } from './components/MatchCycleSection';
import { MediaFrame } from './components/MediaFrame';
import { PitchDeckModal } from './components/PitchDeckModal';
import {
  FICHA_TECNICA,
  GAME_MODES,
  GENERATED_ASSETS,
  PITCH_DECK_SLIDES,
  type PlayerCombatProfile,
} from './data/gddData';
import { exportMainPageToPdf } from './utils/mainPagePdf';
import { exportPitchDeckToPdf } from './utils/pitchDeckPdf';

type MainViewTab = 'overview' | 'sets' | 'biomes' | 'bestiary';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainViewTab>('overview');
  const [isDeckOpen, setIsDeckOpen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [pdfProgress, setPdfProgress] = useState<string | null>(null);
  const [mainPagePdfProgress, setMainPagePdfProgress] = useState<string | null>(null);
  const [selectedModeId, setSelectedModeId] = useState<'juramento' | 'errante'>('juramento');
  const [playerProfile, setPlayerProfile] = useState<PlayerCombatProfile>({
    generalLevel: 100,
    swordLevel: 82,
    clubLevel: 34,
    axeLevel: 45,
    distanceLevel: 48,
    magicLevel: 65,
    defenseLevel: 60,
    weaponMasteryPct: 75,
    swordXp: 40,
    clubXp: 15,
    axeXp: 25,
    distanceXp: 30,
    magicXp: 50,
    defenseXp: 35,
    offensiveSpellCasts: 6,
    supportSpellCasts: 4,
  });

  const handleTrainAttack = (skill: 'sword' | 'club' | 'axe' | 'distance') => {
    setPlayerProfile((prev) => {
      const xpGain = 50;
      const next = { ...prev };
      const xpKey = `${skill}Xp` as 'swordXp' | 'clubXp' | 'axeXp' | 'distanceXp';
      const lvKey = `${skill}Level` as 'swordLevel' | 'clubLevel' | 'axeLevel' | 'distanceLevel';
      let totalXp = prev[xpKey] + xpGain;
      let levelsGained = 0;
      while (totalXp >= 100) {
        totalXp -= 100;
        levelsGained += 1;
      }
      next[xpKey] = totalXp;
      next[lvKey] = Math.min(150, prev[lvKey] + levelsGained);
      if (levelsGained > 0) {
        next.generalLevel = Math.min(300, prev.generalLevel + levelsGained);
      }
      return next;
    });
  };

  const handleTrainDefense = () => {
    setPlayerProfile((prev) => {
      let totalDefXp = prev.defenseXp + 50;
      let levelsGained = 0;
      while (totalDefXp >= 100) {
        totalDefXp -= 100;
        levelsGained += 1;
      }
      return {
        ...prev,
        defenseXp: totalDefXp,
        defenseLevel: Math.min(150, prev.defenseLevel + levelsGained),
        generalLevel:
          levelsGained > 0
            ? Math.min(300, prev.generalLevel + levelsGained)
            : prev.generalLevel,
      };
    });
  };

  const handleCastSpell = (kind: 'offensive' | 'support') => {
    setPlayerProfile((prev) => {
      let totalMagicXp = prev.magicXp + 50;
      let levelsGained = 0;
      while (totalMagicXp >= 100) {
        totalMagicXp -= 100;
        levelsGained += 1;
      }
      return {
        ...prev,
        magicXp: totalMagicXp,
        magicLevel: Math.min(150, prev.magicLevel + levelsGained),
        generalLevel:
          levelsGained > 0
            ? Math.min(300, prev.generalLevel + levelsGained)
            : prev.generalLevel,
        offensiveSpellCasts:
          kind === 'offensive' ? prev.offensiveSpellCasts + 1 : prev.offensiveSpellCasts,
        supportSpellCasts:
          kind === 'support' ? prev.supportSpellCasts + 1 : prev.supportSpellCasts,
      };
    });
  };

  const openDeckAt = (index: number) => {
    setActiveSlideIndex(index);
    setIsDeckOpen(true);
  };

  const handleDownloadPitchDeckPdf = async () => {
    if (pdfProgress) return;
    try {
      setPdfProgress('Preparing PDF...');
      await exportPitchDeckToPdf(
        PITCH_DECK_SLIDES,
        GENERATED_ASSETS.heroCitadel,
        (current, total) => {
          setPdfProgress(`Generating PDF (${current}/${total})...`);
        }
      );
    } finally {
      setPdfProgress(null);
    }
  };

  const handleDownloadMainPagePdf = async () => {
    if (mainPagePdfProgress) return;
    try {
      setMainPagePdfProgress('Preparing Page PDF...');
      await exportMainPageToPdf((current, total) => {
        setMainPagePdfProgress(`Exporting Page (${current}/${total})...`);
      });
    } finally {
      setMainPagePdfProgress(null);
    }
  };

  const switchTab = (nextTab: MainViewTab) => {
    setActiveTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeMode =
    GAME_MODES.find((m) => m.id === selectedModeId) ?? GAME_MODES[0];

  const tabDefinitions: { id: MainViewTab; label: string }[] = [
    { id: 'overview', label: 'Master Document' },
    { id: 'sets', label: '90 Launch Skins' },
    { id: 'biomes', label: 'Biomes' },
    { id: 'bestiary', label: 'Bestiary' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#EAE6DF]">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0D]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5 md:gap-8">
          {/* Zone 1: Brand mark + wordmark */}
          <button
            type="button"
            onClick={() => switchTab('overview')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0"
          >
            <img
              src={GENERATED_ASSETS.gameLogo}
              alt="Valdris Chronicle: Last Relic Episode I emblem"
              referrerPolicy="no-referrer"
              className="h-8 w-11 rounded border border-[#C89B3C]/40 bg-[#08080A] object-cover"
            />
            <span className="font-display text-lg font-semibold tracking-tight text-[#F6EFE2]">
              The Last Relic
            </span>
          </button>

          {/* Zone 2: Top-Level Interactive View Tabs */}
          <nav
            className="hidden md:flex items-center gap-1 rounded-lg border border-white/10 bg-[#141417] p-1 text-xs font-semibold"
            aria-label="Primary application tabs"
            role="tablist"
          >
            {tabDefinitions.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => switchTab(tab.id)}
                  className={`rounded-md px-3.5 py-1.5 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#C89B3C] text-[#0B0B0D]'
                      : 'text-[#B8B1A6] hover:text-[#F6EFE2]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => openDeckAt(0)}
              className="rounded-md bg-[#C89B3C] px-4 py-2 text-xs font-semibold text-[#0B0B0D] whitespace-nowrap shrink-0 transition-colors hover:bg-[#D9AC4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C89B3C]"
            >
              Present Pitch Deck
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-white/10 px-6 py-2 md:hidden">
          {tabDefinitions.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#C89B3C] text-[#0B0B0D]'
                    : 'bg-[#141417] text-[#B8B1A6]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Section Quick-Jump Bar when on Master Document */}
        {activeTab === 'overview' && (
          <div className="border-t border-white/[0.06] bg-[#0D0D10] px-6 py-2">
            <div className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto text-[11px] font-medium text-[#9C968B]">
              <a href="#universo" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                Universe &amp; Modes
              </a>
              <a href="#ciclo" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                5-Act Loop &amp; Coronation
              </a>
              <a href="#botin" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                Gear, Mastery &amp; PvE
              </a>
              <a href="#sellos" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                Ether Seals
              </a>
              <a href="#biomas" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                Biomes Preview
              </a>
              <a href="#matematica" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                UE5 Math &amp; Balance
              </a>
              <a href="#pitch-deck" className="whitespace-nowrap shrink-0 hover:text-[#F6EFE2]">
                Pitch Deck (12 Slides)
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {activeTab === 'sets' ? (
          <AllSetsDesignTab />
        ) : activeTab === 'biomes' ? (
          <BiomesTab onOpenBestiary={() => switchTab('bestiary')} />
        ) : activeTab === 'bestiary' ? (
          <BestiaryTab onOpenBiomes={() => switchTab('biomes')} />
        ) : (
          <>
            {/* Hero Section & Section 01: Universe & Technical Sheet */}
            <section id="universo" className="relative overflow-hidden pb-16 pt-10 lg:pb-24 lg:pt-14">
          <div className="mx-auto max-w-6xl px-6">
            {/* Hero Focal Carrier */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#141417]">
              <div className="aspect-[16/9] w-full max-h-[560px]">
                <img
                  src={GENERATED_ASSETS.heroCitadel}
                  alt="The Citadel of Valdris under The Abyssal Ash"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/65 to-transparent"
                aria-hidden="true"
              />
              <div className="relative z-10 -mt-36 px-6 pb-8 sm:-mt-44 sm:px-10 sm:pb-10 lg:-mt-52">
                <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                  Original IP Edition · 2026-11-16 · World of Valdris
                </p>
                <h1 className="font-display mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#F6EFE2] text-balance sm:text-5xl lg:text-6xl">
                  The Last Relic
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D4CEC3] sm:text-base">
                  Tactical TPS Battle Royale / Dark Medieval Action / PvPvE for 200 Players in
                  Unreal Engine 5. Two hundred souls descend upon Valdris beneath The Abyssal Ash
                  to claim The Iron Crown.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openDeckAt(0)}
                    className="rounded-md bg-[#C89B3C] px-5 py-2.5 text-sm font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C89B3C]"
                  >
                    Open Pitch Deck ({PITCH_DECK_SLIDES.length} Slides)
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(mainPagePdfProgress)}
                    onClick={handleDownloadMainPagePdf}
                    className="inline-flex items-center gap-2 rounded-md border border-[#C89B3C]/70 bg-[#1B1812]/90 px-5 py-2.5 text-sm font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/20 disabled:opacity-60"
                  >
                    <FileText className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                    <span>{mainPagePdfProgress ?? 'Download Main Page PDF'}</span>
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(pdfProgress)}
                    onClick={handleDownloadPitchDeckPdf}
                    className="inline-flex items-center gap-2 rounded-md border border-[#C89B3C]/45 bg-[#141417]/90 px-5 py-2.5 text-sm font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/15 disabled:opacity-60"
                  >
                    <Download className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                    <span>{pdfProgress ?? 'Download Pitch Deck PDF'}</span>
                  </button>
                  <a
                    href="#ciclo"
                    className="rounded-md border border-white/20 px-5 py-2.5 text-sm font-medium text-[#F6EFE2] transition-colors hover:bg-white/[0.06]"
                  >
                    Explore Master Document
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#9C968B] italic">
              Figure 1: Key Art — The Citadel of Valdris under The Abyssal Ash.
            </p>

            {/* 4-Column Structural Strip */}
            <dl className="mt-10 grid grid-cols-2 gap-4 border-y border-white/10 py-6 lg:grid-cols-4">
              <div>
                <dt className="text-xs text-[#9C968B]">Match Scale</dt>
                <dd className="font-mono-tabular mt-1 text-2xl font-semibold text-[#F6EFE2]">
                  200 Players
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#9C968B]">5-Act Match Loop</dt>
                <dd className="font-mono-tabular mt-1 text-2xl font-semibold text-[#F6EFE2]">
                  15–18 Minutes
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#9C968B]">Gold Tier Cap (Mastery)</dt>
                <dd className="font-mono-tabular mt-1 text-2xl font-semibold text-[#D4AF37]">
                  35% Base · 50% All Lv.100
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#9C968B]">Engine &amp; Replication</dt>
                <dd className="font-mono-tabular mt-1 text-2xl font-semibold text-[#F6EFE2]">
                  UE5 · 50–80m
                </dd>
              </div>
            </dl>

            {/* Technical Sheet + Game Modes */}
            <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Technical Identification Sheet */}
              <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-6 lg:p-8">
                <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                  Registry &amp; Technical Specification
                </p>
                <h2 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
                  Work Identification Sheet
                </h2>

                <dl className="mt-6 divide-y divide-white/[0.08]">
                  {FICHA_TECNICA.map((entry) => (
                    <div key={entry.label} className="py-3 first:pt-0 last:pb-0">
                      <dt className="text-xs text-[#9C968B]">{entry.label}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-[#EAE6DF]">
                        {entry.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Official IP & Studio Logos Lockup */}
                <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
                  <figure className="overflow-hidden rounded-lg border border-white/10 bg-[#0B0B0D]">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={GENERATED_ASSETS.gameLogo}
                        alt="Valdris Chronicle: Last Relic (Episode I) Official Game Logo"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="border-t border-white/10 px-3 py-2 text-[11px] font-medium text-[#EAE6DF]">
                      Official Title Crest · Valdris Chronicle: Last Relic (Episode I)
                    </figcaption>
                  </figure>
                  <figure className="overflow-hidden rounded-lg border border-white/10 bg-[#0B0B0D]">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={GENERATED_ASSETS.studioLogo}
                        alt="Dimpz Games Official Studio Emblem"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <figcaption className="border-t border-white/10 px-3 py-2 text-[11px] font-medium text-[#C89B3C]">
                      Studio Emblem · Dimpz Games
                    </figcaption>
                  </figure>
                </div>

                <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#B8B1A6]">
                  All original gameplay systems, the continent of Valdris, The Abyssal Ash, the
                  5-Act tactical loop, 5 Quality Tiers, 8 Ether Seals, PvE monster ecosystem, 4
                  strategic biomes, deterministic server math, multi-layer anti-cheat defense, and
                  attached Commercial Pitch Deck constitute the original work{' '}
                  <span className="text-[#F6EFE2]">The Last Relic</span> by{' '}
                  <span className="font-semibold text-[#C89B3C]">Dimpz Games</span>.
                </p>
              </div>

              {/* 01. Universe & Game Modes */}
              <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-6 lg:p-8">
                <div>
                  <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                    01 · Universe, Identity &amp; Game Modes
                  </p>
                  <h2 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
                    The Cursed Continent of Valdris
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#D4CEC3] first-letter:float-left first-letter:mr-2.5 first-letter:font-display first-letter:text-4xl first-letter:font-bold first-letter:text-[#C89B3C]">
                    Across the cursed continent of Valdris, every blood moon unleashes The Abyssal
                    Ash—an arcane storm born from the kingdom&apos;s ancient broken oath. No fixed
                    classes or rigid bloodlines bind you: your discipline is forged by the steel
                    and Ether Seals you wield.
                  </p>

                  {/* Interactive Mode Switch */}
                  <div
                    className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-[#0F0F12] p-1"
                    role="tablist"
                    aria-label="Select game mode"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedModeId === 'juramento'}
                      onClick={() => setSelectedModeId('juramento')}
                      className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                        selectedModeId === 'juramento'
                          ? 'bg-[#222228] text-[#F6EFE2]'
                          : 'text-[#9C968B] hover:text-[#EAE6DF]'
                      }`}
                    >
                      Oath Mode (Squads)
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={selectedModeId === 'errante'}
                      onClick={() => setSelectedModeId('errante')}
                      className={`rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                        selectedModeId === 'errante'
                          ? 'bg-[#222228] text-[#F6EFE2]'
                          : 'text-[#9C968B] hover:text-[#EAE6DF]'
                      }`}
                    >
                      Wanderer Mode (Solo 1v199)
                    </button>
                  </div>

                  <div className="mt-5 rounded-md border border-white/10 bg-[#0F0F12] p-5">
                    <p className="text-xs font-semibold text-[#C89B3C]">{activeMode.subtitle}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#EAE6DF]">
                      {activeMode.summary}
                    </p>
                    <ul className="mt-4 space-y-2 text-xs leading-relaxed text-[#B8B1A6]">
                      {activeMode.rules.map((rule) => (
                        <li key={rule} className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#C89B3C]" aria-hidden="true" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 text-xs sm:grid-cols-2">
                  <div>
                    <dt className="text-[#9C968B]">Respawn Window</dt>
                    <dd className="mt-0.5 font-semibold text-[#F6EFE2]">
                      {activeMode.respawnWindow}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#9C968B]">Victory Condition</dt>
                    <dd className="mt-0.5 font-semibold text-[#F6EFE2]">
                      {activeMode.winCondition}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: 5-Act Match Cycle */}
        <MatchCycleSection />

        {/* Section 03 & 05: Loot Tiers, Mastery 35% -> 50% Cap Simulator & PvE Difficulty */}
        <LootAndPveSection
          profile={playerProfile}
          onChangeProfile={setPlayerProfile}
          onTrainAttack={handleTrainAttack}
          onTrainDefense={handleTrainDefense}
          onCastSpell={handleCastSpell}
        />

        {/* Section 04: 8 Ether Seals & 3-Slot Loadout Builder */}
        <EtherSealsSection
          profile={playerProfile}
          onChangeProfile={setPlayerProfile}
          onCastSpell={handleCastSpell}
        />

        {/* Section 06, 07 & 08: Biomes, Math Simulator, Balance Tables & UE5 */}
        <BiomesAndMathSection
          profile={playerProfile}
          onChangeProfile={setPlayerProfile}
        />

        {/* Annex: Commercial Pitch Deck (12 Slides) */}
        <section id="pitch-deck" className="border-t border-white/10 py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs tracking-widest text-[#9C968B] uppercase">
                  Annex · Commercial Pitch Deck ({PITCH_DECK_SLIDES.length} Slides)
                </p>
                <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
                  Executive Presentation for Partners &amp; Publishers
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 self-start">
                <button
                  type="button"
                  disabled={Boolean(pdfProgress)}
                  onClick={handleDownloadPitchDeckPdf}
                  className="inline-flex items-center gap-2 rounded-md border border-[#C89B3C]/60 bg-[#C89B3C]/15 px-4 py-2 text-xs font-semibold text-[#F6EFE2] whitespace-nowrap transition-colors hover:bg-[#C89B3C]/25 disabled:opacity-60"
                >
                  <Download className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                  <span>{pdfProgress ?? 'Download Pitch Deck (PDF 16:9)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => openDeckAt(0)}
                  className="rounded-md bg-[#C89B3C] px-4 py-2 text-xs font-semibold text-[#0B0B0D] whitespace-nowrap transition-colors hover:bg-[#D9AC4A]"
                >
                  Launch Presentation Mode
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {PITCH_DECK_SLIDES.map((slide, idx) => (
                <article
                  key={slide.index}
                  className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#141417] p-6"
                >
                  <div>
                    <div className="mb-4">
                      {slide.showcaseItems && slide.showcaseItems.length > 0 ? (
                        <div className="rounded-lg border border-white/10 bg-[#0D0D10] p-3">
                          {slide.showcaseTitle && (
                            <p className="mb-2 text-[11px] font-semibold tracking-wider text-[#C89B3C] uppercase">
                              {slide.showcaseTitle}
                            </p>
                          )}
                          <div
                            className={`grid gap-2 ${
                              slide.showcaseItems.length === 6 ? 'grid-cols-3' : 'grid-cols-5'
                            }`}
                          >
                            {slide.showcaseItems.map((item) => (
                              <div
                                key={item.label}
                                className="overflow-hidden rounded border border-white/10 bg-[#08080A]"
                              >
                                <div className="aspect-[4/3] w-full overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.label}
                                    referrerPolicy="no-referrer"
                                    className="h-full w-full object-cover object-top"
                                  />
                                </div>
                                <div
                                  className="border-t-2 px-1.5 py-1"
                                  style={{ borderTopColor: item.accentHex }}
                                >
                                  <p className="truncate text-[10px] font-semibold text-[#F6EFE2]">
                                    {item.label}
                                  </p>
                                  <p className="truncate text-[9px] text-[#9C968B]">
                                    {item.sublabel}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <MediaFrame
                          src={slide.image}
                          alt={slide.title}
                          aspectClass="aspect-video"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#9C968B]">
                      <span className="font-mono-tabular text-[#C89B3C]">{slide.code}</span>
                      <span>{slide.section}</span>
                    </div>
                    <h3 className="font-display mt-2 text-xl font-semibold text-[#F6EFE2]">
                      {slide.title}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-[#EAE6DF] italic">
                      {slide.keyMessage}
                    </p>
                    <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#B8B1A6]">
                      {slide.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#C89B3C]" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => openDeckAt(idx)}
                    className="mt-5 self-start text-xs font-semibold text-[#C89B3C] underline-offset-4 hover:underline"
                  >
                    Expand Slide {String(slide.index).padStart(2, '0')}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 text-xs text-[#9C968B] sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <img
              src={GENERATED_ASSETS.studioLogo}
              alt="Dimpz Games Studio Emblem"
              referrerPolicy="no-referrer"
              className="h-7 w-10 rounded border border-white/15 bg-[#08080A] object-cover"
            />
            <div>
              <span className="font-display font-semibold text-[#EAE6DF]">The Last Relic</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span className="font-semibold text-[#C89B3C]">Dimpz Games</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Original IP Edition · World of Valdris</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => switchTab('overview')}
              className="hover:text-[#EAE6DF]"
            >
              Master Document
            </button>
            <button
              type="button"
              onClick={() => switchTab('sets')}
              className="hover:text-[#EAE6DF]"
            >
              90 Launch Skins
            </button>
            <button
              type="button"
              onClick={() => switchTab('biomes')}
              className="hover:text-[#EAE6DF]"
            >
              Biomes
            </button>
            <button
              type="button"
              onClick={() => switchTab('bestiary')}
              className="hover:text-[#EAE6DF]"
            >
              Bestiary
            </button>
            <button
              type="button"
              disabled={Boolean(mainPagePdfProgress)}
              onClick={handleDownloadMainPagePdf}
              className="text-[#C89B3C] hover:underline disabled:opacity-60"
            >
              {mainPagePdfProgress ?? 'Download Main Page PDF'}
            </button>
            <button
              type="button"
              onClick={() => openDeckAt(0)}
              className="hover:text-[#EAE6DF]"
            >
              Pitch Deck
            </button>
          </div>
        </div>
      </footer>

      <PitchDeckModal
        isOpen={isDeckOpen}
        activeSlideIndex={activeSlideIndex}
        onChangeSlide={setActiveSlideIndex}
        onClose={() => setIsDeckOpen(false)}
      />
    </div>
  );
}
