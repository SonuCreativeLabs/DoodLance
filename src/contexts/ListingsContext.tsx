'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Availability {
    id: string;
    title: string;
    fromDate: Date;
    toDate: Date;
    totalDays: number;
    isActive: boolean;
    gigs: number;
    hours: number;
    pausedCount: number;
}

interface ListingsContextType {
    listings: Availability[];
    updateListings: (listings: Availability[]) => void;
    getActiveListings: () => Availability[];
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined);

export function ListingsProvider({ children }: { children: ReactNode }) {
    const [listings, setListings] = useState<Availability[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount and fetch from API
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const saved = localStorage.getItem('availabilityListings');
                if (saved) {
                    const parsedListings = JSON.parse(saved);
                    // Convert date strings back to Date objects
                    const listingsWithDates = parsedListings.map((listing: any) => ({
                        ...listing,
                        fromDate: new Date(listing.fromDate),
                        toDate: new Date(listing.toDate)
                    }));
                    setListings(listingsWithDates);
                }

                // Fetch from API
                const response = await fetch('/api/freelancer/listings');
                if (response.ok) {
                    const { listings: dbListings } = await response.json();

                    if (Array.isArray(dbListings) && dbListings.length > 0) {
                        // Convert date strings to Date objects
                        const listingsWithDates = dbListings.map((listing: any) => ({
                            ...listing,
                            fromDate: new Date(listing.fromDate),
                            toDate: new Date(listing.toDate)
                        }));
                        setListings(listingsWithDates);
                        localStorage.setItem('availabilityListings', JSON.stringify(listingsWithDates));
                    }
                }
            } catch (error) {
                console.error('Failed to load listings:', error);
            } finally {
                setIsHydrated(true);
            }
        };

        fetchListings();
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        if (!isHydrated) return;
        localStorage.setItem('availabilityListings', JSON.stringify(listings));
    }, [listings, isHydrated]);

    const updateListings = useCallback(async (newListings: Availability[]) => {
        setListings(newListings);

        // Persist via API
        try {
            const response = await fetch('/api/freelancer/listings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listings: newListings })
            });

            if (response.ok) {
                console.log('💾 Saved', newListings.length, 'availability listings to database');
            } else {
                console.error('❌ Failed to save listings:', await response.text());
            }
        } catch (error) {
            console.error('Failed to save listings to database:', error);
        }
    }, []);

    const getActiveListings = useCallback(() => {
        return listings.filter(listing => listing.isActive);
    }, [listings]);

    const value: ListingsContextType = {
        listings,
        updateListings,
        getActiveListings,
    };

    return (
        <ListingsContext.Provider value={value}>
            {children}
        </ListingsContext.Provider>
    );
}

export function useListings() {
    const context = useContext(ListingsContext);
    if (context === undefined) {
        throw new Error('useListings must be used within a ListingsProvider');
    }
    return context;
}
