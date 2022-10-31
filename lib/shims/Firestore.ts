export interface FirestoreDocumentData {
  [key: string]: any;
}

export interface FirestoreDocumentReference<T extends FirestoreDocumentData = any> {
  id: unknown;
  path: unknown;
}