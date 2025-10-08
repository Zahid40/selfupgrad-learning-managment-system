"use client";

import { getAllBuckets } from "@/action/storage/storage.action";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/work/image-upload";
import { useSupabaseUpload } from "@/hooks/use-upload";

const FileUploadDemo = () => {
  const props = useSupabaseUpload({
    bucketName: "asset",
    path: "/zahid",
    allowedMimeTypes: ["image/*"],
    maxFiles: 10,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  });


  return (
    <div className="flex h-full min-h-[80vh] w-full items-center justify-center">
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      <div></div>
    </div>
  );
};

export default FileUploadDemo;
