export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">BEAMY Catalogue</p>
        <h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">{title}</h1>
        <div className="gold-rule mt-4" />
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}
