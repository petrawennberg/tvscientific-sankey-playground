// CHART F — Spot Pet Insurance (real data)
// Based on Chart D, using Referral Flow CSV data

import React, { useRef, useEffect, useState } from 'react';
import { SankeyChart } from '@mui/x-charts-pro/SankeyChart';
import { tvsFont } from './sankeyData';
import ColumnHeaders from './ColumnHeaders';
import './sankeyLabelFix.css';
import './chartFLabels.css';

// Spot Pet Insurance — real data from Referral Flow CSV
// Sorted by conversions (visit→action), highest first
const spotPetData = [
  { id: 'other',   label: 'Other',                 visits: 94, conversions: 14, color: '#0E5880',
    avgMinToVisit: 15641, avgMinToConv: 4621 },
  { id: 'tvsci',   label: 'tvScientific',           visits: 22, conversions: 2,  color: '#57D9AD',
    avgMinToVisit: 15096, avgMinToConv: 3152 },
  { id: 'search',  label: 'Search',                 visits: 24, conversions: 2,  color: '#147BB2',
    avgMinToVisit: 15639, avgMinToConv: 3178 },
  { id: 'social',  label: 'Social',                 visits: 15, conversions: 1,  color: '#1A9EE5',
    avgMinToVisit: 13518, avgMinToConv: 4002 },
  { id: 'display', label: 'Display/Programmatic',   visits: 20, conversions: 0.001, color: '#73CDFF',
    avgMinToVisit: 14957, avgMinToConv: 13940 },
];

function formatDuration(minutes) {
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  if (days > 0) return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${Math.round(minutes)}m`;
}

// Lookup map for tooltip data
const spotPetLookup = Object.fromEntries(spotPetData.map(s => [s.id, s]));

function buildSpotPetSankey() {
  const nodes = [
    { id: 'impressions', label: 'TV Impressions', color: '#57D9AD' },
    ...spotPetData.map(s => ({ id: s.id, label: s.label, color: s.color })),
    { id: 'conversions', label: 'tvScientific Conversions', color: '#0CA672' },
  ];

  const links = [];
  spotPetData.forEach(s => {
    links.push({
      source: 'impressions', target: s.id, value: s.visits,
      tooltipLabel: `TV Impressions → ${s.label}`,
      tooltipValue: `${s.visits} visits`,
      tooltipTime: `Avg time: ${formatDuration(s.avgMinToVisit)}`,
    });
    links.push({
      source: s.id, target: 'conversions', value: s.conversions,
      tooltipLabel: `${s.label} → Conversions`,
      tooltipValue: s.conversions >= 1 ? `${s.conversions} conversions` : 'No conversions',
      tooltipTime: s.conversions >= 1 ? `Avg time: ${formatDuration(s.avgMinToConv)}` : null,
    });
  });

  return { nodes, links };
}

// Chart F palette for legend
const chartDPalette = {
  'tvScientific':         '#57D9AD',
  'Other':                '#0E5880',
  'Search':               '#147BB2',
  'Social':               '#1A9EE5',
  'Display/Programmatic': '#73CDFF',
};

const VISIT_NODE_IDS = ['other', 'tvsci', 'search', 'social', 'display'];
const LABEL_GAP = 14; // px above node top edge

export default function ChartF_SpotPet() {
  const { nodes, links } = buildSpotPetSankey();
  const chartRef = useRef(null);

  useEffect(() => {
    function placeLabels() {
      if (!chartRef.current) return;
      const svg = chartRef.current.querySelector('svg');
      if (!svg) return;

      // Check all visit nodes are rendered
      const allReady = VISIT_NODE_IDS.every(id => svg.querySelector(`text[data-node="${id}"]`));
      if (!allReady) return;

      // Remove any previously injected labels
      svg.querySelectorAll('.chart-f-custom-label').forEach(el => el.remove());

      VISIT_NODE_IDS.forEach(id => {
        const builtinLabel = svg.querySelector(`text[data-node="${id}"]`);
        if (!builtinLabel) return;

        const labelY = parseFloat(builtinLabel.getAttribute('y'));

        // Find the rect whose vertical center is closest to this label
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
          text.setAttribute('class', 'chart-f-custom-label');
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
    }

    // Retry until the SVG nodes are ready
    const t1 = setTimeout(placeLabels, 100);
    const t2 = setTimeout(placeLabels, 300);
    const t3 = setTimeout(placeLabels, 600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ width: '100%', ...tvsFont }}>
      <div className="hide-edge-labels chart-f-labels" ref={chartRef} style={{ position: 'relative' }}>
      <ColumnHeaders labels={['TV Impressions', 'Visits', 'tvScientific Conversions']} />
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
