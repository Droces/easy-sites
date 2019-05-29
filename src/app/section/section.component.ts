import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Section } from '../section';
import { Group } from '../group';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  @Input() section: Section;

  // An event emitter
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() removeSection = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addGroup(): void {
    this.section.groups.push({id: Date.now(), blocks: []});
  }

  changeColour(): void {
    switch (this.section.colourStyle) {
      case 'default': {
        this.section.colourStyle = "blue";
        break;
      }
      case 'blue': {
        this.section.colourStyle = "default";
        break;
      }
    }
  }

  up(): void {
    this.moveUp.emit(this.section);
  }

  down(): void {
    this.moveDown.emit(this.section);
  }

  // removeLastGroup(): void {
  //   this.section.groups.pop();
  // }

  removeSelf(): void {
    this.removeSection.emit(this.section);
  }

  removeGroup(group: Group): void {
    var currentPos = this.section.groups.indexOf(group);
    this.section.groups.splice(currentPos, 1);
  }
}
