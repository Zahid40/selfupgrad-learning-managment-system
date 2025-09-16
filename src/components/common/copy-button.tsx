"use client";
import React, { useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  text: string;
  title?: string;
  tooltip?: string;
} & ButtonProps;

export default function CopyButton(props: CopyButtonProps) {
  const {
    text,
    title,
    variant = "secondary",
    size = "sm",
    disabled,
    ...rest
  } = props;
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="disabled:opacity-100 gap-2 text-xs font-light"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy to clipboard"}
          disabled={disabled ?? copied}
        >
          {title ? title : "Copy"}
          <div className="relative">

          <div
            className={cn(
              "transition-all",
              copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
            )}
          >
            <CheckIcon
              className="stroke-emerald-500"
              size={16}
              aria-hidden="true"
            />
          </div>
          <div
            className={cn(
              "absolute inset-0 transition-all",
              copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
            )}
          >
            <CopyIcon size={16} aria-hidden="true" />
          </div>
          </div>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">
        {props.tooltip ?? (copied ? "Copied" : "Copy to clipboard")}
      </TooltipContent>
    </Tooltip>
  );
}
