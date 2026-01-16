import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Resolve DB User
        let dbUser = await prisma.user.findUnique({ where: { supabaseUid: user.id } })
        if (!dbUser) dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (!dbUser && user.email) dbUser = await prisma.user.findUnique({ where: { email: user.email } })

        if (!dbUser) {
            return NextResponse.json({ notifications: [] })
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId: dbUser.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 // Limit to last 20 notifications
        })

        return NextResponse.json({ notifications })
    } catch (error) {
        console.error('Error fetching notifications:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}
