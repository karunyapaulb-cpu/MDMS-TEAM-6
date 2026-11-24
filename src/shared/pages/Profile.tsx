import { useCallback, useState } from "react";

import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import Toggle from "../components/Toggle";
import Toast from "../components/Toast";
import Skeleton from "../components/Skeleton";

import useApi from "../hooks/useApi";

import {
  getUser,
  getUsers,
} from "../../services/mdmsService";

import {
  DEMO_USER_ID,
  DEMO_ZONE_ID,
} from "../../services/demoConfig";

export default function Profile() {
  const [tab, setTab] = useState("Profile");
  const [message, setMessage] = useState("");

  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const role = sessionStorage.getItem("mdms-role") || "user";

  const profile = useApi(
    useCallback(async () => {
      if (role === "user") {
        return getUser(DEMO_USER_ID);
      }

      const response = await getUsers(
        role === "zone"
          ? {
              role: "ZoneAdmin",
              zoneId: DEMO_ZONE_ID,
            }
          : { role: "Enterprise" }
      );

      return { data: response.data[0] };
    }, [role])
  );

  if (profile.loading) return <Skeleton />;
  if (profile.error) return <p>{profile.error}</p>;
  if (!profile.data) return <p>No profile found.</p>;

  return (
    <>
      <PageHeader title="Profile & Settings" />

      <Tabs
        tabs={["Profile", "Security", "Notifications"]}
        active={tab}
        onChange={setTab}
      />

      <section className="settings-panel">
        {tab === "Profile" && (
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Profile validated. No data saved.");
            }}
          >
            <Input
              label="Full name"
              defaultValue={profile.data.name}
              required
            />

            <Input
              label="Email"
              type="email"
              defaultValue={profile.data.email}
              required
            />

            <Input
              label="Phone"
              type="tel"
              defaultValue={profile.data.phone}
              pattern="[0-9]{10}"
            />

            <button>Save profile</button>
          </form>
        )}

        {tab === "Security" && (
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();

              if (
                password.length < 8 ||
                !/[A-Z]/.test(password) ||
                !/[0-9]/.test(password)
              ) {
                setError(
                  "Use at least 8 characters, uppercase and a number."
                );
              } else if (password !== confirm) {
                setError("Passwords do not match.");
              } else {
                setError("");
                setMessage("Password validated. Demo only.");
              }
            }}
          >
            <PasswordInput
              label="Current password"
              value={current}
              onChange={setCurrent}
            />

            <PasswordInput
              label="New password"
              value={password}
              onChange={setPassword}
            />

            <PasswordInput
              label="Confirm password"
              value={confirm}
              onChange={setConfirm}
              error={error}
            />

            <button>Update password</button>
          </form>
        )}

        {tab === "Notifications" && (
          <>
            <Toggle
              label="Email notifications"
              checked={emailEnabled}
              onChange={setEmailEnabled}
            />

            <Toggle
              label="SMS notifications"
              checked={smsEnabled}
              onChange={setSmsEnabled}
            />

            <button
              onClick={() =>
                setMessage("Preferences validated. Demo only.")
              }
            >
              Save preferences
            </button>
          </>
        )}
      </section>

      <Toast
        message={message}
        onClose={() => setMessage("")}
      />
    </>
  );
}