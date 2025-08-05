import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
        <div className="flex flex-col gap-2 max-w-md w-full">
          <h1 className="text-lg text-center">Thank you for signing up!</h1>
          <p className="text-center text-xs">Check your email to confirm</p>
          <p className="text-sm  text-center text-muted-foreground">
            You&apos;ve successfully signed up. Please check your email to
            confirm your account before signing in.
          </p>
        </div>
    
  );
}
