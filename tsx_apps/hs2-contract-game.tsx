import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Info } from 'lucide-react';

const GameTheorySimulator = () => {
  const [round, setRound] = useState(1);
  const [step, setStep] = useState(1);
  const [supplierOffer, setSupplierOffer] = useState(50);
  const [clientOffer, setClientOffer] = useState(50);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');

  const maxRounds = 5;
  const zopaLower = 40;
  const zopaUpper = 60;

  const scenarios = [
    { name: "Bridge Construction", supplierCost: 45, clientValue: 55 },
    { name: "Tunnel Excavation", supplierCost: 50, clientValue: 60 },
    { name: "Station Renovation", supplierCost: 40, clientValue: 50 },
    { name: "Signaling System Upgrade", supplierCost: 55, clientValue: 65 },
    { name: "Track Electrification", supplierCost: 48, clientValue: 58 },
  ];

  const currentScenario = scenarios[round - 1];

  useEffect(() => {
    if (round > maxRounds) {
      setGameOver(true);
    }
  }, [round]);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      const agreement = Math.abs(supplierOffer - clientOffer) <= 10;
      if (agreement) {
        setScore(score + 1);
        setFeedback("Great job! You've reached an agreement within the ZOPA.");
      } else {
        setFeedback("No agreement reached. Consider the ZOPA and BATNA next time.");
      }
      setRound(round + 1);
      setStep(1);
      setSupplierOffer(50);
      setClientOffer(50);
    }
  };

  const resetGame = () => {
    setRound(1);
    setStep(1);
    setScore(0);
    setGameOver(false);
    setSupplierOffer(50);
    setClientOffer(50);
    setFeedback('');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Understand the Scenario</h3>
            <p>Current work package: {currentScenario.name}</p>
            <p>Supplier's cost: {currentScenario.supplierCost}%</p>
            <p>Client's perceived value: {currentScenario.clientValue}%</p>
            <p>Consider these factors when making your offer.</p>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Supplier's Offer</h3>
            <p>As the supplier, make an offer based on your costs and desired profit margin.</p>
            <Slider
              value={[supplierOffer]}
              onValueChange={(value) => setSupplierOffer(value[0])}
              max={100}
              step={1}
            />
            <p className="text-center mt-2">Supplier's Offer: {supplierOffer}%</p>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 3: Client's Counter-Offer</h3>
            <p>As the client, make a counter-offer based on your perceived value and budget constraints.</p>
            <Slider
              value={[clientOffer]}
              onValueChange={(value) => setClientOffer(value[0])}
              max={100}
              step={1}
            />
            <p className="text-center mt-2">Client's Offer: {clientOffer}%</p>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 4: Negotiation Analysis</h3>
            <p>Supplier's Offer: {supplierOffer}%</p>
            <p>Client's Offer: {clientOffer}%</p>
            <p>ZOPA: {zopaLower}% - {zopaUpper}%</p>
            <p>Difference: {Math.abs(supplierOffer - clientOffer)}%</p>
            <p>{Math.abs(supplierOffer - clientOffer) <= 10 ? "Agreement reached!" : "No agreement. Consider revising your offers."}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">HS2 Contract Negotiation Simulator</h2>
        <p className="text-center text-gray-500">Round {round} of {maxRounds}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderStep()}
          <div className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  ZOPA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Zone of Possible Agreement (ZOPA)</AlertDialogTitle>
                  <AlertDialogDescription>
                    The ZOPA is the range between each party's reservation price (the least favorable point at which one will accept a negotiated agreement). A positive ZOPA exists when there is an overlap between these two reservation prices. In this simulation, the ZOPA is between {zopaLower}% and {zopaUpper}%.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Close</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Info className="w-4 h-4 mr-2" />
                  BATNA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Best Alternative to a Negotiated Agreement (BATNA)</AlertDialogTitle>
                  <AlertDialogDescription>
                    BATNA is the most advantageous alternative course of action a party can take if negotiations fail and an agreement cannot be reached. In the context of HS2 contracts, this might involve seeking alternative suppliers, adjusting project timelines, or re-evaluating the scope of work. Always consider your BATNA when negotiating to ensure you're not accepting an agreement that's worse than your best alternative.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Close</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <div className="mb-4">
          <p className="font-semibold">Score: {score}/{maxRounds}</p>
          {feedback && <p className="text-sm text-gray-600 mt-2">{feedback}</p>}
        </div>
        {gameOver ? (
          <Button onClick={resetGame}>Play Again</Button>
        ) : (
          <Button onClick={handleNextStep}>Next {step < 4 ? "Step" : "Round"}</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GameTheorySimulator;
