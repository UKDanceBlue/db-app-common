export enum AuthSource {
  UkyLinkblue = "uky-linkblue",
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
  TeamMember = "team-member",
  TeamCaptain = "team-captain",
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
  dbRole: DbRole;
  committeeRole?: CommitteeRole;
  committee?: string;
  accessLevel: AccessLevel;
  teamIds?: string[];
  captainOfTeamIds?: string[];
}
