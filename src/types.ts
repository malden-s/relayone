import { Script } from "bsv";

export interface PaymentResult {
  txid: string;
  amount: number;
  // FIXME: BN? What money button does here?
  satoshis: number;
  currency: string;
}

export type MarshalledJSType =
  | string
  | number
  | undefined
  | boolean
  | Array<undefined>
  | null
  | object;

export interface UnsafeOutput {
  to?: MarshalledJSType;
  address?: MarshalledJSType;
  amount?: MarshalledJSType;
  currency?: MarshalledJSType;
  script?: MarshalledJSType;
}

export interface UnsafeProps {
  to?: MarshalledJSType; // may not be set if outputs are set
  amount?: MarshalledJSType; // may not be set if outputs are set
  currency?: MarshalledJSType;
  devMode?: MarshalledJSType; // creates transactions but does not broadcast them
  label?: MarshalledJSType;
  successMessage?: MarshalledJSType;
  opReturn?: MarshalledJSType | string[];
  outputs?: MarshalledJSType | UnsafeOutput[];
  // clientIdentifier: string | "some public client identifier",
  // buttonId: string | "234325",
  // buttonData: string | "{}",
  // type: string | "tip", // tip or buy
  editable?: MarshalledJSType;
  disabled?: MarshalledJSType;
}

export interface CallbackProps {
  onError: (error: string) => void;
  onLoad: () => void;
  onPayment: (result: PaymentResult & { identity: string }) => void;
}

export interface RegularOutput {
  currency: string;
  to: string;
  unresolvedTo: string;
  // could it be BN?
  amount: string;
}

export interface ScriptOutput {
  currency: string;
  script: Script;
  // could it be BN?
  amount: string;
}

export type Output = RegularOutput | ScriptOutput;

interface OutputProps {
  // payment data
  outputs: Output[];
  // button presentation
  disabled: boolean;
  editable: boolean;
  // misc
  devMode: boolean;
}

export type ValidatedProps = OutputProps;

interface ResultOk<T> {
  value: T;
  isLoading: false;
}

interface ResultLoading {
  isLoading: true;
}

export type Result<T> = ResultOk<T> | ResultLoading;
