import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../common/course";
import {Department} from "../../common/department";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit {

  @Input() course : Course;

  @Input() department : Department;

  constructor() { }

  ngOnInit(): void {

  }
}
