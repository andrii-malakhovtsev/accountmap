import React, { useMemo, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getIconUrl, loadImage } from './../utilities/iconService';

const MapView = () => {
  const [iconCache, setIconCache] = useState({});

  const graphData = useMemo(() => ({
    nodes: [
      { id: '1', name: 'Google' },
      { id: '2', name: 'Stripe' },
      { id: '3', name: 'Discord' },
      { id: '4', name: 'GitHub' },
      { id: '5', name: 'Amazon AWS' },
      { id: '6', name: 'Slack' },
      { id: '7', name: 'Vercel' },
      { id: '8', name: 'Tailwind CSS' },
      { id: '9', name: 'Cloudflare' },
      { id: '10', name: 'Auth0' },
      { id: '11', name: 'Notion' },
      { id: '12', name: 'Figma' },
      { id: '13', name: 'OpenAI' },
      { id: '14', name: 'Datadog' },
      { id: '15', name: 'Unknown Service' }
    ],
    links: [
      { source: '1', target: '2' }, { source: '1', target: '5' },
      { source: '2', target: '4' }, { source: '5', target: '9' },
      { source: '7', target: '9' }, { source: '13', target: '5' },
      { source: '14', target: '15' }, { source: '11', target: '12' }
    ]
  }), []);

  useEffect(() => {
    graphData.nodes.forEach(async (node) => {
      if (!iconCache[node.id]) {
        const url = getIconUrl(node.name);
        const img = await loadImage(url);
        setIconCache(prev => ({ ...prev, [node.id]: img }));
      }
    });
  }, [graphData.nodes]);

  return (
    <div className="w-full h-full relative bg-[#111]">
      <ForceGraph2D
        graphData={graphData}
        backgroundColor="#111111"
        nodeRelSize={4}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 8; 
          const img = iconCache[node.id];

          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          if (img) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
            ctx.restore();
          }

          if (globalScale > 1.5) {
            const label = node.name;
            const fontSize = 10 / globalScale; 
            ctx.font = `${fontSize}px Inter, Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.fillStyle = '#9ca3af';
            ctx.fillText(label, node.x, node.y + size + 5); 
          }
        }}
        linkColor={() => '#333'}
        linkWidth={1.5}
        linkDirectionalParticles={2} // Adds moving "data" dots
        linkDirectionalParticleSpeed={0.005}
      />
    </div>
  );
};

export default MapView;