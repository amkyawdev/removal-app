import { removeBackground, removeBackgroundFromUrl } from '@/lib/gradio-client';
import { BackgroundRemovalResult } from '@/types';

/**
 * Background Removal Service
 * AI logic နှင့် Business logic များကို ပေါင်းစည်းပေးသော Service ဖြစ်သည်။
 */
export class BackgroundRemovalService {
  
  /**
   * Base64 format ဖြင့် နောက်ခံဖယ်ရှားခြင်း
   */
  static async removeFromBase64(imageBase64: string): Promise<BackgroundRemovalResult> {
    try {
      // metadata ပါဝင်ပါက ဖယ်ရှားပြီးမှ ပို့ဆောင်ခြင်း
      const cleanBase64 = imageBase64.includes(',') 
        ? imageBase64.split(',')[1] 
        : imageBase64;

      const result = await removeBackground(cleanBase64);
      
      return {
        success: true,
        imageUrl: result,
      };
    } catch (error) {
      console.error('Base64 Processing Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'နောက်ခံဖယ်ရှားရာတွင် အမှားအယွင်းရှိပါသည်။',
      };
    }
  }

  /**
   * Image URL မှတစ်ဆင့် နောက်ခံဖယ်ရှားခြင်း
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
        error: error instanceof Error ? error.message : 'URL မှ ပုံကို ရယူ၍မရပါ။',
      };
    }
  }

  /**
   * Upload လုပ်ထားသော File ကို လက်ခံ၍ Background ဖယ်ရှားခြင်း
   */
  static async processFile(file: File): Promise<BackgroundRemovalResult> {
    try {
      // ၁။ File Type စစ်ဆေးခြင်း
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'ပုံရိပ်ဖိုင် (Image) သာ တင်ပေးပါရန်။' };
      }

      // ၂။ File ကို Base64 သို့ ပြောင်းလဲခြင်း
      const base64 = await this.fileToBase64(file);
      
      // ၃။ ပုံကို Process လုပ်ခြင်း
      return await this.removeFromBase64(base64);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'ဖိုင်ဖတ်ရာတွင် အမှားအယွင်းရှိပါသည်။',
      };
    }
  }

  /**
   * Helper: File Object ကို Base64 String သို့ ပြောင်းပေးသည့် Function
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(new Error('ဖိုင်ဖတ်၍ မရပါ'));
    });
  }
}
