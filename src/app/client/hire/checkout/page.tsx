"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Tag, Shield, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Smartphone, Wallet, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';
import { useBookings } from '@/contexts/BookingsContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getTotalPrice, clearCart, resetHireState } = useHire();
  const { addBooking } = useBookings();
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    calculatedDiscount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // ... (previous state variables) ...

  const subtotal = state.cartItems.reduce((total, item) => {
    const price = typeof item.service.price === 'string'
      ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
      : item.service.price;
    return total + (price * (item.quantity || 1));
  }, 0);
  const serviceFee = Math.round(subtotal * commissionRate); // Dynamic platform fee

  // Calculate discount dynamically
  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    // Recalculate based on current subtotal if needed, or use API provided calculation if simple
    // The API provided 'calculatedDiscount' for the orderAmount we sent.
    // If orderAmount changed (unlikely in checkout step easily), we might need to re-validate.
    // For now, simple percentage/fixed math:
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      // Cap logic is in API, but simpler to use the API returned calculatedDiscount 
      // IF we passed the correct amount.
      // Let's rely on the appliedCoupon state storing the result or logic.
      // Actually better to re-run math if we can or just use the value.
      return appliedCoupon.calculatedDiscount;
    }
    return appliedCoupon.calculatedDiscount;
  };

  const discount = getDiscountAmount();
  const total = Math.max(0, subtotal + serviceFee - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode,
          orderAmount: subtotal,
          userId: user?.id
        })
      });

      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.promo.code,
          discountType: data.promo.discountType,
          discountValue: data.promo.discountValue,
          calculatedDiscount: data.promo.calculatedDiscount
        });
        setCouponCode(''); // Clear input on success
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedCoupon(null);
      }
    } catch (error) {
      console.error('Coupon validation failed', error);
      setCouponError('Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const handleCODBooking = async () => {
    setIsProcessing(true);

    // Generate OTP for this booking
    const otp = generateOtp();

    // Simulate processing delay
    setTimeout(async () => {
      try {
        // Create the booking
        const serviceNames = state.cartItems.map(item => item.service.title).join(', ');
        // Use the date in YYYY-MM-DD format for proper filtering
        const bookingDate = state.selectedDate || new Date().toISOString().split('T')[0];

        const bookingId = await addBooking({
          service: serviceNames,
          provider: state.freelancerName || 'Freelancer',
          image: state.freelancerImage || '',
          date: bookingDate,
          time: state.selectedTime || '10:00 AM',
          status: 'confirmed',
          location: state.selectedLocation || 'Location TBD',
          price: `₹${total.toLocaleString()}`,
          rating: state.freelancerRating || 4.5,
          completedJobs: state.freelancerReviewCount || 50,
          description: `Booking for ${serviceNames}`,
          category: 'cricket',
          paymentMethod: 'cod',
          notes: (state.bookingNotes || '') + ` [OTP: ${otp}]`, // Append OTP to notes for now
          otp: otp,
          services: state.cartItems.map(item => ({
            id: item.service.id,
            title: item.service.title,
            price: item.service.price,
            quantity: item.quantity || 1,
            duration: item.duration || (item.service as any).duration,
            deliveryTime: item.service.deliveryTime
          }))
        });

        // Store OTP in localStorage for the freelancer side to access - REMOVED
        // Ideally handled by backend. We appended to notes for persistence context.

        setNewBookingId(bookingId);
        setGeneratedOtp(otp);
        setBookingSuccess(true);

        // Clear cart and hire state
        clearCart();
        resetHireState();

        // Redirect to bookings after showing success
        setTimeout(() => {
          router.push('/client/bookings');
        }, 3500);

      } catch (error) {
        console.error("Booking creation failed:", error);
        // Handle error UI?
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  // Show success screen with OTP
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-white/60 mb-4">Your booking {newBookingId} has been placed successfully.</p>

          {/* OTP Display Card */}
          {generatedOtp && (
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <p className="text-sm text-white/60 mb-2">Your Verification Code</p>
              <div className="flex justify-center gap-3 mb-3">
                {generatedOtp.split('').map((digit, idx) => (
                  <div key={idx} className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{digit}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-purple-300">
                Share this code with your coach to start the session
              </p>
            </div>
          )}

          <p className="text-white/40 text-sm mb-4">Payment: Cash on Delivery</p>
          <p className="text-white/50 text-sm">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  if (state.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white/90 mb-2">No items to checkout</h3>
          <Button
            onClick={() => router.push('/client/nearby/hirefeed')}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0F0F0F] overflow-y-auto">
      {/* Header - Personal Details Style */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Complete Payment</h1>
              <p className="text-white/50 text-xs">Secure Checkout</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-8">
        {/* Total Amount Display */}
        <div className="p-4 bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-xl border border-purple-500/30">
          <div className="text-center">
            <h2 className="text-white/70 text-sm font-medium mb-1">Total Amount</h2>
            <p className="text-2xl font-bold text-white mb-2">₹{total.toLocaleString()}</p>

            <button
              onClick={() => setShowOrderDetails(!showOrderDetails)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mx-auto text-sm"
            >
              <span>View Order Details</span>
              {showOrderDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Order Details Dropdown */}
          {showOrderDetails && (
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              <h3 className="text-white font-medium text-sm mb-3">Order Summary</h3>

              <div className="space-y-2">
                {state.cartItems.map((item, index) => (
                  <div key={`${item.service.id}-${index}`} className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-white text-sm">{item.service.title}</h5>
                      <p className="text-sm text-white/60">
                        Quantity: {item.quantity || 1} × ₹{typeof item.service.price === 'string'
                          ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
                          : item.service.price} / {item.service.deliveryTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white text-sm">
                        ₹{((item.quantity || 1) * (typeof item.service.price === 'string'
                          ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
                          : item.service.price)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-2 mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Platform Fee ({(commissionRate * 100).toFixed(0)}%)</span>
                  <span className="text-white">₹{serviceFee.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount ({appliedCoupon.code})</span>
                    <span className="text-green-400">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coupon Code Section */}
        <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-4">
          <h3 className="text-white font-medium mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-purple-400" />
            Apply Coupon
          </h3>

          {!appliedCoupon ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  placeholder="Enter Code"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 uppercase"
                />
                {couponError && (
                  <p className="absolute -bottom-5 left-0 text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>
              <Button
                onClick={handleApplyCoupon}
                disabled={validatingCoupon || !couponCode.trim()}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
              >
                {validatingCoupon ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : 'Apply'}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{appliedCoupon.code}</p>
                  <p className="text-green-400 text-xs">
                    ₹{appliedCoupon.calculatedDiscount.toLocaleString()} saved
                  </p>
                </div>
              </div>
              <button
                onClick={removeCoupon}
                className="text-white/40 hover:text-white transition-colors text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          <h3 className="text-white font-semibold text-lg">Payment Method</h3>

          {/* Cash on Delivery - Top Priority */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-white/60" />
              <div>
                <h4 className="text-white font-semibold">Cash on Delivery</h4>
                <p className="text-white/60 text-sm">Pay when service is completed</p>
              </div>
            </div>
            <button
              onClick={handleCODBooking}
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  Book Now • ₹{total.toLocaleString()} COD
                </>
              )}
            </button>
            <div className="text-xs text-white/40 text-center">
              No advance payment required • Pay after service completion
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
