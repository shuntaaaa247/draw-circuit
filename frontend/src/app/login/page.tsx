"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/login`, {
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
      console.log(resJson);
      router.push("/");
    } catch (error) {
      console.log("Login failed", error);
      return;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      { process.env.NEXT_PUBLIC_SERVER_IS_READY !== "false" ?
      <>
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" className="border border-gray-300 rounded-md p-2" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="border border-gray-300 rounded-md p-2" />
          <button type="submit" className={
            `bg-blue-500 text-white rounded-md p-2  
            ${email && password ? "opacity-100 hover:bg-blue-600 cursor-pointer" : "opacity-50 disabled"}`} disabled={!email || !password}>Login</button>
        </form>
      </> :
      <>
        <h1 className="font-bold mb-5">申し訳ございません。現在、ログイン機能をはじめとするサーバー側の機能は準備中です。</h1>
        <Link href={"/"} className='ml-3 p-2 rounded-md border border-slate-200 hover:bg-slate-200'>トップへ</Link>
      </> }
    </div>
  )
}