"use client";

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Tag, Shield, AlertCircle, ChevronDown, ChevronUp, Smartphone, Wallet, Truck, CheckCircle, Loader2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';
import { useBookings } from '@/contexts/BookingsContext';
import { useAuth } from '@/contexts/AuthContext';
import LoginDialog from '@/components/auth/LoginDialog';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { state, getTotalPrice, clearCart, resetHireState } = useHire();
  const { addBooking } = useBookings();
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();

  const [discountAmount, setDiscountAmount] = useState(0);

  // Hide navbar on mount
  useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newBookingId, setNewBookingId] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const [commissionRate, setCommissionRate] = useState(0.05); // Default 5%
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // Fetch public config
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/public-config');
        if (res.ok) {
          const config = await res.json();
          if (config.clientCommission) {
            setCommissionRate(Number(config.clientCommission) / 100);
          }
          if (config.currency) {
            setCurrency(config.currency as string);
          }
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };
    fetchConfig();
  }, []);

  const subtotal = state.cartItems.reduce((total, item) => {
    const price = typeof item.service.price === 'string'
      ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
      : item.service.price;
    return total + (price * (item.quantity || 1));
  }, 0);
  const serviceFee = Math.round(subtotal * commissionRate); // Dynamic platform fee

  // Validate coupon from context and set discount
  useEffect(() => {
    const validateContextCoupon = async () => {
      // Logic for known demo code
      if (state.appliedCoupon === 'DOOD10') {
        setDiscountAmount(Math.round(subtotal * 0.1));
        return;
      }

      // For any other code, validate with API
      if (state.appliedCoupon) {
        try {
          const res = await fetch('/api/promos/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: state.appliedCoupon,
              orderAmount: subtotal,
              userId: user?.id
            })
          });
          const data = await res.json();
          if (res.ok && data.valid) {
            setDiscountAmount(data.promo.calculatedDiscount);
          } else {
            setDiscountAmount(0); // Invalid or expired
          }
        } catch (e) {
          console.error("Failed to re-validate coupon", e);
          setDiscountAmount(0);
        }
      } else {
        setDiscountAmount(0);
      }
    };

    validateContextCoupon();
  }, [state.appliedCoupon, subtotal, user?.id]);

  const total = Math.max(0, subtotal + serviceFee - discountAmount);

  const [transactionId, setTransactionId] = useState('');

  const handleUPIBooking = async () => {
    if (!transactionId || transactionId.length < 5) {
      alert("Please enter a valid Transaction ID");
      return;
    }

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
        const bookingTime = state.selectedTime || '10:00 AM';

        // Construct scheduledAt ISO string
        let scheduledAt = new Date().toISOString();
        try {
          // Combine date and time
          // Note: bookingDate is YYYY-MM-DD, bookingTime is HH:mm AM/PM or HH:mm
          // We construct a string that the Date constructor parses in local time
          const dateTimeStr = `${bookingDate} ${bookingTime}`;
          const dateObj = new Date(dateTimeStr);

          if (!isNaN(dateObj.getTime())) {
            // Forcing the backend to respect this as the absolute time point
            // toISOString() converts to UTC, which is correct for storage
            scheduledAt = dateObj.toISOString();
          }
        } catch (e) {
          console.error("Date parsing error", e);
        }

        const bookingId = await addBooking({
          service: serviceNames,
          provider: state.freelancerName || 'Freelancer',
          image: state.freelancerImage || '',
          date: bookingDate,
          time: bookingTime,
          scheduledAt: scheduledAt, // Add this field for the backend
          status: 'confirmed',
          location: state.selectedLocation || 'Location TBD',
          price: `₹${total.toLocaleString()}`,
          rating: state.freelancerRating || 4.5,
          completedJobs: state.freelancerReviewCount || 50,
          description: `Booking for ${serviceNames}`,
          category: 'cricket',
          paymentMethod: 'upi',

          transactionId: transactionId,
          paymentStatus: 'PENDING',
          notes: state.bookingNotes || '', // Client notes only
          otp: otp,
          services: state.cartItems.map(item => ({
            id: item.service.id,
            title: item.service.title,
            price: item.service.price,
            quantity: item.quantity || 1,
            duration: item.duration || (item.service as any).duration,
            deliveryTime: item.service.deliveryTime
          })),
          couponCode: state.appliedCoupon || undefined, // Pass the coupon code for backend processing
        });

        setNewBookingId(bookingId);
        setGeneratedOtp(otp);
        setBookingSuccess(true);

        // 🔄 Invalidate React Query cache to force refetch on Bookings page
        queryClient.invalidateQueries({ queryKey: ['bookings'] });

        // Clear cart and hire state
        clearCart();
        resetHireState();

        // Redirect to bookings after showing success
        setTimeout(() => {
          router.push('/client/bookings');
        }, 3500);

      } catch (error: any) {
        console.error("Booking creation failed:", error);

        // Handle Session Expiry / Unauthorized
        if (error.message?.includes('Unauthorized') || error.toString().includes('Unauthorized')) {
          setShowLoginDialog(true);
          return;
        }

        alert("Booking failed. Please try again.");
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

          <p className="text-white/40 text-sm mb-4">Payment: Manual UPI Verification</p>
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
        <div className="container mx-auto px-4 py-3 max-w-3xl">
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

      <div className="p-6 space-y-6 pb-8 max-w-3xl mx-auto">
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
                {state.appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount ({state.appliedCoupon})</span>
                    <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          <h3 className="text-white font-semibold text-lg">Payment Method</h3>

          {/* Manual UPI Payment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="text-white font-semibold">Manual UPI Payment</h4>
                <p className="text-white/60 text-sm">Scan QR or use UPI ID to pay</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              {/* QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-2 rounded-lg mb-3">
                  <div className="relative w-48 h-48">
                    <img
                      src="/images/GPAY QR.jpeg"
                      alt="Payment QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-white/50 text-xs text-center">Scan with any UPI App (GPay, PhonePe, Paytm)</p>
              </div>

              {/* UPI ID Copy */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-white/60">UPI ID</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm">
                    sathishsonu07@okaxis
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 bg-white/5 border-white/10 hover:bg-white/10 text-white"
                    onClick={() => {
                      navigator.clipboard.writeText('sathishsonu07@okaxis');
                    }}
                  >
                    <Copy className="w-4 h-4" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>
              </div>

              {/* Transaction ID Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  UPI Transaction ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter Transaction ID (e.g. T230...)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-xs text-white/40">
                  Required for payment verification.
                </p>
              </div>
            </div>

            <button
              onClick={handleUPIBooking}
              disabled={isProcessing || !transactionId}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold text-lg shadow-lg shadow-purple-900/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Payment • ₹{total.toLocaleString()}
                </>
              )}
            </button>
            <div className="text-xs text-white/40 text-center">
              Your booking will be confirmed after payment verification.
            </div>
          </div>

        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
      />
    </div >
  );
}
