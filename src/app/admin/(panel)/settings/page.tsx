import { AdminField } from "@/components/admin/AdminField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { saveSettingsAction } from "@/lib/admin/actions";
import { getSiteSettings } from "@/lib/data/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <AdminPageHeader
        title="Website details"
        description="Phone, WhatsApp, email and homepage wording — so you never need to edit the website yourself."
      />
      <form action={saveSettingsAction} className="mt-8 max-w-3xl space-y-5">
        <input type="hidden" name="id" value={settings.id} />
        <AdminField label="Phone" description="The number shown on the contact page." as="label">
          <input name="phone" defaultValue={settings.phone} className={inputClass} />
        </AdminField>
        <AdminField
          label="WhatsApp number"
          description="Used for Order on WhatsApp. Include the country code if you can, for example 08101657472."
          as="label"
        >
          <input name="whatsapp_number" defaultValue={settings.whatsapp_number} className={inputClass} />
        </AdminField>
        <AdminField label="Email" description="The address visitors write to." as="label">
          <input name="email" type="email" defaultValue={settings.email} className={inputClass} />
        </AdminField>
        <AdminField
          label="Instagram — fashion"
          description="Your main fashion account, shown as @Beamy_fashion."
          as="label"
        >
          <input name="instagram_fashion" defaultValue={settings.instagram_fashion} className={inputClass} />
        </AdminField>
        <AdminField
          label="Instagram — woman"
          description="Your womenswear account, shown as @Beamy_woman."
          as="label"
        >
          <input name="instagram_woman" defaultValue={settings.instagram_woman} className={inputClass} />
        </AdminField>
        <AdminField label="Address" description="Where the house is based, shown on the contact page." as="label">
          <input name="address" defaultValue={settings.address} className={inputClass} />
        </AdminField>
        <AdminField
          label="Homepage headline"
          description="The large line at the top of the website."
          as="label"
        >
          <input name="hero_headline" defaultValue={settings.hero_headline} className={inputClass} />
        </AdminField>
        <AdminField
          label="Homepage supporting text"
          description="A short line under the headline."
          as="label"
        >
          <textarea name="hero_subheadline" rows={3} defaultValue={settings.hero_subheadline} className={inputClass} />
        </AdminField>
        <AdminField
          label="Short about text"
          description="A brief introduction used on the homepage."
          as="label"
        >
          <textarea name="about_short" rows={4} defaultValue={settings.about_short} className={inputClass} />
        </AdminField>
        <AdminField
          label="Full about text"
          description="The longer story on the About page."
          as="label"
        >
          <textarea name="about_long" rows={10} defaultValue={settings.about_long} className={inputClass} />
        </AdminField>
        <AdminField
          label="Footer line"
          description="A short line at the bottom of every page."
          as="label"
        >
          <input name="footer_tagline" defaultValue={settings.footer_tagline} className={inputClass} />
        </AdminField>
        <button className="admin-primary">Save website details</button>
      </form>
    </div>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
