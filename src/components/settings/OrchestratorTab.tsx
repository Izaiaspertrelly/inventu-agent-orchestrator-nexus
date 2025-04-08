
import React from "react";
import OrchestratorForm from "./orchestrator/OrchestratorForm";
import OrchestratorDiagnostic from "./orchestrator/OrchestratorDiagnostic";

const OrchestratorTab = () => {
  return (
    <div className="space-y-6">
      <OrchestratorForm />
      <OrchestratorDiagnostic />
    </div>
  );
};

export default OrchestratorTab;
