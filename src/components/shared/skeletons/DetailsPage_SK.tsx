import { Breadcrumb_SK, DetailHeader_SK, FieldsGrid_SK } from "./primitives";

export type DetailsPage_SKProps = {
  crumbCount?: number;
  actionCount?: number;
  fields?: number;
};

export function DetailsPage_SK({
  crumbCount = 4,
  actionCount = 3,
  fields = 4,
}: DetailsPage_SKProps) {
  return (
    <div className="page-stack">
      <Breadcrumb_SK count={crumbCount} />
      <section className="flex w-full flex-col gap-6">
        <DetailHeader_SK actionCount={actionCount} />
        <FieldsGrid_SK fields={fields} />
      </section>
    </div>
  );
}
