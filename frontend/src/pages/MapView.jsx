import "./../utilities/webgpuShim";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import { loadImage } from "./../utilities/iconService";

const MapView = ({ nodes = [], links = [], onSelectAccount, selectedId }) => {
  const [iconCache, setIconCache] = useState({});
  const [is3D, setIs3D] = useState(false);
  const fgRef = useRef();

  useEffect(() => {
    let isMounted = true;
    const loadIcons = async () => {
      const updates = {};
      for (const node of nodes) {
        if (!iconCache[node.id]) {
          try {
            const iconKey = node.accounts ? node.type : node.name;
            const img = await loadImage(iconKey);
            
            if (img && img.width > 0 && img.height > 0) {
              updates[node.id] = img;
            }
          } catch (e) {
            console.warn(`Icon failed for ${node.id}`);
          }
        }
      }
      if (isMounted && Object.keys(updates).length > 0) {
        setIconCache(prev => ({ ...prev, ...updates }));
      }
    };
    loadIcons();
    return () => { isMounted = false; };
  }, [nodes]);

  const graphData = useMemo(() => ({
    nodes: nodes.map(n => ({ ...n, id: String(n.id) })),
    links: links.map(l => ({
      ...l,
      source: typeof l.source === 'object' ? l.source.id : String(l.source),
      target: typeof l.target === 'object' ? l.target.id : String(l.target)
    }))
  }), [nodes, links]);

  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => fgRef.current.zoomToFit(400, 100), 200);
    }
  }, [is3D]);

  // --- 3D NODE GENERATOR ---
  const getNodeThreeObject = useCallback((node) => {
    const isSelected = String(node.id) === String(selectedId);
    const isConn = !!node.accounts;
    const img = iconCache[node.id];
    const group = new THREE.Group();
    const hitBoxSize = isConn ? 12 : 9;
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(hitBoxSize),
      new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 })
    );
    group.add(hitBox);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(isConn ? 8 : 5),
      new THREE.MeshLambertMaterial({ 
        color: isSelected ? "#3b82f6" : (isConn ? "#1e1e1e" : "#ffffff"),
        transparent: true,
        opacity: 0.9 
      })
    );
    group.add(sphere);
    if (img) {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(isConn ? 10 : 7, isConn ? 10 : 7, 1);
      group.add(sprite);
    }
    const labelText = (isConn ? node.type : node.name).toUpperCase();
    const label = new SpriteText(labelText);
    label.color = isSelected ? "#3b82f6" : (isConn ? "#60a5fa" : "#9ca3af");
    label.textHeight = isConn ? 4 : 3;
    label.fontWeight = "600";
    label.position.y = isConn ? -14 : -10;
    label.raycast = () => null; 
    group.add(label);
    return group;
  }, [selectedId, iconCache]);

  return (
    <div className="w-full h-full relative bg-[#0a0a0a]">
      <div className="absolute bottom-4 left-4 z-[999]">
        <button 
          onClick={() => setIs3D(!is3D)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase border border-white/10 shadow-2xl transition-all active:scale-95"
        >
          {is3D ? "→ Switch to 2D" : "→ Switch to 3D"}
        </button>
      </div>

      {is3D ? (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          backgroundColor="#0a0a0a"
          onNodeClick={(node) => onSelectAccount(node)}
          nodeThreeObject={getNodeThreeObject}
          nodeThreeObjectExtend={false}
          linkWidth={1.5}
          linkColor={() => "rgba(255, 255, 255, 0.1)"}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleSpeed={0.006}
          hoverPrecision={2} 
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          backgroundColor="#0a0a0a"
          onNodeClick={(node) => onSelectAccount(node)}
          
          clickDistanceThreshold={10}
          
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 14, 0, 2 * Math.PI);
            ctx.fill();
          }}

          nodeCanvasObject={(node, ctx, globalScale) => {
            const isSelected = String(node.id) === String(selectedId);
            const isConn = !!node.accounts;
            const size = isConn ? 12 : 8;
            const img = iconCache[node.id];
            const hasValidImg = img && img.width > 0;

            if (isSelected) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
              ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
              ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = isConn ? "#1e1e1e" : "#FFFFFF";
            ctx.fill();

            if (hasValidImg) {
              try {
                const iconSize = size * 0.6;
                ctx.drawImage(img, node.x - iconSize, node.y - iconSize, iconSize * 2, iconSize * 2);
              } catch (e) {
                // Fallback to plain circle if draw fails
              }
            }

            const label = (isConn ? node.type : node.name || "").toUpperCase();
            const fontSize = 10 / globalScale;
            ctx.font = `600 ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.fillStyle = isSelected ? "#3b82f6" : (isConn ? "#60a5fa" : "#9ca3af");
            ctx.fillText(label, node.x, node.y + size + 5);
          }}
          linkWidth={1.2}
          linkColor={() => "rgba(255, 255, 255, 0.08)"}
        />
      )}
    </div>
  );
};

export default MapView;