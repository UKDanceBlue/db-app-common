import { arrayToBase64String, base64StringToArray } from "../../util/base64.js";
import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";
export class ImageResource extends Resource {
  imageId!: string;

  url!: URL | null;

  imageData!: Uint8Array | null;

  mimeType!: string | null;

  thumbHash!: Uint8Array | null;

  alt!: string | null;

  width!: number;

  height!: number;

  constructor({
    imageId,
    url,
    imageData,
    mimeType,
    thumbHash,
    alt,
    width,
    height,
  }: ImageResourceInitializer) {
    super();
    this.imageId = imageId;
    this.url = url ?? null;
    this.imageData = imageData ?? null;
    this.mimeType = mimeType ?? null;
    this.thumbHash = thumbHash ?? null;
    this.alt = alt ?? null;
    this.width = width;
    this.height = height;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.imageId, errors);
    checkType("Class", this.url, errors, {
      classToCheck: URL,
      allowNull: true,
    });
    checkType("Class", this.imageData, errors, {
      classToCheck: Uint8Array,
      allowNull: true,
    });
    checkType("string", this.mimeType, errors, { allowNull: true });
    checkType("string", this.thumbHash, errors, { allowNull: true });
    checkType("string", this.alt, errors, { allowNull: true });
    checkType("number", this.width, errors);
    checkType("number", this.height, errors);
    return errors;
  }

  toPlain(): PlainImage {
    let imageData: string | null = null;

    if (this.imageData) {
      imageData = arrayToBase64String(this.imageData);
    }

    let thumbHash: string | null = null;

    if (this.thumbHash) {
      thumbHash = arrayToBase64String(this.thumbHash);
    }

    return {
      imageId: this.imageId,
      url: this.url?.toString() ?? null,
      imageData,
      mimeType: this.mimeType,
      thumbHash,
      alt: this.alt,
      width: this.width,
      height: this.height,
    };
  }

  static fromPlain(plain: PlainImage): ImageResource {
    let imageData: Uint8Array | null = null;

    if (plain.imageData) {
      imageData = base64StringToArray(plain.imageData);
    }

    let thumbHash: Uint8Array | null = null;

    if (plain.thumbHash) {
      thumbHash = base64StringToArray(plain.thumbHash);
    }

    return new ImageResource({
      imageId: plain.imageId,
      url: plain.url ? new URL(plain.url) : null,
      imageData,
      mimeType: plain.mimeType,
      thumbHash,
      alt: plain.alt,
      width: plain.width,
      height: plain.height,
    });
  }
}

export interface PlainImage
  extends PlainResourceObject<ImageResourceInitializer> {
  imageId: string;
  url: string | null;
  imageData: string | null;
  mimeType: string | null;
  thumbHash: string | null;
  alt: string | null;
  width: number;
  height: number;
}

export interface ImageResourceInitializer {
  imageId: ImageResource["imageId"];
  url?: ImageResource["url"];
  imageData?: ImageResource["imageData"];
  mimeType?: ImageResource["mimeType"];
  thumbHash?: ImageResource["thumbHash"];
  alt?: ImageResource["alt"];
  width: ImageResource["width"];
  height: ImageResource["height"];
}

ImageResource satisfies ResourceStatic<ImageResource, PlainImage>;
