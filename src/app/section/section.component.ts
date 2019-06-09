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
  @Input() sectionsInPage: number;

  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() removeSection = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addGroup(): void {
    this.section.groups.push({blocks: []});
  }

  changeColour(): void {
    switch (this.section.colourStyle) {
      case 'default': {
        this.section.colourStyle = "emphasis1";
        break;
      }
      case 'emphasis1': {
        this.section.colourStyle = "emphasis2";
        break;
      }
      case 'emphasis2': {
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

  moveGroupLeft(group: Group) {
    var currentPos = this.section.groups.indexOf(group);
    if (currentPos <= 0) {
      return null;
    }
    this.section.groups.splice(currentPos - 1, 0, this.section.groups.splice(currentPos, 1)[0]);
  }

  moveGroupRight(group: Group) {
    var currentPos = this.section.groups.indexOf(group);
    // No check needed for last section
    this.section.groups.splice(currentPos + 1, 0, this.section.groups.splice(currentPos, 1)[0]);
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
