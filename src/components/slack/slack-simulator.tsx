"use client";

import {
  Camera,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Coffee,
  LogIn,
  LogOut,
  Play,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDemo } from "@/context/demo-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

export function SlackSimulator() {
  const {
    staff,
    tasks,
    updateTaskStatus,
    attachPhoto,
    setStaffStatus,
    highlightedTaskId,
  } = useDemo();
  const [activeStaffId, setActiveStaffId] = useState("staff-jordan");

  const member = staff.find((s) => s.id === activeStaffId) ?? staff[0];
  const myTasks = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.assignedTo === member.id &&
          !["completed"].includes(t.status)
      ),
    [tasks, member.id]
  );

  return (
    <div className="space-y-5">
      <header>
        <Badge variant="navy" className="mb-2">
          Slack Task Simulator
        </Badge>
        <h1 className="font-display text-3xl font-semibold text-navy-900">
          Staff actions on mobile
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
          This is a <strong>Slack UI simulation</strong> — not a connected Slack
          workspace. Buttons update the shared demo state so the dashboard
          reacts live.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {staff
          .filter((s) => s.status !== "off_shift" || s.id === activeStaffId)
          .map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStaffId(s.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeStaffId === s.id
                  ? "bg-navy-900 text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {s.name}
            </button>
          ))}
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[320px_1fr]">
        <div className="mx-auto w-full max-w-[340px]">
          <div className="overflow-hidden rounded-[2rem] border-[8px] border-navy-950 bg-[#1a1d21] shadow-2xl shadow-navy-900/20">
            <div className="flex items-center justify-between bg-[#1164A3] px-4 py-3 text-white">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/70">
                  Simulated channel
                </p>
                <p className="text-sm font-semibold">#care-tasks-midtown</p>
              </div>
              <Badge className="bg-white/15 text-[10px] text-white normal-case tracking-normal">
                UI only
              </Badge>
            </div>

            <div className="border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500 text-sm font-bold text-navy-950">
                  {member.avatarInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {member.name}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-[#abdad1]">
                    <span className="slack-dot" />
                    {member.status === "on_shift"
                      ? "Active"
                      : member.status === "on_break"
                        ? "Away · Break"
                        : "Offline"}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="soft"
                  className="h-8 bg-[#2c5299] text-[10px] text-white hover:bg-[#3560ad]"
                  onClick={() => setStaffStatus(member.id, "on_shift")}
                >
                  <LogIn size={12} /> Clock In
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-[#3f0e40]/70 text-[10px] text-white hover:bg-[#3f0e40]"
                  onClick={() => setStaffStatus(member.id, "on_break")}
                >
                  <Coffee size={12} /> Break
                </Button>
                <Button
                  size="sm"
                  className="h-8 bg-[#e01e5a]/90 text-[10px] text-white hover:bg-[#e01e5a]"
                  onClick={() => setStaffStatus(member.id, "off_shift")}
                >
                  <LogOut size={12} /> Out
                </Button>
              </div>
            </div>

            <div className="max-h-[540px] space-y-3 overflow-y-auto bg-[#1a1d21] p-3">
              {myTasks.length === 0 && (
                <div className="rounded-xl bg-white/5 p-6 text-center text-sm text-white/60">
                  No open assigned tasks. Run Dispatch or switch staff.
                </div>
              )}
              {myTasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-xl border border-white/10 bg-[#222529] p-3 text-white ${
                    highlightedTaskId === task.id ? "highlight-task" : ""
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{task.title}</p>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        task.priority === "critical"
                          ? "bg-rose-500/20 text-rose-300"
                          : task.priority === "high"
                            ? "bg-amber-500/20 text-amber-200"
                            : "bg-sky-500/20 text-sky-200"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-white/70">
                    Pet: <span className="text-white">{task.petName}</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/65">
                    {task.instructions}
                  </p>
                  <p className="mt-2 flex items-center gap-1 text-[11px] text-[#abdad1]">
                    <Clock3 size={12} /> Due {formatTime(task.dueAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <a className="text-[#1d9bd1] underline" href={task.sopUrl}>
                      View SOP
                    </a>
                    <a className="text-[#1d9bd1] underline" href={task.videoUrl}>
                      Watch video
                    </a>
                    {task.photoAttached && (
                      <span className="text-emerald-300">Photo attached</span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="h-8 bg-[#007a5a] text-[11px] hover:bg-[#0a8f6b]"
                      onClick={() => updateTaskStatus(task.id, "in_progress")}
                    >
                      <Play size={12} /> Start
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 bg-[#2bac76] text-[11px] hover:bg-[#34c285]"
                      onClick={() =>
                        updateTaskStatus(task.id, "completed", {
                          photoAttached: task.photoAttached,
                        })
                      }
                    >
                      <CheckCircle2 size={12} /> Complete
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 bg-[#e0a100]/90 text-[11px] text-navy-950 hover:bg-[#f0b010]"
                      onClick={() => updateTaskStatus(task.id, "needs_help")}
                    >
                      <CircleHelp size={12} /> Need Help
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 bg-[#e01e5a]/85 text-[11px] hover:bg-[#e01e5a]"
                      onClick={() =>
                        updateTaskStatus(task.id, "blocked", {
                          blockedReason: "Staff cannot complete — escalated.",
                        })
                      }
                    >
                      <XCircle size={12} /> Can&apos;t Complete
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 h-8 w-full text-[11px] text-white/80 hover:bg-white/10 hover:text-white"
                    onClick={() => attachPhoto(task.id)}
                  >
                    <Camera size={12} /> Simulate photo attachment
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-5">
          <h2 className="font-display text-xl font-semibold text-navy-900">
            What this proves in the pitch
          </h2>
          <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
            <li>
              Staff see pet name, instructions, due time, and SOP/video links in
              one card.
            </li>
            <li>
              Start / Complete / Need Help / Can&apos;t Complete push status back
              into the manager dashboard instantly (local demo state).
            </li>
            <li>
              Clock In, Break, and Clock Out change availability for the next
              dispatch run.
            </li>
            <li>
              Photo attachment is simulated — in Phase 1 this would land in S3
              and attach to the task record.
            </li>
          </ul>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Clearly labeled simulation: no Slack API calls, no workspace
            connection, no message delivery.
          </div>
        </div>
      </div>
    </div>
  );
}
