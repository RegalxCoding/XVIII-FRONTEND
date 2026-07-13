// ─────────────────────────────────────────
// POST /api/delivery/initialize
// Called after order creation to pre-generate and store OTP hash.
// The OTP is NOT sent to the customer at this point.
// ─────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateOtp, hashOtp } from '@/lib/otp';
import { OTP_EXPIRY_MINUTES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, customerPhone } = body;

    // ── Input validation ──
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'orderId is required' },
        { status: 400 }
      );
    }

    if (!customerPhone || typeof customerPhone !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'customerPhone is required' },
        { status: 400 }
      );
    }

    // ── Check if verification already exists for this order ──
    const verificationsCol = collection(db, 'delivery_verifications');
    const existingQuery = query(verificationsCol, where('orderId', '==', orderId));
    const existingSnap = await getDocs(existingQuery);

    if (!existingSnap.empty) {
      // Already initialized — idempotent, return success
      return NextResponse.json({
        success: true,
        message: 'Delivery verification already initialized',
      });
    }

    // ── Generate OTP and store ONLY the hash ──
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await addDoc(verificationsCol, {
      orderId,
      otpHash,
      generatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      verified: false,
      resendCount: 0,
      customerPhone,
      verificationLog: [],
    });

    // The plain OTP is NOT logged here — it will only be sent
    // when the driver triggers send-otp from within GPS range.
    console.log(`[Delivery] Verification initialized for order ${orderId}`);

    return NextResponse.json({
      success: true,
      message: 'Delivery verification initialized',
    });
  } catch (error) {
    console.error('[Delivery] Initialize error:', error);
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
