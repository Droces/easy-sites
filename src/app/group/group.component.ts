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
  @Output() removeGroup = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addBlock(): void {
    this.group.blocks.push({id: Date.now(), content: "new block"});
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
