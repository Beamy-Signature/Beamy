export function AdminField({
  label,
  description,
  children,
  as = "div",
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  as?: "div" | "label";
}) {
  const Tag = as;
  return (
    <Tag className="block">
      <span className="block text-sm font-medium text-ink">{label}</span>
      {description ? (
        <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
      ) : null}
      <div className="mt-2">{children}</div>
    </Tag>
  );
}
