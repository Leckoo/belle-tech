"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  IdCard,
  Mail,
  MapPinned,
  Phone,
  Store,
  UserRound,
} from "lucide-react";
import { AuthShell } from "../_components/auth-shell";
import { BrandLogo } from "../_components/brand-logo";
import { FloatingInput } from "../_components/floating-input";

type RegisterForm = {
  managerCpf: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerRole: string;
  establishmentCnpj: string;
  establishmentLegalName: string;
  establishmentTradeName: string;
  establishmentAddress: string;
};

const initialForm: RegisterForm = {
  managerCpf: "",
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  managerRole: "",
  establishmentCnpj: "",
  establishmentLegalName: "",
  establishmentTradeName: "",
  establishmentAddress: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);

  function updateField<Key extends keyof RegisterForm>(
    key: Key,
    value: RegisterForm[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <AuthShell desktopClassName="max-w-[74rem]">
      <div className="rounded-[2.5rem] border border-[#efe2df] bg-white p-10 shadow-[0_25px_80px_rgba(120,77,92,0.12)] lg:p-12">
        <div className="flex flex-col items-center text-center">
          <BrandLogo maxWidthClassName="max-w-[13rem]" />
          <span className="mt-6 inline-flex rounded-full border border-[#ead7d7] bg-[#fff8f6] px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
            Cadastro inicial
          </span>
        </div>

        <form className="mt-10 space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-[2rem] border border-[#eadfe0] bg-[linear-gradient(180deg,#fffdfc_0%,#fff7f5_100%)] p-7 shadow-[0_16px_36px_rgba(188,144,139,0.08)]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
                    Etapa 1
                  </p>
                  <h2 className="mt-2 font-display text-[2.2rem] leading-none font-semibold text-[#24181d]">
                    Cadastro do gerente
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#7a686e]">
                    Dados da pessoa responsavel pelo primeiro acesso
                    administrativo.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73] shadow-[0_10px_24px_rgba(155,93,115,0.16)]">
                  <UserRound aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                </div>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  id="managerCpf"
                  name="managerCpf"
                  label="CPF"
                  type="text"
                  inputMode="numeric"
                  value={form.managerCpf}
                  onChange={(event) => updateField("managerCpf", event.target.value)}
                  autoComplete="off"
                  mask="___.___.___-__"
                  replacement={{ _: /\d/ }}
                  icon={IdCard}
                />
                <FloatingInput
                  id="managerName"
                  name="managerName"
                  label="Nome completo"
                  value={form.managerName}
                  onChange={(event) => updateField("managerName", event.target.value)}
                  autoComplete="name"
                  icon={UserRound}
                />
                <FloatingInput
                  id="managerEmail"
                  type="email"
                  name="managerEmail"
                  label="E-mail"
                  value={form.managerEmail}
                  onChange={(event) => updateField("managerEmail", event.target.value)}
                  autoComplete="email"
                  icon={Mail}
                />
                <FloatingInput
                  id="managerPhone"
                  name="managerPhone"
                  label="Telefone ou WhatsApp"
                  value={form.managerPhone}
                  onChange={(event) => updateField("managerPhone", event.target.value)}
                  autoComplete="tel"
                  icon={Phone}
                />
                <FloatingInput
                  id="managerRole"
                  name="managerRole"
                  label="Cargo ou vinculo"
                  value={form.managerRole}
                  onChange={(event) => updateField("managerRole", event.target.value)}
                  autoComplete="organization-title"
                  icon={BriefcaseBusiness}
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#eadfe0] bg-[linear-gradient(180deg,#fffdfc_0%,#fff7f5_100%)] p-7 shadow-[0_16px_36px_rgba(188,144,139,0.08)]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
                    Etapa 2
                  </p>
                  <h2 className="mt-2 font-display text-[2.2rem] leading-none font-semibold text-[#24181d]">
                    Cadastro do salao
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#7a686e]">
                    Informacoes principais da unidade para vincular agenda,
                    servicos e usuarios.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff1ec] text-[#9b5d73] shadow-[0_10px_24px_rgba(155,93,115,0.16)]">
                  <Store aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                </div>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  id="establishmentCnpj"
                  name="establishmentCnpj"
                  label="CNPJ"
                  value={form.establishmentCnpj}
                  onChange={(event) =>
                    updateField("establishmentCnpj", event.target.value)
                  }
                  autoComplete="off"
                  icon={CreditCard}
                />
                <FloatingInput
                  id="establishmentLegalName"
                  name="establishmentLegalName"
                  label="Razao social"
                  value={form.establishmentLegalName}
                  onChange={(event) =>
                    updateField("establishmentLegalName", event.target.value)
                  }
                  autoComplete="organization"
                  icon={Building2}
                />
                <FloatingInput
                  id="establishmentTradeName"
                  name="establishmentTradeName"
                  label="Nome fantasia"
                  value={form.establishmentTradeName}
                  onChange={(event) =>
                    updateField("establishmentTradeName", event.target.value)
                  }
                  autoComplete="organization"
                  icon={Store}
                />
                <FloatingInput
                  id="establishmentAddress"
                  name="establishmentAddress"
                  label="Endereco completo"
                  value={form.establishmentAddress}
                  onChange={(event) =>
                    updateField("establishmentAddress", event.target.value)
                  }
                  autoComplete="street-address"
                  icon={MapPinned}
                />
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link
              href="/login"
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#d7c0c7] bg-[rgba(255,248,247,0.88)] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#7b5260] shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_14px_32px_rgba(180,154,164,0.16)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[#b97a8e] hover:bg-[rgba(255,244,243,0.96)] hover:text-[#6e4152] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_20px_38px_rgba(170,102,126,0.18)] active:scale-[0.99]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90"
              />
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#935a6f] ring-1 ring-[#ead6dd] transition duration-300 group-hover:-translate-x-0.5 group-hover:scale-105">
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 rotate-180"
                  strokeWidth={1.8}
                />
              </span>
              <span className="relative">Voltar</span>
            </Link>
            <button
              type="button"
              className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-full border border-[#b67b8f] bg-[linear-gradient(180deg,rgba(181,107,131,0.96)_0%,rgba(142,75,99,0.98)_100%)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_18px_38px_rgba(142,75,99,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_24px_44px_rgba(142,75,99,0.34)] active:scale-[0.99] cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70"
              />
              <span className="relative">Proximo</span>
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/16 ring-1 ring-white/20 transition duration-300 group-hover:translate-x-0.5 group-hover:scale-105">
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </span>
            </button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
