"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Building2,
  LayoutDashboard,
  Menu,
  MessageSquare,
  PawPrint,
  RotateCcw,
  Sparkles,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/context/demo-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DemoTourBanner } from "@/components/demo/demo-tour-banner";

const NAV = [
  { href: "/", label: "Operations", icon: LayoutDashboard },
  { href: "/generator", label: "Task Generator", icon: Wand2 },
  { href: "/priority", label: "Priority Engine", icon: Zap },
  { href: "/slack", label: "Slack Simulator", icon: MessageSquare },
  { href: "/admin", label: "Manager Admin", icon: Building2 },
  { href: "/architecture", label: "Phase 1 Architecture", icon: Activity },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { runGuidedDemo, resetDemo, isDemoRunning, locationId, locations, setLocationId } =
    useDemo();
  const [open, setOpen] = useState(false);
  const location = locations.find((l) => l.id === locationId);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-navy-900/10 bg-navy-950/95 text-white backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-navy-950 shadow-lg shadow-teal-500/30">
                <PawPrint size={18} />
              </span>
              <span className="leading-tight">
                <span className="font-display block text-[15px] font-semibold tracking-tight sm:text-base">
                  Petropolis Work Engine
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-teal-300/90">
                  Interactive Concept Demo
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="h-9 rounded-lg border border-white/15 bg-white/5 px-3 text-xs text-white outline-none"
            >
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id} className="text-navy-900">
                  {loc.name}
                  {loc.isPilot ? " · Pilot" : " · Coming soon"}
                </option>
              ))}
            </select>
            <Badge variant="teal" className="normal-case tracking-normal">
              {location?.isPilot ? "Pilot live" : "View only"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-white hover:bg-white/10 sm:inline-flex"
              onClick={resetDemo}
            >
              <RotateCcw size={14} />
              Reset
            </Button>
            <Button
              variant="teal"
              size="sm"
              onClick={() => void runGuidedDemo()}
              disabled={isDemoRunning}
              className="shadow-teal-500/20"
            >
              <Sparkles size={14} />
              {isDemoRunning ? "Running…" : "Watch Demo"}
            </Button>
          </div>
        </div>
      </div>

      <DemoTourBanner />

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-5 sm:px-6 lg:py-7">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-slate-200 bg-white p-4 pt-20 transition-transform lg:static lg:z-0 lg:w-60 lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-white/80 lg:p-3 lg:pt-3 lg:shadow-sm",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Walkthrough
          </p>
          <nav className="space-y-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-navy-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-navy-900"
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50/80 p-3">
            <p className="text-xs font-semibold text-teal-900">Sales tip</p>
            <p className="mt-1 text-xs leading-relaxed text-teal-800/90">
              Hit Watch Demo for a 60–90s guided flow, then click through Slack
              actions to show live dashboard updates.
            </p>
          </div>
        </aside>

        {open && (
          <button
            className="fixed inset-0 z-40 bg-navy-950/40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
        )}

        <main className="min-w-0 flex-1 animate-fade-up">{children}</main>
      </div>
    </div>
  );
}
