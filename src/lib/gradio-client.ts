/**
 * Gradio Client for Background Removal API
 * Uses @gradio/client library for reliable API calls
 * Space: https://huggingface.co/spaces/notlain/background-removal
 */

import { Client } from '@gradio/client';

const SPACE_ID = process.env.NEXT_PUBLIC_GRADIO_SPACE_ID || 'notlain/background-removal';

/**
 * Connect to Gradio Space and return client instance
 */
async function getClient(): Promise<Client> {
  return await Client.connect(SPACE_ID);
}

/**
 * Remove background from an image using Gradio Client
 * @param imageBase64 - Base64 encoded image (with or without data URI prefix)
 * @returns Base64 encoded result image (without prefix)
 */
export async function removeBackground(imageBase64: string): Promise<string> {
  try {
    // Clean up base64 string - remove data URI prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');
    
    // Convert base64 to Blob
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: 'image/png' });

    // Connect to Gradio Space
    const client = await getClient();

    // Make prediction
    const result = await client.predict('/predict', {
      image: imageBlob,
    });

    // Result contains the processed image
    // The result.data[0] can be a URL or base64 string
    if (result.data && result.data[0]) {
      const imageData = result.data[0];
      
      // If it's already a base64 string (without prefix), return it
      if (typeof imageData === 'string' && !imageData.startsWith('data:')) {
        return imageData;
      }
      
      // If it has data URI prefix, extract the base64 part
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        return imageData.replace(/^data:image\/[^;]+;base64,/, '');
      }
      
      // If it's a URL, we need to fetch and convert
      if (typeof imageData === 'string' && imageData.startsWith('http')) {
        const response = await fetch(imageData);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    }

    throw new Error('No image data returned from API');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove background: ${error.message}`);
    }
    throw new Error('Failed to remove background: Unknown error');
  }
}

/**
 * Remove background from an image URL
 * @param imageUrl - URL of the image to process
 * @returns Base64 encoded result image
 */
export async function removeBackgroundFromUrl(imageUrl: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Connect to Gradio Space
    const client = await getClient();

    // Make prediction with the blob
    const result = await client.predict('/predict', {
      image: blob,
    });

    // Process result
    if (result.data && result.data[0]) {
      const imageData = result.data[0];
      
      if (typeof imageData === 'string' && !imageData.startsWith('data:')) {
        return imageData;
      }
      
      if (typeof imageData === 'string' && imageData.startsWith('data:')) {
        return imageData.replace(/^data:image\/[^;]+;base64,/, '');
      }
    }

    throw new Error('No image data returned from API');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
    throw new Error('Failed to process image: Unknown error');
  }
}