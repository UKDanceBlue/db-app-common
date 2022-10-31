export interface FirestoreTeamJson {
  name: string;
  teamClass?: "public" | "committee";
  members: string[];
  memberNames: Record<string, string | null>;
  memberAccounts: Record<string, string | null>;
  fundraisingTotal?: number;
  totalPoints?: number;
  networkForGoodId?: string;
  individualTotals?: Record<string, number>;
}

// A class like ./FirestoreUser.ts for FirestoreTeam
export class FirestoreTeam {
  name: string;
  teamClass?: "public" | "committee";
  members: string[];
  memberNames: Record<string, string | null>;
  memberAccounts: Record<string, string | null>;
  fundraisingTotal?: number;
  totalPoints?: number;
  networkForGoodId?: string;
  individualTotals?: Record<string, number>;

  constructor(
    name: FirestoreTeam["name"],
    members: FirestoreTeam["members"],
    memberNames: FirestoreTeam["memberNames"],
    memberAccounts: FirestoreTeam["memberAccounts"],
    teamClass?: FirestoreTeam["teamClass"],
    totalPoints?: FirestoreTeam["totalPoints"],
    individualTotals?: FirestoreTeam["individualTotals"],
    networkForGoodId?: FirestoreTeam["networkForGoodId"],
    fundraisingTotal?: FirestoreTeam["fundraisingTotal"],
  ) {
    this.name = name;
    this.members = members;
    this.memberNames = memberNames;
    this.memberAccounts = memberAccounts;

    if (teamClass != null) {
      this.teamClass = teamClass
    }
    if (totalPoints != null) {
      this.totalPoints = totalPoints;
    }
    if (individualTotals != null) {
      this.individualTotals = individualTotals;
    }
    if (networkForGoodId != null) {
      this.networkForGoodId = networkForGoodId;
    }
    if (fundraisingTotal != null) {
      this.fundraisingTotal = fundraisingTotal;
    }
  }

  static fromJson(json: FirestoreTeamJson): FirestoreTeam {
    const returnVal = new FirestoreTeam(
      json.name,
      json.members,
      json.memberNames,
      json.memberAccounts,
    );

    if (json.teamClass != null) {
      returnVal.teamClass = json.teamClass;
    }
    if (json.fundraisingTotal != null) {
      returnVal.fundraisingTotal = json.fundraisingTotal;
    }
    if (json.totalPoints != null) {
      returnVal.totalPoints = json.totalPoints;
    }
    if (json.networkForGoodId != null) {
      returnVal.networkForGoodId = json.networkForGoodId;
    }
    if (json.individualTotals != null) {
      returnVal.individualTotals = json.individualTotals;
    }

    return returnVal;
  }

  toJson(): FirestoreTeamJson {
    const returnVal: FirestoreTeamJson = {
      name: this.name,
      members: this.members,
      memberNames: this.memberNames,
      memberAccounts: this.memberAccounts,
    };

    if (this.teamClass != null) {
      returnVal.teamClass = this.teamClass;
    }
    if (this.fundraisingTotal != null) {
      returnVal.fundraisingTotal = this.fundraisingTotal;
    }
    if (this.totalPoints != null) {
      returnVal.totalPoints = this.totalPoints;
    }
    if (this.networkForGoodId != null) {
      returnVal.networkForGoodId = this.networkForGoodId;
    }
    if (this.individualTotals != null) {
      returnVal.individualTotals = this.individualTotals;
    }

    return returnVal;
  }


  isTeamJson(
    data: unknown
  ): data is FirestoreTeamJson {
    if (data == null) {
      return false;
    }

    if (typeof (data as Partial<FirestoreTeamJson>).name !== "string") {
      return false;
    }

    if ((data as Partial<FirestoreTeamJson>).teamClass != null && typeof (data as Partial<FirestoreTeamJson>).teamClass !== "string") {
      return false;
    }

    if (!Array.isArray((data as Partial<FirestoreTeamJson>).members) || (data as Partial<FirestoreTeamJson>).members?.some((m: unknown) => typeof m !== "string")) {
      return false;
    }

    if (typeof (data as Partial<FirestoreTeamJson>).memberAccounts !== "object" || (data as Partial<FirestoreTeamJson>).memberAccounts == null) {
      return false;
    }

    if (typeof (data as Partial<FirestoreTeamJson>).memberNames !== "object" || (data as Partial<FirestoreTeamJson>).memberNames == null) {
      return false;
    }

    if ((data as Partial<FirestoreTeamJson>).fundraisingTotal != null && typeof (data as Partial<FirestoreTeamJson>).fundraisingTotal !== "number") {
      return false;
    }

    if ((data as Partial<FirestoreTeamJson>).totalPoints != null && typeof (data as Partial<FirestoreTeamJson>).totalPoints !== "number") {
      return false;
    }

    if ((data as Partial<FirestoreTeamJson>).networkForGoodId != null && typeof (data as Partial<FirestoreTeamJson>).networkForGoodId !== "string") {
      return false;
    }

    if (typeof (data as Partial<FirestoreTeamJson>).individualTotals !== "object" || (data as Partial<FirestoreTeamJson>).individualTotals == null) {
      return false;
    }

    return true;
  }
}
