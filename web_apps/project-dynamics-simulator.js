var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const { useState, useEffect, useRef } = React;
const { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, } = Recharts;
const createIcon = (symbol) => (_a) => {
    var { className = "" } = _a, props = __rest(_a, ["className"]);
    return (React.createElement("span", Object.assign({ className: `inline-block ${className}` }, props), symbol));
};
const AlertCircle = createIcon("⚠");
const Clock = createIcon("⏰");
const Target = createIcon("🎯");
const ThumbsUp = createIcon("👍");
const AlertTriangle = createIcon("⚠");
const Zap = createIcon("⚡");
const ProjectDynamicsSimulator = () => {
    // State for simulation parameters
    const [week, setWeek] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [speed, setSpeed] = useState(1000); // ms between updates
    const [history, setHistory] = useState([]);
    const [showEffects, setShowEffects] = useState({
        technicalDebt: true,
        teamLearning: true,
        userFeedback: true,
        weeklyMeetings: true,
        monthlyReviews: true,
        unexpectedEvents: true,
    });
    // Project state
    const [projectState, setProjectState] = useState({
        progress: 0,
        velocity: 10,
        quality: 70,
        morale: 80,
        technicalDebt: 0,
        teamCapability: 1,
        scope: 100,
    });
    // Event log
    const [eventLog, setEventLog] = useState([
        { week: 0, event: "Project started", type: "info" }
    ]);
    // Timer reference
    const timerRef = useRef(null);
    // Handle simulation speed change
    const handleSpeedChange = (e) => {
        const newSpeed = parseInt(e.target.value);
        setSpeed(newSpeed);
        // Reset the timer if it's running
        if (isRunning) {
            clearInterval(timerRef.current);
            timerRef.current = setInterval(advanceWeek, newSpeed);
        }
    };
    // Reset simulation
    const resetSimulation = () => {
        setIsRunning(false);
        clearInterval(timerRef.current);
        setWeek(1);
        setHistory([]);
        setEventLog([{ week: 0, event: "Project started", type: "info" }]);
        setProjectState({
            progress: 0,
            velocity: 10,
            quality: 70,
            morale: 80,
            technicalDebt: 0,
            teamCapability: 1,
            scope: 100,
        });
    };
    // Toggle simulation
    const toggleSimulation = () => {
        if (isRunning) {
            clearInterval(timerRef.current);
        }
        else {
            timerRef.current = setInterval(advanceWeek, speed);
        }
        setIsRunning(!isRunning);
    };
    // Advance simulation by one week
    const advanceWeek = () => {
        // Make a copy of current state
        const newState = Object.assign({}, projectState);
        const newEvents = [];
        // Apply base progress
        const baseProgress = newState.velocity * newState.teamCapability;
        let actualProgress = baseProgress;
        // 1. Technical Debt effect (negative feedback loop)
        if (showEffects.technicalDebt) {
            const debtIncrease = Math.random() * 2;
            newState.technicalDebt += debtIncrease;
            // Technical debt slows down progress
            const debtEffect = 1 - (newState.technicalDebt / 100);
            actualProgress *= Math.max(0.5, debtEffect);
            if (newState.technicalDebt > 30 && Math.random() < 0.3) {
                newEvents.push({
                    week: week,
                    event: "Technical debt is slowing down development",
                    type: "warning"
                });
            }
        }
        // 2. Team Learning effect (positive feedback loop)
        if (showEffects.teamLearning) {
            // Team gradually becomes more capable
            newState.teamCapability += 0.01;
            // Every few weeks, make a notable improvement
            if (week % 5 === 0 && Math.random() < 0.7) {
                const learningBoost = 0.05 + (Math.random() * 0.1);
                newState.teamCapability += learningBoost;
                newEvents.push({
                    week: week,
                    event: "Team found a more efficient way to work!",
                    type: "success"
                });
            }
        }
        // 3. Weekly review (regular cycle)
        if (showEffects.weeklyMeetings && week % 1 === 0) {
            // Weekly meetings slightly reduce velocity but can improve quality
            actualProgress *= 0.95;
            newState.quality += Math.random() * 2;
            if (week % 4 === 0) {
                newEvents.push({
                    week: week,
                    event: "Weekly planning session held",
                    type: "info"
                });
            }
        }
        // 4. Monthly review (regular cycle with bigger impact)
        if (showEffects.monthlyReviews && week % 4 === 0) {
            // Monthly reviews take time but can address technical debt
            actualProgress *= 0.8;
            const debtReduction = 5 + (Math.random() * 5);
            newState.technicalDebt = Math.max(0, newState.technicalDebt - debtReduction);
            newEvents.push({
                week: week,
                event: "Monthly review: reduced technical debt",
                type: "info"
            });
            // Occasionally discover scope changes during reviews
            if (Math.random() < 0.3) {
                const scopeChange = 5 + Math.floor(Math.random() * 10);
                newState.scope += scopeChange;
                newEvents.push({
                    week: week,
                    event: `Scope increased by ${scopeChange}% after stakeholder review`,
                    type: "warning"
                });
            }
        }
        // 5. User Feedback (can be positive or negative feedback loop)
        if (showEffects.userFeedback && week % 3 === 0 && newState.progress > 20) {
            const feedbackQuality = (newState.quality / 100) - 0.3 + (Math.random() * 0.3);
            if (feedbackQuality > 0.5) {
                // Positive feedback boosts morale and velocity
                newState.morale += 5;
                newState.velocity += 1;
                if (Math.random() < 0.5) {
                    newEvents.push({
                        week: week,
                        event: "Positive user feedback boosted team morale",
                        type: "success"
                    });
                }
            }
            else {
                // Negative feedback hurts morale and may increase scope (rework)
                newState.morale = Math.max(40, newState.morale - 5);
                if (Math.random() < 0.5) {
                    const rework = Math.floor(Math.random() * 5);
                    newState.progress = Math.max(0, newState.progress - rework);
                    newEvents.push({
                        week: week,
                        event: "Negative user feedback requires rework",
                        type: "danger"
                    });
                }
            }
        }
        // 6. Unexpected events (random elements)
        if (showEffects.unexpectedEvents && Math.random() < 0.15) {
            const eventType = Math.random();
            if (eventType < 0.4) {
                // Negative event
                const impact = 5 + Math.floor(Math.random() * 10);
                newState.velocity = Math.max(5, newState.velocity - 2);
                newState.progress = Math.max(0, newState.progress - impact);
                const events = [
                    "Team member unexpectedly absent for the week",
                    "Critical bug discovered in production",
                    "External dependency updated with breaking changes",
                    "Infrastructure outage delayed testing"
                ];
                newEvents.push({
                    week: week,
                    event: events[Math.floor(Math.random() * events.length)],
                    type: "danger"
                });
            }
            else if (eventType < 0.7) {
                // Neutral event that might have future consequences
                const events = [
                    "New team member onboarding begins",
                    "Management considering reorganization",
                    "Competitor released similar feature",
                    "Stakeholders requesting progress report"
                ];
                newEvents.push({
                    week: week,
                    event: events[Math.floor(Math.random() * events.length)],
                    type: "warning"
                });
            }
            else {
                // Positive unexpected event
                newState.velocity += 2;
                newState.morale = Math.min(100, newState.morale + 5);
                const events = [
                    "Team innovation solved multiple problems at once",
                    "New tool dramatically improved workflow",
                    "Unexpected solution simplifies implementation",
                    "External dependency update brings helpful features"
                ];
                newEvents.push({
                    week: week,
                    event: events[Math.floor(Math.random() * events.length)],
                    type: "success"
                });
            }
        }
        // Apply morale effects on velocity
        const moraleEffect = 0.5 + (newState.morale / 200); // 0.5 to 1
        newState.velocity = Math.max(5, newState.velocity * moraleEffect);
        // Update progress
        newState.progress += actualProgress;
        // Check for project completion
        if (newState.progress >= newState.scope) {
            newState.progress = newState.scope;
            newEvents.push({
                week: week,
                event: "Project completed!",
                type: "success"
            });
            setIsRunning(false);
            clearInterval(timerRef.current);
        }
        // Clean up state values
        Object.keys(newState).forEach(key => {
            if (typeof newState[key] === 'number' && key !== 'scope') {
                // Round to 1 decimal place
                newState[key] = Math.round(newState[key] * 10) / 10;
            }
        });
        // Update history
        const historyEntry = Object.assign(Object.assign({ week }, newState), { progressPercent: Math.round((newState.progress / newState.scope) * 100) });
        // Update state
        setProjectState(newState);
        setWeek(week + 1);
        setHistory(prev => [...prev, historyEntry]);
        if (newEvents.length > 0) {
            setEventLog(prev => [...prev, ...newEvents]);
        }
    };
    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);
    // Toggle effect handler
    const toggleEffect = (effect) => {
        setShowEffects(prev => (Object.assign(Object.assign({}, prev), { [effect]: !prev[effect] })));
    };
    // Manually advance one week
    const stepWeek = () => {
        advanceWeek();
    };
    // Calculate completion percentage
    const completionPercentage = Math.min(100, Math.round((projectState.progress / projectState.scope) * 100));
    // Format for event types
    const eventIcons = {
        info: React.createElement(Clock, { size: 16, className: "text-blue-500" }),
        warning: React.createElement(AlertTriangle, { size: 16, className: "text-yellow-500" }),
        danger: React.createElement(AlertCircle, { size: 16, className: "text-red-500" }),
        success: React.createElement(ThumbsUp, { size: 16, className: "text-green-500" })
    };
    return (React.createElement("div", { className: "flex flex-col gap-4 p-4 bg-gray-50 rounded-lg" },
        React.createElement("div", { className: "flex justify-between items-center" },
            React.createElement("h2", { className: "text-xl font-bold" }, "Software Development Project Simulator"),
            React.createElement("div", { className: "text-sm text-gray-500" },
                "Week: ",
                week)),
        React.createElement("div", { className: "bg-gray-200 rounded-full h-6 mb-2" },
            React.createElement("div", { className: "bg-blue-500 h-6 rounded-full flex items-center justify-center text-white text-sm", style: { width: `${completionPercentage}%` } },
                completionPercentage,
                "%")),
        React.createElement("div", { className: "flex gap-2 mb-4" },
            React.createElement("button", { onClick: toggleSimulation, className: `px-4 py-2 rounded font-medium ${isRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}` }, isRunning ? 'Pause' : 'Start'),
            React.createElement("button", { onClick: stepWeek, className: "px-4 py-2 bg-blue-500 text-white rounded font-medium", disabled: isRunning }, "Step Forward"),
            React.createElement("button", { onClick: resetSimulation, className: "px-4 py-2 bg-gray-500 text-white rounded font-medium" }, "Reset"),
            React.createElement("div", { className: "flex items-center ml-4" },
                React.createElement("span", { className: "mr-2 text-sm" }, "Speed:"),
                React.createElement("input", { type: "range", min: "200", max: "2000", step: "100", value: speed, onChange: handleSpeedChange, className: "w-32" }),
                React.createElement("span", { className: "ml-2 text-sm" },
                    speed,
                    "ms"))),
        React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4" },
            React.createElement("div", { className: "flex flex-col gap-4" },
                React.createElement("div", { className: "bg-white p-4 rounded-lg shadow" },
                    React.createElement("h3", { className: "font-bold mb-2" }, "Current Project Metrics"),
                    React.createElement("div", { className: "grid grid-cols-2 gap-2" },
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-gray-500" }, "Progress"),
                            React.createElement("div", { className: "text-lg font-medium" },
                                projectState.progress,
                                " / ",
                                projectState.scope)),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-gray-500" }, "Velocity"),
                            React.createElement("div", { className: "text-lg font-medium" }, projectState.velocity)),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-gray-500" }, "Quality"),
                            React.createElement("div", { className: "text-lg font-medium" },
                                projectState.quality,
                                "%")),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-gray-500" }, "Team Morale"),
                            React.createElement("div", { className: "text-lg font-medium" },
                                projectState.morale,
                                "%")),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-gray-500" }, "Technical Debt"),
                            React.createElement("div", { className: "text-lg font-medium" }, projectState.technicalDebt)),
                        React.createElement("div", null,
                            React.createElement("div", { className: "text-sm text-gray-500" }, "Team Capability"),
                            React.createElement("div", { className: "text-lg font-medium" },
                                "\u00D7",
                                projectState.teamCapability.toFixed(2))))),
                React.createElement("div", { className: "bg-white p-4 rounded-lg shadow" },
                    React.createElement("h3", { className: "font-bold mb-2" }, "Progress & Scope Over Time"),
                    React.createElement(ResponsiveContainer, { width: "100%", height: 200 },
                        React.createElement(LineChart, { data: history, margin: { top: 5, right: 20, bottom: 5, left: 0 } },
                            React.createElement(XAxis, { dataKey: "week" }),
                            React.createElement(YAxis, null),
                            React.createElement(CartesianGrid, { stroke: "#eee", strokeDasharray: "5 5" }),
                            React.createElement(Tooltip, null),
                            React.createElement(Legend, null),
                            React.createElement(Line, { type: "monotone", dataKey: "progress", stroke: "#3b82f6", name: "Progress" }),
                            React.createElement(Line, { type: "monotone", dataKey: "scope", stroke: "#ef4444", name: "Scope" })))),
                React.createElement("div", { className: "bg-white p-4 rounded-lg shadow" },
                    React.createElement("h3", { className: "font-bold mb-2" }, "Project Dynamics - Toggle Effects"),
                    React.createElement("div", { className: "grid grid-cols-2 gap-y-2 gap-x-4" },
                        React.createElement("label", { className: "flex items-center cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: showEffects.technicalDebt, onChange: () => toggleEffect('technicalDebt'), className: "mr-2" }),
                            React.createElement("span", null, "Technical Debt (Negative Loop)")),
                        React.createElement("label", { className: "flex items-center cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: showEffects.teamLearning, onChange: () => toggleEffect('teamLearning'), className: "mr-2" }),
                            React.createElement("span", null, "Team Learning (Positive Loop)")),
                        React.createElement("label", { className: "flex items-center cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: showEffects.weeklyMeetings, onChange: () => toggleEffect('weeklyMeetings'), className: "mr-2" }),
                            React.createElement("span", null, "Weekly Planning (Cycle)")),
                        React.createElement("label", { className: "flex items-center cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: showEffects.monthlyReviews, onChange: () => toggleEffect('monthlyReviews'), className: "mr-2" }),
                            React.createElement("span", null, "Monthly Reviews (Cycle)")),
                        React.createElement("label", { className: "flex items-center cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: showEffects.userFeedback, onChange: () => toggleEffect('userFeedback'), className: "mr-2" }),
                            React.createElement("span", null, "User Feedback (Mixed Loop)")),
                        React.createElement("label", { className: "flex items-center cursor-pointer" },
                            React.createElement("input", { type: "checkbox", checked: showEffects.unexpectedEvents, onChange: () => toggleEffect('unexpectedEvents'), className: "mr-2" }),
                            React.createElement("span", null, "Unexpected Events (Random)"))))),
            React.createElement("div", { className: "flex flex-col gap-4" },
                React.createElement("div", { className: "bg-white p-4 rounded-lg shadow" },
                    React.createElement("h3", { className: "font-bold mb-2" }, "Team & Quality Metrics"),
                    React.createElement(ResponsiveContainer, { width: "100%", height: 200 },
                        React.createElement(LineChart, { data: history, margin: { top: 5, right: 20, bottom: 5, left: 0 } },
                            React.createElement(XAxis, { dataKey: "week" }),
                            React.createElement(YAxis, null),
                            React.createElement(CartesianGrid, { stroke: "#eee", strokeDasharray: "5 5" }),
                            React.createElement(Tooltip, null),
                            React.createElement(Legend, null),
                            React.createElement(Line, { type: "monotone", dataKey: "quality", stroke: "#10b981", name: "Quality" }),
                            React.createElement(Line, { type: "monotone", dataKey: "morale", stroke: "#8b5cf6", name: "Morale" }),
                            React.createElement(Line, { type: "monotone", dataKey: "technicalDebt", stroke: "#f59e0b", name: "Tech Debt" })))),
                React.createElement("div", { className: "bg-white p-4 rounded-lg shadow" },
                    React.createElement("h3", { className: "font-bold mb-2" }, "Velocity & Team Capability"),
                    React.createElement(ResponsiveContainer, { width: "100%", height: 200 },
                        React.createElement(LineChart, { data: history, margin: { top: 5, right: 20, bottom: 5, left: 0 } },
                            React.createElement(XAxis, { dataKey: "week" }),
                            React.createElement(YAxis, { yAxisId: "left" }),
                            React.createElement(YAxis, { yAxisId: "right", orientation: "right", domain: [0, 2] }),
                            React.createElement(CartesianGrid, { stroke: "#eee", strokeDasharray: "5 5" }),
                            React.createElement(Tooltip, null),
                            React.createElement(Legend, null),
                            React.createElement(Line, { type: "monotone", dataKey: "velocity", stroke: "#ec4899", name: "Velocity", yAxisId: "left" }),
                            React.createElement(Line, { type: "monotone", dataKey: "teamCapability", stroke: "#6366f1", name: "Team Capability", yAxisId: "right" })))),
                React.createElement("div", { className: "bg-white p-4 rounded-lg shadow" },
                    React.createElement("h3", { className: "font-bold mb-2" }, "Project Event Log"),
                    React.createElement("div", { className: "max-h-64 overflow-y-auto" },
                        React.createElement("ul", { className: "space-y-1" }, eventLog.slice().reverse().map((event, idx) => (React.createElement("li", { key: idx, className: "py-1 px-2 rounded flex items-center gap-2" },
                            eventIcons[event.type],
                            React.createElement("span", { className: "text-gray-500 text-sm mr-1" },
                                "Week ",
                                event.week,
                                ":"),
                            React.createElement("span", null, event.event)))))))))));
};
