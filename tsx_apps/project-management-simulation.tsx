// This file is executed directly in the browser using Babel. We therefore rely
// on the globally provided `React` and `Recharts` variables rather than ES
// module imports. Minimal stand-ins for the UI components from `shadcn/ui` and
// the `lucide-react` icons are implemented below so the simulation can run
// without additional build steps or dependencies.

const { useState, useEffect } = React;
const {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ErrorBar,
  ReferenceLine,
} = Recharts;

const Card = ({ className = '', ...props }) => (
  <div className={`border rounded shadow p-4 ${className}`} {...props} />
);
const CardHeader = ({ className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);
const CardContent = ({ className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);
const CardFooter = ({ className = '', ...props }) => (
  <div className={`mt-4 ${className}`} {...props} />
);

const Button = ({ className = '', variant, ...props }) => (
  <button
    className={`px-4 py-2 rounded ${
      variant === 'outline'
        ? 'border'
        : variant === 'destructive'
        ? 'bg-red-500 text-white'
        : 'bg-blue-500 text-white'
    } ${className}`}
    {...props}
  />
);

const Slider = ({ value, onValueChange, max = 100, step = 1 }) => (
  <input
    type="range"
    value={value[0]}
    onChange={(e) => onValueChange([Number(e.target.value)])}
    max={max}
    step={step}
    className="w-full"
  />
);

const createIcon = (symbol: string) =>
  ({ className = '', ...props }) => (
    <span className={`inline-block ${className}`} {...props}>{symbol}</span>
  );

const AlertCircle = createIcon('!');
const Info = createIcon('ℹ');
const ArrowRight = createIcon('→');
const Activity = createIcon('🏃');
const BarChart2 = createIcon('📊');
const Clock = createIcon('⏱');

const initialState = {
  step: 0,
  overallEstimate: { mean: 26, uncertainty: 8 },
  features: [
    { name: 'Data Ingestion', mean: 4, uncertainty: 2, progress: 0, resourceAllocation: 20 },
    { name: 'ML Model', mean: 8, uncertainty: 3, progress: 0, resourceAllocation: 20 },
    { name: 'UI', mean: 6, uncertainty: 2, progress: 0, resourceAllocation: 20 },
    { name: 'Integration', mean: 5, uncertainty: 2, progress: 0, resourceAllocation: 20 },
    { name: 'Security', mean: 3, uncertainty: 1, progress: 0, resourceAllocation: 20 },
  ],
  freeEnergy: 100,
  freeEnergyHistory: [100],
  freeEnergyExplanation: 'Initial free energy based on starting uncertainties.'
};

const actions = [
  {
    description: 'Initial Setup and Planning',
    explanation: 'We start with our initial estimates, uncertainties, and equal resource allocation for each feature.',
    freeEnergyExplanation: 'Free energy starts at a baseline level, representing our initial uncertainty about the project.',
    update: (state) => ({ ...state, step: state.step + 1 }),
    decision: 'Maintain equal resource allocation for initial development sprint.',
    activeInferenceInsight: 'In active inference, we begin with prior beliefs (our initial estimates) and prepare to update them as new evidence emerges.'
  },
  {
    description: 'First Development Sprint',
    explanation: 'After the first sprint, we observe varied progress. Integration is behind schedule, increasing uncertainty.',
    freeEnergyExplanation: 'Free energy increases due to the surprise of Integration falling behind schedule. This indicates a mismatch between our expectations and observations.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [40, 20, 30, 10, 25];
        const newAllocations = [15, 15, 15, 40, 15];
        return {
          ...feature,
          progress: progressIncreases[index],
          mean: index === 3 ? feature.mean + 1 : feature.mean,
          uncertainty: index === 3 ? feature.uncertainty + 1 : feature.uncertainty,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 28, uncertainty: 9 },
        freeEnergy: 120,
        freeEnergyHistory: [...state.freeEnergyHistory, 120],
        freeEnergyExplanation: 'Integration delays increased uncertainty, raising free energy from 100 to 120.'
      };
    },
    decision: 'Reallocate resources to address integration delays, increasing the integration allocation from 20% to 40%.',
    activeInferenceInsight: 'When observations differ from expectations, we experience "surprise" (increased free energy). The optimal response is to update our model or change the environment through action.'
  },
  {
    description: 'Mid-Project Review',
    explanation: 'Midway through the project, we identify that the ML Model is more complex than initially estimated.',
    freeEnergyExplanation: 'Free energy remains high, but is slightly reduced due to our adaptive response to the previously identified integration issues.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [20, 15, 25, 30, 20];
        const newAllocations = [15, 35, 15, 25, 10];
        return {
          ...feature,
          progress: feature.progress + progressIncreases[index],
          mean: index === 1 ? feature.mean + 2 : feature.mean,
          uncertainty: index === 1 ? feature.uncertainty + 1 : feature.uncertainty * 0.9,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 30, uncertainty: 7 },
        freeEnergy: 110,
        freeEnergyHistory: [...state.freeEnergyHistory, 110],
        freeEnergyExplanation: 'Resource reallocation to integration helped reduce uncertainty, but discovering ML model complexity increased it, resulting in a net free energy of 110.'
      };
    },
    decision: 'Shift resources toward ML Model development (increasing from 15% to 35%) while maintaining adequate support for Integration.',
    activeInferenceInsight: 'Active inference involves a continuous balance between exploiting what we know and exploring to reduce uncertainty. Here, we explore the complexity of the ML Model.'
  },
  {
    description: 'Integration and Testing Phase',
    explanation: 'As we begin integration, we discover that the Data Ingestion and ML Model components require additional work to interface correctly.',
    freeEnergyExplanation: 'Free energy decreases slightly as we gain clarity about integration requirements, despite discovering new interface issues.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [10, 15, 20, 35, 30];
        const newAllocations = [25, 25, 10, 30, 10];
        return {
          ...feature,
          progress: feature.progress + progressIncreases[index],
          mean: index <= 1 ? feature.mean + 1 : feature.mean,
          uncertainty: index <= 1 ? feature.uncertainty + 0.5 : feature.uncertainty * 0.8,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 32, uncertainty: 6 },
        freeEnergy: 95,
        freeEnergyHistory: [...state.freeEnergyHistory, 95],
        freeEnergyExplanation: 'While new interface issues were discovered, our targeted resource allocation has helped reduce overall uncertainty, decreasing free energy to 95.'
      };
    },
    decision: 'Allocate additional resources to Data Ingestion (25%) and maintain focus on ML Model (25%) and Integration (30%).',
    activeInferenceInsight: 'In active inference, precision weighting determines how much we update our beliefs based on new evidence. Higher precision (lower uncertainty) evidence has more influence.'
  },
  {
    description: 'Final Push and Project Completion',
    explanation: 'In the final phase, we focus on completing all features and ensuring overall system stability.',
    freeEnergyExplanation: 'Free energy decreases significantly as uncertainties are resolved and the project nears completion.',
    update: (state) => {
      const newFeatures = state.features.map((feature, index) => {
        const progressIncreases = [25, 25, 20, 15, 25];
        const newAllocations = [20, 20, 20, 20, 20];
        return {
          ...feature,
          progress: Math.min(100, feature.progress + progressIncreases[index]),
          mean: feature.mean,
          uncertainty: feature.uncertainty * 0.5,
          resourceAllocation: newAllocations[index],
        };
      });
      return {
        ...state,
        step: state.step + 1,
        features: newFeatures,
        overallEstimate: { mean: 33, uncertainty: 3 },
        freeEnergy: 70,
        freeEnergyHistory: [...state.freeEnergyHistory, 70],
        freeEnergyExplanation: 'As the project reaches completion, uncertainty is significantly reduced across all features, resulting in a final free energy of 70.'
      };
    },
    decision: 'Balance resources equally (20% each) across all features for final completion and testing.',
    activeInferenceInsight: 'The end goal of active inference is to minimize surprise (free energy) by creating accurate models and taking actions that confirm those models.'
  },
];

