import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FLOW = [
  {
    title: "Goose webhooks",
    body: "Reservation created / checked-in / medication-updated events POST to an HTTPS endpoint. Payloads are validated and stamped with location + pet IDs.",
  },
  {
    title: "API Gateway → AWS Lambda",
    body: "A thin ingest Lambda authenticates the webhook, normalizes the event, and publishes domain events rather than writing tasks inline.",
  },
  {
    title: "EventBridge",
    body: "Routes check-in, med-change, and staff-status events to fan-out targets: task generation, priority scoring, and Slack notification Lambdas.",
  },
  {
    title: "DynamoDB",
    body: "Stores tasks, assignments, staff qualifications, and audit history with location-partitioned keys for fast per-site queues.",
  },
  {
    title: "S3",
    body: "Holds SOP PDFs, training videos, and staff-captured completion photos referenced from Slack Block Kit cards.",
  },
  {
    title: "Slack Block Kit",
    body: "Delivers interactive task messages with Start / Complete / Need Help actions. Action payloads call back into Lambda to update DynamoDB.",
  },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-5">
      <header>
        <Badge variant="navy" className="mb-2">
          Phase 1 Pilot Architecture
        </Badge>
        <h1 className="font-display text-3xl font-semibold text-navy-900">
          How production would wire together
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
          This demo is intentionally local and simulated. The Phase 1 pilot for a
          single Petropolis location would connect Goose, AWS, and Slack as
          follows — without any of those systems being live in this concept app.
        </p>
      </header>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="demo-grid border-b border-slate-100 bg-gradient-to-br from-navy-900 to-navy-800 px-5 py-8 text-white sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Event path
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-medium">
              {[
                "Goose",
                "Webhook",
                "Lambda",
                "EventBridge",
                "DynamoDB",
                "Slack",
              ].map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-lg bg-white/10 px-3 py-1.5">
                    {step}
                  </span>
                  {i < 5 && <span className="text-teal-300">→</span>}
                </span>
              ))}
            </div>
            <p className="mt-4 max-w-2xl text-sm text-white/75">
              Photos and SOPs resolve from S3. Priority scoring runs as a Lambda
              consumer so medication and overdue welfare work always outrank
              routine cleaning.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FLOW.map((item, index) => (
          <Card key={item.title} className="animate-fade-up" style={{ animationDelay: `${index * 50}ms` }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-50 text-sm font-bold text-teal-700">
                  {index + 1}
                </span>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-600">
                {item.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilot boundaries</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-slate-600 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-navy-900">In scope</p>
            <p className="mt-1">
              One location, daycare + boarding check-ins, Slack task actions,
              manager overrides.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-navy-900">Out of scope for Phase 1</p>
            <p className="mt-1">
              Multi-region failover, payroll, full CRM replacement, custom native
              apps.
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-navy-900">Success signal</p>
            <p className="mt-1">
              Meds never missed, walks dispatched before overdue, managers see
              blocked work in under a minute.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
