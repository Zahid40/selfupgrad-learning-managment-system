"use client";
import React, { useState, useRef } from "react";
import { CourseType } from "@/types/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUser } from "@/components/provider/user-provider";
import { updateCourse } from "@/action/course/course.action";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Loader2,
  Play,
  FileImage,
  Link2,
} from "lucide-react";
import Image from "next/image";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/client";

const mediaFormSchema = z.object({
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  promo_video_url: z.string().url().optional().or(z.literal("")),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

interface UploadProgress {
  progress: number;
  uploading: boolean;
  file: File | null;
}

export default function CourseMediaManager(props: { courseData: CourseType }) {
  const CD = props.courseData;
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Thumbnail upload states
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    CD.thumbnail_url || ""
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    uploading: false,
    file: null,
  });
  
  // Crop states
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 56.25, // 16:9 aspect ratio
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Video preview
  const [videoPreview, setVideoPreview] = useState(false);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      thumbnail_url: CD.thumbnail_url || "",
      promo_video_url: CD.promo_video_url || "",
    },
  });

  // Handle thumbnail file selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setThumbnailFile(file);
    
    // Create preview and open crop dialog
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setShowCropDialog(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle crop completion
  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current || !thumbnailFile) return;

    try {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const croppedFile = new File([blob], thumbnailFile.name, {
          type: thumbnailFile.type,
        });

        await uploadThumbnail(croppedFile);
        setShowCropDialog(false);
      }, thumbnailFile.type);
    } catch (error) {
      console.error("Crop error:", error);
      toast.error("Failed to crop image");
    }
  };

  // Upload thumbnail to Supabase Storage
  const uploadThumbnail = async (file: File) => {
    setUploadProgress({ progress: 0, uploading: true, file });

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${CD.id}-thumbnail-${Date.now()}.${fileExt}`;
      const filePath = `course-thumbnails/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("course-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("course-media")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setThumbnailPreview(publicUrl);
      form.setValue("thumbnail_url", publicUrl);

      toast.success("Thumbnail uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload thumbnail");
    } finally {
      setUploadProgress({ progress: 100, uploading: false, file: null });
    }
  };

  // Remove thumbnail
  const handleRemoveThumbnail = () => {
    setThumbnailPreview("");
    setThumbnailFile(null);
    form.setValue("thumbnail_url", "");
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  // Validate video URL
  const validateVideoUrl = (url: string): boolean => {
    // YouTube, Vimeo, or direct video URLs
    const videoPatterns = [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
      /^https?:\/\/(www\.)?vimeo\.com\/.+/,
      /^https?:\/\/.+\.(mp4|webm|ogg)$/,
    ];
    return videoPatterns.some((pattern) => pattern.test(url));
  };

  // Get video embed URL
  const getVideoEmbedUrl = (url: string): string => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be")
        ? url.split("/").pop()?.split("?")[0]
        : new URLSearchParams(new URL(url).search).get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop()?.split("?")[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  };

  async function onSubmit(values: MediaFormValues) {
    console.log("Media Data:", values);
    setLoading(true);

    try {
      // Validate video URL if provided
      if (values.promo_video_url && !validateVideoUrl(values.promo_video_url)) {
        toast.error("Please enter a valid video URL (YouTube, Vimeo, or direct link)");
        setLoading(false);
        return;
      }

      const result = await updateCourse(CD.id, values, user.id);

      if (result.success) {
        toast.success("Media settings updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update media");
      }
    } catch (error) {
      console.error("Media update error", error);
      toast.error("Failed to update media. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Course Thumbnail
              </CardTitle>
              <CardDescription>
                Upload a high-quality image that represents your course (recommended: 1920x1080px, 16:9 ratio)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="thumbnail_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Upload Area */}
                        {!thumbnailPreview ? (
                          <div
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {uploadProgress.uploading ? (
                                <>
                                  <Loader2 className="h-10 w-10 mb-3 text-muted-foreground animate-spin" />
                                  <p className="text-sm text-muted-foreground">
                                    Uploading... {uploadProgress.progress}%
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                                  <p className="mb-2 text-sm text-muted-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG, or WEBP (MAX. 5MB)
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              ref={thumbnailInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleThumbnailSelect}
                              disabled={uploadProgress.uploading}
                            />
                          </div>
                        ) : (
                          // Preview
                          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                            <Image
                              src={thumbnailPreview}
                              alt="Course thumbnail"
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={handleRemoveThumbnail}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        {/* Thumbnail URL Input (Optional) */}
                        <div className="space-y-2">
                          <Label>Or enter thumbnail URL</Label>
                          <Input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setThumbnailPreview(e.target.value);
                              }
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            If you have an image hosted elsewhere
                          </p>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Promo Video */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Promotional Video
              </CardTitle>
              <CardDescription>
                Add a video preview to showcase your course (YouTube, Vimeo, or direct video link)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="promo_video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            {...field}
                          />
                          {field.value && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setVideoPreview(!videoPreview)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                          )}
                        </div>

                        {/* Video Preview */}
                        {videoPreview && field.value && (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                            <iframe
                              src={getVideoEmbedUrl(field.value)}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Supported platforms: YouTube, Vimeo, or direct video URLs (.mp4, .webm)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                📸 Media Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-start gap-2">
                <FileImage className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Thumbnail:</strong> Use high-quality images with 16:9 aspect ratio (1920x1080px recommended)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Video className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Promo Video:</strong> Keep it under 2 minutes and highlight key course benefits
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Link2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Video Hosting:</strong> YouTube and Vimeo offer better performance than direct uploads
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading || uploadProgress.uploading}>
              {loading ? "Saving..." : "Save Media"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crop Thumbnail</DialogTitle>
            <DialogDescription>
              Adjust the crop area to fit your thumbnail (16:9 ratio recommended)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {imageToCrop && (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
              >
                <img
                  ref={imgRef}
                  src={imageToCrop}
                  alt="Crop preview"
                  className="max-h-[500px] w-full object-contain"
                />
              </ReactCrop>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCropDialog(false);
                  setImageToCrop("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCropComplete}>
                Apply & Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}