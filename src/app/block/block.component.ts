import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Block } from '../block';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() block: Block;

  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() removeBlock = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  up(): void {
    this.moveUp.emit(this.block);
  }

  down(): void {
    this.moveDown.emit(this.block);
  }

  removeSelf(): void {
    this.removeBlock.emit(this.block);
  }
}
