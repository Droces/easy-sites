import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Block } from '../block';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() block: Block;
  @Output() removeBlock = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  removeSelf(): void {
    this.removeBlock.emit(this.block);
  }
}
