import { MARVEL_TITLES } from './src/data/marvelTitles';
import * as fs from 'fs';
import * as path from 'path';

const NODE_SPACING_X = 280;
const ROW_SPACING_Y = 160;

// Track current X coordinate per track/row
const trackX: Record<string, number> = {
  core: 0,
  cosmic: 0,
  street: 0,
  magic: 0,
  fox: 0,
  sony: 0,
  other: 0,
};

// Y coordinates for each track
const trackY: Record<string, number> = {
  cosmic: -ROW_SPACING_Y * 2,
  magic: -ROW_SPACING_Y * 1,
  core: 0,
  street: ROW_SPACING_Y * 1,
  fox: -ROW_SPACING_Y * 3,
  sony: ROW_SPACING_Y * 2,
  other: ROW_SPACING_Y * 3,
};

const nodes: any[] = [];
const edges: any[] = [];

// Determine track based on title
function getTrack(t: any) {
  const title = t.title.toLowerCase();
  if (t.category === 'fox-xmen' || title.includes('x-men') || title.includes('deadpool') || title.includes('wolverine') || title.includes('logan') || title.includes('mutants') || title.includes('phoenix') || title.includes('legion') || title.includes('gifted')) return 'fox';
  if (t.category === 'sony-spiderverse' || title.includes('venom') || title.includes('morbius') || title.includes('madame web') || title.includes('kraven')) return 'sony';
  if (title.includes('spider-man')) return 'core'; // MCU Spidey
  
  if (title.includes('daredevil') || title.includes('punisher') || title.includes('jessica jones') || title.includes('luke cage') || title.includes('defenders') || title.includes('iron fist') || title.includes('echo') || title.includes('hawkeye') || title.includes('cloak & dagger') || title.includes('runaways') || title.includes('moon knight')) return 'street';
  
  if (title.includes('guardians') || title.includes('thor') || title.includes('captain marvel') || title.includes('marvels') || title.includes('eternals') || title.includes('nova')) return 'cosmic';
  
  if (title.includes('strange') || title.includes('wandavision') || title.includes('agatha') || title.includes('blade') || title.includes('ghost rider') || title.includes('helstrom')) return 'magic';

  return 'core'; // default to core
}

let prevNodeByTrack: Record<string, any> = {};
let prevCoreNode: any = null;

MARVEL_TITLES.forEach((title, i) => {
  const track = getTrack(title);
  
  // Advance X based on the current track's counter, but ensure we keep moving forward in time overall
  const minX = (i * 120); // ensure overall forward progression based on release index
  const x = Math.max(trackX[track], minX);
  const y = trackY[track];

  nodes.push({
    id: title.id,
    title: title,
    x: x,
    y: y,
    track: track
  });

  // Create an edge from the previous node in the same track
  if (prevNodeByTrack[track]) {
    edges.push({
      id: `e_${prevNodeByTrack[track].id}_${title.id}`,
      source: prevNodeByTrack[track].id,
      target: title.id,
      type: track
    });
  }

  // Cross-link to core if it's an Avengers movie
  if (title.title.includes('Avengers') && track !== 'core') {
     edges.push({
       id: `e_cross_${prevCoreNode ? prevCoreNode.id : nodes[0].id}_${title.id}`,
       source: prevCoreNode ? prevCoreNode.id : nodes[0].id,
       target: title.id,
       type: 'crossover'
     });
  }

  trackX[track] = x + NODE_SPACING_X;
  prevNodeByTrack[track] = title;
  if (track === 'core') prevCoreNode = title;
});

const output = `// Auto-generated timeline data
import { MarvelTitle } from '@/types';

export interface TimelineNode {
  id: string;
  title: MarvelTitle;
  x: number;
  y: number;
  track: string;
}

export interface TimelineEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export const TIMELINE_NODES: TimelineNode[] = ${JSON.stringify(nodes, null, 2)};
export const TIMELINE_EDGES: TimelineEdge[] = ${JSON.stringify(edges, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/timelineData.ts'), output);
console.log('Generated src/data/timelineData.ts with ' + nodes.length + ' nodes and ' + edges.length + ' edges.');
