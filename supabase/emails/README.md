# BEAMY Auth emails

Supabase sends these from its own dashboard. The HTML here is what you paste in.

1. Open **Authentication → Email Templates**.
2. **Confirm signup**
   - Subject: `Confirm your BEAMY Catalogue email`
   - Replace the body with `supabase/emails/confirm-signup.html`
3. **Reset password**
   - Subject: `Reset your BEAMY Catalogue password`
   - Replace the body with `supabase/emails/reset-password.html`
4. Save each template.
5. Send a test from **Forgot password** and from a new **Create account** so you can see the real inbox result.

Do not remove `{{ .ConfirmationURL }}` or `{{ .Email }}`. Those are filled in by Supabase when the email is sent.

The lockup image is loaded from `https://beamy-eight.vercel.app/brand/logo-lockup.png`.

Supabase blocks template edits until custom SMTP is enabled. That is a sending service (for example Resend on your own account), not a login to the client Gmail. Do not use `beamysignature25@gmail.com` as the SMTP host or password. Full field values are in DEPLOY.md under **Branded emails**.
