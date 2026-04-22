// CHART D — MUI X Sankey: Brand Colors + Time Intervals Table
// Each source uses its actual brand color

import React from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { buildMuiData, brandColors, tvsFont, timeData, demoVisitsBySource, formatTime } from './sankeyData';
import ColumnHeaders from './ColumnHeaders';
import EdgeLabels from './EdgeLabels';
import './sankeyLabelFix.css';

// Stream order matches chart top→bottom
const streamOrder = ['Snap', 'Search', 'Meta', 'tvScientific Direct', 'Email', 'Pinterest'];

export default function ChartD_MuiBrandColors() {
  const { nodes, links } = buildMuiData(undefined, brandColors);

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

      {/* Time Intervals Table */}
      <div style={{ marginTop: 32, padding: '0 16px' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13,
          fontWeight: 400,
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visits</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conversions</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conv. Rate</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Imp → Visit</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visit → Conv</th>
            </tr>
          </thead>
          <tbody>
            {streamOrder.map((source) => {
              const t = timeData[source];
              const d = demoVisitsBySource[source];
              const rate = d ? ((d.conversions / d.visits) * 100).toFixed(1) : '—';
              const color = brandColors[source];
              return (
                <tr key={source} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: color,
                      flexShrink: 0,
                      display: 'inline-block',
                    }} />
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{source}</span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#475569' }}>
                    {d ? d.visits.toLocaleString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#475569' }}>
                    {d ? d.conversions.toLocaleString() : '—'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#475569', fontWeight: 600 }}>
                    {rate}%
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#475569' }}>
                    {t ? formatTime(t.impToVisit) : '—'}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', color: '#475569' }}>
                    {t ? formatTime(t.visitToConv) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
