import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { rackWidth, rackX, rackY, uHeight } from './constants';
import { Server } from './rack/server';

export type Asset = fabric.Group & { __brand: 'asset' } & {
  baseSize: { height: number; width: number };
  type: string;
  rackSize: number;
};

const rack = new (fabric.util.createClass(fabric.Rect, {
  initialize: function (this: fabric.Rect) {
    this.rx = 16;
    this.ry = 16;
    this.width = rackWidth;
    this.height = 800;
    this.fill = '#ccc';
    this.selectable = false;
  },
}))() as fabric.Rect;

@Injectable({ providedIn: 'root' })
export class FabricService {
  private canvas!: fabric.Canvas;
  private width!: number;
  private height!: number;
  private readonly grid = 50;

  setCanvas(canvas: fabric.Canvas, width: number, height: number) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.init();
  }

  init() {
    this.setupSnap();

    rack.top = rackY;
    rack.left = rackX;
    this.canvas.add(rack);

    let inc = 0;
    [
      { name: 'Salameche', size: 1 },
      { name: 'Carapuce', size: 2 },
      { name: 'Pikachu', size: 3 },
      { name: 'Bulbizarre', size: 4 },
    ].map(async ({ name, size }) => {
      const asset = new Server(name, size, this.canvas);
      this.addAsset(asset, inc);
      inc += size;
    });
  }

  addAsset = (asset: Asset, row: number): void => {
    const y = rackY + row * uHeight;
    asset.top = y + asset.height! / 2;
    asset.left = rackX + asset.width! / 2;
    this.canvas.add(asset);
  };

  setupSnap() {
    for (var i = 0; i < this.width / this.grid; i++) {
      const vertical = new fabric.Line(
        [i * this.grid, 0, i * this.grid, this.height],
        {
          stroke: 'red',
          selectable: false,
        }
      );
      const horizontal = new fabric.Line(
        [0, i * this.grid, this.width, i * this.grid],
        {
          stroke: 'blue',
          selectable: false,
        }
      );
      this.canvas.add(vertical, horizontal);
    }

    this.canvas.on('object:moving', (options) => {
      this.moveAsset(options.target as Asset);
    });
  }

  moveAsset(asset: Asset) {
    console.log(asset.top);
    asset.set({
      left: rackX + rackWidth / 2,
      top:
        Math.round((asset.top! - asset.baseSize.height / 2) / this.grid) *
          this.grid +
        asset.baseSize.height / 2,
    });
  }
}
