import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabase: 'removed',
    message: 'Supabase integration has been disabled in this build.',
    timestamp: new Date().toISOString(),
  })
}
