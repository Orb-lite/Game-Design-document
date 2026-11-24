import { useState } from 'react';
import { Award, Crown, HeartHandshake, RotateCcw, Timer } from 'lucide-react';
import {
  MATCH_ACTS,
  VICTORY_HIERARCHY_RANKS,
  computeMatchExpBreakdown,
  computeSquadContributionScore,
  type SquadMateInput,
  type VictoryRankSpec,
} from '../data/gddData';
import { MediaFrame } from './MediaFrame';

type SquadSizeMode = 4 | 3 | 2;

const INITIAL_SQUAD: SquadMateInput[] = [
  {
    id: 'p1',
    name: 'Aldric',
    role: 'Axe Warrior',
    kills: 11,
    assists: 4,
    teamHealingHp: 320,
    minutesAlive: 17.5,
  },
  {
    id: 'p2',
    name: 'Lyra',
    role: 'Archer (Dual Crossbows)',
    kills: 8,
    assists: 7,
    teamHealingHp: 180,
    minutesAlive: 17.5,
  },
  {
    id: 'p3',
    name: 'Kaelen',
    role: 'Druid (Healing & Aegis)',
    kills: 4,
    assists: 11,
    teamHealingHp: 2450,
    minutesAlive: 17.5,
  },
  {
    id: 'p4',
    name: 'Vorn',
    role: 'Club Warrior (Bastion)',
    kills: 3,
    assists: 9,
    teamHealingHp: 640,
    minutesAlive: 16.0,
  },
];

function getAssignedRank(
  sortedIndex: number,
  squadSize: SquadSizeMode
): VictoryRankSpec {
  if (sortedIndex === 0) return VICTORY_HIERARCHY_RANKS[0]; // King
  if (squadSize === 2) return VICTORY_HIERARCHY_RANKS[3]; // Last on team -> Sergeant
  if (sortedIndex === 1) return VICTORY_HIERARCHY_RANKS[1]; // Captain
  if (squadSize === 3 && sortedIndex === 2) return VICTORY_HIERARCHY_RANKS[2]; // Colonel
  return sortedIndex === 2 ? VICTORY_HIERARCHY_RANKS[2] : VICTORY_HIERARCHY_RANKS[3];
}

