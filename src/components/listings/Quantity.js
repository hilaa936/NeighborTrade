import { useTranslations } from "next-intl";

// "2 ק״ג", "3 צרורות"; quantities keep at most two decimals
export const roundQuantity = (value) => Math.round(value * 100) / 100;

export default function Quantity({ value, unit }) {
  const t = useTranslations("quantity");
  return t(unit, { count: roundQuantity(value) });
}
