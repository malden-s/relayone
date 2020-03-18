import React from "react";
import { components } from "react-select";

export default function DropdownIndicator(props) {
  const Dropdown: any = components.DropdownIndicator;
  return (
    <Dropdown {...props}>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "8px solid rgb(76, 154, 255)"
        }}
      />
    </Dropdown>
  );
}
