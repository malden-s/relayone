import { PaymentResult, Output } from "./types";
import { PrivateKey, Address } from "bsv";
import { broadcastTx, getUtxos } from "./api";
import { CreateTx, isScriptOutput } from "./tx";
import { formatCurrency } from "./utils";
import sb from "satoshi-bitcoin";
import { getOutputAmountWithoutChange } from "./utils";
import { validateAddress } from "./validation";

export async function clickImpl(
  privateKey: PrivateKey,
  currency: string,
  outputs: Output[],
  rate: number,
  devMode: boolean
): Promise<PaymentResult> {
  const utxos = await getUtxos(Address.fromPrivateKey(privateKey).toString());
  outputs = await Promise.all(
    outputs.map(async o => {
      if (isScriptOutput(o)) return o;
      if (!o.to) {
        o.to = await validateAddress(o.unresolvedTo);
      }
      return o;
    })
  );

  let tx = await CreateTx(privateKey, outputs, rate, utxos);
  tx.sign(privateKey);
  if (devMode) {
    console.log("Created Transaction:", tx);
    console.log(
      "Decode: https://live.blockcypher.com/btc/decodetx/?t=" + tx.serialize()
    );
  }

  let response = await broadcastTx(tx.serialize(), devMode);
  if (response.message && response.message.code === 1) {
    throw new Error("Failed to broadcast:" + response.message.code);
  }

  const totalSats = getOutputAmountWithoutChange(tx);
  const totalInCurrency = sb.toBitcoin(totalSats) * rate;

  return {
    txid: tx.hash,
    amount: parseFloat(formatCurrency(String(totalInCurrency), currency)),
    // FIXME we know for a fact how many satoshies is there in tx
    satoshis: Math.trunc(totalSats),
    currency
  };
}