const ProjectManagementSimulation = () => {
  const [state, setState] = useState(initialState);
  const [autoPlay, setAutoPlay] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [showActiveInferenceInsights, setShowActiveInferenceInsights] = useState(true);

  useEffect(() => {
    let timer;
    if (autoPlay && state.step < actions.length) {
      timer = setTimeout(() => {
        handleNextStep();
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, state.step, playbackSpeed]);

  const handleNextStep = () => {
    if (state.step < actions.length) {
      setState(actions[state.step].update(state));
    } else {
      setAutoPlay(false);
    }
  };

  const handleReset = () => {
    setState(initialState);
    setAutoPlay(false);
  };

  const handlePlaybackSpeedChange = (value) => {
    setPlaybackSpeed(2000 - value[0]);
  };

  const estimateChartData = state.features.map((feature) => ({
    name: feature.name,
    mean: feature.mean,
    uncertainty: feature.uncertainty,
    lowErrorBar: feature.mean - feature.uncertainty,
    highErrorBar: feature.mean + feature.uncertainty,
  }));

  const progressAndResourceChartData = state.features.map((feature) => ({
    name: feature.name,
    progress: feature.progress,
    resourceAllocation: feature.resourceAllocation,
  }));

  const totalProgress = state.features.reduce((sum, feature) => sum + feature.progress, 0) / 
    state.features.length;
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project Management Simulation with Active Inference</h1>
      
      {/* Project Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Clock className="mr-2" />
            <h3>Time Estimate</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{state.overallEstimate.mean} ±{state.overallEstimate.uncertainty} weeks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <Activity className="mr-2" />
            <h3>Free Energy</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{state.freeEnergy.toFixed(0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <BarChart2 className="mr-2" />
            <h3>Overall Progress</h3>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalProgress.toFixed(0)}%</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Current Action and Decision */}
      <Card className="mb-4">
        <CardHeader className="flex items-center justify-between">
          <h3 className="font-semibold">Current Step: {state.step} / {actions.length}</h3>
          {state.step > 0 && (
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {actions[state.step - 1].description}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {state.step > 0 ? (
            <>
              <p>{actions[state.step - 1].explanation}</p>
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <p className="font-medium flex items-center">
                  <ArrowRight size={16} className="mr-2" /> Decision: {actions[state.step - 1].decision}
                </p>
              </div>
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p>
                  <span className="font-medium">Free Energy Explanation:</span> {state.freeEnergyExplanation}
                </p>
              </div>
              {showActiveInferenceInsights && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="font-medium">Active Inference Insight:</p>
                  <p>{actions[state.step - 1].activeInferenceInsight}</p>
                </div>
              )}
            </>
          ) : (
            <p>Press 'Next Step' or 'Auto-Play' to start the simulation.</p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => setShowActiveInferenceInsights(!showActiveInferenceInsights)}
            variant="outline"
            size="sm"
          >
            {showActiveInferenceInsights ? 'Hide' : 'Show'} Active Inference Insights
          </Button>
        </CardFooter>
      </Card>

      {/* Free Energy Chart */}
      <Card className="mb-4">
        <CardHeader>
          <h3 className="font-semibold">Free Energy Over Time</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart 
              data={state.freeEnergyHistory.map((value, index) => ({ step: index, value }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="step" />
              <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip />
              <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" label="Initial Value" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feature Estimates and Uncertainty */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Feature Estimates and Uncertainty</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={estimateChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="mean" fill="#8884d8" name="Mean Estimate (weeks)">
              <ErrorBar dataKey="uncertainty" width={4} strokeWidth={2} stroke="#8884d8" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature Progress and Resource Allocation */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Feature Progress and Resource Allocation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={progressAndResourceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" domain={[0, 100]} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#82ca9d" name="Progress (%)" yAxisId="left" />
            <Bar dataKey="resourceAllocation" fill="#ffc658" name="Resource Allocation (%)" yAxisId="right" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="flex mb-2 md:mb-0">
          <Button onClick={handleNextStep} disabled={state.step >= actions.length || autoPlay}>
            Next Step
          </Button>
          <Button onClick={() => setAutoPlay(!autoPlay)} className="ml-2" variant={autoPlay ? "destructive" : "default"}>
            {autoPlay ? 'Pause' : 'Auto-Play'}
          </Button>
          <Button onClick={handleReset} className="ml-2" variant="outline">
            Reset
          </Button>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Playback Speed:</span>
          <Slider
            defaultValue={[1000]}
            max={1900}
            step={100}
            onValueChange={handlePlaybackSpeedChange}
            className="w-32"
          />
        </div>
      </div>

      {/* About Active Inference */}
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center">
          <Info className="mr-2" />
          <h3 className="font-semibold">About Active Inference in Project Management</h3>
        </CardHeader>
        <CardContent>
          <p>Active Inference is a framework from computational neuroscience that combines perception, learning, and decision-making. In project management, it helps us:</p>
          <ul className="list-disc pl-5 mt-2">
            <li>Continuously update our beliefs (estimates) based on new information</li>
            <li>Make decisions that reduce uncertainty and align expectations with reality</li>
            <li>Optimize resource allocation by focusing on areas with high uncertainty or potential impact</li>
            <li>Quantify and minimize "surprise" (free energy) throughout the project lifecycle</li>
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            Free energy can be understood as the sum of:
            <br />
            1. The discrepancy between our model's predictions and actual observations (prediction error)
            <br />
            2. The complexity of our model compared to our prior beliefs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

