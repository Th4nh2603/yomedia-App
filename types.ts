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
export interface FileData {
  name: string;
  type: "folder" | "file";
  size?: number;
  lastModified: string;
  permissions: string;
  owner: string;
  group: string;
}
export type IconName =
  | "dashboard"
  | "manageDemo"
  | "buildDemo"
  | "uploadDemo"
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
  | "folder"
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
  | "copy"
  | "image"
  | "paperPlane"
  | "reset"
  | "link"
  | "file"
  | "externalLink"
  | "logout";

export interface NavItem {
  label: string;
  icon: IconName;
  section: "MAIN" | "DATA" | "PAGES" | "DESIGN" | "CHARTS";
}
