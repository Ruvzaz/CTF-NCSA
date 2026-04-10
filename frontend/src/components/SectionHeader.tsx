import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  prefix?: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, prefix, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 mb-8", className)}>
      {prefix && (
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
          // {prefix}
        </span>
      )}
      <div className="flex flex-col gap-3">
        <h2 className="font-space text-3xl md:text-4xl font-bold text-primary uppercase tracking-tight">
          {title}
        </h2>
        <div className="w-12 h-1 bg-accent" />
      </div>
      {subtitle && (
        <p className="text-sm text-text-secondary max-w-2xl mt-2 leading-relaxed italic">
          {subtitle}
        </p>
      )}
    </div>
  );
}
