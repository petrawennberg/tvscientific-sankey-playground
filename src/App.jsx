import { useState } from 'react';
import ChartA_Recharts from './charts/ChartA_Recharts';
import ChartB_MuiSourceColor from './charts/ChartB_MuiSourceColor';
import ChartC_MuiTargetColor from './charts/ChartC_MuiTargetColor';
import ChartD_MuiValuesShown from './charts/ChartD_MuiValuesShown';
import ChartE_MuiBrandColors from './charts/ChartE_MuiBrandColors';

const charts = [
  {
    id: 'A',
    label: 'Chart A: Original (Recharts)',
    description: 'Faithful port of the current Recharts implementation. Source-colored links, time labels on flows, custom node rendering.',
    Component: ChartA_Recharts,
  },
  {
    id: 'B',
    label: 'Chart B: MUI X — Source-Colored Links',
    description: 'MUI X Sankey with links colored by their source node. Clean default labels.',
    Component: ChartB_MuiSourceColor,
  },
  {
    id: 'C',
    label: 'Chart C: MUI X — Target-Colored Links',
    description: 'MUI X Sankey with links colored by their target node. Highlights where traffic ends up.',
    Component: ChartC_MuiTargetColor,
  },
  {
    id: 'D',
    label: 'Chart D: MUI X — Values on Links + Plump Curves',
    description: 'MUI X Sankey with value labels shown on links, wider curve correction for a bolder visual.',
    Component: ChartD_MuiValuesShown,
  },
  {
    id: 'E',
    label: 'Chart E: MUI X — Brand Colors',
    description: 'MUI X Sankey using actual brand colors: Meta blue, Google blue, Snap yellow, Pinterest red, tvScientific green.',
    Component: ChartE_MuiBrandColors,
  },
];

export default function App() {
  const [activeChart, setActiveChart] = useState('A');
  const current = charts.find((c) => c.id === activeChart);

  return (
    <div style={{ fontFamily: '"Noto Sans JP", sans-serif', maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', margin: 0 }}>
        Sankey Chart Playground
      </h1>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: 24 }}>
        {charts.map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            style={{
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: activeChart === chart.id ? 700 : 500,
              color: activeChart === chart.id ? '#1DAFFF' : '#64748b',
              background: 'none',
              border: 'none',
              borderBottom: activeChart === chart.id ? '2px solid #1DAFFF' : '2px solid transparent',
              marginBottom: -2,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {chart.label}
          </button>
        ))}
      </div>

      {/* Active chart */}
      {current && (
        <div>
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '40px 44px',
            background: '#fff',
          }}>
            <current.Component />
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 32 }}>
        Data: src/charts/sankeyData.js | Charts: src/charts/Chart[A-D]_*.jsx
      </p>
    </div>
  );
}
