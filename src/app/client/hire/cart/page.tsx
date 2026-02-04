"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus, ShoppingCart, Tag, AlertCircle, Shield, RefreshCw, CreditCard, Star, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';
import AdditionalServicesCard from '@/components/hire/AdditionalServicesCard';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const router = useRouter();
  const { state, getTotalPrice, increaseQuantity, decreaseQuantity, clearCart, isLoaded, setAppliedCoupon } = useHire();
  const { setNavbarVisibility } = useNavbar();
  const { user } = useAuth();
  const [showAdditionalServices, setShowAdditionalServices] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  console.log('🔍 [CART] Component render:', {
    isLoaded,
    hasUser: !!user,
    userId: user?.id,
    cartItemsCount: state.cartItems.length
  });

  // Hide navbar when component mounts - MUST be before early return
  useEffect(() => {
    setNavbarVisibility(false);

    // Show navbar when component unmounts
    return () => {
      setNavbarVisibility(true);
    };
  }, [setNavbarVisibility]);

  const subtotal = state.cartItems.reduce((total, item) => {
    const rawPrice = item.service.price;
    const price = typeof rawPrice === 'string'
      ? parseFloat(rawPrice.replace(/[^\d.]/g, '')) || 0
      : Number(rawPrice) || 0;
    return total + (price * (item.quantity || 1));
  }, 0);
  const serviceFee = Math.round(subtotal * 0.05); // 5% platform fee

  // Recalculate discount based on applied coupon in state
  useEffect(() => {
    if (state.appliedCoupon) {
      // In a real app we'd need to store the discount value/type in context too
      // For now, re-validating or assuming the demo coupon logic
      // Ideally context should hold the discount structure, but let's stick to simple string for now
      // and re-verify or just calculate simple 10% for the known demo code
      if (state.appliedCoupon === 'DOOD10') {
        setDiscountAmount(Math.round(subtotal * 0.1));
        setCouponCode(state.appliedCoupon);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [state.appliedCoupon, subtotal]);

  const discount = discountAmount || 0;
  const total = Math.max(0, (subtotal || 0) + (serviceFee || 0) - discount);

  // Wait for hydration - early return AFTER all hooks
  if (!isLoaded) {
    return (
      <div className="h-screen bg-[#0F0F0F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderAmount: subtotal }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Invalid coupon');
        setAppliedCoupon(null);
        setDiscountAmount(0);
      } else {
        setAppliedCoupon(data.promo.code);
        setDiscountAmount(data.promo.calculatedDiscount);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      // Could show a toast or message
      return;
    }
    setIsNavigating(true);
    router.push('/client/hire/checkout');
  };

  const handleViewCart = () => {
    // This could scroll to cart section or just ensure cart is visible
    // For now, it's just a placeholder
  };

  if (state.cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-white">Cart</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white/40" />
            </div>
            <h3 className="text-lg font-medium text-white/90 mb-2">Your cart is empty</h3>
            <p className="text-white/60 text-sm mb-6">Add some services to get started</p>
            <Button
              onClick={() => router.push('/client/nearby/hirefeed')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Browse Services
            </Button>
          </div>
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
              <h1 className="text-lg font-semibold text-white">Review Cart</h1>
              <p className="text-white/50 text-xs">Complete Your Booking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32 max-w-3xl mx-auto">
        {/* Unified Booking Card */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          {/* Freelancer Header Section */}
          <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-[#1b1b1b]">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
              <img
                src={state.freelancerImage || ''}
                alt={state.freelancerName || ''}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-white">{state.freelancerName}</h3>
              {(state.freelancerRating || 0) > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(state.freelancerRating!)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-white/20'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-white/70 ml-1">
                    {(state.freelancerRating || 0).toFixed(1)} ({state.freelancerReviewCount || 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Context Info (Date/Time/Loc) - Optional to keep in header or body 
              Let's put it in body top padding */}
          <div className="px-4 py-3 bg-[#1E1E1E]/50 border-b border-white/5 flex flex-wrap gap-4">
            {state.selectedDate && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>{(() => {
                  const [year, month, day] = state.selectedDate!.split('-').map(Number);
                  const date = new Date(year, month - 1, day);
                  return date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                })()}</span>
              </div>
            )}

            {state.selectedTime && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{state.selectedTime}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>{state.selectedLocation || 'Ground Location'}</span>
            </div>
          </div>

          {/* Services List Section */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 text-purple-400" />
              <h4 className="text-white/90 font-semibold text-sm">Selected Services</h4>
            </div>

            <div className="space-y-3">
              {state.cartItems.map((item, index) => (
                <div key={`${item.service.id}-${index}`} className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                  <div className="p-3 flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-1 text-sm">{item.service.title}</h5>
                      <div className="text-purple-400 font-bold text-sm">
                        ₹{typeof item.service.price === 'string'
                          ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
                          : item.service.price} / {item.service.deliveryTime}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                      <button
                        onClick={() => decreaseQuantity(item.service.id)}
                        className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-white" />
                      </button>

                      <span className="text-white font-medium w-4 text-center text-sm">
                        {item.quantity || 1}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.service.id)}
                        className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Coupon Section */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Tag className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-medium">Coupon Code</h4>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 bg-[#1E1E1E] border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
            <Button
              onClick={handleApplyCoupon}
              variant="outline"
              className="px-6 py-2 border-white/20 text-white/70 hover:bg-white/10"
              disabled={validatingCoupon}
            >
              {validatingCoupon ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>

          {state.appliedCoupon && (
            <div className="mt-2 text-sm text-green-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Coupon {state.appliedCoupon} applied! You saved ₹{discountAmount}
            </div>
          )}

          {couponError && (
            <div className="mt-2 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {couponError}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h4 className="text-white font-medium mb-3">Price Details</h4>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Subtotal</span>
              <span className="text-white">₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-white/70">Platform Fee (5%)</span>
              <span className="text-white">₹{serviceFee.toLocaleString()}</span>
            </div>

            {state.appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Discount ({state.appliedCoupon})</span>
                <span className="text-green-400">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="border-t border-white/10 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total Amount</span>
                <span className="text-white text-lg">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-medium">Cancellation Policy</h4>
            </div>
            <div className="text-sm text-white/70 space-y-1">
              <p>• Free cancellation up to 24 hours before the session.</p>
              <p>• 50% refund for cancellations made 12-24 hours before the session.</p>
              <p>• No refund for cancellations made within 12 hours of the session.</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-medium">Reschedule Policy</h4>
            </div>
            <div className="text-sm text-white/70 space-y-1">
              <p>• Free rescheduling up to 12 hours before the session.</p>
              <p>• ₹99 fee for rescheduling within 12 hours of the session.</p>
              <p>• Rescheduling is allowed only once per session.</p>
            </div>
          </div>
        </div>
      </div>



      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={handleCheckout}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Proceed to Payment ₹{total.toLocaleString()}
              </>
            )}
          </Button>
        </div>
      </div>


    </div >
  );
}
