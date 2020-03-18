import React, { ReactNode, LegacyRef, Key } from "react";

interface Props {
  children?: ReactNode;
  key?: Key;
  ref?: LegacyRef<any>;
  height?: string;
}

export default function Popup(props: Props) {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: 20,
        width: 300,
        minHeight: props.height || 300,
        background: "rgb(47, 59, 82)",
        borderRadius: 10,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "relative"
      }}
    >
      <img
        style={{
          width: 120,
          height: 20,
          display: "block",
          margin: "20px auto"
        }}
        src={require("../images/logo-header.png")}
        alt=""
      />
      {props.children}
    </div>
  );
}
