import { UserType } from "@/types/type";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Edit } from "iconsax-reactjs";
import { useSupabaseUpload } from "@/hooks/use-upload";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../work/image-upload";
import { updateUser } from "@/action/user/user.action";

export default function UserAvatar(props: {
  className?: string;
  user?: UserType | null;
  isEditable?: boolean;
}) {
  const { user, className, isEditable } = props;
  const avatarUploadProps = useSupabaseUpload({
    bucketName: "avatars",
    fileName: `avatar-${Date.now()}`,
    path: `/${user?.id}`,
    allowedMimeTypes: ["image/*"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 1, // 1MB
    onSuccess: (f) => {
      const avatar_url = `https://aszjaykbxvdluazbscoa.supabase.co/storage/v1/object/public/${f[0].data.fullPath}`;
      updateUser({ avatar_url: avatar_url });
    },
  });

  return (
    <div className="relative">
      <Avatar
        className={cn(
          "relative size-12 overflow-visible rounded-full",
          className,
        )}
      >
        {user?.avatar_url && (
          <AvatarImage
            src={user.avatar_url}
            alt={user.first_name ?? "user"}
            className="overflow-hidden rounded-full"
          />
        )}
        <AvatarFallback className="text-secondary-foreground rounded-full bg-violet-400 dark:bg-violet-900">
          {user?.first_name ? user.first_name?.slice(0, 1) : "U"}
        </AvatarFallback>
        {isEditable && (
          <div className="absolute right-2 bottom-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size={"icon"}
                  className="rounded-full"
                  variant={"outline"}
                >
                  <Edit className="text-primary size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    <Dropzone {...avatarUploadProps}>
                      <DropzoneEmptyState />
                      <DropzoneContent />
                    </Dropzone>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Avatar>
    </div>
  );
}
