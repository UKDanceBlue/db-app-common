export interface FirestoreImageJson {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;
}

export class FirestoreImage {
  uri: `gs://${string}` | `http${"s" | ""}://${string}`;
  width: number;
  height: number;

  constructor(uri: FirestoreImage["uri"], width: FirestoreImage["width"], height: FirestoreImage["height"]) {
    this.uri = uri;
    this.width = width;
    this.height = height;
  }

  static fromJson(json: FirestoreImageJson): FirestoreImage {
    return new FirestoreImage(json.uri, json.width, json.height);
  }

  toJson(): FirestoreImageJson {
    return {
      uri: this.uri,
      width: this.width,
      height: this.height,
    };
  }

  static isFirestoreImageJson(image?: unknown): image is FirestoreImage {
    if (image == null) {
      return false;
    }

    const {
      uri, width, height
    } = image as Partial<FirestoreImage>;
    if (uri == null) {
      return false;
    } else if (typeof uri !== "string") {
      return false;
    } else {
      const [protocol] = uri.split("://");

      if (protocol !== "gs" && protocol !== "http" && protocol !== "https") {
        return false;
      }
    }

    if (width == null) {
      return false;
    } else if (typeof width !== "number") {
      return false;
    } else if (width < 0) {
      return false;
    }

    if (height == null) {
      return false;
    } else if (typeof height !== "number") {
      return false;
    } else if (height < 0) {
      return false;
    }

    return true;
  }
}


export interface DownloadableImageJson {
  url?: string;
  width: number;
  height: number;
}

export class DownloadableImage {
  url?: string;
  width: number;
  height: number;

  constructor(url: DownloadableImage["url"], width: DownloadableImage["width"], height: DownloadableImage["height"]) {
    this.url = url;
    this.width = width;
    this.height = height;
  }

  static async fromFirestoreImage(firestoreImage: FirestoreImage, getDownloadUrl: (uri: string) => Promise<string>): Promise<DownloadableImage> {
    const url = await getDownloadUrl(firestoreImage.uri);
    return new DownloadableImage(url, firestoreImage.width, firestoreImage.height);
  };

  static fromJson(json: DownloadableImageJson): DownloadableImage {
    return new DownloadableImage(json.url, json.width, json.height);
  }

  toJson(): DownloadableImageJson {
    return {
      url: this.url,
      width: this.width,
      height: this.height,
    };
  }

  static isDownloadableImageJson(image?: unknown): image is DownloadableImage {
    if (image == null) {
      return false;
    }

    const {
      url, width, height
    } = image as Partial<DownloadableImage>;
    if (url != null && typeof url !== "string") {
      return false;
    }

    if (width == null) {
      return false;
    } else if (typeof width !== "number") {
      return false;
    } else if (width < 0) {
      return false;
    }

    if (height == null) {
      return false;
    } else if (typeof height !== "number") {
      return false;
    } else if (height < 0) {
      return false;
    }

    return true;
  }
}
