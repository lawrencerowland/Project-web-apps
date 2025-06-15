import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Package, ArrowLeftRight, Check } from 'lucide-react';

const ProjectVsProgramme = () => {
  const [view, setView] = useState('project');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const items = {
    project: [
      "Specific objective",
      "Defined timeline",
      "Unique deliverables",
      "Limited scope",
      "Single team"
    ],
    programme: [
      "Strategic objectives",
      "Long-term timeline",
      "Multiple related projects",
      "Broader scope",
      "Multiple teams"
    ]
  };

  const quizQuestions = [
    {
      question: "Which typically has a broader scope?",
      options: ["Project", "Programme"],
      correct: "Programme"
    },
    {
      question: "Which is more likely to have a single team?",
      options: ["Project", "Programme"],
      correct: "Project"
    },
    {
      question: "Which is often compared to a TV series with multiple seasons?",
      options: ["Project", "Programme"],
      correct: "Programme"
    }
  ];

  const handleAnswer = (answer) => {
    if (answer === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizStarted(false);
      setCurrentQuestion(0);
    }
  };

  const ViewCard = ({ title, icon, description, items }) => (
    <Card className="w-full transition-all duration-300 ease-in-out transform hover:scale-105">
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-none pl-5">
          {items.map((item, index) => (
            <li key={index} className="mb-2 flex items-center">
              <Check className="mr-2 text-green-500" size={16} />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500 italic">
          {title === "Project" 
            ? "Think of a project as a single movie production!"
            : "Think of a programme as a TV series with multiple seasons!"}
        </p>
      </CardFooter>
    </Card>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Project vs Programme: What's the Difference?</h1>
      
      {!quizStarted ? (
        <>
          <div className="flex justify-center space-x-4 mb-6">
            <Button
              onClick={() => setView('project')}
              variant={view === 'project' ? "default" : "outline"}
              className="transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <Briefcase className="mr-2" /> Project
            </Button>
            <Button
              onClick={() => setView('compare')}
              variant={view === 'compare' ? "default" : "outline"}
              className="transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <ArrowLeftRight className="mr-2" /> Compare
            </Button>
            <Button
              onClick={() => setView('programme')}
              variant={view === 'programme' ? "default" : "outline"}
              className="transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <Package className="mr-2" /> Programme
            </Button>
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: view === 'compare' ? '1fr 1fr' : '1fr' }}>
            {(view === 'project' || view === 'compare') && (
              <ViewCard
                title="Project"
                icon={<Briefcase className="mr-2" />}
                description="A temporary endeavor to create a unique product or service"
                items={items.project}
              />
            )}
            {(view === 'programme' || view === 'compare') && (
              <ViewCard
                title="Programme"
                icon={<Package className="mr-2" />}
                description="A coordinated group of related projects"
                items={items.programme}
              />
            )}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => setQuizStarted(true)} className="transition-all duration-300 ease-in-out transform hover:scale-110">
              Test Your Knowledge!
            </Button>
          </div>
        </>
      ) : (
        <Card className="w-full mt-4">
          <CardHeader>
            <CardTitle>Quick Quiz</CardTitle>
            <CardDescription>Question {currentQuestion + 1} of {quizQuestions.length}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{quizQuestions[currentQuestion].question}</p>
            <div className="flex justify-center space-x-4">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <Button key={index} onClick={() => handleAnswer(option)} className="transition-all duration-300 ease-in-out transform hover:scale-110">
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
          {currentQuestion === quizQuestions.length - 1 && (
            <CardFooter className="flex justify-center">
              <p className="text-lg font-semibold">Your Score: {score}/{quizQuestions.length}</p>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};

export default ProjectVsProgramme;
