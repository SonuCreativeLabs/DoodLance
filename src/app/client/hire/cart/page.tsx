"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Minus, ShoppingCart, Tag, AlertCircle, Shield, RefreshCw, CreditCard, Star, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHire } from '@/contexts/HireContext';
import { useNavbar } from '@/contexts/NavbarContext';
import AdditionalServicesCard from '@/components/hire/AdditionalServicesCard';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import LoginDialog from '@/components/auth/LoginDialog';

export default function CartPage() {
  const router = useRouter();
  const { state, getTotalPrice, increaseQuantity, decreaseQuantity, clearCart } = useHire();
  const { setNavbarVisibility } = useNavbar();
  const { requireAuth, openLoginDialog, setOpenLoginDialog, isAuthenticated } = useRequireAuth();
  const [showAdditionalServices, setShowAdditionalServices] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

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

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'dood10') {
      setAppliedCoupon('DOOD10');
      setDiscountAmount(Math.round(subtotal * 0.1));
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  };

  const handleCheckout = () => {
    // Only navigate if user is authenticated and profile is complete
    // If not, requireAuth will handle login dialog or profile redirect
    requireAuth('proceed-to-checkout', { redirectTo: '/client/hire/checkout' });

    // If we reach here, user is authenticated and profile is complete
    if (isAuthenticated) {
      router.push('/client/hire/checkout');
    }
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
              <h1 className="text-lg font-semibold text-white">Review Cart</h1>
              <p className="text-white/50 text-xs">Complete Your Booking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-32">
        {/* Freelancer Info */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
            <img
              src={state.freelancerImage || ''}
              alt={state.freelancerName || ''}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{state.freelancerName}</h3>
            {state.freelancerRating && (
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
                  {state.freelancerRating.toFixed(1)} ({state.freelancerReviewCount || 0} reviews)
                </span>
              </div>
            )}

            {/* Booking Details */}
            <div className="mt-3 space-y-1">
              {state.selectedDate && (
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>{(() => {
                    const [year, month, day] = state.selectedDate!.split('-').map(Number);
                    const date = new Date(year, month - 1, day); // month is 0-indexed
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

              {/* Location would need to be stored in context or passed as prop */}
              <div className="flex items-center gap-2 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>{state.selectedLocation || 'Ground Location'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cart Items - Same format as booking date page */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart className="w-5 h-5 text-purple-400" />
            <h4 className="text-white font-bold">Added Services</h4>
            <span className="text-white/40 text-sm font-medium">({state.cartItems.length})</span>
          </div>

          <div className="space-y-2">
            {state.cartItems.map((item, index) => (
              <div key={`${item.service.id}-${index}`}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-white text-sm truncate">{item.service.title}</h5>
                    <div className="text-sm font-semibold text-white/80 mt-0.5">
                      ₹{typeof item.service.price === 'string'
                        ? parseFloat(item.service.price.replace(/[^\d.]/g, ''))
                        : item.service.price} / {item.service.deliveryTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => decreaseQuantity(item.service.id)}
                      className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white font-medium min-w-[16px] text-center text-sm">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => increaseQuantity(item.service.id)}
                      className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {index < state.cartItems.length - 1 && (
                  <div className="border-b border-white/10"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services Card */}
        <AdditionalServicesCard
          freelancerId={state.freelancerId || ''}
          freelancerServices={state.freelancerServices}
        />

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
              className="flex-1 px-3 py-2 bg-[#1E1E1E] border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
            />
            <Button
              onClick={handleApplyCoupon}
              variant="outline"
              className="px-6 py-2 border-white/20 text-white/70 hover:bg-white/10"
            >
              Apply
            </Button>
          </div>

          {appliedCoupon && (
            <div className="mt-2 text-sm text-green-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Coupon {appliedCoupon} applied! You saved ₹{discountAmount}
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
              <span className="text-white/70">Platform Fee</span>
              <span className="text-white">₹{serviceFee.toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Discount ({appliedCoupon})</span>
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
              <p>• Free cancellation up to 24 hours before booking</p>
              <p>• 50% refund for cancellation 12-24 hours before</p>
              <p>• No refund for cancellation within 12 hours</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-medium">Reschedule Policy</h4>
            </div>
            <div className="text-sm text-white/70 space-y-1">
              <p>• Free reschedule up to 12 hours before booking</p>
              <p>• ₹99 fee for reschedule within 12 hours</p>
              <p>• Reschedule only allowed once per booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-white/10">
        <Button
          onClick={handleCheckout}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Proceed to Payment ₹{total.toLocaleString()}
        </Button>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        open={openLoginDialog}
        onOpenChange={setOpenLoginDialog}
        onSuccess={() => router.push('/client/hire/checkout')}
      />
    </div>
  );
}
