"use client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RxExternalLink } from "react-icons/rx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const HomePage = () => {
  return (
    <div className="p-5 flex ">
      <CustomerListComponent />
    </div>
  );
};

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

export function CustomerListComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCustomers = customerDataList.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleCustomerClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="w-48 border border-gray-300 rounded-md p-3">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
          {selectedCustomer && (
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
                  value={selectedCustomer.firstName}
                  readOnly
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
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
                  value={selectedCustomer.lastName}
                  readOnly
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
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
                  value={selectedCustomer.emailId}
                  readOnly
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
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
                  value={selectedCustomer.address}
                  readOnly
                  rows={3}
                  className="col-span-3 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm resize-none"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default HomePage;
