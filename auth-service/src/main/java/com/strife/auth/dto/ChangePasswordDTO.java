package com.strife.auth.dto;

public record ChangePasswordDTO(String currentPassword, String newPassword, String confirmPassword) {

}
