"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Plus,
  Calendar,
  User,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Clock,
  RefreshCw,
} from "lucide-react";
import { type Ticket } from "@/lib/schema/ticket";

// Create a simple textarea component inline to avoid import issues
const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={`flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
        className || ""
      }`}
      {...props}
    />
  );
};

// Simple AlertDialog component to avoid import issues
const AlertDialog = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

const AlertDialogContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const AlertDialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4">{children}</div>
);
const AlertDialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);
const AlertDialogDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="text-sm text-muted-foreground mt-2">{children}</p>;
const AlertDialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-end gap-2 mt-6">{children}</div>
);
const AlertDialogCancel = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <Button variant="outline" onClick={onClick}>
    {children}
  </Button>
);
const AlertDialogAction = ({
  onClick,
  className,
  children,
}: {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <Button onClick={onClick} className={className}>
    {children}
  </Button>
);

// Column configuration - Updated to match API status and dark mode
const COLUMNS = [
  {
    id: "OPEN",
    title: "Open",
    color: "bg-slate-100 dark:bg-slate-800",
    mobileColor: "bg-slate-50 dark:bg-slate-900",
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    color: "bg-blue-100 dark:bg-blue-900/30",
    mobileColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: "COMPLETED",
    title: "Completed",
    color: "bg-green-100 dark:bg-green-900/30",
    mobileColor: "bg-green-50 dark:bg-green-900/20",
  },
] as const;

export default function TicketsKanban() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTicket, setNewTicket] = useState({
    customerId: "",
    deviceId: "",
    message: "",
    emailId: "", // Add emailId field as required by API
  });
  const [editTicket, setEditTicket] = useState({
    customerId: "",
    deviceId: "",
    message: "",
    status: "OPEN" as Ticket["status"], // Updated default
  });

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching tickets from API...");

      const response = await fetch("/api/customer/ticket", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        const fetchedTickets = result.tickets || [];

        // Validate and clean ticket data
        const validatedTickets = fetchedTickets.map((ticket: Ticket) => {
          // Ensure status is one of the valid values
          let validatedStatus = ticket.status;
          if (!["OPEN", "IN_PROGRESS", "COMPLETED"].includes(ticket.status)) {
            console.warn(
              `Invalid status "${ticket.status}" for ticket ${ticket.ticketId}, defaulting to OPEN`
            );
            validatedStatus = "OPEN";
          }

          return {
            ...ticket,
            status: validatedStatus,
          };
        });

        console.log(`Loaded ${validatedTickets.length} tickets from database`);

        // Log status distribution for debugging
        const statusCount = validatedTickets.reduce(
          (acc: Record<string, number>, ticket: Ticket) => {
            acc[ticket.status] = (acc[ticket.status] || 0) + 1;
            return acc;
          },
          {}
        );
        console.log("Tickets by status:", statusCount);

        setTickets(validatedTickets);
      } else {
        throw new Error(result.error || "Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch tickets"
      );
      // Fallback to empty array on error
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Group tickets by status
  const groupedTickets = COLUMNS.reduce((acc, column) => {
    const ticketsForColumn = tickets.filter((ticket) => {
      // Ensure we're comparing the right values
      const ticketStatus = ticket.status?.trim().toUpperCase();
      const columnId = column.id.trim().toUpperCase();
      return ticketStatus === columnId;
    });

    acc[column.id] = ticketsForColumn;
    return acc;
  }, {} as Record<string, Ticket[]>);

  // Log grouping results for debugging
  useEffect(() => {
    if (tickets.length > 0) {
      console.log("Grouped tickets:", {
        OPEN: groupedTickets["OPEN"]?.length || 0,
        IN_PROGRESS: groupedTickets["IN_PROGRESS"]?.length || 0,
        COMPLETED: groupedTickets["COMPLETED"]?.length || 0,
        total: tickets.length,
      });

      // Check for any tickets that didn't get grouped
      const totalGrouped = Object.values(groupedTickets).reduce(
        (sum, group) => sum + group.length,
        0
      );
      if (totalGrouped !== tickets.length) {
        console.warn(
          `Grouping mismatch: ${totalGrouped} grouped vs ${tickets.length} total tickets`
        );

        // Log ungrouped tickets
        const allGroupedIds = Object.values(groupedTickets)
          .flat()
          .map((t) => t.ticketId);
        const ungrouped = tickets.filter(
          (t) => !allGroupedIds.includes(t.ticketId)
        );
        console.warn(
          "Ungrouped tickets:",
          ungrouped.map((t) => ({ id: t.ticketId, status: t.status }))
        );
      }
    }
  }, [tickets, groupedTickets]);

  // Update ticket status in backend
  const updateTicketStatus = async (
    ticketId: string,
    newStatus: Ticket["status"]
  ) => {
    try {
      console.log(`Updating ticket ${ticketId} status to ${newStatus}`);

      const response = await fetch("/api/customer/ticket", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId: ticketId,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update ticket status");
      }

      console.log(`Successfully updated ticket ${ticketId} to ${newStatus}`);

      // Update local state immediately for better UX
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.ticketId === ticketId
            ? {
                ...ticket,
                status: newStatus,
                updatedAt: result.ticket.updatedAt || new Date().toISOString(),
              }
            : ticket
        )
      );

      return result;
    } catch (error) {
      console.error("Error updating ticket status:", error);

      // Show error message to user
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update ticket status";
      alert(`Error updating ticket: ${errorMessage}`);

      throw error;
    }
  };

  // Handle drag and drop (enhanced with backend update)
  const moveTicket = async (ticketId: string, newStatus: Ticket["status"]) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      await fetchTickets(); // Refresh tickets after update
    } catch (moveError) {
      console.error("Error moving ticket:", moveError);
      setError(
        moveError instanceof Error ? moveError.message : "Failed to move ticket"
      );
    }
  };

  // Handle ticket click
  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setEditTicket({
      customerId: ticket.customerId,
      deviceId: ticket.deviceId,
      message: ticket.message,
      status: ticket.status,
    });
    setIsEditDialogOpen(true);
  };

  // Create new ticket - Enhanced API connection
  const createTicket = async () => {
    try {
      setIsCreating(true);
      setError(null);

      // Validate required fields
      if (!newTicket.customerId.trim()) {
        alert("Please enter a Customer ID");
        return;
      }
      if (!newTicket.deviceId.trim()) {
        alert("Please enter a Device ID");
        return;
      }
      if (!newTicket.message.trim()) {
        alert("Please enter a message describing the issue");
        return;
      }
      if (!newTicket.emailId.trim()) {
        alert("Please enter an email address");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newTicket.emailId)) {
        alert("Please enter a valid email address");
        return;
      }

      console.log("Creating ticket with data:", {
        customerId: newTicket.customerId,
        deviceId: newTicket.deviceId,
        emailId: newTicket.emailId,
        message: newTicket.message,
      });

      // Call your existing API exactly as it expects
      const response = await fetch("/api/customer/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: newTicket.customerId,
          deviceId: newTicket.deviceId,
          emailId: newTicket.emailId,
          message: newTicket.message,
        }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response data:", result);

      if (result.success) {
        // Create ticket object matching the API structure
        // const newTicketData: Ticket = {
        //   ticketId: result.ticketId,
        //   customerId: newTicket.customerId,
        //   deviceId: newTicket.deviceId,
        //   message: newTicket.message,
        //   status: "OPEN", // API creates tickets with "OPEN" status
        //   createdAt: new Date().toISOString(),
        //   updatedAt: new Date().toISOString(),
        //   PK: `TICKET#${result.ticketId}`,
        //   SK: "DETAILS",
        // };

        // Reset form and close dialog
        setNewTicket({
          customerId: "",
          deviceId: "",
          message: "",
          emailId: "",
        });
        setIsCreateDialogOpen(false);

        // Show success message
        alert(`Ticket created successfully! Ticket ID: ${result.ticketId}`);
        console.log("Ticket created successfully:", result.ticketId);

        // Refresh tickets list from database
        await fetchTickets();
      } else {
        // Handle API error response
        const errorMessage = result.error || "Failed to create ticket";
        alert(`Error: ${errorMessage}`);
        console.error("API returned error:", result);
      }
    } catch (createError) {
      console.error("Error creating ticket:", createError);
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create ticket"
      );
    } finally {
      setIsCreating(false);
      setNewTicket({
        customerId: "",
        deviceId: "",
        message: "",
        emailId: "",
      });
    }
  };

  // Update existing ticket
  const updateTicket = async () => {
    try {
      if (!selectedTicket) return;

      if (
        !editTicket.customerId ||
        !editTicket.deviceId ||
        !editTicket.message
      ) {
        alert("Please fill in all fields");
        return;
      }

      // In a real app, you'd call a PUT/PATCH API endpoint here
      // For now, we'll just update the local state
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.ticketId === selectedTicket.ticketId
            ? {
                ...ticket,
                customerId: editTicket.customerId,
                deviceId: editTicket.deviceId,
                message: editTicket.message,
                status: editTicket.status,
                updatedAt: new Date().toISOString(),
              }
            : ticket
        )
      );

      setIsEditDialogOpen(false);
      setSelectedTicket(null);
      alert("Ticket updated successfully!");
    } catch (updateError) {
      console.error("Error updating ticket:", updateError);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update ticket"
      );
    }
  };

  // Delete ticket
  const deleteTicket = async () => {
    try {
      if (!selectedTicket) return;

      // In a real app, you'd call a DELETE API endpoint here
      // For now, we'll just update the local state
      setTickets((prev) =>
        prev.filter((ticket) => ticket.ticketId !== selectedTicket.ticketId)
      );

      setIsDeleteDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedTicket(null);
      alert("Ticket deleted successfully!");
    } catch (deleteError) {
      console.error("Error deleting ticket:", deleteError);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete ticket"
      );
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format detailed date for display
  const formatDetailedDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: Ticket["status"]) => {
    switch (status) {
      case "OPEN":
        return "secondary";
      case "IN_PROGRESS":
        return "default";
      case "COMPLETED":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Check if ticket was recently updated (within last 24 hours)
  const isRecentlyUpdated = (createdAt: string, updatedAt: string) => {
    const created = new Date(createdAt);
    const updated = new Date(updatedAt);
    const now = new Date();
    const timeDiff = updated.getTime() - created.getTime();
    const recentUpdateThreshold = 24 * 60 * 60 * 1000; // 24 hours

    return (
      timeDiff > 60000 &&
      now.getTime() - updated.getTime() < recentUpdateThreshold
    ); // More than 1 minute diff and within 24 hours
  };

  return (
    <div className="p-3 sm:p-6 h-full">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-xl sm:text-2xl font-bold">Support Tickets</h1>
            {isLoading && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage and track customer support tickets
            {!isLoading && !error && (
              <span className="ml-2 text-xs">({tickets.length} tickets)</span>
            )}
          </p>
          {error && (
            <div className="flex items-center gap-2 mt-1 text-red-600 text-sm justify-center sm:justify-start">
              <span>⚠️ {error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchTickets}
                className="h-6 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={fetchTickets}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {/* Create New Ticket Dialog */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              // Allow opening the dialog, but prevent closing from outside clicks
              if (open) {
                setIsCreateDialogOpen(true);
              } else if (!isCreating) {
                // Only allow closing through explicit button clicks when not creating
                setIsCreateDialogOpen(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none" disabled={isCreating}>
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[500px] mx-4 w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto"
              onPointerDownOutside={(e) => e.preventDefault()}
              onEscapeKeyDown={(e) => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogDescription>
                  Create a new support ticket for a customer device issue.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId" className="text-sm font-medium">
                    Customer ID *
                  </Label>
                  <Input
                    id="customerId"
                    value={newTicket.customerId}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        customerId: e.target.value,
                      }))
                    }
                    placeholder="CUST001"
                    disabled={isCreating}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deviceId" className="text-sm font-medium">
                    Device ID *
                  </Label>
                  <Input
                    id="deviceId"
                    value={newTicket.deviceId}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        deviceId: e.target.value,
                      }))
                    }
                    placeholder="DEV001"
                    disabled={isCreating}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailId" className="text-sm font-medium">
                    Customer Email *
                  </Label>
                  <Input
                    id="emailId"
                    type="email"
                    value={newTicket.emailId}
                    onChange={(e) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        emailId: e.target.value,
                      }))
                    }
                    placeholder="customer@example.com"
                    disabled={isCreating}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Issue Description *
                  </Label>
                  <Textarea
                    id="message"
                    value={newTicket.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewTicket((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Describe the issue in detail..."
                    rows={4}
                    disabled={isCreating}
                    className="w-full resize-none"
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  * Required fields
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (!isCreating) {
                      setNewTicket({
                        customerId: "",
                        deviceId: "",
                        message: "",
                        emailId: "",
                      });
                      setIsCreateDialogOpen(false);
                    }
                  }}
                  disabled={isCreating}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={createTicket}
                  className="w-full sm:w-auto"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating Ticket...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Ticket
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Ticket Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] mx-4 w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              Update ticket details or delete the ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label
                htmlFor="edit-customerId"
                className="sm:text-right font-medium"
              >
                Customer ID
              </Label>
              <Input
                id="edit-customerId"
                value={editTicket.customerId}
                onChange={(e) =>
                  setEditTicket((prev) => ({
                    ...prev,
                    customerId: e.target.value,
                  }))
                }
                className="sm:col-span-3"
                placeholder="CUST001"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label
                htmlFor="edit-deviceId"
                className="sm:text-right font-medium"
              >
                Device ID
              </Label>
              <Input
                id="edit-deviceId"
                value={editTicket.deviceId}
                onChange={(e) =>
                  setEditTicket((prev) => ({
                    ...prev,
                    deviceId: e.target.value,
                  }))
                }
                className="sm:col-span-3"
                placeholder="DEV001"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label
                htmlFor="edit-status"
                className="sm:text-right font-medium"
              >
                Status
              </Label>
              <select
                id="edit-status"
                value={editTicket.status}
                onChange={(e) =>
                  setEditTicket((prev) => ({
                    ...prev,
                    status: e.target.value as Ticket["status"],
                  }))
                }
                className="sm:col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
              <Label
                htmlFor="edit-message"
                className="sm:text-right font-medium"
              >
                Message
              </Label>
              <Textarea
                id="edit-message"
                value={editTicket.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEditTicket((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="sm:col-span-3"
                placeholder="Describe the issue..."
                rows={3}
              />
            </div>

            {/* Additional Information Section */}
            {selectedTicket && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 pt-2 border-t">
                  <Label className="sm:text-right font-medium text-muted-foreground">
                    Ticket ID
                  </Label>
                  <div className="sm:col-span-3 text-sm font-mono bg-muted px-2 py-1 rounded">
                    {selectedTicket.ticketId}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label className="sm:text-right font-medium text-muted-foreground">
                    Created At
                  </Label>
                  <div className="sm:col-span-3 text-sm text-muted-foreground">
                    {formatDetailedDate(selectedTicket.createdAt)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label className="sm:text-right font-medium text-muted-foreground">
                    Last Updated
                  </Label>
                  <div className="sm:col-span-3 text-sm text-muted-foreground flex items-center gap-2">
                    {formatDetailedDate(selectedTicket.updatedAt)}
                    {isRecentlyUpdated(
                      selectedTicket.createdAt,
                      selectedTicket.updatedAt
                    ) && (
                      <Badge variant="outline" className="text-xs">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Recently Updated
                      </Badge>
                    )}
                  </div>
                </div>

                {selectedTicket.PK && (
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
                    <Label className="sm:text-right font-medium text-muted-foreground">
                      Database Key
                    </Label>
                    <div className="sm:col-span-3 text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                      PK: {selectedTicket.PK} | SK: {selectedTicket.SK}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Ticket
            </Button>
            <Button
              type="submit"
              onClick={updateTicket}
              className="w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              ticket
              {selectedTicket && ` "${selectedTicket.ticketId}"`} and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTicket}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Kanban Board - Mobile Optimized */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading tickets...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">⚠️ Failed to load tickets</p>
            <Button onClick={fetchTickets} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 h-full">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div
                className={`${column.color} lg:${column.color} md:${column.mobileColor} rounded-lg p-3 sm:p-4 mb-3 sm:mb-4`}
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold text-base sm:text-lg">
                    {column.title}
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {groupedTickets[column.id]?.length || 0}
                  </Badge>
                </div>
              </div>

              {/* Tickets Container */}
              <div className="flex-1 space-y-1 sm:space-y-2 overflow-y-auto pb-4">
                {groupedTickets[column.id]?.length > 0 ? (
                  groupedTickets[column.id]?.map((ticket) => (
                    <Card
                      key={ticket.ticketId}
                      className="cursor-pointer hover:shadow-md transition-shadow touch-manipulation relative"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", ticket.ticketId);
                      }}
                      onClick={() => handleTicketClick(ticket)}
                      // Touch events for mobile drag and drop
                      onTouchStart={(e) => {
                        e.currentTarget.style.opacity = "0.7";
                      }}
                      onTouchEnd={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      {/* Recently Updated Indicator */}
                      {isRecentlyUpdated(
                        ticket.createdAt,
                        ticket.updatedAt
                      ) && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      )}

                      <CardHeader className="pb-0.5 p-1.5 sm:p-2">
                        <div className="flex justify-between items-start gap-1.5">
                          <CardTitle className="text-xs sm:text-sm font-medium truncate">
                            {ticket.ticketId}
                          </CardTitle>
                          <Badge
                            variant={getStatusBadgeVariant(ticket.status)}
                            className="text-[10px] sm:text-xs whitespace-nowrap px-1.5 py-0.5"
                          >
                            {column.title}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 p-1.5 sm:p-2 sm:pt-0">
                        <CardDescription className="text-xs sm:text-sm mb-1 line-clamp-2">
                          {ticket.message}
                        </CardDescription>

                        {/* Ticket Info - Condensed */}
                        <div className="space-y-0.5">
                          <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
                            <User className="mr-1 h-2.5 w-2.5 flex-shrink-0" />
                            <span className="truncate">
                              {ticket.customerId}
                            </span>
                          </div>
                          <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
                            <MessageCircle className="mr-1 h-2.5 w-2.5 flex-shrink-0" />
                            <span className="truncate">{ticket.deviceId}</span>
                          </div>
                          <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
                            <Calendar className="mr-1 h-2.5 w-2.5 flex-shrink-0" />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                          {ticket.createdAt !== ticket.updatedAt && (
                            <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground">
                              <Clock className="mr-1 h-2.5 w-2.5 flex-shrink-0" />
                              <span>{formatDate(ticket.updatedAt)}</span>
                            </div>
                          )}
                        </div>

                        {/* Quick action buttons - Compact */}
                        <div className="flex gap-1 mt-1.5">
                          {column.id !== "OPEN" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const prevStatus =
                                  column.id === "COMPLETED"
                                    ? "IN_PROGRESS"
                                    : "OPEN";
                                try {
                                  await updateTicketStatus(
                                    ticket.ticketId,
                                    prevStatus as Ticket["status"]
                                  );
                                } catch (error) {
                                  console.log("error", error);
                                  // Error handling is already done in updateTicketStatus
                                }
                              }}
                              className="text-[10px] sm:text-xs flex-1 sm:flex-none p-0.5 sm:p-1 h-6 sm:h-7"
                            >
                              <ChevronLeft className="h-2.5 w-2.5 sm:mr-1" />
                              <span className="hidden sm:inline">Back</span>
                            </Button>
                          )}
                          {column.id !== "COMPLETED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async (e) => {
                                e.stopPropagation();
                                const nextStatus =
                                  column.id === "OPEN"
                                    ? "IN_PROGRESS"
                                    : "COMPLETED";
                                try {
                                  await updateTicketStatus(
                                    ticket.ticketId,
                                    nextStatus as Ticket["status"]
                                  );
                                } catch (error) {
                                  console.log("error", error);
                                  // Error handling is already done in updateTicketStatus
                                }
                              }}
                              className="text-[10px] sm:text-xs flex-1 sm:flex-none p-0.5 sm:p-1 h-6 sm:h-7"
                            >
                              <span className="hidden sm:inline">Next</span>
                              <ChevronRight className="h-2.5 w-2.5 sm:ml-1" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  /* Empty state for column */
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <p className="text-xs sm:text-sm">
                        No {column.title.toLowerCase()} tickets
                      </p>
                    </div>
                  </div>
                )}

                {/* Drop zone - Mobile Optimized */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 text-center text-muted-foreground min-h-[50px] sm:min-h-[80px] flex items-center justify-center text-sm"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const ticketId = e.dataTransfer.getData("text/plain");
                    if (ticketId) {
                      try {
                        await moveTicket(
                          ticketId,
                          column.id as Ticket["status"]
                        );
                      } catch (error) {
                        console.log("error", error);
                        // Error handling is already done in moveTicket
                      }
                    }
                  }}
                >
                  <span className="text-xs sm:text-sm">Drop tickets here</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
