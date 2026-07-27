import React from 'react';
import { JourneyTestClient } from "./JourneyTestClient";

export default function JourneyTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Journey Logic Regression Gate Test</h1>
      <JourneyTestClient />
    </div>
  );
}
