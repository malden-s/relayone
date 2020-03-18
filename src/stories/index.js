import React from "react";
import { storiesOf } from "@storybook/react";
import { linkTo } from "@storybook/addon-links";
import SignInNewTabPopup from "../popups/SignInNewTab";
import AuthorizePopup from "../popups/Authorize";
import UpdatePopup from "../popups/Update";
import Slider from "../Slider";
import OpenApp from "../pages/OpenApp";
import CodePage from "../pages/CodePage";
import BalancePage from "../pages/BalancePage";
import QRPage from "../pages/QRPage";
import LoadingPage from "../pages/LoadingPage";
import { QRPopup } from "../components/RelayFooter";
import PressButton from "../components/PressButton";
import PaymentPage from "../pages/PaymentPage";
import PaymentPopup from "../popups/PaymentPopup";
import CurrencyDropdown from "../components/CurrencyDropdown";

const noop = () => {};

storiesOf("Pages", module)
  .add("open app page", () => <OpenApp url="http://example.com" />)
  .add("qr page", () => (
    <QRPage
      url={
        "1231231231231231231231231231231231231231231312312312312312312313123123123123"
      }
    />
  ))
  .add("code", () => <CodePage code={(Math.random() * 999999).toFixed(0)} />)
  .add("balance page", () => (
    <BalancePage
      synced
      amount={1234.123123123}
      satoshis={123456789}
      currency={10024}
      exchangeRate={{ value: 1, isLoading: false }}
      onDisconnect={linkTo("Pages", "open app page")}
      address={"/"}
    />
  ))
  .add("loading", () => <LoadingPage />)
  .add("PaymentPage", () => (
    <PaymentPage
      onClick={noop}
      symbol={"¥"}
      value={50}
      itemName={"Item Name"}
      paymentService={3}
    />
  ));

storiesOf("Popups", module)
  .add("sign in", () => <SignInNewTabPopup />)
  .add("authorize", () => <AuthorizePopup />)
  .add("update", () => <UpdatePopup />)
  .add("download app popup", () => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <QRPopup visible={true} />
    </div>
  ))
  .add("payment popup", () => <PaymentPopup />);

storiesOf("Press Button", module).add("button", () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 100
      }}
    >
      <div style={{ width: 10 }} />
      <PressButton loading={false} success={false} onClick={noop} />
      <div style={{ width: 10 }} />
      <PressButton loading={true} success={false} onClick={noop} />
      <div style={{ width: 10 }} />
      <PressButton loading={false} success={true} onClick={noop} />
    </div>
  );
});

storiesOf("Currency Dropdown", module).add("dropdown", () => {
  return (
    <div style={{ width: 112, margin: "0 auto" }}>
      <CurrencyDropdown />
    </div>
  );
});

storiesOf("Slider", module).add("default", () => {
  return (
    <div>
      <Slider
        loading={false}
        loadingMessage={"loading"}
        success={false}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={true}
        error={false}
        errorMessage={"Low Funds"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"999999"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={false}
        loadingMessage={"loading"}
        success={false}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={false}
        errorMessage={"Error"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"0.1"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={false}
        loadingMessage={"Processing"}
        success={false}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={false}
        errorMessage={"Error"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"999999999999999"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={true}
        loadingMessage={"Processing"}
        success={false}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={false}
        errorMessage={"Error"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"0.1"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={false}
        loadingMessage={"Processing"}
        success={false}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={true}
        errorMessage={"Error"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"0.1"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={false}
        loadingMessage={"Processing"}
        success={false}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={true}
        errorMessage={"Low Funds"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"0.1"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={false}
        loadingMessage={"Processing"}
        success={true}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={false}
        errorMessage={"Low Funds"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"0.1"}
      />
      <div style={{ height: 3 }} />
      <Slider
        loading={false}
        loadingMessage={"Processing"}
        success={true}
        successMessagePrefix={"Paid"}
        editable={false}
        disabled={false}
        error={false}
        errorMessage={"Low Funds"}
        onSlideComplete={noop}
        onSliderReachEnd={noop}
        onSliderChange={noop}
        onInputChange={noop}
        currency={"USD"}
        inputValue={"0.1"}
        displayValue={"999999999"}
      />
      <div style={{ height: 3 }} />
    </div>
  );
});
