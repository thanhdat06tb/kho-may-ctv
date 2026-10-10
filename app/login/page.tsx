"use client";

import { useEffect, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [inactive, setInactive] = useState(false);

  useEffect(() => {
    setInactive(new URLSearchParams(window.location.search).get("error") === "inactive");
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error("Đăng nhập thất bại", { description: error.message });
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-lg bg-mint text-2xl font-black text-slate-950">K</div>
          <h1 className="text-3xl font-bold text-slate-50">Kho Máy CTV</h1>
          <p className="mt-2 text-sm text-slate-400">Đăng nhập để quản lý kho iPhone chung</p>
        </div>
        <Card>
          <CardContent>
            {inactive ? (
              <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-rose-100">
                Tài khoản chưa được kích hoạt hoặc đã bị vô hiệu hóa.
              </div>
            ) : null}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-slate-200">
                Email
                <Input className="mt-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="block text-sm font-semibold text-slate-200">
                Mật khẩu
                <Input className="mt-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </label>
              <Button className="w-full" size="lg" disabled={loading}>
                <LogIn className="h-5 w-5" />
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-slate-500">Tài khoản do Admin tạo hoặc mời qua Supabase Auth.</p>
      </div>
    </main>
  );
}
