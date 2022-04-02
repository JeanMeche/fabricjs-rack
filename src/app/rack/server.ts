import { fabric } from 'fabric';
import { rackWidth, uHeight } from '../constants';
import { Asset } from '../fabric.service';

export interface Server extends Asset {
  type: 'server';
  rackSize: number;
}

export const Server = fabric.util.createClass(fabric.Group, {
  initialize(this: Server, name: string, size: number, canvas: fabric.Canvas) {
    this.baseSize = { width: rackWidth, height: uHeight * size };
    this.rackSize = size;
    this.width = this.baseSize.width;
    this.height = this.baseSize.height;

    const backgroundRect = new fabric.Rect({
      width: this.baseSize.width,
      height: this.baseSize.height,
      fill: '#424e54',
      //   rx: 8,
      left: -this.baseSize.width / 2,
      top: -this.baseSize.height / 2,
    });

    const rect2 = new fabric.Rect({
      width: this.width,
      height: uHeight,
      fill: '#4da3d4',
    });

    const clip = new fabric.Polygon([
      { x: -200, y: -uHeight / 2 },
      { x: -20, y: -uHeight / 2 },
      { x: -100, y: uHeight / 2 },
      { x: -200, y: uHeight / 2 },
    ]);

    var text = new fabric.Text(name, {
      fontSize: 24,
      left: 8,
      originY: 'center',
      top: rect2.height! / 2,
      fontFamily: 'arial',
    });

    var titleGroup = new fabric.Group([rect2, text], {
      left: -this.width / 2,
      top: (-uHeight * size) / 2,
      clipPath: clip,
    });

    this.hasControls = false;
    this.hasBorders = false;
    this.add(backgroundRect, titleGroup);
    this.width = this.width;
    this.height = this.height;
    this.originX = 'center';
    this.originY = 'center';

    this.on('selected', (e) => {
      e.target?.animate(
        { scaleX: 1.2, scaleY: 1.2 },
        { from: 1, onChange: canvas.renderAll.bind(canvas), duration: 300 }
      );
    });

    this.on('deselected', (e) => {
      e.target?.animate(
        { scaleX: 1, scaleY: 1 },
        { from: 1.2, onChange: canvas.renderAll.bind(canvas), duration: 300 }
      );
    });
  },
});
