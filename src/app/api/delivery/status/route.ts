// ─────────────────────────────────────────
// GET /api/delivery/status?orderId=ORD-XXXXXX
// Returns sanitized verification state for the driver app.
// NEVER returns the OTP hash or plain OTP.
// ─────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { isExpired } from '@/lib/otp';
import { OTP_MAX_ATTEMPTS, OTP_RESEND_COOLDOWN_SECONDS } from '@/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    // ── Input validation ──
    if (!orderId) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'orderId query param is required' },
        { status: 400 }
      );
    }

    // ── Fetch order for payment status ──
    const ordersCol = collection(db, 'orders');
    const orderQuery = query(ordersCol, where('id', '==', orderId));
    const orderSnap = await getDocs(orderQuery);

    if (orderSnap.empty) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderSnap.docs[0].data();

    // ── Fetch verification record ──
    const verificationsCol = collection(db, 'delivery_verifications');
    const verQuery = query(verificationsCol, where('orderId', '==', orderId));
    const verSnap = await getDocs(verQuery);

    if (verSnap.empty) {
      // No verification record yet — return default state
      return NextResponse.json({
        success: true,
        data: {
          orderId,
          attempts: 0,
          maxAttempts: OTP_MAX_ATTEMPTS,
          verified: false,
          expired: false,
          resendCount: 0,
          canResend: false,
          cooldownRemaining: 0,
          paymentStatus: orderData.paymentStatus || 'pending',
          otpSent: false,
        },
      });
    }

    const verData = verSnap.docs[0].data();

    // ── Calculate cooldown ──
    let cooldownRemaining = 0;
    let canResend = false;

    if (verData.lastSentAt) {
      const elapsed = (Date.now() - new Date(verData.lastSentAt).getTime()) / 1000;
      cooldownRemaining = Math.max(0, Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed));
      canResend = cooldownRemaining === 0;
    }

    const expired = verData.expiresAt ? isExpired(verData.expiresAt) : false;

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        attempts: verData.attempts || 0,
        maxAttempts: OTP_MAX_ATTEMPTS,
        verified: verData.verified || false,
        verifiedAt: verData.verifiedAt || undefined,
        expired,
        resendCount: verData.resendCount || 0,
        canResend,
        cooldownRemaining,
        paymentStatus: orderData.paymentStatus || 'pending',
        otpSent: !!verData.lastSentAt,
      },
    });
  } catch (error) {
    console.error('[Delivery] Status check error:', error);
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
