import { BasicTimestamp } from "../shims/Firestore";

export interface FirestoreOpportunityInfoJson {
  name: string;
  date: BasicTimestamp;
  totalPoints: number;
}
