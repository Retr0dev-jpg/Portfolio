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
            window.open('/CV/CV_Marco_Simone_Cannizzaro.pdf', '_blank');
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
      {/* Mobile: timeline verticale */}
      <div className="md:hidden w-full">
          <div className="flex justify-center mb-10">
            <button
              onClick={() => window.open('/CV/CV_Marco_Simone_Cannizzaro.pdf', '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white rounded-2xl shadow-lg border border-gray-200 text-accent font-semibold text-sm active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4m-9 9h10" />
              </svg>
              Scarica CV
              <span className="text-xs text-gray-500 font-normal">PDF</span>
            </button>
          </div>

          <div className="relative max-w-lg mx-auto px-2 pl-6 border-l-2 border-accent/30 space-y-10">
            {/* Nodo 1 - Metapack */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-md" />
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
                  <h3 className="text-sm font-bold text-white break-words">Metapack Engineering Srl</h3>
                  <p className="text-xs text-purple-100">Ottobre 2025 - Presente</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Software Specialist</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Sviluppo di applicazioni HMI in ambiente .NET (C#/VB.NET) per il monitoraggio e il controllo di processi industriali.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Automazione</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">Serializzazione</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">VB.NET</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nodo 2 - Freelancer */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-md" />
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                  <h3 className="text-sm font-bold text-white break-words">Freelancer</h3>
                  <p className="text-xs text-blue-100">Giugno 2025 - Ottobre 2025</p>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Freelance Developer</p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Progettazione e realizzazione di prodotti digitali su misura: dal discovery al deploy, con focus su scalabilità, manutenibilità e valore per il business.
                  </p>
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1.5">Progetti realizzati:</p>
                    <div className="space-y-0.5 text-sm text-gray-600 break-all">
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">•</span>
                        <a href="https://new.molisebasket.net" target="_blank" rel="noopener noreferrer" className="text-blue-600">new.molisebasket.net</a>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">•</span>
                        <a href="https://www.passoetiro.com" target="_blank" rel="noopener noreferrer" className="text-blue-600">www.passoetiro.com</a>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">•</span>
                        <a href="https://retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600">retr0hub.dev</a>
                        <span className="text-gray-500 text-xs">(In sviluppo)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">•</span>
                        <a href="https://lab.retr0hub.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600">lab.retr0hub.dev</a>
                        <span className="text-gray-500 text-xs">(Prossimamente)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">React</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Next.js</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Web Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nodo 3 - Diploma */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-md" />
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
                  <h3 className="text-sm font-bold text-white break-words">Diploma</h3>
                  <p className="text-xs text-orange-100">2020 - 2025 | IIS Galilei Sani, Latina</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Indirizzo Informatica e Telecomunicazioni (sviluppo base di software, siti web, reti e sistemi informatici).
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sviluppo Software</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Siti Web</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Reti</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-medium">Sistemi IT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nodo 4 - PCTO MTECH */}
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-md" />
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-3">
                  <h3 className="text-sm font-bold text-white break-words">Apprendista Tecnico di Laboratorio</h3>
                  <p className="text-xs text-green-100">Giugno 2024 - Agosto 2024 | MTECH SOLUTIONS Srl</p>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    Setup tecnico di workstation e periferiche, diagnostica sistemistica e supporto utente in ambito IT.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Configurazione HW</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Analisi Guasti</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Manutenzione</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
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
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Ott 2025 - Presente</div>
                  <div className="text-sm font-bold text-gray-800 leading-tight">Software Specialist</div>
                </div>
              </div>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-6 w-80 bg-white rounded-lg shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden z-20 ${isNodeActive('node1') ? 'opacity-100' : 'opacity-0'}`}
                style={{ pointerEvents: isNodeActive('node1') ? 'auto' : 'none' }}
              >
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3">
                  <h3 className="text-lg font-bold text-white">Metapack Engineering Srl</h3>
                  <p className="text-xs text-purple-100">Ottobre 2025 - Presente</p>
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
                        <span className="text-gray-500">(In sviluppo)</span>
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
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">Next.js</span>
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
