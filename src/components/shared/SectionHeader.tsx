import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && <p className="text-sm text-navy-400">{description}</p>}
      </div>
      {action}
    </div>
  );
}
