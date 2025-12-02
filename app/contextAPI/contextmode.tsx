"use client";
import React, { createContext, useContext, useState } from "react";

export type SftpMode = "demo" | "media";

type SftpModeContextType = {
  mode: SftpMode;
  setMode: (m: SftpMode) => void;
};

const SftpModeContext = createContext<SftpModeContextType | undefined>(
  undefined
);

export const SftpModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<SftpMode>("demo");
  return (
    <SftpModeContext.Provider value={{ mode, setMode }}>
      {children}
    </SftpModeContext.Provider>
  );
};

export const useSftpMode = () => {
  const ctx = useContext(SftpModeContext);
  if (!ctx) {
    throw new Error("useSftpMode must be used inside SftpModeProvider");
  }
  return ctx;
};
