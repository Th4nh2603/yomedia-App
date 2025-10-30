export interface DemoData {
  id: number;
  year: number;
  month: number;
  brand: string;
  host: string;
  view: string;
  format: string;
  flight: string | null;
}

export type IconName =
  | "dashboard"
  | "manageDemo"
  | "buildDemo"
  | "manageTeam"
  | "contacts"
  | "invoices"
  | "products"
  | "profile"
  | "task"
  | "calendar"
  | "faq"
  | "compress"
  | "barChart"
  | "menu"
  | "search"
  | "moon"
  | "bell"
  | "settings"
  | "userCircle"
  | "eye"
  | "download"
  | "print"
  | "filter"
  | "layoutGrid"
  | "chevronLeft"
  | "chevronRight"
  | "user"
  | "logout";

export interface NavItem {
  label: string;
  icon: IconName;
  section: "MAIN" | "DATA" | "PAGES" | "DESIGN" | "CHARTS";
}
