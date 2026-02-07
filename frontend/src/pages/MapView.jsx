import React, { useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { loadImage } from "./../utilities/iconService";

const MapView = ({ nodes = [], links = [], onSelectAccount, selectedId }) => {
  const [iconCache, setIconCache] = useState({});
  const fgRef = useRef();

  useEffect(() => {
    nodes.forEach(async (node) => {
      if (!iconCache[node.id]) {
        try {
          const iconKey = node.accounts ? node.type : node.name;
          const img = await loadImage(iconKey);
          setIconCache((prev) => ({ ...prev, [node.id]: img }));
        } catch (e) {
          console.error(`Failed to load icon for ${node.id}`);
        }
      }
    });
  }, [nodes, iconCache]);

  return (
    <div className="w-full h-full relative bg-[#0a0a0a]">
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes, links }}
        backgroundColor="#0a0a0a"
        onNodeClick={(node) => onSelectAccount(node)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const isSelected = node.id === selectedId;
          const isConn = !!node.accounts;
          const size = isConn ? 12 : 8;
          const img = iconCache[node.id];

          if (isSelected) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size + 5, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
          ctx.fillStyle = isConn ? "#1e1e1e" : "#FFFFFF";
          ctx.fill();

          if (img) {
            const iconSize = size * 0.7;
            ctx.drawImage(
              img,
              node.x - iconSize,
              node.y - iconSize,
              iconSize * 2,
              iconSize * 2,
            );
          }

          if (globalScale > 1.2 || isSelected) {
            const label = isConn ? node.type : node.name;
            const fontSize = (isConn ? 9 : 7) / globalScale; // Correct small text
            ctx.font = `600 ${fontSize}px Inter, Sans-Serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = isSelected
              ? "#3b82f6"
              : isConn
                ? "#60a5fa"
                : "#9ca3af";
            ctx.fillText(label.toUpperCase(), node.x, node.y + size + 4);
          }
        }}
        linkColor={() => "rgba(255, 255, 255, 0.08)"}
        linkWidth={1.5}
      />
    </div>
  );
};

export default MapView;
