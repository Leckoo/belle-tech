import { BrandLogo } from "./brand-logo";

type AuthShellProps = {
  children: React.ReactNode;
  desktopClassName?: string;
  mobileTitle?: string;
  mobileDescription?: string;
  mobileSecondaryText?: string;
  mobileHint?: string;
};

export function AuthShell({
  children,
  desktopClassName = "max-w-[32rem]",
  mobileTitle = "Bellatech",
  mobileDescription = "O acesso de gerente, funcionarios e administracao esta liberado somente em notebook ou computador.",
  mobileSecondaryText = "A experiencia mobile fica reservada para clientes acessarem agenda, servicos e produtos.",
  mobileHint = "Abra esta area em uma tela maior para continuar.",
}: AuthShellProps) {
  return (
    <section className="relative w-full max-w-6xl">
      <div className="min-[700px]:hidden">
        <div className="mx-auto max-w-md rounded-[2rem] border border-[#efe2df] bg-white p-6 text-center shadow-[0_25px_80px_rgba(120,77,92,0.12)]">
          <BrandLogo maxWidthClassName="max-w-[12rem]" />
          <h1 className="mt-5 font-display text-[2.5rem] leading-none font-semibold text-[#181114]">
            {mobileTitle}
          </h1>
          <p className="mt-4 text-sm leading-7 font-medium text-[#403136]">
            {mobileDescription}
          </p>
          <p className="mt-4 text-sm leading-7 font-medium text-[#5b4a50]">
            {mobileSecondaryText}
          </p>
          <div className="mt-8 rounded-[1.5rem] bg-[linear-gradient(135deg,#f4e1db_0%,#f7eee8_100%)] px-5 py-4 text-sm font-semibold text-[#6f4051] shadow-[0_16px_34px_rgba(188,144,139,0.16)]">
            {mobileHint}
          </div>
        </div>
      </div>

      <div
        id="center-auth"
        className={`hidden min-[700px]:mx-auto min-[700px]:grid min-[700px]:w-full min-[700px]:gap-6 ${desktopClassName}`}
      >
        {children}
      </div>

      <p className="mt-6 text-center text-xs leading-6 text-[#958689] sm:text-sm">
        (c) 2026 Bellatech. Todos os direitos reservados.
      </p>
    </section>
  );
}
