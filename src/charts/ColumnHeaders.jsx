// Shared column headers — positioned inside the chart area
// Uses absolute positioning to sit in the top margin of the chart

import React from 'react';

const headerStyle = {
  fontSize: 13,
  fontWeight: 700,
  color: '#1e293b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  position: 'absolute',
  top: 4,
};

export default function ColumnHeaders({ margin = { left: 160, right: 160 }, labels = ['Impressions', 'Visits', 'Conversions'] }) {
  return (
    <>
      <span style={{ ...headerStyle, left: margin.left }}>{labels[0]}</span>
      <span style={{ ...headerStyle, left: '50%', transform: 'translateX(-50%)' }}>{labels[1]}</span>
      <span style={{ ...headerStyle, right: margin.right }}>{labels[2]}</span>
    </>
  );
}
