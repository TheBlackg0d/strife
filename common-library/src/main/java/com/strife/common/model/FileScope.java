package com.strife.common.model;

public enum FileScope {
    GUILD("guild"),
    PRIVATE_GROUP_CHANNEL("privateGroupChannel"),
    CHANNEL("channel"),
    USER_AVATAR("userAvatar"),
    USER_BANNER("userBanner");

    private String scope;

    private FileScope(String scope) {
        this.scope = scope;
    }

    public String getScope() {
        return scope;
    }
}
