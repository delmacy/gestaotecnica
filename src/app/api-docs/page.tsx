"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState } from "react";

export default function ApiDocsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="p-8 text-center text-muted-foreground">Carregando documentação da API...</div>;

  return (
    <div className="bg-white min-h-screen pt-4 pb-12">
      <SwaggerUI url="/api/docs" />
    </div>
  );
}
