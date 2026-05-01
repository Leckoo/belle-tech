"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { AuthShell } from "../_components/auth-shell";
import { BrandLogo } from "../_components/brand-logo";
import { FloatingInput } from "../_components/floating-input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <AuthShell desktopClassName="max-w-[32rem]">
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-14 top-10 h-40 w-40 rounded-full bg-[#f1d7dd]/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 bottom-10 h-44 w-44 rounded-full bg-[#f4e7e2]/80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-8 -z-10 h-[82%] rounded-[2.75rem] bg-[radial-gradient(circle_at_top,rgba(248,225,220,0.88),rgba(244,211,217,0.48)_42%,transparent_75%)] blur-3xl"
        />

        <div className="relative rounded-[2.25rem] border border-[#eadbdf] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(255,251,250,0.98)_100%)] p-10 shadow-[0_34px_96px_rgba(120,77,92,0.18),0_12px_28px_rgba(120,77,92,0.08)] backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <BrandLogo />
          </div>

          <form className="mt-8 space-y-5">
            <FloatingInput
              id="email"
              type="email"
              name="email"
              label="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              icon={Mail}
            />

            <div className="relative block">
              <FloatingInput
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                inputClassName={
                  showPassword ? "tracking-normal" : "tracking-[0.35em]"
                }
                endSlot={
                  <button
                    type="button"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition duration-200 hover:scale-110 hover:bg-[#fff7f4] hover:text-[var(--color-text-rose-accent)] active:scale-95 peer-focus:text-[var(--color-text-rose-accent)]"
                  >
                    {showPassword ? (
                      <EyeOff
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    )}
                  </button>
                }
              />
            </div>

            <button
              type="button"
              className="group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_38px_rgba(142,75,99,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_24px_44px_rgba(142,75,99,0.34)] active:scale-[0.99] cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70"
              />
              <span className="relative">Entrar</span>
            </button>

            <button
              type="button"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#d8d2d5] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(245,241,243,0.96)_52%,rgba(234,228,231,0.96)_100%)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#4c3b42] shadow-[inset_0_1px_0_rgba(255,255,255,0.96),inset_0_-1px_0_rgba(214,206,210,0.9),0_18px_38px_rgba(74,49,58,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#c8c0c4] hover:bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(248,244,246,0.98)_52%,rgba(238,233,236,0.98)_100%)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.98),inset_0_-1px_0_rgba(208,200,204,0.94),0_24px_44px_rgba(74,49,58,0.2)] active:scale-[0.99] cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/95"
              />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(240,236,238,0.92)_100%)] ring-1 ring-[#ddd4d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_20px_rgba(80,52,62,0.12)]">
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.805 10.023H12.25v3.955h5.48c-.236 1.273-.96 2.353-2.047 3.078v2.557h3.318c1.943-1.789 3.054-4.425 3.054-7.553 0-.675-.06-1.324-.25-2.037Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12.25 22c2.76 0 5.073-.915 6.764-2.487l-3.318-2.557c-.92.62-2.095.99-3.446.99-2.652 0-4.9-1.79-5.706-4.2H3.12v2.637A10.213 10.213 0 0 0 12.25 22Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.544 13.746a6.116 6.116 0 0 1 0-3.892V7.217H3.12a10.248 10.248 0 0 0 0 9.166l3.424-2.637Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M12.25 5.654c1.497 0 2.84.516 3.897 1.53l2.904-2.905C17.318 2.67 15.005 2 12.25 2A10.213 10.213 0 0 0 3.12 7.217l3.424 2.637c.805-2.41 3.054-4.2 5.706-4.2Z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              <span className="relative">Entrar com Google</span>
            </button>

            <Link
              href="/register"
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#d7c0c7] bg-[rgba(255,248,247,0.88)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7b5260] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_14px_32px_rgba(180,154,164,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#b97a8e] hover:bg-[rgba(255,244,243,0.96)] hover:text-[#6e4152] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_20px_38px_rgba(170,102,126,0.18)] active:scale-[0.99]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90"
              />
              <span className="relative">Cadastre-se</span>
            </Link>
            <Link
              href="/forgot-password"
              className="mt-4 block text-center text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#836c72] transition-colors hover:text-[#6f4453]"
            >
              Esqueci minha senha
            </Link>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
