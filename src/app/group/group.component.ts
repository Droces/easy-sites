import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Group } from '../group';
import { Block } from '../block';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  @Input() group: Group;

  @Output() moveLeft = new EventEmitter();
  @Output() moveRight = new EventEmitter();
  @Output() removeGroup = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  left(): void {
    this.moveLeft.emit(this.group);
  }

  right(): void {
    this.moveRight.emit(this.group);
  }

  moveBlockUp(block: Block) {
    var currentPos = this.group.blocks.indexOf(block);
    if (currentPos <= 0) {
      return null;
    }
    this.group.blocks.splice(currentPos - 1, 0, this.group.blocks.splice(currentPos, 1)[0]);
  }

  moveBlockDown(block: Block) {
    var currentPos = this.group.blocks.indexOf(block);
    // No check needed for last section
    this.group.blocks.splice(currentPos + 1, 0, this.group.blocks.splice(currentPos, 1)[0]);
  }

  addBlock(): void {
    this.group.blocks.push({content: "new block"});
  }

  // removeLastBlock(): void {
  //   this.group.blocks.pop();
  // }

  removeSelf(): void {
    this.removeGroup.emit(this.group);
  }

  removeBlock(block: Block): void {
    var currentPos = this.group.blocks.indexOf(block);
    this.group.blocks.splice(currentPos, 1);
  }
}
