"use client";

import { useParams } from "next/navigation";
import React from "react";

const TradePage = () => {
  const { produceId } = useParams(); // Access the produceId from the URL

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Initiate Trade for Produce ID: {produceId}
      </h1>
      {/* You can load the produce details here based on the produceId */}
    </div>
  );
};

export default TradePage;
