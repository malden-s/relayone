import { Address, Script, Opcode } from "bsv";
import {
  MarshalledJSType,
  UnsafeProps,
  ValidatedProps,
  UnsafeOutput,
  Output
} from "./types";
import currencies from "./currencies.json";
import { isScriptOutput } from "./tx";

function createOpReturnScript(data: string[], safe = true) {
  const opReturnScript = new Script();
  if (safe) {
    opReturnScript.add(Opcode.OP_FALSE);
  }
  opReturnScript.add(Opcode.OP_RETURN);

  for (const m in data) {
    // Detect hex prefix
    if (data[m].startsWith("0x")) {
      opReturnScript.add(Buffer.from(data[m].substring(2), "hex"));
    } else {
      // Otherwise, assume string
      opReturnScript.add(Buffer.from(data[m]));
    }
  }

  return opReturnScript;
}

export function validateCurrency(currency: MarshalledJSType) {
  if (typeof currency !== "string") {
    throw new Error("Currency must be a string");
  }

  if (!currencies[currency]) {
    throw new Error("Unknown currency");
  }

  return currency;
}

export function validateAmount(amount: MarshalledJSType) {
  if (typeof amount !== "string" && typeof amount !== "number") {
    throw new Error("Amount must be a string or a number");
  }

  if (isNaN(parseFloat(String(amount as any)))) {
    throw new Error("Invalid amount");
  }

  return String(amount);
}

export async function validateAddress(address: string) {
  const header = {
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    }
  };
  if (!Address.isValid(address)) {
    if (address.indexOf("@") !== -1) {
      try {
        const polynymUrl = `https://api.polynym.io/getAddress/${address}`;

        let polynymRes = await fetch(polynymUrl, header);
        let polynymRespons = await polynymRes.json();
        return polynymRespons.address;
      } catch (e) {
        throw new Error("PayMail: invalid address " + address);
      }
    }

    if (address[0] === "1") {
      try {
        const url = `https://relayx.io/api/receivingAddress/${address}`;

        let res = await fetch(url, header);
        let response = await res.json();
        return response.receivingAddress;
      } catch (e) {
        throw new Error("RelayOne: invalid address " + address);
      }
    }

    throw new Error("RelayOne: invalid address " + address);
  }

  return address;
}

function validateScript(script: Script) {
  if (script.toBuffer().length > 100000) {
    throw new Error("script is too big");
  }
}

async function validateOutputs(props: UnsafeProps): Promise<Output[]> {
  if (!Array.isArray(props.outputs)) {
    throw new Error("outputs should be an array");
  }

  if (props.editable) {
    throw new Error("Editable buttons cannot have extra outputs.");
  }

  const currencies = new Set<string>();
  props.outputs.forEach(output => {
    const currency = validateCurrency(output.currency);
    if (currency !== "BSV") currencies.add(currency);
  });

  if (currencies.size > 1) {
    throw new Error("Outputs could not contain different currencies.");
  }

  const outputs = await Promise.all(
    (props.outputs as (UnsafeOutput | undefined)[]).map(async (output, idx) => {
      if (!output) {
        throw new Error("invalid output");
      }

      if (
        (output.to && output.script) ||
        (output.to && output.address) ||
        (output.address && output.script)
      ) {
        throw new Error("Set either 'to', 'address' or 'script'");
      }

      if (!output.to && !output.script && !output.address) {
        throw new Error("Set either 'to', 'address' or 'script'");
      }

      if (output.to && typeof output.to !== "string") {
        throw new Error("'to' must be a string");
      }

      if (output.address && typeof output.address !== "string") {
        throw new Error("'address' must be a string");
      }

      if (output.script && typeof output.script !== "string") {
        throw new Error("'script' must be a string");
      }

      let script: Script | undefined;

      let to = (output.address ? output.address : output.to) as string;
      let currency = output.currency as string;

      if (output.script) {
        try {
          script = Script.fromASM(output.script as string);
        } catch {
          throw new Error("'script' is invalid");
        }
      } else {
        try {
          script = Script.fromASM(to);
        } catch {}
      }

      const amount = validateAmount(output.amount);

      if (script) {
        validateScript(script);
      }

      return script
        ? {
            script,
            amount,
            currency
          }
        : { amount, to: "", unresolvedTo: to, currency };
    })
  );

  return outputs;
}

async function validateShortcutProps(props: UnsafeProps): Promise<Output[]> {
  if (![props.to, props.amount, props.currency].every(x => !!x)) {
    throw new Error('"to", "amount", "currency" must be set together.');
  }

  const currency = validateCurrency(props.currency);
  const amount = validateAmount(props.amount);

  if (typeof props.to !== "string") {
    throw new Error("To must be a string");
  }

  let to = props.to;

  let script: Script | undefined;
  try {
    script = Script.fromASM(to);
  } catch {}

  let opReturnOutput;

  if (props.opReturn) {
    if (script && (script.isSafeDataOut() || script.isDataOut())) {
      throw new Error("Cannot use opReturn when to is a data script.");
    }

    const op_return = !Array.isArray(props.opReturn)
      ? ([props.opReturn] as string[])
      : (props.opReturn as string[]);
    if (!op_return.every(item => typeof item === "string")) {
      throw new Error("opReturn must be a string or array of strings");
    }

    const opReturnScript = createOpReturnScript(op_return);

    validateScript(opReturnScript);
    opReturnOutput = {
      script: opReturnScript,
      amount: "0",
      currency
    };
  }

  if (script) {
    validateScript(script);
  }

  const output: Output = script
    ? {
        script,
        amount,
        currency
      }
    : { amount, to: "", unresolvedTo: to, currency };

  return [output, opReturnOutput].filter(Boolean);
}

export async function validateProps(
  props: UnsafeProps
): Promise<ValidatedProps> {
  let hasOutputs =
    props.outputs && Array.isArray(props.outputs) && props.outputs.length > 0;

  if (hasOutputs && [props.to, props.amount, props.currency].some(x => !!x)) {
    throw new Error(
      '"to", "amount", "currency" cannot be set when "outputs" is set.'
    );
  }

  const outputs = await (hasOutputs
    ? validateOutputs(props)
    : validateShortcutProps(props));

  // inject relay op return tag
  if (
    !outputs.some(o => {
      if (!isScriptOutput(o)) {
        return false;
      }
      if (o.script.isSafeDataOut() || o.script.isDataOut()) {
        return true;
      }
      return false;
    })
  ) {
    outputs.push({
      script: createOpReturnScript(
        ["1HyHXtYWyGePrHVisnNdS931Vt6CqouUyZ", "relayx.io"],
        false
      ),
      amount: "0",
      currency: "BSV"
    });
  }

  return {
    devMode: !!props.devMode,
    editable: !!props.editable,
    disabled: !!props.disabled,
    outputs
  };
}
