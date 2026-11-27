import PageHeader from "../../../shared/components/PageHeader";
import AlertTable from "../../../shared/components/AlertTable";

import { DEMO_ZONE_ID } from "../../../services/demoConfig";

export default function Alerts() {
  return (
    <>
      <PageHeader
        title="Zone alerts"
        subtitle="Monitor meter alerts in your zone"
      />

      <AlertTable zoneId={DEMO_ZONE_ID} />
    </>
  );
}
