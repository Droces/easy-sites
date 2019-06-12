import { Component, OnInit, Input } from '@angular/core';

import { Group } from '../group';
import { Block } from '../block';
import { StructureComponentBase } from '../structureComponentBase.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent extends StructureComponentBase implements OnInit {
  @Input() group: Group;
  @Input() groupsInSection: number;

  constructor() {
    super();
  }

  ngOnInit() { }

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
    this.group.blocks.push({content: ""});
  }

  removeBlock(block: Block): void {
    var currentPos = this.group.blocks.indexOf(block);
    this.group.blocks.splice(currentPos, 1);
  }
}
