import Image from "next/image";

type BrandLogoProps = {
  maxWidthClassName?: string;
};

export function BrandLogo({
  maxWidthClassName = "max-w-[14rem]",
}: BrandLogoProps) {
  return (
    <div className="flex w-full justify-center">
      <Image
        src="/images/logo-transparent.png"
        alt="Bellatech"
        priority
        width={320}
        height={144}
        className={`h-auto w-full object-contain ${maxWidthClassName}`}
      />
    </div>
  );
}
