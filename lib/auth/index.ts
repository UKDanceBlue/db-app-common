export enum AuthSource {
  UkyLinkblue = "uky_linkblue",
  Anonymous = "anonymous",
}

export enum AccessLevel {
  None = -1,
  Public = 0,
  TeamMember = 1,
  TeamCaptain = 2,
  Committee = 3,
  CommitteeChairOrCoordinator = 3.5,
  Admin = 4, // Tech committee
}

export enum DbRole {
  None = "none",
  Public = "public",
  TeamMember = "team_member",
  TeamCaptain = "team_captain",
  Committee = "committee",
}

export enum CommitteeRole {
  Chair = "chair",
  Coordinator = "coordinator",
  Member = "member",
}

export interface Authorization {
  dbRole: DbRole;
  committeeRole?: CommitteeRole;
  committee?: string;
  accessLevel: AccessLevel;
}

export interface UserData {
  auth: Authorization;
  userId?: string;
  teamIds?: string[];
  captainOfTeamIds?: string[];
}

export interface JwtPayload {
  sub: string;
  // The type of authentication used to log in (e.g. "uky-linkblue" or "anonymous")
  auth_source: AuthSource;
  // TODO: Replace these fields with either "roles" or "groups" (these are specified in the RFC 7643 Section 4.1.2)
  dbRole: DbRole;
  committee_role?: CommitteeRole;
  committee?: string;
  access_level: AccessLevel;
  team_ids?: string[];
  captain_of_team_ids?: string[];
}
