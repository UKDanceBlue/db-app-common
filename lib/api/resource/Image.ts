import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import { Resource } from "./Resource.js";
export class ImageResource extends Resource {
  imageId!: string;

  url!: URL | null;

  imageData!: Uint8Array | null;

  mimeType!: string | null;

  thumbHash!: string | null;

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
