import { FirestoreDocumentJson } from "./internal.js";

export interface SpiritTeamsRootDocJson extends FirestoreDocumentJson {
  basicInfo: {
    [teamId: string]: {
      name: string;
      teamClass?: "public" | "committee";
      totalPoints?: number;
    };
  };
}

export class SpiritTeamsRootDoc {
  basicInfo: Record<string, {
    name: string;
    teamClass?: "public" | "committee";
    totalPoints?: number;
  }>;

  constructor(basicInfo: SpiritTeamsRootDoc["basicInfo"]) {
    this.basicInfo = basicInfo;
  }

  static fromJson(json: SpiritTeamsRootDocJson): SpiritTeamsRootDoc {
    return new SpiritTeamsRootDoc(json.basicInfo);
  }

  toJson(): SpiritTeamsRootDocJson {
    const returnVal: SpiritTeamsRootDocJson = {
      basicInfo: this.basicInfo,
    };

    return returnVal;
  }

  static isSpiritTeamsRootDocJson(spiritTeamsRootDoc?: unknown): spiritTeamsRootDoc is SpiritTeamsRootDocJson {
    if (spiritTeamsRootDoc == null) {
      return false;
    }

    const {
      basicInfo,
    } = spiritTeamsRootDoc as Partial<SpiritTeamsRootDocJson>;
    if (basicInfo == null || typeof basicInfo !== "object") {
      return false;
    }

    for (const teamId in basicInfo) {
      if (typeof teamId !== "string") {
        return false;
      }

      const {
        name, teamClass, totalPoints,
      } = basicInfo[teamId];
      if (typeof name !== "string") {
        return false;
      }
      if (teamClass != null && teamClass !== "public" && teamClass !== "committee") {
        return false;
      }
      if (totalPoints != null && typeof totalPoints !== "number") {
        return false;
      }
    }

    return true;
  }
}