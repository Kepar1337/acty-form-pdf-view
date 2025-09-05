import React from 'react';

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      onChange(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <label className="block">
      {label}:
      <input
        type="file"
        accept="image/*"
        className="w-full"
        onChange={handleFileChange}
      />
      {value && (
        <img
          src={value}
          alt={`${label} preview`}
          className="mt-2 h-24 object-contain border"
        />
      )}
    </label>
  );
}
