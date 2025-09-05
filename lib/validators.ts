export function isValidIBAN(iban: string): boolean {
  const normalized = iban.replace(/\s+/g, '').toUpperCase();
  if (!/^UA\d{27}$/.test(normalized)) return false;
  const rearranged = normalized.slice(4) + normalized.slice(0, 4);
  const expanded = rearranged.replace(/[A-Z]/g, (c) => (c.charCodeAt(0) - 55).toString());
  let remainder = expanded;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(block.length);
  }
  return parseInt(remainder, 10) % 97 === 1;
}

export function isValidEDRPOU(code: string): boolean {
  if (!/^\d{8}$/.test(code)) return false;
  const digits = code.split('').map(Number);
  const k1 = [1, 2, 3, 4, 5, 6, 7];
  const k2 = [3, 4, 5, 6, 7, 8, 9];
  let sum = digits.slice(0, 7).reduce((acc, d, i) => acc + d * k1[i], 0);
  let control = sum % 11;
  if (control === 10) {
    sum = digits.slice(0, 7).reduce((acc, d, i) => acc + d * k2[i], 0);
    control = sum % 11;
    if (control === 10) control = 0;
  }
  return control === digits[7];
}

export function isValidIPN(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  const digits = code.split('').map(Number);
  const weights = [-1, 5, 7, 9, 4, 6, 10, 5, 7];
  const sum = weights.reduce((acc, w, i) => acc + w * digits[i], 0);
  const control = (sum % 11) % 10;
  return control === digits[9];
}

export function isValidContractNumber(num: string): boolean {
  return /^\d{1,4}\/\d{2}$/.test(num);
}

export function formatDateUA(date: string): string {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}