export function MatchCycleSection() {
  const [selectedActId, setSelectedActId] = useState<string>(MATCH_ACTS[4].id);
  const [squadSize, setSquadSize] = useState<SquadSizeMode>(4);
  const [squadMembers, setSquadMembers] = useState<SquadMateInput[]>(INITIAL_SQUAD);

  const activeAct = MATCH_ACTS.find((a) => a.id === selectedActId) ?? MATCH_ACTS[0];
  const activeIndex = MATCH_ACTS.findIndex((a) => a.id === activeAct.id);

  const visibleMembers = squadMembers.slice(0, squadSize);
  const rankedSquad = [...visibleMembers]
    .map((m) => ({
      ...m,
      score: computeSquadContributionScore(m),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.kills !== a.kills) return b.kills - a.kills;
      if (b.assists !== a.assists) return b.assists - a.assists;
      return b.teamHealingHp - a.teamHealingHp;
    })
    .map((member, idx) => {
      const rank = getAssignedRank(idx, squadSize);
      const exp = computeMatchExpBreakdown(member, rank.expBonusPct);
      return {
        ...member,
        position: idx + 1,
        rank,
        exp,
      };
    });

  const updateMemberStat = (
    id: string,
    field: 'kills' | 'assists' | 'teamHealingHp' | 'minutesAlive',
    value: number
  ) => {
    setSquadMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              [field]: Number.isNaN(value) ? 0 : Math.max(0, value),
            }
          : m
      )
    );
  };

  return (
    <section id="ciclo" className="border-t border-white/10 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#9C968B] uppercase">
              02 · The 5-Act Match Loop (15-18 Minutes) &amp; Victory Coronation
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
              Tactical Pacing of The Abyssal Ash
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#B8B1A6]">
            Two hundred Warriors converge from the outer coasts to the Throne Hall. Starting in Act
            IV, the Black Bell locks respawns - and the winning squad crowns its ranks in Act V.
          </p>
        </div>

        {/* Interactive 5-Act Segmented Selector */}
        <div
          className="mb-8 grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-[#141417] p-1.5 sm:grid-cols-5"
          role="tablist"
          aria-label="Select match act"
        >
          {MATCH_ACTS.map((act) => {
            const isSelected = act.id === activeAct.id;
            return (
              <button
                key={act.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedActId(act.id)}
                className={`flex flex-col items-start rounded-md px-3.5 py-2.5 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C89B3C] ${
                  isSelected
                    ? 'bg-[#222228] text-[#F6EFE2]'
                    : 'text-[#9C968B] hover:bg-white/[0.04] hover:text-[#EAE6DF]'
                }`}
              >
                <span className="font-mono-tabular text-[11px] text-[#C89B3C] whitespace-nowrap">
                  {act.number} · {act.timeRange}
                </span>
                <span className="mt-0.5 text-sm font-semibold whitespace-nowrap truncate max-w-full">
                  {act.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Progress track */}
        <div className="mb-10 h-1 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div
            className="h-full bg-[#C89B3C] transition-all duration-300"
            style={{ width: `${((activeIndex + 1) / MATCH_ACTS.length) * 100}%` }}
          />
        </div>

        {/* Selected Act Detail Split */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-5 lg:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9C968B]">
                <span className="font-semibold text-[#C89B3C]">{activeAct.number}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{activeAct.timeRange}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{activeAct.survivors}</span>
              </div>

              <h3 className="font-display mt-3 text-2xl font-semibold text-[#F6EFE2]">
                {activeAct.name}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-[#D4CEC3]">
                {activeAct.summary}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-medium tracking-wider text-[#9C968B] uppercase">
                  World Rules &amp; Dynamics
                </p>
                <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#B8B1A6]">
                  {activeAct.keyEvents.map((ev) => (
                    <li key={ev} className="flex items-start gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-[#C89B3C]" aria-hidden="true" />
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
              <span className="text-[#9C968B]">Respawn Status (Oath Mode)</span>
              <span
                className={`font-semibold ${
                  activeAct.respawnActive ? 'text-[#EAE6DF]' : 'text-[#E06C5A]'
                }`}
              >
                {activeAct.respawnStatus}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7">
            <MediaFrame
              src={activeAct.image}
              alt={`${activeAct.number}: ${activeAct.name}`}
              caption={activeAct.caption}
              aspectClass="aspect-video lg:h-full"
            />
          </div>
        </div>

        {/* Full 5-Act Reference Table */}
        <div className="mt-10 overflow-x-auto rounded-lg border border-white/10 bg-[#141417]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs tracking-wider text-[#9C968B] uppercase">
                <th className="px-5 py-3.5 font-medium">Act</th>
                <th className="px-5 py-3.5 font-medium">Time</th>
                <th className="px-5 py-3.5 font-medium">Survivors</th>
                <th className="px-5 py-3.5 font-medium">Respawn Rule</th>
                <th className="px-5 py-3.5 font-medium">Core Dynamic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-[#D4CEC3]">
              {MATCH_ACTS.map((act) => {
                const isRowActive = act.id === activeAct.id;
                return (
                  <tr
                    key={act.id}
                    onClick={() => setSelectedActId(act.id)}
                    className={`cursor-pointer transition-colors ${
                      isRowActive ? 'bg-white/[0.05]' : 'hover:bg-white/[0.025]'
                    }`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-[#F6EFE2] whitespace-nowrap">
                      {act.number}: {act.name}
                    </td>
                    <td className="font-mono-tabular px-5 py-3.5 text-xs text-[#C89B3C] whitespace-nowrap">
                      {act.timeRange}
                    </td>
                    <td className="font-mono-tabular px-5 py-3.5 text-xs whitespace-nowrap">
                      {act.survivors}
                    </td>
                    <td
                      className={`px-5 py-3.5 text-xs font-medium whitespace-nowrap ${
                        act.respawnActive ? 'text-[#B8B1A6]' : 'text-[#E06C5A]'
                      }`}
                    >
                      {act.respawnStatus}
                    </td>
                    <td className="px-5 py-3.5 text-xs leading-relaxed text-[#9C968B]">
                      {act.summary}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Winning Squad Coronation Hierarchy & Contribution EXP Simulator */}
        <div className="mt-14 rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                Throne Hall Coronation · Oath Mode Victory Hierarchy
              </p>
              <h3 className="font-display mt-1.5 text-2xl font-semibold text-[#F6EFE2]">
                King, Captain, Colonel &amp; Sergeant - Contribution &amp; Survival EXP
              </h3>
              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[#B8B1A6]">
                On the winning squad, the player with the highest eliminations &amp; contribution is
                crowned <strong className="text-[#D4AF37]">King</strong>, 2nd becomes{' '}
                <strong className="text-[#F6EFE2]">Captain</strong>, 3rd becomes{' '}
                <strong className="text-[#C89B3C]">Colonel</strong>, and the last member is named{' '}
                <strong className="text-[#4F9E68]">Sergeant</strong>.{' '}
                <strong className="text-[#F6EFE2]">Assists</strong>,{' '}
                <strong className="text-[#F6EFE2]">Team Healing Magic</strong>, and{' '}
                <strong className="text-[#F6EFE2]">Time Alive</strong> all count toward rank and
                post-match EXP.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0F0F12] p-1"
                role="tablist"
                aria-label="Select winning squad size"
              >
                {(
                  [
                    [4, 'Quad (4)'],
                    [3, 'Trio (3)'],
                    [2, 'Duo (2)'],
                  ] as [SquadSizeMode, string][]
                ).map(([sz, label]) => (
                  <button
                    key={sz}
                    type="button"
                    role="tab"
                    aria-selected={squadSize === sz}
                    onClick={() => setSquadSize(sz)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      squadSize === sz
                        ? 'bg-[#C89B3C] font-semibold text-[#0B0B0D]'
                        : 'text-[#9C968B] hover:text-[#EAE6DF]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSquadMembers(INITIAL_SQUAD)}
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-[#0F0F12] px-3 py-2 text-xs text-[#D4CEC3] transition-colors hover:border-white/30 hover:text-[#F6EFE2]"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset Squad</span>
              </button>
            </div>
          </div>

          {/* 4 Hierarchy Rank Cards */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {VICTORY_HIERARCHY_RANKS.map((rank) => (
              <div
                key={rank.id}
                className="rounded-md border border-white/10 bg-[#0F0F12] p-4"
                style={{ borderTopWidth: '2px', borderTopColor: rank.accentHex }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-[#9C968B]">
                    {rank.orderLabel}
                  </span>
                  {rank.id === 'king' ? (
                    <Crown className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  ) : (
                    <Award
                      className="h-4 w-4 shrink-0"
                      style={{ color: rank.accentHex }}
                      aria-hidden="true"
                    />
                  )}
                </div>
                <p
                  className="font-display mt-1 text-lg font-bold"
                  style={{ color: rank.accentHex }}
                >
                  {rank.title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#B8B1A6]">{rank.rule}</p>
                <p className="font-mono-tabular mt-2 border-t border-white/[0.06] pt-2 text-[11px] text-[#D4CEC3]">
                  {rank.ceremonyReward}
                </p>
              </div>
            ))}
          </div>

          {/* Live Editable Winning Squad Simulator */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Editable Stats for Squadmates */}
            <div className="space-y-2.5 lg:col-span-6">
              <div className="flex items-center justify-between text-xs text-[#9C968B]">
                <span className="font-semibold text-[#EAE6DF]">
                  Edit Winning Squad Match Telemetry
                </span>
                <span>Kills · Assists · Healing · Time Alive</span>
              </div>

              {visibleMembers.map((member) => (
                <div
                  key={member.id}
                  className="rounded-md border border-white/10 bg-[#0F0F12] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-[#F6EFE2]">{member.name}</span>{' '}
                      <span className="text-[#9C968B]">· {member.role}</span>
                    </div>
                    <span className="font-mono-tabular text-[11px] text-[#C89B3C]">
                      Score {computeSquadContributionScore(member)}
                    </span>
                  </div>

                  <div className="mt-2.5 grid grid-cols-4 gap-2 text-[11px]">
                    <label className="block">
                      <span className="text-[#9C968B]">Kills</span>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={member.kills}
                        onChange={(e) =>
                          updateMemberStat(member.id, 'kills', Number(e.target.value))
                        }
                        className="font-mono-tabular mt-1 w-full rounded border border-white/15 bg-[#141417] px-2 py-1 text-xs text-[#F6EFE2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[#9C968B]">Assists</span>
                      <input
                        type="number"
                        min={0}
                        max={99}
                        value={member.assists}
                        onChange={(e) =>
                          updateMemberStat(member.id, 'assists', Number(e.target.value))
                        }
                        className="font-mono-tabular mt-1 w-full rounded border border-white/15 bg-[#141417] px-2 py-1 text-xs text-[#F6EFE2]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[#9C968B]">Heal (HP)</span>
                      <input
                        type="number"
                        min={0}
                        max={20000}
                        step={50}
                        value={member.teamHealingHp}
                        onChange={(e) =>
                          updateMemberStat(member.id, 'teamHealingHp', Number(e.target.value))
                        }
                        className="font-mono-tabular mt-1 w-full rounded border border-white/15 bg-[#141417] px-2 py-1 text-xs text-[#4F9E68]"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[#9C968B]">Alive (m)</span>
                      <input
                        type="number"
                        min={0}
                        max={25}
                        step={0.5}
                        value={member.minutesAlive}
                        onChange={(e) =>
                          updateMemberStat(member.id, 'minutesAlive', Number(e.target.value))
                        }
                        className="font-mono-tabular mt-1 w-full rounded border border-white/15 bg-[#141417] px-2 py-1 text-xs text-[#3E82C7]"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Live Ranked Crown Results & EXP Payout */}
            <div className="rounded-md border border-white/10 bg-[#0F0F12] p-4 lg:col-span-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <span className="text-xs font-semibold text-[#F6EFE2]">
                  Live Throne Hall Coronation &amp; Match EXP Payout
                </span>
                <div className="flex items-center gap-3 text-[11px] text-[#9C968B]">
                  <span className="inline-flex items-center gap-1">
                    <HeartHandshake className="h-3.5 w-3.5 text-[#4F9E68]" aria-hidden="true" />
                    Healing counts
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Timer className="h-3.5 w-3.5 text-[#3E82C7]" aria-hidden="true" />
                    +20 EXP/min alive
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-2.5">
                {rankedSquad.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded border border-white/[0.08] bg-[#141417] p-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="rounded px-2 py-0.5 text-[11px] font-bold text-[#0B0B0D]"
                          style={{ backgroundColor: entry.rank.accentHex }}
                        >
                          #{entry.position} · {entry.rank.title}
                        </span>
                        <span className="font-semibold text-[#F6EFE2]">{entry.name}</span>
                        <span className="text-[11px] text-[#9C968B]">({entry.role})</span>
                      </div>
                      <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                        +{entry.exp.totalExp.toLocaleString('en-US')} EXP
                      </span>
                    </div>

                    <div className="font-mono-tabular mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] pt-2 text-[11px] text-[#B8B1A6]">
                      <span>
                        Score {entry.score} ({entry.kills}K / {entry.assists}A /{' '}
                        {entry.teamHealingHp} Heal)
                      </span>
                      <span>
                        Combat {entry.exp.combatExp} + Heal {entry.exp.healingSupportExp} + Alive{' '}
                        {entry.exp.timeAliveExp} + Rank +{entry.exp.rankBonusExp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
