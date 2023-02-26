import {Component, Input, OnInit} from '@angular/core';
import {Section} from "../../common/section";
import {CourseService} from "../../services/course.service";

@Component({
  selector: 'app-section-list',
  templateUrl: './section-list.component.html',
  styleUrls: ['./section-list.component.css']
})
export class SectionListComponent implements OnInit {

  @Input() year : number;

  @Input() semester : string;

  sectionList : Section[] = [];

  thePageNumber: number = 1; // page number in ng-bootstrap is 1 based: starting from 1 not 0
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    this.searchSection();
  }

  //any changes for section list, always search section according to current year and semester
  ngOnChanges() {
    this.searchSection();
  }

  //search section based on current year and semester
  searchSection(){
    const year = this.year;
    const semester = this.semester;

    this.courseService
        .getSectionListPaginate(this.thePageNumber - 1,
                                        this.thePageSize,
                                        year,semester).subscribe(this.processResult());
  }

  private processResult() {
    return (data: any) => {
      this.sectionList = data._embedded.sections;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
      this.getCourseAndDepartmentForSection(this.sectionList);
    };
  }

  //get course number and department code for section
  getCourseAndDepartmentForSection(sectionList : Section[]){
    for(let section of sectionList){
      let courseUrl = section["_links"]["course"]["href"]
      this.courseService.getCourseById(courseUrl).subscribe(
        data => {
          section.course = data;
          let departmentUrl = data["_links"]["department"]["href"]
          this.courseService.getDepartmentById(departmentUrl).subscribe(
            data => {
              section.department = data;
            }
          );
        }
      );

    }
  }

  updatePageSize(value: number) {
    this.thePageSize = value;
    this.thePageNumber = 1;
    this.searchSection(); // redisplay section
  }
}
