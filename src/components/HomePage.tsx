"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  return (
    <div className="p-5 flex ">
      <ScrollAreaDemo />
    </div>
  );
};

// const tags = Array.from({ length: 50 }).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`
// );

interface CustomerData {
  name: string;
}

const customerDataList: CustomerData[] = [
  { name: "User1" },
  { name: "User2" },
  { name: "User3" },
  { name: "User4" },
  { name: "User5" },
  { name: "User6" },
  { name: "User8" },
];

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {customerDataList.map((customer: CustomerData, idx) => (
          <>
            <div key={idx} className="text-sm">
              {customer.name}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}

export default HomePage;
