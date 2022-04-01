import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
import { FabricService } from './fabric.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit {
  title = 'fabricjs-rack';

  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private el: ElementRef<HTMLElement>,
    private fabricService: FabricService
  ) {}

  ngAfterViewInit(): void {
    const { width, height } = this.el.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;

    const canvas = new fabric.Canvas('rack-canvas', {
      selection: false,
      backgroundColor: '#eee',
    });
    this.fabricService.setCanvas(canvas, width, height);
  }
}
