"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card
      className={cn(
        "bg-card/90 border-primary/20 hover:border-primary/30 hover:shadow-primary/10 border-2 shadow-2xl backdrop-blur-md transition-all duration-300 ease-in-out",
        className,
      )}
    >
      <CardHeader
        className="hover:bg-primary/10 cursor-pointer p-4 transition-colors select-none"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="font-display flex items-center gap-2 text-lg tracking-wide">
              {title}
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle panel</span>
              </Button>
            </CardTitle>
            {subtitle && (
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            )}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="p-4 pt-0">{children}</CardContent>
      )}
    </Card>
  );
}
