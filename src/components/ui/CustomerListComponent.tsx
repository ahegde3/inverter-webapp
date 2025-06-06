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
import { Dialog } from "@/components/ui/dialog";
import CustomerInformationModal from "./CustomerInformationModal";
import { useCustomers } from "@/hooks/use-customers";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { CustomerData } from "@/types/customer";
import type { Device } from "@/lib/schema";

interface CustomerListComponentProps {
  selectedCustomerDetail: CustomerData | null;
  setSelectedCustomerDetail: (customer: CustomerData | null) => void;
}

export default function CustomerListComponent({
  selectedCustomerDetail,
  setSelectedCustomerDetail,
}: CustomerListComponentProps) {
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
  const [deviceData, setDeviceData] = useState<Device[] | null>(null);

  // Debounce search query to avoid too many API calls
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const {
    customers,
    addNewCustomer,
    editCustomerData,
    deleteCustomer,
    loading,
    error,
    refetch,
  } = useCustomers({
    search: debouncedSearch || undefined,
    setSelectedCustomerDetail,
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
    getDeviceData();
    setIsModalOpen(true);
    setIsEditable(canEdit);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleSaveClick = () => {
    if (editableCustomer) {
      if (isCustomerAddition) {
        addNewCustomer({ ...editableCustomer, role: "CUSTOMER" });
      } else editCustomerData(editableCustomer);
      setSelectedCustomer(editableCustomer);
      setIsEditable(false);
      // Refetch data to get updated list
      refetch();
    }
  };

  const handleCancelEdit = () => {
    if (isCustomerAddition) {
      setIsCustomerAddition(false);
      setDeviceData(null);
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

  const getDeviceData = async () => {
    if (!selectedCustomerDetail) return;

    try {
      const customerId = selectedCustomerDetail.userId;
      const response = await fetch(`/api/device?customer_id=${customerId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      setDeviceData(data.devices);
    } catch (err) {
      console.error("Error fetching devices:", err);
    }
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
                <div
                  key={customer.userId}
                  className={`group transition-colors cursor-pointer ${
                    selectedCustomerDetail?.userId === customer.userId
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedCustomerDetail(customer)}
                >
                  <div className="flex items-center justify-between p-2">
                    <div className="text-sm">{`${customer.firstName} ${customer.lastName}`}</div>
                    <RxExternalLink
                      className="w-4 h-4 text-gray-600 group-hover:text-gray-800 cursor-pointer"
                      onClick={() => handleCustomerClick(customer)}
                    />
                  </div>
                  <Separator className="my-0" />
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No customers found</div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CustomerInformationModal
          selectedCustomer={selectedCustomer}
          editableCustomer={editableCustomer}
          deviceData={deviceData}
          isEditable={isEditable}
          updateEditableCustomer={updateEditableCustomer}
          handleCustomerDelete={handleCustomerDelete}
          handleCancelEdit={handleCancelEdit}
          handleSaveClick={handleSaveClick}
          handleEditClick={handleEditClick}
        />
      </Dialog>
    </>
  );
}
