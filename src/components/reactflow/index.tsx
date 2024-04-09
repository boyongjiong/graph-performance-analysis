import { useCallback, useLayoutEffect, useState } from 'react'
import { random } from 'lodash-es'
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow'
import NavLinks from '../../NavLinks'
import TextUpdaterNode from './TextUpdaterNode.js';

import 'reactflow/dist/style.css'
import './text-updater-node.css';
import './index.css'


const rfStyle = {
  backgroundColor: '#B8CEFF',
};

const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'World' },
    position: { x: 100, y: 100 },
  },
];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

let idCount = 0

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  useLayoutEffect(() => {
    // 在触发该事件时，获取当前渲染时间对比
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds) as any),
    [],
  );

  const getBasicNode = (): any => {
    const randomX = random(0, 1000);
    const randomY = random(0, 600);
    const config: any = {
      id: `${++idCount}`,
      position: {
        x: randomX,
        y: randomY,
      },
      data: {
        value: idCount
      },
      type: 'textUpdater',
    };
    return config;
  }

  const handleAddNode = (): void => {
    const config = getBasicNode();
    setNodes([...nodes, config])
  }

  const handleBatchAddNode = (count: number) => {
    const configList = new Array(count).fill(null).map(() => getBasicNode());
    setNodes([...nodes, ...configList])
  }

  const handleBatchRemoveNode = (count: number) => {
    const nextNodes = [...nodes];
    if (nodes.length === 0) {
      return;
    }
    new Array(count).fill(null).forEach(() => nextNodes.pop());
    idCount -= count;
    if (idCount < 0) {
      idCount = 0;
    }
    setNodes(nextNodes)
  }

  return (
    <div className="rf-app">
      <NavLinks />
      <table>
        <thead>
          <tr>
            <th>介绍</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>增加节点</td>
            <td>
              <button type="button" onClick={handleAddNode}>增加默认节点</button>
              <button type="button" onClick={handleAddNode}>增加 HTML 节点</button>
              <button type="button" onClick={handleAddNode}>增加边</button>
            </td>
          </tr>
          <tr>
            <td>批量操作(Default)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50)}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count">节点总数: {nodes.length}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(HTML)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50)}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count">节点总数: {nodes.length}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(Edge)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50)}>增加50条边</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50条边</button>
              <span className="count">边的总数: {edges.length}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="app-content">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          style={rfStyle}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  )
}
