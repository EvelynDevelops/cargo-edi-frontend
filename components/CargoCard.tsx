// components/CargoCard.tsx
"use client";

import React from "react";
import { CargoFormData } from "@/components/CargoFormItem";

type Props = {
  data: CargoFormData;
  index: number;
};

const CargoCard: React.FC<Props> = ({ data, index }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl px-6 py-4 shadow-sm space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 bg-gray-100 px-4 py-2 -mx-6 -mt-4 rounded-t-xl">
        Cargo Item #{index + 1}
      </h3>
      <p>
        <span className="font-medium">Cargo Type:</span> {data.cargo_type}
      </p>
      <p>
        <span className="font-medium">Number of Packages:</span> {data.number_of_packages}
      </p>
      <p>
        <span className="font-medium">Container Number:</span> {data.container_number || ""}
      </p>
      <p>
        <span className="font-medium">Master Bill of Landing Number:</span>{" "}
        {data.master_bill_of_lading_number || ""}
      </p>
      <p>
        <span className="font-medium">House Bill of Lading Number:</span>{" "}
        {data.house_bill_of_lading_number || ""}
      </p>
    </div>
  );
};

export default CargoCard;
