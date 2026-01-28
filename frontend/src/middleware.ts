import { NextRequest, NextResponse } from 'next/server'; 

export async function middleware(nextRequest: NextRequest) {
  const response = NextResponse.next();
  try {
    const token = nextRequest.cookies.get('token')?.value;

    if (!token) { 
      console.log('tokenが存在しません');
      return response; 
    }

    const fetchResponse = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/check`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }, 
      cache: 'no-store'
    });

    if (!fetchResponse.ok) {
      console.log('middlewareでの認証にてレスポンスが正常ではありません', fetchResponse.statusText)
      if (fetchResponse.status === 401) {
        console.log('401が返されました');
        response.cookies.delete('token');
        nextRequest.cookies.delete('token');
        // return NextResponse.next({
        //   request: {
        //     headers: new Headers(nextRequest.headers),
        //   },
        // })
        return response;
      } else {
        console.log('200番台および401以外のステータスが返されました', response.statusText);
        return response;
      }
    }

    console.log('認証されています');
    return response;
  } catch (error) {
    console.error('middlewareでエラーが発生しました', error);
    response.cookies.delete('token');
    return response; 
  }
}

export const config = {
  matcher: ['/', '/canvas/:path*'],  // 必要なパスのみ
};