import React from "react";
import Select from "react-select";

import DropdownIndicator from "./DropdownIndicators/DropdownIndicator";

export interface Option {
  value: number;
  label: string;
  imgUrl: string;
}

interface Props {
  currency: number;
  onChange: (currency: number) => any;
  options: Option[];
}

const customStyles = {
  container: provided => ({
    ...provided,
    display: "flex",
    justifyContent: "center",
    width: "100%"
  }),
  control: (provided, state) => ({
    ...provided,
    background: "rgb(44, 54, 79)",
    width: "100%",
    minHeight: "none",
    height: 33,
    border: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? 0 : 0
  }),
  indicatorSeparator: () => ({
    display: "none"
  }),
  indicatorsContainer: provided => ({
    ...provided,
    background: "rgb(44, 54, 79)",
    borderRadius: 4,
    border: "none",
    height: 33
  }),
  menu: provided => ({
    ...provided,
    background: "white",
    width: "100%"
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected && "none",
    color: "black"
  }),
  groupHeading: () => ({
    background: "white",
    height: 33
  }),
  singleValue: () => ({
    color: "white"
  }),
  input: provided => ({
    ...provided,
    width: 0,
    margin: 0,
    visibility: "none"
  }),
  menuList: provided => ({
    ...provided,
    height: 150,
    overflow: "scroll"
  })
};

function CurrencyDropdown(props: Props) {
  function handleChange(option: any) {
    props.onChange(option.value);
  }

  // FIXME use custom option class instead
  return (
    <Select
      components={{ DropdownIndicator }}
      value={props.options.find(o => o.value === props.currency)}
      onChange={handleChange}
      options={props.options}
      styles={customStyles}
      getOptionLabel={option =>
        (
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 11
            }}
          >
            <img
              style={{
                width: 16,
                height: 16,
                marginRight: 5
              }}
              src={option.imgUrl}
              alt=""
            />
            {option.label}
          </span>
        ) as any
      }
    />
  );
}

export default CurrencyDropdown;
