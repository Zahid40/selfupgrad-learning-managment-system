// "use client";
// import React, { useState, useRef, useEffect } from "react";
// import { CourseType } from "@/types/type";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { Switch } from "@/components/ui/switch";
// import { Slider } from "@/components/ui/slider";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useUser } from "@/components/provider/user-provider";
// import { updateCourse } from "@/action/course/course.action";
// import { useRouter } from "next/navigation";
// import {
//   Award,
//   Download,
//   Eye,
//   Image as ImageIcon,
//   Type,
//   Palette,
//   Layout,
//   FileText,
//   CheckCircle2,
//   Settings2,
//   Sparkles,
// } from "lucide-react";

// const certificateFormSchema = z.object({
//   certificate_enabled: z.boolean().default(true),
//   template_style: z.enum(["classic", "modern", "elegant", "minimal"]),
//   primary_color: z.string().default("#3B82F6"),
//   secondary_color: z.string().default("#1E40AF"),
//   font_family: z.enum(["serif", "sans-serif", "cursive"]),
//   border_style: z.enum(["none", "simple", "decorative", "gradient"]),
//   logo_position: z.enum(["top-center", "top-left", "top-right"]),
//   signature_enabled: z.boolean().default(true),
//   signature_text: z.string().optional(),
//   signature_title: z.string().optional(),
//   completion_threshold: z.number().min(0).max(100).default(100),
//   include_qr_code: z.boolean().default(true),
//   include_verification_url: z.boolean().default(true),
// });

// type CertificateFormValues = z.infer<typeof certificateFormSchema>;

// // Template previews
// const templateStyles = {
//   classic: {
//     name: "Classic",
//     description: "Traditional certificate with ornate borders",
//     preview: "🎓",
//   },
//   modern: {
//     name: "Modern",
//     description: "Clean, contemporary design with bold typography",
//     preview: "✨",
//   },
//   elegant: {
//     name: "Elegant",
//     description: "Sophisticated with serif fonts and subtle accents",
//     preview: "👔",
//   },
//   minimal: {
//     name: "Minimal",
//     description: "Simple, distraction-free design",
//     preview: "▫️",
//   },
// };

// const fontFamilies = {
//   serif: { name: "Serif", example: "Times New Roman, Georgia" },
//   "sans-serif": { name: "Sans Serif", example: "Arial, Helvetica" },
//   cursive: { name: "Cursive", example: "Brush Script, Pacifico" },
// };

// const borderStyles = {
//   none: "No Border",
//   simple: "Simple Line",
//   decorative: "Decorative Pattern",
//   gradient: "Gradient Border",
// };

// export default function CertificateManager(props: { courseData: CourseType }) {
//   const CD = props.courseData;
//   const { user } = useUser();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [previewMode, setPreviewMode] = useState<"preview" | "mobile" | "print">("preview");
//   const certificatePreviewRef = useRef<HTMLDivElement>(null);

//   // Parse existing certificate data
//   const existingCertificate = CD.certificate as any || {};

//   const form = useForm<CertificateFormValues>({
//     resolver: zodResolver(certificateFormSchema),
//     defaultValues: {
//       certificate_enabled: existingCertificate?.enabled ?? true,
//       template_style: existingCertificate?.template_style || "modern",
//       primary_color: existingCertificate?.primary_color || "#3B82F6",
//       secondary_color: existingCertificate?.secondary_color || "#1E40AF",
//       font_family: existingCertificate?.font_family || "sans-serif",
//       border_style: existingCertificate?.border_style || "simple",
//       logo_position: existingCertificate?.logo_position || "top-center",
//       signature_enabled: existingCertificate?.signature_enabled ?? true,
//       signature_text: existingCertificate?.signature_text || "Course Instructor",
//       signature_title: existingCertificate?.signature_title || "Instructor",
//       completion_threshold: existingCertificate?.completion_threshold || 100,
//       include_qr_code: existingCertificate?.include_qr_code ?? true,
//       include_verification_url: existingCertificate?.include_verification_url ?? true,
//     },
//   });

//   const certificateEnabled = form.watch("certificate_enabled");
//   const templateStyle = form.watch("template_style");
//   const primaryColor = form.watch("primary_color");
//   const secondaryColor = form.watch("secondary_color");
//   const fontFamily = form.watch("font_family");
//   const borderStyle = form.watch("border_style");
//   const completionThreshold = form.watch("completion_threshold");

//   // Download certificate preview
//   const handleDownloadPreview = () => {
//     toast.info("Certificate download feature coming soon!");
//     // TODO: Implement PDF generation with jsPDF or similar
//   };

//   async function onSubmit(values: CertificateFormValues) {
//     console.log("Certificate Data:", values);
//     setLoading(true);

//     try {
//       const certificateData = {
//         enabled: values.certificate_enabled,
//         template_style: values.template_style,
//         primary_color: values.primary_color,
//         secondary_color: values.secondary_color,
//         font_family: values.font_family,
//         border_style: values.border_style,
//         logo_position: values.logo_position,
//         signature_enabled: values.signature_enabled,
//         signature_text: values.signature_text,
//         signature_title: values.signature_title,
//         completion_threshold: values.completion_threshold,
//         include_qr_code: values.include_qr_code,
//         include_verification_url: values.include_verification_url,
//       };

