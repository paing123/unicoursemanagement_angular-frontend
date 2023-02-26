import {Component, Input, OnInit} from '@angular/core';
import {Course} from "../../common/course";
import {CourseService} from "../../services/course.service";
import {Section} from "../../common/section";
import {Department} from "../../common/department";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit {

  @Input() course : Course;

  @Input() department : Department;

  @Input() sections : Section[];

  checkSectionList : boolean;

  currentSection : number = 1;
  currentYear : number = 2022;
  currentSemester : string = "Summer";

  constructor(private courseService: CourseService) { }

  ngOnInit(): void {
  }

  //any changes on section, set checkSectionList is false because we set one place where section list of current course
  //or search section list
  ngOnChanges() {
    this.checkSectionList = false;
  }

  //when section is changed by user, current section is changed.
  changeSection(sectionNo : number){
    console.log("section no ",sectionNo);
    this.currentSection = sectionNo;
  }

  //when year is changed by user, current year is changed.
  changeYear(year : number){
    console.log("year  ",year);
    this.currentYear = year;
  }

  //when semester is changed by user, current semester is changed.
  changeSemester(semester : string){
    console.log("semester ",semester);
    this.currentSemester = semester;
  }

  //user add the section
  addSection() {
    console.log("Add section start")
    this.checkSectionList = false;
    //check section number duplication, because we can delete 1 row using course id and section id
    let check = this.isSectionNumberExist(this.currentSection)
    if(check){
      alert("Course Section Number is already exist, Try another one")
    }else{
      let newSection : Section = new Section();
      newSection.number = this.currentSection;
      newSection.year = this.currentYear;
      newSection.semester = this.currentSemester;

      //add to db
      this.courseService.addSection(this.course, newSection).subscribe(
        data =>  this.sections.push(data)
      )
    }
  }

  //check section number duplication for same course id
  isSectionNumberExist(sectionNumber : number) : boolean{
    for(let section of this.sections){
      if(section.number == sectionNumber){
        return true;
      }
    }
    return false
  }

  //delete the section according to section number and course id
  deleteSection(sectionNumber : number){
    let deleteIndex : number;
    this.courseService.deleteSection(this.course.id, sectionNumber).subscribe(
      response => {
      this.sections = this.sections.filter(section => section.number !== sectionNumber)
    }
    )
  }

  //search all the section based on the current year and current semester
  searchSection() {
    this.checkSectionList = true;
    console.log("current year ",this.currentYear)
    console.log("current semester ",this.currentSemester)
  }
}
