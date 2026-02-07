import "./../utilities/webgpuShim";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import { loadImage } from "./../utilities/iconService";

const MapView = ({ nodes = [], links = [], onSelectAccount, selectedId }) => {
  const [iconCache, setIconCache] = useState({});
  const [is3D, setIs3D] = useState(false);
  const fgRef = useRef();

  // Load icons into cache
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

  // Handle auto-zoom when switching modes
  useEffect(() => {
    if (fgRef.current) {
      setTimeout(() => {
        // Works for both 2D and 3D refs
        fgRef.current.zoomToFit(400, 100);
      }, 100);
    }
  }, [is3D]);

  // --- 3D NODE GENERATOR ---
  const getNodeThreeObject = useCallback((node) => {
    const isSelected = node.id === selectedId;
    const isConn = !!node.accounts;
    const img = iconCache[node.id];
    
    const group = new THREE.Group();

    // 1. Base Sphere
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(isConn ? 8 : 5),
      new THREE.MeshLambertMaterial({ 
        color: isSelected ? "#3b82f6" : (isConn ? "#1e1e1e" : "#ffffff"),
        transparent: true,
        opacity: 0.9 
      })
    );
    group.add(sphere);

    // 2. Icon Sprite
    if (img) {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        depthTest: false,
        transparent: true
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(isConn ? 10 : 7, isConn ? 10 : 7, 1);
      group.add(sprite);
    }

    // 3. Label
    const labelText = (isConn ? node.type : node.name).toUpperCase();
    const label = new SpriteText(labelText);
    label.color = isSelected ? "#3b82f6" : (isConn ? "#60a5fa" : "#9ca3af");
    label.textHeight = isConn ? 4 : 3;
    label.fontWeight = "600";
    label.position.y = isConn ? -14 : -10;
    group.add(label);

    return group;
  }, [selectedId, iconCache]);

  return (
    <div className="w-full h-full relative bg-[#0a0a0a]">
      {/* View Toggle Button */}
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
          graphData={{ nodes, links }}
          backgroundColor="#0a0a0a"
          onNodeClick={(node) => onSelectAccount(node)}
          nodeThreeObject={getNodeThreeObject}
          nodeThreeObjectExtend={false}
          linkWidth={1.5}
          linkColor={() => "rgba(255, 255, 255, 0.1)"}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.5}
          linkDirectionalParticleSpeed={0.006}
        />
      ) : (
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

            // Selection Glow
            if (isSelected) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size + 5, 0, 2 * Math.PI);
              ctx.fillStyle = "rgba(59, 130, 246, 0.25)";
              ctx.fill();
            }

            // Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = isConn ? "#1e1e1e" : "#FFFFFF";
            ctx.fill();

            // Icon Drawing
            if (img) {
              const iconSize = size * 0.7;
              ctx.drawImage(
                img,
                node.x - iconSize,
                node.y - iconSize,
                iconSize * 2,
                iconSize * 2
              );
            }

            // Labels (conditional on zoom level or selection)
            if (globalScale > 1.2 || isSelected) {
              const label = isConn ? node.type : node.name;
              const fontSize = (isConn ? 9 : 7) / globalScale;
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
          linkWidth={1.5}
          linkColor={() => "rgba(255, 255, 255, 0.08)"}
        />
      )}
    </div>
  );
};

export default MapView;