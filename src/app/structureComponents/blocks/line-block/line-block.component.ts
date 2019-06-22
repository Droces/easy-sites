import { Component, OnInit, Input } from '@angular/core';

import { StructureComponentBase } from '../../structureComponentBase.component';

@Component({
  selector: 'line-block',
  templateUrl: './line-block.component.html',
  styleUrls: []
})
export class LineBlockComponent extends StructureComponentBase implements OnInit {
  @Input() blocksInGroup: number;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
