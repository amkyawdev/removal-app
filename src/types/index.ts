export interface BackgroundRemovalResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface UploadResponse {
  url: string;
}

export interface ApiError {
  error: string;
}