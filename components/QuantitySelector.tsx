"use client";

import { useState } from "react";

export default function QuantitySelector({
  onChange,
}: {
  onChange: (qty: number) => void;
}) {
  const [qty, setQty] = useState(1);

  const increase = () => {
    const newQty = qty + 1;
    setQty(newQty);
    onChange(newQty);
  };

  const decrease = () => {
    if (qty > 1) {
      const newQty = qty - 1;
      setQty(newQty);
      onChange(newQty);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6">

      <button
        onClick={decrease}
        className="px-3 py-1 border rounded"
      >
        -
      </button>

      <span className="text-lg font-semibold">{qty}</span>

      <button
        onClick={increase}
        className="px-3 py-1 border rounded"
      >
        +
      </button>

    </div>
  );
}