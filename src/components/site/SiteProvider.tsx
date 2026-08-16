"use client";

import { createContext, useContext } from "react";

type SiteContextValue = {
  whatsappNumber: string;
};

const SiteContext = createContext<SiteContextValue>({
  whatsappNumber: "08101657472",
});

export function SiteProvider({
  whatsappNumber,
  children,
}: {
  whatsappNumber: string;
  children: React.ReactNode;
}) {
  return (
    <SiteContext.Provider value={{ whatsappNumber }}>{children}</SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
