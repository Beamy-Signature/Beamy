import { AdminField } from "@/components/admin/AdminField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { deleteTestimonialAction, saveTestimonialAction } from "@/lib/admin/actions";
import { getAdminTestimonials } from "@/lib/data/queries";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAdminTestimonials();

  return (
    <div>
      <AdminPageHeader
        title="Client notes"
        description="Kind words from clients, shown on the homepage. Only published notes appear on the website."
      />
      <form action={saveTestimonialAction} className="mt-8 space-y-4 border border-line bg-paper p-5">
        <h2 className="font-serif text-2xl">Add a client note</h2>
        <p className="text-sm leading-6 text-muted">
          Add the client’s name and what they said. A photograph is optional.
        </p>
        <AdminField label="Client name" description="The name shown beside the note." as="label">
          <input name="customer_name" required placeholder="Client name" className={inputClass} />
        </AdminField>
        <AdminField label="What they said" description="A short quote in their own words." as="label">
          <textarea name="quote" required placeholder="What they said" rows={4} className={inputClass} />
        </AdminField>
        <AdminField
          label="Role (optional)"
          description="A title if you would like one, such as Bride or Client."
          as="label"
        >
          <input name="role" placeholder="Role" className={inputClass} />
        </AdminField>
        <AdminField
          label="Location (optional)"
          description="A city or country, if you would like it shown."
          as="label"
        >
          <input name="location" placeholder="Location" className={inputClass} />
        </AdminField>
        <PhotoUploader
          name="image_url"
          folder="testimonials"
          label="Client photo (optional)"
          description="A portrait if you have one. Any image up to 10MB."
        />
        <AdminField
          label="Show on the website"
          description="Untick to keep this note private until you are ready."
        >
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
        </AdminField>
        <details className="text-sm">
          <summary className="cursor-pointer underline">More options</summary>
          <div className="mt-3">
            <AdminField
              label="Display order"
              description="Lower numbers appear first on the homepage."
              as="label"
            >
              <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
            </AdminField>
          </div>
        </details>
        <button className="admin-primary">Save client note</button>
      </form>
      <div className="mt-8 space-y-6">
        {testimonials.map((item) => (
          <div key={item.id} className="border border-line bg-paper p-5">
            <form action={saveTestimonialAction} className="space-y-4">
              <input type="hidden" name="id" value={item.id} />
              <AdminField label="Client name" description="The name shown beside the note." as="label">
                <input name="customer_name" defaultValue={item.customer_name} className={inputClass} />
              </AdminField>
              <AdminField label="What they said" description="A short quote in their own words." as="label">
                <textarea name="quote" defaultValue={item.quote} rows={4} className={inputClass} />
              </AdminField>
              <AdminField label="Role (optional)" description="A title if you would like one." as="label">
                <input name="role" defaultValue={item.role ?? ""} className={inputClass} />
              </AdminField>
              <AdminField
                label="Location (optional)"
                description="A city or country, if you would like it shown."
                as="label"
              >
                <input name="location" defaultValue={item.location ?? ""} className={inputClass} />
              </AdminField>
              <PhotoUploader
                name="image_url"
                folder="testimonials"
                label="Client photo"
                description="A portrait if you have one. Any image up to 10MB."
                value={item.image_url ? [{ url: item.image_url, alt: item.customer_name }] : []}
              />
              <AdminField
                label="Show on the website"
                description="Untick to hide this note from the homepage."
              >
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" defaultChecked={item.published} /> Published
                </label>
              </AdminField>
              <details className="text-sm">
                <summary className="cursor-pointer underline">More options</summary>
                <div className="mt-3">
                  <AdminField
                    label="Display order"
                    description="Lower numbers appear first."
                    as="label"
                  >
                    <input name="sort_order" type="number" defaultValue={item.sort_order} className={`${inputClass}`} />
                  </AdminField>
                </div>
              </details>
              <button className="admin-primary">Save client note</button>
            </form>
            <div className="mt-3">
              <ConfirmDelete
                action={deleteTestimonialAction}
                id={item.id}
                title={`Remove ${item.customer_name}’s note?`}
                message="This note will no longer appear on the homepage."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
