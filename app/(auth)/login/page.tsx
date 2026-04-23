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
      <div className="rounded-[2.25rem] border border-[#efe2df] bg-white p-10 shadow-[0_25px_80px_rgba(120,77,92,0.12)]">
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
    </AuthShell>
  );
}
