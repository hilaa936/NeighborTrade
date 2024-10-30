// src/components/marketplace/MarketplaceList.js

import React from "react";
import ProduceCard from "./ProduceCard";

const MarketplaceList = ({ produceList }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {produceList.map((produce) => (
        <ProduceCard key={produce.id} produce={produce} />
      ))}
    </div>
  );
};

export default MarketplaceList;
