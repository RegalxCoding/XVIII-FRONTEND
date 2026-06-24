import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getReceiptEmailHtml } from '@/lib/email-templates/ReceiptEmailTemplate';
import type { AdminOrder } from '@/types/admin.types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, order } = body as { email: string; order: AdminOrder };

    if (!email || !order) {
      return NextResponse.json(
        { error: 'Email and order data are required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'XVIII Brew Co. <onboarding@resend.dev>',
      to: [email],
      subject: `Order Receipt - ${order.id}`,
      html: getReceiptEmailHtml(order),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
