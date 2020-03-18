import React from "react";

interface Props {
  primary?: boolean;
  text: string;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export default function Button({ primary, text, onClick, href, target }: Props) {
  const background = primary ? "rgb(0, 112, 210)" : "rgb(17, 26, 44)";

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <a
        style={{
          background,
          border: "none",
          borderRadius: 4,
          width: 130,
          height: 35,
          color: "white",
          fontSize: 16,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textDecoration: "none"
        }}
        onClick={onClick}
        href={href}
        target={target}
      >
        {text}
      </a>
    </div>
  );
}
