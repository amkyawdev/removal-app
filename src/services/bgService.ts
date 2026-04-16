import { removeBackground, removeBackgroundFromUrl } from '@/lib/gradio-client';
import { BackgroundRemovalResult } from '@/types';

/**
 * Background Removal Service
 * Handles business logic for background removal
 */
export class BackgroundRemovalService {
  /**
   * Remove background from a base64 encoded image
   */
  static async removeFromBase64(imageBase64: string): Promise<BackgroundRemovalResult> {
    try {
      const result = await removeBackground(imageBase64);
      return {
        success: true,
        imageUrl: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Remove background from an image URL
   */
  static async removeFromUrl(imageUrl: string): Promise<BackgroundRemovalResult> {
    try {
      const result = await removeBackgroundFromUrl(imageUrl);
      return {
        success: true,
        imageUrl: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Process uploaded file and remove background
   */
  static async processFile(file: File): Promise<BackgroundRemovalResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const result = await this.removeFromBase64(base64);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to process file',
          });
        }
      };
      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file',
        });
      };
      reader.readAsDataURL(file);
    });
  }
}