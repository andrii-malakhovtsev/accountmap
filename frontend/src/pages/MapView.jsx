import React, { useMemo, useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { loadImage } from './../utilities/iconService';

const MapView = ({ nodes = [], links = [], onSelectAccount, selectedId }) => {
  const [iconCache, setIconCache] = useState({});
  const fgRef = useRef();

  const graphData = useMemo(() => ({
    nodes,
    links
  }), [nodes, links]);

  useEffect(() => {
    if (selectedId && fgRef.current) {
      const node = nodes.find(n => n.id === selectedId);
      if (node && node.x !== undefined) {
        fgRef.current.centerAt(node.x, node.y, 600);
        fgRef.current.zoom(3, 600);
      }
    }
  }, [selectedId, nodes]);

  useEffect(() => {
    nodes.forEach(async (node) => {
      if (!iconCache[node.id]) {
        try {
          const img = await loadImage(node.name); 
          setIconCache(prev => ({ ...prev, [node.id]: img }));
        } catch (e) {
          console.error(`Failed to load icon for ${node.name}`);
        }
      }
    });
  }, [nodes, iconCache]);

  return (
    <div className="w-full h-full relative bg-[#111]">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#111111"
        nodeRelSize={4}
        onNodeClick={(node) => onSelectAccount(node)}
        warmupTicks={100}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const isSelected = node.id === selectedId;
          const isHub = node.isHub;
          const size = isHub ? 14 : 8; 
          const img = iconCache[node.id];

          if (isSelected) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 6, 0, 2 * Math.PI, false);
            ctx.fillStyle = isHub ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 3, 0, 2 * Math.PI, false);
            ctx.strokeStyle = isHub ? '#3b82f6' : '#ffffff';
            ctx.lineWidth = 2 / globalScale;
            ctx.stroke();
          }

          if (isHub && !isSelected) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI, false);
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
            ctx.lineWidth = 1 / globalScale;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fillStyle = isHub ? '#1e1e1e' : '#FFFFFF';
          ctx.fill();

          if (img) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
            ctx.restore();
          }

          if (globalScale > 1.2 || isSelected) {
            const label = node.name;
            const fontSize = (isHub ? 13 : 10) / globalScale; 
            ctx.font = `${isHub ? '600' : '400'} ${fontSize}px Inter, Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillStyle = isSelected ? '#3b82f6' : (isHub ? '#60a5fa' : '#9ca3af');
            ctx.fillText(label, node.x, node.y + size + 5); 
          }
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          const size = node.isHub ? 14 : 8;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
        linkColor={() => 'rgba(255, 255, 255, 0.08)'}
        linkWidth={1.5}
        linkDirectionalParticles={1}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleWidth={2}
      />
    </div>
  );
};

export default MapView;