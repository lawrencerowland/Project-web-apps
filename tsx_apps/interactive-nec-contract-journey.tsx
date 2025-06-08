// This file is executed directly in the browser using Babel. We therefore
// avoid ES module imports and rely on the global `React` variable which is
// provided by the HTML page.  Any custom UI components are replaced with
// simple HTML elements so that no external dependencies are required.

const contractJourney = [
  {
    id: 'scope',
    title: 'Scope Statement',
    content: 'The Contractor shall install a state-of-the-art HVAC system in the new office building.',
  },
  {
    id: 'works-info',
    title: 'Works Information (Clause 11.2)',
    content: 'HVAC system must maintain 68-72°F year-round, with zonal controls for each floor. Energy efficiency rating of at least 18 SEER required.',
  },
  {
    id: 'program',
    title: 'Program (Clause 31)',
    content: 'HVAC installation scheduled for weeks 12-16 of the project. Includes 1 week for testing and commissioning.',
  },
  {
    id: 'early-warning',
    title: 'Early Warning (Clause 16)',
    content: 'Contractor notifies that the specified HVAC model has a 10-week lead time, potentially delaying installation.',
  },
  {
    id: 'compensation-events',
    title: 'Compensation Events (Clause 60)',
    content: 'Project Manager instructs use of a different HVAC model with higher specs, leading to a compensation event for the price difference.',
  },
  {
    id: 'price',
    title: 'Price for Work Done to Date (Clause 11.2)',
    content: 'Upon successful installation and testing of HVAC system, Contractor can claim 15% of total contract value as per payment schedule.',
  },
  {
    id: 'defects',
    title: 'Defects (Clause 11.2)',
    content: 'During the defect correction period, any failure to maintain specified temperature range is considered a defect to be rectified by the Contractor.',
  },
];

const ContractJourney = () => {
  const [selectedCard, setSelectedCard] = React.useState(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">NEC Contract Journey: HVAC System Installation</h2>
      <div className="bg-blue-100 p-4 rounded-lg mb-4 flex items-start">
        <span className="text-blue-500 mr-2 mt-1">ℹ️</span>
        <div>
          <h3 className="font-bold text-lg mb-2">How to use this interactive guide:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Each card represents a key section of the NEC contract related to our HVAC installation scope.</li>
            <li>Click on any card to reveal more detailed information about how that specific clause relates to the HVAC installation.</li>
            <li>Click again to collapse the details.</li>
            <li>Explore all cards to understand how different parts of the contract interact in practice.</li>
          </ol>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contractJourney.map((item) => (
          <div
            key={item.id}
            className={`border rounded-md p-4 cursor-pointer transition-all duration-300 bg-white shadow ${
              selectedCard === item.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCard(selectedCard === item.id ? null : item.id)}
          >
            <div className="font-bold mb-2">{item.title}</div>
            <div>{selectedCard === item.id ? item.content : 'Click to view details'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

