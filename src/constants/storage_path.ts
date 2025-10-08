// storage-path.ts

class StoragePaths {
  private baseAssetUrl: string;

  constructor(baseUrl: string) {
    this.baseAssetUrl = baseUrl;
  }

  // Getter for base URL
  get value(): string {
    return this.baseAssetUrl;
  }

  // Method to get path for any asset file by name
  getAssetPath(fileName: string): string {
    return `${this.baseAssetUrl}/${fileName}`;
  }
}

// Usage example
const storage = new StoragePaths(
  "https://aszjaykbxvdluazbscoa.supabase.co/storage/v1/object/public/asset"
);

export default storage;
