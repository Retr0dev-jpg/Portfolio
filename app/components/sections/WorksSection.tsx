'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import AnimatedSection from '../ui/AnimatedSection';

const nodeKeys = ['node1', 'node2', 'node3', 'node4', 'nodeCV'] as const;
type NodeId = typeof nodeKeys[number];
type NodePositions = Record<NodeId, { x: number; y: number }>;

export default function WorksSection() {

  const [nodePositions, setNodePositions] = useState<NodePositions>({
    node1: { x: 15, y: 30 },
    node2: { x: 45, y: 50 },
    node3: { x: 85, y: 30 },
    node4: { x: 50, y: 80 },
    nodeCV: { x: 50, y: 0 }
  });

  const [draggingNode, setDraggingNode] = useState<NodeId | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const [pinnedNode, setPinnedNode] = useState<NodeId | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>('node1');
  const [dragHasMoved, setDragHasMoved] = useState(false);

  const isNodeActive = useCallback(
    (nodeId: NodeId) => {
      if (pinnedNode) return pinnedNode === nodeId;
      return hoveredNode === nodeId;
    },
    [hoveredNode, pinnedNode]
  );

  const handleNodeDrag = useCallback((nodeId: NodeId, e: MouseEvent) => {
    if (draggingNode !== nodeId) return;
    
    const container = document.getElementById('works-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const offsetX = dragOffset?.x ?? 0;
    const offsetY = dragOffset?.y ?? 0;
    const mouseX = e.clientX - rect.left - offsetX;
    const mouseY = e.clientY - rect.top - offsetY;
    const x = (mouseX / rect.width) * 100;
    const y = (mouseY / rect.height) * 100;
    
    const constrainedX = Math.max(5, Math.min(95, x));
    const constrainedY = Math.max(5, Math.min(95, y));
    
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: { x: constrainedX, y: constrainedY }
    }));
    setDragHasMoved(true);
  }, [draggingNode, dragOffset]);

  const handleNodeMouseDown = (nodeId: NodeId, e: React.MouseEvent<HTMLDivElement>) => {
    const draggableElement = (e.target as HTMLElement)?.closest('[data-node-draggable="true"]');
    if (!draggableElement) return;
    const container = document.getElementById('works-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const currentNode = nodePositions[nodeId];
    const nodeCenterX = (currentNode.x / 100) * rect.width;
    const nodeCenterY = (currentNode.y / 100) * rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - nodeCenterX,
      y: mouseY - nodeCenterY
    });
    setDraggingNode(nodeId);
    setDragHasMoved(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingNode) {
        handleNodeDrag(draggingNode, e);
      }
    };
    
    const handleMouseUp = () => {
      if (draggingNode) {
        window.dispatchEvent(new CustomEvent('node-drag-end'));
        if (!dragHasMoved) {
          if (draggingNode === 'nodeCV') {
            window.open('/CV/CV%20Cannizzaro%20Marco%20Simone.pdf', '_blank');
          } else {
            setPinnedNode((prev) => (prev === draggingNode ? null : draggingNode));
          }
        }
      }
      setDraggingNode(null);
      setDragOffset(null);
      setDragHasMoved(false);
    };
    
    if (draggingNode) {
      window.dispatchEvent(new CustomEvent('node-drag-start'));
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNode, dragHasMoved, handleNodeDrag]);

  return (
    <AnimatedSection id="works" title="Works" variant="right" showTitle={false}>
      {/* Mobile: accordion cards */}
      <div className="md:hidden w-full space-y-3">

        {/* Card 01 - Metapack */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            className="w-full p-4 text-left flex items-start gap-3 relative overflow-hidden"
            onClick={() => setExpandedCard(expandedCard === 'node1' ? null : 'node1')}
          >
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-8xl font-black text-purple-500 opacity-[0.06] select-none leading-none pointer-events-none">04</span>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shrink-0 ring-4 ring-purple-100" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-400 font-mono">Ott 2025 – Giu 2026</span>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Software Specialist</h3>
              <p className="text-sm text-purple-500 font-medium mt-0.5">Metapack Engineering Srl</p>
            </div>
            <svg className={`w-4 h-4 text-gray-300 mt-1 shrink-0 transition-transform duration-200 ${expandedCard === 'node1' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCard === 'node1' ? 'max-h-96' : 'max-h-0'}`}>
            <div className="px-4 pb-4 border-t border-purple-50">
              <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">
                Sviluppo di applicazioni HMI in ambiente .NET (C#/VB.NET) per il monitoraggio e il controllo di processi industriali.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-medium">Automazione</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-medium">Serializzazione</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-md font-medium">VB.NET</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 02 - Freelancer */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            className="w-full p-4 text-left flex items-start gap-3 relative overflow-hidden"
            onClick={() => setExpandedCard(expandedCard === 'node2' ? null : 'node2')}
          >
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-8xl font-black text-blue-500 opacity-[0.06] select-none leading-none pointer-events-none">03</span>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0 ring-4 ring-blue-100" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-400 font-mono">Giu – Ott 2025</span>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Freelance Developer</h3>
              <p className="text-sm text-blue-500 font-medium mt-0.5">Freelancer</p>
            </div>
            <svg className={`w-4 h-4 text-gray-300 mt-1 shrink-0 transition-transform duration-200 ${expandedCard === 'node2' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCard === 'node2' ? 'max-h-[500px]' : 'max-h-0'}`}>
            <div className="px-4 pb-4 border-t border-blue-50">
              <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">
                Progettazione e realizzazione di prodotti digitali su misura: dal discovery al deploy, con focus su scalabilità, manutenibilità e valore per il business.
              </p>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-500 mb-1.5">Progetti realizzati:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                    <a href="https://new.molisebasket.net" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">new.molisebasket.net</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                    <a href="https://www.passoetiro.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">www.passoetiro.com</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                    <a href="https://retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">retr0hub.dev</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                    <a href="https://memolee.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">memolee.vercel.app</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-blue-300 shrink-0" />
                    <a href="https://lab.retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">lab.retr0hub.dev</a>
                    <span className="text-gray-400 text-xs shrink-0">(Prossimamente)</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">React</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">Hosting</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">Wordpress</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium">Web Design</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 03 - Diploma */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            className="w-full p-4 text-left flex items-start gap-3 relative overflow-hidden"
            onClick={() => setExpandedCard(expandedCard === 'node3' ? null : 'node3')}
          >
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-8xl font-black text-orange-500 opacity-[0.06] select-none leading-none pointer-events-none">02</span>
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1.5 shrink-0 ring-4 ring-orange-100" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-400 font-mono">2020 – 2025</span>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Diploma IT</h3>
              <p className="text-sm text-orange-500 font-medium mt-0.5">IIS Galilei Sani, Latina</p>
            </div>
            <svg className={`w-4 h-4 text-gray-300 mt-1 shrink-0 transition-transform duration-200 ${expandedCard === 'node3' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCard === 'node3' ? 'max-h-64' : 'max-h-0'}`}>
            <div className="px-4 pb-4 border-t border-orange-50">
              <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">
                Indirizzo Informatica e Telecomunicazioni (sviluppo base di software, siti web, reti e sistemi informatici).
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md font-medium">Sviluppo Software</span>
                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md font-medium">Siti Web</span>
                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md font-medium">Reti</span>
                <span className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md font-medium">Sistemi IT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 04 - PCTO MTECH */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <button
            className="w-full p-4 text-left flex items-start gap-3 relative overflow-hidden"
            onClick={() => setExpandedCard(expandedCard === 'node4' ? null : 'node4')}
          >
            <span className="absolute right-10 top-1/2 -translate-y-1/2 text-8xl font-black text-green-500 opacity-[0.06] select-none leading-none pointer-events-none">01</span>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shrink-0 ring-4 ring-green-100" />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-gray-400 font-mono">Giu – Ago 2024</span>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Tecnico di Lab. (PCTO)</h3>
              <p className="text-sm text-green-600 font-medium mt-0.5">MTECH SOLUTIONS Srl</p>
            </div>
            <svg className={`w-4 h-4 text-gray-300 mt-1 shrink-0 transition-transform duration-200 ${expandedCard === 'node4' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCard === 'node4' ? 'max-h-64' : 'max-h-0'}`}>
            <div className="px-4 pb-4 border-t border-green-50">
              <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-3">
                Setup tecnico di workstation e periferiche, diagnostica sistemistica e supporto utente in ambito IT.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md font-medium">Configurazione HW</span>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md font-medium">Analisi Guasti</span>
                <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md font-medium">Manutenzione</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Scarica CV */}
        <button
          onClick={() => window.open('/CV/CV%20Cannizzaro%20Marco%20Simone.pdf', '_blank', 'noopener,noreferrer')}
          className="w-full mt-1 rounded-2xl bg-gradient-to-r from-accent to-violet-400 p-4 flex items-center gap-3 shadow-lg shadow-accent/20 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 9h10" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-sm">Scarica CV</p>
            <p className="text-xs text-white/70">{process.env.NEXT_PUBLIC_CV_UPDATED_AT} · PDF</p>
          </div>
          <svg className="w-4 h-4 text-white/50 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* Desktop: nodi draggabili */}
      <div id="works-container" className="hidden md:block relative w-full max-w-7xl mx-auto pt-24 pb-16" style={{ minHeight: '620px' }}>
          <svg className="absolute inset-0 w-full h-full z-0" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#7C3AED', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.3 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <line 
              x1={`${nodePositions.node4.x}%`} y1={`${nodePositions.node4.y}%`}
              x2={`${nodePositions.node3.x}%`} y2={`${nodePositions.node3.y}%`}
              stroke="#7C3AED" strokeWidth="3" opacity="0.6" filter="url(#glow)"
            />
            <line 
              x1={`${nodePositions.node3.x}%`} y1={`${nodePositions.node3.y}%`}
              x2={`${nodePositions.node2.x}%`} y2={`${nodePositions.node2.y}%`}
              stroke="#7C3AED" strokeWidth="3" opacity="0.6" filter="url(#glow)"
            />
            <line 
              x1={`${nodePositions.node2.x}%`} y1={`${nodePositions.node2.y}%`}
              x2={`${nodePositions.node1.x}%`} y2={`${nodePositions.node1.y}%`}
              stroke="#7C3AED" strokeWidth="3" opacity="0.6" filter="url(#glow)"
            />
            
            <line 
              x1={`${nodePositions.node4.x}%`} y1={`${nodePositions.node4.y}%`}
              x2={`${nodePositions.node2.x}%`} y2={`${nodePositions.node2.y}%`}
              stroke="#9d4edd" strokeWidth="1.5" opacity="0.35" strokeDasharray="6,4"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3s" repeatCount="indefinite" />
            </line>
            <line 
              x1={`${nodePositions.node4.x}%`} y1={`${nodePositions.node4.y}%`}
              x2={`${nodePositions.node1.x}%`} y2={`${nodePositions.node1.y}%`}
              stroke="#9d4edd" strokeWidth="1.5" opacity="0.3" strokeDasharray="6,4"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="3.5s" repeatCount="indefinite" />
            </line>
            <line 
              x1={`${nodePositions.node3.x}%`} y1={`${nodePositions.node3.y}%`}
              x2={`${nodePositions.node1.x}%`} y2={`${nodePositions.node1.y}%`}
              stroke="#9d4edd" strokeWidth="1.5" opacity="0.35" strokeDasharray="6,4"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="4s" repeatCount="indefinite" />
            </line>
            
            <line 
              x1={`${nodePositions.node1.x}%`} y1={`${nodePositions.node1.y}%`}
              x2={`${nodePositions.node3.x}%`} y2={`${nodePositions.node3.y}%`}
              stroke="#c4b5fd" strokeWidth="1" opacity="0.25" strokeDasharray="4,6"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="5s" repeatCount="indefinite" />
            </line>
            <line 
              x1={`${nodePositions.node2.x}%`} y1={`${nodePositions.node2.y}%`}
              x2={`${nodePositions.node4.x}%`} y2={`${nodePositions.node4.y}%`}
              stroke="#c4b5fd" strokeWidth="1" opacity="0.25" strokeDasharray="4,6"
            >
              <animate attributeName="stroke-dashoffset" from="10" to="0" dur="4.5s" repeatCount="indefinite" />
            </line>
            
            <circle 
              cx={`${(nodePositions.node1.x + nodePositions.node2.x) / 2}%`}
              cy={`${(nodePositions.node1.y + nodePositions.node2.y) / 2}%`}
              r="4" fill="#7C3AED" opacity="0.6"
            >
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle 
              cx={`${(nodePositions.node2.x + nodePositions.node3.x) / 2}%`}
              cy={`${(nodePositions.node2.y + nodePositions.node3.y) / 2}%`}
              r="4" fill="#7C3AED" opacity="0.6"
            >
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin="0.7s" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.7s" />
            </circle>
            <circle 
              cx={`${(nodePositions.node3.x + nodePositions.node4.x) / 2}%`}
              cy={`${(nodePositions.node3.y + nodePositions.node4.y) / 2}%`}
              r="4" fill="#7C3AED" opacity="0.6"
            >
              <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin="1.4s" />
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="1.4s" />
            </circle>
          </svg>

          {/* Nodo 1 - Metapack Engineering */}
          <div 
            className={`absolute group select-none ${isNodeActive('node1') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node1.x}%`, top: `${nodePositions.node1.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node1', e)}
            onMouseEnter={() => { if (pinnedNode && pinnedNode !== 'node1') return; setHoveredNode('node1'); }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node1' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-40 h-40 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '4s' }}></div>
              <div className="relative w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Ott 2025 - Giu 2026</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Software Specialist</div>
                </div>
              </div>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node1') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node1') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Metapack Engineering Srl</h3>
                  <p className="text-xs text-purple-100">Ottobre 2025 - Giugno 2026</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Sviluppo di applicazioni HMI in ambiente .NET (C#/VB.NET) per il monitoraggio e il controllo di processi industriali.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Automazione</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Serializzazione</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">VB.NET</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo 2 - Freelancer */}
          <div 
            className={`absolute group select-none ${isNodeActive('node2') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node2.x}%`, top: `${nodePositions.node2.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node2', e)}
            onMouseEnter={() => { if (pinnedNode && pinnedNode !== 'node2') return; setHoveredNode('node2'); }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node2' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-36 h-36 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}></div>
              <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Giu - Ott 2025</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Freelance</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Developer</div>
                </div>
              </div>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-6 w-96 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node2') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node2') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Freelancer</h3>
                  <p className="text-xs text-blue-100">Giugno 2025 - Ottobre 2025</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Progettazione e realizzazione di prodotti digitali su misura: dal discovery al deploy, con focus su scalabilità, manutenibilità e valore per il business.
                  </p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Progetti realizzati:</p>
                    <div className="space-y-1 text-xs text-gray-600 flex flex-col items-start">
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a href="https://new.molisebasket.net" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">new.molisebasket.net</a>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a href="https://www.passoetiro.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.passoetiro.com</a>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a href="https://retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">retr0hub.dev</a>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a href="https://memolee.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">memolee.vercel.app</a>
                      </div>
                      <div className="flex items-center gap-1 w-fit text-sm">
                        <span className="text-gray-400">•</span>
                        <a href="https://lab.retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">lab.retr0hub.dev</a>
                        <span className="text-gray-500">(Prossimamente)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">React</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Hosting</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Wordpress</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Web Design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo 3 - Diploma */}
          <div 
            className={`absolute group select-none ${isNodeActive('node3') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node3.x}%`, top: `${nodePositions.node3.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node3', e)}
            onMouseEnter={() => { if (pinnedNode && pinnedNode !== 'node3') return; setHoveredNode('node3'); }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node3' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-32 h-32 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}></div>
              <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-orange-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">2020 - 2025</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Diploma</div>
                </div>
              </div>
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node3') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node3') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Diploma</h3>
                  <p className="text-xs text-orange-100">2020 - 2025 | IIS Galilei Sani, Latina</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Indirizzo Informatica e Telecomunicazioni (sviluppo base di software, siti web, reti e sistemi informatici).
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sviluppo Software</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Siti Web</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Reti</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sistemi IT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo 4 - PCTO MTECH */}
          <div 
            className={`absolute group select-none ${isNodeActive('node4') ? 'z-30' : 'z-10'}`}
            style={{ left: `${nodePositions.node4.x}%`, top: `${nodePositions.node4.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('node4', e)}
            onMouseEnter={() => { if (pinnedNode && pinnedNode !== 'node4') return; setHoveredNode('node4'); }}
            onMouseLeave={() => setHoveredNode((prev) => (prev === 'node4' ? null : prev))}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-36 h-36 rounded-full border border-accent/20 animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
              <div className="relative w-36 h-36 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 group-hover:border-accent group-hover:shadow-2xl transition-all durataion-500" data-node-draggable="true">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-green-50 to-white"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Giu - Ago 2024</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Tecnico Lab</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">PCTO</div>
                </div>
              </div>
              <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node4') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node4') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Apprendista Tecnico di Laboratorio</h3>
                  <p className="text-xs text-green-100">Giugno 2024 - Agosto 2024 | MTECH SOLUTIONS Srl</p>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Setup tecnico di workstation e periferiche, diagnostica sistemistica e supporto utente in ambito IT.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Configurazione HW</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Analisi Guasti</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Manutenzione</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nodo CV - Curriculum */}
          <div
            className="absolute group z-30 select-none"
            style={{ left: `${nodePositions.nodeCV.x}%`, top: `${nodePositions.nodeCV.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={(e) => handleNodeMouseDown('nodeCV', e)}
          >
            <div className="relative" style={{ cursor: 'none' }}>
              <div className="absolute inset-0 w-48 h-20 rounded-2xl border border-accent/20 bg-white/40 blur-lg"></div>
              <div
                className="relative w-48 h-20 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg border border-gray-200 gap-1 px-4"
                data-node-draggable="true"
              >
                <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 9h10" />
                  </svg>
                  Scarica CV
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {process.env.NEXT_PUBLIC_CV_UPDATED_AT} · PDF
                </p>
              </div>
            </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
