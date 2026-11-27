import PageHeader from "../../../shared/components/PageHeader";
import AlertTable from "../../../shared/components/AlertTable";

export default function Alerts() {
  return (
    <>
      <PageHeader
        title="Enterprise alerts"
        subtitle="Monitor alerts across all zones"
      />

      <AlertTable enterprise />
    </>
  );
}
