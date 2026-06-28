package com.hms.auth.entity;

/**
 * All roles in the HMS RBAC system.
 *
 * Self-registration (public) is restricted to ROLE_PATIENT only.
 * All other roles must be assigned by an admin via the admin API.
 */
public enum Role {
    ROLE_SUPERADMIN,
    ROLE_ADMIN,
    ROLE_DOCTOR,
    ROLE_NURSE,
    ROLE_PATIENT,
    ROLE_VENDOR,
    ROLE_STAFF
}
