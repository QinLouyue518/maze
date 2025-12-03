import React, { useState } from 'react';
import { MazeGrid, CellType } from '../types.ts';
import { Edit3, Check, RotateCcw } from 'lucide-react';

interface MazeEditorProps {
  initialGrid: MazeGrid;
  onUpdate: (newGrid: MazeGrid) => void;
}

const MazeEditor: React.FC<MazeEditorProps> = ({ initialGrid, onUpdate }) => {
  const [grid, setGrid] = useState<MazeGrid>(initialGrid);
  const [rows, setRows] = useState(initialGrid.length);
  const [cols, setCols] = useState(initialGrid[0].length);
  
  const handleCellClick = (r: number, c: number) => {
    const newGrid = grid.map((row, rowIndex) => 
      rowIndex === r ? row.map((cell, colIndex) => colIndex === c ? (cell === 1 ? 0 : 1) : cell) : row
    );
    setGrid(newGrid);
  };

  const handleResize = () => {
    // Create new grid preserving old data where possible
    const newGrid = Array(rows).fill(0).map((_, r) => 
        Array(cols).fill(0).map((_, c) => {
            if (r < grid.length && c < grid[0].length) {
                return grid[r][c];
            }
            return 1; // Default to path for new cells
        })
    );
    setGrid(newGrid);
  };

  const handleApply = () => {
    onUpdate(grid);
  };

  const handleReset = () => {
      // Hard reset to the problem default
      const defaultGrid: MazeGrid = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
        [1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
        [1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
    ];
    setGrid(defaultGrid);
    setRows(6);
    setCols(10);
    onUpdate(defaultGrid);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Edit3 className="w-5 h-5 text-indigo-600" />
        迷宫配置 (Input)
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Rows (行)</label>
            <input 
                type="number" 
                min="2" max="15" 
                value={rows} 
                onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        </div>
        <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Cols (列)</label>
            <input 
                type="number" 
                min="2" max="15" 
                value={cols} 
                onChange={(e) => setCols(parseInt(e.target.value) || 2)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button 
            onClick={handleResize}
            className="flex-1 bg-slate-100 text-slate-700 py-1 px-3 rounded text-sm hover:bg-slate-200 transition"
        >
            调整尺寸
        </button>
        <button 
            onClick={handleReset}
            className="bg-slate-100 text-slate-700 py-1 px-3 rounded text-sm hover:bg-slate-200 transition"
        >
            <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-2">点击下方格子切换 0 (墙) / 1 (路)</p>
      
      <div className="overflow-auto max-h-[300px] border border-slate-200 rounded p-2 bg-slate-50 flex justify-center">
        <div 
            className="grid gap-1"
            style={{
                gridTemplateColumns: `repeat(${grid[0].length}, 24px)`
            }}
        >
            {grid.map((row, r) => (
                row.map((cell, c) => (
                    <button 
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className={`
                            w-6 h-6 rounded-sm text-[10px] font-bold transition
                            ${cell === 0 ? 'bg-slate-800 text-slate-500' : 'bg-white border border-slate-300 text-slate-800 hover:bg-indigo-50'}
                        `}
                    >
                        {cell}
                    </button>
                ))
            ))}
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4" />
        应用并求解
      </button>
    </div>
  );
};

export default MazeEditor;