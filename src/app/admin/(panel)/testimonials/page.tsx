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
        title="Testimonials"
        description="Client notes shown on the homepage. Only published testimonials appear on the website."
      />
      <form action={saveTestimonialAction} className="mt-8 space-y-3 border border-line bg-paper p-5">
        <h2 className="font-serif text-2xl">Add testimonial</h2>
        <input name="customer_name" required placeholder="Customer name" className={inputClass} />
        <textarea name="quote" required placeholder="What they said" rows={4} className={inputClass} />
        <input name="role" placeholder="Role (optional)" className={inputClass} />
        <input name="location" placeholder="Location (optional)" className={inputClass} />
        <PhotoUploader name="image_url" folder="testimonials" label="Customer photo (optional)" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <details className="text-sm">
          <summary className="cursor-pointer underline">More options</summary>
          <input name="sort_order" type="number" defaultValue={0} className={`${inputClass} mt-3`} />
        </details>
        <button className="admin-primary">Save testimonial</button>
      </form>
      <div className="mt-8 space-y-6">
        {testimonials.map((item) => (
          <div key={item.id} className="border border-line bg-paper p-5">
            <form action={saveTestimonialAction} className="space-y-3">
              <input type="hidden" name="id" value={item.id} />
              <input name="customer_name" defaultValue={item.customer_name} className={inputClass} />
              <textarea name="quote" defaultValue={item.quote} rows={4} className={inputClass} />
              <input name="role" defaultValue={item.role ?? ""} className={inputClass} />
              <input name="location" defaultValue={item.location ?? ""} className={inputClass} />
              <PhotoUploader
                name="image_url"
                folder="testimonials"
                label="Customer photo"
                value={item.image_url ? [{ url: item.image_url, alt: item.customer_name }] : []}
              />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={item.published} /> Published
              </label>
              <details className="text-sm">
                <summary className="cursor-pointer underline">More options</summary>
                <input name="sort_order" type="number" defaultValue={item.sort_order} className={`${inputClass} mt-3`} />
              </details>
              <button className="admin-primary">Save</button>
            </form>
            <div className="mt-3">
              <ConfirmDelete
                action={deleteTestimonialAction}
                id={item.id}
                title={`Delete ${item.customer_name}'s note?`}
                message="This testimonial will be removed from the homepage."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
