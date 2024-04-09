import React from 'react'
import { random } from 'lodash-es'
import { Cell, Graph, Node } from '@antv/x6'
import NavLinks from '../../NavLinks'
import { registerCustomNode } from './registerNode'
import { shapeNameMap, ShapeName, ShapeType } from './type.d'
import './index.css'

const data = {
  nodes: [
    {
      id: 'node1',
      shape: 'rect',
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: 'hello',
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: 'node2',
      shape: 'rect',
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: 'world',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  edges: [
    {
      shape: 'edge',
      source: 'node1',
      target: 'node2',
      label: 'x6',
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    },
  ],
}

export default class Example extends React.Component {
  private container: HTMLDivElement | undefined
  private graph: Graph | undefined
  private idCount = 0;

  nodeCountMap = new Map<ShapeType, number>([
    ['component', 0],
    ['default', 0],
    ['html', 0],
  ]);

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      // 设置画布背景颜色
      background: {
        color: '#F2F7FA',
      },
      panning: true,
      mousewheel: true,
    })

    registerCustomNode()
    this.bindEvents(graph)

    console.time()
    graph.fromJSON(data) // 渲染元素
    // graph.centerContent() // 居中显示
    this.graph = graph
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  private bindEvents = (graph: Graph) => {
    graph?.on('render:done', () => {
      console.timeEnd()
      console.log('render:done')
    })

    graph?.on('view:mounted', () => {
      console.timeEnd()
      console.log('view:mounted')
    })
  }

  private getBasicNode(shape: ShapeName): Node.Metadata {
    const randomX = random(0, 1000);
    const randomY = random(0, 600);
    const config: Node.Metadata = {
      id: `${++this.idCount}`,
      x: randomX,
      y: randomY,
      shape,
      data: {
        ngArguments: {
          value: `${this.idCount}`,
        },
      },
    };
    return config;
  }

  private addNodeCount(shapeType: ShapeType, count: number = 1): void {
    const tempCount = this.nodeCountMap.get(shapeType)!;
    this.nodeCountMap.set(shapeType, tempCount + count);
    this.setState({nodeCountMap: this.nodeCountMap})
  }

  handleAddNode = (shapeType: ShapeType) => {
    const config = this.getBasicNode(shapeNameMap.get(shapeType)!);
    this.graph?.addNode(config);
    this.addNodeCount(shapeType);
  }

  handleUpdateNodeValue = (id: string, text: string): void => {
    if (!id) {
      alert('请输入需要查找的节点id!');
      return;
    } else if (!text) {
      alert('请输入需要替换的新文本!');
      return;
    }
    const node = this.graph?.getCellById(id);
    if (!node) {
      alert('未查询到该节点!');
      return;
    }
    node.setData({
      ngArguments: {
        value: text,
      },
    });
  }

  batchAddNode = (count: number, shapeType: ShapeType): void => {
    const configList = new Array(count).fill(null).map(() => this.getBasicNode(shapeNameMap.get(shapeType)!));
    this.graph?.addNodes(configList);
    this.addNodeCount(shapeType, configList.length);
  }

  batchRemoveNode = (count: number, shapeType: ShapeType) => {
    const cellList = this.graph?.getCells() || [];
    const lastCountCellList: Cell<Cell.Properties>[] = [];
    for (let index = 0; index < cellList.length; index++) {
      const cell = cellList[index];
      if (cell.shape === shapeNameMap.get(shapeType)) {
        lastCountCellList.push(cell);
      }
      if (lastCountCellList.length === count) {
        break;
      }
    }
    this.graph?.removeCells(lastCountCellList);
    this.idCount -= lastCountCellList.length;
    this.addNodeCount(shapeType, -lastCountCellList.length);
  }

  render() {
    return (
      <div className="x6-app">
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
                <button type="button" onClick={() => this.handleAddNode('component')}>增加 Component 节点</button>
                <button type="button" onClick={() => this.handleAddNode('default')}>增加默认节点</button>
                <button type="button" onClick={() => this.handleAddNode('html')}>增加 HTML 节点</button>
              </td>
            </tr >
            <tr>
              <td>更新节点</td>
              <td>
                {/* <input type="text" #id placeholder="查找的节点序号"> */}
                {/* <input type="text" #text placeholder="替换的新内容"> */}
                {/* <button type="button" onClick={() => {handleUpdateNodeValue()}}>更新组件Input值</button> */}
              </td>
            </tr>
            <tr>
              <td>批量操作(Component)</td>
              <td>
                <button type="button" onClick={() => this.batchAddNode(50, 'component')}>增加50个节点</button>
                <button type="button" onClick={() => this.batchRemoveNode(50, 'component')}>减少50个节点</button>
                <span className="count">节点总数: {this.nodeCountMap.get('component')}</span>
              </td >
            </tr >
            <tr>
              <td>批量操作(Default)</td>
              <td>
                <button type="button" onClick={() => this.batchAddNode(50, 'default')}>增加50个节点</button>
                <button type="button" onClick={() => this.batchRemoveNode(50, 'default')}>减少50个节点</button>
                <span className="count">节点总数: {this.nodeCountMap.get('default')}</span>
              </td >
            </tr >
            <tr>
              <td>批量操作(HTML)</td>
              <td>
                <button type="button" onClick={() => this.batchAddNode(50, 'html')}>增加50个节点</button>
                <button type="button" onClick={() => this.batchRemoveNode(50, 'html')}>减少50个节点</button>
                <span className="count">节点总数: {this.nodeCountMap.get('html')}</span>
              </td >
            </tr >
          </tbody>
        </table >
        <div className="app-content" ref={this.refContainer} />
      </div >
    )
  }
}