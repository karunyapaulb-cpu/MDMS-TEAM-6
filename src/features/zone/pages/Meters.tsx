import { useSearchParams } from "react-router-dom";

import PageHeader from "../../../shared/components/PageHeader";
import MeterTable from "../../../shared/components/MeterTable";

import { DEMO_ZONE_ID } from "../../../services/demoConfig";

export default function Meters() {
  const [params] = useSearchParams();

  return (
    <>
      <PageHeader
        title="Meter management"
        subtitle="Manage meters belonging to your zone"
      />

      <MeterTable
        zoneId={DEMO_ZONE_ID}
        allowAdd
        initialAdd={params.get("add") === "true"}
      />
    </>
  );
}
