import { useContext } from "react";
import { BreadcrumbContext } from "./breadcrumbContext";

export function useBreadcrumbs() {
  return useContext(BreadcrumbContext);
}