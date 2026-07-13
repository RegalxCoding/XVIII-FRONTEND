// ─────────────────────────────────────────
// POST /api/delivery/verify-otp
// Driver submits the OTP the customer told them.
// Compares hash, checks expiry and attempt limits.
// On success: marks order as Delivered.
// ─────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import {
  collection, query, where, getDocs, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { verifyOtpHash, isExpired } from '@/lib/otp';
import { OTP_MAX_ATTEMPTS } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, otp, driverLocation } = body;

    // ── Input validation ──
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'orderId is required' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'OTP must be a 6-digit number' },
        { status: 400 }
      );
    }

    // ── Fetch verification record ──
    const verificationsCol = collection(db, 'delivery_verifications');
    const verQuery = query(verificationsCol, where('orderId', '==', orderId));
    const verSnap = await getDocs(verQuery);

    if (verSnap.empty) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Verification record not found' },
        { status: 404 }
      );
    }

    const verDoc = verSnap.docs[0];
    const verData = verDoc.data();
    const verDocRef = doc(db, 'delivery_verifications', verDoc.id);

    // ── Check if already verified ──
    if (verData.verified) {
      return NextResponse.json(
        { success: true, verified: true, message: 'OTP already verified', attemptsRemaining: 0 },
      );
    }

    // ── Check expiry ──
    if (isExpired(verData.expiresAt)) {
      // Log the expired attempt
      const log = verData.verificationLog || [];
      log.push({
        timestamp: new Date().toISOString(),
        result: 'expired',
        driverLocation: driverLocation || null,
      });
      await updateDoc(verDocRef, { verificationLog: log });

      return NextResponse.json(
        { success: false, code: 'OTP_EXPIRED', message: 'OTP has expired. Please resend a new code.', verified: false },
        { status: 403 }
      );
    }

    // ── Check attempt limit ──
    if (verData.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          success: false,
          code: 'MAX_ATTEMPTS',
          message: 'Maximum attempts reached. Please resend a new OTP.',
          verified: false,
          attemptsRemaining: 0,
        },
        { status: 403 }
      );
    }

    // ── Verify OTP hash ──
    const isValid = verifyOtpHash(otp, verData.otpHash);
    const now = new Date().toISOString();
    const log = verData.verificationLog || [];

    if (isValid) {
      // ── SUCCESS — Mark as verified and update order status ──
      log.push({
        timestamp: now,
        result: 'success',
        driverLocation: driverLocation || null,
      });

      await updateDoc(verDocRef, {
        verified: true,
        verifiedAt: now,
        verificationLog: log,
      });

      // Update order status to delivered
      const ordersCol = collection(db, 'orders');
      const orderQuery = query(ordersCol, where('id', '==', orderId));
      const orderSnap = await getDocs(orderQuery);

      if (!orderSnap.empty) {
        const orderDocRef = doc(db, 'orders', orderSnap.docs[0].id);
        await updateDoc(orderDocRef, { status: 'delivered' });
      }

      console.log(`[Delivery] OTP verified for order ${orderId} ✅`);

      return NextResponse.json({
        success: true,
        verified: true,
        message: 'OTP verified successfully. Order marked as delivered.',
        attemptsRemaining: 0,
      });
    } else {
      // ── FAILURE — Increment attempts ──
      const newAttempts = verData.attempts + 1;
      const attemptsRemaining = OTP_MAX_ATTEMPTS - newAttempts;

      log.push({
        timestamp: now,
        result: newAttempts >= OTP_MAX_ATTEMPTS ? 'locked' : 'failed',
        driverLocation: driverLocation || null,
      });

      await updateDoc(verDocRef, {
        attempts: newAttempts,
        verificationLog: log,
      });

      console.log(`[Delivery] Wrong OTP for order ${orderId} — attempt ${newAttempts}/${OTP_MAX_ATTEMPTS}`);

      if (attemptsRemaining <= 0) {
        return NextResponse.json(
          {
            success: false,
            code: 'MAX_ATTEMPTS',
            verified: false,
            message: 'Maximum attempts reached. Please resend a new OTP.',
            attemptsRemaining: 0,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: 'WRONG_OTP',
          verified: false,
          message: `Incorrect OTP. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`,
          attemptsRemaining,
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('[Delivery] Verify OTP error:', error);
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
