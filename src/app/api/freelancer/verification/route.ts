import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { documentUrl, idType, idNumber, selfieUrl } = body;

        if (!documentUrl || !idType || !idNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get profile
        const profile = await prisma.freelancerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        // Create verification docs object
        const verificationDocs = {
            idType,
            idNumber,
            documentUrl,
            selfieUrl,
            submittedAt: new Date().toISOString()
        };

        // Update profile
        await prisma.freelancerProfile.update({
            where: { id: profile.id },
            data: {
                verificationDocs: JSON.stringify(verificationDocs),
                isVerified: false, // Pending verification
                // You might want to add a 'verificationStatus' field if 'isVerified' is only boolean
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Verification submission error:', error);
        return NextResponse.json({ error: 'Failed to submit verification' }, { status: 500 });
    }
}
