import React from "react";
import * as messaging from "../frameMessaging";
import Popup from "../components/Popup";
import { PrivateKey } from "bsv";

const linkStyle = {
  textAlign: "center" as "center",
  color: "white",
  display: "block",
  border: 0,
  textDecoration: "none",
  padding: "7px",
  width: 110,
  margin: 5,
  borderRadius: 2,
  fontSize: "12pt",
  cursor: "pointer"
};

export default function AuthorizePopup(props: { id: number; origin: string }) {
  const { id, origin } = props;
  const host = new URL(origin).host;
  return (
    <Popup>
      <div style={{ color: "white", lineHeight: "22px", fontSize: 16 }}>
        <div>
          <b>{host}</b> will receive permission to:
        </div>
        <div style={{ paddingLeft: 20, marginBottom: 20 }}>
          - Read your user ID and name.
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            style={{ ...linkStyle, backgroundColor: "rgb(17, 26, 44)" }}
            onClick={() => {
              messaging.send(window.parent, "reply", {
                id,
                result: false
              });
            }}
          >
            Cancel
          </button>
          <button
            style={{ ...linkStyle, backgroundColor: "rgb(31, 142, 250)" }}
            onClick={() => {
              window.localStorage.setItem("AUTHORIZED_" + origin, "");
              messaging.send(window.parent, "reply", {
                id,
                result: PrivateKey.fromWIF(
                  JSON.parse(window.localStorage.getItem("IDENTITY_KEY")!)
                )
                  .toPublicKey()
                  .toString()
              });
            }}
          >
            Allow
          </button>
        </div>
      </div>
      <div />
    </Popup>
  );
}