//       const result = await updateCourse(
//         CD.id,
//         { certificate: certificateData },
//         user.id
//       );

//       if (result.success) {
//         toast.success("Certificate settings updated successfully!");
//         router.refresh();
//       } else {
//         toast.error(result.error || "Failed to update certificate");
//       }
//     } catch (error) {
//       console.error("Certificate update error", error);
//       toast.error("Failed to update certificate. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="w-full max-w-6xl">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Enable Certificate */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <CardTitle className="flex items-center gap-2">
//                     <Award className="h-5 w-5" />
//                     Course Completion Certificate
//                   </CardTitle>
//                   <CardDescription>
//                     Award certificates to students who complete your course
//                   </CardDescription>
//                 </div>
//                 <FormField
//                   control={form.control}
//                   name="certificate_enabled"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Switch
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </CardHeader>
//           </Card>

//           {certificateEnabled && (
//             <>
//               {/* Main Content - Split View */}
//               <div className="grid lg:grid-cols-2 gap-6">
//                 {/* Left Side - Settings */}
//                 <div className="space-y-6">
//                   {/* Template Selection */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2 text-base">
//                         <Layout className="h-4 w-4" />
//                         Template Style
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <FormField
//                         control={form.control}
//                         name="template_style"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormControl>
//                               <RadioGroup
//                                 onValueChange={field.onChange}
//                                 defaultValue={field.value}
//                                 className="grid grid-cols-2 gap-3"
//                               >
//                                 {Object.entries(templateStyles).map(([key, style]) => (
//                                   <Label
//                                     key={key}
//                                     htmlFor={key}
//                                     className={`flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-accent transition-colors ${
//                                       field.value === key
//                                         ? "border-primary bg-accent"
//                                         : "border-muted"
//                                     }`}
//                                   >
//                                     <RadioGroupItem
//                                       value={key}
//                                       id={key}
//                                       className="sr-only"
//                                     />
//                                     <div className="text-3xl mb-2">{style.preview}</div>
//                                     <div className="font-semibold text-sm">{style.name}</div>
//                                     <div className="text-xs text-muted-foreground text-center mt-1">
//                                       {style.description}
//                                     </div>
//                                   </Label>
//                                 ))}
//                               </RadioGroup>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>

//                   {/* Colors */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2 text-base">
//                         <Palette className="h-4 w-4" />
//                         Colors
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="primary_color"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Primary Color</FormLabel>
//                             <div className="flex gap-3">
//                               <FormControl>
//                                 <Input type="color" {...field} className="w-20 h-10" />
//                               </FormControl>
//                               <Input
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 placeholder="#3B82F6"
//                                 className="flex-1"
//                               />
//                             </div>
//                             <FormDescription>Main accent color</FormDescription>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="secondary_color"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Secondary Color</FormLabel>
//                             <div className="flex gap-3">
//                               <FormControl>
//                                 <Input type="color" {...field} className="w-20 h-10" />
//                               </FormControl>
//                               <Input
//                                 value={field.value}
//                                 onChange={field.onChange}
//                                 placeholder="#1E40AF"
//                                 className="flex-1"
//                               />
//                             </div>
//                             <FormDescription>Supporting color</FormDescription>
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>

//                   {/* Typography */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2 text-base">
//                         <Type className="h-4 w-4" />
//                         Typography
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <FormField
//                         control={form.control}
//                         name="font_family"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Font Family</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {Object.entries(fontFamilies).map(([key, font]) => (
//                                   <SelectItem key={key} value={key}>
//                                     <div>
//                                       <div className="font-semibold">{font.name}</div>
//                                       <div className="text-xs text-muted-foreground">
//                                         {font.example}
//                                       </div>
//                                     </div>
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>

//                   {/* Border Style */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2 text-base">
//                         <ImageIcon className="h-4 w-4" />
//                         Border Style
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <FormField
//                         control={form.control}
//                         name="border_style"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Border</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {Object.entries(borderStyles).map(([key, label]) => (
//                                   <SelectItem key={key} value={key}>
//                                     {label}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>

//                   {/* Signature */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2 text-base">
//                         <FileText className="h-4 w-4" />
//                         Signature
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="signature_enabled"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
//                             <div className="space-y-0.5">
//                               <FormLabel>Include Signature</FormLabel>
//                               <FormDescription className="text-xs">
//                                 Add instructor signature to certificates
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch checked={field.value} onCheckedChange={field.onChange} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="signature_text"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Signature Name</FormLabel>
//                             <FormControl>
//                               <Input placeholder="John Doe" {...field} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="signature_title"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Signature Title</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Course Instructor" {...field} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>

