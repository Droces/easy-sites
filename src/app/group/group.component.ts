import { Component, OnInit, Input } from '@angular/core';

import { Group } from '../group';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  @Input() group: Group;

  constructor() { }

  ngOnInit() {
  }

  addBlock(): void {
    this.group.blocks.push({content: "new block"});
  }

  removeLastBlock(): void {
    this.group.blocks.pop();
  }
}
