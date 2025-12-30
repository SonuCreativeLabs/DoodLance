import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/wallet - Get user's wallet details and transactions
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // If userId provided via query param (for testing/admin), use it
        // Otherwise try to get from session (though in this context we might rely on client passing it or auth header)
        // For simplicity in this dev phase, we'll check for userId param or try session logic if needed later.
        // Ideally we should use the session user.

        // For now, let's look for userId in query or header
        let targetUserId = userId;

        if (!targetUserId) {
            // Fallback: try to fetch session (if we had a helper, but we'll rely on client passing userId for now 
            // as seen in other parts of the app or simply require it)
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Find or create wallet for the user
        let wallet = await prisma.wallet.findUnique({
            where: { userId: targetUserId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 20 // Limit to last 20 transactions
                }
            }
        });

        if (!wallet) {
            // Create wallet if it doesn't exist
            wallet = await prisma.wallet.create({
                data: {
                    userId: targetUserId,
                    balance: 0,
                    coins: 0,
                    frozenAmount: 0,
                },
                include: {
                    transactions: true
                }
            });
        }

        return NextResponse.json(wallet);
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return NextResponse.json(
            { error: 'Failed to fetch wallet details' },
            { status: 500 }
        );
    }
}

// POST /api/wallet - Perform wallet actions (add funds, withdraw)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, action, amount, description, type } = body;

        if (!userId || !action || !amount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const amountFloat = parseFloat(amount);
        if (isNaN(amountFloat) || amountFloat <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Check if wallet exists
        let wallet = await prisma.wallet.findUnique({
            where: { userId }
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId, balance: 0, coins: 0 }
            });
        }

        let updatedWallet;

        if (action === 'add') {
            // Add funds logic
            updatedWallet = await prisma.$transaction(async (tx: any) => {
                // 1. Create Transaction
                await tx.transaction.create({
                    data: {
                        walletId: wallet!.id,
                        amount: amountFloat,
                        type: 'CREDIT', // Or specific type like 'DEPOSIT' if schema supported, mapped to CREDIT
                        description: description || 'Added funds to wallet',
                        status: 'COMPLETED',
                        paymentMethod: 'mock_gateway'
                    }
                });

                // 2. Update Wallet Balance
                return await tx.wallet.update({
                    where: { id: wallet!.id },
                    data: {
                        balance: { increment: amountFloat }
                    },
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        }
                    }
                });
            });

        } else if (action === 'withdraw') {
            // Withdrawal logic
            if (wallet.balance < amountFloat) {
                return NextResponse.json(
                    { error: 'Insufficient balance' },
                    { status: 400 }
                );
            }

            updatedWallet = await prisma.$transaction(async (tx: any) => {
                // 1. Create Transaction
                await tx.transaction.create({
                    data: {
                        walletId: wallet!.id,
                        amount: amountFloat,
                        type: 'WITHDRAWAL', // Mapped to DEBIT effectively but specific type
                        description: description || 'Withdrawal to bank account',
                        status: 'COMPLETED', // In real app, might be PENDING
                        paymentMethod: 'bank_transfer'
                    }
                });

                // 2. Update Wallet Balance
                return await tx.wallet.update({
                    where: { id: wallet!.id },
                    data: {
                        balance: { decrement: amountFloat }
                    },
                    include: {
                        transactions: {
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        }
                    }
                });
            });
        } else {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }

        return NextResponse.json(updatedWallet);
    } catch (error) {
        console.error('Error processing wallet transaction:', error);
        return NextResponse.json(
            { error: 'Failed to process transaction' },
            { status: 500 }
        );
    }
}
