import React from "react";

interface Props {
  height?: number;
  width?: number;
}

export default function Loader(props: Props) {
  return (
    <svg
      width={props.width || 120}
      height={props.height || 30}
      viewBox="0 0 120 30"
      xmlns="http://www.w3.org/2000/svg"
      fill={"#cccccc"}
      aria-label={"loading"}
    >
      <circle cx="15" cy="15" r="15">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="1.5s"
          values="9;15;15;15;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="60"
        cy="15"
        r="9"
        attributeName="fillOpacity"
        from="1"
        to="0.3"
      >
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="1.5s"
          values="9;9;15;15;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0s"
          dur="1.5s"
          values="9;9;9;15;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
