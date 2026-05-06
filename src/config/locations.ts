export interface Location {
  label: string;
  address: string;
}

export const LOCATIONS: Location[] = [
  {
    label: "Oakville",
    address: "Unit 5, 3280 South Service Road W, Oakville, ON L6L 0B1",
  },
  {
    label: "Montreal",
    address: "10200 De la Cote-de-Liesse, Lachine, QC H8T 1A3",
  },
  {
    label: "Edmonton",
    address: "11540 184 St NW, Edmonton, AB T5S 2W7",
  },
  {
    label: "Coquitlam",
    address: "2388 Canoe Ave #101, Coquitlam, BC V3K 6C2",
  },
  {
    label: "Calgary",
    address: "Unit 2111, 4416 64 Ave SE, Calgary, AB T2G 4E1",
  },
  {
    label: "Other",
    address: "",
  },
];

export const CURRENCIES = ["USD", "CAD", "GBP", "EUR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  CAD: "$",
  GBP: "£",
  EUR: "€",
};

export const UNITS_OF_MEASURE = ["EA", "PCS", "SET", "M", "FT", "KG", "LBS", "L"] as const;

export const WEIGHT_UNITS = ["LBS", "KG"] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];
