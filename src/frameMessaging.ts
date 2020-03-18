const BUTTON_FRAME_URL =
  process && process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://one.relayx.io";

const listeners = {};
const messages = {};

export function init(checkOrigin: boolean = false) {
  window.addEventListener("message", message => {
    if (checkOrigin && message.origin !== BUTTON_FRAME_URL) {
      return;
    }

    if (message.data.relay !== "relay") {
      return;
    }

    if (message.data.call === "reply") {
      messages[message.data.params.id] = message.data.params;
    }

    if (message.data.call) {
      (listeners[message.data.call] || []).forEach(callback =>
        callback(message.data.params, message.source, message.origin)
      );
    }
  });
}

export function on<T>(
  method: string,
  callback: (params: T, source: Window, origin: string) => any
) {
  listeners[method] = listeners[method] || [];
  listeners[method].push(callback);
}

export function send(window: Window | undefined, call: string, params: any) {
  if (window) window.postMessage({ relay: "relay", call, params }, "*");
}

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function frameMessage(id) {
  while (true) {
    if (messages[id]) {
      return messages[id];
    }
    await sleep(1000);
  }
}

let id = 0;

export function call(window, call: string) {
  return new Promise(resolve => {
    const callId = ++id;
    send(window, call, callId);
    frameMessage(callId).then(resolve);
  });
}
