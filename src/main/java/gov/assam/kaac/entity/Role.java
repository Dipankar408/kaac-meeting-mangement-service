package gov.assam.kaac.entity;

/**
 * Role-Based Access Control (RBAC) definitions for Karbi Anglong Autonomous Council:
 * - ADMIN: Full master authority (CRUD on Departments, Users, Meeting Rooms, Meeting Schedules)
 * - STAFF: Handled meetings coordinator (CRUD on Meeting Schedules created by him, Conflict Checking)
 * - CHAIRPERSON: Presiding council member (CRUD on Meeting Schedules created by him, Approval of minutes)
 */
public enum Role {
    ADMIN,
    STAFF,
    CHAIRPERSON
}
