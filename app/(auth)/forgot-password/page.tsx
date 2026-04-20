"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { AuthShell } from "../_components/auth-shell";
import { BrandLogo } from "../_components/brand-logo";
import { FloatingInput } from "../_components/floating-input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <AuthShell
      desktopClassName="max-w-[34rem]"
      mobileDescription="A recuperacao de acesso esta disponivel somente em tela maior para manter o fluxo administrativo."
      mobileSecondaryText="Abra esta area em tablet ou computador para solicitar um novo link de acesso."
      mobileHint="Use uma tela com pelo menos 700px de largura para continuar."
    >
      <div className="rounded-[2.25rem] border border-[#efe2df] bg-white p-10 shadow-[0_25px_80px_rgba(120,77,92,0.12)]">
        <div className="flex flex-col items-center text-center">
          <BrandLogo />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ead7d7] bg-[#fff8f6] px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
            Recuperação de acesso
          </span>
          <p className="mt-4 max-w-md text-base leading-7 text-[#6c585f]">
            Informe o útltimo e-mail cadastrado. Vamos enviar um link
            para redefinição e validação da conta.
          </p>
        </div>

        <form className="mt-10 space-y-5">
          <FloatingInput
            id="recoveryEmail"
            type="email"
            name="recoveryEmail"
            label="Digite seu email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            icon={Mail}
          />

          <button
            type="button"
            className="group relative mt-4 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_38px_rgba(142,75,99,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_24px_44px_rgba(142,75,99,0.34)] active:scale-[0.99] cursor-pointer"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70"
            />
            <span className="relative">Enviar link</span>
            
          </button>

          <Link
            href="/login"
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-[#d7c0c7] bg-[rgba(255,248,247,0.88)] px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7b5260] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_14px_32px_rgba(180,154,164,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#b97a8e] hover:bg-[rgba(255,244,243,0.96)] hover:text-[#6e4152] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_20px_38px_rgba(170,102,126,0.18)] active:scale-[0.99]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90"
            />
            <span className="relative">Voltar para login</span>
          </Link>
        </form>
      </div>
    </AuthShell>
  );
}
