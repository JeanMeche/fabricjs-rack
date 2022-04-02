import { fabric } from 'fabric';
import { rackInfoHeight, rackWidth } from '../constants';

export const RackInfo = fabric.util.createClass(fabric.Group, {
  initialize(this: fabric.Group, canvas: fabric.Canvas) {
    this.width = rackWidth;
    this.height = rackInfoHeight;

    const backgroundRect = new fabric.Rect({
      width: this.width,
      height: this.height,
      fill: '#424e54',
    });
  },
});
