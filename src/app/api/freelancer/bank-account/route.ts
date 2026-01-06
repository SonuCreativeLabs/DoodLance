import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bankAccount = await prisma.bankAccount.findUnique({
            where: { userId: user.id }
        });

        return NextResponse.json(bankAccount || null);

    } catch (error) {
        console.error('Error fetching bank account:', error);
        return NextResponse.json(
            { error: 'Failed to fetch bank account' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Validate required fields
        const requiredFields = [
            'accountHolderName', 'bankName', 'accountNumber',
            'ifscCode', 'accountType', 'city', 'state', 'upiId'
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        const bankAccount = await prisma.bankAccount.upsert({
            where: { userId: user.id },
            update: {
                accountHolderName: data.accountHolderName,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                ifscCode: data.ifscCode,
                accountType: data.accountType,
                city: data.city,
                state: data.state,
                upiId: data.upiId,
            },
            create: {
                userId: user.id,
                accountHolderName: data.accountHolderName,
                bankName: data.bankName,
                accountNumber: data.accountNumber,
                ifscCode: data.ifscCode,
                accountType: data.accountType,
                city: data.city,
                state: data.state,
                upiId: data.upiId,
            }
        });

        return NextResponse.json(bankAccount);

    } catch (error: any) {
        console.error('Error saving bank account:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save bank account' },
            { status: 500 }
        );
    }
}
