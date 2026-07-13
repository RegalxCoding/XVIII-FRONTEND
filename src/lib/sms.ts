// ─────────────────────────────────────────
// SMS Service — Pluggable Interface
// Server-side only. Used by API routes to send OTP to customers.
//
// Currently uses ConsoleSmsService (logs to console for development).
// To switch to production:
//   1. Implement TwilioSmsService or MSG91SmsService
//   2. Change the export at the bottom of this file
// ─────────────────────────────────────────

/**
 * Interface for SMS delivery services.
 * All implementations must follow this contract.
 */
export interface SmsService {
  sendOtp(phone: string, otp: string): Promise<SmsResult>;
}

export interface SmsResult {
  success: boolean;
  message: string;
}

// ─────────────────────────────────────────
// Console SMS Service (Development)
// Logs the OTP to the server console.
// The OTP is visible ONLY in server logs — never sent to the client.
// ─────────────────────────────────────────

class ConsoleSmsService implements SmsService {
  async sendOtp(phone: string, otp: string): Promise<SmsResult> {
    const timestamp = new Date().toISOString();

    console.log('\n┌─────────────────────────────────────────');
    console.log('│  📱 SMS SERVICE (Development Mode)');
    console.log('├─────────────────────────────────────────');
    console.log(`│  To:   ${phone}`);
    console.log(`│  Time: ${timestamp}`);
    console.log('│');
    console.log('│  XVIII Brew Co.');
    console.log('│');
    console.log(`│  Your delivery verification code is:`);
    console.log('│');
    console.log(`│  🔑  ${otp}`);
    console.log('│');
    console.log('│  Valid for 5 minutes.');
    console.log('│  Never share this code before the');
    console.log('│  delivery partner arrives.');
    console.log('└─────────────────────────────────────────\n');

    return {
      success: true,
      message: `OTP sent to ${phone} (console mode)`,
    };
  }
}

// ─────────────────────────────────────────
// Twilio SMS Service (Production — template)
// Uncomment and configure when ready for production.
// ─────────────────────────────────────────

// class TwilioSmsService implements SmsService {
//   private client: any; // Twilio client
//   private from: string;
//
//   constructor() {
//     const accountSid = process.env.TWILIO_ACCOUNT_SID!;
//     const authToken = process.env.TWILIO_AUTH_TOKEN!;
//     this.from = process.env.TWILIO_PHONE_NUMBER!;
//     // this.client = require('twilio')(accountSid, authToken);
//   }
//
//   async sendOtp(phone: string, otp: string): Promise<SmsResult> {
//     try {
//       await this.client.messages.create({
//         body: `XVIII Brew Co.\n\nYour delivery verification code is:\n\n${otp}\n\nValid for 5 minutes.\nNever share this code before the delivery partner arrives.`,
//         from: this.from,
//         to: phone,
//       });
//       return { success: true, message: `OTP sent to ${phone}` };
//     } catch (error) {
//       console.error('Twilio SMS failed:', error);
//       return { success: false, message: 'Failed to send SMS' };
//     }
//   }
// }

// ─────────────────────────────────────────
// Export the active SMS service
// Change this line to switch providers.
// ─────────────────────────────────────────

export const smsService: SmsService = new ConsoleSmsService();
