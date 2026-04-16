/**
 * Gradio Client for Background Removal API
 * API: https://huggingface.co/spaces/not-lain/background-removal
 * Uses queue-based API (two-step process)
 */

const GRADIO_API_URL = process.env.NEXT_PUBLIC_GRADIO_API_URL || 'https://huggingface.co/spaces/not-lain/background-removal';

interface QueueResponse {
  event_id?: string;
  data?: string[];
  error?: string;
}

export async function removeBackground(imageBase64: string): Promise<string> {
  // Clean up base64 string
  const cleanBase64 = imageBase64.replace(/^data:image\/[^;]+;base64,/, '');
  
  // Step 1: Submit the request to the queue
  const submitResponse = await fetch(`${GRADIO_API_URL}/gradio_api/queue/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [`data:image/png;base64,${cleanBase64}`],
    }),
  });

  if (!submitResponse.ok) {
    throw new Error(`Failed to submit job: ${submitResponse.status}`);
  }

  const queueData: QueueResponse = await submitResponse.json();
  const eventId = queueData.event_id;

  if (!eventId) {
    throw new Error('No event ID returned from queue');
  }

  // Step 2: Poll for results
  let attempts = 0;
  const maxAttempts = 30;
  
  while (attempts < maxAttempts) {
    const statusResponse = await fetch(
      `${GRADIO_API_URL}/gradio_api/queue/status?event_id=${eventId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error(`Failed to get job status: ${statusResponse.status}`);
    }

    const statusData: QueueResponse & { status?: string } = await statusResponse.json();
    
    if (statusData.status === 'complete' && statusData.data) {
      if (statusData.data.length > 0) {
        return statusData.data[0].replace('data:image/png;base64,', '');
      }
      throw new Error('No image data in result');
    }
    
    if (statusData.status === 'error') {
      throw new Error(statusData.error || 'Job failed');
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  throw new Error('Job timed out');
}

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