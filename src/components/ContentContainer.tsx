import React from 'react';
import Button from './Button';

interface Props {
  authMessage?: string;
  text: string;
  primary: boolean;
  url: string;
  target?: string;
}

export default function ContentContainer(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {props.authMessage && (
        <div style={{
          color: "white",
          marginBottom: 20,
          fontSize: 16,
          width: 197,
          textAlign: 'center',
        }}>
          {props.authMessage}
        </div>
      )}
      <Button text={props.text} primary={props.primary} href={props.url} target={props.target} />
    </div>
  )
}
