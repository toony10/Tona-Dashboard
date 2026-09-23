"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

import { AppLink } from "./AppLink";

export type BreadCrumbItem = {
  label: string;
  href?: string;
};

export type BreadCrumbProps = {
  items: BreadCrumbItem[];
  className?: string;
};

export function BreadCrumb({ items, className }: BreadCrumbProps) {
  const t = useTranslations("Common");

  return (
    <Breadcrumb aria-label={t("breadcrumb")} className={cn(className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const href = item.href;
          const isLast = index === items.length - 1;
          const showAsPage = isLast || !href;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {showAsPage ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <AppLink href={href}>{item.label}</AppLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
