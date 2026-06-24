import { AdminOrder } from '@/types/admin.types';

export const getReceiptEmailHtml = (order: AdminOrder): string => {
  const deliveryFee = order.deliveryCharge || 40;
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Receipt - XVIII Brew Co.</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #15110D;
            color: #EDE3D0;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1A1410;
            border: 1px solid rgba(184, 149, 106, 0.2);
            padding: 40px;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid rgba(184, 149, 106, 0.2);
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-family: Georgia, serif;
            font-size: 24px;
            color: #B8956A;
            margin: 0;
            letter-spacing: 0.1em;
          }
          .title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: rgba(237, 227, 208, 0.6);
            margin-top: 10px;
          }
          .order-id {
            font-family: monospace;
            color: #B8956A;
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: rgba(237, 227, 208, 0.5);
            margin-bottom: 15px;
          }
          .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 15px;
          }
          .item-name {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 5px 0;
            color: #EDE3D0;
          }
          .item-meta {
            font-size: 12px;
            color: rgba(237, 227, 208, 0.5);
            margin: 0;
          }
          .item-price {
            font-size: 16px;
            color: #B8956A;
            text-align: right;
          }
          .totals {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(184, 149, 106, 0.2);
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
            color: rgba(237, 227, 208, 0.7);
          }
          .grand-total {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(184, 149, 106, 0.2);
            font-size: 20px;
            font-weight: bold;
            font-family: Georgia, serif;
            color: #B8956A;
          }
          .details {
            margin-top: 40px;
            background-color: rgba(255, 255, 255, 0.02);
            padding: 20px;
            border: 1px solid rgba(184, 149, 106, 0.1);
          }
          .details p {
            margin: 5px 0;
            font-size: 14px;
            color: rgba(237, 227, 208, 0.8);
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: rgba(237, 227, 208, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">XVIII BREW CO.</h1>
            <p class="title">Digital Receipt</p>
          </div>
          
          <div class="order-id">
            Order Reference: ${order.id}
          </div>

          <h2 class="section-title">Order Summary</h2>
          
          ${order.items.map(item => `
            <div class="item-row">
              <div>
                <p class="item-name">${item.productName}</p>
                <p class="item-meta">Qty: ${item.quantity}</p>
              </div>
              <div class="item-price">
                ₹${(item.price * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          `).join('')}

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>₹${order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-row">
              <span>Delivery</span>
              <span>₹${deliveryFee.toLocaleString('en-IN')}</span>
            </div>
            <div class="grand-total">
              <span>Total Paid</span>
              <span>₹${order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="details">
            <h2 class="section-title">Delivery Details</h2>
            <p><strong>Name:</strong> ${order.customerName}</p>
            <p><strong>Address:</strong> ${order.customerAddress}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            ${order.isScheduled ? `
              <p style="margin-top: 15px; color: #B8956A;">
                <strong>Scheduled For:</strong> ${order.deliveryDate} at ${order.deliveryTime}
              </p>
            ` : ''}
          </div>

          <div class="footer">
            <p>Every item chosen with intention. Every order fulfilled with care.</p>
            <p>Thank you for choosing XVIII Brew Co.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
