import * as React from "react";

let qrcode = require("qrcode-generator");

interface Props {
  url: string;
  size?: number;
}

export default class QRCode extends React.Component<Props> {
  generateQrCode() {
    if (!this.props.url) {
      console.warn("rendering empty qr code");
    }
    const typeNumber = 0;
    const errorCorrectionLevel = "H";

    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(this.props.url);
    qr.make();
    return qr;
  }

  render() {
    const size = this.props.size || 120;
    let qr = this.generateQrCode();

    if (!qr) {
      console.warn("error", qr, this.props.url);
    }
    let svg = qr.createSvgTag({ scalable: true });
    return (
      <>
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: size, height: size }}
        />
      </>
    );
  }
}
