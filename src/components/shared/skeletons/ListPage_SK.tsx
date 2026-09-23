import {
  Breadcrumb_SK,
  DataTable_SK,
  PageHeading_SK,
  Pagination_SK,
  Toolbar_SK,
} from "./primitives";

export type ListPage_SKProps = {
  crumbCount?: number;
  showDescription?: boolean;
  toolbarSlots?: number;
  columns?: number;
  rows?: number;
};

export function ListPage_SK({
  crumbCount = 3,
  showDescription = false,
  toolbarSlots = 4,
  columns = 5,
  rows = 10,
}: ListPage_SKProps) {
  return (
    <div className="page-stack">
      <Breadcrumb_SK count={crumbCount} />
      <section className="flex w-full flex-col gap-6">
        <PageHeading_SK showDescription={showDescription} />
        <Toolbar_SK slots={toolbarSlots} />
        <DataTable_SK columns={columns} rows={rows} />
        <Pagination_SK />
      </section>
    </div>
  );
}
