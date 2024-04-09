import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { random } from 'lodash-es'
import LogicFlow from '@logicflow/core'
import NavLinks from '../../NavLinks'
import sqlNode from './sqlNode'

import '@logicflow/core/dist/style/index.css'
import './sqlNode.css'
import './index.css'

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

const data = {
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
    {
      id: '6',
      type: 'text',
      x: 500,
      y: 250,
      text: '纯文本节点',
    },
    {
      id: '7',
      type: 'html',
      x: 100,
      y: 400,
      text: 'html节点',
    },
  ],
}

let idCount: number = 0

export default function LF() {
  const lfRef = useRef<LogicFlow>()
  const containerRef = useRef<HTMLDivElement>(null)

  const [nodeCount, setNodeCount] = useState<number>(0)
  const [graphData, setGraphData] = useState<any>(data)

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
        console.log('graph rendered done!')
      })

      lf.render(graphData)
      lfRef.current = lf
      console.log(lf.getGraphRawData())
    }
  }, [])

  useEffect(() => {
    lfRef.current?.render(graphData)
    setNodeCount(graphData.nodes.length)
  }, [graphData])

  const getBasicNode = (): any => {
    const randomX = random(0, 1000);
    const randomY = random(0, 600);
    const config: any = {
      id: `${++idCount}`,
      x: randomX,
      y: randomY,
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
      type: 'sql-node',
    };
    return config;
  }

  const handleAddNode = (): void => {
    const config = getBasicNode();
    setGraphData({
      ...graphData,
      nodes: [...graphData.nodes, config],
    })
  }

  const handleBatchAddNode = (count: number) => {
    const configList = new Array(count).fill(null).map(() => getBasicNode());
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
              <span className="count">节点总数: {nodeCount}</span>
            </td>
          </tr>
          <tr>
            <td>批量操作(HTML)</td>
            <td>
              <button type="button" onClick={() => handleBatchAddNode(50)}>增加50个节点</button>
              <button type="button" onClick={() => handleBatchRemoveNode(50)}>减少50个节点</button>
              <span className="count">节点总数: {nodeCount}</span>
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
