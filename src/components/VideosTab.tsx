import { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Copy, Film, Layers, Play, Share2, ShieldAlert } from 'lucide-react';
import { CO_PITCHING_ALLIANCE, GENERATED_ASSETS } from '../data/gddData';

interface VideosTabProps {
  onOpenAlliance?: () => void;
}

const PIPELINE_VIDEO_SLOTS = [
  {
    code: 'CAPTURE 01 · AVAILABLE NOW',
    status: 'Live Testbed',
    accent: '#4F9E68',
    title: 'Standalone Combat, Inventory Loot & Set Data Preview',
    summary:
      'Milestone 0 UE5 Standalone (64-bit Windows) verification build. Intentionally uses placeholder UI, art, and terrain strictly to test combat attacks, inventory loot pickups, and live set stat bindings.',
  },
  {
    code: 'CAPTURE 02 · PHASE 1 MILESTONE',
    status: 'Work in Progress',
    accent: '#C89B3C',
    title: 'Catacombs Vertical Slice & Small-Squad Co-Op / PvP Netcode',
    summary:
      'Work in progress (2-3 month Partner Art Studio pass): adding Dark Medieval PBR lighting, rigged/animated Sword & Shield and Dual Hand Crossbow warriors, final HUD, and 2-4 player co-op / PvP stress tests.',
  },
  {
    code: 'CAPTURE 03 · PUBLISHER PITCH',
    status: 'Work in Progress',
    accent: '#3E82C7',
    title: '60-90s Executive Publisher Vertical Slice Trailer',
    summary:
      'Work in progress: cinematic gameplay cut featuring the 10-15 minute Catacombs run, Black Bell Executioner boss encounter, and climax relic spoils drop ahead of full 18-24 month commercial funding.',
  },
] as const;

