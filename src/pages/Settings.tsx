
import React from "react";
import SettingsTabs from "@/components/settings/SettingsTabs";

const Settings = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Configurações do Usuário</h1>
      </div>
      
      <SettingsTabs />
    </div>
  );
};

export default Settings;
