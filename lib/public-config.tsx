"use client";
import { createContext, useContext } from "react";
export type PublicConfig = { supabaseUrl?: string; supabaseKey?: string; turnstileSiteKey?: string };
const ConfigContext = createContext<PublicConfig>({});
export const usePublicConfig = () => useContext(ConfigContext);
export function PublicConfigProvider({config,children}: {config: PublicConfig;children: React.ReactNode}) {
 return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}
