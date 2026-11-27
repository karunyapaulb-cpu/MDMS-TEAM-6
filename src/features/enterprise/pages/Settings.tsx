import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import Input from "../../../shared/components/Input";
import Select from "../../../shared/components/Select";
import Toggle from "../../../shared/components/Toggle";
import Toast from "../../../shared/components/Toast";
import Skeleton from "../../../shared/components/Skeleton";

import useApi from "../../../shared/hooks/useApi";

import type { Setting } from "../../../shared/types/models";

import { getEnterpriseSettings } from "../services/enterpriseService";

function ConfigurationForm({ settings }: { settings: Setting }) {
  const [email, setEmail] = useState(settings.emailEnabled);
  const [sms, setSms] = useState(settings.smsEnabled);
  const [message, setMessage] = useState("");

  return (
    <form
      className="settings-panel form-stack"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("Configuration validated. No changes saved.");
      }}
    >
      <h3>Data retention</h3>

      <Input
        label="Data retention period (days)"
        type="number"
        min={1}
        defaultValue={settings.retentionDays}
        required
      />

      <h3>Policies and rules</h3>

      <Input
        label="Auto-logout timer (minutes)"
        type="number"
        min={1}
        defaultValue={settings.autoLogoutMinutes}
        required
      />

      <Input
        label="Audit log retention (days)"
        type="number"
        min={1}
        defaultValue={settings.auditRetentionDays}
        required
      />

      <h3>Localisation</h3>

      <Select
        label="Time zone"
        defaultValue={settings.timeZone}
        options={[
          { value: "Asia/Kolkata", label: "Asia/Kolkata" },
          { value: "UTC", label: "UTC" },
        ]}
      />

      <Select
        label="Default language"
        defaultValue={settings.language}
        options={[
          { value: "English", label: "English" },
          { value: "Kannada", label: "Kannada" },
          { value: "Hindi", label: "Hindi" },
        ]}
      />

      <Select
        label="Currency"
        defaultValue={settings.currency}
        options={[
          { value: "INR", label: "INR" },
          { value: "USD", label: "USD" },
        ]}
      />

      <h3>Notification defaults</h3>

      <Toggle label="Email notifications" checked={email} onChange={setEmail} />

      <Toggle label="SMS notifications" checked={sms} onChange={setSms} />

      <button>Save configuration</button>

      <Toast message={message} onClose={() => setMessage("")} />
    </form>
  );
}

export default function Settings() {
  const { data, loading, error } = useApi(
    useCallback(() => getEnterpriseSettings(), []),
  );

  if (loading) return <Skeleton />;
  if (error) return <p>{error}</p>;
  if (!data) return null;

  return (
    <>
      <PageHeader
        title="Settings & Configuration"
        subtitle="Organisation-wide policies and preferences"
      />

      <ConfigurationForm settings={data} />
    </>
  );
}
