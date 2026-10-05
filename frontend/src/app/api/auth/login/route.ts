import { NextResponse } from 'next/server';
import { AuthEngine } from '../../../../core/services/AuthEngine.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const authEngine = AuthEngine.getInstance();
    const result = await authEngine.login({ email, password });

    if (!result.success) {
      const status = result.lockoutRemainingSeconds ? 423 : 401;
      return NextResponse.json(result, { status });
    }

    const response = NextResponse.json(result, { status: 200 });
    if (result.token) {
      response.cookies.set('velora_auth_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400,
        path: '/'
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error during Login.' },
      { status: 500 }
    );
  }
}
