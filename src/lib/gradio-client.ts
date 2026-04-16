/**
 * Gradio Client for Background Removal API
 * API: https://huggingface.co/spaces/not-lain/background-removal
 */

const GRADIO_API_URL = 'https://huggingface.co/spaces/not-lain/background-removal';

export interface GradioResponse {
  data: string[]; // Base64 encoded image
  is_generating: boolean;
  average_duration: number;
}

export async function removeBackground(imageBase64: string): Promise<string> {
  try {
    // Gradio API expects base64 encoded image with data URI prefix
    const response = await fetch(`${GRADIO_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [`data:image/png;base64,${imageBase64}`],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result: GradioResponse = await response.json();
    
    if (result.data && result.data.length > 0) {
      // Return the base64 result (without the data URI prefix)
      return result.data[0].replace('data:image/png;base64,', '');
    }
    
    throw new Error('No image data returned from API');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove background: ${error.message}`);
    }
    throw new Error('Failed to remove background: Unknown error');
  }
}

export async function removeBackgroundFromUrl(imageUrl: string): Promise<string> {
  try {
    // First, fetch the image from URL and convert to base64
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const result = await removeBackground(base64);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
    throw new Error('Failed to process image: Unknown error');
  }
}