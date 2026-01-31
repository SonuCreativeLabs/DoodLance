import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, date, time } = body;

        console.log('Rescheduling booking:', { id, date, time });

        if (!id || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Parse date and time
        // date is "YYYY-MM-DD", time is "HH:mm AM/PM"
        const [year, month, day] = date.split('-').map(Number);

        let hours = 0;
        let minutes = 0;

        if (time) {
            const [timeStr, period] = time.split(' ');
            const [h, m] = timeStr.split(':').map(Number);
            hours = h;
            minutes = m;

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
        }

        const scheduledAt = new Date(year, month - 1, day, hours, minutes);

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: {
                id: id,
                // Ensure the user owns this booking
                clientId: user.id
            },
            data: {
                scheduledAt: scheduledAt,
                // Update generated fields or status if needed
                status: 'confirmed' // Reset to confirmed if it was something else? Or keep as is? Usually reschedule implies confirmed.
            }
        });

        // Notify freelancer
        // ... (Notification logic can be added here)

        return NextResponse.json({ success: true, booking: updatedBooking });

    } catch (error) {
        console.error('Failed to reschedule booking:', error);
        return NextResponse.json({ error: 'Failed to reschedule booking' }, { status: 500 });
    }
}
