import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
  {
    variants: {
      variant: {
        critical: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
        high: "bg-amber-100 text-amber-900 ring-1 ring-amber-200",
        normal: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
        low: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
        success: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
        muted: "bg-slate-100 text-slate-600",
        teal: "bg-teal-100 text-teal-800 ring-1 ring-teal-200",
        navy: "bg-navy-900 text-white",
      },
    },
    defaultVariants: { variant: "muted" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
