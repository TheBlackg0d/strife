import type { FriendFilter } from "~/api/friend/friend.types";
import type { Friend } from "~/api/friend/friend.types";

export type DashboardTab = FriendFilter | "ADD_FRIEND";

export type Filter = {
  filter: FriendFilter;
  label: string;
  count?: number;
};

export type FriendDataForDashboard = {
  friendStatusList: Record<FriendFilter, Friend[]>;
  dashboardTab: Filter[];
};
