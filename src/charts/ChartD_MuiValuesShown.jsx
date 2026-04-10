// CHART D — MUI X Sankey: Values on Links + Plump Curves
// Shows values directly on the flow paths, wider curve correction

import React from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { buildMuiData, tvsColors, tvsFont } from './sankeyData';
import ColumnHeaders from './ColumnHeaders';
import EdgeLabels from './EdgeLabels';
import './sankeyLabelFix.css';
import './chartDLabels.css';

export default function ChartD_MuiValuesShown() {
  const { nodes, links } = buildMuiData();

  return (
    <div style={{ width: '100%', ...tvsFont }}>
      <div className="hide-edge-labels chart-d-labels" style={{ position: 'relative' }}>
      <ColumnHeaders />
      <EdgeLabels convTop="30%" />
      <SankeyChart
        height={720}
        series={{
          data: { nodes, links },
          nodeOptions: {
            showLabels: true,
            width: 16,
            padding: 75,
            sort: 'fixed',
          },
          linkOptions: {
            color: 'target',
            opacity: 0.35,
            curveCorrection: 4,
            showValues: false,
            sort: 'fixed',
          },
          valueFormatter: () => null,
        }}
        margin={{ top: 72, right: 160, bottom: 20, left: 160 }}
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
