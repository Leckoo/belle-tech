export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-7rem] h-56 w-56 -translate-x-1/2 rounded-full bg-[#f7d9cf] blur-3xl lg:h-72 lg:w-72" />
        <div className="absolute bottom-[-5rem] right-[-4rem] h-48 w-48 rounded-full bg-[#f0b8c4]/80 blur-3xl lg:h-72 lg:w-72" />
        <div className="absolute left-[-3rem] top-1/3 h-40 w-40 rounded-full bg-white/60 blur-3xl" />
      </div>

      {children}
    </main>
  );
}
