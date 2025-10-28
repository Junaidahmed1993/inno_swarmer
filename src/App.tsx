
import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Download, Info, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import cytoscape from 'cytoscape';


// Define TypeScript interfaces
interface NodeData {
  id: string;
  label: string;
  type: string;
  impact: string;
  stage: string;
  description: string;
  sdg?: string[];
}

interface EdgeData {
  source: string;
  target: string;
  type: string;
  strength: string;
}

const InnovationTracker = () => {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    impact: 'all',
    stage: 'all'
  });
  const [networkStats, setNetworkStats] = useState({
    totalOrgs: 0,
    totalConnections: 0,
    clusters: 0
  });
  const cyRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample ecosystem data - replace with your actual data
  const ecosystemData: { nodes: NodeData[], edges: EdgeData[] } = {
    nodes: [
      // Impact Startups
      { id: 'startup1', label: 'GreenTech Solutions', type: 'startup', impact: 'climate', stage: 'growth', description: 'Carbon footprint tracking platform', sdg: ['SDG 13', 'SDG 9'] },
      { id: 'startup2', label: 'EduConnect', type: 'startup', impact: 'education', stage: 'seed', description: 'Digital learning for underserved communities', sdg: ['SDG 4'] },
      { id: 'startup3', label: 'HealthBridge', type: 'startup', impact: 'health', stage: 'early', description: 'Telemedicine for rural areas', sdg: ['SDG 3'] },
      { id: 'startup4', label: 'AgriInnovate', type: 'startup', impact: 'food', stage: 'growth', description: 'Sustainable farming technology', sdg: ['SDG 2', 'SDG 12'] },
      { id: 'startup5', label: 'WaterSense', type: 'startup', impact: 'water', stage: 'seed', description: 'Smart water management systems', sdg: ['SDG 6'] },
      
      // Investors
      { id: 'inv1', label: 'Impact Ventures', type: 'investor', impact: 'multi', stage: 'mature', description: 'Early-stage impact investor' },
      { id: 'inv2', label: 'Green Capital', type: 'investor', impact: 'climate', stage: 'mature', description: 'Climate-focused fund' },
      { id: 'inv3', label: 'Social Good Fund', type: 'investor', impact: 'social', stage: 'mature', description: 'Social impact investments' },
      
      // Accelerators
      { id: 'acc1', label: 'Impact Hub', type: 'accelerator', impact: 'multi', stage: 'mature', description: 'Global impact accelerator network' },
      { id: 'acc2', label: 'TechForGood Labs', type: 'accelerator', impact: 'tech', stage: 'mature', description: 'Technology-driven social innovation' },
      
      // Universities
      { id: 'uni1', label: 'Innovation University', type: 'university', impact: 'research', stage: 'mature', description: 'Leading research institution' },
      { id: 'uni2', label: 'Tech Institute', type: 'university', impact: 'research', stage: 'mature', description: 'Technology and engineering focus' },
      
      // NGOs
      { id: 'ngo1', label: 'Global Impact Network', type: 'ngo', impact: 'social', stage: 'mature', description: 'International development organization' },
      { id: 'ngo2', label: 'Climate Action Coalition', type: 'ngo', impact: 'climate', stage: 'mature', description: 'Environmental advocacy group' },
      
      // Government
      { id: 'gov1', label: 'Innovation Agency', type: 'government', impact: 'policy', stage: 'mature', description: 'National innovation support' },
      { id: 'gov2', label: 'Startup Ministry', type: 'government', impact: 'policy', stage: 'mature', description: 'Government startup support program' }
    ],
    edges: [
      // Funding relationships
      { source: 'inv1', target: 'startup1', type: 'funding', strength: 'strong' },
      { source: 'inv1', target: 'startup2', type: 'funding', strength: 'medium' },
      { source: 'inv2', target: 'startup1', type: 'funding', strength: 'strong' },
      { source: 'inv2', target: 'startup5', type: 'funding', strength: 'medium' },
      { source: 'inv3', target: 'startup3', type: 'funding', strength: 'strong' },
      
      // Acceleration/mentorship
      { source: 'acc1', target: 'startup2', type: 'mentorship', strength: 'strong' },
      { source: 'acc1', target: 'startup3', type: 'mentorship', strength: 'medium' },
      { source: 'acc2', target: 'startup1', type: 'mentorship', strength: 'strong' },
      { source: 'acc2', target: 'startup4', type: 'mentorship', strength: 'medium' },
      
      // Research/knowledge transfer
      { source: 'uni1', target: 'startup1', type: 'research', strength: 'medium' },
      { source: 'uni1', target: 'startup4', type: 'research', strength: 'strong' },
      { source: 'uni2', target: 'startup2', type: 'research', strength: 'medium' },
      { source: 'uni2', target: 'startup5', type: 'research', strength: 'medium' },
      
      // Partnership/collaboration
      { source: 'ngo1', target: 'startup2', type: 'partnership', strength: 'strong' },
      { source: 'ngo1', target: 'startup3', type: 'partnership', strength: 'strong' },
      { source: 'ngo2', target: 'startup1', type: 'partnership', strength: 'strong' },
      { source: 'ngo2', target: 'startup5', type: 'partnership', strength: 'medium' },
      
      // Government support
      { source: 'gov1', target: 'startup4', type: 'grant', strength: 'strong' },
      { source: 'gov1', target: 'acc1', type: 'grant', strength: 'strong' },
      { source: 'gov2', target: 'startup1', type: 'grant', strength: 'medium' },
      { source: 'gov2', target: 'startup5', type: 'grant', strength: 'medium' },
      
      // Inter-organizational connections
      { source: 'acc1', target: 'inv1', type: 'partnership', strength: 'strong' },
      { source: 'acc2', target: 'inv2', type: 'partnership', strength: 'medium' },
      { source: 'uni1', target: 'acc1', type: 'partnership', strength: 'medium' },
      { source: 'ngo1', target: 'acc1', type: 'partnership', strength: 'medium' },
      
      // Startup collaborations (social tangling)
      { source: 'startup1', target: 'startup5', type: 'collaboration', strength: 'medium' },
      { source: 'startup2', target: 'startup3', type: 'collaboration', strength: 'medium' },
      { source: 'startup4', target: 'startup1', type: 'collaboration', strength: 'medium' }
    ]
  };

  useEffect(() => {
    // Load Cytoscape from CDN
    initializeCytoscape();

   

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (cyRef.current) {
      applyFilters();
    }
  }, [filters, searchTerm]);

  const initializeCytoscape = () => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...ecosystemData.nodes.map(node => ({
          data: { ...node }
        })),
        ...ecosystemData.edges.map(edge => ({
          data: { 
            id: `${edge.source}-${edge.target}`,
            source: edge.source,
            target: edge.target,
            type: edge.type,
            strength: edge.strength
          }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'width': 40,
            'height': 40,
            'font-size': 10,
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 5,
            'border-width': 2,
            'border-color': '#fff'
          }
        },
        {
          selector: 'node[type="startup"]',
          style: { 'background-color': '#10b981', 'shape': 'ellipse' }
        },
        {
          selector: 'node[type="investor"]',
          style: { 'background-color': '#3b82f6', 'shape': 'diamond' }
        },
        {
          selector: 'node[type="accelerator"]',
          style: { 'background-color': '#f59e0b', 'shape': 'rectangle' }
        },
        {
          selector: 'node[type="university"]',
          style: { 'background-color': '#8b5cf6', 'shape': 'hexagon' }
        },
        {
          selector: 'node[type="ngo"]',
          style: { 'background-color': '#ec4899', 'shape': 'triangle' }
        },
        {
          selector: 'node[type="government"]',
          style: { 'background-color': '#ef4444', 'shape': 'star' }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#94a3b8',
            'target-arrow-color': '#94a3b8',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.6
          }
        },
        {
          selector: 'edge[type="funding"]',
          style: { 'line-color': '#3b82f6', 'target-arrow-color': '#3b82f6', 'width': 3 }
        },
        {
          selector: 'edge[type="mentorship"]',
          style: { 'line-color': '#f59e0b', 'target-arrow-color': '#f59e0b' }
        },
        {
          selector: 'edge[type="research"]',
          style: { 'line-color': '#8b5cf6', 'target-arrow-color': '#8b5cf6' }
        },
        {
          selector: 'edge[type="partnership"]',
          style: { 'line-color': '#ec4899', 'target-arrow-color': '#ec4899' }
        },
        {
          selector: 'edge[type="grant"]',
          style: { 'line-color': '#ef4444', 'target-arrow-color': '#ef4444', 'width': 3 }
        },
        {
          selector: 'edge[type="collaboration"]',
          style: { 
            'line-color': '#10b981', 
            'target-arrow-color': '#10b981',
            'line-style': 'dashed'
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#fbbf24'
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 1000,
        nodeRepulsion: 8000,
        idealEdgeLength: 100,
        edgeElasticity: 100,
        nestingFactor: 1.2,
        gravity: 80,
        numIter: 1000,
        randomize: false
      }
    });

    cy.on('tap', 'node', (evt: any) => {
      const node = evt.target;
      setSelectedNode(node.data() as NodeData);
    });

    cy.on('tap', (evt: any) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    cyRef.current = cy;
    calculateStats(cy);
  };

  const calculateStats = (cy: any) => {
    const nodes = cy.nodes();
    const edges = cy.edges();
    setNetworkStats({
      totalOrgs: nodes.length,
      totalConnections: edges.length,
      clusters: 3
    });
  };

  const applyFilters = () => {
    if (!cyRef.current) return;

    const cy = cyRef.current;
    cy.batch(() => {
      cy.nodes().forEach((node: any) => {
        const data = node.data();
        let visible = true;

        if (filters.type !== 'all' && data.type !== filters.type) {
          visible = false;
        }

        if (filters.impact !== 'all' && data.impact !== filters.impact && data.impact !== 'multi') {
          visible = false;
        }

        if (filters.stage !== 'all' && data.stage !== filters.stage) {
          visible = false;
        }

        if (searchTerm && !data.label.toLowerCase().includes(searchTerm.toLowerCase())) {
          visible = false;
        }

        if (visible) {
          node.style('display', 'element');
        } else {
          node.style('display', 'none');
        }
      });

      cy.edges().forEach((edge: any) => {
        const source = edge.source();
        const target = edge.target();
        if (source.style('display') === 'element' && target.style('display') === 'element') {
          edge.style('display', 'element');
        } else {
          edge.style('display', 'none');
        }
      });
    });
  };

  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.2);
      cyRef.current.center();
    }
  };

  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.8);
      cyRef.current.center();
    }
  };

  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit();
    }
  };

  const handleExport = () => {
    if (cyRef.current) {
      const png = cyRef.current.png({ scale: 2 });
      const link = document.createElement('a');
      link.download = 'innovation-ecosystem-map.png';
      link.href = png;
      link.click();
    }
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-2xl font-bold mb-2">Innovation Tracker Tool</h1>
        <p className="text-gray-400 text-sm">Mapping Positive Impact Startups & Social Tangling</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          {/* Search */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Search Organizations</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </label>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Organization Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="startup">Startups</option>
                  <option value="investor">Investors</option>
                  <option value="accelerator">Accelerators</option>
                  <option value="university">Universities</option>
                  <option value="ngo">NGOs</option>
                  <option value="government">Government</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Impact Area</label>
                <select
                  value={filters.impact}
                  onChange={(e) => setFilters({...filters, impact: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Impact Areas</option>
                  <option value="climate">Climate</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="food">Food & Agriculture</option>
                  <option value="water">Water</option>
                  <option value="social">Social Impact</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Stage</label>
                <select
                  value={filters.stage}
                  onChange={(e) => setFilters({...filters, stage: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Stages</option>
                  <option value="early">Early Stage</option>
                  <option value="seed">Seed</option>
                  <option value="growth">Growth</option>
                  <option value="mature">Mature</option>
                </select>
              </div>
            </div>
          </div>

          {/* Network Statistics */}
          <div className="bg-gray-700 rounded p-3 mb-4">
            <h3 className="font-medium text-sm mb-2">Ecosystem Statistics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Organizations:</span>
                <span className="font-medium">{networkStats.totalOrgs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Connections:</span>
                <span className="font-medium">{networkStats.totalConnections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Clusters:</span>
                <span className="font-medium">{networkStats.clusters}</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-700 rounded p-3">
            <h3 className="font-medium text-sm mb-2">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Startups</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}></div>
                <span>Investors</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 mr-2"></div>
                <span>Accelerators</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 mr-2" style={{clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}></div>
                <span>Universities</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-pink-500 mr-2" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
                <span>NGOs</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-2" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
                <span>Government</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-600 space-y-2 text-xs">
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-blue-500 mr-2"></div>
                <span>Funding</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-amber-500 mr-2"></div>
                <span>Mentorship</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-purple-500 mr-2"></div>
                <span>Research</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-pink-500 mr-2"></div>
                <span>Partnership</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-red-500 mr-2"></div>
                <span>Grant</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-green-500 mr-2 border-dashed border-t-2 border-green-500"></div>
                <span>Collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />
          
          {/* Visualization Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
              title="Zoom In"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
              title="Zoom Out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={handleFit}
              className="p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700"
              title="Fit to Screen"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 bg-blue-600 border border-blue-500 rounded hover:bg-blue-700"
              title="Export as PNG"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Sidebar - Details */}
        {selectedNode && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center">
                <Info className="h-5 w-5 mr-2" />
                Details
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-xl mb-2">{selectedNode.label}</h4>
                <span className="inline-block px-2 py-1 bg-blue-600 text-xs rounded">
                  {selectedNode.type}
                </span>
              </div>

              {selectedNode.description && (
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Description</label>
                  <p className="text-sm">{selectedNode.description}</p>
                </div>
              )}

              {selectedNode.impact && (
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Impact Area</label>
                  <p className="text-sm capitalize">{selectedNode.impact}</p>
                </div>
              )}

              {selectedNode.stage && (
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Stage</label>
                  <p className="text-sm capitalize">{selectedNode.stage}</p>
                </div>
              )}

              {selectedNode.sdg && (
                <div>
                  <label className="text-sm text-gray-400 block mb-1">UN SDGs</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.sdg.map((sdg: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-green-600 text-xs rounded">
                        {sdg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-400 block mb-2">Connections</label>
                <div className="space-y-2 text-sm">
                  {cyRef.current && cyRef.current.getElementById(selectedNode.id).connectedEdges().map((edge: any, idx: number) => {
                    const isSource = edge.source().id() === selectedNode.id;
                    const connectedNode = isSource ? edge.target() : edge.source();
                    return (
                      <div key={idx} className="flex justify-between items-center py-1 px-2 bg-gray-700 rounded">
                        <span className="text-xs">{connectedNode.data('label')}</span>
                        <span className="text-xs text-gray-400">{edge.data('type')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InnovationTracker;