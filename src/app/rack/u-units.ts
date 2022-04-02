import { fabric } from 'fabric';
import { uHeight } from '../constants';

export const UUnits = fabric.util.createClass(fabric.Group, {
  initialize(this: fabric.Group, count: number) {
    const us = Array.from({ length: count }).map((_, i) => {
      const rect = new fabric.Rect({
        width: uHeight,
        height: uHeight,
        fill: '#cccccc', // (this as any).getRandomColor(), // ,
        originY: 'center',
        originX: 'center',
      });
      const label = new fabric.Text(`${i + 1}`, {
        fontSize: 18,
        originY: 'center',
        originX: 'center',
        fontFamily: 'arial',
      });
      return new fabric.Group([rect, label], {
        left: -uHeight / 2,
        top: uHeight * i - (uHeight * count) / 2,
        height: uHeight,
        width: uHeight,
      });
    });

    // this.hasControls = false;
    // this.hasBorders = false;
    this.add(...us);
    this.width = uHeight;
    this.height = uHeight * count;
  },

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
});
