/**
 * Gradio Client for Background Removal API
 * Uses direct HTTP API calls to Gradio Space
 * Space: https://huggingface.co/spaces/notlain/background-removal
 */

const SPACE_URL = 'https://huggingface.co/spaces/notlain/background-removal';

/**
 * Submit job to Gradio queue
 */
async function submitJob(imageBase64: string): Promise<{ event_id: string }> {
  const response = await fetch(`${SPACE_URL}/gradio_api/queue/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [`data:image/png;base64,${imageBase64}`],
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to submit: ${response.status}`);
  }

  return response.json();
}

/**
 * Poll for job status
 */
async function getJobStatus(eventId: string): Promise<{ status: string; data?: string[]; error?: string }> {
  const response = await fetch(`${SPACE_URL}/gradio_api/queue/status?event_id=${eventId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get status: ${response.status}`);
  }

  return response.json();
}

/**
 * Remove background from an image
 * @param imageBase64 - Base64 encoded image (with or without data URI prefix)
 * @returns Base64 encoded result image (without prefix)
 */
export async function removeBackground(imageBase64: string): Promise<string> {
  try {
    // Clean up base64 string
    const cleanBase64 = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');
    
    // Submit job
    const { event_id } = await submitJob(cleanBase64);
    
    // Poll for result (max 30 attempts)
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const status = await getJobStatus(event_id);
      
      if (status.status === 'complete' && status.data?.[0]) {
        const result = status.data[0];
        return result.replace(/^data:image\/[^;]+;base64,/, '');
      }
      
      if (status.status === 'error') {
        throw new Error(status.error || 'Processing failed');
      }
    }
    
    throw new Error('Timeout - processing took too long');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to remove background: ${error.message}`);
    }
    throw new Error('Failed to remove background: Unknown error');
  }
}

/**
 * Remove background from image URL
 * @param imageUrl - URL of the image
 * @returns Base64 encoded result
 */
export async function removeBackgroundFromUrl(imageUrl: string): Promise<string> {
  try {
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
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process image: ${error.message}`);
    }
    throw new Error('Failed to process image: Unknown error');
  }
}