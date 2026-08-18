import Link from "next/link";

export function EmptyState({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mx-auto max-w-xl py-16 text-center sm:py-24">
      <h1 className="editorial-title text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-4 text-muted">{body}</p>
      {href && cta ? (
        <Link
          href={href}
          className="mt-8 inline-flex w-full justify-center border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase sm:w-auto"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
