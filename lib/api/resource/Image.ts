export interface ImageResource {
  imageId: string;

  url: string | null;

  imageData: Uint8Array | null;

  mimeType: string | null;

  thumbHash: string | null;

  alt: string | null;

  width: number;

  height: number;
}
