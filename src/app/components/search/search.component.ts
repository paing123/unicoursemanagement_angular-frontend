import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string) {
    // Navigates to a view using a route path. It is equivalent to using routerLink in HTML file
    this.router.navigateByUrl(`/search/${value}`);
  }

}
