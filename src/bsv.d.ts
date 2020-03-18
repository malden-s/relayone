declare module "bsv" {
  export class PrivateKey {
    constructor(key?: string);
    toWIF(): string;
    toPublicKey(): PublicKey;
    static fromWIF(wif: string): PrivateKey;
    static fromRandom(): PrivateKey;
  }

  export class Address {
    static fromPrivateKey(key: PrivateKey): Address;
    static isValid(address: string): boolean;
  }

  export class PublicKey {
    toAddress(): Address;
  }

  export class Script {
    static buildMultisigOut(keys: PublicKey[], treshhold: number): Script;
    static buildScriptHashOut(out: Output): Script;
    toAddress(): Address;
    add(opCode: Opcode | Buffer);
    toBuffer(): Buffer;
    isSafeDataOut(): boolean;
    isDataOut(): boolean;
    static fromASM(script: string): Script;
  }

  export enum Opcode {
    OP_FALSE,
    OP_RETURN
  }

  export class Transaction {
    // FIXME
    from(utxo: any): this;
    to(address: string, amount: number): this;
    addOutput(output: Output);
    static Output: typeof Output;
    feePerKb(feePerKb: number): this;
    change(address: string): this;
    sign(key: PrivateKey): this;
    // FIXME getter
    hash: string;
    serialize(): string;
    getFee(): number;
    outputAmount: number;
    _estimateFee(): number;
    getChangeOutput(): Output | null;
  }

  class Output {
    satoshis: number;
    constructor({ script: Script, satoshis: number });
  }
}

declare module "bsv/ecies" {
  export default class ECIES {
    privateKey(pkey: PrivateKey): this;
    decrypt(data: Buffer): Buffer;
  }
}

declare module "satoshi-bitcoin" {
  export function toBitcoin(statoshi: number | string): number;
  export function toSatoshi(statoshi: number | string): number;
}
