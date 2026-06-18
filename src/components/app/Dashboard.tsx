"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/provider";
import { fmt } from "@/lib/i18n/format";
import { Card, Spinner } from "@/components/ui";
import { PartnerBrief } from "@/components/app/PartnerBrief";
import type { Profile, ScheduleEvent } from "@/lib/supabase/types";

function greeting(t: ReturnType<typeof useLanguage>["t"]) {
  const h = new Date().getHours();
  if (h < 12) return t.dashboard.greetingMorning;
  if (h < 18) return t.dashboard.greetingAfternoon;
  return t.dashboard.greetingEvening;
}

export function Dashboard() {
  const { t, lang } = useLanguage();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [next, setNext] = useState<ScheduleEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(prof as Profile);
      const { data: ev } = await supabase
        .from("schedule_events")
        .select("*")
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1);
      setNext((ev?.[0] as ScheduleEvent) ?? null);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-muted">
        <Spinner />
      </div>
    );

  const cycleDay = profile?.cycle_start_date
    ? Math.max(
        1,
        Math.floor(
          (Date.now() - new Date(profile.cycle_start_date).getTime()) /
            86400000
        ) + 1
      )
    : null;

  // Partner role lands on their brief.
  if (profile?.role === "partner") {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl text-ink">
          {greeting(t)}
          {profile.display_name ? `, ${profile.display_name}` : ""}.
        </h1>
        <PartnerBrief role="partner" />
        <QuickLink
          href="/app/learn"
          title={t.nav.learn}
          desc={t.learn.subtitle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">
          {greeting(t)}
          {profile?.display_name ? `, ${profile.display_name}` : ""}.
        </h1>
        {cycleDay && (
          <p className="mt-1 text-muted">{fmt(t.dashboard.dayOf, { n: cycleDay })}</p>
        )}
      </div>

      <Card className="bg-brand-gradient border-0 text-white">
        <p className="text-sm text-white/70">{t.dashboard.quickSchedule}</p>
        {next ? (
          <Link href="/app/schedule" className="mt-1 block">
            <p className="font-display text-2xl">{next.title}</p>
            <p className="text-white/80">
              {new Date(next.scheduled_at).toLocaleString(lang, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </Link>
        ) : (
          <Link href="/app/schedule" className="mt-1 block text-white/80">
            {t.dashboard.noSchedule}
          </Link>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <QuickLink
          href="/app/portals"
          title={t.portals.title}
          desc={t.dashboard.quickPortals}
        />
        <QuickLink
          href="/app/track"
          title={t.track.title}
          desc={t.dashboard.quickTrack}
        />
      </div>

      {/* Partner connection state */}
      {profile?.paired_with ? (
        <Card className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grow-300/30 text-grow-500">
            ✓
          </span>
          <p className="font-medium text-plum-700">
            {t.dashboard.partnerConnected}
          </p>
        </Card>
      ) : (
        <Link href="/app/partner">
          <Card className="flex items-center justify-between transition hover:border-berry-400">
            <div>
              <p className="font-medium text-plum-700">
                {t.dashboard.partnerNotConnected}
              </p>
              <p className="text-sm text-muted">{t.dashboard.invitePartner}</p>
            </div>
            <span className="text-berry-500">→</span>
          </Card>
        </Link>
      )}
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:border-berry-400 hover:shadow-md">
        <p className="font-display text-xl text-plum-700">{title}</p>
        <p className="mt-1 text-sm text-muted">{desc}</p>
      </Card>
    </Link>
  );
}
