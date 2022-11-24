import { FirestoreDocumentJson, IsValidJson, MaybeWithFirestoreMetadata, FromJson } from ".";

export interface SpiritPointEntryJson extends FirestoreDocumentJson {
  points: number;
  teamId: string;
  opportunityId: string;
  linkblue: string;
  displayName?: string;
}

export class SpiritPointEntry {
  points: number;
  teamId: string;
  opportunityId: string;
  linkblue: string;
  displayName?: string;

  constructor(points: number, teamId: string, opportunityId: string, linkblue: string, displayName?: string) {
    this.points = points;
    this.teamId = teamId;
    this.opportunityId = opportunityId;
    this.linkblue = linkblue;

    if (displayName != null) {
      this.displayName = displayName;
    }
  }

  static fromJson: FromJson<SpiritPointEntryJson, SpiritPointEntry> = (json: SpiritPointEntryJson): SpiritPointEntry => {
    const returnVal = new SpiritPointEntry(
      json.points,
      json.teamId,
      json.opportunityId,
      json.linkblue,
    );

    if (json.displayName != null) {
      returnVal.displayName = json.displayName;
    }

    return returnVal;
  }

  toJson(): SpiritPointEntryJson {
    const returnVal: SpiritPointEntryJson = {
      points: this.points,
      teamId: this.teamId,
      opportunityId: this.opportunityId,
      linkblue: this.linkblue,
    };

    if (this.displayName != null) {
      returnVal.displayName = this.displayName;
    }

    return returnVal;
  }

  static isValidJson: IsValidJson<MaybeWithFirestoreMetadata<SpiritPointEntryJson>> = (json: unknown): json is SpiritPointEntryJson => {
    if (json == null) {
      return false;
    }

    const { points, teamId, opportunityId, linkblue, displayName } = json as Partial<SpiritPointEntryJson>;

    if (points == null || typeof points !== "number") {
      return false;
    }

    if (teamId == null || typeof teamId !== "string") {
      return false;
    }

    if (opportunityId == null || typeof opportunityId !== "string") {
      return false;
    }

    if (linkblue == null || typeof linkblue !== "string") {
      return false;
    }

    if (displayName != null && typeof displayName !== "string") {
      return false;
    }

    return true;
  }
}