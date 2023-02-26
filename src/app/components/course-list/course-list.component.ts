import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../common/course";
import {CourseService} from "../../services/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Department} from "../../common/department";
import {Section} from "../../common/section";
import {Subject} from "rxjs";

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {

  courses: Course[] = [];

  currentDepartmentId: number = 1;
  previousDepartmentId: number = 1;

  departmentLink: string;

  previousKeyword: string;

  currentCourse : Course;

  currentDepartment : Department;

  currentSections : Section[];

  searchMode: boolean = false;

  thePageNumber: number = 1; // page number in ng-bootstrap is 1 based: starting from 1 not 0
  thePageSize: number = 10;
  theTotalElements: number = 0;

  constructor(private courseService: CourseService,private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //check route
    this.activeRoute.paramMap.subscribe(() => {
      this.listCourses(); // on completion of subscription, populates the products array
    });
  }

  //search courses
  listCourses() {
    this.searchMode = this.activeRoute.snapshot.paramMap.has('keyword');
    if (this.searchMode) { // route has a parameter named keyword indicating for search
      this.handleSearchCourses();
    }
    else { // not search
      this.handleListCourses();
    }
    //get department because we need department name at the top of the course list
    this.departmentLink = "http://localhost:8080/api/departments/"+this.currentDepartmentId;
    this.getDepartment();
  }

  //if search with keyword
  handleSearchCourses() {
    const term: string = this.activeRoute.snapshot.paramMap.get('keyword')!;
    //check previous keyword and current keyword
    if (this.previousKeyword != term) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = term;
    // now search for the products using the search term
    this.courseService.searchCoursesPaginate(this.thePageNumber - 1,
      this.thePageSize,
      term).subscribe(this.processResult());
  } // end of handleSearchCourses()

  //if not search, get all courses
  handleListCourses() {
    //get department id
    const hasDepartmentId: boolean = this.activeRoute.snapshot.paramMap.has('id');
    //if department id is exist
    if (hasDepartmentId) {
      this.currentDepartmentId = +this.activeRoute.snapshot.paramMap.get('id')!;
    }
    else {
      this.currentDepartmentId = 1;
    }

    if (this.previousDepartmentId != this.currentDepartmentId) {
      this.thePageNumber = 1;
    }
    this.previousDepartmentId = this.currentDepartmentId;

    // get courses for the given department id
    this.courseService.getCourseListPaginate(
      this.thePageNumber - 1,
      this.thePageSize,
      this.currentDepartmentId).subscribe(this.processResult());

    //department id is changed then course and sections are not displayed
    this.currentCourse = null;
    this.currentSections = null;
  }

  private processResult() {
    return (data: any) => {
      this.courses = data._embedded.courses;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  // update page size by value from the drop-down list in html
  updatePageSize(value: number) {
    this.thePageSize = value;
    this.thePageNumber = 1;
    this.handleListCourses(); // redisplay products
  }

  //get course detail when course no. is clicked
  getCourseDetail(course) {
    console.log("current course ",course);
    this.currentCourse = course;
    this.departmentLink = course["_links"]["department"]["href"]
    console.log("dept link ", this.departmentLink)
    this.getDepartment();
    this.getSection();
  }

  //get department obj according to department url
  getDepartment(){
    this.courseService.getDepartmentById(this.departmentLink).subscribe(
      data => {
        console.log("course department ",data)
        this.currentDepartment = data; }
    );
  }

  //get corresponding section when course no. is clicked
  getSection(){
    this.courseService.getSection(this.currentCourse).subscribe(
      data => {
        console.log("section in course ",data)
        this.currentSections = data; }
    );
  }

}
