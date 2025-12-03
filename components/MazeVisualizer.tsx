import React, { useMemo } from 'react';
import { MazeGrid, AlgorithmStep, Position } from '../types.ts';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, MapPin, AlertTriangle } from 'lucide-react';

interface MazeVisualizerProps {
  grid: MazeGrid;
  stepIndex: number;
  steps: AlgorithmStep[];
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSetStep: (step: number) => void;
}

const MazeVisualizer: React.FC<MazeVisualizerProps> = ({
  grid,
  stepIndex,
  steps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBack,
  onReset,
  onSetStep
}) => {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden items-center justify-center text-center p-4">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h3 className="font-bold text-lg text-slate-700">迷宫数据无效</h3>
        <p className="text-sm text-slate-500 mt-1">请在左侧配置一个有效的迷宫，然后点击“应用并求解”来开始。</p>
      </div>
    );
  }

  const currentStep = steps[stepIndex] || {
    currentPos: null,
    pathStack: [],
    visited: [],
    action: 'START',
    description: '准备开始...'
  };

  // Helper to check if a cell is in the current path stack
  const isInStack = (r: number, c: number) => {
    return currentStep.pathStack.some(p => p.row === r && p.col === c);
  };

  // Helper to check if a cell is part of a found solution (if just found)
  const isSolutionCell = (r: number, c: number) => {
      if (currentStep.action !== 'FOUND_SOLUTION' || !currentStep.foundSolutionPath) return false;
      return currentStep.foundSolutionPath.some(p => p.row === r && p.col === c);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header / Controls */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            算法可视化
        </h2>
        
        <div className="flex items-center gap-2">
            <button onClick={onStepBack} disabled={stepIndex <= 0} className="p-2 hover:bg-slate-200 rounded disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={onPlayPause} className={`flex items-center gap-1 px-4 py-2 rounded-md text-white font-medium transition ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isPlaying ? <><Pause className="w-4 h-4" /> 暂停</> : <><Play className="w-4 h-4" /> 播放</>}
            </button>
            <button onClick={onStepForward} disabled={stepIndex >= steps.length - 1} className="p-2 hover:bg-slate-200 rounded disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={onReset} className="p-2 hover:bg-slate-200 rounded text-slate-600">
                <RotateCcw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-4 py-2 bg-slate-100 text-sm flex justify-between items-center border-b border-slate-200">
         <span className="font-mono text-slate-600">
             步骤: {stepIndex} / {Math.max(0, steps.length - 1)}
         </span>
         <span className={`font-medium ${currentStep.action === 'BACKTRACK' ? 'text-amber-600' : currentStep.action === 'FOUND_SOLUTION' ? 'text-green-600' : 'text-blue-600'}`}>
             {currentStep.description}
         </span>
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-50 relative">
        <div 
            className="grid gap-1 p-2 bg-slate-300 rounded shadow-inner"
            style={{
                gridTemplateColumns: `repeat(${grid[0].length}, minmax(30px, 40px))`
            }}
        >
            {grid.map((row, r) => (
                row.map((cell, c) => {
                    const isWall = cell === 0;
                    const isCurrent = currentStep.currentPos?.row === r && currentStep.currentPos?.col === c;
                    const inPath = isInStack(r, c);
                    const isSolution = isSolutionCell(r, c);

                    let bgClass = "bg-path"; // Default path color (light)
                    if (isWall) bgClass = "bg-wall"; // Wall color (dark)
                    else if (isSolution) bgClass = "bg-solution ring-2 ring-green-300"; // Solution found
                    else if (isCurrent) bgClass = "bg-active ring-2 ring-blue-300 scale-105 z-10"; // Current head
                    else if (inPath) bgClass = "bg-visited"; // Currently in stack

                    return (
                        <div 
                            key={`${r}-${c}`}
                            className={`
                                aspect-square rounded-md flex items-center justify-center text-xs font-mono transition-all duration-200
                                ${bgClass}
                                ${isWall ? 'shadow-inner' : 'shadow-sm'}
                            `}
                        >
                            {/* Optional: Show coordinates for debugging or learning */}
                            <span className={`${isWall ? 'text-slate-600' : 'text-slate-400'} opacity-30 scale-75`}>
                                {isCurrent ? 'Here' : ''}
                            </span>
                        </div>
                    );
                })
            ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="p-3 bg-white text-xs flex gap-4 justify-center border-t border-slate-200">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-path border border-slate-300"></div> 可通行</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-wall"></div> 墙壁</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-active"></div> 当前位置</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-visited"></div> 当前路径栈</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-solution"></div> 成功路径</div>
      </div>
    </div>
  );
};

export default MazeVisualizer;