import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import { rackWidth, rackX, rackY, uHeight } from './constants';
import serverSvg from 'raw-loader!./rack/svgs/server.svg';
import { isUndefined, keyBy, mapValues, omit, omitBy } from 'lodash-es';

type Asset = fabric.Object & { __brand: 'asset' };

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
    ].map(async ({ name, size }) => {
      const asset = await this.createServer(name, size);
      this.addAsset(asset, inc);
      inc += size;
    });

    this.canvas.on('object:selected', (evt) => {
      console.log(evt.target);
    });
  }

  createServer = async (name: string, size: number): Promise<Asset> => {
    const asset = await new Promise<Asset>((resolve) => {
      fabric.loadSVGFromString(serverSvg, (objs, a) => {
        const byIds = keyBy(objs, 'id') as Record<string, any>;
        byIds['asset-name'].text = name;

        // const filteredSvg = objs.filter((o: any) =>
        //   o.id.startsWith('u') ? o.id === `u${size}` : true
        // );
        // console.log(objs, filteredSvg);

        const svg: fabric.Object = new fabric.Group(objs);
        resolve(svg as Asset);
      });
    });
    asset.fill = 'red';
    asset.hasControls = false;
    asset.hasBorders = false;

    return asset;
  };

  addAsset = (asset: Asset, row: number): void => {
    const y = rackY + row * uHeight;
    asset.top = y;
    asset.left = rackX;
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
      options.target!.set({
        left: Math.round(options.target!.left! / this.grid) * this.grid,
        top: Math.round(options.target!.top! / this.grid) * this.grid,
      });
    });
  }
}
