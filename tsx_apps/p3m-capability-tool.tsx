const { useState, useEffect } = React;

// Minimal icon placeholders so the tool can run without external
// dependencies like `lucide-react`. Each icon simply renders a
// character wrapped in a span so Tailwind sizing classes continue to
// work when the TSX is compiled in the browser.
const createIcon = (symbol: string) =>
  ({ className = '', ...props }) => (
    <span className={`inline-block ${className}`} {...props}>{symbol}</span>
  );

const Plus = createIcon('+');
const Trash2 = createIcon('🗑');
const Download = createIcon('⬇');
const Upload = createIcon('⬆');
const ChevronRight = createIcon('▶');
const ChevronDown = createIcon('▼');
const Check = createIcon('✔');
const X = createIcon('✕');
const Target = createIcon('🎯');
const TrendingUp = createIcon('📈');
const BarChart3 = createIcon('📊');
const Filter = createIcon('🔍');
const Info = createIcon('ℹ');
const HelpCircle = createIcon('❓');
const BookOpen = createIcon('📖');

const P3MCapabilityTool = () => {
  // Parse the initial data into hierarchical structure with typical maturity levels
  const parseInitialData = () => {
    const flatCapabilities = [
      // PORTFOLIO - Most organizations have basic portfolio management, aiming for maturity
      {cat: "PORTFOLIO", sub: "Pipeline mgt", cap: "Intake", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Pipeline mgt", cap: "Pipeline development", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Pipeline mgt", cap: "Gateway management", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Pipeline mgt", cap: "Integrated Approval and Assurance plans", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Pipeline mgt", cap: "Closeout oversight", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Achievability based prioritisation", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Classification based prioritisation", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "SME / architecture based prioritisation", asIs: ["", "", ""], toBe: ""},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Delivery /hierarchy based prioritisation", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Expressed preference prioritisation", asIs: ["YES", "", ""], toBe: ""},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Trade-off based prioritisation", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Low-dimensional feature prioritisation", asIs: ["", "", ""], toBe: ""},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "AHP based prioritisation", asIs: ["", "", ""], toBe: ""},
      {cat: "PORTFOLIO", sub: "Strategy alignment", cap: "Using emergent strategy", asIs: ["", "", ""], toBe: ""},
      {cat: "PORTFOLIO", sub: "Strategy & exec support", cap: "Prepare portfolio content recommendations for exec meeting", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Strategy & exec support", cap: "Track and record and communicate Executive Decisions regarding portfolio", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "", cap: "Full spectrum Benefits Management", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "", cap: "Enterprise architecture /roadmap alignment", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "", cap: "Asset lifecycle and Procurement alignment", asIs: ["", "", ""], toBe: ""},
      {cat: "PORTFOLIO", sub: "Portfolio governance", cap: "Governance prep", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Portfolio governance", cap: "Governance administration", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PORTFOLIO", sub: "Portfolio governance", cap: "Financial governance interface", asIs: ["", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - Resource - Basic resource management typically exists
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Resource long range planning", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Resource interim measures", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Resource set up", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Resource forecast", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "(set up) Schedule  / Resource integration", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Resource Schedule", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Resource execution (allocation)", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Resource", cap: "Central resource management", asIs: ["", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - Scope - Usually well-established
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "Project Scope control measures", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "Project Controlled escalation", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "project Additional Change control above a threshold", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "Portfolio Scope control measures", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "Strategic drivers focus", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "Outcomes focus", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Scope", cap: "Portfolio Controlled escalation", asIs: ["", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - Benefits - Often weak in typical organizations
      {cat: "CONTROL MEASURE", sub: "Benefits", cap: "Portfolio level benefits", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Benefits", cap: "Project level benefits", asIs: ["YES", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - Time - Schedule management usually present
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Project level schedule control", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Portfolio level schedule control", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Automated scheduling environment", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Scenario modelling", asIs: ["", "", ""], toBe: ""},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Risk-cost-schedule integration", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Cost and schedule integration", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Schedule  / Resource integration", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Time", cap: "Set contingency requirements", asIs: ["", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - Cost - Basic cost management typically exists
      {cat: "CONTROL MEASURE", sub: "Cost", cap: "Project Cost critical elements", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Cost", cap: "Project Cost  control measures", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Cost", cap: "Portfolio financial management", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Cost", cap: "Risk-cost-schedule integration", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Cost", cap: "Cost and schedule integration", asIs: ["", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - RAID - Risk management usually basic
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Project Contingency planning", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Project Risk based planning", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Project Monitor / enforce RAID Project tracking", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Project Monitor / enforce project RAID allocation and closure", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "project Ad hoc project RAID analysis", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Selected Project RAID escalation", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Engage in steady risk behaviour education and change for projects", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Portfolio RAID tracking", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "(Set up) Risk-cost-schedule integration", asIs: ["", "", ""], toBe: ""},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Key  RAID Portfolio identification", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Key RAID Portfolio management", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "RAID recommendations", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Portfolio Risk & Decision 'chasing'", asIs: ["", "", ""], toBe: ""},
      {cat: "CONTROL MEASURE", sub: "RAID", cap: "Contingency arrangements", asIs: ["", "", ""], toBe: "YES"},
      
      // CONTROL MEASURE - Dependencies - Often weak area
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Project Dependency control measures", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Early Interface descriptions", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Key Dependency identification bottom -up", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Key project dependency allocation", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Key dependency monitoring", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Key dependency arbitration support", asIs: ["", "", ""], toBe: ""},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Portfolio Dependency control measures", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Dependency strategic planning", asIs: ["", "", ""], toBe: ""},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Portfolio Dependency identification", asIs: ["", "", ""], toBe: "YES"},
      {cat: "CONTROL MEASURE", sub: "Dependencies", cap: "Portfolio Dependency management", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - Basic reporting usually exists
      {cat: "REPORTING", sub: "", cap: "Portfolio reporting analysis & administration", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "", cap: "Identify interested parties/stakeholders", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "", cap: "Administer portfolio report", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "", cap: "Project status by exception / Call-outs / RAGS / KPIS linked to CM", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "", cap: "Prepare and review  portfolio report", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "", cap: "Analysis across attributes, across time, across projects", asIs: ["", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "", cap: "Review portfolio status and progress", asIs: ["YES", "", ""], toBe: "YES"},
      
      // REPORTING - Resource
      {cat: "REPORTING", sub: "Resource", cap: "Resource usage", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Resource", cap: "Resource execution", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Resource", cap: "Resource Schedule", asIs: ["", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Resource", cap: "Resource forecasting", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - Scope
      {cat: "REPORTING", sub: "Scope", cap: "Project level Scope reporting", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Scope", cap: "Portfolio level Scope reporting", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - Benefits
      {cat: "REPORTING", sub: "Benefits", cap: "Project level benefits", asIs: ["", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Benefits", cap: "Portfolio level benefits", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - Time
      {cat: "REPORTING", sub: "Time", cap: "Projects schedule view", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Time", cap: "Portfolio Composite view/oversight w key milestones", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - Cost
      {cat: "REPORTING", sub: "Cost", cap: "Project Cost", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Cost", cap: "Portfolio costs", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - RAID
      {cat: "REPORTING", sub: "RAID", cap: "Project RAID reporting", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "RAID", cap: "Portfolio RAID reporting", asIs: ["", "", ""], toBe: "YES"},
      
      // REPORTING - Dependencies
      {cat: "REPORTING", sub: "Dependencies", cap: "Project Dependency reporting", asIs: ["", "", ""], toBe: "YES"},
      {cat: "REPORTING", sub: "Dependencies", cap: "Portfolio Dependency reporting", asIs: ["", "", ""], toBe: "YES"},
      
      // PROJECT SUPPORT - Mixed maturity typically
      {cat: "PROJECT SUPPORT", sub: "Consequential assurance", cap: "manage watch list", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Consequential assurance", cap: "Informal forms of assurance", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Consequential assurance", cap: "Formal forms of assurance", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Support Line Mgt", cap: "Line Management encouragement", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Support Line Mgt", cap: "External resource support", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Support Line Mgt", cap: "Basic project communication support", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Start up and project recovery", cap: "Start–up support", asIs: ["", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Start up and project recovery", cap: "Supply resource to recover programmes and projects in difficulty.", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "Start up and project recovery", cap: "Provision / cross charging of planners / business architects for key projects", asIs: ["", "", ""], toBe: ""},
      {cat: "PROJECT SUPPORT", sub: "Start up and project recovery", cap: "Occasional mentoring / coaching /training service to PMs, planners etc", asIs: ["YES", "", ""], toBe: "YES"},
      {cat: "PROJECT SUPPORT", sub: "", cap: "(Centre of Excellence)", asIs: ["", "", ""], toBe: "YES"},
    ];

    // Build hierarchical structure
    const hierarchical = [];
    
    flatCapabilities.forEach(item => {
      let category = hierarchical.find(c => c.name === item.cat);
      if (!category) {
        category = {
          name: item.cat,
          currentOps: '',
          futureOps: '',
          subcategories: [],
          capabilities: []
        };
        hierarchical.push(category);
      }
      
      const capability = {
        name: item.cap,
        currentOps: (item.asIs[0] === 'YES' || item.asIs[1] === 'YES' || item.asIs[2] === 'YES') ? 'YES' : 
                   (item.asIs[0] === 'NO' || item.asIs[1] === 'NO' || item.asIs[2] === 'NO') ? 'NO' : '',
        futureOps: item.toBe
      };
      
      if (item.sub) {
        let subcategory = category.subcategories.find(s => s.name === item.sub);
        if (!subcategory) {
          subcategory = {
            name: item.sub,
            currentOps: item.subAsIs ? ((item.subAsIs[0] === 'YES' || item.subAsIs[1] === 'YES' || item.subAsIs[2] === 'YES') ? 'YES' : 
                                      (item.subAsIs[0] === 'NO' || item.subAsIs[1] === 'NO' || item.subAsIs[2] === 'NO') ? 'NO' : '') : '',
            futureOps: item.subToBe || '',
            capabilities: []
          };
          category.subcategories.push(subcategory);
        }
        subcategory.capabilities.push(capability);
      } else {
        category.capabilities.push(capability);
      }
    });
    
    // Special handling for Pipeline mgt which has its own data
    const portfolio = hierarchical.find(c => c.name === 'PORTFOLIO');
    if (portfolio) {
      const pipelineMgt = portfolio.subcategories.find(s => s.name === 'Pipeline mgt');
      if (pipelineMgt) {
        pipelineMgt.currentOps = 'YES'; // Common capability in typical organizations
        pipelineMgt.futureOps = 'YES';
      }
      
      // Set subcategory-level assessments for typical maturity
      const strategyAlignment = portfolio.subcategories.find(s => s.name === 'Strategy alignment');
      if (strategyAlignment) {
        strategyAlignment.currentOps = ''; // Usually weak
        strategyAlignment.futureOps = 'YES';
      }
      
      const portfolioGov = portfolio.subcategories.find(s => s.name === 'Portfolio governance');
      if (portfolioGov) {
        portfolioGov.currentOps = 'YES'; // Usually exists
        portfolioGov.futureOps = 'YES';
      }
    }
    
    // Set control measure subcategory assessments
    const controlMeasure = hierarchical.find(c => c.name === 'CONTROL MEASURE');
    if (controlMeasure) {
      const resource = controlMeasure.subcategories.find(s => s.name === 'Resource');
      if (resource) {
        resource.currentOps = 'YES'; // Basic resource management exists
        resource.futureOps = 'YES';
      }
      
      const scope = controlMeasure.subcategories.find(s => s.name === 'Scope');
      if (scope) {
        scope.currentOps = 'YES'; // Usually well-established
        scope.futureOps = 'YES';
      }
      
      const benefits = controlMeasure.subcategories.find(s => s.name === 'Benefits');
      if (benefits) {
        benefits.currentOps = ''; // Often weak
        benefits.futureOps = 'YES';
      }
      
      const time = controlMeasure.subcategories.find(s => s.name === 'Time');
      if (time) {
        time.currentOps = 'YES'; // Basic scheduling exists
        time.futureOps = 'YES';
      }
      
      const cost = controlMeasure.subcategories.find(s => s.name === 'Cost');
      if (cost) {
        cost.currentOps = 'YES'; // Basic cost management exists
        cost.futureOps = 'YES';
      }
      
      const raid = controlMeasure.subcategories.find(s => s.name === 'RAID');
      if (raid) {
        raid.currentOps = ''; // Often basic
        raid.futureOps = 'YES';
      }
      
      const dependencies = controlMeasure.subcategories.find(s => s.name === 'Dependencies');
      if (dependencies) {
        dependencies.currentOps = ''; // Typically weak
        dependencies.futureOps = 'YES';
      }
    }
    
    // Set reporting subcategory assessments
    const reporting = hierarchical.find(c => c.name === 'REPORTING');
    if (reporting) {
      reporting.currentOps = 'YES'; // Basic reporting exists
      reporting.futureOps = 'YES';
    }
    
    // Set project support subcategory assessments
    const projectSupport = hierarchical.find(c => c.name === 'PROJECT SUPPORT');
    if (projectSupport) {
      const consequential = projectSupport.subcategories.find(s => s.name === 'Consequential assurance');
      if (consequential) {
        consequential.currentOps = ''; // Often informal
        consequential.futureOps = 'YES';
      }
      
      const supportLine = projectSupport.subcategories.find(s => s.name === 'Support Line Mgt');
      if (supportLine) {
        supportLine.currentOps = 'YES'; // Usually exists
        supportLine.futureOps = 'YES';
      }
      
      const startUp = projectSupport.subcategories.find(s => s.name === 'Start up and project recovery');
      if (startUp) {
        startUp.currentOps = ''; // Often reactive
        startUp.futureOps = 'YES';
      }
    }
    
    return hierarchical;
  };

  const [data, setData] = useState(parseInitialData());
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyGaps, setShowOnlyGaps] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  // Initialize expanded state
  useEffect(() => {
    const expanded = {};
    const subExpanded = {};
    data.forEach(cat => {
      expanded[cat.name] = true;
      cat.subcategories.forEach(sub => {
        subExpanded[`${cat.name}-${sub.name}`] = true;
      });
    });
    setExpandedCategories(expanded);
    setExpandedSubcategories(subExpanded);
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle subcategory expansion
  const toggleSubcategory = (category, subcategory) => {
    const key = `${category}-${subcategory}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Update capability/subcategory/category with cascading
  const updateItem = (path, field, value, cascade = true) => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (path.length === 1) {
        // Update category
        const cat = newData.find(c => c.name === path[0]);
        if (cat) {
          cat[field] = value;
          
          // Cascade to all children if updating currentOps or futureOps
          if (cascade && (field === 'currentOps' || field === 'futureOps')) {
            // Update all direct capabilities
            cat.capabilities.forEach(cap => {
              cap[field] = value;
            });
            
            // Update all subcategories and their capabilities
            cat.subcategories.forEach(sub => {
              sub[field] = value;
              sub.capabilities.forEach(cap => {
                cap[field] = value;
              });
            });
          }
        }
      } else if (path.length === 2) {
        // Update subcategory or direct capability
        const cat = newData.find(c => c.name === path[0]);
        if (cat) {
          const sub = cat.subcategories.find(s => s.name === path[1]);
          if (sub) {
            sub[field] = value;
            
            // Cascade to all child capabilities if updating currentOps or futureOps
            if (cascade && (field === 'currentOps' || field === 'futureOps')) {
              sub.capabilities.forEach(cap => {
                cap[field] = value;
              });
            }
          } else {
            const cap = cat.capabilities.find(c => c.name === path[1]);
            if (cap) cap[field] = value;
          }
        }
      } else if (path.length === 3) {
        // Update capability within subcategory
        const cat = newData.find(c => c.name === path[0]);
        if (cat) {
          const sub = cat.subcategories.find(s => s.name === path[1]);
          if (sub) {
            const cap = sub.capabilities.find(c => c.name === path[2]);
            if (cap) cap[field] = value;
          }
        }
      }
      
      return newData;
    });
  };

  // Add new capability
  const addCapability = (categoryName, subcategoryName = null) => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const category = newData.find(c => c.name === categoryName);
      
      if (category) {
        const newCapability = {
          name: "New Capability",
          currentOps: "",
          futureOps: ""
        };
        
        if (subcategoryName) {
          const subcategory = category.subcategories.find(s => s.name === subcategoryName);
          if (subcategory) {
            subcategory.capabilities.push(newCapability);
          }
        } else {
          category.capabilities.push(newCapability);
        }
      }
      
      return newData;
    });
  };

  // Delete capability
  const deleteCapability = (path) => {
    setData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      if (path.length === 2) {
        // Delete from category
        const cat = newData.find(c => c.name === path[0]);
        if (cat) {
          cat.capabilities = cat.capabilities.filter(c => c.name !== path[1]);
        }
      } else if (path.length === 3) {
        // Delete from subcategory
        const cat = newData.find(c => c.name === path[0]);
        if (cat) {
          const sub = cat.subcategories.find(s => s.name === path[1]);
          if (sub) {
            sub.capabilities = sub.capabilities.filter(c => c.name !== path[2]);
          }
        }
      }
      
      return newData;
    });
  };

  // Clear all assessments
  const clearAllData = () => {
    if (window.confirm('This will clear all assessment data. Are you sure?')) {
      setData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        
        // Clear all assessments recursively
        const clearItem = (item) => {
          item.currentOps = '';
          item.futureOps = '';
        };
        
        newData.forEach(category => {
          clearItem(category);
          category.capabilities.forEach(clearItem);
          category.subcategories.forEach(sub => {
            clearItem(sub);
            sub.capabilities.forEach(clearItem);
          });
        });
        
        return newData;
      });
    }
  };

  // Reset to typical values
  const resetToTypical = () => {
    if (window.confirm('This will reset all assessments to typical organization values. Are you sure?')) {
      setData(parseInitialData());
    }
  };

  // Generate sample CSV
  const downloadSampleCSV = () => {
    const sampleContent = `Category,Subcategory,Capability,Current Operations,Future Operations
"PORTFOLIO","","","YES","YES"
"PORTFOLIO","Pipeline mgt","","YES","YES"
"PORTFOLIO","Pipeline mgt","Intake","YES","YES"
"PORTFOLIO","Pipeline mgt","Pipeline development","","YES"
"PORTFOLIO","Strategy alignment","","","YES"
"PORTFOLIO","Strategy alignment","Classification based prioritisation","YES","YES"
"CONTROL MEASURE","","","","YES"
"CONTROL MEASURE","Resource","","YES","YES"
"CONTROL MEASURE","Resource","Resource long range planning","","YES"
"CONTROL MEASURE","Resource","Resource execution (allocation)","YES","YES"`;
    
    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "p3m-sample.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export data to CSV
  const exportData = () => {
    // Create CSV content
    let csvContent = "Category,Subcategory,Capability,Current Operations,Future Operations\n";
    
    data.forEach(category => {
      // Export category level if it has assessment
      if (category.currentOps || category.futureOps) {
        csvContent += `"${category.name}","","","${category.currentOps || ''}","${category.futureOps || ''}"\n`;
      }
      
      // Export direct capabilities
      category.capabilities.forEach(cap => {
        csvContent += `"${category.name}","","${cap.name}","${cap.currentOps || ''}","${cap.futureOps || ''}"\n`;
      });
      
      // Export subcategories
      category.subcategories.forEach(sub => {
        // Export subcategory if it has assessment
        if (sub.currentOps || sub.futureOps) {
          csvContent += `"${category.name}","${sub.name}","","${sub.currentOps || ''}","${sub.futureOps || ''}"\n`;
        }
        
        // Export capabilities within subcategory
        sub.capabilities.forEach(cap => {
          csvContent += `"${category.name}","${sub.name}","${cap.name}","${cap.currentOps || ''}","${cap.futureOps || ''}"\n`;
        });
      });
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "p3m-capabilities.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import data from CSV
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvText = e.target.result;
          const lines = csvText.split(/\r?\n/).filter(line => line.trim());
          
          // Skip header
          if (lines.length <= 1) {
            alert('CSV file is empty or contains only headers.');
            return;
          }
          
          // Use existing structure as base
          const newData = JSON.parse(JSON.stringify(data));
          
          // Clear all existing assessments first
          const clearItem = (item) => {
            item.currentOps = '';
            item.futureOps = '';
          };
          
          newData.forEach(category => {
            clearItem(category);
            category.capabilities.forEach(clearItem);
            category.subcategories.forEach(sub => {
              clearItem(sub);
              sub.capabilities.forEach(clearItem);
            });
          });
          
          // Process CSV data
          let successCount = 0;
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parse CSV line (handle quotes and commas within quotes)
            const matches = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            if (!matches || matches.length < 5) continue;
            
            const values = matches.map(m => m.replace(/^"(.*)"$/, '$1').trim());
            const [catName, subName, capName, currentOps, futureOps] = values;
            
            // Find category
            const category = newData.find(c => c.name === catName);
            if (!category) continue;
            
            // Handle different row types
            if (!subName && !capName && catName) {
              // Category level assessment
              category.currentOps = currentOps || '';
              category.futureOps = futureOps || '';
              successCount++;
            } else if (subName && !capName) {
              // Subcategory level assessment
              const subcategory = category.subcategories.find(s => s.name === subName);
              if (subcategory) {
                subcategory.currentOps = currentOps || '';
                subcategory.futureOps = futureOps || '';
                successCount++;
              }
            } else if (!subName && capName) {
              // Direct capability
              const cap = category.capabilities.find(c => c.name === capName);
              if (cap) {
                cap.currentOps = currentOps || '';
                cap.futureOps = futureOps || '';
                successCount++;
              }
            } else if (subName && capName) {
              // Capability within subcategory
              const subcategory = category.subcategories.find(s => s.name === subName);
              if (subcategory) {
                const cap = subcategory.capabilities.find(c => c.name === capName);
                if (cap) {
                  cap.currentOps = currentOps || '';
                  cap.futureOps = futureOps || '';
                  successCount++;
                }
              }
            }
          }
          
          setData(newData);
          alert(`Import successful! ${successCount} items updated from CSV.`);
          
          // Reset file input
          event.target.value = '';
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing CSV. Please ensure the file follows the correct format:\nCategory,Subcategory,Capability,Current Operations,Future Operations');
          event.target.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      total: 0,
      totalCaps: 0,
      withCurrent: 0,
      withFuture: 0,
      gaps: 0
    };

    const countAll = (item) => {
      stats.totalCaps++;
    };

    const countAssessed = (item) => {
      if (item.currentOps || item.futureOps) {
        stats.total++;
        if (item.currentOps === 'YES') stats.withCurrent++;
        if (item.futureOps === 'YES') stats.withFuture++;
        if (item.futureOps === 'YES' && item.currentOps !== 'YES') stats.gaps++;
      }
    };

    data.forEach(category => {
      countAll(category);
      countAssessed(category);
      
      category.capabilities.forEach(cap => {
        countAll(cap);
        countAssessed(cap);
      });
      
      category.subcategories.forEach(sub => {
        countAll(sub);
        countAssessed(sub);
        sub.capabilities.forEach(cap => {
          countAll(cap);
          countAssessed(cap);
        });
      });
    });

    return stats;
  };

  const stats = calculateStats();

  // Check if item matches filters
  const matchesFilters = (item, path = []) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isGap = item.futureOps === 'YES' && item.currentOps !== 'YES';
    const matchesGapFilter = !showOnlyGaps || isGap;
    const matchesCategory = selectedCategory === 'ALL' || path[0] === selectedCategory;
    
    return matchesSearch && matchesGapFilter && matchesCategory;
  };

  // Status button component
  const StatusButton = ({ value, onChange, type = 'current' }) => {
    const isYes = value === 'YES';
    const isNo = value === 'NO';
    
    return (
      <div className="flex gap-1">
        <button
          onClick={() => onChange(isYes ? '' : 'YES')}
          className={`p-1 rounded transition-all duration-200 ${
            isYes 
              ? type === 'future' 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-green-500 text-white shadow-lg shadow-green-500/30'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => onChange(isNo ? '' : 'NO')}
          className={`p-1 rounded transition-all duration-200 ${
            isNo 
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Tree item component
  const TreeItem = ({ item, path, level = 0, isSubcategory = false, hasChildren = false }) => {
    const isGap = item.futureOps === 'YES' && item.currentOps !== 'YES';
    const indent = level * 28;
    
    return (
      <tr className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
        isGap ? 'bg-amber-500/5' : ''
      }`}>
        <td className="p-3" style={{ paddingLeft: `${indent + 12}px` }}>
          <div className="flex items-center gap-2">
            {level > 0 && (
              <div className="text-gray-600 select-none" style={{ marginLeft: '-8px' }}>
                {level === 1 ? '├─' : '│  └─'}
              </div>
            )}
            {hasChildren && (
              isSubcategory ? (
                <button
                  onClick={() => toggleSubcategory(path[0], item.name)}
                  className="text-gray-400 hover:text-white"
                >
                  {expandedSubcategories[`${path[0]}-${item.name}`] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : null
            )}
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(path, 'name', e.target.value)}
              className={`bg-transparent border-b border-gray-700 focus:border-blue-500 outline-none flex-1 ${
                level === 0 ? 'font-bold text-lg text-blue-400' : level === 1 && hasChildren ? 'font-semibold text-purple-400' : ''
              }`}
              disabled={level === 0}
            />
          </div>
        </td>
        <td className="text-center p-3">
          <StatusButton
            value={item.currentOps}
            onChange={(value) => updateItem(path, 'currentOps', value)}
            type="current"
          />
        </td>
        <td className="text-center p-3">
          <StatusButton
            value={item.futureOps}
            onChange={(value) => updateItem(path, 'futureOps', value)}
            type="future"
          />
        </td>
        <td className="text-center p-3 w-[50px]">
          {level > 0 && !hasChildren && (
            <button
              onClick={() => deleteCapability(path)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </td>
      </tr>
    );
  };

  // Modal component
  const Modal = ({ show, onClose, title, children }) => {
    // Handle escape key
    useEffect(() => {
      const handleEscape = (e) => {
        if (e.key === 'Escape' && show) {
          onClose();
        }
      };
      
      if (show) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [show, onClose]);
    
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-700 bg-gray-800/50">
            <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 md:p-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 73px)' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                P3M Capability Assessment & Planning Tool
              </h1>
              <p className="text-gray-400">Assess your current state and plan your P3M transformation journey</p>
              <p className="text-sm text-amber-400 mt-2">
                Pre-populated with typical maturity levels for an average project organization and realistic 18-month targets
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExplainer(true)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="What is P3M?"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowHowTo(true)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="How to use"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Capabilities</p>
                <p className="text-2xl font-bold">{stats.totalCaps}</p>
                <p className="text-xs text-gray-500">{stats.total} assessed</p>
              </div>
              <BarChart3 className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Operations</p>
                <p className="text-2xl font-bold text-green-400">{stats.withCurrent}</p>
                <p className="text-xs text-gray-500">Existing capabilities</p>
              </div>
              <Check className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Future Operations</p>
                <p className="text-2xl font-bold text-blue-400">{stats.withFuture}</p>
                <p className="text-xs text-gray-500">18-month targets</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Capability Gaps</p>
                <p className="text-2xl font-bold text-amber-400">{stats.gaps}</p>
                <p className="text-xs text-gray-500">To implement</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search capabilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            {data.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowOnlyGaps(!showOnlyGaps)}
            className={`px-4 py-2 rounded-lg transition-all ${
              showOnlyGaps 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            Show Gaps Only
          </button>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <label className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={importData}
              className="hidden"
            />
          </label>
          <button
            onClick={clearAllData}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={resetToTypical}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Reset to Typical
          </button>
        </div>

        {/* Capabilities Tree */}
        {data.map(category => {
          const showCategory = selectedCategory === 'ALL' || category.name === selectedCategory;
          if (!showCategory) return null;

          return (
            <div key={category.name} className="mb-6">
              <div
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur rounded-t-xl border border-gray-700 cursor-pointer hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedCategories[category.name] ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </div>
              </div>

              {expandedCategories[category.name] && (
                <div className="bg-gray-800/30 backdrop-blur rounded-b-xl border border-t-0 border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left p-4 font-medium text-gray-400">Capability</th>
                          <th className="text-center p-4 font-medium text-gray-400 w-[150px]">Current Operations</th>
                          <th className="text-center p-4 font-medium text-gray-400 w-[150px]">Future Operations</th>
                          <th className="text-center p-4 font-medium text-gray-400 w-[50px]"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Category level assessment */}
                        <TreeItem
                          item={category}
                          path={[category.name]}
                          level={0}
                          hasChildren={true}
                        />

                        {/* Direct capabilities */}
                        {category.capabilities.map((cap, idx) => {
                          if (!matchesFilters(cap, [category.name])) return null;
                          return (
                            <TreeItem
                              key={idx}
                              item={cap}
                              path={[category.name, cap.name]}
                              level={1}
                            />
                          );
                        })}

                        {/* Subcategories */}
                        {category.subcategories.map((subcat, subIdx) => (
                          <React.Fragment key={subIdx}>
                            <TreeItem
                              item={subcat}
                              path={[category.name, subcat.name]}
                              level={1}
                              isSubcategory={true}
                              hasChildren={true}
                            />
                            
                            {/* Subcategory capabilities */}
                            {expandedSubcategories[`${category.name}-${subcat.name}`] && 
                              subcat.capabilities.map((cap, capIdx) => {
                                if (!matchesFilters(cap, [category.name, subcat.name])) return null;
                                return (
                                  <TreeItem
                                    key={capIdx}
                                    item={cap}
                                    path={[category.name, subcat.name, cap.name]}
                                    level={2}
                                  />
                                );
                              })}
                            
                            {/* Add capability button for this subcategory */}
                            {expandedSubcategories[`${category.name}-${subcat.name}`] && (
                              <tr>
                                <td colSpan={4} className="p-3" style={{ paddingLeft: '84px' }}>
                                  <button
                                    onClick={() => addCapability(category.name, subcat.name)}
                                    className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm"
                                  >
                                    <Plus className="w-3 h-3" />
                                    Add to {subcat.name}
                                  </button>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 border-t border-gray-700">
                    <button
                      onClick={() => addCapability(category.name)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Direct Capability
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Explainer Modal */}
        <Modal
          show={showExplainer}
          onClose={() => setShowExplainer(false)}
          title="What is P3M?"
        >
          <div className="space-y-4 text-gray-300">
            <p>
              <strong className="text-white">P3M</strong> stands for <strong className="text-white">Portfolio, Programme and Project Management</strong>. 
              It's a comprehensive approach to managing organizational change and delivering strategic objectives.
            </p>
            
            <div className="space-y-3">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Portfolio Management
                </h3>
                <p className="text-sm">
                  Ensures the right projects and programmes are undertaken to deliver organizational strategy. 
                  Focuses on prioritization, resource allocation, and strategic alignment.
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  Programme Management
                </h3>
                <p className="text-sm">
                  Coordinates related projects to achieve outcomes and benefits that wouldn't be possible if 
                  managed separately. Focuses on benefits realization and managing interdependencies.
                </p>
              </div>
              
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Project Management
                </h3>
                <p className="text-sm">
                  Delivers specific outputs within time, cost, and quality constraints. 
                  Focuses on planning, execution, and delivery of defined objectives.
                </p>
              </div>
            </div>
            
            <p>
              This tool helps organizations assess their current P3M capabilities and plan improvements 
              across key areas including governance, control measures, reporting, and project support.
            </p>
            
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">Why Hierarchical Assessment?</h3>
              <p className="text-sm">
                P3M capabilities naturally organize into hierarchies. For example, "Pipeline Management" 
                encompasses intake, development, gateway management, and closeout. This tool preserves 
                these relationships, allowing assessment at the appropriate level of detail for your 
                organization's maturity and available time.
              </p>
            </div>
          </div>
        </Modal>

        {/* How To Use Modal */}
        <Modal
          show={showHowTo}
          onClose={() => setShowHowTo(false)}
          title="How to Use This Tool"
        >
          <div className="space-y-4 text-gray-300">
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <p className="text-sm">
                <strong className="text-blue-400">Tip:</strong> You can assess capabilities at any level - 
                category, subcategory, or individual capability - depending on your available time and required detail.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-white">1. Understanding the Structure</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Capabilities are organized in a <strong>3-level hierarchical tree</strong></li>
                <li><span className="font-bold text-lg">Categories</span> → <span className="font-semibold">Subcategories</span> → Individual capabilities</li>
                <li>Click arrows to expand/collapse sections</li>
                <li>Bold items (parents) can have their own assessment scores</li>
              </ul>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm mb-2"><strong className="text-white">Hierarchy Example:</strong></p>
                <div className="ml-2 text-sm space-y-1">
                  <div className="font-bold text-base">PORTFOLIO</div>
                  <div className="ml-6 font-semibold">Pipeline mgt</div>
                  <div className="ml-12 font-normal">• Intake</div>
                  <div className="ml-12 font-normal">• Pipeline development</div>
                  <div className="ml-12 font-normal">• Gateway management</div>
                </div>
              </div>

              <h3 className="font-semibold text-white">2. Assessing Capabilities</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><span className="text-green-400">✓</span> Green = Capability exists in current operations</li>
                <li><span className="text-red-400">✗</span> Red = Capability explicitly not present</li>
                <li><span className="text-blue-400">✓</span> Blue = Target for future operations</li>
                <li>Leave blank if not applicable or unknown</li>
              </ul>
              
              <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
                <p className="text-sm">
                  <strong className="text-amber-400">Cascading Updates:</strong> When you tick/cross a parent item 
                  (category or subcategory), all its children are automatically updated to match. This saves 
                  time when assessing entire areas at once.
                </p>
              </div>

              <h3 className="font-semibold text-white">3. Identifying Gaps</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li>Gaps are highlighted in <span className="text-amber-400">amber</span></li>
                <li>Use "Show Gaps Only" filter to focus on improvements needed</li>
                <li>Dashboard shows total gaps count</li>
              </ul>

              <h3 className="font-semibold text-white">4. Managing Data</h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                <li><strong>Export:</strong> Save your assessment as JSON file</li>
                <li><strong>Import:</strong> Load a previously saved assessment</li>
                <li><strong>Add:</strong> Create new capabilities as needed</li>
                <li><strong>Delete:</strong> Remove irrelevant capabilities</li>
              </ul>

              <h3 className="font-semibold text-white">5. Flexible Assessment Levels</h3>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-sm mb-2">Choose your assessment depth based on available time:</p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                  <li><strong className="text-purple-400">Strategic (30 min):</strong> Score only main categories</li>
                  <li><strong className="text-blue-400">Tactical (2 hours):</strong> Score categories + subcategories</li>
                  <li><strong className="text-green-400">Detailed (4+ hours):</strong> Score all individual capabilities</li>
                </ul>
              </div>
              
              <h3 className="font-semibold text-white">6. Managing Data</h3>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
