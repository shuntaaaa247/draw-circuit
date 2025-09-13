import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'


// ログイン処理のBFF
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  
  const body = await req.json();
  const { email, password } = body;
  console.log(`email: ${email}, password: ${password}`);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  try {
    // console.log(`process.env.NEXT_PUBLIC_API_BASE_URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
    const response = await fetch(`${apiUrl}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const resJson = await response.json();
    console.log(`resJson token ===> : ${resJson.token}`);
    cookieStore.set("token", resJson.token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return NextResponse.json({ message: "Login successful", token: resJson.token }, { status: 200 });
  } catch (error) {
    console.log("Login failed", error);
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}