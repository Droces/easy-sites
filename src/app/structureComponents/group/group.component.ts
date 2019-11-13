import { Component, OnInit, Input } from '@angular/core';

import { Group } from '../group';
import { StructureComponentBase } from '../structureComponentBase.component';

import { PageService } from '../../page.service';

import { BlockInterface } from '../block-interface';
import { TextBlock } from '../blocks/text-block';
import { ImageBlock } from '../blocks/image-block';
import { LineBlock } from '../blocks/line-block';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent extends StructureComponentBase implements OnInit {
  @Input() group: Group;
  @Input() groupsInSection: number;

  blockSelectionVisible = false;

  constructor(public pageService: PageService) {
    super();
  }

  ngOnInit() { }

  moveBlockUp(block: BlockInterface) {
    let currentPos: number = this.group.blocks.indexOf(block);
    if (currentPos <= 0) {
      return null;
    }
    this.group.blocks.splice(currentPos - 1, 0, this.group.blocks.splice(currentPos, 1)[0]);
  }

  moveBlockDown(block: BlockInterface) {
    let currentPos: number = this.group.blocks.indexOf(block);
    // No check needed for last section
    this.group.blocks.splice(currentPos + 1, 0, this.group.blocks.splice(currentPos, 1)[0]);
  }

  showBlockSelection(): void {
    this.blockSelectionVisible = this.blockSelectionVisible ? false : true;
  }

  addBlock(type: string): void {
    switch (type) {
      case 'text': {
        const textBlock: TextBlock = {type: 'text', content: ''};
        this.group.blocks.push(textBlock);
        break;
      }
      case 'image': {
        const imageBlock: ImageBlock = {type: 'image', fileId: ''};
        this.group.blocks.push(imageBlock);
        break;
      }
      case 'line': {
        const lineBlock: LineBlock = {type: 'line'};
        this.group.blocks.push(lineBlock);
        break;
      }
    }
  }

  removeBlock(block: BlockInterface): void {
    let currentPos: number = this.group.blocks.indexOf(block);
    this.group.blocks.splice(currentPos, 1);
    this.pageService.savePage(null, 'patch', 3);
  }
}
