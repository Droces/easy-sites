import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

import { PageComponent } from './structureComponents/page/page.component';
import { SectionComponent } from './structureComponents/section/section.component';
import { GroupComponent } from './structureComponents/group/group.component';

import { TextBlockComponent } from './structureComponents/blocks/text-block/text-block.component';
import { ImageBlockComponent } from './structureComponents/blocks/image-block/image-block.component';

import { PagesListComponent } from './pages-list/pages-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrimaryNavComponent } from './primary-nav/primary-nav.component';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

import { FormsModule } from '@angular/forms'; // <-- NgModel from this
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HttpClientModule } from '@angular/common/http';
import { SettingsPageComponent } from './settings-page/settings-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageComponent,
    SectionComponent,
    GroupComponent,
    TextBlockComponent,
    PagesListComponent,
    PageNotFoundComponent,
    PrimaryNavComponent,
    ThemeSelectorComponent,
    SettingsPageComponent,
    ImageBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CKEditorModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
