"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Schema for newsletter form validation
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function NewsLetterForm(props: { className?: string }) {
  const { className } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Simulate a successful newsletter form submission
      console.log(values);
      toast.success(
        "You have been subscribed to our newsletter successfully! (Simulated)",
      );
    } catch (error) {
      console.error("Error submitting newsletter form", error);
      toast.error("Failed to subscribe to our newsletter. Please try again.");
    }
  }

  return (
    <div className={cn("", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-2">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="student@selfupgrad.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="">
              Subscribe
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
