/**
 * Background Removal Service ၏ ရလဒ်အတွက် Interface
 * Discriminated Union ကို အသုံးပြုထားသောကြောင့် success ဖြစ်မှသာ imageUrl ပါဝင်မည်ဖြစ်သည်။
 */
export type BackgroundRemovalResult = 
  | { success: true; imageUrl: string; error?: never }
  | { success: false; imageUrl?: never; error: string };

/**
 * API Response များအတွက် General Structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string; // ဘယ်အချိန်မှာ process လုပ်ခဲ့သလဲ သိနိုင်ရန်
}

/**
 * Upload လုပ်ပြီးနောက် ရရှိလာမည့် ပုံ၏ အချက်အလက်
 */
export interface ImageOutput {
  url: string;
  fileName?: string;
  fileSize?: number;
  mimeType: string;
}

/**
 * API မှ ပြန်လာမည့် Error format
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string; // Error code (e.g., 'RATE_LIMIT_EXCEEDED', 'FILE_TOO_LARGE')
}
