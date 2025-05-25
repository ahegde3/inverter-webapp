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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CustomerData {
  firstName: string;
  lastName: string;
  emailId: string;
  address: string;
}

const customerDataList: CustomerData[] = [
  {
    firstName: "John",
    lastName: "Doe",
    emailId: "john.doe@example.com",
    address: "123 Main St, New York, NY 10001",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    emailId: "jane.smith@example.com",
    address: "456 Oak Ave, Los Angeles, CA 90210",
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    emailId: "mike.johnson@example.com",
    address: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    firstName: "Sarah",
    lastName: "Williams",
    emailId: "sarah.williams@example.com",
    address: "321 Elm St, Houston, TX 77001",
  },
  {
    firstName: "David",
    lastName: "Brown",
    emailId: "david.brown@example.com",
    address: "654 Maple Dr, Phoenix, AZ 85001",
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    emailId: "emily.davis@example.com",
    address: "987 Cedar Ln, Philadelphia, PA 19101",
  },
  {
    firstName: "Robert",
    lastName: "Wilson",
    emailId: "robert.wilson@example.com",
    address: "147 Birch St, San Antonio, TX 78201",
  },
];

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

  const filteredCustomers = customerDataList.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleCustomerClick = (customer: CustomerData | void) => {
    let canEdit: boolean = false;
    if (!customer) {
      customer = {
        firstName: "",
        lastName: "",
        emailId: "",
        address: "",
      };
      canEdit = true;
    }
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
      setSelectedCustomer(editableCustomer);
      setIsEditable(false);
      // Here you would typically save to your backend
      console.log("Saving customer data:", editableCustomer);
    }
  };

  const handleCancelEdit = () => {
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

  return (
    <>
      <div className="w-80 border border-gray-300 rounded-md p-5 h-fit">
        <div className="mb-4 flex  items-center justify-between gap-4">
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
        <ScrollArea className="h-72 rounded-md border">
          <div className="p-4">
            <h4 className="mb-4 text-sm font-medium leading-none">
              Customer List
            </h4>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer: CustomerData, idx) => (
                <div key={idx}>
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
                    <Button variant="destructive">Delete</Button>
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
