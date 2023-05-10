export interface ImageResource {
  imageId: string;

  url: URL | null;

  imageData: Uint8Array | null;

  mimeType: string | null;

  thumbHash: string | null;

  alt: string | null;

  width: number;

  height: number;
}
