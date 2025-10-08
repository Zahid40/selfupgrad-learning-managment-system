// "use client";
// import React, { useState, useEffect } from "react";
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
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge";
// import { useUser } from "@/components/provider/user-provider";
// import { updateCourse } from "@/action/course/course.action";
// import { useRouter } from "next/navigation";
// import { Plus, Trash2, DollarSign, Percent } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// const pricingFormSchema = z.object({
//   pricing_model: z.enum(["free", "paid", "subscription"]),
//   base_price: z.number().min(0, "Price must be positive").optional(),
//   default_currency: z.string().default("USD"),
//   trial_available: z.boolean().default(false),
//   subscription_period: z.enum(["monthly", "yearly", "lifetime"]).optional(),
//   subscription_price: z.number().min(0).optional(),
//   discount_percentage: z.number().min(0).max(100).optional(),
//   discount_valid_until: z.string().optional(),
//   country_prices: z.array(
//     z.object({
//       country: z.string(),
//       price: z.number(),
//       currency: z.string(),
//     })
//   ).optional(),
// });

// type PricingFormValues = z.infer<typeof pricingFormSchema>;

// const currencies = [
//   { code: "USD", symbol: "$", name: "US Dollar" },
//   { code: "EUR", symbol: "€", name: "Euro" },
//   { code: "GBP", symbol: "£", name: "British Pound" },
//   { code: "INR", symbol: "₹", name: "Indian Rupee" },
//   { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
//   { code: "AUD", symbol: "A$", name: "Australian Dollar" },
// ];

// const countries = [
//   { code: "US", name: "United States", defaultCurrency: "USD" },
//   { code: "GB", name: "United Kingdom", defaultCurrency: "GBP" },
//   { code: "IN", name: "India", defaultCurrency: "INR" },
//   { code: "CA", name: "Canada", defaultCurrency: "CAD" },
//   { code: "AU", name: "Australia", defaultCurrency: "AUD" },
//   { code: "DE", name: "Germany", defaultCurrency: "EUR" },
//   { code: "FR", name: "France", defaultCurrency: "EUR" },
// ];

// export default function CoursePricingForm(props: { courseData: CourseType }) {
//   const CD = props.courseData;
//   const { user } = useUser();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [pricingId, setPricingId] = useState<string | null>(CD.pricing_id);

//   // Fetch existing pricing data
//   const [existingPricing, setExistingPricing] = useState<any>(null);

//   const form = useForm<PricingFormValues>({
//     resolver: zodResolver(pricingFormSchema),
//     defaultValues: {
//       pricing_model: "free",
//       base_price: 0,
//       default_currency: "USD",
//       trial_available: false,
//       subscription_period: "monthly",
//       subscription_price: 0,
//       discount_percentage: 0,
//       discount_valid_until: "",
//       country_prices: [],
//     },
//   });

//   const pricingModel = form.watch("pricing_model");
//   const defaultCurrency = form.watch("default_currency");

//   // Load existing pricing data
//   useEffect(() => {
//     if (pricingId) {
//       // TODO: Fetch pricing data from Supabase
//       // const fetchPricing = async () => {
//       //   const { data } = await supabase
//       //     .from('pricing')
//       //     .select('*')
//       //     .eq('id', pricingId)
//       //     .single();
//       //   if (data) {
//       //     setExistingPricing(data);
//       //     form.reset({
//       //       pricing_model: data.pricing_model,
//       //       base_price: data.base_price,
//       //       default_currency: data.default_currency,
//       //       trial_available: data.trial_available,
//       //       // ... other fields
//       //     });
//       //   }
//       // };
//       // fetchPricing();
//     }
//   }, [pricingId]);

//   const addCountryPrice = () => {
//     const currentPrices = form.getValues("country_prices") || [];
//     form.setValue("country_prices", [
//       ...currentPrices,
//       { country: "US", price: 0, currency: "USD" },
//     ]);
//   };

//   const removeCountryPrice = (index: number) => {
//     const currentPrices = form.getValues("country_prices") || [];
//     form.setValue(
//       "country_prices",
//       currentPrices.filter((_, i) => i !== index)
//     );
//   };

