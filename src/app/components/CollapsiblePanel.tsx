"use client";

import { useState } from "react";

export type CollapsiblePanelProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
  badge?: React.ReactNode;
  className?: string;
};

export default function CollapsiblePanel({
  title,
  subtitle,
  children,
  defaultCollapsed = false,
  badge,
  className = "",
}: CollapsiblePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <section className={`panel ${className}`}>
      <div className="panel__header panel__header--clickable" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div>
          <div className="panel__title-row">
            <span className="panel__title">{title}</span>
            <button className="panel__toggle" aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}>
              {isCollapsed ? "▼" : "▲"}
            </button>
          </div>
          {subtitle && <div className="panel__subtitle">{subtitle}</div>}
        </div>
        {badge}
      </div>
      {!isCollapsed && <div className="panel__content">{children}</div>}
    </section>
  );
}
