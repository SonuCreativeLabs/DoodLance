import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1).max(100),
    role: z.enum(['CLIENT', 'FREELANCER', 'ADMIN']).optional(),
});

export const updateUserSchema = z.object({
    action: z.enum(['suspend', 'activate', 'verify', 'unverify', 'delete']),
    reason: z.string().optional(),
});

// Service validation schemas
export const createServiceSchema = z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10).max(5000),
    categoryId: z.string(),
    price: z.number().positive(),
    duration: z.number().int().positive().optional(),
    location: z.string().optional(),
    providerId: z.string(),
    images: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
});

export const updateServiceSchema = z.object({
    action: z.enum(['approve', 'reject', 'toggle_active']).optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    isActive: z.boolean().optional(),
});

// Booking validation schemas
export const updateBookingSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
    notes: z.string().optional(),
});

// Job validation schemas
export const updateJobSchema = z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
    budget: z.number().positive().optional(),
});

// Promo code validation schemas
export const createPromoSchema = z.object({
    code: z.string().min(3).max(50).regex(/^[A-Z0-9_-]+$/),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive(),
    minOrderValue: z.number().nonnegative().optional(),
    maxDiscount: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    validUntil: z.string().datetime().optional(),
    isActive: z.boolean().optional(),
});

export const updatePromoSchema = z.object({
    discountValue: z.number().positive().optional(),
    usageLimit: z.number().int().positive().optional(),
    isActive: z.boolean().optional(),
});

// Support ticket validation schemas
export const createTicketSchema = z.object({
    userId: z.string(),
    subject: z.string().min(5).max(200),
    category: z.enum(['ACCOUNT', 'PAYMENT', 'TECHNICAL', 'BOOKING', 'OTHER']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
    description: z.string().min(10).max(5000),
});

export const updateTicketSchema = z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export const addMessageSchema = z.object({
    senderId: z.string(),
    message: z.string().min(1).max(2000),
});

// Transaction validation schemas
export const updateTransactionSchema = z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
});

// Settings validation schemas
export const updateSettingsSchema = z.object({
    settings: z.record(z.union([z.string(), z.number(), z.boolean(), z.any()])),
});

// KYC verification schemas
export const updateKYCSchema = z.object({
    action: z.enum(['verify', 'reject']),
    notes: z.string().optional(),
});

// Pagination schema
export const paginationSchema = z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    search: z.string().optional(),
});

// Helper function to validate request body
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
    try {
        const validated = schema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
            };
        }
        return { success: false, error: 'Validation failed' };
    }
}
