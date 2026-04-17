"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import { AuthShell } from "../_components/auth-shell";
import { BrandLogo } from "../_components/brand-logo";
import { FloatingInput } from "../_components/floating-input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <AuthShell desktopClassName="lg:max-w-[32rem]">
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
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            endSlot={
              <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                <Mail aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
            }
          />

          <div className="relative block">
            <FloatingInput
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              label="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              inputClassName={
                showPassword ? "tracking-normal" : "tracking-[0.35em]"
              }
              endSlot={
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onMouseDown={(event) => event.preventDefault()}
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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8e4b63_0%,#d97f97_100%)] px-6 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_rgba(146,76,101,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(146,76,101,0.34)] cursor-pointer"
          >
            Entrar
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>

          <Link
            href="/register"
            className="flex w-full items-center justify-center rounded-full border border-[#c7a4b0] bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7a4658] shadow-[0_12px_26px_rgba(180,154,164,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b96982] hover:bg-[linear-gradient(90deg,#f7e2e8_0%,#f1d2db_100%)] hover:text-[#7c4155] hover:shadow-[0_18px_34px_rgba(170,102,126,0.22)]"
          >
            Cadastre-se
          </Link>
          <p className="mt-4 cursor-pointer text-center text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#836c72] transition-colors hover:text-[#6f4453]">
            Esqueci minha senha
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
