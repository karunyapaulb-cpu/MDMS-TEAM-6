import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import Input from "../../../shared/components/Input";
import Toggle from "../../../shared/components/Toggle";
import Toast from "../../../shared/components/Toast";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import type { Setting } from "../../../shared/types/models";

import { getZoneSettings } from "../services/zoneService";

function SettingsForm({ settings }: { settings: Setting }) {
  const [email, setEmail] = useState(settings.emailEnabled);
  const [sms, setSms] = useState(settings.smsEnabled);
  const [message, setMessage] = useState("");

  const [high, setHigh] = useState(settings.highConsumption);
  const [low, setLow] = useState(settings.lowConsumption);
  const [error, setError] = useState("");

  return (
    <form
      className="settings-panel form-stack"
      onSubmit={(e) => {
        e.preventDefault();

        if (low >= high) {
          setError("Low consumption must be below high consumption.");
          return;
        }

        setError("");
        setMessage("Settings validated. No data saved.");
      }}
    >
      <h3>Alert thresholds</h3>

      <Input
        label="High consumption (kWh)"
        type="number"
        min={1}
        value={high}
        onChange={(e) => setHigh(Number(e.target.value))}
        required
      />

      <Input
        label="Low consumption (kWh)"
        type="number"
        min={0}
        value={low}
        onChange={(e) => setLow(Number(e.target.value))}
        error={error}
        required
      />

      <Input
        label="Abnormal reading frequency"
        type="number"
        min={1}
        defaultValue={settings.abnormalFrequency}
        required
      />

      <Input
        label="Inactive meter duration (hours)"
        type="number"
        min={1}
        defaultValue={settings.inactiveDuration}
        required
      />

      <h3>Notification channels</h3>

      <Toggle label="Email alerts" checked={email} onChange={setEmail} />

      <Toggle label="SMS alerts" checked={sms} onChange={setSms} />

      <button>Save settings</button>

      <Toast message={message} onClose={() => setMessage("")} />
    </form>
  );
}

export default function Settings() {
  const { data, loading, error } = useApi(
    useCallback(() => getZoneSettings(), []),
  );

  if (loading) return <Skeleton />;
  if (error) return <p>{error}</p>;
  if (!data) return null;

  return (
    <>
      <PageHeader
        title="Zone settings"
        subtitle="Configure zone thresholds and notifications"
      />

      <SettingsForm settings={data} />
    </>
  );
}
