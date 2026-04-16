import { NextRequest, NextResponse } from 'next/server';
import { BackgroundRemovalService } from '@/services/bgService';

/**
 * POST: ပုံကို လက်ခံ၍ နောက်ခံဖယ်ရှားပေးရန်
 */
export async function POST(request: NextRequest) {
  try {
    // ၁။ FormData ကို ရယူခြင်း
    const formData = await request.formData();
    const file = formData.get('image');

    // ၂။ File ပါဝင်မှုရှိမရှိနှင့် အမျိုးအစားကို စစ်ဆေးခြင်း
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'ပုံရိပ်ဖိုင် (Image file) ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။' },
        { status: 400 }
      );
    }

    // ၃။ Service မှတစ်ဆင့် Background Removal ပြုလုပ်ခြင်း
    const result = await BackgroundRemovalService.processFile(file);

    // ၄။ ရလဒ် အောင်မြင်မှု ရှိမရှိ စစ်ဆေးခြင်း
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'နောက်ခံဖယ်ရှားရာတွင် အမှားအယွင်း ရှိနေပါသည်။' 
        },
        { status: 500 }
      );
    }

    // ၅။ အောင်မြင်ပါက ပုံ URL ကို ပြန်ပို့ခြင်း
    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
    });

  } catch (error) {
    // Server ဘက်ခြမ်းတွင် အမှားရှာဖွေရန် Log ထုတ်ခြင်း
    console.error('API Error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Internal server error ဖြစ်ပွားနေပါသည်။' },
      { status: 500 }
    );
  }
}

/**
 * GET: API အခြေအနေကို စစ်ဆေးရန် (Health Check)
 */
export async function GET() {
  return NextResponse.json({
    name: 'AMKyaw AI Background Remover API',
    status: 'Operational',
    version: '1.0.0',
    documentation: {
      method: 'POST',
      endpoint: '/api/remove-bg',
      body: 'FormData { image: File }',
      response: '{ success: boolean, imageUrl: string }'
    },
  });
}
