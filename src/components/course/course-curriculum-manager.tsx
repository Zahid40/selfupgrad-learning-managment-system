"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  GripVertical,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  ChevronDown,
  Video,
  FileText,
  Image as ImageIcon,
  Link2,
  Code,
  CheckSquare,
  Clock,
  PlayCircle,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createChapter,
  updateChapter,
  deleteChapter,
  duplicateChapter,
  reorderChapters,
} from "@/action/course/chapter.action";
import { Tables } from "@/types/db.types";
import { useRouter } from "next/navigation";

// Chapter schema
const chapterFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  is_free: z.boolean().default(false),
});

type ChapterFormValues = z.infer<typeof chapterFormSchema>;

// Lesson schema
const lessonFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content_type: z.enum([
    "video",
    "audio",
    "pdf",
    "text",
    "image",
    "ppt",
    "file",
    "link",
    "iframe",
    "quiz",
    "assignment",
    "coding_test",
    "form",
    "scorm",
    "live_class",
    "live_test",
    "heading",
  ]),
  content_url: z.string().optional(),
  content_body: z.string().optional(),
  duration: z.number().min(0).optional(),
  is_preview: z.boolean().default(false),
});

type LessonFormValues = z.infer<typeof lessonFormSchema>;

interface ChapterWithLessons extends Tables<"chapters"> {
  lessons?: Tables<"lessons">[];
}

interface CourseCurriculumManagerProps {
  courseId: string;
  chapters: ChapterWithLessons[];
}

// Content type icons and labels
const contentTypeConfig = {
  video: { icon: Video, label: "Video", color: "text-red-500" },
  audio: { icon: PlayCircle, label: "Audio", color: "text-purple-500" },
  pdf: { icon: FileText, label: "PDF", color: "text-blue-500" },
  text: { icon: FileText, label: "Text", color: "text-gray-500" },
  image: { icon: ImageIcon, label: "Image", color: "text-green-500" },
  link: { icon: Link2, label: "Link", color: "text-cyan-500" },
  quiz: { icon: CheckSquare, label: "Quiz", color: "text-yellow-500" },
  assignment: { icon: FileText, label: "Assignment", color: "text-orange-500" },
  coding_test: { icon: Code, label: "Coding Test", color: "text-indigo-500" },
};

