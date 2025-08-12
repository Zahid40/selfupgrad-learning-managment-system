import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Notification } from "iconsax-reactjs";
import { cn } from "@/lib/utils";

const NotificationButton = (props: {
  isFull?: boolean;
  className?: string;
  data?: [];
}) => {
  const { isFull, className } = props;
  return (
    <div className={cn("", className)}>
      <Drawer direction="right">
        <DrawerTrigger onClick={(e) => e.stopPropagation()} asChild>
          <Button variant={"ghost"} size={isFull ? "sm" : "icon"}>
            <Notification className="mr-2 size-4" />
            {isFull && <span>Notification</span>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default NotificationButton;
