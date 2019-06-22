import { Component, OnInit, Input } from '@angular/core';

import { StructureComponentBase } from '../structureComponentBase.component';

@Component({
  selector: 'block-base'
})
export class BlockComponentBase extends StructureComponentBase implements OnInit {
  @Input() blocksInGroup: number;

  constructor() {
    super();
  }

  ngOnInit() { }
}