export function VideosTab({ onOpenAlliance }: VideosTabProps) {
  const [copiedTarget, setCopiedTarget] = useState<'page' | 'clip' | null>(null);

  const sharePageUrl =
    typeof window !== 'undefined' ? `${window.location.origin}/videos` : '/videos';
  const directVideoUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${GENERATED_ASSETS.ue5PrototypePreviewVideo}`
      : GENERATED_ASSETS.ue5PrototypePreviewVideo;

  const copyShareUrl = async (url: string, target: 'page' | 'clip') => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedTarget(target);
      window.setTimeout(() => {
        setCopiedTarget((prev) => (prev === target ? null : prev));
      }, 2200);
    } catch {
      // Clipboard blocked in restricted iframe context
    }
  };

  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header Banner */}
        <div className="rounded-xl border border-white/10 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <p className="text-xs tracking-widest text-[#C89B3C] uppercase">
                  Unreal Engine 5 · Playable Engineering &amp; Pitch Captures
                </p>
                <span className="rounded border border-[#C89B3C]/50 bg-[#C89B3C]/15 px-2 py-0.5 font-mono-tabular text-[10px] font-bold tracking-wider text-[#F6EFE2] uppercase">
                  Work in Progress
                </span>
              </div>
              <h1 className="font-display mt-2 text-3xl font-bold text-[#F6EFE2] text-balance lg:text-4xl">
                Gameplay &amp; Prototype Videos
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#B8B1A6]">
                Direct engine captures from <span className="text-[#F6EFE2]">Valdris Chronicle: Last Relic</span>{' '}
                (work in progress). Shows live engineering testbeds under active development prior
                to Partner Art Studio visual polish, final UI/UX, and Phase 1 biome art.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  void copyShareUrl(sharePageUrl, 'page');
                }}
                className="inline-flex items-center gap-2 rounded-md border border-[#C89B3C]/60 bg-[#1B1812] px-4 py-2.5 text-xs font-semibold text-[#F6EFE2] transition-colors hover:bg-[#C89B3C]/20"
              >
                {copiedTarget === 'page' ? (
                  <Check className="h-4 w-4 text-[#4F9E68]" aria-hidden="true" />
                ) : (
                  <Share2 className="h-4 w-4 text-[#C89B3C]" aria-hidden="true" />
                )}
                <span>{copiedTarget === 'page' ? 'Copied /videos Link' : 'Share Videos URL'}</span>
              </button>
              {onOpenAlliance && (
                <button
                  type="button"
                  onClick={onOpenAlliance}
                  className="inline-flex items-center gap-2 rounded-md bg-[#C89B3C] px-4 py-2.5 text-xs font-semibold text-[#0B0B0D] transition-colors hover:bg-[#D9AC4A]"
                >
                  <span>View Phase 1 Co-Pitching Scope</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-[#0F0F12] px-4 py-2.5 text-xs">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider text-[#9C968B] uppercase shrink-0">
                Shareable URL:
              </span>
              <code className="font-mono-tabular truncate text-[#EAE6DF]">{sharePageUrl}</code>
            </div>
            <button
              type="button"
              onClick={() => {
                void copyShareUrl(sharePageUrl, 'page');
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#C89B3C] hover:underline shrink-0"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copiedTarget === 'page' ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Featured Video Showcase */}
        <div className="mt-8 rounded-xl border border-[#C89B3C]/45 bg-[#141417] p-6 lg:p-8">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{CO_PITCHING_ALLIANCE.currentTechnicalStatus.previewTag}</span>
              </div>
              <h2 className="font-display mt-1.5 text-2xl font-semibold text-[#F6EFE2]">
                {CO_PITCHING_ALLIANCE.currentTechnicalStatus.previewTitle}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {CO_PITCHING_ALLIANCE.currentTechnicalStatus.testScopeTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-[#4F9E68]/45 bg-[#4F9E68]/10 px-2.5 py-1 text-[11px] font-semibold text-[#9AE0AF]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="overflow-hidden rounded-lg border border-white/15 bg-[#08080A] lg:col-span-8">
              <video
                src={GENERATED_ASSETS.ue5PrototypePreviewVideo}
                controls
                preload="metadata"
                playsInline
                poster={GENERATED_ASSETS.ue5PrototypePoster}
                className="aspect-video w-full bg-black object-contain"
              >
                Your browser does not support HTML5 video playback.
              </video>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0F0F12] px-4 py-2.5 text-[11px] text-[#9C968B]">
                <span className="font-mono-tabular text-[#D4CEC3]">
                  Build: VC_LastRelic Preview [NetMode: Standalone] (64-bit Windows)
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono-tabular text-[#C89B3C]">Duration: 0:36 · H.264 30fps</span>
                  <button
                    type="button"
                    onClick={() => {
                      void copyShareUrl(directVideoUrl, 'clip');
                    }}
                    className="inline-flex items-center gap-1 rounded border border-white/15 px-2 py-0.5 text-[10px] font-semibold text-[#EAE6DF] transition-colors hover:border-[#C89B3C]/60"
                  >
                    {copiedTarget === 'clip' ? (
                      <Check className="h-3 w-3 text-[#4F9E68]" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3 w-3 text-[#C89B3C]" aria-hidden="true" />
                    )}
                    <span>{copiedTarget === 'clip' ? 'Copied MP4 URL' : 'Copy MP4 Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-md border border-[#C89B3C]/50 bg-[#12110E] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[#C89B3C] uppercase">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>Important Visual Scope Notice</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#EAE6DF]">
                  {CO_PITCHING_ALLIANCE.currentTechnicalStatus.previewDisclaimer}
                </p>
              </div>

              <div className="rounded-md border border-white/10 bg-[#0F0F12] p-4 text-xs leading-relaxed text-[#B8B1A6]">
                <p className="font-semibold text-[#F6EFE2]">Systems Actively Tested Here:</p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F9E68]" aria-hidden="true" />
                    <span>Attack swings, input responsiveness &amp; combat hit detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F9E68]" aria-hidden="true" />
                    <span>Inventory loot pickup &amp; container item management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4F9E68]" aria-hidden="true" />
                    <span>Live equipment Set Data &amp; numerical stat tables</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-md border border-white/10 bg-[#0F0F12] p-4 text-[11px] leading-relaxed text-[#9C968B]">
                <p className="flex items-center gap-1.5 font-semibold text-[#EAE6DF]">
                  <Layers className="h-3.5 w-3.5 text-[#C89B3C]" aria-hidden="true" />
                  <span>Placeholder Components</span>
                </p>
                <p className="mt-1.5">
                  Temporary UI panels, placeholder character/prop meshes, and the graybox test
                  corridor are scheduled for full art replacement during Phase 1 Vertical Slice
                  co-development.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Production Capture Roadmap */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C89B3C] uppercase">
            <Film className="h-4 w-4" aria-hidden="true" />
            <span>Engine Capture Roadmap (Milestone 0 to Publisher Pitch)</span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PIPELINE_VIDEO_SLOTS.map((slot) => (
              <article
                key={slot.code}
                className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#141417] p-5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-mono-tabular font-semibold" style={{ color: slot.accent }}>
                      {slot.code}
                    </span>
                    <span className="text-[#9C968B]">{slot.status}</span>
                  </div>
                  <h3 className="font-display mt-2 text-lg font-semibold text-[#F6EFE2]">
                    {slot.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#B8B1A6]">{slot.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
