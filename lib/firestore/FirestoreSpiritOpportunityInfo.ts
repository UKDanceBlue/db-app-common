import { BasicTimestamp, isTimestampLike } from "../shims/Firestore.js";
import { FirestoreDocumentJson, IsValidJson, MaybeWithFirestoreMetadata, FromJson } from "./internal.js";

export interface FirestoreSpiritOpportunityInfoJson extends FirestoreDocumentJson {
  name: string;
  date: BasicTimestamp;
  totalPoints: number;
}

export class FirestoreSpiritOpportunityInfo {
  name: string;
  date: BasicTimestamp;
  totalPoints: number;

  constructor(name: string, date: BasicTimestamp, totalPoints: number) {
    this.name = name;
    this.date = date;
    this.totalPoints = totalPoints;
  }

  static fromJson: FromJson<FirestoreSpiritOpportunityInfoJson, FirestoreSpiritOpportunityInfo> = (json: FirestoreSpiritOpportunityInfoJson): FirestoreSpiritOpportunityInfo => {
    return new FirestoreSpiritOpportunityInfo(
      json.name,
      json.date,
      json.totalPoints,
    );
  }

  toJson(): FirestoreSpiritOpportunityInfoJson {
    return {
      name: this.name,
      date: this.date,
      totalPoints: this.totalPoints,
    };
  }

  static isValidJson: IsValidJson<MaybeWithFirestoreMetadata<FirestoreSpiritOpportunityInfoJson>> = (json: unknown): json is FirestoreSpiritOpportunityInfoJson => {
    if (json == null) {
      return false;
    }

    const { name, date, totalPoints } = json as Partial<FirestoreSpiritOpportunityInfoJson>;

    if (name == null || typeof name !== "string") {
      return false;
    }

    if (date == null || !isTimestampLike(date)) {
      return false;
    }

    if (totalPoints == null || typeof totalPoints !== "number") {
      return false;
    }

    return true;
  }
}
