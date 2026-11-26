import { useCallback, useState } from "react";

import PageHeader from "../../../shared/components/PageHeader";
import Tabs from "../../../shared/components/Tabs";
import EmptyState from "../../../shared/components/EmptyState";
import Skeleton from "../../../shared/components/Skeleton";
import StatusBadge from "../../../shared/components/StatusBadge";

import useApi from "../../../shared/hooks/useApi";
import { getNotifications } from "../services/userService";

export default function Alerts() {
  const [tab, setTab] = useState("All");

  const { data, loading, error } = useApi(
    useCallback(() => getNotifications(tab === "Unread"), [tab]),
  );

  return (
    <>
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Stay updated with your electricity account"
      />

      <Tabs tabs={["All", "Unread"]} active={tab} onChange={setTab} />

      <br />

      {loading ? (
        <Skeleton />
      ) : error ? (
        <p>{error}</p>
      ) : !data?.length ? (
        <EmptyState message="No notifications available" />
      ) : (
        data.map((notification) => (
          <article
            key={notification.id}
            className={`notification ${notification.isRead ? "" : "unread"}`}
          >
            <div className="page-header">
              <strong>{notification.type}</strong>

              {!notification.isRead && <StatusBadge status="Unread" />}
            </div>

            <p>{notification.message}</p>

            <small>
              {new Date(notification.timestamp).toLocaleString("en-IN")}
            </small>
          </article>
        ))
      )}
    </>
  );
}
