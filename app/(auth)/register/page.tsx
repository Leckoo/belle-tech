"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CreditCard,
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
    <AuthShell desktopClassName="lg:max-w-[74rem]">
      <div className="rounded-[2.5rem] border border-[#efe2df] bg-white p-10 shadow-[0_25px_80px_rgba(120,77,92,0.12)] lg:p-12">
        <div className="flex flex-col items-center text-center">
          <BrandLogo maxWidthClassName="max-w-[13rem]" />
          <span className="mt-6 inline-flex rounded-full border border-[#ead7d7] bg-[#fff8f6] px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-[#9b5d73]">
            Cadastro inicial
          </span>
          <h1 className="mt-5 font-display text-[3.2rem] leading-none font-semibold text-[#181114]">
            Cadastro Bellatech
          </h1>
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
                  type="number"
                  value={form.managerCpf}
                  onChange={(event) => updateField("managerCpf", event.target.value)}
                  autoComplete="off"
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <CreditCard
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                  }
                />
                <FloatingInput
                  id="managerName"
                  name="managerName"
                  label="Nome completo"
                  value={form.managerName}
                  onChange={(event) => updateField("managerName", event.target.value)}
                  autoComplete="name"
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <UserRound aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  }
                />
                <FloatingInput
                  id="managerEmail"
                  type="email"
                  name="managerEmail"
                  label="E-mail"
                  value={form.managerEmail}
                  onChange={(event) => updateField("managerEmail", event.target.value)}
                  autoComplete="email"
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <Mail aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  }
                />
                <FloatingInput
                  id="managerPhone"
                  name="managerPhone"
                  label="Telefone ou WhatsApp"
                  value={form.managerPhone}
                  onChange={(event) => updateField("managerPhone", event.target.value)}
                  autoComplete="tel"
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <Phone aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  }
                />
                <FloatingInput
                  id="managerRole"
                  name="managerRole"
                  label="Cargo ou vinculo"
                  value={form.managerRole}
                  onChange={(event) => updateField("managerRole", event.target.value)}
                  autoComplete="organization-title"
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <BriefcaseBusiness
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                  }
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
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <Building2
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                  }
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
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <Building2
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                  }
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
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <Store aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                  }
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
                  endSlot={
                    <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                      <MapPinned
                        aria-hidden="true"
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </span>
                  }
                />
              </div>
            </section>
          </div>

          <div className="flex items-center justify-between rounded-[1.75rem] border border-[#efe3e4] bg-[linear-gradient(90deg,#fff9f7_0%,#fffefd_100%)] px-6 py-5">
            <div>
              <p className="text-sm font-semibold text-[#694f59]">
                Essa etapa prepara o primeiro acesso administrativo.
              </p>
              <p className="mt-1 text-sm text-[#867279]">
                Depois entramos na segunda tela para senha e validacoes finais.
              </p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="h-6 w-6 shrink-0 text-[#9b5d73]"
              strokeWidth={1.8}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Link
              href="/login"
              className="rounded-full border border-[#d9c4cb] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#7c5361] shadow-[0_12px_22px_rgba(180,154,164,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b96982] hover:text-[#6f4453]"
            >
              Voltar para login
            </Link>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(90deg,#8e4b63_0%,#d97f97_100%)] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(146,76,101,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(146,76,101,0.34)]"
            >
              Continuar cadastro
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
                strokeWidth={1.8}
              />
            </button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
