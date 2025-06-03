export const TABS = ["Dashboard", "Customers", "Settings"] as const;
export type TabName = (typeof TABS)[number];
