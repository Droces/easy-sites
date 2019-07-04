import { Component, OnInit, Input } from '@angular/core';

import { StructureComponentBase } from '../../structureComponentBase.component';

import { LineBlock } from '../line-block';

@Component({
  selector: 'line-block',
  templateUrl: './line-block.component.html',
  styleUrls: []
})
export class LineBlockComponent extends StructureComponentBase implements OnInit {
  @Input() block: LineBlock;
  @Input() blocksInGroup: number;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
