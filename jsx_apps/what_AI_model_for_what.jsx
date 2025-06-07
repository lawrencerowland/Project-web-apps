const { useState } = React;

const AICapabilitiesDiagram = () => {
  // Define the three layers of nodes
  const layers = {
    inputs: [
      { id: 'text', label: 'Text', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'], 
        description: 'Natural language text inputs including prompts, instructions, and lengthy text documents.' },
      { id: 'images', label: 'Images', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Static image inputs that models can analyze, including photos, charts, diagrams, and screenshots.' },
      { id: 'audio', label: 'Audio', models: ['gflash', 'g15pro', 'g15reasoning'],
        description: 'Audio files or streams including speech, music, and ambient sounds for transcription or analysis.' },
      { id: 'video', label: 'Video', models: ['gflash', 'g15pro', 'g15reasoning'],
        description: 'Video content that can be analyzed for visual content, motion, and accompanying audio.' },
      { id: 'documents', label: 'Documents', models: ['gflash', 'g15pro', 'claude35', 'claude37'],
        description: 'Structured documents like PDFs, spreadsheets, or presentations with text, tables, and formatting.' },
      { id: 'structured', label: 'Structured Files', models: ['g15pro'],
        description: 'Highly structured data formats like JSON, CSV, or code repositories with specific syntax and organization.' },
    ],
    processing: [
      { id: 'reasoning', label: 'Enhanced Reasoning', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Advanced logical reasoning capabilities for solving complex problems, drawing inferences, and making connections.' },
      { id: 'cot', label: 'Chain-of-Thought', models: ['gpt45', 'gflash', 'g15reasoning', 'claude37'],
        description: 'Step-by-step reasoning process where models explicitly break down their thinking into sequential steps.' },
      { id: 'longcontext', label: 'Long Context Window', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Ability to process and maintain context over very long inputs (100K+ tokens) without losing important information.' },
      { id: 'tooluse', label: 'Tool Use & Function Calling', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Capability to use external tools, call functions, execute code, or interface with APIs to extend functionality.' },
      { id: 'multimodal', label: 'Multimodal Understanding', models: ['gflash', 'g15pro', 'claude35', 'claude37'],
        description: 'Integration of information across different modalities (text, images, etc.) for unified comprehension.' },
      { id: 'memory', label: 'Memory & Personalization', models: ['gpt45', 'claude35', 'claude37'],
        description: 'Ability to remember past interactions or user preferences to provide more personalized responses.' },
    ],
    outputs: [
      { id: 'text_out', label: 'Text/Reports', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Natural language text outputs including explanations, stories, summaries, and detailed reports.' },
      { id: 'structured_out', label: 'Structured Data (JSON/XML)', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Formatted data structures that follow specific schemas like JSON or XML for easy integration with other systems.' },
      { id: 'code', label: 'Code', models: ['gpt45', 'gflash', 'g15pro', 'g15reasoning', 'claude35', 'claude37'],
        description: 'Programming code in various languages, including functions, scripts, or complete applications.' },
      { id: 'images_out', label: 'Images', models: ['gflash'],
        description: 'AI-generated images, modified images, or visual representations based on text prompts.' },
      { id: 'documents_out', label: 'Documents & Artifacts', models: ['gpt45', 'g15pro', 'claude35', 'claude37'],
        description: 'Complex documents with formatting, sections, and potentially embedded content like tables or charts.' },
      { id: 'interactive', label: 'Interactive Visuals', models: ['claude35', 'claude37'],
        description: 'Dynamic, interactive visual outputs such as charts, diagrams, or interfaces that users can manipulate.' },
    ]
  };

  // Define models with their display names and colors
  const models = [
    { id: 'gpt45', name: 'GPT 4.5', color: '#74aa9c', description: 'OpenAI\'s GPT-4.5 large language model with enhanced reasoning and knowledge capabilities.' },
    { id: 'gflash', name: 'Gemini Flash', color: '#4285F4', description: 'Google\'s Gemini Flash model optimized for fast responses with strong reasoning capabilities and multimodal inputs.' },
    { id: 'g15pro', name: 'Gemini 1.5 Pro', color: '#34A853', description: 'Google\'s Gemini 1.5 Pro featuring extremely long context window and advanced multimodal processing.' },
    { id: 'g15reasoning', name: 'Gemini 1.5 Reasoning', color: '#FBBC05', description: 'Specialized variant of Gemini 1.5 focused on explicit chain-of-thought reasoning and problem-solving.' },
    { id: 'claude35', name: 'Claude 3.5 Sonnet', color: '#662D91', description: 'Anthropic\'s Claude 3.5 Sonnet balancing reasoning capabilities with speed and efficiency.' },
    { id: 'claude37', name: 'Claude 3.7 w/ Extended Thinking', color: '#8A4FFF', description: 'Claude with enhanced extended thinking mode for deeper reasoning on complex problems.' }
  ];

  // State for the active model filter, hovered node, and info modal
  const [activeModel, setActiveModel] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Function to determine if a node should be highlighted based on the active model
  const isHighlighted = (node) => {
    if (!activeModel) return true;
    return node.models.includes(activeModel);
  };

  // Function to find all connected nodes across layers
  const findConnectedNodes = (startNode, startLayer) => {
    if (!startNode) return { inputs: [], processing: [], outputs: [] };
    
    const result = {
      inputs: [],
      processing: [],
      outputs: []
    };
    
    // Add the start node itself
    result[startLayer] = [startNode];
    
    if (startLayer === 'inputs') {
      // Find processing nodes connected to this input
      const connectedProcessing = layers.processing.filter(proc => {
        const sharedModels = proc.models.filter(m => startNode.models.includes(m));
        return sharedModels.length > 0;
      });
      
      result.processing = connectedProcessing;
      
      // Find outputs connected to those processing nodes
      connectedProcessing.forEach(proc => {
        layers.outputs.forEach(output => {
          if (output.models.some(m => proc.models.includes(m)) && !result.outputs.includes(output)) {
            result.outputs.push(output);
          }
        });
      });
    } 
    else if (startLayer === 'processing') {
      // Find inputs connected to this processing node
      layers.inputs.forEach(input => {
        if (input.models.some(m => startNode.models.includes(m)) && !result.inputs.includes(input)) {
          result.inputs.push(input);
        }
      });
      
      // Find outputs connected to this processing node
      layers.outputs.forEach(output => {
        if (output.models.some(m => startNode.models.includes(m)) && !result.outputs.includes(output)) {
          result.outputs.push(output);
        }
      });
    }
    else if (startLayer === 'outputs') {
      // Find processing nodes connected to this output
      const connectedProcessing = layers.processing.filter(proc => {
        const sharedModels = proc.models.filter(m => startNode.models.includes(m));
        return sharedModels.length > 0;
      });
      
      result.processing = connectedProcessing;
      
      // Find inputs connected to those processing nodes
      connectedProcessing.forEach(proc => {
        layers.inputs.forEach(input => {
          if (input.models.some(m => proc.models.includes(m)) && !result.inputs.includes(input)) {
            result.inputs.push(input);
          }
        });
      });
    }
    
    return result;
  };
  
  // Extract hoveredNode information
  const [hoveredLayer, hoveredId] = hoveredNode ? hoveredNode.split(':') : [null, null];
  const hoveredNodeObj = hoveredLayer ? layers[hoveredLayer].find(n => n.id === hoveredId) : null;
  
  // Find connected nodes
  const connectedNodes = findConnectedNodes(hoveredNodeObj, hoveredLayer);
  
  // Function to check if a node is part of the highlighted path
  const isPartOfPath = (node, layer) => {
    if (!hoveredNode) return false;
    return connectedNodes[layer].includes(node);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-center flex-grow">AI Models Capabilities Wiring Diagram (2025)</h1>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
          onClick={() => setShowInfoModal(true)}
        >
          ?
        </button>
      </div>
      
      {/* Model selector */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm ${!activeModel ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveModel(null)}
        >
          All Models
        </button>
        {models.map(model => (
          <button
            key={model.id}
            className={`px-3 py-1 rounded-full text-sm ${activeModel === model.id ? 'text-white' : 'bg-gray-200 text-gray-800'}`}
            style={{ backgroundColor: activeModel === model.id ? model.color : '' }}
            onClick={() => setActiveModel(model.id)}
            title={model.description}
          >
            {model.name}
          </button>
        ))}
      </div>
      
      {/* Diagram layout */}
      <div className="flex justify-between gap-4">
        {/* Inputs column */}
        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Inputs</h2>
          <div className="space-y-3 w-full">
            {layers.inputs.map(node => {
              const isEgoNode = hoveredNode === `inputs:${node.id}`;
              const isConnected = isPartOfPath(node, 'inputs');
              const opacity = hoveredNode && !isConnected ? 0.3 : 1;
              
              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${!isHighlighted(node) ? 'opacity-30' : ''}
                    ${isEgoNode ? 'ring-4 ring-blue-600 shadow-lg scale-105 z-10' :
                     isConnected ? 'ring-2 ring-blue-400 shadow-md' : 'shadow-sm'}`}
                  style={{ 
                    backgroundColor: isHighlighted(node) ? 
                      (isEgoNode ? '#e6f0ff' : isConnected ? '#f0f7ff' : '#f0f4f8') : 
                      '#f0f0f0',
                    cursor: 'pointer',
                    opacity: opacity,
                    transform: isEgoNode ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={() => setHoveredNode(`inputs:${node.id}`)}
                  onMouseLeave={() => setHoveredNode(null)}
                  title={node.description}
                >
                  <div className={`font-medium ${isEgoNode ? 'text-blue-800' : ''}`}>{node.label}</div>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {node.models.map(modelId => {
                      const model = models.find(m => m.id === modelId);
                      return (
                        <div 
                          key={modelId}
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: model.color,
                            opacity: activeModel && activeModel !== modelId ? 0.3 : 1
                          }}
                          title={model.name}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Processing column */}
        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Processing & Reasoning</h2>
          <div className="space-y-3 w-full">
            {layers.processing.map(node => {
              const isEgoNode = hoveredNode === `processing:${node.id}`;
              const isConnected = isPartOfPath(node, 'processing');
              const opacity = hoveredNode && !isConnected ? 0.3 : 1;
              
              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${!isHighlighted(node) ? 'opacity-30' : ''}
                    ${isEgoNode ? 'ring-4 ring-blue-600 shadow-lg scale-105 z-10' :
                     isConnected ? 'ring-2 ring-blue-400 shadow-md' : 'shadow-sm'}`}
                  style={{ 
                    backgroundColor: isHighlighted(node) ? 
                      (isEgoNode ? '#e6f0ff' : isConnected ? '#f0f7ff' : '#edf2ff') : 
                      '#f0f0f0',
                    cursor: 'pointer',
                    opacity: opacity,
                    transform: isEgoNode ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={() => setHoveredNode(`processing:${node.id}`)}
                  onMouseLeave={() => setHoveredNode(null)}
                  title={node.description}
                >
                  <div className={`font-medium ${isEgoNode ? 'text-blue-800' : ''}`}>{node.label}</div>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {node.models.map(modelId => {
                      const model = models.find(m => m.id === modelId);
                      return (
                        <div 
                          key={modelId}
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: model.color,
                            opacity: activeModel && activeModel !== modelId ? 0.3 : 1
                          }}
                          title={model.name}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Outputs column */}
        <div className="w-1/3 flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Outputs</h2>
          <div className="space-y-3 w-full">
            {layers.outputs.map(node => {
              const isEgoNode = hoveredNode === `outputs:${node.id}`;
              const isConnected = isPartOfPath(node, 'outputs');
              const opacity = hoveredNode && !isConnected ? 0.3 : 1;
              
              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg text-center transition-all duration-200
                    ${!isHighlighted(node) ? 'opacity-30' : ''}
                    ${isEgoNode ? 'ring-4 ring-blue-600 shadow-lg scale-105 z-10' :
                     isConnected ? 'ring-2 ring-blue-400 shadow-md' : 'shadow-sm'}`}
                  style={{ 
                    backgroundColor: isHighlighted(node) ? 
                      (isEgoNode ? '#e6f0ff' : isConnected ? '#f0f7ff' : '#f0f8f4') : 
                      '#f0f0f0',
                    cursor: 'pointer',
                    opacity: opacity,
                    transform: isEgoNode ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={() => setHoveredNode(`outputs:${node.id}`)}
                  onMouseLeave={() => setHoveredNode(null)}
                  title={node.description}
                >
                  <div className={`font-medium ${isEgoNode ? 'text-blue-800' : ''}`}>{node.label}</div>
                  <div className="flex flex-wrap gap-1 mt-2 justify-center">
                    {node.models.map(modelId => {
                      const model = models.find(m => m.id === modelId);
                      return (
                        <div 
                          key={modelId}
                          className="w-3 h-3 rounded-full"
                          style={{ 
                            backgroundColor: model.color,
                            opacity: activeModel && activeModel !== modelId ? 0.3 : 1
                          }}
                          title={model.name}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8">
        <h3 className="text-base font-semibold mb-2">Models Legend</h3>
        <div className="flex flex-wrap gap-4">
          {models.map(model => (
            <div key={model.id} className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: model.color }}
              />
              <span>{model.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600">
        <p>Hover over nodes to see complete data flow paths through all three layers.</p>
        <p>Select a specific model to highlight only its capabilities, or view "All Models" for the complete picture.</p>
      </div>
      
      {/* Information Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">About This Diagram</h2>
              <button 
                onClick={() => setShowInfoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <p><strong>What is this?</strong> This interactive diagram visualizes the modular architecture of leading AI models from early 2025, showing how data flows through them.</p>
              
              <h3 className="font-semibold">Three-Layer Architecture:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Inputs</strong> (left column): The types of data each model can accept and process (text, images, audio, etc.)</li>
                <li><strong>Processing & Reasoning</strong> (middle column): The internal operations and capabilities each model uses to understand and manipulate the input</li>
                <li><strong>Outputs</strong> (right column): The formats and types of content each model can produce in response</li>
              </ul>
              
              <h3 className="font-semibold">How to Use This Diagram:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Hover over any node</strong> to see the complete path through the graph - this shows you what inputs can lead to what outputs through which processing capabilities</li>
                <li><strong>Filter by model</strong> using the buttons at the top to focus on one AI system's full capabilities</li>
                <li><strong>Hover over colored dots</strong> to see which model they represent</li>
                <li><strong>Explore connections</strong> to understand how different input types, processing capabilities, and output formats are related</li>
              </ul>
              
              <h3 className="font-semibold">Example Use Cases:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Identify which models can take image inputs and produce code outputs</li>
                <li>Discover which processing capabilities are needed to generate interactive visuals</li>
                <li>Compare the full capabilities of different models across all three layers</li>
                <li>Understand the entire data flow from input through processing to output for specific use cases</li>
              </ul>
              
              <p className="mt-4">This visualization helps you understand the components of modern AI systems and how they can be wired together for different applications.</p>
            </div>
            <button
              onClick={() => setShowInfoModal(false)}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

window.AICapabilitiesDiagram = AICapabilitiesDiagram;
