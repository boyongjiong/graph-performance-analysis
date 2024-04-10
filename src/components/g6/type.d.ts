export type ShapeType = 'default' | 'html' | 'edge';
export type ShapeName = `custom-${ShapeType}-node`;

export const shapeNameMap = new Map<ShapeType, ShapeNmae>([
  ['component', 'custom-component-node'],
  ['default', 'custom-default-node'],
  ['html', 'custom-html-node'],
]);