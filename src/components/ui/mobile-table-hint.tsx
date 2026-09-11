"use client";

import { ArrowRight, MoveHorizontal } from "lucide-react";

export function MobileTableHint() {
  return (
    <div className="flex sm:hidden items-center justify-between px-3.5 py-2 bg-muted/30 border-b border-border text-[11px] text-muted-foreground select-none">
      <span className="flex items-center gap-1.5 font-medium">
        <MoveHorizontal className="size-3.5 text-primary" />
        Swipe horizontally for full details
      </span>
      <span className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider opacity-75">
        Scroll <ArrowRight className="size-3" />
      </span>
    </div>
  );
}
