import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
import {
  rackHeight,
  rackInfoHeight,
  rackWidth,
  rackX,
  rackY,
  uHeight,
} from './constants';
import { RackInfo } from './rack/header-info';
import { Rack } from './rack/rack';

export type Asset = fabric.Group & { __brand: 'asset' } & {
  baseSize: { height: number; width: number };
  type: string;
  rackSize: number;
};

@Injectable({ providedIn: 'root' })
export class FabricService {
  private canvas!: fabric.Canvas;
  private width!: number;
  private height!: number;

  private isDragging: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;
  private selection: boolean = false;

  private readonly grid = uHeight;

  setCanvas(canvas: fabric.Canvas, width: number, height: number) {
    this.canvas = canvas;
    this.width = width;
    this.height = rackHeight;
    this.init();
  }

  init() {
    this.setupSnap();
    this.setupMouseEvents();

    const rack = new Rack();
    rack.top = rackY + rackInfoHeight;
    rack.left = rackX;
    this.canvas.add(rack);

    const rackInfo = new RackInfo(this.canvas);
    rackInfo.top = rackY;
    rackInfo.left = rackX;
    this.canvas.add(rackInfo);

    // const u = new UUnits(units);
    // u.left = rackX - uHeight; // - uHeight / 2;
    // u.top = rackY; // + u.height / 2;
    // this.canvas.add(u);

    let inc = 0;
    [
      { name: 'Salamechee', size: 1 },
      { name: 'Carapuce', size: 2 },
      { name: 'Pikachu', size: 3 },
      { name: 'Bulbizarre', size: 4 },
    ].map(async ({ name, size }) => {
      //const asset = new Server(name, size, this.canvas);
      //rack.addAsset(asset, inc);
      inc += size;
    });
  }

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
      if (options.target?.type === 'server') {
        this.moveAsset(options.target as Asset);
      }
    });
  }

  setupMouseEvents() {
    this.canvas.on('mouse:wheel', (opt) => {
      if (opt.e.altKey === true) {
        var delta = opt.e.deltaY;
        var zoom = this.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      } else {
        var e = opt.e;
        var vpt = this.canvas.viewportTransform!;
        vpt[5] += opt.e.deltaY > 0 ? -20 : 20;
        this.canvas.requestRenderAll();
      }
    });

    this.canvas.on('mouse:down', (opt) => {
      var evt = opt.e;
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    });

    this.canvas.on('mouse:move', (opt) => {
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.canvas.viewportTransform!;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.canvas.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    this.canvas.on('mouse:up', (opt) => {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.canvas.setViewportTransform(this.canvas.viewportTransform!);
      this.isDragging = false;
      this.selection = true;
    });
  }

  moveAsset(asset: Asset) {
    asset.set({
      left: rackX + rackWidth / 2,
      top:
        Math.round((asset.top! - asset.baseSize.height / 2) / this.grid) *
          this.grid +
        asset.baseSize.height / 2,
    });
  }
}
