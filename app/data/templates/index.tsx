import React from "react";
import EvaTemplate from "./EvaTemplate";
import Phunuonline from "./phunutopday";
import Phunutoday from "./phunuonline";

export const TEMPLATE_COMPONENTS: Record<string, React.ReactNode> = {
  eva: <EvaTemplate />,
  phunuonline: <Phunuonline />,
  phunutoday: <Phunutoday />,
};
