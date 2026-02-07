import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { loadImage } from './../utilities/iconService';

const MapView = ({ nodes = [], links = [], onSelectAccount, selectedId }) => {
  const [iconCache, setIconCache] = useState({});
  const [is3D, setIs3D] = useState(false);
  const fgRef = useRef();

  useEffect(() => {
    nodes.forEach(async (node) => {
      if (!iconCache[node.id]) {
        try {
          const iconKey = node.accounts ? node.type : node.name;
          const img = await loadImage(iconKey); 
          setIconCache(prev => ({ ...prev, [node.id]: img }));
        } catch (e) {}
      }
    });
  }, [nodes]);

  useEffect(() => {
    if (is3D && fgRef.current) {
      setTimeout(() => {
        fgRef.current.zoomToFit(400, 100);
      }, 100);
    }
  }, [is3D]);

  const getNodeThreeObject = (node) => {
    const isSelected = node.id === selectedId;
    const isConn = !!node.accounts;
    const img = iconCache[node.id];
    
    const group = new THREE.Group();

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(isConn ? 8 : 5),
      new THREE.MeshLambertMaterial({ 
        color: isSelected ? '#3b82f6' : (isConn ? '#222222' : '#ffffff'),
        transparent: true,
        opacity: 0.8 
      })
    );
    group.add(sphere);

    if (img) {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        depthTest: false
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(isConn ? 12 : 8, isConn ? 12 : 8, 1);
      group.add(sprite);
    }

    const labelText = (isConn ? node.type : node.name).toUpperCase();
    const label = new SpriteText(labelText);
    label.color = isSelected ? '#3b82f6' : '#ffffff';
    label.textHeight = isConn ? 5 : 3.5;
    label.fontWeight = 'bold';
    label.position.y = isConn ? -15 : -10;
    group.add(label);

    return group;
  };

  return (
    <div className="w-full h-full relative bg-[#0a0a0a]">
      <div className="absolute top-4 left-4 z-[999]">
        <button 
          onClick={() => setIs3D(!is3D)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full font-black text-[10px] uppercase border border-white/20 shadow-xl transition-transform active:scale-95"
        >
          {is3D ? '→ Switch to 2D' : '→ Switch to 3D'}
        </button>
      </div>

      {is3D ? (
        <ForceGraph3D
          ref={fgRef}
          graphData={{ nodes, links }}
          backgroundColor="#0a0a0a"
          onNodeClick={onSelectAccount}
          nodeThreeObject={getNodeThreeObject}
          nodeThreeObjectExtend={false} // This replaces the default sphere with our group
          linkWidth={2}
          linkColor={() => '#ffffff'}
          linkDirectionalParticles={3}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
        />
      ) : (
        <ForceGraph2D
          ref={fgRef}
          graphData={{ nodes, links }}
          backgroundColor="#0a0a0a"
          onNodeClick={onSelectAccount}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isSelected = node.id === selectedId;
            const isConn = !!node.accounts;
            const size = isConn ? 12 : 8;
            const img = iconCache[node.id];

            if (isSelected) {
              ctx.beginPath();
              ctx.arc(node.x, node.y, size + 5, 0, 2 * Math.PI);
              ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
              ctx.fill();
            }

            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
            ctx.fillStyle = isConn ? '#1e1e1e' : '#ffffff';
            ctx.fill();

            if (img) {
              const iconSize = size * 0.7;
              ctx.drawImage(img, node.x - iconSize, node.y - iconSize, iconSize * 2, iconSize * 2);
            }

            const label = isConn ? node.type : node.name;
            ctx.font = `bold ${12/globalScale}px Inter`;
            ctx.textAlign = 'center';
            ctx.fillStyle = isSelected ? '#3b82f6' : '#ffffff';
            ctx.fillText(label.toUpperCase(), node.x, node.y + size + 8);
          }}
          linkWidth={1.5}
          linkColor={() => '#ffffff'}
        />
      )}
    </div>
  );
};

export default MapView;