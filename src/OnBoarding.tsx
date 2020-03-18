import React, { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SignInNewTabPopup from "./popups/SignInNewTab";
import * as messaging from "./frameMessaging";
import { useAutoSyncLocalKey } from "./hooks/useAutoSyncLocalKey";

interface Props {
  onSuccess?: () => any;
}

export default function OnBoarding(props: Props) {
  const [identityKey] = useAutoSyncLocalKey("IDENTITY_KEY");
  const { onSuccess } = props;

  useEffect(() => {
    if (identityKey) {
      if (onSuccess) onSuccess();
    }
  }, [identityKey, onSuccess]);

  // hide popup when unmounting
  useEffect(() => {
    return () => {
      messaging.send(window.parent, "hide-modal", null);
    };
  });

  messaging.send(
    window.parent,
    "show-modal",
    renderToStaticMarkup(<SignInNewTabPopup />)
  );

  return <div />;
}
