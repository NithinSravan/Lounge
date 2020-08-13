import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import{mimeType}from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  submitted:boolean=false;
  content=" ";
  errmessage:string;
  post:Post;
  form:FormGroup;
  imagePreview:string;
  constructor(public postsService:PostsService) { }

  ngOnInit(): void {
    this.form=new FormGroup({
      content:new FormControl(null,{validators:[Validators.required]}),
      image:new FormControl(null,{validators:[Validators.required],asyncValidators:mimeType})
    });
  }
  onImagePicked(event:Event){
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader=new FileReader();
    reader.onload=()=>{
      this.imagePreview=reader.result as string;
    }
    reader.readAsDataURL(file);

  }
  onSavePost(){
    this.submitted=true;
    if(this.form.invalid){
      this.errmessage="Please upload valid image file or ensure if you have filled in your thoughts."
      return;
    }
    this.postsService.addPosts(this.form.value.content,this.form.value.image);
    this.submitted=false;
    this.form.reset();
  }
}
