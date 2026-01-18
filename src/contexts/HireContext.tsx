"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string | number;
  deliveryTime: string;
  features?: string[];
  category?: string;
}

export interface CartItem {
  service: ServiceItem;
  date: string | undefined;
  time: string | undefined;
  duration: number | undefined;
  quantity: number;
}

export interface SelectedServiceItem extends ServiceItem {
  quantity: number;
}

export interface HireState {
  freelancerId: string | null;
  freelancerName: string | null;
  freelancerImage: string | null;
  freelancerRating: number | null;
  freelancerReviewCount: number | null;
  freelancerServices: ServiceItem[];
  selectedServices: SelectedServiceItem[];
  cartItems: CartItem[];
  selectedDate: string | undefined;
  selectedTime: string | undefined;
  selectedDuration: number | undefined;
  selectedLocation: string | undefined;
  bookingNotes: string | undefined;
  appliedCoupon: string | null;
}

interface HireContextType {
  state: HireState;
  setFreelancer: (id: string, name: string, image: string, rating?: number | null, reviewCount?: number | null, services?: ServiceItem[]) => void;
  addService: (service: ServiceItem) => void;
  setSelectedService: (service: ServiceItem) => void;
  removeService: (serviceId: string) => void;
  increaseSelectedServiceQuantity: (serviceId: string) => void;
  decreaseSelectedServiceQuantity: (serviceId: string) => void;
  setBookingDetails: (date: string, time: string, duration: number, location: string, notes?: string) => void;
  setBookingNotes: (notes: string) => void;
  setAppliedCoupon: (coupon: string | null) => void;
  addToCart: (service: ServiceItem, date?: string, time?: string, duration?: number) => void;
  removeFromCart: (serviceId: string) => void;
  increaseQuantity: (serviceId: string) => void;
  decreaseQuantity: (serviceId: string) => void;
  clearCart: () => void;
  resetHireState: () => void;
  getTotalPrice: () => number;
  isLoaded: boolean;
}

const initialState: HireState = {
  freelancerId: null,
  freelancerName: null,
  freelancerImage: null,
  freelancerRating: null,
  freelancerReviewCount: null,
  freelancerServices: [],
  selectedServices: [],
  cartItems: [],
  selectedDate: undefined,
  selectedTime: undefined,
  selectedDuration: undefined,
  selectedLocation: undefined,
  bookingNotes: undefined,
  appliedCoupon: null,
};

const HireContext = createContext<HireContextType | undefined>(undefined);

