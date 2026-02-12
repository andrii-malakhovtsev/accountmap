import "./../utilities/webgpuShim";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import { loadImage } from "./../utilities/iconService";

const MapView = ({ nodes = [], links = [], onSelectAccount, selectedId, is3D }) => {
  const [iconCache, setIconCache] = useState({});
  const fgRef = useRef();
  const isMobile = useMemo(() => window.innerWidth < 768, []);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    let isMounted = true;
    const loadIcons = async () => {
      const updates = {};
      for (const node of nodes) {
        if (!iconCache[node.id]) {
          try {
            const iconKey = node.accounts ? node.type : node.name;
            const img = await loadImage(iconKey);
            if (img && img.width > 0) updates[node.id] = img;
          } catch (e) {}
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

  // STABILIZATION & PHYSICS
  useEffect(() => {
    if (fgRef.current) {
      const fg = fgRef.current;
      
      const linkDist = is3D ? 30 : (isMobile ? 45 : 55); 
      const chargeStr = is3D ? -100 : (isMobile ? -60 : -150);

      fg.d3Force("link").distance(linkDist);
      fg.d3Force("charge").strength(chargeStr);
      
      fg.d3Force("center").strength(0.8); 
      
      // ONLY zoom on the very first time data loads
      if (initialLoadRef.current && nodes.length > 0) {
        setTimeout(() => {
          fg.zoomToFit(400, 30);
          initialLoadRef.current = false;
        }, 300);
      }
    }
  }, [graphData, is3D, isMobile]);

  const handleCenter = () => {
    if (fgRef.current) fgRef.current.zoomToFit(600, is3D ? 20 : 40);
  };

  const getNodeThreeObject = useCallback((node) => {
    const isSelected = String(node.id) === String(selectedId);
    const isConn = !!node.accounts;
    const img = iconCache[node.id];
    const group = new THREE.Group();
    
    const baseSize = isConn ? (isMobile ? 12 : 8) : (isMobile ? 8 : 5);
    const hitBoxSize = isMobile ? baseSize * 2 : (isConn ? 12 : 9);
    
    const hitBox = new THREE.Mesh(
      new THREE.SphereGeometry(hitBoxSize),
      new THREE.MeshBasicMaterial({ visible: false, transparent: true, opacity: 0 })
    );
    group.add(hitBox);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(baseSize),
      new THREE.MeshLambertMaterial({ 
        color: isSelected ? "#3b82f6" : (isConn ? "#1e1e1e" : "#ffffff"),
        transparent: true, opacity: 0.9 
      })
    );
    group.add(sphere);

    if (img) {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      const spriteScale = isConn ? (isMobile ? 16 : 10) : (isMobile ? 12 : 7);
      sprite.scale.set(spriteScale, spriteScale, 1);
      group.add(sprite);
    }

    const labelText = (isConn ? node.type : node.name).toUpperCase();
    const label = new SpriteText(labelText);
    label.color = isSelected ? "#3b82f6" : (isConn ? "#60a5fa" : "#9ca3af");
    label.textHeight = isMobile ? 4 : 3; 
    label.fontWeight = "700";
    label.position.y = -(baseSize + 6);
    label.raycast = () => null; 
    group.add(label);
    
    return group;
  }, [selectedId, iconCache, isMobile]);

  return (
    <div id="graph-container" className="w-full h-full relative bg-[#0a0a0a] overflow-hidden">
      
      <button 
        onClick={handleCenter}
        className="absolute bottom-6 right-6 z-[100] bg-blue-600 border border-white/20 text-white p-4 rounded-full shadow-lg active:scale-90 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="3"/><path d="M3 12h3m12 0h3M12 3v3m0 12v3"/></svg>
      </button>

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
          hoverPrecision={1} 
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={graphData}
          backgroundColor="#0a0a0a"
          onNodeClick={(node) => onSelectAccount(node)}
          clickDistanceThreshold={25}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, isMobile ? 26 : 14, 0, 2 * Math.PI);
            ctx.fill();
          }}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isSelected = String(node.id) === String(selectedId);
            const isConn = !!node.accounts;
            const size = isConn ? (isMobile ? 18 : 12) : (isMobile ? 12 : 8);
            const img = iconCache[node.id];
            
            if (isSelected) {
              ctx.beginPath(); ctx.arc(node.x, node.y, size + 4, 0, 2 * Math.PI);
              ctx.fillStyle = "rgba(59, 130, 246, 0.4)"; ctx.fill();
            }

            ctx.beginPath(); ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = isConn ? "#1e1e1e" : "#FFFFFF"; ctx.fill();

            if (img && img.width > 0) {
              const iconSize = size * 0.7;
              ctx.drawImage(img, node.x - iconSize, node.y - iconSize, iconSize * 2, iconSize * 2);
            }

            const label = (isConn ? node.type : node.name || "").toUpperCase();
            
            // SMALLER TEXT & CONDITIONAL SHOWING ON MOBILE
            if (globalScale > 0.75 || isSelected) {
              const fontSize = (isMobile ? 8 : 11) / globalScale;
              ctx.font = `800 ${fontSize}px Inter, sans-serif`;
              ctx.textAlign = "center";
              ctx.fillStyle = isSelected ? "#3b82f6" : (isConn ? "#60a5fa" : "#9ca3af");
              ctx.fillText(label, node.x, node.y + size + (isMobile ? 8 : 7));
            }
          }}
          linkWidth={isMobile ? 1.2 : 1.2}
          linkColor={() => "rgba(255, 255, 255, 0.08)"}
        />
      )}
    </div>
  );
};

export default MapView;