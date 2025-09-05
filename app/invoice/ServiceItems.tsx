"use client";

import React from "react";

export interface ServiceItem {
  description: string;
  quantity: number;
  unit: string;
  price: number;
}

interface Props {
  items: ServiceItem[];
  onChange: (items: ServiceItem[]) => void;
}

export default function ServiceItems({ items, onChange }: Props) {
  const handleItemChange = (
    index: number,
    field: keyof ServiceItem,
    value: string | number
  ) => {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const addItem = () => {
    onChange([
      ...items,
      { description: "", quantity: 1, unit: "послуга", price: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border p-4 space-y-2">
          <label className="block">
            Опис послуги:
            <input
              className="w-full border p-2"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, "description", e.target.value)
              }
              required
            />
          </label>
          <label className="block">
            Кількість:
            <input
              type="number"
              className="w-full border p-2"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", Number(e.target.value))
              }
              required
            />
          </label>
          <label className="block">
            Одиниця виміру:
            <input
              className="w-full border p-2"
              value={item.unit}
              onChange={(e) => handleItemChange(index, "unit", e.target.value)}
            />
          </label>
          <label className="block">
            Ціна за одиницю (грн):
            <input
              type="number"
              className="w-full border p-2"
              value={item.price}
              onChange={(e) =>
                handleItemChange(index, "price", Number(e.target.value))
              }
              required
            />
          </label>
          <div>Сума: {item.quantity * item.price}</div>
          {items.length > 1 && (
            <button
              type="button"
              className="px-2 py-1 bg-red-500 text-white rounded"
              onClick={() => removeItem(index)}
            >
              Видалити
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={addItem}
      >
        Додати послугу
      </button>
      <div className="font-bold">Загальна сума: {total}</div>
    </div>
  );
}

