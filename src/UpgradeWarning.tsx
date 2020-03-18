import React, { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import UpdatePopup from "./popups/Update";
import * as messaging from "./frameMessaging";

interface Props {}

export default function OnBoarding(props: Props) {
  // hide popup when unmounting
  useEffect(() => {
    return () => {
      messaging.send(window.parent, "hide-modal", null);
    };
  });

  messaging.send(
    window.parent,
    "show-modal",
    renderToStaticMarkup(<UpdatePopup />)
  );

  return <div />;
}
