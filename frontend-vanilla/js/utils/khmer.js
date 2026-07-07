// Ported verbatim from the duplicated per-page utility in the React app
// (e.g. Subjects.jsx:16-23, Teachers.jsx:427) -- pure JS, no framework dependency.

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerNumerals(num) {
  if (num === null || num === undefined) return '០';
  return num.toString().split('').map(digit => {
    const parsed = parseInt(digit, 10);
    return isNaN(parsed) ? digit : KHMER_DIGITS[parsed];
  }).join('');
}
