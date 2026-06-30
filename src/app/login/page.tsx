"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPw, setRegPw] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPw,
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPw,
      options: {
        data: { full_name: regName, phone: regPhone },
      },
    });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setInfoMsg("Berhasil daftar! Cek email kamu untuk konfirmasi akun.");
  }

  async function handleGoogleLogin() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-card border border-border rounded-3xl p-8">
        <div className="w-14 h-14 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag size={22} className="text-primary" />
        </div>
        <h1 className="font-outfit text-2xl font-black text-center mb-1">
          {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h1>
        <p className="text-sm text-muted text-center mb-7">
          {mode === "login"
            ? "Login ke akun Arduyy Shop kamu"
            : "Bergabung dengan ribuan gamer di Arduyy Shop"}
        </p>

        <div className="flex gap-1 bg-secondary border border-border rounded-2xl p-1 mb-7">
          <button
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
              setInfoMsg(null);
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl text-center transition-all ${
              mode === "login" ? "bg-card text-foreground shadow" : "text-muted"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
              setInfoMsg(null);
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl text-center transition-all ${
              mode === "register" ? "bg-card text-foreground shadow" : "text-muted"
            }`}
          >
            Daftar
          </button>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 mb-5">
            {errorMsg}
          </p>
        )}
        {infoMsg && (
          <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-2.5 mb-5">
            {infoMsg}
          </p>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold">Password</label>
                <button type="button" className="text-xs text-primary font-medium hover:underline">
                  Lupa password?
                </button>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={loginPw}
                  onChange={(e) => setLoginPw(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-11 text-sm outline-none focus:border-primary/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Login ke Akun"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Nama Lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Nama lengkap kamu"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">No. WhatsApp</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-4 text-sm outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-semibold block mb-2">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  value={regPw}
                  onChange={(e) => setRegPw(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full bg-input border border-border rounded-2xl py-3 pl-10 pr-11 text-sm outline-none focus:border-primary/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted leading-relaxed mb-4">
              Dengan mendaftar, kamu menyetujui Syarat &amp; Ketentuan dan Kebijakan Privasi kami.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm shadow-[0_8px_24px_rgba(59,126,248,0.3)] hover:bg-[#2d6ef0] hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Buat Akun Sekarang"}
            </button>
          </form>
        )}

        <div className="relative my-5">
          <div className="border-t border-border" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted">
            atau login dengan
          </span>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-secondary border border-border text-secondary-foreground py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:border-primary/40 transition"
        >
          <span className="w-4 h-4 rounded bg-gradient-to-br from-red-500 via-yellow-400 via-green-500 to-blue-500 shrink-0" />
          Lanjutkan dengan Google
        </button>
      </div>
    </div>
  );
}
