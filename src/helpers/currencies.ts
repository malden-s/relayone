export interface Option {
  value: number;
  label: string;
  imgUrl: string;
  symbol: string;
  sign: string;
}

export const CURRENCIES: Option[] = [
  {
    value: 10009,
    label: " AUD ($)",
    imgUrl: require("../images/aus-flag.png"),
    symbol: "AUD",
    sign: "AU$"
  },
  {
    value: 10007,
    label: " ARS ($)",
    imgUrl: require("../images/argentina.png"),
    symbol: "ARS",
    sign: "AR$"
  },
  {
    value: 10030,
    label: " CAD ($)",
    imgUrl: require("../images/canada.png"),
    symbol: "CAD",
    sign: "CA$"
  },
  {
    value: 10034,
    label: " CNY (¥)",
    imgUrl: require("../images/china.png"),
    symbol: "CNY",
    sign: "¥"
  },
  {
    value: 10004,
    label: " EUR (€)",
    imgUrl: require("../images/european-union.png"),
    symbol: "EUR",
    sign: "€"
  },
  {
    value: 10146,
    label: " GBP (£)",
    imgUrl: require("../images/united-kingdom.png"),
    symbol: "GBP",
    sign: "£"
  },
  {
    value: 10059,
    label: " HKD ($)",
    imgUrl: require("../images/hong-kong.png"),
    symbol: "HKD",
    sign: "HK$"
  },
  {
    value: 10024,
    label: " USD ($)",
    imgUrl: require("../images/america.png"),
    symbol: "USD",
    sign: "US$"
  },
  {
    value: 10063,
    label: " IDR (Rp)",
    imgUrl: require("../images/indonesia.png"),
    symbol: "IDR",
    sign: "Rp"
  },
  {
    value: 10068,
    label: " JPY (¥)",
    imgUrl: require("../images/japan.png"),
    symbol: "JPY",
    sign: "JP¥"
  },
  {
    value: 10073,
    label: " KRW (₩)",
    imgUrl: require("../images/south-korea.png"),
    symbol: "KRW",
    sign: "₩"
  },
  {
    value: 10111,
    label: " PHP (₱)",
    imgUrl: require("../images/philippines.png"),
    symbol: "PHP",
    sign: "₱"
  },
  {
    value: 10137,
    label: " THB (฿)",
    imgUrl: require("../images/thailand.png"),
    symbol: "THB",
    sign: "฿"
  }
];

export const getCurrencyById = (id: number) =>
  CURRENCIES.find(o => o.value === id);
