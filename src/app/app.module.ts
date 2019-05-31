import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { SectionComponent } from './section/section.component';
import { GroupComponent } from './group/group.component';
import { BlockComponent } from './block/block.component';
import { PagesListComponent } from './pages-list/pages-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    SectionComponent,
    GroupComponent,
    BlockComponent,
    PagesListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
