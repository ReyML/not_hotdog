import { API_BASE_URL } from '@/config/env';

export interface AnalyzeImageResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  [key: string]: unknown;
}

export async function analyzeImage(imageDataUrl: string): Promise<AnalyzeImageResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ image: imageDataUrl }),
    });

    if (!response.ok) {
      let message =
        response.status === 413
          ? 'That image is too large. Please try a smaller photo.'
          : `Request failed with status ${response.status}`;

      try {
        const errorBody = await response.json();
        if (typeof errorBody?.error === 'string') {
          message = errorBody.error;
        }
      } catch {
        // Ignore JSON parse issues and fallback to default message.
      }

      const error = new Error(message) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return (await response.json()) as AnalyzeImageResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Network request failed. Please try again.');
  }
}
