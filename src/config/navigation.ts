import {
  LayoutDashboard,
  Settings,
  BarChart,
  type LucideIcon,
  PencilRuler,
  Filter,
  Table,
} from "lucide-react";

/** Message key under the `Nav` namespace (e.g. `dashboard` → `Nav.dashboard`). */
export type NavTitleKey =
  | "dashboard"
  | "forms"
  | "formsRichText"
  | "formsImageUploader"
  | "formsFileUploader"
  | "formsDateInput"
  | "filters"
  | "filtersPagination"
  | "filtersSelect"
  | "filtersMultiSelect"
  | "filtersTabs"
  | "filtersDate"
  | "filtersSearch"
  | "filtersLimit"
  | "filtersReset"
  | "charts"
  | "chartsAnalytics"
  | "table"
  | "settings"
  | "settingsDarkTheme";

export type NavSubItem = {
  titleKey: NavTitleKey;
  url: string;
};

export type NavItem = {
  /** Stable module id used for lookups (never translate this). */
  id: string;
  titleKey: NavTitleKey;
  url: string;
  icon: LucideIcon;
  items?: NavSubItem[];
};

export type NavGroup = {
  labelKey?: string;
  items: NavItem[];
};

export const navigation: NavGroup[] = [
  {
    items: [
      {
        id: "dashboard",
        titleKey: "dashboard",
        url: "/",
        icon: LayoutDashboard,
      },
      {
        id: "forms",
        titleKey: "forms",
        url: "/forms",
        icon: PencilRuler,
        items: [
          { titleKey: "formsRichText", url: "/forms/rich-text" },
          { titleKey: "formsImageUploader", url: "/forms/image-uploader" },
          { titleKey: "formsFileUploader", url: "/forms/file-uploader" },
          { titleKey: "formsDateInput", url: "/forms/date-input" },
        ],
      },
      {
        id: "filters",
        titleKey: "filters",
        url: "/filters",
        icon: Filter,
        items: [
          { titleKey: "filtersPagination", url: "/filters/pagination" },
          { titleKey: "filtersSelect", url: "/filters/select" },
          { titleKey: "filtersMultiSelect", url: "/filters/multiple-select" },
          { titleKey: "filtersTabs", url: "/filters/tabs" },
          { titleKey: "filtersDate", url: "/filters/date" },
          { titleKey: "filtersSearch", url: "/filters/search" },
          { titleKey: "filtersLimit", url: "/filters/limit" },
          { titleKey: "filtersReset", url: "/filters/reset" },
        ],
      },
      {
        id: "charts",
        titleKey: "charts",
        url: "/charts",
        icon: BarChart,
        items: [{ titleKey: "chartsAnalytics", url: "/charts/analytics" }],
      },
      {
        id: "table",
        titleKey: "table",
        url: "/table",
        icon: Table,
      },
      {
        id: "settings",
        titleKey: "settings",
        url: "/settings",
        icon: Settings,
        items: [
          { titleKey: "settingsDarkTheme", url: "/settings/dark-theme" },
        ],
      },
    ],
  },
];

/** Demo user — display name/email come from messages (`User` namespace). */
export const user = {
  avatar: "",
};
