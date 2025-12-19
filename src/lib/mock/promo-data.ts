// Mock promo code data for admin panel

export const mockPromoCodes = [
  {
    id: 'PROMO001',
    code: 'NEWUSER20',
    description: '20% off for new users on their first booking',
    type: 'percentage',
    value: 20,
    minAmount: 500,
    maxDiscount: 1000,
    usageLimit: 100,
    usageCount: 45,
    userLimit: 1,
    validFrom: '2024-03-01',
    validTo: '2024-03-31',
    isActive: true,
    applicableTo: 'all',
    createdBy: 'Admin',
    createdAt: '2024-02-28',
    stats: {
      totalRevenue: 125000,
      averageOrderValue: 2778,
      conversionRate: 45
    }
  },
  {
    id: 'PROMO002',
    code: 'CRICKET50',
    description: 'Flat ₹50 off on all cricket coaching services',
    type: 'fixed',
    value: 50,
    minAmount: 300,
    maxDiscount: 50,
    usageLimit: 200,
    usageCount: 167,
    userLimit: 3,
    validFrom: '2024-03-15',
    validTo: '2024-04-15',
    isActive: true,
    applicableTo: 'category',
    categories: ['Coach', 'Sports Conditioning Trainer'],
    createdBy: 'Marketing Team',
    createdAt: '2024-03-14',
    stats: {
      totalRevenue: 89500,
      averageOrderValue: 536,
      conversionRate: 84
    }
  },
  {
    id: 'PROMO003',
    code: 'PREMIUM10',
    description: '10% off on premium service packages',
    type: 'percentage',
    value: 10,
    minAmount: 2000,
    maxDiscount: 500,
    usageLimit: 50,
    usageCount: 12,
    userLimit: 2,
    validFrom: '2024-03-20',
    validTo: '2024-03-25',
    isActive: false,
    applicableTo: 'service',
    services: ['SRV001', 'SRV002'],
    createdBy: 'Admin',
    createdAt: '2024-03-19',
    stats: {
      totalRevenue: 45600,
      averageOrderValue: 3800,
      conversionRate: 24
    }
  },
  {
    id: 'PROMO004',
    code: 'REFERRAL15',
    description: '15% off for users referred by existing customers',
    type: 'percentage',
    value: 15,
    minAmount: 1000,
    maxDiscount: 750,
    usageLimit: null,
    usageCount: 234,
    userLimit: 1,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    isActive: true,
    applicableTo: 'all',
    createdBy: 'Growth Team',
    createdAt: '2023-12-28',
    stats: {
      totalRevenue: 567800,
      averageOrderValue: 2426,
      conversionRate: 78
    }
  },
  {
    id: 'PROMO005',
    code: 'WEEKEND25',
    description: '25% off on weekend bookings',
    type: 'percentage',
    value: 25,
    minAmount: 800,
    maxDiscount: 1500,
    usageLimit: 75,
    usageCount: 23,
    userLimit: 2,
    validFrom: '2024-03-22',
    validTo: '2024-03-24',
    isActive: true,
    applicableTo: 'all',
    createdBy: 'Admin',
    createdAt: '2024-03-21',
    stats: {
      totalRevenue: 67890,
      averageOrderValue: 2951,
      conversionRate: 31
    }
  }
];
