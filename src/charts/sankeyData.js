// Shared data for all Sankey chart variants
// Edit this file to change data across all charts

// Original palette (Chart A)
export const colors = {
  'tvScientific Direct': '#6366f1',
  'Meta': '#ec4899',
  'Search': '#eab308',
  'Email': '#8b5cf6',
  'Snap': '#f97316',
  'Pinterest': '#10b981',
};

// tvScientific Style Library font + color (Charts B, C, D)
export const tvsFont = {
  fontFamily: '"Noto Sans JP", sans-serif',
  fontWeight: 900,
  color: '#13171A',
};

// tvScientific Style Library palette (Charts B, C, D)
export const tvsColors = {
  'tvScientific Direct': '#0CA672',
  'Meta': '#1DAFFF',
  'Search': '#99DBFF',
  'Email': '#57D9AD',
  'Snap': '#0E5880',
  'Pinterest': '#06734E',
};

// Brand colors palette (Chart E)
export const brandColors = {
  'tvScientific Direct': '#0CA672',
  'Meta': '#1877F2',
  'Search': '#4285F4',
  'Email': '#7C3AED',
  'Snap': '#FFFC00',
  'Pinterest': '#E60023',
};

export const sourceLabels = {
  direct_tv: 'tvScientific Direct',
  social: 'Meta',
  paid_search: 'Search',
  referral: 'Email',
  organic: 'Snap',
  other: 'Pinterest',
};

export const timeData = {
  'tvScientific Direct': { impToVisit: 12, visitToConv: 180 },
  'Meta':                { impToVisit: 45, visitToConv: 240 },
  'Search':              { impToVisit: 30, visitToConv: 120 },
  'Email':               { impToVisit: 60, visitToConv: 360 },
  'Snap':                { impToVisit: 38, visitToConv: 200 },
  'Pinterest':           { impToVisit: 25, visitToConv: 150 },
};

// Demo visit data (replace with real props in production)
export const demoVisitsBySource = {
  'Snap':                { visits: 270, conversions: 35 },
  'Search':              { visits: 480, conversions: 102 },
  'tvScientific Direct': { visits: 850, conversions: 145 },
  'Meta':                { visits: 620, conversions: 88 },
  'Email':               { visits: 310, conversions: 42 },
  'Pinterest':           { visits: 190, conversions: 28 },
};

export function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Build Recharts-format data (nodes + links with indices)
export function buildRechartsData(visitsBySource = demoVisitsBySource) {
  const sources = Object.keys(visitsBySource);

  const nodes = [
    { name: 'TV Impressions', nodeColor: '#6366f1' },
    ...sources.map(s => ({ name: `${s} Visits`, nodeColor: colors[s] || '#94a3b8' })),
    { name: 'Total Conversions', nodeColor: '#0CA672' },
    { name: 'No Conversion', nodeColor: '#C4C9D0' },
  ];

  const links = [];
  const convIdx = sources.length + 1;
  const noConvIdx = sources.length + 2;

  sources.forEach((source, i) => {
    const t = timeData[source] || { impToVisit: 30, visitToConv: 180 };
    const { visits, conversions } = visitsBySource[source];

    // Impressions → Source Visits
    links.push({
      source: 0,
      target: i + 1,
      value: visits,
      color: colors[source] || '#94a3b8',
      avgTime: t.impToVisit,
    });
    // Source Visits → Conversions
    if (conversions > 0) {
      links.push({
        source: i + 1,
        target: convIdx,
        value: conversions,
        color: colors[source] || '#94a3b8',
        avgTime: t.visitToConv,
      });
    }
    // Source Visits → No Conversion
    const noConv = visits - conversions;
    if (noConv > 0) {
      links.push({
        source: i + 1,
        target: noConvIdx,
        value: noConv,
        color: colors[source] || '#94a3b8',
        avgTime: null,
      });
    }
  });

  return { nodes, links };
}

// Build MUI X format data (nodes with id/label/color + links with source/target as ids)
export function buildMuiData(visitsBySource = demoVisitsBySource, palette = tvsColors) {
  const sources = Object.keys(visitsBySource);

  const nodes = [
    { id: 'impressions', label: 'TV Impressions', color: palette['tvScientific Direct'] },
    ...sources.map(s => ({
      id: s.toLowerCase().replace(/\s+/g, '-'),
      label: `${s} Visits`,
      color: palette[s] || '#94a3b8',
    })),
    { id: 'conversions', label: 'Total Conversions', color: '#0CA672' },
    { id: 'no-conversion', label: 'No Conversion', color: '#C4C9D0' },
  ];

  const links = [];
  sources.forEach(source => {
    const sourceId = source.toLowerCase().replace(/\s+/g, '-');
    const { visits, conversions } = visitsBySource[source];

    links.push({ source: 'impressions', target: sourceId, value: visits });
    if (conversions > 0) {
      links.push({ source: sourceId, target: 'conversions', value: conversions });
    }
    const noConv = visits - conversions;
    if (noConv > 0) {
      links.push({ source: sourceId, target: 'no-conversion', value: noConv });
    }
  });

  return { nodes, links };
}
