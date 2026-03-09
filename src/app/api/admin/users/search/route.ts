import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const role = searchParams.get('role'); // 'client' or 'freelancer'

        if (!query) {
            return NextResponse.json([]);
        }

        const whereClause: any = {
            AND: [
                {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                        { phone: { contains: query, mode: 'insensitive' } },
                        { username: { contains: query, mode: 'insensitive' } },
                    ]
                },
                ...(role === 'client' ? [] : [{
                    OR: [
                        { role: role },
                        { currentRole: role },
                        ...(role === 'freelancer' ? [
                            { role: 'professional' },
                            { currentRole: 'professional' },
                            { freelancerProfile: { isNot: null } }
                        ] : [])
                    ]
                }])
            ]
        };

        const users = await prisma.user.findMany({
            where: whereClause as any,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                username: true,
                avatar: true,
                role: true,
                area: true,
                city: true,
                freelancerProfile: { select: { title: true } }
            },
            take: 50,
        });

        const mappedUsers = users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone,
            username: u.username,
            avatar: u.avatar,
            role: u.role,
            area: u.area,
            city: u.city,
            freelancerTitle: u.freelancerProfile?.title || null
        }));

        return NextResponse.json(mappedUsers);
    } catch (error) {
        console.error('Error searching users:', error);
        return NextResponse.json(
            { error: 'Failed to search users' },
            { status: 500 }
        );
    }
}
