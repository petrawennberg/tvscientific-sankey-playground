// Labels for TV Impressions (left) and Conversions/No Conversion (right)
// Positioned outside the chart in the margin area

import React from 'react';

const labelStyle = {
  position: 'absolute',
  fontSize: 12,
  fontWeight: 700,
  color: '#13171A',
  whiteSpace: 'nowrap',
};

export default function EdgeLabels({ margin = { left: 160, right: 160, top: 56 } }) {
  const pad = 12;

  return (
    <>
      {/* TV Impressions — left side, vertically centered */}
      <span style={{
        ...labelStyle,
        left: pad,
        top: '50%',
        transform: 'translateY(-50%)',
        textAlign: 'right',
        width: margin.left - pad - 8,
      }}>
        TV Impressions
      </span>

      {/* Total Conversions — right side, small node near top */}
      <span style={{
        ...labelStyle,
        right: pad,
        top: '22%',
        transform: 'translateY(-50%)',
        textAlign: 'left',
        width: margin.right - pad - 8,
      }}>
        Total Conversions
      </span>

      {/* No Conversion — right side, large node filling most of the lower area */}
      <span style={{
        ...labelStyle,
        right: pad,
        top: '55%',
        transform: 'translateY(-50%)',
        textAlign: 'left',
        width: margin.right - pad - 8,
      }}>
        No Conversion
      </span>
    </>
  );
}
