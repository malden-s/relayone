import { Address, PrivateKey, Transaction } from "bsv";
import { ScriptOutput, Output } from "./types";
import { Utxo } from "./api";
import sb from "satoshi-bitcoin";

const FEE_PER_KB = 1020;

// export function EstimateFee(tx:Transaction) {

//   if (tx.inputs.length === 0) {
//     // Templorarily add input to calculate fee
//     this.addInput({
//       txId: '0000000000000000000000000000000000000000000000000000000000000000',
//       outputIndex: 0,
//       satoshis: 1000000,
//       script: bsv.Script.fromASM('OP_DUP OP_HASH160 ac1c7026fcae37df56f09082ddb3b83de8dd169e OP_EQUALVERIFY OP_CHECKSIG')
//     })
//     this.fee = this.tx._estimateFee()
//     this.tx.inputs = []
//     this.tx._inputAmount = undefined
//     this.tx._updateChangeOutput()
//   } else {
//     this.fee = this.tx._estimateFee()
//   }
//   this.tx.fee( Math.max(this.fee, DUST_LIMIT - (this.tx._outputAmount || 0)) )
//   return this.fee
// }

export function isScriptOutput(output: any): output is ScriptOutput {
  return !!output.script;
}

export async function CreateTx(
  key: PrivateKey | undefined,
  outputs: Output[],
  rate: number,
  utxos: Utxo[]
) {
  console.log("create tx outputs", outputs, "rate", rate);

  let tx = new Transaction();

  if (utxos.length) {
    tx.from(utxos);
  }

  // Replace the amount with the BSV value for each output supplied

  let sats: number;

  if (outputs && outputs.length > 0) {
    // Use outputs array if provided
    for (let output of outputs) {
      sats = sb.toSatoshi(
        (+output.amount / (output.currency === "BSV" ? 1 : rate)).toFixed(8)
      );

      if (isScriptOutput(output)) {
        tx.addOutput(
          new Transaction.Output({
            script: output.script,
            satoshis: sats
          })
        );
        continue;
      }

      // FIXME: can it throw?
      tx.to(output.to || "13KBAeVBB74LFkVvKYCPnMzZ1s4YiiY9js", sats);
      // try {
      //   console.log("adding", props.amount, props.currency, sats);
      //   tx.to(props.to, sats);
      // } catch (e) {
      //   let message = "can't add to " + e;
      //   props.onError(message);
      //   throw new Error(message);
      // }
    }
  }

  tx.feePerKb(FEE_PER_KB);

  if (key instanceof PrivateKey) {
    tx.change(Address.fromPrivateKey(key).toString());
    tx = cleanDust(tx);
  }

  return tx;
}

function cleanDust(tx: any) {
  for (let i = 0; i < tx.outputs.length; ++i) {
    if (tx.outputs[i]._satoshis > 0 && tx.outputs[i]._satoshis < 546) {
      tx.outputs.splice(i, 1);
      --i;
    }
  }
  return tx;
}
