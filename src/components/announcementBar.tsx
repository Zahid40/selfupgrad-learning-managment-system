"use client";

import { useState } from "react";
import { Eclipse, Rocket, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="dark bg-purple-800 text-foreground px-4 py-1">
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center md:justify-center">
          <Rocket
            size={12}
            className="shrink-0 opacity-60 max-md:mt-0.5"
            aria-hidden="true"
          />
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <p className="text-xs">
              It&lsquo;s live and ready to use! Start exploring the latest
              addition to your toolkit.
            </p>
            <div className="flex gap-2 max-md:flex-wrap">
              <Button size="sm" variant={"link"} className="rounded-full">
                Learn more
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size={"sm"}
          className="group shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <XIcon
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
