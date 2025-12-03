import React, { useState } from 'react';
import { BookOpen, Lightbulb, Code2 } from 'lucide-react';

const TABS = ['任务描述', '思路分析', '核心代码 (C)'];

const ConceptCard = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const renderContent = () => {
    switch (activeTab) {
      case '任务描述':
        return (
          <div className="text-slate-700 space-y-4 text-sm leading-relaxed">
            <h4 className="font-bold text-base text-slate-800">实验任务：迷宫求解</h4>
            <p>
              本关任务是编程找出一个迷宫从入口（左上角）到出口（右下角）的所有路径。
              迷宫由一个二维数组表示，其中 <code>1</code> 代表通路，<code>0</code> 代表障碍物（墙壁）。
              只能从一个位置走到与它相邻（上、下、左、右）的通路格子上，且在同一条路径中不能重复走同一个格子。
            </p>
            <h5 className="font-bold text-slate-800">输入示例</h5>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">
{`6 10
1 0 0 0 0 0 0 0 0 0
1 0 1 1 0 1 1 1 1 0
1 1 1 0 0 1 1 0 1 0
1 0 0 1 1 1 0 0 1 0
1 1 1 1 0 1 1 1 1 0
0 0 0 0 0 0 0 0 1 1`}
            </pre>
            <h5 className="font-bold text-slate-800">输出</h5>
            <p>程序应按顺序输出所有找到的路径，每条路径都以一个二维矩阵的形式展示。</p>
          </div>
        );
      case '思路分析':
        return (
            <div className="text-slate-700 space-y-4 text-sm leading-relaxed">
                <h4 className="font-bold text-base text-slate-800">如何像计算机一样思考？</h4>
                <p>面对“所有可能性”的问题，我们的核心策略是 <strong>穷举</strong>。但如何优雅地穷举呢？</p>
                
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <h5 className="font-bold text-slate-800">第一步：选择一种搜索策略</h5>
                  <p>想象你在一个真实的迷宫里，你会在每个路口做出选择。计算机也是如此。最常见的策略就是 <strong>深度优先搜索 (DFS)</strong>。</p>
                  <p className="mt-2 text-xs italic text-slate-500"><strong>生活中的类比：</strong> 这就像走迷宫时，你决定“一条路走到黑”。只要有路，就一直往前走，直到碰到墙（死胡同）或者到达终点。</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <h5 className="font-bold text-slate-800">第二步：避免“鬼打墙”</h5>
                  <p>迷宫里可能会有环路，为了不无限循环地兜圈子，我们需要记住哪些地方已经走过了。怎么办？</p>
                  <p className="mt-2 text-xs italic text-slate-500"><strong>解决方案：</strong> 使用一个与迷宫同样大小的二维数组 <code>visited</code>，作为“足迹”记录。每当我们到达一个格子 <code>(x, y)</code>，就标记 <code>visited[x][y] = 1</code>。在尝试移动前，先检查目标格子是否已被访问。</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
                  <h5 className="font-bold text-slate-800">第三步：关键的“回溯”</h5>
                  <p>这是整个算法的精髓！如果一条路走到了死胡同，或者我们已经找到一条路径并想继续寻找其他路径时，该怎么办？</p>
                  <p className="mt-2 text-xs italic text-slate-500"><strong>生活中的类比：</strong> 当你发现此路不通，你会原路返回到上一个路口，然后尝试另一条没走过的路。<br/><strong>代码实现：</strong> 这个“原路返回”的动作就叫 <strong>回溯 (Backtracking)</strong>。当我们从一个点 <code>(x, y)</code> 探索完所有可能性返回时，必须把留下的“足迹”擦掉，即 <code>visited[x][y] = 0</code>。这样，其他的路径探索才有可能再次经过这个点。</p>
                </div>
            </div>
        );
      case '核心代码 (C)':
        return (
            <div className="text-slate-700 space-y-4 text-sm leading-relaxed">
                <h4 className="font-bold text-base text-slate-800">C 语言实现要点</h4>
                <p>我们不会给出完整代码，但以下是实现 DFS + 回溯算法的关键代码片段，理解它们你就能自己写出来了。</p>
                
                <div>
                  <h5 className="font-bold text-slate-800">1. 方向数组</h5>
                  <p>用数组来简化对上、下、左、右四个方向的遍历，这是个常用技巧。</p>
                  <pre className="bg-slate-900 text-slate-200 p-3 mt-2 rounded font-mono text-xs overflow-x-auto">
{`// dx和dy[i]组合起来，就代表一个方向
int dx[] = {0, 0, 1, -1}; // 控制行变化: 不变, 不变, 下, 上
int dy[] = {1, -1, 0, 0}; // 控制列变化: 右, 左, 不变, 不变`}
                  </pre>
                </div>

                <div>
                  <h5 className="font-bold text-slate-800">2. DFS 函数骨架</h5>
                  <p>递归是 DFS 的灵魂。这个函数的核心逻辑是“前进-递归-回溯”。</p>
                  <pre className="bg-slate-900 text-slate-200 p-3 mt-2 rounded font-mono text-xs overflow-x-auto">
{`void dfs(int x, int y) {
    // 假设 path 是一个栈或数组，用来记录当前路径
    path.push({x, y}); // 记录当前节点
    visited[x][y] = 1; // 标记已访问

    if (x == endX && y == endY) {
        print_path(); // 找到一条路径，打印
    } else {
        // 尝试四个方向
        for (int i = 0; i < 4; i++) {
            int nextX = x + dx[i];
            int nextY = y + dy[i];

            // 如果下一步合法 (在边界内、不是墙、没访问过)
            if (is_valid(nextX, nextY)) {
                dfs(nextX, nextY); // 向下递归
            }
        }
    }

    // !! 关键：回溯 !!
    // 当从(x,y)出发的所有路径都探索完毕后，
    // 将其移出当前路径，并取消访问标记。
    path.pop();
    visited[x][y] = 0;
}`}
                  </pre>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
      <div className="border-b border-slate-200 px-2">
        <nav className="flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-2 py-3 px-3 text-sm font-medium rounded-t-md transition-colors
                ${activeTab === tab 
                  ? 'bg-slate-100 text-indigo-600' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
              `}
            >
              {tab === '任务描述' && <BookOpen className="w-4 h-4" />}
              {tab === '思路分析' && <Lightbulb className="w-4 h-4" />}
              {tab === '核心代码 (C)' && <Code2 className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-5 flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
};

export default ConceptCard;