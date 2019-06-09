import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

import { PageService } from '../../page.service';
import { HttpService } from '../../http.service';

import { Block } from '../block';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() block: Block;
  @Input() blocksInGroup: number;

  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() removeBlock = new EventEmitter();

  isActive: boolean = false;

  public editor = InlineEditor;
  public config = {
    placeholder: 'Click here to type.',
    toolbar: [
      "heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "insertTable"]
  };

  constructor(
    public httpService: HttpService,
    public pageService: PageService) { }

  ngOnInit() {
  }

  toggleActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  public editorReady( editor ) {
    // console.log('editor toolbar items', Array.from(editor.ui.componentFactory.names()));
  }

  onChange({ editor }: ChangeEvent) {
    this.httpService.currentState = 'Unsaved';
    const data = editor.getData();
    this.pageService.savePage();
  }

  up(): void {
    this.moveUp.emit(this.block);
  }

  down(): void {
    this.moveDown.emit(this.block);
  }

  removeSelf(): void {
    this.removeBlock.emit(this.block);
  }
}
