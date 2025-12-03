import { MazeGrid, Position, AlgorithmStep } from "../types.ts";

const DIRECTIONS = [
  { row: -1, col: 0, name: '上' }, // Up
  { row: 1, col: 0, name: '下' },  // Down
  { row: 0, col: -1, name: '左' }, // Left
  { row: 0, col: 1, name: '右' },  // Right
];

export const generateMazeSteps = (grid: MazeGrid): AlgorithmStep[] => {
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return [{
      currentPos: null,
      pathStack: [],
      visited: [],
      action: 'START',
      description: '迷宫配置无效，无法开始。'
    }];
  }

  const steps: AlgorithmStep[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array(rows).fill(0).map(() => Array(cols).fill(false));
  const pathStack: Position[] = [];

  const startPos = { row: 0, col: 0 };
  const endPos = { row: rows - 1, col: cols - 1 };

  // Helper to clone visited array for immutable history
  const cloneVisited = () => visited.map(r => [...r]);

  const isValid = (r: number, c: number) => {
    return r >= 0 && r < rows && c >= 0 && c < cols && grid[r][c] === 1 && !visited[r][c];
  };

  const dfs = (r: number, c: number) => {
    // 1. Mark current node
    visited[r][c] = true;
    pathStack.push({ row: r, col: c });

    steps.push({
      currentPos: { row: r, col: c },
      pathStack: [...pathStack],
      visited: cloneVisited(),
      action: 'VISIT',
      description: `访问坐标 (${r}, ${c})`
    });

    // 2. Check if reached destination
    if (r === endPos.row && c === endPos.col) {
      steps.push({
        currentPos: { row: r, col: c },
        pathStack: [...pathStack],
        visited: cloneVisited(),
        action: 'FOUND_SOLUTION',
        description: `找到一条路径!`,
        foundSolutionPath: [...pathStack]
      });
    } else {
      // 3. Explore neighbors
      for (const dir of DIRECTIONS) {
        const nextR = r + dir.row;
        const nextC = c + dir.col;

        if (isValid(nextR, nextC)) {
            // Visualize checking direction
            steps.push({
                currentPos: { row: r, col: c },
                pathStack: [...pathStack],
                visited: cloneVisited(),
                action: 'VISIT',
                description: `尝试向${dir.name}移动: (${nextR}, ${nextC})`
            });
            dfs(nextR, nextC);
        }
      }
    }

    // 4. Backtrack
    visited[r][c] = false; // Important: Unmark to allow other paths to use this node
    pathStack.pop();
    
    steps.push({
      currentPos: pathStack.length > 0 ? pathStack[pathStack.length - 1] : null,
      pathStack: [...pathStack],
      visited: cloneVisited(),
      action: 'BACKTRACK',
      description: `回溯: 离开 (${r}, ${c}), 撤销标记`
    });
  };

  if (grid[0][0] === 1) {
    dfs(0, 0);
  } else {
      steps.push({
          currentPos: null,
          pathStack: [],
          visited: cloneVisited(),
          action: 'START',
          description: '入口 (0,0) 是障碍物，无法开始。'
      })
  }

  return steps;
};

// Default maze from the screenshot
export const DEFAULT_MAZE: MazeGrid = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 1, 0, 1, 1, 1, 1, 0],
    [1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
    [1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
    [1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
];