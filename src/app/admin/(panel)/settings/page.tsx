import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { saveSettingsAction } from "@/lib/admin/actions";
import { getSiteSettings } from "@/lib/data/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader
        title="Site settings"
        description="Phone, WhatsApp, email and homepage text — so you never need to edit code."
      />
      <form action={saveSettingsAction} className="mt-8 max-w-3xl space-y-4">
        <input type="hidden" name="id" value={settings.id} />
        <Field label="Phone" name="phone" defaultValue={settings.phone} />
        <Field label="WhatsApp number" name="whatsapp_number" defaultValue={settings.whatsapp_number} />
        <Field label="Email" name="email" type="email" defaultValue={settings.email} />
        <Field label="Instagram — @Beamy_fashion" name="instagram_fashion" defaultValue={settings.instagram_fashion} />
        <Field label="Instagram — @Beamy_woman" name="instagram_woman" defaultValue={settings.instagram_woman} />
        <Field label="Address" name="address" defaultValue={settings.address} />
        <Field label="Homepage headline" name="hero_headline" defaultValue={settings.hero_headline} />
        <label className="block">
          <span className="mb-2 block text-sm">Homepage supporting text</span>
          <textarea name="hero_subheadline" rows={3} defaultValue={settings.hero_subheadline} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm">Short about text</span>
          <textarea name="about_short" rows={4} defaultValue={settings.about_short} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm">Full about text</span>
          <textarea name="about_long" rows={10} defaultValue={settings.about_long} className={inputClass} />
        </label>
        <Field label="Footer line" name="footer_tagline" defaultValue={settings.footer_tagline} />
        <button className="admin-primary">Save settings</button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} className={inputClass} />
    </label>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
