"use client";

import { UserIcon, XIcon } from "lucide-react";

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/type";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AvatarDynamic(props: {
  user: UserType;
  className?: string;
}) {
  const { user, className } = props;
  const [{ files }, { removeFile, openFileDialog, getInputProps }] =
    useFileUpload({
      accept: "image/*",
    });
  const previewUrl = files[0]?.preview || null;
  const fileName = files[0]?.file.name || null;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative inline-flex">
        <Button
          className="relative size-40 overflow-hidden rounded-full p-0 shadow-none"
          onClick={openFileDialog}
          aria-label={previewUrl ? "Change image" : "Upload image"}
        >
          {previewUrl ? (
            <Image
              className="size-full object-cover"
              src={previewUrl ?? user.avatar_url}
              alt="Preview of uploaded image"
              width={64}
              height={64}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div aria-hidden="true">
              <span className="text-2xl font-semibold uppercase">
                {user.first_name?.[0] || "U"}
              </span>
            </div>
          )}
        </Button>
        {previewUrl && (
          <Button
            onClick={() => removeFile(files[0]?.id)}
            variant={"secondary"}
            size="icon"
            className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
            aria-label="Remove image"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>
      {fileName && <p className="text-muted-foreground text-xs">{fileName}</p>}
      {previewUrl && (
        <Button size="sm" onClick={() => removeFile(files[0]?.id)}>
          Update
        </Button>
      )}
    </div>
  );
}
