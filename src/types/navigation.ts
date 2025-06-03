export const TABS = ["Dashboard", "Customers", "Tickets"] as const;
export type TabName = (typeof TABS)[number];
