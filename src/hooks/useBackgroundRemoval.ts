'use client';

import { useState, useCallback } from 'react';
import { BackgroundRemovalService } from '@/services/bgService';
import { BackgroundRemovalResult } from '@/types';

interface UseBackgroundRemovalReturn {
  isLoading: boolean;
  error: string | null;
  result: string | null;
  removeBackground: (file: File) => Promise<void>;
  removeBackgroundFromUrl: (url: string) => Promise<void>;
  reset: () => void;
}

export function useBackgroundRemoval(): UseBackgroundRemovalReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const removeBackground = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response: BackgroundRemovalResult = await BackgroundRemovalService.processFile(file);
      
      if (response.success && response.imageUrl) {
        setResult(response.imageUrl);
      } else {
        setError(response.error || 'Failed to remove background');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeBackgroundFromUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response: BackgroundRemovalResult = await BackgroundRemovalService.removeFromUrl(url);
      
      if (response.success && response.imageUrl) {
        setResult(response.imageUrl);
      } else {
        setError(response.error || 'Failed to remove background');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    isLoading,
    error,
    result,
    removeBackground,
    removeBackgroundFromUrl,
    reset,
  };
}