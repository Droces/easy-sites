import { Component, OnInit } from '@angular/core';

import { StructureComponentBase } from '../../structureComponentBase.component';

@Component({
  selector: 'app-line-block',
  templateUrl: './line-block.component.html',
  styleUrls: []
})
export class LineBlockComponent extends StructureComponentBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