export function HireProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HireState>(initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('bails_hire_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Sanitization Layer: Ensure deeply nested fields are safe
        // This fixes legacy corrupted data (where price might be an object)
        if (parsedState.freelancerName && typeof parsedState.freelancerName === 'object') {
          parsedState.freelancerName = String(parsedState.freelancerName);
        }
        if (parsedState.freelancerImage && typeof parsedState.freelancerImage === 'object') {
          parsedState.freelancerImage = String(parsedState.freelancerImage);
        }

        // Sanitize selectedServices
        if (Array.isArray(parsedState.selectedServices)) {
          parsedState.selectedServices = parsedState.selectedServices.map((s: any) => ({
            ...s,
            price: typeof s.price === 'object' ? String(s.price) : s.price,
            title: typeof s.title === 'object' ? String(s.title) : s.title,
            deliveryTime: typeof s.deliveryTime === 'object' ? String(s.deliveryTime) : s.deliveryTime
          }));
        }

        // Sanitize Cart Items
        if (Array.isArray(parsedState.cartItems)) {
          parsedState.cartItems = parsedState.cartItems.map((item: any) => ({
            ...item,
            service: {
              ...item.service,
              price: typeof item.service?.price === 'object' ? String(item.service.price) : item.service?.price,
              title: typeof item.service?.title === 'object' ? String(item.service.title) : item.service?.title
            }
          }));
        }

        // Ensure all required fields exist (merge with initial state for safety)
        setState({ ...initialState, ...parsedState });
      } catch (error) {
        console.error('Failed to parse hire state from localStorage', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('bails_hire_state', JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const setFreelancer = useCallback((id: string, name: string, image: string, rating: number | null = null, reviewCount: number | null = null, services: ServiceItem[] = []) => {
    setState(prev => ({
      ...prev,
      freelancerId: id,
      freelancerName: name,
      freelancerImage: image,
      freelancerRating: rating,
      freelancerReviewCount: reviewCount,
      freelancerServices: services,
    }));
  }, []);

  const addService = useCallback((service: ServiceItem) => {
    setState(prev => ({
      ...prev,
      selectedServices: [...prev.selectedServices, { ...service, quantity: 1 }],
    }));
  }, []);

  const setSelectedService = useCallback((service: ServiceItem) => {
    setState(prev => ({
      ...prev,
      selectedServices: [{ ...service, quantity: 1 }],
    }));
  }, []);

  const increaseSelectedServiceQuantity = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(service =>
        service.id === serviceId
          ? { ...service, quantity: service.quantity + 1 }
          : service
      ),
    }));
  }, []);

  const decreaseSelectedServiceQuantity = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.map(service =>
        service.id === serviceId
          ? { ...service, quantity: Math.max(1, service.quantity - 1) }
          : service
      ).filter(service => service.quantity > 0),
    }));
  }, []);

  const removeService = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(s => s.id !== serviceId),
    }));
  }, []);

  const setBookingDetails = useCallback((date: string, time: string, duration: number, location: string, notes?: string) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: time,
      selectedDuration: duration,
      selectedLocation: location,
      bookingNotes: notes || prev.bookingNotes,
    }));
  }, []);

  const setBookingNotes = useCallback((notes: string) => {
    setState(prev => ({
      ...prev,
      bookingNotes: notes,
    }));
  }, []);

  const setAppliedCoupon = useCallback((coupon: string | null) => {
    setState(prev => ({
      ...prev,
      appliedCoupon: coupon,
    }));
  }, []);

  const addToCart = useCallback((service: ServiceItem, date?: string, time?: string, duration?: number) => {
    setState(prev => {
      // Find the selected service to get its quantity
      const selectedService = prev.selectedServices.find(s => s.id === service.id);
      const quantity = selectedService?.quantity || 1;

      const cartItem: CartItem = {
        service,
        date: date || prev.selectedDate || undefined,
        time: time || prev.selectedTime || undefined,
        duration: duration || prev.selectedDuration || undefined,
        quantity,
      };

      return {
        ...prev,
        cartItems: [...prev.cartItems, cartItem],
      };
    });
  }, []);

  const removeFromCart = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      cartItems: prev.cartItems.filter(item => item.service.id !== serviceId),
    }));
  }, []);

  const increaseQuantity = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      cartItems: prev.cartItems.map(item =>
        item.service.id === serviceId
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ),
    }));
  }, []);

  const decreaseQuantity = useCallback((serviceId: string) => {
    setState(prev => ({
      ...prev,
      cartItems: prev.cartItems.map(item =>
        item.service.id === serviceId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      ).filter(item => item.quantity !== 0),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({
      ...prev,
      cartItems: [],
    }));
  }, []);

  const resetHireState = useCallback(() => {
    setState(initialState);
  }, []);

  const getTotalPrice = useCallback(() => {
    return state.selectedServices.reduce((total, service) => {
      const price = typeof service.price === 'string'
        ? parseFloat(service.price.replace(/[^\d.]/g, ''))
        : service.price;
      return total + (price * service.quantity);
    }, 0);
  }, [state.selectedServices]);

  const value: HireContextType = {
    state,
    setFreelancer,
    addService,
    setSelectedService,
    removeService,
    increaseSelectedServiceQuantity,
    decreaseSelectedServiceQuantity,
    setBookingDetails,
    setBookingNotes,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    resetHireState,
    getTotalPrice,
    setAppliedCoupon,
    isLoaded: isInitialized,
  };

  return (
    <HireContext.Provider value={value}>
      {children}
    </HireContext.Provider>
  );
}

export function useHire() {
  const context = useContext(HireContext);
  if (context === undefined) {
    throw new Error('useHire must be used within a HireProvider');
  }
  return context;
}
