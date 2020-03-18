import * as messaging from "./src/frameMessaging";

(window as any)._RELAY_ONE_STATE = (window as any)._RELAY_ONE_STATE || {
  buttonFrames: new WeakMap<HTMLElement | Object, HTMLIFrameElement>(),
  buttonCallbacks: new WeakMap<
    Window,
    {
      onError: (message: any) => {};
      onLoad: () => {};
      onPayment: (result: any) => {};
    }
  >(),
  modal: undefined,
  authFrame: undefined
};

const RELAY_STATE: {
  buttonFrames: WeakMap<HTMLElement | Object, HTMLIFrameElement>;
  buttonCallbacks: WeakMap<
    Window,
    {
      onError: (message: any) => {};
      onLoad: () => {};
      onPayment: (result: any) => {};
    }
  >;
  modal: HTMLDivElement | undefined;
  authFrame: HTMLIFrameElement | undefined;
} = (window as any)._RELAY_ONE_STATE;

const noop = () => {};

const BUTTON_FRAME_URL =
  process && process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://one.relayx.io";
const buttonFrames = RELAY_STATE.buttonFrames;
const buttonCallbacks = RELAY_STATE.buttonCallbacks;

function createButtonFrame(el: HTMLElement) {
  return new Promise(resolve => {
    const iframe = document.createElement("iframe");
    iframe.onload = resolve;
    iframe.src = BUTTON_FRAME_URL;

    iframe.style.border = "none";
    iframe.style.width = "150px";
    iframe.style.height = "38px";
    iframe.style.overflow = "hidden";
    iframe.scrolling = "no";

    buttonFrames.set(el, iframe);

    el.appendChild(iframe);
  });
}

async function getFrameForElement(el) {
  if (!buttonFrames.has(el)) {
    await createButtonFrame(el);
  }
  return buttonFrames.get(el);
}

messaging.init(true);

messaging.on<string>("error", message => {
  console.warn("relay one error", message);
});

messaging.on<string>("payment-error", (message, source) => {
  buttonCallbacks.get(source).onError(message);
});

messaging.on("loaded", (params, source) => {
  buttonCallbacks.get(source).onLoad();
});

messaging.on("payment", (params: any, source) => {
  buttonCallbacks.get(source).onPayment(params);
});

messaging.on("hide-modal", () => {
  if (RELAY_STATE.modal) document.body.removeChild(RELAY_STATE.modal);
  RELAY_STATE.modal = undefined;
});

messaging.on("show-modal", (html: string) => {
  let append = false;
  if (!RELAY_STATE.modal) {
    append = true;
    RELAY_STATE.modal = document.createElement("div");
  }

  function isMobileDevice() {
    return (
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1
    );
  }

  if (isMobileDevice()) {
    RELAY_STATE.modal.style.display = "flex";
    RELAY_STATE.modal.style.justifyContent = "center";
    RELAY_STATE.modal.style.alignItems = "center";
  }

  RELAY_STATE.modal.style.position = "fixed";
  RELAY_STATE.modal.style.top = "0";
  RELAY_STATE.modal.style.left = "0";
  RELAY_STATE.modal.style.right = "0";
  RELAY_STATE.modal.style.bottom = "0";
  RELAY_STATE.modal.style.backgroundColor = "rgb(0, 0, 0, 0.2)";
  RELAY_STATE.modal.style.zIndex = "99999";

  let container = document.createElement("div");

  container.style.position = "fixed";

  container.style.right = "50px";
  container.style.bottom = "50px";

  RELAY_STATE.modal.innerHTML =
    `<div style="position: ${
      isMobileDevice() ? "static" : "fixed"
    }; right: 50px; bottom: 50px">` +
    html +
    "</div>";

  if (append) {
    document.body.appendChild(RELAY_STATE.modal);
  }

  document.querySelectorAll(".relay-one-close").forEach(el => {
    el.addEventListener("click", () => {
      if (RELAY_STATE.modal) {
        document.body.removeChild(RELAY_STATE.modal);
        RELAY_STATE.modal = undefined;
      }
    });
  });
});

// window.addEventListener("message", message => {
//   if (message.origin !== BUTTON_FRAME_URL) {
//     return;
//   }

//   const callbacks = buttonCallbacks.get(message.source as Window);
//   console.log(message.source, callbacks, "<<");
// });

async function makeAuthIframe() {
  return new Promise((resolve, reject) => {
    if (RELAY_STATE.authFrame) {
      resolve();
      return;
    }
    RELAY_STATE.authFrame = document.createElement("iframe");
    RELAY_STATE.authFrame.src =
      process && process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://one.relayx.io";

    RELAY_STATE.authFrame.style.border = "none";
    RELAY_STATE.authFrame.style.width = "0px";
    RELAY_STATE.authFrame.style.height = "0px";
    RELAY_STATE.authFrame.style.overflow = "hidden";
    RELAY_STATE.authFrame.scrolling = "no";

    RELAY_STATE.authFrame.onload = () => {
      resolve();
    };

    document.body.appendChild(RELAY_STATE.authFrame);
  });
}

const RelayEmbedHelper = {
  render: async (el: HTMLElement, props: any) => {
    const frame = await getFrameForElement(el);
    const { onError, onPayment, onLoad, ...rest } = props;

    buttonCallbacks.set(frame.contentWindow, {
      onError: onError || noop,
      onPayment: onPayment || noop,
      onLoad: onLoad || noop
    });

    messaging.send(buttonFrames.get(el).contentWindow, "render", rest);
  },

  renderRonButton: async (el: HTMLElement, props: any) => {
    import("./src/ron-button").then(exports => {
      exports.render(el, props);
    });
  },

  requestIdentity: async () => {
    const linked = await RelayEmbedHelper.isLinked();
    if (!linked) {
      await messaging.call(RELAY_STATE.authFrame.contentWindow, "onboard");
    }
    RELAY_STATE.authFrame.style.position = "fixed";
    RELAY_STATE.authFrame.style.right = "50px";
    RELAY_STATE.authFrame.style.bottom = "50px";
    RELAY_STATE.authFrame.style.width = "340px";
    RELAY_STATE.authFrame.style.height = "340px";
    const response: any = await messaging.call(
      RELAY_STATE.authFrame.contentWindow,
      "request-auth"
    );

    RELAY_STATE.authFrame.style.border = "none";
    RELAY_STATE.authFrame.style.width = "0px";
    RELAY_STATE.authFrame.style.height = "0px";
    RELAY_STATE.authFrame.style.overflow = "hidden";
    RELAY_STATE.authFrame.scrolling = "no";
    RELAY_STATE.authFrame.style.position = "static";
    return response.result;
  },
  isLinked: async () => {
    // create hidden iframe
    await makeAuthIframe();
    const response: any = await messaging.call(
      RELAY_STATE.authFrame.contentWindow,
      "is-linked"
    );
    return response.result;
  }
};

window["relayone"] = RelayEmbedHelper;
