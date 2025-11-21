"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Tag, Shield, RefreshCw, AlertCircle, ChevronDown, ChevronUp, Smartphone, Wallet, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getTotalPrice } = useHire();
  const { setNavbarVisibility } = useNavbar();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Hide navbar when component mounts
  useEffect(() => {
    setNavbarVisibility(false);

    // Show navbar when component unmounts
    return () => {
      setNavbarVisibility(true);
    };
  }, [setNavbarVisibility]);

  const subtotal = state.cartItems.reduce((total, item) => {
    const price = typeof item.service.price === 'string'
      ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
      : item.service.price;
    return total + (price * (item.quantity || 1));
  }, 0);
  const serviceFee = 10; // Fixed service fee of ₹10
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0; // 10% discount for demo
  const total = subtotal + serviceFee - discount;

  const handlePayment = () => {
    // In a real app, this would integrate with a payment gateway
    alert('Payment processing would happen here!');
    // After successful payment, redirect to booking confirmation
    router.push('/client/bookings');
  };

  if (state.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-white/90 mb-2">No items to checkout</h3>
          <Button
            onClick={() => router.push('/client/nearby/integrated-explore')}
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
                  <span className="text-white/70">Platform Fee</span>
                  <span className="text-white">₹{serviceFee.toLocaleString()}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Discount ({appliedCoupon})</span>
                    <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-8">
          <h3 className="text-white font-semibold text-lg">Choose Payment Method</h3>

          {/* Cash on Delivery - Top Priority */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-white/60" />
              <div>
                <h4 className="text-white font-semibold">Cash on Delivery</h4>
                <p className="text-white/60 text-sm">Pay when service is completed</p>
              </div>
            </div>
            <button className="w-full py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-200 flex items-center justify-center gap-3">
              <Truck className="w-5 h-5" />
              Pay ₹{total.toLocaleString()} on Delivery
            </button>
            <div className="text-xs text-white/40 text-center">
              No advance payment • Additional ₹50 fee may apply
            </div>
          </div>

          {/* UPI Payment */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-white/60" />
              <div>
                <h4 className="text-white font-semibold">UPI Payment</h4>
                <p className="text-white/60 text-sm">Instant payment via UPI apps</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200">
                Google Pay
              </button>
              <button className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200">
                PhonePe
              </button>
              <button className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200">
                Paytm
              </button>
              <button className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-all duration-200">
                Other UPI
              </button>
            </div>
          </div>

          {/* Card Payment */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-white/60" />
              <div>
                <h4 className="text-white font-semibold">Card Payment</h4>
                <p className="text-white/60 text-sm">Credit & Debit cards</p>
              </div>
            </div>
            <button className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 flex items-center justify-center gap-3">
              <CreditCard className="w-5 h-5" />
              Pay with Card
            </button>
          </div>

          {/* Wallets - Simplified */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-white/60" />
              <div>
                <h4 className="text-white font-semibold">Digital Wallets</h4>
                <p className="text-white/60 text-sm">Paytm, Mobikwik & more</p>
              </div>
            </div>
            <button className="w-full py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 flex items-center justify-center gap-3">
              <Wallet className="w-5 h-5" />
              Pay with Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
