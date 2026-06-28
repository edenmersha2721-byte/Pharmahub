import { cn } from "@/lib/utils";


export default function EmptyState({ icon: Icon, title, subtitle, className }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-foreground/10 bg-card/50 px-6 py-14 text-center",
        className
      )}
    >
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 ring-1 ring-indigo-500/20">
          <Icon className="size-6" />
        </div>
      )}
      <div className="space-y-1">
        <p className="font-heading text-base font-semibold text-foreground">{title}</p>
        {subtitle && <p className="mx-auto max-w-sm text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
