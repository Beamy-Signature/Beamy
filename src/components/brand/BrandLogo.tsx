import Image from "next/image";

const sources = {
  lockup: { src: "/brand/logo-lockup.png", alt: "BEAMY Urban Fashion" },
  stacked: { src: "/brand/logo-dark.png", alt: "BEAMY Urban Fashion" },
  mark: { src: "/brand/mark.png", alt: "BEAMY" },
} as const;

export function BrandLogo({
  variant,
  className,
  priority = false,
  align = "center",
}: {
  variant: keyof typeof sources;
  className?: string;
  priority?: boolean;
  align?: "center" | "left";
}) {
  const logo = sources[variant];
  return (
    <span className={`relative block ${className ?? ""}`}>
      <Image
        src={logo.src}
        alt={logo.alt}
        fill
        className={`object-contain ${align === "left" ? "object-left" : "object-center"}`}
        sizes="220px"
        priority={priority}
      />
    </span>
  );
}
