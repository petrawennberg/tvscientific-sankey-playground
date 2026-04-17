import { useState } from 'react';
import ChartA_Recharts from './charts/ChartA_Recharts';
import ChartB_MuiSourceColor from './charts/ChartB_MuiSourceColor';
import ChartC_MuiTargetColor from './charts/ChartC_MuiTargetColor';
import ChartD_MuiValuesShown from './charts/ChartD_MuiValuesShown';
import ChartE_MuiBrandColors from './charts/ChartE_MuiBrandColors';
import ChartF_SpotPet from './charts/ChartF_SpotPet';

const charts = [
  { id: 'A', prefix: 'Chart A:', label: 'Original (Recharts)', Component: ChartA_Recharts },
  { id: 'B', prefix: 'Chart B:', label: 'tvS Colors + Default Labels', Component: ChartB_MuiSourceColor },
  { id: 'C', prefix: 'Chart C:', label: 'tvS Colors + Edge Labels', Component: ChartC_MuiTargetColor },
  { id: 'D', prefix: 'Chart D:', label: 'Brand Colors', Component: ChartE_MuiBrandColors },
  { id: 'E', prefix: 'Chart E:', label: 'tvS Colors + Centered Labels', Component: ChartD_MuiValuesShown },
  { id: 'F', prefix: 'Chart F:', label: 'Hiding No Conversions', Component: ChartF_SpotPet },
];

export default function App() {
  const [activeChart, setActiveChart] = useState('A');
  const current = charts.find((c) => c.id === activeChart);

  return (
    <div style={{ fontFamily: '"Noto Sans JP", sans-serif', maxWidth: 1280, width: '100%', margin: '0 auto', padding: '24px 32px', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: '40px', letterSpacing: 0, color: '#1e293b', margin: '0 0 80px' }}>
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
            <strong>{chart.prefix}</strong> {chart.label}
          </button>
        ))}
      </div>

      {/* Active chart */}
      {current && (
        <div>
          <current.Component />
        </div>
      )}

      <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 32 }}>
        Data: src/charts/sankeyData.js | Charts: src/charts/Chart[A-D]_*.jsx
      </p>
    </div>
  );
}
