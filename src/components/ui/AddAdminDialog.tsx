"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { UserRegistrationSchema } from "@/types/auth";

interface AddAdminDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddAdminDialog({
  isOpen,
  onOpenChange,
}: AddAdminDialogProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phone: "",
    address: "",
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const addNewAdmin = async (body: object) => {
    const validationResult = UserRegistrationSchema.safeParse({
      ...body,
      role: "ADMIN",
    });

    if (!validationResult.success) {
      throw new Error(
        validationResult.error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ")
      );
    }

    try {
      console.log(validationResult.data);
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          "success" in data && !data.success
            ? data?.error
            : "Failed to update customer"
        );
      }

      // if ("success" in data && data.success) {
      //   // Refetch customers to update the list
      //   await fetchCustomers();
      // } else {
      //   throw new Error("Invalid response format");
      // }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      // setError(errorMessage);
      console.error("Error deleting customer:", errorMessage);
    }
  };

  async function handleAddAdmin() {
    // Implement add admin functionality here
    console.log("Adding admin:", formData);
    await addNewAdmin(formData);
    onOpenChange(false);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      emailId: "",
      phone: "",
      address: "",
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-start">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Admin</DialogTitle>
          <DialogDescription>
            Enter the details for the new admin user. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter first name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter last name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emailId" className="text-right">
              emailId
            </Label>
            <Input
              id="emailId"
              name="emailId"
              type="emailId"
              value={formData.emailId}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter email address"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter phone number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Role
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Enter role (e.g., Admin, Super Admin)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddAdmin}>
            Save Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