//   const getCurrencySymbol = (code: string) => {
//     return currencies.find((c) => c.code === code)?.symbol || "$";
//   };

//   async function onSubmit(values: PricingFormValues) {
//     console.log("Pricing Data:", values);
//     setLoading(true);

//     try {
//       // First, create or update pricing record
//       // TODO: Implement pricing creation/update
//       const pricingData = {
//         pricing_model: values.pricing_model,
//         base_price: values.pricing_model === "free" ? 0 : values.base_price,
//         default_currency: values.default_currency,
//         trial_available: values.trial_available,
//         subscription_details:
//           values.pricing_model === "subscription"
//             ? {
//                 period: values.subscription_period,
//                 price: values.subscription_price,
//               }
//             : null,
//         discounts:
//           values.discount_percentage && values.discount_percentage > 0
//             ? {
//                 percentage: values.discount_percentage,
//                 valid_until: values.discount_valid_until,
//               }
//             : null,
//         country_prices: values.country_prices,
//       };

//       // const { data: pricingRecord } = await supabase
//       //   .from('pricing')
//       //   .upsert({ id: pricingId, ...pricingData })
//       //   .select()
//       //   .single();

//       // Then update course with pricing_id
//       // const result = await updateCourse(
//       //   CD.id,
//       //   { pricing_id: pricingRecord.id },
//       //   user.id
//       // );

//       // Temporary: Just show success
//       toast.success("Pricing settings updated successfully!");
//       router.refresh();
//     } catch (error) {
//       console.error("Pricing update error", error);
//       toast.error("Failed to update pricing. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="w-full max-w-4xl">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           {/* Pricing Model Selection */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Pricing Model</CardTitle>
//               <CardDescription>
//                 Choose how you want to monetize this course
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <FormField
//                 control={form.control}
//                 name="pricing_model"
//                 render={({ field }) => (
//                   <FormItem className="space-y-3">
//                     <FormControl>
//                       <RadioGroup
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                         className="grid gap-4 md:grid-cols-3"
//                       >
//                         <Label
//                           htmlFor="free"
//                           className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
//                             field.value === "free" ? "border-primary" : ""
//                           }`}
//                         >
//                           <RadioGroupItem value="free" id="free" className="sr-only" />
//                           <DollarSign className="mb-3 h-6 w-6" />
//                           <div className="text-center">
//                             <div className="font-semibold">Free</div>
//                             <div className="text-sm text-muted-foreground">
//                               No cost to enroll
//                             </div>
//                           </div>
//                         </Label>

//                         <Label
//                           htmlFor="paid"
//                           className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
//                             field.value === "paid" ? "border-primary" : ""
//                           }`}
//                         >
//                           <RadioGroupItem value="paid" id="paid" className="sr-only" />
//                           <DollarSign className="mb-3 h-6 w-6" />
//                           <div className="text-center">
//                             <div className="font-semibold">One-time Payment</div>
//                             <div className="text-sm text-muted-foreground">
//                               Single purchase
//                             </div>
//                           </div>
//                         </Label>

//                         <Label
//                           htmlFor="subscription"
//                           className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
//                             field.value === "subscription" ? "border-primary" : ""
//                           }`}
//                         >
//                           <RadioGroupItem
//                             value="subscription"
//                             id="subscription"
//                             className="sr-only"
//                           />
//                           <DollarSign className="mb-3 h-6 w-6" />
//                           <div className="text-center">
//                             <div className="font-semibold">Subscription</div>
//                             <div className="text-sm text-muted-foreground">
//                               Recurring payment
//                             </div>
//                           </div>
//                         </Label>
//                       </RadioGroup>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>

