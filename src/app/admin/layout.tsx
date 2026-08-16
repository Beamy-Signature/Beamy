export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

export const metadata = {
  robots: { index: false, follow: false },
  title: "BEAMY Catalogue",
};
