import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { random } from 'lodash-es'
import G6, { Graph, GraphData, NodeConfig, EdgeConfig, TreeGraphData } from '@antv/g6'
import NavLinks from '../../NavLinks'
import './index.css'
import { ShapeType } from './type'
let idCount = 0

// 定义数据源
const initGraphData = {
  // 点集
  nodes: [
    {
      id: 'node1',
      x: 100,
      y: 200,
    },
    {
      id: 'node2',
      x: 300,
      y: 200,
    },
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    {
      source: 'node1',
      target: 'node2',
    },
  ],
};

export default function G6Comp() {
  const graphRef = useRef<Graph>()
  const refContainer = useRef<HTMLDivElement>(null)
  const [nodeCount, setNodeCount] = useState<number>(0)
  const [edgeCount, setEdgeCount] = useState<number>(0)
  const [graphData, setGraphData] = useState<GraphData | TreeGraphData>(initGraphData)

  const bindEvents = () => {
    graphRef.current?.on('afterrender', () => {
      // console.timeEnd('g6 init')
      const nodes = graphRef.current?.getNodes()
      console.log('render done!', nodes)
    })

    graphRef.current?.on('afterlayout', () => {
      // const nodes = graphRef.current?.getNodes()
      console.log('layout done!')
    })
  }

  useLayoutEffect(() => {
    if (!graphRef.current) {
      // 创建 G6 图实例
      const graph = new G6.Graph({
        container: refContainer.current as HTMLDivElement,
        width: 1000,
        height: 600,
        renderer: 'svg',
        modes: {
          default: ['drag-canvas', 'drag-node'],
        },
        defaultNode: {
          type: 'circle',
          size: [60],
          labelCfg: {
            position: 'bottom',
          },
        },
      });
      G6.registerNode(
        'rect-jsx',
        cfg => `
            <group>
              <rect>
                <rect style={{
                  width: 120,
                  height: 20,
                  fill: ${cfg.color},
                  radius: [6, 6, 0, 0],
                  cursor: 'move'，
                  stroke: ${cfg.color}
                }} draggable="true">
                  <text style={{
                    marginTop: 2,
                    marginLeft: 58,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fill: '#fff' }}>{{label}}</text>
                </rect>
                <rect style={{
                  width: 120,
                  height: 20,
                  stroke: ${cfg.color},
                  fill: #ffffff,
                  radius: [0, 0, 6, 6],
                }}>
                  <text style={{ marginTop: 5, fill: '#333', marginLeft: 38 }}>性能测试</text>
                </rect>
              </rect>
            </group>`,
      )

      graphRef.current = graph
      bindEvents()
    }
  }, []);

  useEffect(() => {
    // Task1: 初始化测试
    // const initNodeList = new Array(10000).fill(null).map(() => getBasicNode('default'));
    // const initEdgeList = new Array(0).fill(null).map(() => getBasicEdge(initNodeList));
    // const nextGraphData = {
    //   nodes: initNodeList,
    //   edges: initEdgeList,
    // }

    // console.time('g6 init')
    // render(nextGraphData)

    // setNodeCount(initNodeList.length)
    // setEdgeCount(initEdgeList.length)

    render(graphData)
    setNodeCount((graphData.nodes as NodeConfig[])?.length || 0)
    setEdgeCount((graphData.edges as NodeConfig[])?.length || 0)
  }, [graphData])

  const getBasicNode = (type: ShapeType): NodeConfig => {
    const randomX = random(0, 1000);
    const randomY = random(0, 600);
    const config: NodeConfig = {
      id: `${++idCount}`,
      label: `${idCount}`,
      x: randomX,
      y: randomY,
      description: 'ant_type_name_...',
      color: '#2196f3',
      meta: {
        creatorName: 'a_creator',
      },
      type: type === 'default' ? 'rect' : 'rect-jsx',
    };
    return config;
  }

  const render = (renderData: GraphData | TreeGraphData): void => {
    graphRef.current?.data(renderData)
    graphRef.current?.render()
  }

  // 增加节点相关功能
  const handleAddNode = (shapeType: ShapeType): void => {
    const config = getBasicNode(shapeType);
    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes as NodeConfig[], config]
    })
  }

  const handleBatchAddNode = (count: number, shapeType: ShapeType) => {
    const configList = new Array(count).fill(null).map(() => getBasicNode(shapeType));
    setGraphData({
      ...graphData,
      nodes: [
        ...graphData.nodes as NodeConfig[],
        ...configList,
      ]
    });
  }

  const handleBatchRemoveNode = (count: number) => {
    const nodes = [...graphData.nodes as NodeConfig[]];
    if (nodes.length === 0) {
      return;
    }
    new Array(count).fill(null).forEach(() => (nodes as NodeConfig[]).pop());

    idCount -= count;
    if (idCount < 0) {
      idCount = 0;
    }
    setGraphData({
      ...graphData,
      nodes,
    })
  }


  // 增加边相关功能
  const getBasicEdge = (nodes: NodeConfig[]): EdgeConfig => {
    const max = nodes.length - 1
    const sourceIndex = random(0, max)
    const targetIndex = random(0, max)

    const source = nodes?.[sourceIndex].id || nodes?.[0].id
    const target = nodes?.[targetIndex].id || nodes?.[0].id
    return {
      source,
      target,
    }
  }

  const handleAddEdge = (): void => {
    const { nodes } = graphData
    if (!(nodes as NodeConfig[]).length) return

    const config = getBasicEdge(nodes as NodeConfig[]);
    setGraphData({
      ...graphData,
      edges: [...(graphData.edges as EdgeConfig[]), config]
    })
  }

  const handleBatchAddEdge = (count: number): void => {
    const { nodes } = graphData
    if (!(nodes as NodeConfig[]).length) return

    const configList = new Array(count).fill(null).map(() => getBasicEdge(nodes as NodeConfig[]));
    setGraphData({
      ...graphData,
      edges: [
        ...graphData.edges as EdgeConfig[],
        ...configList,
      ]
    });
  }

  return (
    <div className='g6-app'>
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
              <span className="count"> 默认节点总数: {nodeCount}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(HTML)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50, 'html')}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count"> HTML节点总数: {nodeCount}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(边)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddEdge(50)}>增加50条边</button>
              {/* <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50条边</button> */}
              <span className="count"> 边总数: {edgeCount}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="app-content" ref={refContainer} />
    </div>
  )
}
