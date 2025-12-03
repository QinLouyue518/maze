export type CellType = 0 | 1; // 0 is wall, 1 is path

export type Position = {
  row: number;
  col: number;
};

export type MazeGrid = CellType[][];

export type StepAction = 'VISIT' | 'BACKTRACK' | 'FOUND_SOLUTION' | 'START';

export interface AlgorithmStep {
  currentPos: Position | null;
  pathStack: Position[];
  visited: boolean[][];
  action: StepAction;
  description: string;
  foundSolutionPath?: Position[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
