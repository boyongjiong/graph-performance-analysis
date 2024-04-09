import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { random } from 'lodash-es'
import G6, { Graph, GraphData, NodeConfig, TreeGraphData } from '@antv/g6'
import NavLinks from '../../NavLinks'
import './index.css'
let idCount = 0

export default function G6Comp() {
  const graphRef = useRef<Graph>()
  const refContainer = useRef<HTMLDivElement>(null)
  const [nodeCount, setNodeCount] = useState<number>(0)
  const [graphData, setGraphData] = useState<GraphData | TreeGraphData>({
    nodes: []
  })

  const bindEvents = () => {
    graphRef.current?.on('afterrender', () => {
      const nodes = graphRef.current?.getNodes()
      console.log('render done!', nodes)
    })

    graphRef.current?.on('afterlayout', () => {
      const nodes = graphRef.current?.getNodes()
      console.log('layout done!', nodes)
    })
  }

  useLayoutEffect(() => {
    if (!graphRef.current) {
      // 定义数据源
      const data = {
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
      // // 读取数据
      // graph.data(data);
      // // 渲染图
      // graph.render();
      graphRef.current = graph
      bindEvents()
    }
  }, []);

  useEffect(() => {
    render(graphData)
    setNodeCount((graphData.nodes as NodeConfig[])?.length || 0)
  }, [graphData])

  const getBasicNode = (): NodeConfig => {
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
      type: 'rect-jsx',
    };
    return config;
  }

  const render = (renderData: GraphData | TreeGraphData): void => {
    console.log('renderData', renderData)
    // setNodeCount((data.nodes as NodeConfig[]).length)
    graphRef.current?.data(renderData)
    graphRef.current?.render()
  }

  const handleAddNode = (): void => {
    const config = getBasicNode();
    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes as NodeConfig[], config]
    })

    // (data.nodes as NodeConfig[]).push(config)
    // render()
  }

  const handleBatchAddNode = (count: number) => {
    const configList = new Array(count).fill(null).map(() => getBasicNode());
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
              <button type="button" onClick={handleAddNode}>增加默认节点</button>
              <button type="button" onClick={handleAddNode}>增加 HTML 节点</button>
            </td>
          </tr>
          <tr>
            <td>批量操作(Default)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50)}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count"> 默认节点总数: {nodeCount}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(HTML)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50)}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count"> HTML节点总数: {nodeCount}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="app-content" ref={refContainer} />
    </div>
  )
}
