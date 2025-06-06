"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AddAdminDialog from "./AddAdminDialog";

export default function ProfileIcon() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const role = useMemo(() => {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return;
    const userData = JSON.parse(userDataString);
    return userData.role;
  }, []);

  function handleLogout() {
    router.push("/");
    // Implement logout functionality here
    console.log("Logging out...");
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-48">
        <div className="flex flex-col space-y-2">
          {role === "SUPER_ADMIN" && (
            <AddAdminDialog
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            />
          )}
          <Button
            variant="ghost"
            className="flex items-center justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
