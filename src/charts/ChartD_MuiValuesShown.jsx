// CHART D — MUI X Sankey: Values on Links + Plump Curves
// Shows values directly on the flow paths, wider curve correction

import React, { useRef, useEffect } from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { tvsFont } from './sankeyData';
import ColumnHeaders from './ColumnHeaders';
import './sankeyLabelFix.css';
import './chartELabels.css';

// Spot Pet Insurance — real data from Referral Flow CSV
// Sorted by conversions (visit→action), highest first
const spotPetData = [
  { id: 'other',   label: 'Other',                 visits: 94, conversions: 14, color: '#0E5880',
    avgMinToVisit: 15641, avgMinToConv: 4621 },
  { id: 'tvsci',   label: 'tvScientific Direct',     visits: 22, conversions: 2,  color: '#57D9AD',
    avgMinToVisit: 15096, avgMinToConv: 3152 },
  { id: 'search',  label: 'Search',                 visits: 24, conversions: 2,  color: '#147BB2',
    avgMinToVisit: 15639, avgMinToConv: 3178 },
  { id: 'social',  label: 'Social',                 visits: 15, conversions: 1,  color: '#1A9EE5',
    avgMinToVisit: 13518, avgMinToConv: 4002 },
  { id: 'display', label: 'Display/Programmatic',   visits: 20, conversions: 0,  color: '#73CDFF',
    avgMinToVisit: 14957, avgMinToConv: 13940 },
];

