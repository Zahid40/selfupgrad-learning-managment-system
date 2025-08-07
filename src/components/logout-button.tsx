import { Button } from "@/components/ui/button";
import { Logout } from "iconsax-reactjs";
import { logoutUser } from "@/action/user/user.action";
import { cn } from "@/lib/utils";

export function LogoutButton(props: { className?: string }) {
  return (
    <Button
      variant="secondary"
      className={cn("hover:bg-red-900", props.className)}
      onClick={logoutUser}
    >
      <Logout />
      Logout
    </Button>
  );
}
