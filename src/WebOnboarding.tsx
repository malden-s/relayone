import React, { useState, useCallback } from "react";
import { useOneChallenge } from "./hooks/useOneChallenge";
import { useOneLink } from "./hooks/useOneLink";
import { useLocalKey } from "./hooks/useLocalKey";
// import { useBalanceSpy } from "./hooks/useBalanceSpy";
import { isMobile } from "react-device-detect";
import { PrivateKey } from "bsv";
import PageWrapper from "./components/PageWrapper";

import "./WebOnboarding.scss";
import WiredBalancePage from "./pages/WiredBalancePage";
import CodePage from "./pages/CodePage";
import OpenApp from "./pages/OpenApp";
import QRPage from "./pages/QRPage";

const PROTOCOL = "relayonebeta://";

interface Props {}

type STATE = "QR" | "CHALLENGE" | "WAITING_BALANCE" | "DONE";

export default function OnBoarding(props: Props) {
  const [syncPrivateKey, setSyncKey] = useLocalKey(
    "SYNC_KEY",
    PrivateKey.fromRandom()
  );
  const [synced, setSynced] = useState(false);
  const [privateKey, setPrivateKey] = useLocalKey("PRIVATE_KEY");
  const [, setIdentityKey] = useLocalKey("IDENTITY_KEY");
  const [state, setState] = useState<STATE>(!!privateKey ? "DONE" : "QR");
  const [challenge, setChallenge] = useState("");

  useOneChallenge(
    syncPrivateKey!,
    useCallback((challenge: string) => {
      setState("CHALLENGE");
      setChallenge(challenge);
    }, []),
    state === "DONE"
  );

  useOneLink(
    syncPrivateKey!,
    useCallback(
      (key: PrivateKey, identity: PrivateKey) => {
        setPrivateKey(key);
        setIdentityKey(identity);
        setSynced(true);
        setState("DONE");
        setSyncKey(PrivateKey.fromRandom());
      },
      [setIdentityKey, setPrivateKey, setSyncKey]
    ),
    state === "DONE"
  );

  switch (state) {
    case "DONE":
      return <WiredBalancePage synced={synced} />;
    case "CHALLENGE":
      return <CodePage code={challenge} />;
    case "QR":
      const pubKey = syncPrivateKey!.toPublicKey();
      const address = pubKey.toAddress();
      const url =
        PROTOCOL + pubKey.toString() + "?address=" + address.toString();
      return isMobile ? <OpenApp url={url} /> : <QRPage url={url} />;
    default:
      return <PageWrapper>Error</PageWrapper>;
  }
}
