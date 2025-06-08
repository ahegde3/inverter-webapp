"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import AddAdminDialog from "./AddAdminDialog";
import { User } from "@/lib/schema";

export default function ProfileIcon() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState<User | undefined>();

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (!userDataString) return;
    const userData = JSON.parse(userDataString);
    setUserData(userData);
  }, []);

  function handleLogout() {
    // Clear the authentication cookie
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; secure";

    // Clear user data from localStorage
    localStorage.removeItem("userData");

    // Redirect to login page
    router.push("/");
  }

  const getNameInitial = () => {
    if (!userData || !userData.firstName || !userData.lastName) return "A";
    const initial = userData.firstName[0] + userData.lastName[0];
    return initial;
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className="h-10 w-10">
            {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
            <AvatarFallback>{getNameInitial()}</AvatarFallback>
          </Avatar>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-48">
        <div className="flex flex-col space-y-2">
          {userData && userData.role === "SUPER_ADMIN" && (
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