//                   {/* Completion Settings */}
//                   <Card>
//                     <CardHeader>
//                       <CardTitle className="flex items-center gap-2 text-base">
//                         <Settings2 className="h-4 w-4" />
//                         Completion Requirements
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="completion_threshold"
//                         render={({ field }) => (
//                           <FormItem>
//                             <div className="flex items-center justify-between mb-2">
//                               <FormLabel>Completion Threshold</FormLabel>
//                               <span className="text-sm font-semibold">{field.value}%</span>
//                             </div>
//                             <FormControl>
//                               <Slider
//                                 min={0}
//                                 max={100}
//                                 step={5}
//                                 value={[field.value]}
//                                 onValueChange={(vals) => field.onChange(vals[0])}
//                               />
//                             </FormControl>
//                             <FormDescription>
//                               Minimum course progress required to earn certificate
//                             </FormDescription>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="include_qr_code"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
//                             <div className="space-y-0.5">
//                               <FormLabel>QR Code</FormLabel>
//                               <FormDescription className="text-xs">
//                                 Add QR code for verification
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch checked={field.value} onCheckedChange={field.onChange} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="include_verification_url"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
//                             <div className="space-y-0.5">
//                               <FormLabel>Verification URL</FormLabel>
//                               <FormDescription className="text-xs">
//                                 Add verification link at bottom
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch checked={field.value} onCheckedChange={field.onChange} />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Right Side - Preview */}
//                 <div className="space-y-4">
//                   <Card className="sticky top-4">
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <CardTitle className="flex items-center gap-2 text-base">
//                           <Eye className="h-4 w-4" />
//                           Preview
//                         </CardTitle>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={handleDownloadPreview}
//                         >
//                           <Download className="mr-2 h-4 w-4" />
//                           Download
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       {/* Certificate Preview */}
//                       <div
//                         ref={certificatePreviewRef}
//                         className="aspect-[1.414/1] w-full rounded-lg overflow-hidden"
//                         style={{
//                           background: `linear-gradient(135deg, ${primaryColor}10 0%, ${secondaryColor}10 100%)`,
//                           border: borderStyle === "simple" ? `2px solid ${primaryColor}` :
//                                   borderStyle === "decorative" ? `4px double ${primaryColor}` :
//                                   borderStyle === "gradient" ? `4px solid transparent` : "none",
//                           backgroundImage: borderStyle === "gradient" 
//                             ? `linear-gradient(white, white), linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
//                             : undefined,
//                           backgroundOrigin: borderStyle === "gradient" ? "border-box" : undefined,
//                           backgroundClip: borderStyle === "gradient" ? "padding-box, border-box" : undefined,
//                         }}
//                       >
//                         <div className="h-full flex flex-col items-center justify-center p-8 text-center">
//                           {/* Logo/Header */}
//                           <div className="mb-6">
//                             <Award className="h-12 w-12 mx-auto mb-2" style={{ color: primaryColor }} />
//                             <h3 className="text-sm font-bold" style={{ color: primaryColor }}>
//                               Certificate of Completion
//                             </h3>
//                           </div>

//                           {/* Content */}
//                           <div className="space-y-4 flex-1 flex flex-col justify-center">
//                             <p className="text-xs text-muted-foreground">This certifies that</p>
//                             <h2 
//                               className="text-2xl font-bold"
//                               style={{ fontFamily: fontFamily === "cursive" ? "cursive" : fontFamily }}
//                             >
//                               Student Name
//                             </h2>
//                             <p className="text-xs text-muted-foreground">has successfully completed</p>
//                             <h3 className="text-lg font-semibold">{CD.title}</h3>
//                             <p className="text-xs text-muted-foreground">
//                               Completion Date: {new Date().toLocaleDateString()}
//                             </p>
//                           </div>

//                           {/* Signature */}
//                           {form.watch("signature_enabled") && (
//                             <div className="mt-6 border-t pt-4">
//                               <div 
//                                 className="text-lg font-bold mb-1"
//                                 style={{ fontFamily: "cursive" }}
//                               >
//                                 {form.watch("signature_text") || "Signature"}
//                               </div>
//                               <div className="text-xs text-muted-foreground">
//                                 {form.watch("signature_title") || "Instructor"}
//                               </div>
//                             </div>
//                           )}

//                           {/* Verification */}
//                           {form.watch("include_verification_url") && (
//                             <div className="mt-4 text-xs text-muted-foreground">
//                               Verify at: selfupgrad.com/verify/ABC123
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Preview Info */}
//                       <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
//                         <div className="flex items-center gap-2 mb-1">
//                           <Sparkles className="h-3 w-3" />
//                           <span className="font-medium">Preview Mode</span>
//                         </div>
//                         <p>
//                           This is a live preview. Actual certificates will be generated as PDF with high resolution.
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>

//               {/* Info Card */}
//               <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
//                 <CardHeader>
//                   <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2 text-base">
//                     <CheckCircle2 className="h-5 w-5" />
//                     Certificate Benefits
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2 text-sm text-green-800 dark:text-green-200">
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <strong>Increase completion rates:</strong> Students are more motivated when they receive a certificate
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <strong>Professional credibility:</strong> Certificates add value to your course
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-2">
//                     <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
//                     <div>
//                       <strong>Shareable achievement:</strong> Students can share on LinkedIn and other platforms
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               disabled={loading}
//               onClick={() => form.reset()}
//             >
//               Reset
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Saving..." : "Save Certificate Settings"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }