// app/(dashboard)/upload/page.tsx
"use client";

import { uploadImageAction } from "@/action/image/upload.action";
import { AvatarUpload } from "@/components/experimental/AvatarUpload";
import { useUser } from "@/components/provider/user-provider";
import { useState, useTransition } from "react";

export default function UploadPage() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ path?: string; signedUrl?: string; error?: string } | null>(null);

  async function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await uploadImageAction(formData);
      setResult(res as any);
    });
  }

  const {user} = useUser();

  return (
    <div style={{ padding: 24 }}>
        
      <h1>Upload Image</h1>
      <form action={onSubmit}>
        <div>
          <input type="file" name="file" accept="image/*" required />
        </div>
        <div>
          <input type="text" name="bucket" placeholder="Bucket name" defaultValue="images" required />
        </div>
        <div>
          <input type="text" name="folder" placeholder="Optional folder (e.g. course-thumbs)" />
        </div>
        <div>
          <label>
            <input type="checkbox" name="signUrl" value="true" defaultChecked /> Return signed URL
          </label>
        </div>
        <button type="submit" disabled={pending}>{pending ? "Uploading..." : "Upload"}</button>
      </form>

      {result?.error && <p style={{ color: "red" }}>{result.error}</p>}
      {result?.path && <p>Stored at: {result.path}</p>}
      {result?.signedUrl && (
        <div>
          <p>Preview:</p>
          <img src={result.signedUrl} alt="preview" width={240} />
        </div>
      )}
    </div>
  );
}