//           {/* Paid Course Settings */}
//           {pricingModel === "paid" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>One-time Payment Settings</CardTitle>
//                 <CardDescription>
//                   Set the base price for your course
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="base_price"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Base Price *</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <span className="absolute left-3 top-2.5 text-muted-foreground">
//                               {getCurrencySymbol(defaultCurrency)}
//                             </span>
//                             <Input
//                               type="number"
//                               placeholder="49.99"
//                               className="pl-8"
//                               {...field}
//                               onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="default_currency"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Currency *</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select currency" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {currencies.map((currency) => (
//                               <SelectItem key={currency.code} value={currency.code}>
//                                 {currency.symbol} {currency.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Subscription Settings */}
//           {pricingModel === "subscription" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Subscription Settings</CardTitle>
//                 <CardDescription>
//                   Configure recurring payment options
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="subscription_period"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Billing Period *</FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select period" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="monthly">Monthly</SelectItem>
//                             <SelectItem value="yearly">Yearly</SelectItem>
//                             <SelectItem value="lifetime">Lifetime Access</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="subscription_price"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Price *</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <span className="absolute left-3 top-2.5 text-muted-foreground">
//                               {getCurrencySymbol(defaultCurrency)}
//                             </span>
//                             <Input
//                               type="number"
//                               placeholder="9.99"
//                               className="pl-8"
//                               {...field}
//                               onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                             />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <FormField
//                   control={form.control}
//                   name="default_currency"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Currency *</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select currency" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {currencies.map((currency) => (
//                             <SelectItem key={currency.code} value={currency.code}>
//                               {currency.symbol} {currency.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </CardContent>
//             </Card>
//           )}

//           {/* Trial Settings */}
//           {pricingModel !== "free" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Trial Period</CardTitle>
//                 <CardDescription>
//                   Offer a free trial to increase enrollments
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <FormField
//                   control={form.control}
//                   name="trial_available"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                       <div className="space-y-0.5">
//                         <FormLabel className="text-base">Enable Free Trial</FormLabel>
//                         <FormDescription>
//                           Allow students to try your course before purchasing
//                         </FormDescription>
//                       </div>
//                       <FormControl>
//                         <Switch
//                           checked={field.value}
//                           onCheckedChange={field.onChange}
//                         />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </CardContent>
//             </Card>
//           )}

//           {/* Discount Settings */}
//           {pricingModel !== "free" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Promotional Discount</CardTitle>
//                 <CardDescription>
//                   Set a limited-time discount for your course
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="discount_percentage"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Discount Percentage</FormLabel>
//                         <FormControl>
//                           <div className="relative">
//                             <Input
//                               type="number"
//                               placeholder="20"
//                               min="0"
//                               max="100"
//                               {...field}
//                               onChange={(e) => field.onChange(parseFloat(e.target.value))}
//                             />
//                             <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
//                           </div>
//                         </FormControl>
//                         <FormDescription>0-100%</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="discount_valid_until"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Valid Until</FormLabel>
//                         <FormControl>
//                           <Input type="date" {...field} />
//                         </FormControl>
//                         <FormDescription>Leave empty for no expiry</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Country-specific Pricing */}
//           {pricingModel !== "free" && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Country-specific Pricing</CardTitle>
//                 <CardDescription>
//                   Set different prices for different countries (optional)
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {form.watch("country_prices")?.map((_, index) => (
//                   <div key={index} className="grid grid-cols-12 gap-3 items-end">
//                     <div className="col-span-4">
//                       <Label>Country</Label>
//                       <Select
//                         value={form.watch(`country_prices.${index}.country`)}
//                         onValueChange={(value) =>
//                           form.setValue(`country_prices.${index}.country`, value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {countries.map((country) => (
//                             <SelectItem key={country.code} value={country.code}>
//                               {country.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="col-span-3">
//                       <Label>Currency</Label>
//                       <Select
//                         value={form.watch(`country_prices.${index}.currency`)}
//                         onValueChange={(value) =>
//                           form.setValue(`country_prices.${index}.currency`, value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {currencies.map((currency) => (
//                             <SelectItem key={currency.code} value={currency.code}>
//                               {currency.code}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="col-span-4">
//                       <Label>Price</Label>
//                       <Input
//                         type="number"
//                         placeholder="0.00"
//                         value={form.watch(`country_prices.${index}.price`)}
//                         onChange={(e) =>
//                           form.setValue(
//                             `country_prices.${index}.price`,
//                             parseFloat(e.target.value)
//                           )
//                         }
//                       />
//                     </div>

//                     <div className="col-span-1">
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => removeCountryPrice(index)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}

//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addCountryPrice}
//                   className="w-full"
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Country Price
//                 </Button>
//               </CardContent>
//             </Card>
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
//               {loading ? "Saving..." : "Save Pricing"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }