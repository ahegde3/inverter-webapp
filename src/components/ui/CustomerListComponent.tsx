"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RxExternalLink, RxPlus } from "react-icons/rx";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCustomers } from "@/hooks/use-customers";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { CustomerData } from "@/types/customer";

export default function CustomerListComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [editableCustomer, setEditableCustomer] = useState<CustomerData | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomerAddition, setIsCustomerAddition] = useState(false);

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const {
    customers,
    editCustomerData,
    deleteCustomer,
    loading,
    error,
    refetch,
  } = useCustomers({
    search: debouncedSearch || undefined,
    limit: 50, // Fetch more customers for better UX
  });

  const handleCustomerClick = (customer: CustomerData | void) => {
    let canEdit: boolean = false;
    if (!customer) {
      customer = {
        userId: "",
        firstName: "",
        lastName: "",
        emailId: "",
        address: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      canEdit = true;
    }
    setIsCustomerAddition(canEdit);
    setSelectedCustomer(customer);
    setEditableCustomer(customer);
    setIsModalOpen(true);
    setIsEditable(canEdit);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    if (editableCustomer) {
      editCustomerData(editableCustomer);
      setSelectedCustomer(editableCustomer);
      setIsEditable(false);
      // Refetch data to get updated list
      refetch();
    }
  };

  const handleCancelEdit = () => {
    if (isCustomerAddition) {
      setIsCustomerAddition(false);
      setIsModalOpen(false);
      return;
    }
    setEditableCustomer(selectedCustomer);
    setIsEditable(false);
  };

  const updateEditableCustomer = (field: keyof CustomerData, value: string) => {
    if (editableCustomer) {
      setEditableCustomer({
        ...editableCustomer,
        [field]: value,
      });
    }
  };

  const handleCustomerDelete = async (customerId: string): Promise<void> => {
    if (!customerId) return;
    await deleteCustomer(customerId);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
        >
          {isMobileMenuOpen ? (
            <HiX className="w-4 h-4" />
          ) : (
            <HiMenuAlt3 className="w-4 h-4" />
          )}
          {isMobileMenuOpen ? "Close" : "Customer List"}
        </Button>
      </div>

      {/* Customer List Panel */}
      <div
        className={`
        ${isMobileMenuOpen ? "block" : "hidden"} lg:block
        w-full lg:w-80 
        border border-gray-300 rounded-md 
        p-4 lg:p-5 
        h-fit
        mx-4 lg:mx-0
        mb-4 lg:mb-0
      `}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => handleCustomerClick()}
              >
                <RxPlus className="w-5 h-5 text-gray-600 hover:text-gray-800" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-2 text-sm">
              Add New Customer
            </HoverCardContent>
          </HoverCard>
        </div>
        <ScrollArea className="h-64 lg:h-72 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Customer List
            </h4>
            {loading ? (
              <div className="text-sm text-gray-500">Loading customers...</div>
            ) : error ? (
              <div className="text-sm text-red-500 space-y-2">
                <p>Error loading customers: {error}</p>
                <Button variant="outline" size="sm" onClick={refetch}>
                  Retry
                </Button>
              </div>
            ) : customers.length > 0 ? (
              customers.map((customer: CustomerData) => (
                <div key={customer.userId}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{`${customer.firstName} ${customer.lastName}`}</div>
                    <RxExternalLink
                      className="w-4 h-4 text-gray-600 hover:text-gray-800 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    />
                  </div>
                  <Separator className="my-2" />
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No customers found</div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>View customer information</DialogDescription>
          </DialogHeader>
          {selectedCustomer && editableCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="firstName"
                  className="text-right text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  value={editableCustomer.firstName}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    updateEditableCustomer("firstName", e.target.value)
                  }
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm ${
                    isEditable
                      ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "bg-gray-50"
                  }`}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="lastName"
                  className="text-right text-sm font-medium"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  value={editableCustomer.lastName}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    updateEditableCustomer("lastName", e.target.value)
                  }
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm ${
                    isEditable
                      ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "bg-gray-50"
                  }`}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="emailId"
                  className="text-right text-sm font-medium"
                >
                  Email ID
                </label>
                <input
                  id="emailId"
                  type="email"
                  value={editableCustomer.emailId}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    updateEditableCustomer("emailId", e.target.value)
                  }
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm ${
                    isEditable
                      ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "bg-gray-50"
                  }`}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="address"
                  className="text-right text-sm font-medium"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  value={editableCustomer.address}
                  readOnly={!isEditable}
                  onChange={(e) =>
                    updateEditableCustomer("address", e.target.value)
                  }
                  rows={3}
                  className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm resize-none ${
                    isEditable
                      ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "bg-gray-50"
                  }`}
                />
              </div>
              <div className="flex items-center justify-between">
                {isEditable ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button variant="default" onClick={handleSaveClick}>
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={handleEditClick}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleCustomerDelete(selectedCustomer.userId)
                      }
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
