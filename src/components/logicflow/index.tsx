import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { random } from 'lodash-es'
import LogicFlow from '@logicflow/core'
import NavLinks from '../../NavLinks'
import sqlNode from './sqlNode'

import '@logicflow/core/dist/style/index.css'
import './sqlNode.css'
import './index.css'
import { ShapeType } from './type.d'

const config: Partial<any> = {
  isSilentMode: false,
  stopScrollGraph: true,
  stopZoomGraph: true,
  allowRotation: true,
  adjustEdge: true,
  style: {
    rect: {
      rx: 5,
      ry: 5,
      strokeWidth: 2,
    },
    circle: {
      fill: '#f5f5f5',
      stroke: '#666',
    },
    ellipse: {
      fill: '#dae8fc',
      stroke: '#6c8ebf',
    },
    polygon: {
      fill: '#d5e8d4',
      stroke: '#82b366',
    },
    diamond: {
      fill: '#ffe6cc',
      stroke: '#d79b00',
    },
    text: {
      color: '#b85450',
      fontSize: 12,
    },
  },
}

const initGraphData = {
  nodes: [
    {
      id: '1',
      type: 'rect',
      x: 100,
      y: 100,
      text: '矩形',
    },
    {
      id: '2',
      type: 'circle',
      x: 300,
      y: 100,
      text: '圆形',
    },
    {
      id: '3',
      type: 'ellipse',
      x: 500,
      y: 100,
      text: '椭圆',
    },
    {
      id: '4',
      type: 'polygon',
      x: 100,
      y: 250,
      text: '多边形',
    },
    {
      id: '5',
      type: 'diamond',
      x: 300,
      y: 250,
      text: '菱形',
    },
    // {
    //   id: '6',
    //   type: 'text',
    //   x: 500,
    //   y: 250,
    //   text: '纯文本节点',
    // },
    // {
    //   id: '7',
    //   type: 'html',
    //   x: 100,
    //   y: 400,
    //   text: 'html节点',
    // },
  ],
  edges: [],
}

let idCount: number = 5

export default function LF() {
  const lfRef = useRef<LogicFlow>()
  const containerRef = useRef<HTMLDivElement>(null)

  const [nodeCount, setNodeCount] = useState<number>(0)
  const [edgeCount, setEdgeCount] = useState<number>(0)
  const [graphData, setGraphData] = useState<any>(initGraphData)

  useLayoutEffect(() => {
    if (!lfRef.current) {
      const lf = new LogicFlow({
        ...config,
        container: containerRef.current as HTMLElement,
        // container: document.querySelector('#graph') as HTMLElement,
        grid: {
          size: 10,
        },
      })

      lf.register(sqlNode)

      lf.on('graph:rendered', () => {
        // console.timeEnd('logicflow init')
        console.log('graph rendered done!')
      })

      // // Task1: 初始化测试
      // const initNodeList = new Array(100).fill(null).map(() => getBasicNode('default'));
      // const initEdgeList = new Array(50).fill(null).map(() => getBasicEdge(initNodeList));
      // const nextGraphData = {
      //   nodes: initNodeList,
      //   edges: initEdgeList,
      // }
      
      // console.time('logicflow init')
      // lf.render(nextGraphData)

      // setNodeCount(initNodeList.length)
      // setEdgeCount(initEdgeList.length)

      // lf.render(graphData)
      lfRef.current = lf
      console.log(lf.getGraphRawData())
    }
  }, [])

  useEffect(() => {
    lfRef.current?.render(graphData)
    setNodeCount(graphData.nodes.length)
    setEdgeCount(graphData.edges.length)
  }, [graphData])

  // 增加边
  const getBasicNode = (type: ShapeType): any => {
    const randomX = random(0, 1000);
    const randomY = random(0, 600);
    const config: any = {
      id: `${++idCount}`,
      x: randomX,
      y: randomY,
      text: `node-${idCount}`,
      properties: {
        tableName: "Users",
        fields: [
          {
            key: "id",
            type: idCount
          },
          {
            key: "name",
            type: "string"
          },
          {
            key: "age",
            type: "integer"
          }
        ]
      },
      type: type === 'default' ? 'rect' : 'sql-node',
    };
    return config;
  }

  const handleAddNode = (shapeType: ShapeType): void => {
    const config = getBasicNode(shapeType);
    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes, config],
    })
  }

  const handleBatchAddNode = (count: number, shapeType: ShapeType) => {
    const configList = new Array(count).fill(null).map(() => getBasicNode(shapeType));
    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes, ...configList]
    })
  }

  const handleBatchRemoveNode = (count: number) => {
    const nodes = [...graphData.nodes];
    if (nodes.length === 0) {
      return;
    }
    new Array(count).fill(null).forEach(() => nodes.pop());
    idCount -= count;
    if (idCount < 0) {
      idCount = 0;
    }
    setGraphData({
      ...graphData,
      nodes,
    })
  }

  // 增加节点
  const getBasicEdge = (nodes: any): any => {
    const max = nodes.length - 1
    const sourceIndex = random(0, max)
    const targetIndex = random(0, max)

    const sourceNodeId = nodes?.[sourceIndex].id || nodes?.[0].id
    const targetNodeId = nodes?.[targetIndex].id || nodes?.[0].id
    return {
      type: 'line',
      sourceNodeId,
      targetNodeId,
      text: `${sourceNodeId}-${targetNodeId}`,
    }
  }

  const handleAddEdge = (): void => {
    const { nodes } = graphData
    if (!nodes.length) return

    const config = getBasicEdge(nodes);

    setGraphData({
      ...graphData,
      edges: [...graphData.edges, config]
    })
  }

  const handleBatchAddEdge = (count: number): void => {
    const { nodes } = graphData
    if (!nodes.length) return

    const configList = new Array(count).fill(null).map(() => getBasicEdge(nodes));
    setGraphData({
      ...graphData,
      edges: [
        ...graphData.edges,
        ...configList,
      ]
    });
  }

  return (
    <div className="lf-app">
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
              <span className="count">节点总数: {nodeCount}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(HTML)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50, 'html')}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count">节点总数: {nodeCount}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(Edge)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddEdge(50)}>增加50个边</button>
              {/* <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个边</button> */}
              <span className="count">边总数: {edgeCount}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div ref={containerRef} id="graph" className="app-content"></div>
      <button
        onClick={() => {
          console.log(lfRef.current!.getGraphRawData())
        }}
      >
        Get GraphRawData
      </button>
    </div>
  )
}
