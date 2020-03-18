import React, { useState } from "react";
import QRCode from "./QRCode";
import "./RelayFooter.scss";

export function QRPopup({ visible, onRequestClose }) {
  if (!visible) return null;
  return (
    <div className="QRPopup">
      <div style={{ display: "flex", alignSelf: "flex-end", marginRight: 10 }}>
        <span onClick={onRequestClose} className="cross">
          ✕
        </span>
      </div>
      <QRCode url={"http://go.appurl.cc/79813781441"} size={150} />
      <span className="label">Support iOS and Android</span>
    </div>
  );
}

export default function RelayFooter() {
  const [isQRHovered, setIsQRHovered] = useState(false);

  return (
    <div>
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <QRPopup
          visible={isQRHovered}
          onRequestClose={() => setIsQRHovered(false)}
        />
      </div>
      <div
        onMouseOver={() => setIsQRHovered(true)}
        onClick={() => setIsQRHovered(true)}
        style={{
          cursor: "pointer",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-around"
        }}
      >
        <img
          style={{ width: 42, height: 42, marginRight: 5 }}
          src={require("../images/icon.png")}
          alt=""
        />
        <div>
          <div>
            <span
              style={{
                color: "#fff",
                lineHeight: "22px",
                fontSize: "14px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>RelayX</span> Superwallet
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                lineHeight: "20px",
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.6)"
              }}
            >
              Download now
            </span>
            <img
              style={{ width: 6, height: 10, marginTop: 6, marginLeft: 5 }}
              src={require("../images/next.png")}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
