"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Share2 } from "lucide-react";
import useWebShare from "react-use-web-share";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ShareButton = (props: {
  title: string;
  text: string;
  url?: string;
  className?: string;
  tooltip?: string;
}) => {
  const { loading, isSupported, share } = useWebShare();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {!loading && isSupported ? (
          <Button
            size={"icon"}
            variant={"outline"}
            className={cn("flex-row p-2", props.className)}
            onClick={() => {
              share({ config: props });
            }}
          >
            <Share2 />
          </Button>
        ) : null}
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">
        {props.tooltip ?? "Share"}
      </TooltipContent>
    </Tooltip>
  );
};
export default ShareButton;
