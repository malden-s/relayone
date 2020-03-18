import currencies from "./currencies.json";

export type Utxo = {
  satoshis: number;
  outputIndex: number;
  script: string;
  txid: string;
};

const bitindexUrl = "https://api.bitindex.network/api/v3/";
const bitindexApiKey =
  "39CZavEbCg7TncTnFPpk6wCejoaBKVzKzbSzzPBt8Ztc278ZYQYcrYoRsiUQGLAs1Q";
const RELAY_URL = "https://relayx.io/v1/";
const devId = "1relayone";

const headers = {
  headers: {
    devId,
    accept: "application/json",
    "content-type": "application/json"
  }
};

// FIXME
async function relayGET<T = any>(
  path: string,
  params?: { [key: string]: string }
): Promise<T> {
  const result = await fetch(RELAY_URL + path, headers);
  return result.json();
}

export async function getExchangeRate(currencyCode: number) {
  if (currencyCode === currencies["BSV"]) {
    return 1;
  }

  // setting/support/currency/get
  const response = await relayGET("spot/currency/rate/" + currencyCode);
  return response.data.exchangeRate;
}

export async function getOneLinkData(address: string) {
  return relayGET(`one/link/${address}`);
}

export async function getUtxos(address: string, limit = 50) {
  const url =
    bitindexUrl +
    "main/addrs/" +
    address +
    `/utxo?sort=value:desc&offset=0&limit=${limit}`;
  const header = {
    headers: {
      api_key: bitindexApiKey,
      accept: "application/json",
      "content-type": "application/json"
    }
  };
  let utxos: Utxo[] = [];
  try {
    let res = await fetch(url, header);
    utxos = await res.json();
    if (!utxos) {
      utxos = [];
    }
  } catch (e) {
    throw new Error(e);
  }
  utxos.sort((a, b) =>
    a.satoshis > b.satoshis ? 1 : a.satoshis < b.satoshis ? -1 : 0
  );
  return utxos;
}

export async function broadcastTx(txData: string, test: boolean) {
  const url = bitindexUrl + "main/tx/send";
  const data = {
    method: "POST",
    body: JSON.stringify({
      rawtx: txData
    }),
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    }
  };
  if (test) {
    let res = { url: url, data: data };
    console.info("Testing only", res);
    return res;
  }
  let res = await fetch(url, data);
  return res.json();
}

export async function getIdentityAddress(identity: string) {
  return relayGET(`one/link/address/${identity}`);
}

export async function fetchCurrencyList() {
  const response = await relayGET(`setting/support/currency/list/2`);
  return response.data;
}

export async function fetchCurrencyRate(symbolId: number) {
  const response = await relayGET(`spot/currency/rate/${symbolId}`);
  return response.data;
}

export async function fetchPaymentMethod() {
  const response = await relayGET(`setting/payment`);
  return response.data;
}

interface adressList {
  address: string;
  pct: number;
}
interface orderList {
  addressList: adressList;
  amount: string;
  payment_code: string;
  side: "buy" | "sell";
  limit?: number;
  page_no?: number;
}

// FIXME
export async function getOrderList(params: any) {
  const orderList = await fetch(`${RELAY_URL}spot/order/selection`, {
    method: "POST",
    body: params,
    headers: {
      accept: "application/json",
      "content-type": "application/json"
    }
  });

  const response = await orderList.json();

  return response;
}

export async function getSpecificOrder(
  order_id,
  addressList,
  amount,
  payment_code,
  side,
) {
  const url = new URL(`${RELAY_URL}spot/order/take`);
  const urlParams = {
    order_id,
    addressList,
    amount,
    payment_code,
    side,
  };

  url.search = new URLSearchParams(urlParams).toString();

  const orderList = await fetch(url.toString(), headers);
  const response = await orderList.json();

  return response;
}

export async function orderPaid(orderId: string) {
  return relayGET(`order/paid/${orderId}`);
}

export async function orderCancel(orderId: string) {
  return relayGET(`spot/order/cancel/${orderId}`);
}

export async function orderReceive(orderId: string) {
  return relayGET(`spot/order/receive/${orderId}`);
}

export async function orderConflict(orderId: string) {
  return relayGET(`spot/order/conflict/${orderId}`);
}

export const mockData = {
  "addressList": [
    {
      "address": "1cnsknkasjanasjaajndas",
      "pct": 100,
    }
  ],
  "amount": 100,
  "payment_code": "WCP",
  "side": "sell",
}
