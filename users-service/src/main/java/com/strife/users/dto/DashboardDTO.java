package com.strife.users.dto;

import java.util.List;

import com.strife.users.model.FriendListFilter;

public record DashboardDTO(FriendStatusList friendStatusList, List<DashboardTab> dashboardTab) {

    public static DashboardDTO of(FriendStatusList friendStatusList) {
        List<DashboardTab> dashboardTabs = friendStatusList.keySet().stream()
                .map(key -> createDashboardTab(key, friendStatusList.get(key)))
                .toList();
        return new DashboardDTO(friendStatusList, dashboardTabs);
    }

    private static DashboardTab createDashboardTab(FriendListFilter filter, List<ProfileDTO> profiles) {
        String label = filter.getLabel();
        int number = profiles.size();
        return new DashboardTab(filter, label, number);
    }

}
