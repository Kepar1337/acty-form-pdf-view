"use client";

import { useState } from 'react';
import { isValidContractNumber, isValidEDRPOU, isValidIBAN, isValidIPN } from '../../lib/validators';

interface FormData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  address: string;
  taxID: string;
  iban: string;
  contact: string;
  email: string;
  service: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export default function InvoicePage() {
  const [data, setData] = useState<FormData>({
    invoiceNumber: '',
    date: '',
    clientName: '',
    address: '',
    taxID: '',
    iban: '',
    contact: '',
    email: '',
    service: '',
    quantity: 1,
    unit: 'послуга',
    price: 0,
    total: 0,
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!isValidContractNumber(data.invoiceNumber)) {
      newErrors.invoiceNumber = 'Некоректний номер рахунку (формат NNNN/YY)';
    }

    if (data.iban && !isValidIBAN(data.iban)) {
      newErrors.iban = 'Некоректний IBAN';
    }

    if (data.taxID && !(isValidEDRPOU(data.taxID) || isValidIPN(data.taxID))) {
      newErrors.taxID = 'Некоректний ЄДРПОУ або ІПН';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setMessage('Формується рахунок...');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setMessage(
        `✅ Рахунок сформовано. <a href="${url}" target="_blank" download="invoice.pdf" class="text-blue-600 underline">Завантажити PDF</a>`
      );
    } catch (err) {
      console.error(err);
      setMessage('❌ Помилка під час створення рахунку.');
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Форма для створення рахунку</h1>
      <form onSubmit={handleSubmit} className="space-y-4" id="invoice-form">
        <label className="block">
          Номер рахунку:
          <input className="w-full border p-2" name="invoiceNumber" value={data.invoiceNumber} onChange={handleChange} required />
          {errors.invoiceNumber && (
            <p className="text-red-600 text-sm">{errors.invoiceNumber}</p>
          )}
        </label>
        <label className="block">
          Дата:
          <input type="date" className="w-full border p-2" name="date" value={data.date} onChange={handleChange} required />
        </label>
        <label className="block">
          Клієнт:
          <input className="w-full border p-2" name="clientName" value={data.clientName} onChange={handleChange} required />
        </label>
        <label className="block">
          Адреса:
          <input className="w-full border p-2" name="address" value={data.address} onChange={handleChange} />
        </label>
        <label className="block">
          ІПН/РНОКПП:
          <input className="w-full border p-2" name="taxID" value={data.taxID} onChange={handleChange} />
          {errors.taxID && (
            <p className="text-red-600 text-sm">{errors.taxID}</p>
          )}
        </label>
        <label className="block">
          IBAN:
          <input className="w-full border p-2" name="iban" value={data.iban} onChange={handleChange} />
          {errors.iban && (
            <p className="text-red-600 text-sm">{errors.iban}</p>
          )}
        </label>
        <label className="block">
          Контактний телефон:
          <input className="w-full border p-2" name="contact" value={data.contact} onChange={handleChange} />
        </label>
        <label className="block">
          Email:
          <input type="email" className="w-full border p-2" name="email" value={data.email} onChange={handleChange} />
        </label>
        <label className="block">
          Найменування послуги:
          <input className="w-full border p-2" name="service" value={data.service} onChange={handleChange} required />
        </label>
        <label className="block">
          Кількість:
          <input type="number" className="w-full border p-2" name="quantity" value={data.quantity} onChange={handleChange} required />
        </label>
        <label className="block">
          Одиниця виміру:
          <input className="w-full border p-2" name="unit" value={data.unit} onChange={handleChange} />
        </label>
        <label className="block">
          Ціна за одиницю (грн):
          <input type="number" className="w-full border p-2" name="price" value={data.price} onChange={handleChange} required />
        </label>
        <label className="block">
          Сума (грн):
          <input type="number" className="w-full border p-2" name="total" value={data.total} onChange={handleChange} required />
        </label>
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Сформувати рахунок</button>
      </form>
      {message && (
        <div className="mt-8" dangerouslySetInnerHTML={{ __html: message }} />
      )}
    </main>
  );
}
