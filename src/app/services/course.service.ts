import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Course} from "../common/course";
import {Department} from "../common/department";
import {Section} from "../common/section";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  // URL to REST API endpoint from the prior Spring Boot backend project
  private baseUrl = 'http://localhost:8080/api/courses';

  private departmentUrl = 'http://localhost:8080/api/departments';

  private sectionUrl =  'http://localhost:8080/api/sections';

  constructor(private httpClient: HttpClient) { }

  //get all course list with pagination
  getCourseListPaginate(thePage: number, thePageSize: number,departmentId: number): Observable<GetResponseCourse> {
    // http://localhost:8080/api/courses/search/findByDepartmentId?id=1&page=0&size=10
    const url = `${this.baseUrl}/search/findByDepartmentId`
      + `?id=${departmentId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseCourse>(url);
  }

  //get all departments
  getDepartments(): Observable<Department[]> {
    return this.httpClient.get<GetResponseDepartment>(this.departmentUrl).pipe(
      map(response => response._embedded.departments));
  }

  //search course list pagination after search
  searchCoursesPaginate(
    thePage: number,
    thePageSize: number,
    theKeyword: string): Observable<GetResponseCourse> {
    // http://localhost:8080/api/courses/search/findByTitleOrNumberContaining?keyword=Intro&page=0&size=10
    const searchUrl =
      `${this.baseUrl}/search/findByTitleOrNumberContaining?keyword=${theKeyword}&page=${thePage}&size=${thePageSize
      }`;
    return this.httpClient.get<GetResponseCourse>(searchUrl);
  }

  //get department by id
  getDepartmentById(url: string): Observable<Department> {
    return this.httpClient.get<Department>(url);
  }

  //get course by id
  getCourseById(url: string): Observable<Course> {
    return this.httpClient.get<Course>(url);
  }

  //get section using course id
  getSection(course : Course) : Observable<Section[]> {
    const url = `${this.sectionUrl}/search/findByCourseId`
                + `?courseId=${course?.id}`;
    console.log("In course service, sectionURL ",url)
    return this.httpClient.get<GetResponseSection>(url).pipe(
      map(response => response._embedded.sections));
  }

  //add section to db
  addSection(course : Course,section : Section) : Observable<Section>{
    console.log("add section in service")
    const url = `http://localhost:8080/api/course/${course?.id}/section`;
    return this.httpClient.post<Section>(url, section);
  }

  //delete the section
  deleteSection(courseId : number, sectionNumber : number): Observable<Section>{
    const url = `http://localhost:8080/api/course/${courseId}/section/${sectionNumber}`;
    return this.httpClient.delete<Section>(url);
  }

  //search section list for pagination
  getSectionListPaginate(
    thePage: number,
    thePageSize: number,
    year : number,
    semester : string): Observable<GetResponseSection> {

    const url = `${this.sectionUrl}/search/findByYearAndSemester`
      + `?year=${year}&semester=${semester}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseSection>(url);
  }
}

interface GetResponseCourse {
  _embedded: { courses: Course[]; },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseDepartment {
  _embedded: {
    departments: Department[];
  }
}

interface GetResponseSection {
  _embedded: {
    sections: Section[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}
