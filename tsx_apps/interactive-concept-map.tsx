import React, { useState, useCallback } from 'react';

const TriadGraph = ({ triad }) => {
  const centerX = 150;
  const centerY = 150;
  const radius = 100;

  const nodePositions = [
    { x: centerX, y: centerY - radius },
    { x: centerX - radius * Math.sin(Math.PI / 3), y: centerY + radius * Math.cos(Math.PI / 3) },
    { x: centerX + radius * Math.sin(Math.PI / 3), y: centerY + radius * Math.cos(Math.PI / 3) },
  ];

  return (
    <svg width="300" height="300" className="border border-gray-300">
      {/* Draw lines */}
      {nodePositions.map((start, i) => (
        nodePositions.slice(i + 1).map((end, j) => (
          <line key={`line-${i}-${j}`} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="black" />
        ))
      ))}
      
      {/* Draw nodes */}
      {nodePositions.map((pos, i) => (
        <g key={`node-${i}`}>
          <circle cx={pos.x} cy={pos.y} r="20" fill={i === 2 ? "lightgreen" : "lightblue"} stroke="black" />
          <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontSize="12">
            {triad.nodes[i] || ''}
          </text>
        </g>
      ))}

      {/* Draw title */}
      <text x={centerX} y={centerY} textAnchor="middle" dominantBaseline="middle" fontSize="14" fontWeight="bold">
        {triad.title || ''}
      </text>
    </svg>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white p-2 rounded">Close</button>
      </div>
    </div>
  );
};

const InteractiveConceptMap = () => {
  const [triads, setTriads] = useState([]);
  const [currentConcept, setCurrentConcept] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [step, setStep] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleConceptChange = (e) => setCurrentConcept(e.target.value.trim());
  const handleTitleChange = (e) => setCurrentTitle(e.target.value.trim());

  const handleAddConcept = useCallback(() => {
    if (step === 0 && currentTitle && currentConcept) {
      setTriads(prevTriads => [...prevTriads, { nodes: [currentConcept], title: currentTitle }]);
      setStep(1);
    } else if ((step === 1 || step === 2) && currentConcept) {
      setTriads(prevTriads => {
        const updatedTriads = [...prevTriads];
        const currentTriad = updatedTriads[updatedTriads.length - 1];
        if (currentTriad && currentTriad.nodes) {
          currentTriad.nodes.push(currentConcept);
        }
        return updatedTriads;
      });
      setStep(step === 1 ? 2 : 0);
    }
    setCurrentConcept('');
    if (step === 2) setCurrentTitle('');
  }, [step, currentConcept, currentTitle]);

  const isButtonDisabled = (step === 0 && (!currentTitle || !currentConcept)) || (step !== 0 && !currentConcept);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Interactive Concept Map Builder</h1>
      <div className="mb-4 space-x-2">
        <button onClick={() => setShowInstructions(true)} className="bg-green-500 text-white p-2 rounded">
          Instructions
        </button>
        <button onClick={() => setShowAbout(true)} className="bg-purple-500 text-white p-2 rounded">
          What is this about?
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Current Triads:</h2>
        <div className="flex flex-wrap gap-4">
          {triads.map((triad, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold">{triad.title}</h3>
              <TriadGraph triad={triad} />
              <p>{triad.nodes.join(' - ')}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {step === 0 && (
          <input
            value={currentTitle}
            onChange={handleTitleChange}
            placeholder="Triad title"
            className="border p-2 mr-2"
          />
        )}
        <input
          value={currentConcept}
          onChange={handleConceptChange}
          placeholder={`Concept ${(step % 3) + 1}`}
          className="border p-2 mr-2"
        />
        <button 
          onClick={handleAddConcept} 
          className={`bg-blue-500 text-white p-2 rounded ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isButtonDisabled}
        >
          {step === 2 ? 'Complete Triad' : 'Add Concept'}
        </button>
        {step === 2 && (
          <span className="ml-2 text-sm text-gray-600">
            Destabilise the polarity by introducing a third term
          </span>
        )}
      </div>
      <Modal isOpen={showInstructions} onClose={() => setShowInstructions(false)} title="Instructions">
        <ol className="list-decimal list-inside">
          <li>Enter a title for your triad in the "Triad title" field.</li>
          <li>Enter the first concept and click "Add Concept".</li>
          <li>Enter the second concept and click "Add Concept".</li>
          <li>Enter the third concept to destabilise the polarity and click "Complete Triad".</li>
          <li>The completed triad will be displayed as a triangle graph with the third node in green.</li>
          <li>Repeat the process to create additional triads.</li>
        </ol>
      </Modal>
      <Modal isOpen={showAbout} onClose={() => setShowAbout(false)} title="What is this about?">
        <p>
          This Interactive Concept Map Builder is based on Dave Snowden's trialectic method, which aims to destabilize perceived polarities in complex systems. By introducing a third element to a seemingly binary situation, we can reveal new perspectives and solutions that were previously hidden.
        </p>
        <p className="mt-2">
          The benefit of destabilizing a perceived polarity is that it helps us move beyond simplistic either/or thinking. In real-world complex systems, situations are rarely as simple as two opposing forces. By identifying and visualizing a third factor, we can:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Uncover hidden relationships and dynamics</li>
          <li>Encourage more nuanced and creative problem-solving</li>
          <li>Avoid false dichotomies and oversimplification</li>
          <li>Embrace the complexity of real-world situations</li>
          <li>Foster innovative thinking and novel approaches</li>
        </ul>
        <p className="mt-2">
          Use this tool to explore complex concepts, challenge your assumptions, and discover new insights by thinking beyond simple polarities.
        </p>
      </Modal>
    </div>
  );
};

export default InteractiveConceptMap;
