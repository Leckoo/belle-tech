"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import logo from "../public/images/logo.png";

export default function Home() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-7rem] h-56 w-56 -translate-x-1/2 rounded-full bg-[#f7d9cf] blur-3xl lg:h-72 lg:w-72" />
        <div className="absolute bottom-[-5rem] right-[-4rem] h-48 w-48 rounded-full bg-[#f0b8c4]/80 blur-3xl lg:h-72 lg:w-72" />
        <div className="absolute left-[-3rem] top-1/3 h-40 w-40 rounded-full bg-white/60 blur-3xl" />
      </div>

      <section className="relative w-full max-w-6xl">
        <div className="lg:hidden">
          <div className="mx-auto max-w-md rounded-[2rem] border border-[#efe2df] bg-white p-6 text-center shadow-[0_25px_80px_rgba(120,77,92,0.12)]">
            <div className="mx-auto flex w-full justify-center">
              <Image
                src={logo}
                alt="Bellatech"
                priority
                className="h-auto w-full max-w-[12rem] object-contain"
              />
            </div>
            <h1 className="mt-5 font-display text-[2.5rem] leading-none font-semibold text-[#181114]">
              Bellatech
            </h1>
            <p className="mt-4 text-sm leading-7 font-medium text-[#403136]">
              O acesso de gerente, funcionarios e administracao esta liberado
              somente em notebook ou computador.
            </p>
            <p className="mt-4 text-sm leading-7 font-medium text-[#5b4a50]">
              A experiencia mobile fica reservada para clientes acessarem agenda,
              servicos e produtos.
            </p>
            <div className="mt-8 rounded-[1.5rem] bg-[linear-gradient(135deg,#f4e1db_0%,#f7eee8_100%)] px-5 py-4 text-sm font-semibold text-[#6f4051] shadow-[0_16px_34px_rgba(188,144,139,0.16)]">
              Abra esta area em uma tela maior para continuar.
            </div>
          </div>
        </div>

        <div
          id="center-login"
          className="hidden lg:mx-auto lg:grid lg:w-full lg:max-w-[32rem] lg:gap-6"
        >
          <div className="rounded-[2.25rem] border border-[#efe2df] bg-white p-10 shadow-[0_25px_80px_rgba(120,77,92,0.12)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex w-full justify-center">
                <Image
                  src={logo}
                  alt="Bellatech"
                  priority
                  className="h-auto w-full max-w-[14rem] object-contain"
                />
              </div>
            </div>

            <form className="mt-8 space-y-5">
              <label className="relative block">
                <div
                  className="relative flex min-h-[5rem] items-center rounded-[1.35rem] border border-[#d7c7c2] bg-white px-5 shadow-[0_14px_30px_var(--shadow-rose-light)] transition-all duration-300 focus-within:border-[#8e4b63] focus-within:shadow-[0_18px_36px_rgba(142,75,99,0.16)]"
                >
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    placeholder=" "
                    className="peer w-full border-none bg-transparent pb-1 pr-14 pt-5 text-base font-semibold text-[var(--color-text-rose-accent)] outline-none placeholder:text-transparent"
                  />
                  <div
                    className="absolute left-4 top-0 z-10 -translate-y-1/2 bg-white px-2 text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-text-rose-accent)] transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[var(--color-text-rose-soft)] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.72rem] peer-focus:font-semibold peer-focus:tracking-[0.08em] peer-focus:text-[var(--color-text-rose-accent)]"
                  >
                    Digite seu email
                  </div>
                  <span className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8f586b] shadow-sm transition-colors duration-200 peer-focus:text-[var(--color-text-rose-accent)]">
                    <Mail aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                </div>
              </label>

              <div className="relative block">
                <div
                  className="relative flex min-h-[5rem] items-center rounded-[1.35rem] border border-[#d7c7c2] bg-white px-5 shadow-[0_14px_30px_var(--shadow-rose-light)] transition-all duration-300 focus-within:border-[#8e4b63] focus-within:shadow-[0_18px_36px_rgba(142,75,99,0.16)]"
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder=" "
                    className={`peer w-full border-none bg-transparent pb-1 pr-14 pt-5 text-base font-semibold text-[var(--color-text-rose-accent)] outline-none placeholder:text-transparent ${
                      showPassword ? "tracking-normal" : "tracking-[0.35em]"
                    }`}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 top-0 z-10 -translate-y-1/2 bg-white px-2 text-[0.72rem] font-semibold tracking-[0.08em] text-[var(--color-text-rose-accent)] transition-all duration-200 ease-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-[var(--color-text-rose-soft)] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.72rem] peer-focus:font-semibold peer-focus:tracking-[0.08em] peer-focus:text-[var(--color-text-rose-accent)]"
                  >
                    Senha
                  </label>
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
                </div>
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

              <button
                type="button"
                className="flex w-full items-center justify-center rounded-full border border-[#c7a4b0] bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#7a4658] shadow-[0_12px_26px_rgba(180,154,164,0.12)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b96982] hover:bg-[linear-gradient(90deg,#f7e2e8_0%,#f1d2db_100%)] hover:text-[#7c4155] hover:shadow-[0_18px_34px_rgba(170,102,126,0.22)] cursor-pointer"
              >
                Cadastre-se
              </button>
              <p
                className="mt-4 text-center text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#836c72] transition-colors hover:text-[#6f4453] cursor-pointer"
              >
                Esqueci minha senha
              </p>
            </form>
          </div>
        </div>
        

        <p className="mt-6 text-center text-xs leading-6 text-[#958689] sm:text-sm">
          (c) 2026 Bellatech. Todos os direitos reservados.
        </p>
      </section>
    </main>
  );
}
