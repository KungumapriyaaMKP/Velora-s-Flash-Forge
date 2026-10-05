import { NextResponse } from 'next/server';
import { AuthEngine } from '../../../../core/services/AuthEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    const authEngine = AuthEngine.getInstance();
    const result = await authEngine.signUp({ fullName, email, password, role });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const response = NextResponse.json(result, { status: 201 });
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
      { success: false, error: error.message || 'Internal Server Error during Sign Up.' },
      { status: 500 }
    );
  }
}
