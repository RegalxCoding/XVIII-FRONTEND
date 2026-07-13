// ─────────────────────────────────────────
// POST /api/delivery/send-otp
// Driver triggers this when they reach the customer.
// Validates GPS proximity, generates a NEW OTP, and sends via SMS.
// ─────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import {
  collection, query, where, getDocs, doc, updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateOtp, hashOtp, isWithinProximity, haversineDistance } from '@/lib/otp';
import { smsService } from '@/lib/sms';
import { OTP_EXPIRY_MINUTES, DELIVERY_PROXIMITY_METERS } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, driverLocation } = body;

    // ── Input validation ──
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'orderId is required' },
        { status: 400 }
      );
    }

    if (
      !driverLocation ||
      typeof driverLocation.lat !== 'number' ||
      typeof driverLocation.lng !== 'number'
    ) {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'Valid driverLocation { lat, lng } is required' },
        { status: 400 }
      );
    }

    // ── Fetch the order ──
    const ordersCol = collection(db, 'orders');
    const orderQuery = query(ordersCol, where('id', '==', orderId));
    const orderSnap = await getDocs(orderQuery);

    if (orderSnap.empty) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Order not found' },
        { status: 404 }
      );
    }

    const orderDoc = orderSnap.docs[0];
    const orderData = orderDoc.data();

    // ── Verify order status ──
    if (orderData.status !== 'out_for_delivery') {
      return NextResponse.json(
        { success: false, code: 'WRONG_STATUS', message: `Order status is "${orderData.status}", expected "out_for_delivery"` },
        { status: 403 }
      );
    }

    // ── GPS proximity check ──
    const customerLocation = orderData.location;
    if (!customerLocation || typeof customerLocation.lat !== 'number') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'Customer location not available on this order' },
        { status: 400 }
      );
    }

    if (!isWithinProximity(driverLocation, customerLocation, DELIVERY_PROXIMITY_METERS)) {
      const distance = Math.round(haversineDistance(driverLocation, customerLocation));
      return NextResponse.json(
        {
          success: false,
          code: 'GPS_TOO_FAR',
          message: `You are ${distance}m away from the customer. Move within ${DELIVERY_PROXIMITY_METERS}m to send OTP.`,
          distance,
        },
        { status: 403 }
      );
    }

    // ── Fetch verification record ──
    const verificationsCol = collection(db, 'delivery_verifications');
    const verQuery = query(verificationsCol, where('orderId', '==', orderId));
    const verSnap = await getDocs(verQuery);

    if (verSnap.empty) {
      return NextResponse.json(
        { success: false, code: 'NOT_FOUND', message: 'Verification record not found. Order may not have been initialized.' },
        { status: 404 }
      );
    }

    const verDoc = verSnap.docs[0];
    const verData = verDoc.data();

    // ── Check if already verified ──
    if (verData.verified) {
      return NextResponse.json(
        { success: false, code: 'ALREADY_VERIFIED', message: 'OTP already verified for this order' },
        { status: 403 }
      );
    }

    // ── Generate NEW OTP and update the hash ──
    const newOtp = generateOtp();
    const newHash = hashOtp(newOtp);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const verDocRef = doc(db, 'delivery_verifications', verDoc.id);
    await updateDoc(verDocRef, {
      otpHash: newHash,
      generatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      attempts: 0,
      lastSentAt: now.toISOString(),
    });

    // ── Send OTP via SMS ──
    const customerPhone = verData.customerPhone || orderData.customerPhone;
    const smsResult = await smsService.sendOtp(customerPhone, newOtp);

    if (!smsResult.success) {
      console.error(`[Delivery] SMS send failed for order ${orderId}:`, smsResult.message);
      return NextResponse.json(
        { success: false, code: 'SMS_FAILED', message: 'Failed to send OTP via SMS. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`[Delivery] OTP sent for order ${orderId} to ${customerPhone}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to customer',
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('[Delivery] Send OTP error:', error);
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
