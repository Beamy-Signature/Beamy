import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="max-w-lg">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">BEAMY Catalogue</p>
      <h1 className="mt-3 font-serif text-3xl">This page is not in the catalogue.</h1>
      <div className="gold-rule mt-4" />
      <p className="mt-4 text-sm leading-6 text-muted">
        That screen may have moved, or the link is a little out of date. You can go back to the dashboard and continue from there.
      </p>
      <Link href="/admin" className="admin-primary mt-6 inline-flex">
        Back to dashboard
      </Link>
    </div>
  );
}
