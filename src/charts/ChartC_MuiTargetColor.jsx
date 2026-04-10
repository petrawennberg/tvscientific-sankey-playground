// CHART C — MUI X Sankey: Target-Colored Links
// Links inherit color from their target node

import React from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { buildMuiData, tvsColors, tvsFont } from './sankeyData';
import ColumnHeaders from './ColumnHeaders';
import EdgeLabels from './EdgeLabels';
import './sankeyLabelFix.css';

export default function ChartC_MuiTargetColor() {
  const { nodes, links } = buildMuiData();

  return (
    <div style={{ width: '100%', ...tvsFont }}>
      <div className="hide-edge-labels" style={{ position: 'relative' }}>
      <ColumnHeaders />
      <EdgeLabels />
      <SankeyChart
        height={600}
        series={{
          data: { nodes, links },
          nodeOptions: {
            showLabels: true,
            width: 16,
            padding: 40,
            sort: 'fixed',
          },
          linkOptions: {
            color: 'target',
            opacity: 0.35,
            curveCorrection: 4,
            sort: 'fixed',
          },
          valueFormatter: () => null,
        }}
        margin={{ top: 56, right: 160, bottom: 20, left: 160 }}
      />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
        {Object.entries(tvsColors).map(([source, color]) => (
          <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: color }} />
            <span style={{ fontSize: 12, fontWeight: 400, color: '#6b7280' }}>{source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
