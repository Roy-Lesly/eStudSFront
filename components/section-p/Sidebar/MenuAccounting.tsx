import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaCog, FaUserShield, FaChartPie } from "react-icons/fa"; // Example icons

// Define types for the menu structure
type MenuItem = {
  icon: JSX.Element;
  label: string;
  route: string;
  children?: MenuItem[]; // Optional children for nested menus
};

type MenuSection = {
  name: string;
  menuItems: MenuItem[];
};

export const GetMenuAccounting = () => {
    const { t } = useTranslation();
    const { school_id, domain } = useParams();
    
  if (typeof window === "undefined") {
    return [];  // Return empty array or handle server-side logic here
  }
  
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode<{ page: string[] }>(token) : null;

  return [
    {
      name: "MENU",
      menuItems: [

        ...(user?.page.map((item: string) => item.toUpperCase()).includes("MANAGEMENT")
                  ? [
                    {
                      icon: <FaCog />,
                      label: `${t("Management")}`,
                      route: "#",
                      children: [
                        { label: `${t("Dashboard")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageDashboard`, icon: <FaCog /> },
                        { label: `${t("User Management")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageUserManagement`, icon: <FaCog /> },
                        { label: `${t("Audit Finance")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageFinancial`, icon: <FaCog /> },
                        { label: `${t("Audit Results")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageResultAudit`, icon: <FaCog /> },
                        { label: `${t("System Updates")}`, route: `/${domain}/Section-H/pageAdministration/${school_id}/pageManagement/pageSystemUpdates`, icon: <FaCog /> },
                      ],
                    },
                  ]
                  : []),

        {
          icon: <FaChartPie />,
          label: "Dashboard",
          route: `/${domain}/Section-H/pageAccounting/${school_id}/pageDashboard`,
        },

        {
          icon: <FaChartPie />,
          label: "System Counts",
          route: `/${domain}/Section-H/pageAccounting/${school_id}/AnalysisSystemCounts`,
        },

        {
          icon: <FaChartPie />,
          label: "Income Domain",
          route: `/${domain}/Section-H/pageAccounting/${school_id}/AnalysisSystemIncomeDomain`,
        },

        {
          icon: <FaChartPie />,
          label: "Income Specialty",
          route: `/${domain}/Section-H/pageAccounting/${school_id}/AnalysisSystemIncomeSpecialty`,
        },

      ],
    },

  ];
};
