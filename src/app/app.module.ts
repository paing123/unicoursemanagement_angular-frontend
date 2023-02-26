import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {RouterModule, Routes} from "@angular/router";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { CourseListComponent } from './components/course-list/course-list.component';
import {CourseService} from "./services/course.service";
import { DepartmentMenuComponent } from './components/department-menu/department-menu.component';
import { SearchComponent } from './components/search/search.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { SectionComponent } from './components/section/section.component';
import { SectionListComponent } from './components/section-list/section-list.component';

const routes: Routes = [
  {path: 'search/:keyword', component: CourseListComponent},
  {path: 'department/:id', component: CourseListComponent},
  {path: 'department', component: CourseListComponent},
  {path: 'courses', component: CourseListComponent},
  {path: '', redirectTo: '/courses', pathMatch: 'full'},
  {path: '**', redirectTo: '/courses', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    CourseListComponent,
    DepartmentMenuComponent,
    SearchComponent,
    CourseDetailComponent,
    SectionComponent,
    SectionListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [CourseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
