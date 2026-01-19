"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";
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
    <Card className={cn("backdrop-blur-md bg-white/70 dark:bg-black/70 border-primary/10 shadow-xl transition-all duration-300 ease-in-out", className)}>
      <CardHeader 
        className="p-4 cursor-pointer select-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors" 
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-display tracking-wide flex items-center gap-2">
              {title}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(!isCollapsed);
                }}
              >
                {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                <span className="sr-only">Toggle panel</span>
              </Button>
            </CardTitle>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {badge && <div>{badge}</div>}
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="p-4 pt-0">
          {children}
        </CardContent>
      )}
    </Card>
  );
}
