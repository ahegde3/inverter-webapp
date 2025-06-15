"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  Search,
  User,
  Mail,
  MapPin,
  Edit,
  Trash2,
} from "lucide-react";
import type { CustomerData, CustomerApiResponse } from "@/types/customer";
import { Dialog } from "@/components/ui/dialog";
import CustomerInformationModal from "./CustomerInformationModal";
import type { Device } from "@/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomerTable() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<string | undefined>(undefined);
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(
    null
  );
  const [editableCustomer, setEditableCustomer] = useState<CustomerData | null>(
    null
  );
  const [deviceData, setDeviceData] = useState<Device[] | null>(null);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/customer", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: CustomerApiResponse = await response.json();

      if (result.success && "data" in result) {
        setCustomers(result.data || []);
      } else {
        throw new Error(
          "error" in result ? result.error : "Failed to fetch customers"
        );
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch customers"
      );
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Get unique cities and states for filters
  const uniqueCities = Array.from(new Set(customers.map((c) => c.city))).sort();
  const uniqueStates = Array.from(
    new Set(customers.map((c) => c.state))
  ).sort();

  // Filter customers based on search query, city and state filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.emailId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      cityFilter === undefined ||
      cityFilter === "all_cities" ||
      customer.city === cityFilter;
    const matchesState =
      stateFilter === undefined ||
      stateFilter === "all_states" ||
      customer.state === stateFilter;

    return matchesSearch && matchesCity && matchesState;
  });

  const handleEditButtonClick = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setEditableCustomer(customer);
    setIsModalOpen(true);
    getDeviceData(customer.userId);
  };

  const handleSaveClick = async () => {
    if (!editableCustomer) return;

    try {
      const response = await fetch(
        `/api/customer?customer_id=${editableCustomer.userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editableCustomer),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update customer");
      }

      // Update the customers list with the edited customer
      setCustomers(
        customers.map((c) =>
          c.userId === editableCustomer.userId ? editableCustomer : c
        )
      );
      setSelectedCustomer(editableCustomer);
      setIsModalOpen(false); // Close modal after successful save
      await fetchCustomers(); // Refresh the list
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update customer"
      );
    }
  };

  const deleteCustomer = async (customerId: string): Promise<void> => {
    if (!customerId) return;

    try {
      const response = await fetch(`/api/customer?customer_id=${customerId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: CustomerApiResponse = await response.json();

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      if ("success" in data && data.success) {
        // Refetch customers to update the list
        await fetchCustomers();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Error deleting customer:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditableCustomer(selectedCustomer);
    setIsModalOpen(false);
  };

  const updateEditableCustomer = (field: keyof CustomerData, value: string) => {
    if (editableCustomer) {
      setEditableCustomer({
        ...editableCustomer,
        [field]: value,
      });
    }
  };

  const handleCustomerDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/customer/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers(customers.filter((c) => c.userId !== userId));
      setIsModalOpen(false);
      await fetchCustomers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting customer:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete customer"
      );
    }
  };

  const getDeviceData = async (customerId: string) => {
    try {
      const response = await fetch(`/api/device?customer_id=${customerId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      setDeviceData(data.devices);
    } catch (err) {
      console.error("Error fetching devices:", err);
      setDeviceData(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCityFilter(undefined);
    setStateFilter(undefined);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Customers</h1>
            {isLoading && (
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-muted-foreground">
            Manage and view customer information
            {!isLoading && !error && (
              <span className="ml-2 text-sm">
                ({filteredCustomers.length} customers)
              </span>
            )}
          </p>
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
              <span>⚠️ {error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCustomers}
                className="h-7 px-3 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchCustomers}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <div className="w-40">
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_cities">All Cities</SelectItem>
                {uniqueCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_states">All States</SelectItem>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(searchQuery || cityFilter || stateFilter) && (
            <Button variant="ghost" onClick={clearFilters} className="h-10">
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">⚠️ Failed to load customers</p>
            <Button onClick={fetchCustomers} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        /* Customer Table */
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Customer
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      City
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      State
                    </th>
                    {/* <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Created
                    </th> */}
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr
                      key={customer.userId}
                      className="border-b hover:bg-muted/25 transition-colors"
                    >
                      <td className="h-16 px-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ID: {customer.userId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="h-16 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{customer.emailId}</span>
                        </div>
                      </td>
                      <td className="h-16 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm max-w-xs truncate">
                            {customer.city}
                          </span>
                        </div>
                      </td>
                      <td className="h-16 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm max-w-xs truncate">
                            {customer.state}
                          </span>
                        </div>
                      </td>
                      {/* <td className="h-16 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(customer.createdAt)}
                          </span>
                        </div>
                      </td> */}
                      <td className="h-16 px-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditButtonClick(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive"
                            onClick={() => deleteCustomer(customer.userId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCustomers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No customers found</p>
                  <p className="text-sm mt-1">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredCustomers.map((customer) => (
              <Card
                key={customer.userId}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      {customer.firstName} {customer.lastName}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditButtonClick(customer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => deleteCustomer(customer.userId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.emailId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {customer.city}, {customer.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.address}</span>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs">
                      ID: {customer.userId}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No customers found</p>
                <p className="text-sm mt-1">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <CustomerInformationModal
          selectedCustomer={selectedCustomer}
          editableCustomer={editableCustomer}
          deviceData={deviceData}
          isEditable={true}
          updateEditableCustomer={updateEditableCustomer}
          handleCustomerDelete={handleCustomerDelete}
          handleCancelEdit={handleCancelEdit}
          handleSaveClick={handleSaveClick}
          handleEditClick={() => {}}
        />
      </Dialog>
    </div>
  );
}
