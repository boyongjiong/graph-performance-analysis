import { useCallback, useEffect, useLayoutEffect, useState,  Profiler } from 'react'
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
import { ShapeType } from './type';

let totalTime = 0

const rfStyle = {
  backgroundColor: '#B8CEFF',
};

// const initialNodes = [
//   {
//     id: '1',
//     data: { label: 'Hello' },
//     position: { x: 0, y: 0 },
//     type: 'input',
//   },
//   {
//     id: '2',
//     data: { label: 'World' },
//     position: { x: 100, y: 100 },
//   },
// ];

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode };

let idCount = 0

// 测试渲染时长
const getBasicNode = (type: ShapeType): any => {
  const randomX = random(0, 1000);
  const randomY = random(0, 600);
  const config: any = {
    id: `${++idCount}`,
    position: {
      x: randomX,
      y: randomY,
    },
    data: {
      label: idCount,
      value: idCount
    },
    type: type === 'default' ? 'default' : 'textUpdater',
  };
  return config;
}

const getBasicEdge = (nodes: any) => {
  const max = nodes.length - 1
  const sourceIndex = random(0, max)
  const targetIndex = random(0, max)

  const source = nodes?.[sourceIndex].id || nodes?.[0].id
  const target = nodes?.[targetIndex].id || nodes?.[0].id
  return {
    type: 'line',
    source,
    target,
    text: `${source}-${target}`,
  }
}

const initNodeList = new Array(1).fill(null).map(() => getBasicNode('default'));
const initEdgeList = new Array(0).fill(null).map(() => getBasicEdge(initNodeList));

export default function Flow() {
  const [nodes, setNodes] = useState(initNodeList);
  const [edges, setEdges] = useState<any>(initEdgeList);

  useEffect(() => {
    // 在触发该事件时，获取当前渲染时间对比
  }, [])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
    [],
  );

  const handleAddNode = (shapeType: ShapeType): void => {
    const config = getBasicNode(shapeType);
    setNodes([...nodes, config])
  }

  const handleBatchAddNode = (count: number, shapeType: ShapeType) => {
    const configList = new Array(count).fill(null).map(() => getBasicNode(shapeType));
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

  const handleAddEdge = () => {
    const config = getBasicEdge(nodes)
    setEdges([...edges, config])
  }

  const handleBatchAddEdge = (count: number) => {
    const configList = new Array(count).fill(null).map(() => getBasicEdge(nodes))
    setEdges([
      ...edges,
      ...configList,
    ])
  }

  const callback = (id: string, phase: string, actualTime: number, baseTime: number, startTime: number, commitTime: number) => {
    console.log(`${id}'s ${phase} phase:`)
    console.log(`Actual time: ${actualTime}`)
    totalTime += actualTime
    console.log(`Total time: ${totalTime}`)
    // console.log(`Base time: ${baseTime}`)
    // console.log(`Start time: ${startTime}`)
    // console.log(`Commit time: ${commitTime}`)
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
              <button type="button" onClick={() => handleAddNode('default')}>增加默认节点</button>
              <button type="button" onClick={() => handleAddNode('html')}>增加 HTML 节点</button>
              <button type="button" onClick={handleAddEdge}>增加边</button>
            </td>
          </tr>
          <tr>
            <td>批量操作(Default)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50, 'default')}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count">节点总数: {nodes.length}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(HTML)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50, 'html')}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count">节点总数: {nodes.length}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(Edge)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddEdge(50)}>增加50条边</button>
              {/* <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50条边</button> */}
              <span className="count">边的总数: {edges.length}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="app-content">
        <Profiler id="reactflow" onRender={callback}>
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
        </Profiler>
      </div>
    </div>
  )
}
