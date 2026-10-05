import { NextResponse } from 'next/server';
import { AuthEngine } from '../../../../core/services/AuthEngine';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      // Check cookie
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/velora_auth_token=([^;]+)/);
        if (match) token = match[1];
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized. No token provided.' }, { status: 401 });
    }

    const authEngine = AuthEngine.getInstance();
    const payload = authEngine.verifyToken(token);

    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Token invalid or expired.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error verifying token.' },
      { status: 500 }
    );
  }
}
