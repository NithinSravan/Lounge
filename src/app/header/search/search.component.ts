import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private searchService:SearchService) { }

  ngOnInit(): void {
  }
  onSearch(form:NgForm){
    if(form.invalid)
    return;
    this.searchService.searchUser(form.value.search)
  }
}
