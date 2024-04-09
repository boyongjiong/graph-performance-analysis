import { Graph, Shape } from '@antv/x6';
import { register } from '@antv/x6-react-shape';
import { Circle } from 'rc-progress';
import { shapeNameMap } from './type.d';

const NodeComponent = () => {
  return (
    <div className="react-node">
      <Circle percent={66} strokeWidth={8} strokeColor="red" />
    </div>
  )
}

export function registerCustomNode() {
  Graph.registerNode(
    'custom-default-node',
    {
      inherit: 'rect', // 继承于 rect 节点
      width: 100,
      height: 40,
      markup: [
        {
          tagName: 'rect', // 标签名称
          selector: 'body', // 选择器
        },
        {
          tagName: 'image',
          selector: 'img',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
        img: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
          width: 16,
          height: 16,
          x: 12,
          y: 12,
        },
      },
    },
    true,
  )

  register({
    shape: shapeNameMap.get('component')!,
    width: 100,
    height: 100,
    component: NodeComponent,
  })

  Shape.HTML.register({
    shape: shapeNameMap.get('html')!,
    width: 120,
    height: 20,
    effect: ['data'],
    html(cell) {
      const { ngArguments } = cell.getData();
      const section = document.createElement('section');
      section.style.display = 'flex';
      section.style.justifyContent = 'center';
      section.style.alignItems = 'center';
      section.style.border = '2px solid #000';
      section.style.width = '100%';
      section.style.height = '100%';
      section.innerHTML = `
          HTML: <span style="color: gray;">${ngArguments.value}</span>
        `;
      return section;
    },
  });
}