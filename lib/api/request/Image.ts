// Since these are uploaded using multipart/form-data, the actual image data is not included in the request body (including width and height).

export interface CreateImageBody {
  name: string;
  altText?: string;
}
