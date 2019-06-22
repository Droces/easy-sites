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

  blockSelectionVisible = false;

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

  showBlockSelection(): void {
    this.blockSelectionVisible = this.blockSelectionVisible ? false : true;
  }

  addBlock(type: string): void {
    switch (type) {
      case 'text': {
        this.group.blocks.push({type: 'text', content: ""});
        break;
      }
      case 'image': {
        this.group.blocks.push({type: 'image', content: ""});
        break;
      }
      case 'line': {
        this.group.blocks.push({type: 'line', content: ""});
        break;
      }
      default: {
        // @todo throw error
        break;
      }
    }
  }

  removeBlock(block: Block): void {
    var currentPos = this.group.blocks.indexOf(block);
    this.group.blocks.splice(currentPos, 1);
  }
}
