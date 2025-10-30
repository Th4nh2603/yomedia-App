"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white">
      <h1 className="text-2xl mb-6">Đăng nhập để tiếp tục</h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })} // 👈 về trang Home sau khi login
        className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  );
}
