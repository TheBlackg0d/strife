package com.strife.users.dto;

import com.strife.users.model.FriendListFilter;

public record DashboardTab(FriendListFilter filter, String label, int count) {

}