function formatDuration(minutes) {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${Math.round(minutes)}m`;
}

function buildSpotPetSankey() {
  const nodes = [
    { id: 'impressions', label: 'tvScientific Impressions', color: '#57D9AD' },
    ...spotPetData.map(s => ({ id: s.id, label: s.label, color: s.color })),
    { id: 'conversions', label: 'tvScientific Conversions', color: '#0CA672' },
    { id: 'no-conversion', label: 'No Conversion', color: '#E8EAED' },
  ];

  const links = [];
  spotPetData.forEach(s => {
    links.push({
      source: 'impressions', target: s.id, value: s.visits,
      tooltipLabel: `TV Impressions → ${s.label}`,
      tooltipValue: `${s.visits} visits`,
      tooltipTime: `Avg time: ${formatDuration(s.avgMinToVisit)}`,
    });
    if (s.conversions > 0) {
      links.push({
        source: s.id, target: 'conversions', value: s.conversions,
        tooltipLabel: `${s.label} → Conversions`,
        tooltipValue: `${s.conversions} conversions`,
        tooltipTime: `Avg time: ${formatDuration(s.avgMinToConv)}`,
      });
    }
    const noConv = s.visits - s.conversions;
    if (noConv > 0) {
      links.push({
        source: s.id, target: 'no-conversion', value: noConv,
        tooltipLabel: `${s.label} → No Conversion`,
        tooltipValue: `${noConv} visits`,
        tooltipTime: null,
      });
    }
  });

  return { nodes, links };
}

// Chart D palette for legend
const chartDPalette = {
  'tvScientific':         '#57D9AD',
  'Other':                '#0E5880',
  'Search':               '#147BB2',
  'Social':               '#1A9EE5',
  'Display/Programmatic': '#73CDFF',
};

const VISIT_NODE_IDS = ['other', 'tvsci', 'search', 'social', 'display'];
const LABEL_GAP = 14;

const EDGE_LABELS = {
  'impressions': 'tvScientific Impressions',
  'conversions': 'tvScientific Conversions',
  'no-conversion': 'No Conversion',
};

export default function ChartD_MuiValuesShown() {
  const { nodes, links } = buildSpotPetSankey();
  const chartRef = useRef(null);

  useEffect(() => {
    function placeEdgeLabels() {
      if (!chartRef.current) return;
      const svg = chartRef.current.querySelector('svg');
      if (!svg) return;

      const allReady = Object.keys(EDGE_LABELS).every(id => svg.querySelector(`text[data-node="${id}"]`));
      if (!allReady) return;

      svg.querySelectorAll('.chart-e-edge-label').forEach(el => el.remove());
      svg.querySelectorAll('.chart-e-visit-label').forEach(el => el.remove());

      // Visit-column labels — centered above each stream node
      VISIT_NODE_IDS.forEach(id => {
        const builtinLabel = svg.querySelector(`text[data-node="${id}"]`);
        if (!builtinLabel) return;

        const labelY = parseFloat(builtinLabel.getAttribute('y'));
        let bestRect = null;
        let bestDist = Infinity;
        svg.querySelectorAll('rect').forEach(r => {
          const ry = parseFloat(r.getAttribute('y'));
          const rh = parseFloat(r.getAttribute('height'));
          const dist = Math.abs(ry + rh / 2 - labelY);
          if (dist < bestDist) { bestDist = dist; bestRect = r; }
        });

        if (bestRect) {
          const rectX = parseFloat(bestRect.getAttribute('x'));
          const rectW = parseFloat(bestRect.getAttribute('width'));
          const rectY = parseFloat(bestRect.getAttribute('y'));
          const nodeData = spotPetData.find(s => s.id === id);
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('class', 'chart-e-visit-label');
          text.setAttribute('x', rectX + rectW / 2);
          text.setAttribute('y', rectY - LABEL_GAP);
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('fill', '#1e293b');
          text.setAttribute('font-size', '12px');
          text.setAttribute('font-weight', '700');
          text.setAttribute('font-family', '"Noto Sans JP", sans-serif');
          text.setAttribute('pointer-events', 'none');
          text.textContent = nodeData?.label || id;
          svg.appendChild(text);
        }
      });

      // Edge labels — positioned beside impression/conversion/no-conversion nodes
      Object.entries(EDGE_LABELS).forEach(([id, label]) => {
        const builtinLabel = svg.querySelector(`text[data-node="${id}"]`);
        if (!builtinLabel) return;

        const labelY = parseFloat(builtinLabel.getAttribute('y'));

        // Find matching rect
        let bestRect = null;
        let bestDist = Infinity;
        svg.querySelectorAll('rect').forEach(r => {
          const ry = parseFloat(r.getAttribute('y'));
          const rh = parseFloat(r.getAttribute('height'));
          const dist = Math.abs(ry + rh / 2 - labelY);
          if (dist < bestDist) { bestDist = dist; bestRect = r; }
        });

        if (bestRect) {
          const rectX = parseFloat(bestRect.getAttribute('x'));
          const rectW = parseFloat(bestRect.getAttribute('width'));
          const rectY = parseFloat(bestRect.getAttribute('y'));
          const rectH = parseFloat(bestRect.getAttribute('height'));
          const isLeft = id === 'impressions';

          const textX = isLeft ? rectX - 12 : rectX + rectW + 12;
          const textY = rectY + rectH / 2;
          const anchor = isLeft ? 'end' : 'start';
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('class', 'chart-e-edge-label');
          text.setAttribute('x', textX);
          text.setAttribute('text-anchor', anchor);
          text.setAttribute('fill', '#1e293b');
          text.setAttribute('font-size', '14px');
          text.setAttribute('font-weight', '700');
          text.setAttribute('font-family', '"Noto Sans JP", sans-serif');
          text.setAttribute('pointer-events', 'none');

          // Split two-word tvScientific labels into two lines
          const lines = (id === 'conversions' || id === 'impressions') ? ['tvScientific', id === 'impressions' ? 'Impressions' : 'Conversions'] : [label];
          lines.forEach((line, i) => {
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.setAttribute('x', textX);
            tspan.setAttribute('dy', i === 0 ? (lines.length > 1 ? '-0.6em' : '0') : '1.2em');
            tspan.setAttribute('dominant-baseline', lines.length === 1 ? 'central' : 'auto');
            tspan.textContent = line;
            text.appendChild(tspan);
          });
          text.setAttribute('y', textY);
          svg.appendChild(text);
        }
      });
    }

    const t1 = setTimeout(placeEdgeLabels, 100);
    const t2 = setTimeout(placeEdgeLabels, 300);
    const t3 = setTimeout(placeEdgeLabels, 600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ width: '100%', ...tvsFont }}>
      <div className="hide-edge-labels chart-e-labels" ref={chartRef} style={{ position: 'relative' }}>
      <ColumnHeaders />
      <SankeyChart
        height={620}
        series={{
          data: { nodes, links },
          nodeOptions: {
            showLabels: true,
            width: 16,
            padding: 50,
            sort: 'fixed',
          },
          linkOptions: {
            color: 'target',
            opacity: 0.35,
            curveCorrection: 4,
            showValues: false,
            sort: 'fixed',
          },
          valueFormatter: (value, context) => {
            if (!context?.dataIndex && context?.dataIndex !== 0) return `${value}`;
            const link = links[context.dataIndex];
            if (!link) return `${value}`;
            const parts = [link.tooltipValue];
            if (link.tooltipTime) parts.push(link.tooltipTime);
            return parts.join(' · ');
          },
        }}
        margin={{ top: 96, right: 160, bottom: 20, left: 160 }}
      />
      </div>

    </div>
  );
}
