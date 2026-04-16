import { NextRequest, NextResponse } from 'next/server';
import { BackgroundRemovalService } from '@/services/bgService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const result = await BackgroundRemovalService.processFile(file);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to remove background' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'BGRemover API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/remove-bg - Upload an image to remove background',
    },
  });
}