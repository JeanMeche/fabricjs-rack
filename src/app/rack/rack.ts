import { Type } from '@angular/core';
import { fabric } from 'fabric';
import { rackWidth, uHeight, units } from '../constants';
import { Asset } from '../fabric.service';
import { UUnits } from './u-units';

interface Rack extends fabric.Group {
  addAsset(asset: Asset, row: number): void;
}

export const Rack: Type<Rack> = fabric.util.createClass(fabric.Group, {
  initialize: function (this: fabric.Group) {
    // this.rx = 16;
    // this.ry = 16;
    this.width = rackWidth;
    this.height = uHeight * units;
    // this.selectable = false;

    const backgroundRect = new fabric.Rect({
      fill: '#ccc',
      width: this.width,
      height: this.height,
      top: -this.height / 2,
      left: -this.width / 2,
    });

    this.add(backgroundRect);

    this.add(new fabric.Group([new fabric.Rect({}), new fabric.Rect({})]));

    const u = new UUnits(units);
    u.left = uHeight; // - uHeight / 2;
    u.top = 0; // + u.height / 2;
    this.add(u);
  },

  addAsset(asset: Asset, row: number) {
    const y = row * uHeight;
    asset.top = y + asset.height! / 2;
    asset.left = asset.width! / 2;
    this.add(asset);
  },
});
