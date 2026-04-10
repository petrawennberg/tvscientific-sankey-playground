// CHART A — Original Recharts Version
// Faithful port of the original sankey_chart component

import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import { buildRechartsData, formatTime, colors } from './sankeyData';
import ColumnHeaders from './ColumnHeaders';

export default function ChartA_Recharts() {
  const data = buildRechartsData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      const linkData = d.payload;

      if (linkData && linkData.source !== undefined && linkData.target !== undefined) {
        const sourceName = data.nodes[linkData.source]?.name || 'Source';
        const targetName = data.nodes[linkData.target]?.name || 'Target';
        return (
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #e5e7eb' }}>
            <p style={{ fontWeight: 600, fontSize: 13, margin: 0 }}>{sourceName} → {targetName}</p>
            <p style={{ fontSize: 12, fontWeight: 400, color: '#6b7280', margin: '4px 0 0' }}>
              Volume: {linkData.value?.toLocaleString() || 0}
            </p>
            {linkData.avgTime && (
              <p style={{ fontSize: 12, color: '#6366f1', fontWeight: 500, margin: '4px 0 0' }}>
                Avg Time: {formatTime(linkData.avgTime)}
              </p>
            )}
          </div>
        );
      } else if (d.name) {
        return (
          <div style={{ background: '#fff', padding: 12, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
            <p style={{ fontWeight: 600, margin: 0 }}>{d.name}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative', width: '100%', height: 600 }}>
      <ColumnHeaders />
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={(props) => {
            const { x, y, width, height, payload } = props;
            const fillColor = payload.nodeColor || '#6366f1';
            const isEdgeNode = ['TV Impressions', 'Total Conversions', 'No Conversion'].includes(payload.name);
            return (
              <g>
                <rect
                  x={x} y={y} width={width} height={height}
                  fill={fillColor} fillOpacity={0.8}
                  stroke="#fff" strokeWidth={2}
                />
                <text
                  x={x - 8} y={y + height / 2}
                  textAnchor="end" dominantBaseline="middle"
                  fill="#1e293b" fontSize={isEdgeNode ? "14" : "12"} fontWeight="700"
                >
                  {payload.name}
                </text>
              </g>
            );
          }}
          link={(props) => {
            const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index } = props;
            const linkData = data.links[index];
            const midX = (sourceX + targetX) / 2;
            const midY = (sourceY + targetY) / 2;

            return (
              <g>
                <path
                  d={`
                    M${sourceX},${sourceY + linkWidth / 2}
                    C${sourceControlX},${sourceY + linkWidth / 2}
                      ${targetControlX},${targetY + linkWidth / 2}
                      ${targetX},${targetY + linkWidth / 2}
                    L${targetX},${targetY - linkWidth / 2}
                    C${targetControlX},${targetY - linkWidth / 2}
                      ${sourceControlX},${sourceY - linkWidth / 2}
                      ${sourceX},${sourceY - linkWidth / 2}
                    Z
                  `}
                  fill={linkData.color || '#94a3b8'}
                  fillOpacity={0.3}
                  stroke="none"
                />
                {linkData.avgTime && (
                  <text
                    x={midX} y={midY}
                    textAnchor="middle" fill="#374151"
                    fontSize="11" fontWeight="600"
                    style={{ pointerEvents: 'none' }}
                  >
                    ⏱ {formatTime(linkData.avgTime)}
                  </text>
                )}
              </g>
            );
          }}
          nodePadding={50}
          margin={{ top: 56, right: 160, bottom: 20, left: 160 }}
        >
          <Tooltip content={<CustomTooltip />} />
        </Sankey>
      </ResponsiveContainer>

      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16, justifyContent: 'center' }}>
        {Object.entries(colors).map(([source, color]) => (
          <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: color }} />
            <span style={{ fontSize: 12, fontWeight: 400, color: '#6b7280' }}>{source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
