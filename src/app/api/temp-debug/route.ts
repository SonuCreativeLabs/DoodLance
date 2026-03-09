import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const names = ['Sample Bails', 'sathishraj s', 'sonuofficials07'];
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: 'Sample Bails', mode: 'insensitive' } },
                    { name: { contains: 'sathishraj', mode: 'insensitive' } },
                    { name: { contains: 'sonuofficials', mode: 'insensitive' } },
                    { username: { contains: 'Sample Bails', mode: 'insensitive' } },
                    { username: { contains: 'sathishraj', mode: 'insensitive' } },
                    { username: { contains: 'sonuofficials', mode: 'insensitive' } },
                    { email: { contains: 'sonuofficials', mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                bookings: {
                    select: { id: true }
                }
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
