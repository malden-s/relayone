import React from "react";

interface Props extends React.Props<any> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function PageWrapper({ header, footer, children }: Props) {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: 20,
        position: "absolute",
        background: "rgb(47, 59, 82)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',sans-serif",
        display: "flex",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div style={{ flex: 1 }}>
        <img
          style={{
            width: 170,
            display: "block",
            margin: "20px auto"
          }}
          src={require("../images/logo-header.png")}
          alt=""
        />
        {!!header && header}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", flexDirection: 'column' }}>
        {children}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
        {!!footer && footer}
      </div>
    </div>
  );
}
