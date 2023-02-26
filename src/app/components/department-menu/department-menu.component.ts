import { Component, OnInit } from '@angular/core';
import {Department} from "../../common/department";
import {CourseService} from "../../services/course.service";

@Component({
  selector: 'app-department-menu',
  templateUrl: './department-menu.component.html',
  styleUrls: ['./department-menu.component.css']
})
export class DepartmentMenuComponent implements OnInit {

  departments: Department[];

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
    //get all the departments
    this.listDepartments();
  }

  listDepartments() {
    //get all departments from course service
    this.courseService.getDepartments().subscribe(
      data => {
        console.log('Departments=' + data);
        this.departments = data;
      } );
  }
}
