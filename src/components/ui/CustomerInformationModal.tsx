import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomerData } from "@/types/customer";
import type { Device } from "@/lib/schema";

// Utility function to convert date formats
function convertDateFormat(date: string, toHTML: boolean = false): string {
  if (!date) return "";

  try {
    if (toHTML) {
      // Convert from MM/DD/YYYY to YYYY-MM-DD
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } else {
      // Convert from YYYY-MM-DD to MM/DD/YYYY
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    }
  } catch {
    return date; // Return original value if conversion fails
  }
}

interface CustomerInformationModalProps {
  selectedCustomer: CustomerData | null;
  editableCustomer: CustomerData | null;
  deviceData: Device[] | null;
  isEditable?: boolean;
  updateEditableCustomer: (field: keyof CustomerData, value: string) => void;
  handleCustomerDelete: (userId: string) => void;
  handleCancelEdit: () => void;
  handleSaveClick: () => void;
  handleEditClick: () => void;
}

export default function CustomerInformationModal({
  selectedCustomer,
  editableCustomer,
  deviceData,
  isEditable = true,
  updateEditableCustomer,
  handleCustomerDelete,
  handleCancelEdit,
  handleSaveClick,
  handleEditClick,
}: CustomerInformationModalProps) {
  return (
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
            <label htmlFor="emailId" className="text-right text-sm font-medium">
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
            <label htmlFor="phoneNo" className="text-right text-sm font-medium">
              Phone No
            </label>
            <input
              id="phoneNo"
              type="phoneNo"
              value={editableCustomer.phoneNo}
              readOnly={!isEditable}
              onChange={(e) =>
                updateEditableCustomer("phoneNo", e.target.value)
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
              htmlFor="dateOfBirth"
              className="text-right text-sm font-medium"
            >
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={convertDateFormat(editableCustomer.dateOfBirth, true)}
              readOnly={!isEditable}
              onChange={(e) =>
                updateEditableCustomer(
                  "dateOfBirth",
                  convertDateFormat(e.target.value)
                )
              }
              className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm ${
                isEditable
                  ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "bg-gray-50"
              }`}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="address" className="text-right text-sm font-medium">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="state" className="text-right text-sm font-medium">
              State
            </label>
            <textarea
              id="state"
              value={editableCustomer.state}
              readOnly={!isEditable}
              onChange={(e) => updateEditableCustomer("state", e.target.value)}
              className={`col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm ${
                isEditable
                  ? "bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "bg-gray-50"
              }`}
            />
          </div>
          {deviceData && (
            <div className="flex flex-col gap-8 mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Device Information</h3>
              </div>
              {deviceData.map((device, index) => (
                <div
                  key={device.deviceId}
                  className="flex flex-col gap-4 p-4 border rounded-lg"
                >
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label
                      htmlFor={`serialNo-${index}`}
                      className="text-right text-sm font-medium"
                    >
                      Serial No
                    </label>
                    <input
                      id={`serialNo-${index}`}
                      type="text"
                      value={device.serialNo}
                      readOnly
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label
                      htmlFor={`manufacturingDate-${index}`}
                      className="text-right text-sm font-medium -ml-2"
                    >
                      Manufacturing Date
                    </label>
                    <input
                      id={`manufacturingDate-${index}`}
                      type="text"
                      value={device.manufacturingDate}
                      readOnly
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label
                      htmlFor={`warrantyEndDate-${index}`}
                      className="text-right text-sm font-medium"
                    >
                      Warranty End Date
                    </label>
                    <input
                      id={`warrantyEndDate-${index}`}
                      type="text"
                      value={device.warrantyEndDate}
                      readOnly
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label
                      htmlFor={`deviceType-${index}`}
                      className="text-right text-sm font-medium"
                    >
                      Device Type
                    </label>
                    <input
                      id={`deviceType-${index}`}
                      type="text"
                      value={device.deviceType}
                      readOnly
                      className="col-span-3 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            {isEditable ? (
              <>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="default"
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={handleEditClick}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleCustomerDelete(selectedCustomer.userId)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </DialogContent>
  );
}
