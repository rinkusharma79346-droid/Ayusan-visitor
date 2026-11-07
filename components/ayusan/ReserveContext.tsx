"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ReserveState = {
  isOpen: boolean;
  openReserve: () => void;
  closeReserve: () => void;
};

const ReserveContext = createContext<ReserveState>({
  isOpen: false,
  openReserve: () => {},
  closeReserve: () => {},
});

export function useReserve() {
  return useContext(ReserveContext);
}

/**
 * Global dialog controller. Any "Reserve a seat" button anywhere on the
 * page calls `openReserve()` — no scrolling, the form comes to you.
 */
export function ReserveProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openReserve = useCallback(() => setIsOpen(true), []);
  const closeReserve = useCallback(() => setIsOpen(false), []);
  const value = useMemo(
    () => ({ isOpen, openReserve, closeReserve }),
    [isOpen, openReserve, closeReserve]
  );
  return (
    <ReserveContext.Provider value={value}>{children}</ReserveContext.Provider>
  );
}
