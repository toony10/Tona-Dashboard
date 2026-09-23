import { Breadcrumb_SK, NavCards_SK } from "./primitives";

export type HubPage_SKProps = {
  crumbCount?: number;
  cardCount?: number;
};

export function HubPage_SK({
  crumbCount = 2,
  cardCount = 3,
}: HubPage_SKProps) {
  return (
    <div className="page-stack">
      <Breadcrumb_SK count={crumbCount} />
      <NavCards_SK count={cardCount} />
    </div>
  );
}