// Sortable Chapter Item
function SortableChapterItem({
  chapter,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleFree,
  children,
}: {
  chapter: ChapterWithLessons;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleFree: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <AccordionItem value={chapter.id} className="border rounded-lg">
        <div className="flex items-center gap-2 pr-4">
          <button
            className="px-2 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <AccordionTrigger className="flex-1 hover:no-underline">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{chapter.title}</h4>
                  {chapter.is_free && (
                    <Badge variant="secondary" className="text-xs">
                      Free Preview
                    </Badge>
                  )}
                </div>
                {chapter.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {chapter.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{chapter.lessons?.length || 0} lessons</span>
              </div>
            </div>
          </AccordionTrigger>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleFree}>
                {chapter.is_free ? (
                  <EyeOff className="mr-2 h-4 w-4" />
                ) : (
                  <Eye className="mr-2 h-4 w-4" />
                )}
                {chapter.is_free ? "Make Paid" : "Make Free"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </div>
  );
}

// Lesson Item Component
function LessonItem({
  lesson,
  onEdit,
  onDelete,
}: {
  lesson: Tables<"lessons">;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const contentConfig = contentTypeConfig[lesson.content_type as keyof typeof contentTypeConfig];
  const Icon = contentConfig?.icon || FileText;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className={`${contentConfig?.color || "text-gray-500"}`}>
        <Icon className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium truncate">{lesson.title}</p>
          {lesson.is_preview && (
            <Badge variant="outline" className="text-xs">
              Preview
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground">
            {contentConfig?.label || lesson.content_type}
          </span>
          {lesson.duration && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration} min
            </span>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function CourseCurriculumManager({
  courseId,
  chapters: initialChapters,
}: CourseCurriculumManagerProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState<ChapterWithLessons[]>(initialChapters);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [chapterDialog, setChapterDialog] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterWithLessons | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Chapter form
  const chapterForm = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: {
      title: "",
      description: "",
      is_free: false,
    },
  });

  // Lesson form
  const lessonForm = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      content_type: "video",
      content_url: "",
      content_body: "",
      duration: 0,
      is_preview: false,
    },
  });

  // Handle chapter drag end
  const handleChapterDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = chapters.findIndex((c) => c.id === active.id);
    const newIndex = chapters.findIndex((c) => c.id === over.id);

    const newChapters = arrayMove(chapters, oldIndex, newIndex);
    setChapters(newChapters);

    // Update order in backend
    const chapterOrders = newChapters.map((chapter, index) => ({
      id: chapter.id,
      order_index: index,
    }));

    const result = await reorderChapters(courseId, chapterOrders);
    if (!result.success) {
      toast.error("Failed to reorder chapters");
      setChapters(chapters); // Revert
    }
  };

  // Create/Update Chapter
  const handleSaveChapter = async (values: ChapterFormValues) => {
    setLoading(true);
    try {
      if (editingChapter) {
        // Update
        const result = await updateChapter(editingChapter.id, values);
        if (result.success) {
          toast.success("Chapter updated successfully!");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to update chapter");
        }
      } else {
        // Create
        const result = await createChapter({
          ...values,
          course_id: courseId,
          order_index: chapters.length,
        });
        if (result.success) {
          toast.success("Chapter created successfully!");
          router.refresh();
        } else {
          toast.error(result.error || "Failed to create chapter");
        }
      }
      setChapterDialog(false);
      chapterForm.reset();
      setEditingChapter(null);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Delete Chapter
  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Are you sure you want to delete this chapter and all its lessons?")) return;

    setLoading(true);
    try {
      const result = await deleteChapter(chapterId);
      if (result.success) {
        toast.success("Chapter deleted successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete chapter");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Duplicate Chapter
  const handleDuplicateChapter = async (chapterId: string) => {
    setLoading(true);
    try {
      const result = await duplicateChapter(chapterId, true);
      if (result.success) {
        toast.success("Chapter duplicated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to duplicate chapter");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Free Preview
  const handleToggleFree = async (chapter: ChapterWithLessons) => {
    const result = await updateChapter(chapter.id, { is_free: !chapter.is_free });
    if (result.success) {
      toast.success(`Chapter marked as ${!chapter.is_free ? "free" : "paid"}`);
      router.refresh();
    }
  };

  // Open Edit Dialog
  const openEditChapter = (chapter: ChapterWithLessons) => {
    setEditingChapter(chapter);
    chapterForm.reset({
      title: chapter.title,
      description: chapter.description || "",
      is_free: chapter.is_free || false,
    });
    setChapterDialog(true);
  };

  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Curriculum</h3>
          <p className="text-sm text-muted-foreground">
            Organize your course content into chapters and lessons
          </p>
        </div>
        <Dialog open={chapterDialog} onOpenChange={setChapterDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingChapter(null);
              chapterForm.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingChapter ? "Edit Chapter" : "Create New Chapter"}
              </DialogTitle>
              <DialogDescription>
                {editingChapter
                  ? "Update chapter details"
                  : "Add a new chapter to organize your course content"}
              </DialogDescription>
            </DialogHeader>
            <Form {...chapterForm}>
              <form onSubmit={chapterForm.handleSubmit(handleSaveChapter)} className="space-y-4">
                <FormField
                  control={chapterForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chapter Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Web Development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={chapterForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of what this chapter covers..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={chapterForm.control}
                  name="is_free"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Free Preview</FormLabel>
                        <FormDescription className="text-xs">
                          Allow students to preview this chapter for free
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setChapterDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : editingChapter ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chapters List */}
      {chapters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No chapters yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start building your course by adding chapters
            </p>
            <Button onClick={() => setChapterDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Chapter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleChapterDragEnd}
        >
          <SortableContext items={chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <Accordion type="multiple" className="space-y-2">
              {chapters.map((chapter) => (
                <SortableChapterItem
                  key={chapter.id}
                  chapter={chapter}
                  onEdit={() => openEditChapter(chapter)}
                  onDelete={() => handleDeleteChapter(chapter.id)}
                  onDuplicate={() => handleDuplicateChapter(chapter.id)}
                  onToggleFree={() => handleToggleFree(chapter)}
                >
                  <div className="px-4 pb-4 space-y-3">
                    {/* Lessons */}
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            onEdit={() => {
                              // TODO: Implement lesson editing
                              toast.info("Lesson editing coming soon!");
                            }}
                            onDelete={() => {
                              // TODO: Implement lesson deletion
                              toast.info("Lesson deletion coming soon!");
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground mb-3">
                          No lessons in this chapter
                        </p>
                      </div>
                    )}

                    {/* Add Lesson Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedChapterId(chapter.id);
                        setLessonDialog(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>
                </SortableChapterItem>
              ))}
            </Accordion>
          </SortableContext>
        </DndContext>
      )}

      {/* Stats */}
      {chapters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Curriculum Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{chapters.length}</div>
                <div className="text-xs text-muted-foreground">Chapters</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {chapters.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Lessons</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {chapters.filter((c) => c.is_free).length}
                </div>
                <div className="text-xs text-muted-foreground">Free Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}