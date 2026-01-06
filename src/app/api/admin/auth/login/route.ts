import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Use service role client for admin operations
// During build, use a mock client if env vars are not available
const supabase = (supabaseUrl && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export async function POST(req: NextRequest) {
  try {
    // Return error if Supabase is not configured (during build)
    if (!supabase) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { email, password } = await req.json();

    console.log('=== ADMIN LOGIN DEBUG ===');
    console.log('1. Email:', email, 'Password length:', password?.length);
    console.log('2. Supabase configured:', !!supabaseUrl, !!supabaseServiceKey);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin by email in Supabase
    const { data: admin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    console.log('3. Supabase query result:', { hasData: !!admin, error: fetchError?.message });

    if (fetchError || !admin) {
      console.log('4. ERROR: Admin not found or query error');
      console.log('   - Fetch error:', fetchError);
      console.log('   - Looking for email:', email.toLowerCase());
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('5. Admin found! Email:', admin.email, 'Hash prefix:', admin.password_hash?.substring(0, 15));

    // Verify password using bcrypt
    const validPassword = await bcrypt.compare(password, admin.password_hash);

    console.log('6. Password validation result:', validPassword);

    if (!validPassword) {
      console.log('7. ERROR: Invalid password!');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('8. SUCCESS: Password verified!');
    console.log('========================');

    // Update last login timestamp
    await supabase
      .from('admins')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id);

    // Generate a JWT token for middleware validation
    const { SignJWT } = await import('jose');
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'fallback-secret-for-dev'
    );

    const token = await new SignJWT({
      userId: admin.id,
      email: admin.email,
      role: 'ADMIN', // Middleware checks for 'ADMIN' role
      adminRole: admin.role, // Actual admin role (SUPER_ADMIN, SUPPORT, etc.)
      user_metadata: { role: 'ADMIN' }
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    // Return admin data without password
    const { password_hash, ...adminData } = admin;

    const response = NextResponse.json({
      success: true,
      admin: {
        id: adminData.id,
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
        permissions: adminData.permissions || [],
        avatar: adminData.avatar,
        lastLoginAt: adminData.last_login_at
      },
      token
    });

    // Set the auth-token cookie so middleware can validate it
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    console.log('Admin login successful:', email);
    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
