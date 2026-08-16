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
    <div className="mx-auto max-w-xl py-24 text-center">
      <h1 className="editorial-title text-4xl">{title}</h1>
      <p className="mt-4 text-muted">{body}</p>
      {href && cta ? (
        <Link
          href={href}
          className="mt-8 inline-flex border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
