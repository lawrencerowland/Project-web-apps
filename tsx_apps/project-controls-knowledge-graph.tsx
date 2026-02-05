const { useState, useEffect, useMemo, useRef } = React;


const ProjectControlsKnowledgeGraph = () => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPathExplanationModal, setShowPathExplanationModal] = useState(false);

  // Define node categories and their colors
  const categories = {
    pmCore: { name: "Project Management Core", color: "#4299E1" }, // Blue
    pcCore: { name: "Project Controls Core", color: "#48BB78" },   // Green
    tools: { name: "Tools & Techniques", color: "#ED8936" },       // Orange
    methods: { name: "Methodologies & Frameworks", color: "#9F7AEA" }, // Purple
    roles: { name: "Roles & Responsibilities", color: "#F56565" },  // Red
    docs: { name: "Documents & Deliverables", color: "#ECC94B" }    // Yellow
  };

  // Create graph data: nodes and links
  const nodes = [
    // Project Management Core Concepts (Blue)
    { id: "projectInitiation", name: "Project Initiation", category: "pmCore", description: "Process of formally authorizing a new project or project phase" },
    { id: "projectPlanning", name: "Project Planning", category: "pmCore", description: "Defining project scope, objectives, and actions to achieve project goals" },
    { id: "projectExecution", name: "Project Execution", category: "pmCore", description: "Performing the work defined in the project management plan" },
    { id: "projectClosing", name: "Project Closing", category: "pmCore", description: "Finalizing all activities across all project management process groups" },
    { id: "stakeholderMgmt", name: "Stakeholder Management", category: "pmCore", description: "Identifying and engaging with individuals affected by the project" },
    { id: "scopeMgmt", name: "Scope Management", category: "pmCore", description: "Defining and controlling what is and is not included in the project" },
    { id: "riskMgmt", name: "Risk Management", category: "pmCore", description: "Identifying, analyzing, and responding to project risks" },
    { id: "teamMgmt", name: "Team Management", category: "pmCore", description: "Organizing, managing and leading the project team" },
    { id: "qualityMgmt", name: "Quality Management", category: "pmCore", description: "Ensuring the project will satisfy the needs for which it was undertaken" },
    { id: "communicationMgmt", name: "Communication Management", category: "pmCore", description: "Planning, collecting, and distributing project information" },
    
    // Project Controls Core Concepts (Green)
    { id: "costControl", name: "Cost Control", category: "pcCore", description: "Monitoring project costs to prevent unauthorized changes to the cost baseline" },
    { id: "scheduleControl", name: "Schedule Control", category: "pcCore", description: "Monitoring project progress to update and manage changes to the schedule baseline" },
    { id: "earnedValueMgmt", name: "Earned Value Management", category: "pcCore", description: "Technique for measuring project performance against scope, schedule and cost baselines" },
    { id: "performanceMeasurement", name: "Performance Measurement", category: "pcCore", description: "Collecting and analyzing data to assess project progress and performance" },
    { id: "changeControl", name: "Change Control", category: "pcCore", description: "Process of reviewing all change requests and approving/rejecting changes" },
    { id: "forecasting", name: "Forecasting", category: "pcCore", description: "Estimating future project performance based on actual performance to date" },
    { id: "varianceAnalysis", name: "Variance Analysis", category: "pcCore", description: "Evaluating the difference between planned and actual performance" },
    { id: "progressTracking", name: "Progress Tracking", category: "pcCore", description: "Monitoring and documenting the advancement of project activities" },
    { id: "baselineMgmt", name: "Baseline Management", category: "pcCore", description: "Maintaining and controlling the approved project baselines" },
    { id: "resourceOptimization", name: "Resource Optimization", category: "pcCore", description: "Efficient allocation and utilization of project resources" },
    
    // Tools & Techniques (Orange)
    { id: "wbs", name: "Work Breakdown Structure", category: "tools", description: "Hierarchical decomposition of project scope into manageable work packages" },
    { id: "cpm", name: "Critical Path Method", category: "tools", description: "Algorithm for scheduling project activities based on logical dependencies" },
    { id: "pert", name: "PERT Analysis", category: "tools", description: "Statistical tool used to estimate project duration with uncertain activity times" },
    { id: "sCurves", name: "S-Curves", category: "tools", description: "Graphical display of cumulative costs, labor hours or other quantities over time" },
    { id: "monteCarlo", name: "Monte Carlo Simulation", category: "tools", description: "Statistical technique using random sampling to obtain numerical results" },
    { id: "ganttCharts", name: "Gantt Charts", category: "tools", description: "Bar chart illustrating project schedule with tasks displayed against time" },
    { id: "resourceHistograms", name: "Resource Histograms", category: "tools", description: "Bar chart showing resource allocation and utilization over time" },
    { id: "controlAccounts", name: "Control Accounts", category: "tools", description: "Management control points where scope, budget, and schedule are integrated" },
    { id: "trendAnalysis", name: "Trend Analysis", category: "tools", description: "Examining project results over time to determine if performance is improving or deteriorating" },
    { id: "dashboards", name: "Dashboards & Reporting", category: "tools", description: "Visual displays of key performance indicators to communicate project status" },
    
    // Methodologies & Frameworks (Purple)
    { id: "waterfall", name: "Waterfall", category: "methods", description: "Sequential project management approach with distinct phases" },
    { id: "agile", name: "Agile", category: "methods", description: "Iterative approach focusing on customer feedback and incremental delivery" },
    { id: "hybrid", name: "Hybrid", category: "methods", description: "Combination of waterfall and agile methodologies tailored to project needs" },
    { id: "pmbok", name: "PMBOK", category: "methods", description: "Project Management Body of Knowledge - standard framework for project management" },
    { id: "prince2", name: "PRINCE2", category: "methods", description: "Process-based method for effective project management with defined structure" },
    { id: "lean", name: "Lean", category: "methods", description: "Methodology focused on maximizing value while minimizing waste" },
    { id: "sixSigma", name: "Six Sigma", category: "methods", description: "Data-driven approach focused on process improvement and variation reduction" },
    { id: "iso21500", name: "ISO 21500", category: "methods", description: "International standard providing guidance on project management concepts and processes" },
    
    // Roles & Responsibilities (Red)
    { id: "projectManager", name: "Project Manager", category: "roles", description: "Professional responsible for leading the project from initiation to closure" },
    { id: "projectController", name: "Project Controller", category: "roles", description: "Specialist monitoring cost, schedule and performance throughout the project" },
    { id: "costEngineer", name: "Cost Engineer", category: "roles", description: "Professional focused on project cost estimation, budgeting and control" },
    { id: "scheduler", name: "Scheduler", category: "roles", description: "Specialist in developing and maintaining project schedules" },
    { id: "riskAnalyst", name: "Risk Analyst", category: "roles", description: "Professional responsible for identifying and analyzing project risks" },
    { id: "changeManager", name: "Change Manager", category: "roles", description: "Specialist overseeing the change control process" },
    { id: "pmoLead", name: "PMO Lead", category: "roles", description: "Manager of the Project Management Office providing standards and support" },
    { id: "sponsor", name: "Sponsor", category: "roles", description: "Executive responsible for providing project resources and support" },
    
    // Documents & Deliverables (Yellow)
    { id: "projectCharter", name: "Project Charter", category: "docs", description: "Document authorizing the project and providing initial requirements" },
    { id: "projectManagementPlan", name: "Project Management Plan", category: "docs", description: "Formal, approved document defining how the project is executed and controlled" },
    { id: "costBaseline", name: "Cost Baseline", category: "docs", description: "Approved version of the time-phased project budget" },
    { id: "scheduleBaseline", name: "Schedule Baseline", category: "docs", description: "Approved version of the project schedule model" },
    { id: "riskRegister", name: "Risk Register", category: "docs", description: "Document containing results of risk analysis and risk response planning" },
    { id: "changeLog", name: "Change Log", category: "docs", description: "Document that captures all change requests to the project" },
    { id: "statusReports", name: "Status Reports", category: "docs", description: "Regular documents showing current project status against baselines" },
    { id: "performanceReports", name: "Performance Reports", category: "docs", description: "Documents presenting earned value metrics and performance analysis" },
    { id: "forecastingReports", name: "Forecasting Reports", category: "docs", description: "Documents with predictions of future project performance and completion" },
    { id: "lessonsLearned", name: "Lessons Learned", category: "docs", description: "Documentation of knowledge gained during the project for future reference" }
  ];

  const links = [
    // Workflow links in Project Management
    { source: "projectInitiation", target: "projectPlanning", type: "workflow" },
    { source: "projectPlanning", target: "projectExecution", type: "workflow" },
    { source: "projectExecution", target: "projectClosing", type: "workflow" },
    
    // Project Planning relationships
    { source: "projectPlanning", target: "scopeMgmt", type: "includes" },
    { source: "projectPlanning", target: "riskMgmt", type: "includes" },
    { source: "projectPlanning", target: "qualityMgmt", type: "includes" },
    { source: "projectPlanning", target: "communicationMgmt", type: "includes" },
    { source: "projectPlanning", target: "teamMgmt", type: "includes" },
    { source: "projectPlanning", target: "stakeholderMgmt", type: "includes" },
    
    // Document creation
    { source: "projectInitiation", target: "projectCharter", type: "produces" },
    { source: "projectPlanning", target: "projectManagementPlan", type: "produces" },
    { source: "projectPlanning", target: "costBaseline", type: "produces" },
    { source: "projectPlanning", target: "scheduleBaseline", type: "produces" },
    { source: "riskMgmt", target: "riskRegister", type: "produces" },
    { source: "changeControl", target: "changeLog", type: "produces" },
    
    // Project Controls relationships
    { source: "costBaseline", target: "costControl", type: "enables" },
    { source: "scheduleBaseline", target: "scheduleControl", type: "enables" },
    { source: "scheduleControl", target: "performanceMeasurement", type: "informs" },
    { source: "costControl", target: "performanceMeasurement", type: "informs" },
    { source: "performanceMeasurement", target: "forecasting", type: "enables" },
    { source: "performanceMeasurement", target: "varianceAnalysis", type: "enables" },
    { source: "varianceAnalysis", target: "changeControl", type: "triggers" },
    { source: "changeControl", target: "baselineMgmt", type: "affects" },
    
    // Tool relationships
    { source: "earnedValueMgmt", target: "performanceMeasurement", type: "methodFor" },
    { source: "cpm", target: "scheduleControl", type: "techniqueFor" },
    { source: "pert", target: "scheduleControl", type: "techniqueFor" },
    { source: "monteCarlo", target: "forecasting", type: "techniqueFor" },
    { source: "ganttCharts", target: "scheduleControl", type: "toolFor" },
    { source: "resourceHistograms", target: "resourceOptimization", type: "toolFor" },
    { source: "wbs", target: "costControl", type: "foundationFor" },
    { source: "wbs", target: "scheduleControl", type: "foundationFor" },
    { source: "sCurves", target: "progressTracking", type: "toolFor" },
    { source: "trendAnalysis", target: "forecasting", type: "techniqueFor" },
    { source: "dashboards", target: "performanceReports", type: "creates" },
    
    // Role relationships
    { source: "projectManager", target: "projectController", type: "delegates" },
    { source: "projectController", target: "costControl", type: "responsible" },
    { source: "projectController", target: "scheduleControl", type: "responsible" },
    { source: "costEngineer", target: "costControl", type: "performs" },
    { source: "scheduler", target: "scheduleControl", type: "performs" },
    { source: "riskAnalyst", target: "riskMgmt", type: "performs" },
    { source: "changeManager", target: "changeControl", type: "manages" },
    { source: "sponsor", target: "projectManager", type: "authorizes" },
    
    // Performance and reporting
    { source: "progressTracking", target: "statusReports", type: "generates" },
    { source: "performanceMeasurement", target: "performanceReports", type: "generates" },
    { source: "forecasting", target: "forecastingReports", type: "generates" },
    { source: "projectClosing", target: "lessonsLearned", type: "documents" },
    
    // Methodology connections
    { source: "pmbok", target: "projectManagementPlan", type: "governs" },
    { source: "prince2", target: "changeControl", type: "emphasizes" },
    { source: "waterfall", target: "baselineMgmt", type: "emphasizes" },
    { source: "agile", target: "progressTracking", type: "adapts" },
    
    // Additional connections for transitions
    { source: "projectManager", target: "projectController", type: "transitions" },
    { source: "costControl", target: "earnedValueMgmt", type: "utilizes" },
    { source: "scheduleControl", target: "earnedValueMgmt", type: "utilizes" },
    { source: "earnedValueMgmt", target: "forecasting", type: "enables" },
    { source: "controlAccounts", target: "earnedValueMgmt", type: "structures" }
  ];

  const predicateWeights = {
    workflow: 2.5,
    includes: 1.5,
    produces: 2,
    enables: 2.5,
    informs: 2,
    triggers: 2.5,
    affects: 1.5,
    methodFor: 1.5,
    techniqueFor: 1.5,
    toolFor: 1.2,
    foundationFor: 2,
    creates: 1.2,
    delegates: 1,
    responsible: 2,
    performs: 2,
    manages: 1.5,
    authorizes: 1.5,
    generates: 1.2,
    documents: 1,
    governs: 1.5,
    emphasizes: 1.2,
    adapts: 1,
    transitions: 1.3,
    utilizes: 1.4,
    structures: 1.3
  };
  const predicateTypes = Array.from(new Set(links.map(link => link.type))).sort();
  const [activeCategories, setActiveCategories] = useState(Object.keys(categories));
  const [activePredicates, setActivePredicates] = useState(predicateTypes);
  const [centralityThreshold, setCentralityThreshold] = useState(0);
  const [pathTraversalEnabled, setPathTraversalEnabled] = useState(false);
  const [pathDirection, setPathDirection] = useState("upstream");

  // We add nodeRef to store node elements for updating
  const nodeRef = useRef(null);
  const linkRef = useRef(null);

  const weightedCentrality = useMemo(() => {
    const totals = {};
    nodes.forEach(node => {
      totals[node.id] = 0;
    });
    links.forEach(link => {
      const weight = predicateWeights[link.type] ?? 1;
      totals[link.source] += weight;
      totals[link.target] += weight;
    });
    return totals;
  }, [links, nodes]);

  const centralityStats = useMemo(() => {
    const values = Object.values(weightedCentrality);
    const max = values.length ? Math.max(...values) : 1;
    const min = values.length ? Math.min(...values) : 0;
    return { min, max };
  }, [weightedCentrality]);

  const visibleNodes = useMemo(() => {
    return new Set(
      nodes
        .filter(node => activeCategories.includes(node.category))
        .filter(node => (weightedCentrality[node.id] ?? 0) >= centralityThreshold)
        .map(node => node.id)
    );
  }, [activeCategories, centralityThreshold, nodes, weightedCentrality]);

  const visibleLinks = useMemo(() => {
    return new Set(
      links
        .filter(link => activePredicates.includes(link.type))
        .filter(link => visibleNodes.has(link.source) && visibleNodes.has(link.target))
        .map(link => `${link.source}|${link.target}|${link.type}`)
    );
  }, [activePredicates, links, visibleNodes]);

  const traversalResult = useMemo(() => {
    if (!pathTraversalEnabled || !selectedNode) {
      return { nodeIds: new Set(), linkKeys: new Set() };
    }
    const allowed = new Set(activePredicates);
    const nodeIds = new Set([selectedNode.id]);
    const linkKeys = new Set();
    const stack = [selectedNode.id];

    while (stack.length) {
      const current = stack.pop();
      links.forEach(link => {
        if (!allowed.has(link.type)) return;
        const isUpstream = pathDirection === "upstream";
        const matchesDirection = isUpstream
          ? link.target === current
          : link.source === current;
        if (!matchesDirection) return;
        const nextNode = isUpstream ? link.source : link.target;
        linkKeys.add(`${link.source}|${link.target}|${link.type}`);
        if (!nodeIds.has(nextNode)) {
          nodeIds.add(nextNode);
          stack.push(nextNode);
        }
      });
    }

    return { nodeIds, linkKeys };
  }, [activePredicates, links, pathDirection, pathTraversalEnabled, selectedNode]);
  
  useEffect(() => {
    if (!svgRef.current) return;

    const sizeScale = d3.scaleLinear()
      .domain([centralityStats.min, centralityStats.max || 1])
      .range([10, 22])
      .clamp(true);

    const getLinkKey = (link) => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      return `${sourceId}|${targetId}|${link.type}`;
    };

    const applyStyles = () => {
      const traversalActive = pathTraversalEnabled && selectedNode;

      if (nodeRef.current) {
        nodeRef.current.attr("opacity", d => {
          const isVisible = visibleNodes.has(d.id);
          const inTraversal = !traversalActive || traversalResult.nodeIds.has(d.id);
          return isVisible && inTraversal ? 1 : 0.15;
        });

        nodeRef.current.select("circle")
          .attr("r", d => sizeScale(weightedCentrality[d.id] ?? 0))
          .attr("stroke", d => {
            if (traversalActive && traversalResult.nodeIds.has(d.id)) {
              return "#FF9500";
            }
            return "#fff";
          })
          .attr("stroke-width", d => {
            if (traversalActive && traversalResult.nodeIds.has(d.id)) {
              return 3;
            }
            return 1.5;
          });
      }

      if (linkRef.current) {
        linkRef.current
          .attr("stroke", d => {
            const key = getLinkKey(d);
            if (traversalActive && traversalResult.linkKeys.has(key)) {
              return "#FF9500";
            }
            return "#999";
          })
          .attr("stroke-opacity", d => {
            const key = getLinkKey(d);
            const isVisible = visibleLinks.has(key);
            const inTraversal = !traversalActive || traversalResult.linkKeys.has(key);
            return isVisible && inTraversal ? 0.7 : 0.1;
          })
          .attr("stroke-width", d => {
            const key = getLinkKey(d);
            if (traversalActive && traversalResult.linkKeys.has(key)) {
              return 3;
            }
            return 1;
          });
      }
    };

    // Only recreate the graph if it doesn't exist yet
    if (!simulationRef.current) {
      const width = 800;
      const height = 600;
      
      // Clear any existing SVG content
      d3.select(svgRef.current).selectAll("*").remove();
      
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
      
      // Create the container group
      const g = svg.append("g");
      
      // Create zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });
      
      svg.call(zoom);
      
      // Create the simulation and store in ref to maintain instance across renders
      simulationRef.current = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(30));
      
      // Draw the links
      const link = g.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1);
      
      linkRef.current = link;
      
      // Create node groups and store reference
      const node = g.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(drag(simulationRef.current))
        .on("click", (event, d) => {
          event.stopPropagation();
          setSelectedNode(d);
        });
        
      // Store node selection in ref for later updates
      nodeRef.current = node;
      
      // Add circles to nodes
      node.append("circle")
        .attr("r", 12)
        .attr("fill", d => categories[d.category].color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);
      
      // Add labels to nodes
      node.append("text")
        .attr("dx", 15)
        .attr("dy", 4)
        .text(d => d.name)
        .attr("font-size", "10px")
        .attr("pointer-events", "none");
      
      // Update positions on each tick
      simulationRef.current.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
        
        node.attr("transform", d => `translate(${d.x},${d.y})`);
      });
      
      // Clear selected node when clicking on the background
      svg.on("click", () => {
        setSelectedNode(null);
      });
      
      // Drag function for nodes
      function drag(simulation) {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }
        
        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }
        
        return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      }

      applyStyles();
    } else {
      // Just update visual elements for path highlighting without recreating the graph
      
      // Make sure node events are still active even on updates
      if (nodeRef.current) {
        nodeRef.current
          .on("click", (event, d) => {
            event.stopPropagation();
            setSelectedNode(d);
          });
      }

      applyStyles();
    }
    
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [
    centralityStats,
    pathTraversalEnabled,
    selectedNode,
    traversalResult,
    visibleLinks,
    visibleNodes,
    weightedCentrality
  ]);

  const toggleCategory = (category) => {
    setActiveCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  const togglePredicate = (predicate) => {
    setActivePredicates(prev =>
      prev.includes(predicate)
        ? prev.filter(item => item !== predicate)
        : [...prev, predicate]
    );
  };

  // Modal components
  const AboutModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-3">About This Knowledge Graph</h3>
        <p className="mb-4">
          This knowledge graph is designed as a visual learning tool for professionals transitioning from project management to project controls. It maps out the key concepts, relationships, tools, and methodologies that connect these two disciplines.
        </p>
        <p className="mb-4">
          The graph is organized by color-coded categories:
        </p>
        <ul className="list-disc ml-5 mt-2 mb-4">
          <li><span className="font-semibold text-blue-600">Blue nodes</span>: Core project management concepts</li>
          <li><span className="font-semibold text-green-600">Green nodes</span>: Core project controls concepts</li>
          <li><span className="font-semibold text-orange-500">Orange nodes</span>: Tools and techniques</li>
          <li><span className="font-semibold text-purple-600">Purple nodes</span>: Methodologies and frameworks</li>
          <li><span className="font-semibold text-red-600">Red nodes</span>: Roles and responsibilities</li>
          <li><span className="font-semibold text-yellow-500">Yellow nodes</span>: Documents and deliverables</li>
        </ul>
        <p className="mb-4">
          To use this tool effectively:
        </p>
        <ul className="list-disc ml-5 mt-2 mb-4">
          <li>Click on nodes to view explanations of key concepts</li>
          <li>Explore connections between different areas</li>
          <li>Use class and predicate filters to create a focused slice</li>
          <li>Adjust the centrality threshold to spotlight key concepts</li>
          <li>Identify which tools and methodologies support specific control processes</li>
        </ul>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setShowAboutModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  const PathExplanationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-3">Understanding Path-Sensitive Traversal</h3>
        <p className="mb-4">
          Path-sensitive traversal lets you walk the graph using only the relationship types that match the story you want to tell. This keeps roll-ups and dependencies aligned with governance logic.
        </p>
        <p className="mb-4">
          <span className="font-semibold">How to use it in this demo:</span>
        </p>
        <ol className="list-decimal ml-5 mt-2 mb-4">
          <li><span className="font-semibold">Pick a start node</span>: Click a node to set the traversal origin.</li>
          <li><span className="font-semibold">Choose predicates</span>: Use the Allowed Predicates filter to define the relationships you trust.</li>
          <li><span className="font-semibold">Set direction</span>: Upstream follows incoming edges; downstream follows outgoing edges.</li>
          <li><span className="font-semibold">Enable traversal</span>: Toggle Path-Sensitive Traversal to spotlight the reachable subgraph.</li>
        </ol>
        <p className="mb-4">
          Use this to narrate roll-ups (e.g., “what rolls up to this baseline?”) or dependency chains (“what does this control enable?”) without mixing unrelated edges.
        </p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setShowPathExplanationModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Controls Knowledge Graph</h2>
      
      <div className="flex flex-col w-full gap-4 mb-4">
        <div className="flex justify-between w-full">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="flex items-center">
                <span 
                  className="inline-block w-3 h-3 mr-1 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="text-xs">{category.name}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setShowAboutModal(true)}
            >
              About This Graph
            </button>
            
            <button
              className="px-3 py-1 text-sm rounded-md bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => setShowPathExplanationModal(true)}
            >
              Explain Traversal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-sm">
          <div className="bg-white rounded-lg border p-3 shadow-sm">
            <h3 className="font-semibold mb-2">Class Filter</h3>
            <div className="space-y-2">
              {Object.entries(categories).map(([key, category]) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={activeCategories.includes(key)}
                    onChange={() => toggleCategory(key)}
                  />
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-3 shadow-sm">
            <h3 className="font-semibold mb-2">Allowed Predicates</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {predicateTypes.map(predicate => (
                <label key={predicate} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={activePredicates.includes(predicate)}
                    onChange={() => togglePredicate(predicate)}
                  />
                  <span>{predicate}</span>
                  <span className="text-gray-400">({(predicateWeights[predicate] ?? 1).toFixed(1)})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-3 shadow-sm space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Predicate-Aware Centrality</h3>
              <input
                className="w-full"
                type="range"
                min="0"
                max={centralityStats.max}
                step="0.5"
                value={centralityThreshold}
                onChange={(event) => setCentralityThreshold(Number(event.target.value))}
              />
              <div className="text-xs text-gray-500">
                Threshold: {centralityThreshold.toFixed(1)} / {centralityStats.max.toFixed(1)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Path-Sensitive Traversal</h3>
              <div className="flex flex-col gap-2">
                <button
                  className={`px-3 py-1 text-sm rounded-md ${
                    pathTraversalEnabled
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setPathTraversalEnabled(!pathTraversalEnabled)}
                >
                  {pathTraversalEnabled ? "Disable" : "Enable"} Traversal
                </button>
                <label className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Direction</span>
                  <select
                    className="border rounded px-2 py-1 text-xs"
                    value={pathDirection}
                    onChange={(event) => setPathDirection(event.target.value)}
                  >
                    <option value="upstream">Upstream (incoming)</option>
                    <option value="downstream">Downstream (outgoing)</option>
                  </select>
                </label>
                <p className="text-xs text-gray-500">
                  Click a node to set the start point for traversal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative w-full border rounded-lg overflow-hidden bg-gray-50">
        <svg ref={svgRef} width="100%" height="600" />
        
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-md shadow-lg border">
            <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
            <p className="text-sm text-gray-600">{selectedNode.description}</p>
            <p className="text-xs text-gray-500 mt-2">
              Class: {categories[selectedNode.category].name} · Weighted centrality: {(weightedCentrality[selectedNode.id] ?? 0).toFixed(1)}
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Click on nodes to view descriptions. Drag nodes to reposition. Use mouse wheel to zoom in/out.</p>
      </div>
      
      {showAboutModal && <AboutModal />}
      {showPathExplanationModal && <PathExplanationModal />}
    </div>
  );
};
