import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { UnsafeProps, MarshalledJSType } from "./types";
import { validateProps } from "./validation";
import Slider from "./Slider";
import AuthorizePopup from "./popups/Authorize";
import * as messaging from "./frameMessaging";
import OnBoarding from "./OnBoarding";
import { PrivateKey } from "bsv";
// import * as serviceWorker from "./serviceWorker";

// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
  // eslint-disable-next-line
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

const noop = () => {};

function renderError() {
  return ReactDOM.render(
    <Slider
      loading={false}
      loadingMessage={"loading"}
      success={false}
      successMessagePrefix={"Paid"}
      editable={false}
      disabled={true}
      error={true}
      errorMessage={"Invalid"}
      onSlideComplete={noop}
      onSliderReachEnd={noop}
      onSliderChange={noop}
      onInputChange={noop}
      currency={""}
      inputValue={""}
      displayValue={""}
    />,
    document.getElementById("root")
  );
}

function renderLoading() {
  return ReactDOM.render(
    <Slider
      loading={true}
      loadingMessage={"RelayOne"}
      success={false}
      successMessagePrefix={"Paid"}
      editable={false}
      disabled={true}
      error={true}
      errorMessage={"Invalid"}
      onSlideComplete={noop}
      onSliderReachEnd={noop}
      onSliderChange={noop}
      onInputChange={noop}
      currency={""}
      inputValue={""}
      displayValue={""}
    />,
    document.getElementById("root")
  );
}

function sendError(msg: string) {
  messaging.send(window.parent, "error", "payment error: " + msg);
}

function sendPaymentError(msg: string) {
  messaging.send(window.parent, "payment-error", "payment error: " + msg);
}

let seq = 0;

messaging.init();

messaging.on("is-linked", id => {
  messaging.send(window.parent, "reply", {
    id,
    result: !!window.localStorage.getItem("IDENTITY_KEY")
  });
});

messaging.on<number>("request-auth", (id, _, origin) => {
  if (!window.localStorage.getItem("IDENTITY_KEY") || !origin) {
    messaging.send(window.parent, "reply", {
      id,
      result: false
    });
    return;
  }

  if (window.localStorage.getItem("AUTHORIZED_" + origin) !== null) {
    messaging.send(window.parent, "reply", {
      id,
      result: PrivateKey.fromWIF(
        JSON.parse(window.localStorage.getItem("IDENTITY_KEY")!)
      )
        .toPublicKey()
        .toString()
    });
    return;
  }

  ReactDOM.render(
    <AuthorizePopup id={id} origin={origin} />,
    document.getElementById("root")
  );
});

messaging.on<number>("onboard", id => {
  ReactDOM.render(
    <OnBoarding
      onSuccess={() => {
        messaging.send(window.parent, "reply", {
          id
        });
      }}
    />,
    document.getElementById("root")
  );
});

messaging.on<string>("render", async params => {
  let props: UnsafeProps;
  try {
    let parsedMessage = params as MarshalledJSType | UnsafeProps;
    if (!parsedMessage || !(typeof parsedMessage === "object")) {
      throw new Error("Invalid params");
    }
    props = parsedMessage as UnsafeProps;
  } catch {
    sendError("Invalid params");
    renderError();
    return;
  }

  renderLoading();

  try {
    let validatedProps = await validateProps(props);
    console.log(props, validatedProps);
    ReactDOM.render(
      <App
        key={`button-${seq++}`}
        {...validatedProps}
        onPayment={arg => {
          messaging.send(window.parent, "payment", arg);
        }}
        onLoad={() => {
          messaging.send(window.parent, "loaded", null);
        }}
        onError={sendPaymentError}
      />,
      document.getElementById("root")
    );
  } catch (e) {
    sendError(e.message);
    renderError();
    return;
  }
});

// Render onboarding screen
if (window.top === window) {
  import("./WebOnboarding").then(WebOnboardingModule => {
    const WebOnboarding = WebOnboardingModule.default;
    ReactDOM.render(<WebOnboarding />, document.getElementById("root"));
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
