import { Transaction } from "bsv";

export function formatCurrencyWithPrecision(
  amount: string,
  prec: number
): string {
  return parseFloat(amount)
    .toFixed(prec)
    .replace(/0+$/, "")
    .replace(/\.$/, "");
}

export function formatCurrency(amount: string, currency: string) {
  const prec = currency === "BSV" ? 4 : 2;
  return formatCurrencyWithPrecision(amount, prec);
}

export function getOutputAmountWithoutChange(tx: Transaction) {
  const changeOut = tx.getChangeOutput();
  if (changeOut) {
    return tx.outputAmount + tx._estimateFee() - changeOut.satoshis;
  }
  return tx.outputAmount + tx._estimateFee();
}
