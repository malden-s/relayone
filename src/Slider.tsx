import React, { PureComponent } from "react";
import InputRange from "./react-input-range/js/input-range/input-range";

import { formatCurrency } from "./utils";

import "./Slider.scss";
import "./react-input-range/scss/index.scss";
import { SyntheticInputEvent } from "react-number-format";

export interface SliderProps {
  editable: boolean;
  loading: boolean;
  loadingMessage: string;
  success: boolean;
  disabled: boolean;
  successMessagePrefix: string;
  error: boolean;
  errorMessage: string;
  onSlideComplete: Function;
  onSliderReachEnd: Function;
  onSliderChange: Function;
  onInputChange: (value: string) => void;
  currency: string;
  inputValue: string;
  displayValue: string;
}

export interface SliderState {
  value: number;
  editing: boolean;
  inputValue: string;
}

class Slider extends PureComponent<SliderProps, SliderState> {
  static defaultProps: Partial<SliderProps> = {
    editable: false,
    loading: false,
    loadingMessage: "Processing",
    success: false,
    successMessagePrefix: "Paid",
    error: false,
    errorMessage: "Try again",
    onSlideComplete: () => {},
    onSliderReachEnd: () => {},
    onSliderChange: () => {},
    onInputChange: (val: string) => {},
    currency: "",
    inputValue: ""
  };

  state = {
    value: 0,
    editing: false,
    inputValue: ""
  };

  componentDidUpdate(prevProps: SliderProps) {
    if (prevProps.inputValue !== this.props.inputValue) {
      this.setState({ inputValue: this.props.inputValue });
    }
  }

  onInputChange = (e: SyntheticInputEvent) => {
    const inputValue = e.target.value;
    this.setState({ inputValue: inputValue.replace(/[^0-9.]/gi, "") });
  };

  stopEditing = () => {
    if (this.state.inputValue) {
      this.props.onInputChange(this.state.inputValue);
    }
    this.setState({ editing: false });
  };

  stateRenderMap = {
    loading: () => {
      const { loadingMessage } = this.props;

      return <div className="loading-title">{loadingMessage}</div>;
    },
    success: () => {
      const { successMessagePrefix } = this.props;
      const successTitle = `${successMessagePrefix}`;

      return (
        <React.Fragment>
          <div className="success-title">{successTitle}</div>
          <div className="success-title-value"></div>
        </React.Fragment>
      );
    },
    error: () => {
      const { errorMessage } = this.props;

      return <div className="error-title">{errorMessage}</div>;
    },
    default: () => {
      // ToDo - map currency codes to currency display names
      const currencyName = this.props.currency;

      return (
        <React.Fragment>
          <div className="value-input-currency">{currencyName}</div>
          {!this.state.editing && (
            <div
              className={
                "value-input value-input_display" +
                (this.props.editable ? " value-input_editable" : "")
              }
              onClick={() =>
                !this.props.disabled &&
                this.props.editable &&
                this.setState({ editing: true })
              }
            >
              {formatCurrency(this.props.displayValue, currencyName)}
            </div>
          )}
          {this.state.editing && (
            <input
              autoFocus
              className="value-input"
              value={this.state.inputValue}
              placeholder={"Amount"}
              onChange={this.onInputChange}
              onBlur={this.stopEditing}
              onKeyDown={e => e.key === "Enter" && this.stopEditing()}
            />
          )}
        </React.Fragment>
      );
    }
  };

  onSliderChange = value => {
    this.props.onSliderChange(value);
    this.setState({ value });
  };

  getTheme() {
    const { loading, success, error } = this.props;

    if (loading) {
      return "loading-theme";
    }

    if (success) {
      return "success-theme";
    }

    if (error) {
      return "error-theme";
    }

    if (this.state.value >= 9.5) {
      return "completed-theme";
    }

    if (this.props.disabled) {
      return "empty-theme";
    }

    return "";
  }

  getRenderContentMethod() {
    const { loading, success, error } = this.props;

    if (loading) {
      return this.stateRenderMap["loading"];
    }

    if (success) {
      return this.stateRenderMap["success"];
    }

    if (error) {
      return this.stateRenderMap["error"];
    }

    return this.stateRenderMap["default"];
  }

  paidProccess = () => {
    this.props.onSlideComplete(this.state.value);
    if (this.state.value >= 9.5) {
      this.props.onSliderReachEnd(this.state.value);
      setTimeout(() => this.setState({ value: 0 }), 10);
      return;
    }
    setTimeout(() => this.setState({ value: 0 }), 10);
  };

  renderSliderContent() {
    const renderContent = this.getRenderContentMethod();

    return <div className="value-input-container">{renderContent()}</div>;
  }

  renderSlider() {
    const { loading, success, error, disabled } = this.props;
    const isDisabled = loading || success || error || disabled;
    const theme = this.getTheme();

    return (
      <div className={`slider-wrapper ${theme}`}>
        <InputRange
          maxValue={10}
          minValue={0}
          value={this.state.value}
          onChange={this.onSliderChange}
          onChangeComplete={this.paidProccess}
          step={0.1}
          disabled={isDisabled}
        />
      </div>
    );
  }

  render() {
    const theme = this.getTheme();

    return (
      <div className={`relay-button ${theme}`}>
        {this.renderSliderContent()}
        {this.renderSlider()}
      </div>
    );
  }
}

export default Slider;
