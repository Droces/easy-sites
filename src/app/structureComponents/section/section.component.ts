import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Section } from '../section';
import { Group } from '../group';
import { StructureComponentBase } from '../structureComponentBase.component';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent extends StructureComponentBase implements OnInit {
  @Input() section: Section;
  @Input() sectionsInPage: number;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  addGroup(): void {
    var newGroup = {
      blocks: [{
        content: ''
      }]
    };
    this.section.groups.push(newGroup);
  }

  changeColour(): void {
    console.log(this.section.colourStyle);
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
      default: {
        this.section.colourStyle = "default";
        break;
      }
    }
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

  removeGroup(group: Group): void {
    var currentPos = this.section.groups.indexOf(group);
    this.section.groups.splice(currentPos, 1);
  }
}
