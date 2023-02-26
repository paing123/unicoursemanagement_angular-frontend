import {Department} from "./department";
import {Course} from "./course";

export class Section {
  id : number;
  number : number;
  year : number;
  semester : string;
  course : Course;
  department : Department;
}
