package com.strife.guild.model;

public enum Permission {
    READ(1L << 0),
    WRITE(1L << 1),
    DELETE(1L << 2),
    ADMIN(1L << 3);

    private final long bitmask;

    Permission(long mask) {
        this.bitmask = mask;
    }

    public long getBitmask() {
        return bitmask;
    }

    public static boolean has(long currentPermissions, Permission permission) {
        return (currentPermissions & permission.getBitmask()) != 0;
    }

    public static long grant(long currentPermissions, Permission permission) {
        return currentPermissions | permission.getBitmask();
    }

    public static long revoke(long currentPermissions, Permission permission) {
        return currentPermissions & ~permission.getBitmask();
    }

    public static long clear() {
        return 0L;
    }

    public static long toggle(long currentPermissions, Permission permission) {
        return currentPermissions ^ permission.getBitmask();
    }
}
