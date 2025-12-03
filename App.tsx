import React, { useState, useEffect, useRef } from 'react';
import MazeVisualizer from './components/MazeVisualizer.tsx';
import MazeEditor from './components/MazeEditor.tsx';
import AiTutor from './components/AiTutor.tsx';
import ConceptCard from './components/ConceptCard.tsx';
import { generateMazeSteps, DEFAULT_MAZE } from './utils/mazeLogic.ts';
import { MazeGrid, AlgorithmStep } from './types.ts';
import { Compass, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [grid, setGrid] = useState<MazeGrid>(DEFAULT_MAZE);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load steps when grid changes
  useEffect(() => {
    const newSteps = generateMazeSteps(grid);
    setSteps(newSteps);
    setStepIndex(0);
    setIsPlaying(false);
  }, [grid]);

  // Animation Loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 300); // 300ms per step
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps.length]);

  // Handlers
  const handleGridUpdate = (newGrid: MazeGrid) => {
    setGrid(newGrid);
  };

  const handleStepForward = () => {
    setStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBack = () => {
    setStepIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">MazeMaster</h1>
                <p className="text-xs text-slate-500">C语言迷宫算法可视化教学</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-600 font-medium">
             <span className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer">
                <GraduationCap className="w-4 h-4" /> 教学模式
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editor & Tutor (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
            <MazeEditor initialGrid={grid} onUpdate={handleGridUpdate} />
            <AiTutor />
        </div>

        {/* Right Column: Visualization & Concepts (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
            <div className="h-[60vh] min-h-[500px]">
                <MazeVisualizer 
                    grid={grid}
                    stepIndex={stepIndex}
                    steps={steps}
                    isPlaying={isPlaying}
                    onPlayPause={() => setIsPlaying(!isPlaying)}
                    onStepForward={handleStepForward}
                    onStepBack={handleStepBack}
                    onReset={() => { setIsPlaying(false); setStepIndex(0); }}
                    onSetStep={setStepIndex}
                />
            </div>
            <ConceptCard />
        </div>

      </main>
    </div>
  );
};

export default App;