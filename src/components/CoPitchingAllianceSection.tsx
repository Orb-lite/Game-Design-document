import { Briefcase, CheckCircle2, Layers, Milestone, ShieldCheck, TrendingUp } from 'lucide-react';
import { CO_PITCHING_ALLIANCE } from '../data/gddData';

export function CoPitchingAllianceSection() {
  return (
    <section id="alliance" className="border-t border-white/10 py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
              08 · {CO_PITCHING_ALLIANCE.eyebrow}
            </p>
            <h2 className="font-display mt-2 text-3xl font-semibold text-[#F6EFE2] text-balance lg:text-4xl">
              {CO_PITCHING_ALLIANCE.title}
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-[#B8B1A6]">
            {CO_PITCHING_ALLIANCE.lead}
          </p>
        </div>

        {/* 4-Column Executive Deal Strip */}
        <dl className="grid grid-cols-2 gap-4 border-y border-white/10 py-6 lg:grid-cols-4">
          {CO_PITCHING_ALLIANCE.executiveMetrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-xs text-[#9C968B]">{metric.label}</dt>
              <dd className="font-mono-tabular mt-1 text-lg font-semibold text-[#F6EFE2]">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        {/* 1. Division of Labor (Phase 1 — Vertical Slice) */}
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
            <h3 className="font-display text-xl font-semibold text-[#F6EFE2]">
              Division of Labor (Phase 1 — Vertical Slice)
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {CO_PITCHING_ALLIANCE.divisionOfLabor.map((track) => {
              const isGold = track.accent === 'gold';
              return (
                <div
                  key={track.role}
                  className={`rounded-lg border p-6 lg:p-7 ${
                    isGold
                      ? 'border-[#C89B3C]/45 bg-[#141417]'
                      : 'border-[#4F9E68]/40 bg-[#141417]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-display text-lg font-semibold text-[#F6EFE2]">
                      {track.role}
                    </h4>
                    <span
                      className={`font-mono-tabular rounded border px-2.5 py-1 text-[11px] font-semibold ${
                        isGold
                          ? 'border-[#C89B3C]/50 bg-[#C89B3C]/15 text-[#F6EFE2]'
                          : 'border-[#4F9E68]/50 bg-[#4F9E68]/15 text-[#9AE0AF]'
                      }`}
                    >
                      {track.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#D4CEC3]">{track.summary}</p>

                  <ul className="mt-4 space-y-2.5 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#B8B1A6]">
                    {track.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2
                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                            isGold ? 'text-[#C89B3C]' : 'text-[#4F9E68]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Studio Value Proposition & Return on Investment */}
        <div className="mt-10 rounded-lg border border-[#C89B3C]/35 bg-[#141417] p-6 lg:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            <span>Studio Value Proposition &amp; Commercial Return</span>
          </div>
          <h3 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
            {CO_PITCHING_ALLIANCE.studioValueReturn.headline}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#D4CEC3]">
            {CO_PITCHING_ALLIANCE.studioValueReturn.summary}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {CO_PITCHING_ALLIANCE.studioValueReturn.pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-md border border-white/10 bg-[#0F0F12] p-4"
              >
                <p className="text-xs font-semibold text-[#C89B3C]">{pillar.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#B8B1A6]">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Testing & Scaling Roadmap */}
        <div className="mt-10 rounded-lg border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
                <Milestone className="h-4 w-4" aria-hidden="true" />
                <span>Incremental Engineering Validation</span>
              </div>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[#F6EFE2]">
                {CO_PITCHING_ALLIANCE.testingRoadmap.title}
              </h3>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-[#B8B1A6]">
              {CO_PITCHING_ALLIANCE.testingRoadmap.subtitle}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {CO_PITCHING_ALLIANCE.testingRoadmap.milestones.map((m, idx) => (
              <div
                key={m.phase}
                className={`rounded-md border p-5 ${
                  idx === 0
                    ? 'border-[#C89B3C]/50 bg-[#0F0F12]'
                    : 'border-white/10 bg-[#0F0F12]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tabular text-xs font-bold text-[#C89B3C] uppercase">
                    {m.phase}
                  </span>
                  <span className="text-[11px] font-medium text-[#9C968B]">{m.status}</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-[#D4CEC3]">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Strict Vertical Slice Scope Cut & 5. Current Technical Status */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Strict Vertical Slice Cut (10-15 min) */}
          <div className="rounded-lg border border-white/10 bg-[#141417] p-6 lg:col-span-7 lg:p-7">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
              <Layers className="h-4 w-4" aria-hidden="true" />
              <span>Zero Speculative Bloat</span>
            </div>
            <h3 className="font-display mt-2 text-xl font-semibold text-[#F6EFE2]">
              {CO_PITCHING_ALLIANCE.verticalSliceScope.title}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#B8B1A6]">
              {CO_PITCHING_ALLIANCE.verticalSliceScope.rationale}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {CO_PITCHING_ALLIANCE.verticalSliceScope.pillars.map((item) => (
                <div
                  key={item.slot}
                  className="rounded-md border border-white/10 bg-[#0F0F12] p-4"
                >
                  <p className="font-mono-tabular text-[11px] font-semibold text-[#C89B3C] uppercase">
                    {item.slot}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#F6EFE2]">{item.name}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-[#9C968B]">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Technical Status (Playable Prototype) */}
          <div className="flex flex-col justify-between rounded-lg border border-[#4F9E68]/35 bg-[#141417] p-6 lg:col-span-5 lg:p-7">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#9AE0AF] uppercase">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                <span>Live UE5 Engineering State</span>
              </div>
              <h3 className="font-display mt-2 text-xl font-semibold text-[#F6EFE2]">
                {CO_PITCHING_ALLIANCE.currentTechnicalStatus.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#B8B1A6]">
                {CO_PITCHING_ALLIANCE.currentTechnicalStatus.summary}
              </p>

              <ul className="mt-4 space-y-3 border-t border-white/10 pt-4 text-xs leading-relaxed text-[#D4CEC3]">
                {CO_PITCHING_ALLIANCE.currentTechnicalStatus.points.map((pt) => (
                  <li key={pt.label} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-[#4F9E68]"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="text-[#F6EFE2]">{pt.label}: </strong>
                      <span className="text-[#B8B1A6]">{pt.detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
