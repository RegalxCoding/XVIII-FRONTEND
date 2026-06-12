'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Loader2, CheckCircle2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCartStore, DELIVERY_FEE } from '@/store/cart.store';
import { useOrderStore, OrderLocation } from '@/store/order.store';
import { useAuthStore } from '@/store/auth.store';
import { ordersService } from '@/services/orders.service';

const ease = [0.22, 1, 0.36, 1] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const user = useAuthStore((s) => s.user);

  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    fullAddress: '',
    landmark: '',
    city: 'Kanpur', // pre-filled
    pincode: '',
  });

  // Location State
  const [locationState, setLocationState] = useState<{
    coords: OrderLocation | null;
    isLoading: boolean;
    error: string | null;
  }>({
    coords: null,
    isLoading: false,
    error: null,
  });

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (items.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [items.length, router, isSubmitting]);

  // Derived calculations
  const subtotal = getSubtotal();
  const total = subtotal + DELIVERY_FEE;
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Validation
  const isPhoneValid = formData.phone.replace(/[^0-9]/g, '').length === 10;
  const isFormValid = 
    formData.fullName.trim() !== '' &&
    isPhoneValid &&
    formData.fullAddress.trim() !== '' &&
    locationState.coords !== null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = () => {
    setLocationState({ coords: null, isLoading: true, error: null });
    
    if (!navigator.geolocation) {
      setLocationState({ coords: null, isLoading: false, error: 'Geolocation is not supported by your browser' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        setLocationState({
          coords: null,
          isLoading: false,
          error: 'Unable to retrieve your location. Please check your permissions.',
        });
        console.error("Error detecting location", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSimulateLocation = () => {
    setLocationState({
      coords: { lat: 26.4499, lng: 80.3319 }, // Kanpur coordinates
      isLoading: false,
      error: null,
    });
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate network request for premium feel
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const fullAddressString = `${formData.fullAddress}${formData.landmark ? `, Near ${formData.landmark}` : ''}, ${formData.city}${formData.pincode ? ` - ${formData.pincode}` : ''}`;

      // 1. Create order in Firestore
      const orderId = await ordersService.create({
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerAddress: fullAddressString,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          imageUrl: item.product.image || ''
        })),
        subtotal,
        deliveryCharge: DELIVERY_FEE,
        totalAmount: total,
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        notes: formData.landmark || '',
        userId: user?.uid || null,
        location: locationState.coords
      });

      // 2. Sync order locally with Zustand using the generated ID
      placeOrder({
        items,
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total,
        address: formData,
        location: locationState.coords,
        estimatedTime: '25–35 minutes',
      }, orderId);

      clearCart();
      router.push(`/order-success?id=${orderId}`);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isMounted || items.length === 0) {
    return (
      <main className="bg-[#15110D] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#B8956A]" />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#15110D] min-h-screen flex flex-col">
      <Navbar />

      {/* ── Page Header & Progress ── */}
      <section className="pt-32 pb-8 lg:pt-40 lg:pb-12 border-b border-[#B8956A]/10">
        <div className="container-brand">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <h1
              className="text-[#EDE3D0] text-3xl lg:text-5xl mb-8"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Checkout<span className="text-[#B8956A]">.</span>
            </h1>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {['Cart', 'Login', 'Checkout', 'Order Confirmed'].map((step, idx, arr) => {
                const isActive = step === 'Checkout';
                const isPast = ['Cart', 'Login'].includes(step);
                
                return (
                  <div key={step} className="flex items-center gap-2 lg:gap-4 shrink-0">
                    <span
                      className={`text-[10px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${
                        isActive 
                          ? 'text-[#B8956A] font-bold' 
                          : isPast 
                            ? 'text-[#EDE3D0]/60' 
                            : 'text-[#EDE3D0]/30'
                      }`}
                      style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                    >
                      {step}
                    </span>
                    {idx !== arr.length - 1 && (
                      <div className={`w-8 lg:w-12 h-px ${isPast ? 'bg-[#B8956A]/50' : 'bg-[#B8956A]/20'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Checkout Content ── */}
      <section className="py-12 lg:py-16 flex-1">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">

            {/* ── Left Column: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.1 }}
              className="space-y-12"
            >
              
              {/* Delivery Details */}
              <div className="bg-[#1a1410] border border-[#B8956A]/15 p-6 lg:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <MapPin className="text-[#B8956A] w-5 h-5" />
                  <h2
                    className="text-[#EDE3D0] text-xl tracking-wide"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Delivery Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[#EDE3D0]/60 text-[10px] tracking-[0.2em] uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full bg-[#15110D] border border-[#B8956A]/20 text-[#EDE3D0] p-4 focus:outline-none focus:border-[#B8956A] transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[#EDE3D0]/60 text-[10px] tracking-[0.2em] uppercase">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full bg-[#15110D] border border-[#B8956A]/20 text-[#EDE3D0] p-4 focus:outline-none focus:border-[#B8956A] transition-colors"
                    />
                  </div>

                  {/* Complete Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[#EDE3D0]/60 text-[10px] tracking-[0.2em] uppercase">
                      Complete Address *
                    </label>
                    <textarea
                      name="fullAddress"
                      value={formData.fullAddress}
                      onChange={handleInputChange}
                      placeholder="House No, Building, Street, Area"
                      rows={3}
                      className="w-full bg-[#15110D] border border-[#B8956A]/20 text-[#EDE3D0] p-4 focus:outline-none focus:border-[#B8956A] transition-colors resize-none"
                    />
                  </div>

                  {/* Landmark */}
                  <div className="space-y-2">
                    <label className="text-[#EDE3D0]/60 text-[10px] tracking-[0.2em] uppercase">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near..."
                      className="w-full bg-[#15110D] border border-[#B8956A]/20 text-[#EDE3D0] p-4 focus:outline-none focus:border-[#B8956A] transition-colors"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-[#EDE3D0]/60 text-[10px] tracking-[0.2em] uppercase">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      readOnly
                      className="w-full bg-[#15110D]/50 border border-[#B8956A]/10 text-[#EDE3D0]/60 p-4 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Live Location Section */}
              <div className="bg-[#1a1410] border border-[#B8956A]/15 p-6 lg:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Navigation className="w-32 h-32" />
                </div>
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <Navigation className="text-[#B8956A] w-5 h-5" />
                    <h2
                      className="text-[#EDE3D0] text-xl tracking-wide"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Live Location
                    </h2>
                  </div>
                  {locationState.coords && (
                    <span className="flex items-center gap-2 text-green-500/80 text-xs">
                      <CheckCircle2 className="w-4 h-4" /> Detected
                    </span>
                  )}
                </div>

                <div className="relative z-10 space-y-6">
                  <p className="text-[#EDE3D0]/60 text-sm leading-relaxed">
                    Please allow location access. Our delivery partner will use both your written address and your live location for accurate, seamless delivery.
                  </p>

                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locationState.isLoading}
                    className="flex items-center justify-center gap-3 w-full md:w-auto bg-[#B8956A]/10 border border-[#B8956A]/30 text-[#B8956A] px-6 py-4 hover:bg-[#B8956A]/20 transition-all text-xs tracking-[0.15em] uppercase font-bold"
                  >
                    {locationState.isLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Detecting...</>
                    ) : (
                      <><MapPin className="w-4 h-4" /> {locationState.coords ? 'Re-detect Location' : 'Detect My Current Location'}</>
                    )}
                  </button>

                  {process.env.NODE_ENV === 'development' && (
                    <button
                      type="button"
                      onClick={handleSimulateLocation}
                      className="mt-4 flex items-center justify-center gap-3 w-full md:w-auto bg-green-500/10 border border-green-500/30 text-green-500 px-6 py-4 hover:bg-green-500/20 transition-all text-xs tracking-[0.15em] uppercase font-bold"
                    >
                      <MapPin className="w-4 h-4" /> Simulate Location (Dev)
                    </button>
                  )}

                  {locationState.error && (
                    <p className="text-red-400/80 text-sm">{locationState.error}</p>
                  )}

                  <AnimatePresence>
                    {locationState.coords && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 border border-[#B8956A]/20 bg-[#15110D] p-1">
                          <iframe 
                            width="100%" 
                            height="200" 
                            style={{ border: 0 }} 
                            loading="lazy" 
                            allowFullScreen 
                            referrerPolicy="no-referrer-when-downgrade" 
                            src={`https://maps.google.com/maps?q=${locationState.coords.lat},${locationState.coords.lng}&z=15&output=embed`}
                            className="opacity-80 sepia-[0.3] hue-rotate-[-10deg]"
                          ></iframe>
                          <div className="p-3 bg-[#15110D] flex justify-between items-center text-xs text-[#EDE3D0]/60">
                            <span>Lat: {locationState.coords.lat.toFixed(4)}</span>
                            <span>Lng: {locationState.coords.lng.toFixed(4)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#1a1410] border border-[#B8956A]/15 p-6 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <CreditCard className="text-[#B8956A] w-5 h-5" />
                  <h2
                    className="text-[#EDE3D0] text-xl tracking-wide"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Payment
                  </h2>
                </div>

                <div className="border border-[#B8956A]/40 bg-[#B8956A]/5 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#B8956A] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#15110D]" />
                    </div>
                    <span className="text-[#EDE3D0] font-medium tracking-wide">Cash on Delivery</span>
                  </div>
                  <ShieldCheck className="text-[#B8956A]/60 w-5 h-5" />
                </div>
                
                <p className="mt-4 text-[#EDE3D0]/40 text-xs italic">
                  * Online payments will be available soon.
                </p>
              </div>

            </motion.div>

            {/* ── Right Column: Order Summary ── */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.2 }}
              className="lg:sticky lg:top-32 bg-[#1a1410] border border-[#B8956A]/15 p-8 lg:p-10 self-start"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-6 h-px bg-[#B8956A]" />
                <h2
                  className="text-[#B8956A] text-[10px] tracking-[0.4em] uppercase"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Your Order
                </h2>
              </div>

              {/* Product List summary */}
              <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#B8956A]/20">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <p className="text-[#EDE3D0] truncate max-w-[200px]">{item.product.name}</p>
                      <p className="text-[#EDE3D0]/40 text-xs mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-[#EDE3D0]/80">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-[#B8956A]/15 mb-6" />

              {/* Totals */}
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#EDE3D0]/60">Item Total</span>
                  <span className="text-[#EDE3D0]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#EDE3D0]/60">Delivery Charge</span>
                  <span className="text-[#EDE3D0]">₹{DELIVERY_FEE}</span>
                </div>
              </div>

              <div className="w-full h-px bg-[#B8956A]/15 mb-6" />

              <div className="flex items-end justify-between mb-8">
                <span className="text-[#EDE3D0]/80 text-sm tracking-[0.05em]">Grand Total</span>
                <span className="text-[#B8956A] font-bold font-cinzel text-2xl">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={!isFormValid || isSubmitting}
                className={`
                  w-full flex items-center justify-center gap-3
                  py-5 text-xs tracking-[0.25em] uppercase font-bold
                  transition-all duration-300 group relative overflow-hidden
                  ${!isFormValid
                    ? 'bg-[#EDE3D0]/8 text-[#EDE3D0]/20 cursor-not-allowed'
                    : 'bg-[#B8956A] text-[#15110D] hover:bg-[#EDE3D0] active:scale-[0.98]'
                  }
                `}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Place Order
                    {isFormValid && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />}
                  </>
                )}
              </button>

              {/* Validation helper texts */}
              {!isFormValid && !isSubmitting && (
                <div className="mt-4 space-y-1">
                  <p className="text-center text-[#B8956A]/60 text-[10px] tracking-[0.1em]">
                    Please complete required fields to proceed:
                  </p>
                  <ul className="text-[#EDE3D0]/40 text-[10px] list-disc pl-4 space-y-0.5">
                    {formData.fullName.trim() === '' && <li>Full Name is required</li>}
                    {!isPhoneValid && <li>Valid 10-digit Phone Number is required</li>}
                    {formData.fullAddress.trim() === '' && <li>Complete Address is required</li>}
                    {!locationState.coords && <li>Live Location must be detected</li>}
                  </ul>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-[#B8956A]/10 text-center">
                <p className="text-[#EDE3D0]/40 text-xs">
                  Estimated delivery: <span className="text-[#B8956A]">25–35 minutes</span>
                </p>
              </div>

            </motion.aside>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
