import React, { useEffect, useState } from 'react';

export default function ExpiredTimer(props) {
  const [countdown, setCountdown] = useState(props.timeout)

  useEffect(() => {
    let interval;
    if (countdown && countdown > 0)
      interval = setInterval(() => setCountdown(countdown - 0.5), 500);
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  return (
    <div style={{
      fontSize: 12,
      color: 'rgb(144, 148, 156)',
      textAlign: 'center',
    }}>
      Expires in {countdown.toFixed(0)}s
    </div>
  )
}
