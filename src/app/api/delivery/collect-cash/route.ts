// ─────────────────────────────────────────
// POST /api/delivery/collect-cash
// COD flow: driver marks cash as collected before OTP can be sent.
// ─────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    // ── Input validation ──
    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'orderId is required' },
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

    // ── Verify payment method is COD ──
    if (orderData.paymentMethod !== 'cash_on_delivery') {
      return NextResponse.json(
        { success: false, code: 'INVALID_INPUT', message: 'This order is not Cash on Delivery' },
        { status: 400 }
      );
    }

    // ── Verify order status ──
    if (orderData.status !== 'out_for_delivery') {
      return NextResponse.json(
        { success: false, code: 'WRONG_STATUS', message: `Order status is "${orderData.status}", expected "out_for_delivery"` },
        { status: 403 }
      );
    }

    // ── Check if already collected ──
    if (orderData.paymentStatus === 'cash_collected') {
      return NextResponse.json({
        success: true,
        message: 'Cash already marked as collected',
      });
    }

    // ── Update payment status ──
    const orderDocRef = doc(db, 'orders', orderDoc.id);
    await updateDoc(orderDocRef, {
      paymentStatus: 'cash_collected',
    });

    console.log(`[Delivery] Cash collected for order ${orderId}`);

    return NextResponse.json({
      success: true,
      message: 'Cash collection confirmed',
    });
  } catch (error) {
    console.error('[Delivery] Collect cash error:', error);
    return NextResponse.json(
      { success: false, code: 'SERVER_ERROR', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
