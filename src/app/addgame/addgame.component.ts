import { Component, OnInit } from '@angular/core';
import{mimeType}from './mime-type.validator';
import { FormGroup, FormControl,Validators  } from '@angular/forms';
import { AddgameService } from './addgame.service';
@Component({
  selector: 'app-addgame',
  templateUrl: './addgame.component.html',
  styleUrls: ['./addgame.component.css']
})
export class AddgameComponent implements OnInit {
  file:string;
  filePreview:string;
  errmessage:string;
  submitted:boolean=false;
  successmessage:string;
  form:FormGroup;
  constructor(public addgameService:AddgameService) { }

  ngOnInit(): void {
    this.form=new FormGroup({
      gamename:new FormControl(null,{validators:[Validators.required]}),
      file:new FormControl(null,{validators:[Validators.required],asyncValidators:mimeType})
    });
  }
  onFilePicked(event:Event){
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({file:file});
    this.form.get('file').updateValueAndValidity();
    const reader=new FileReader();
    reader.onload=()=>{
      this.filePreview=reader.result as string;
    }
    this.file=file.name;

    reader.readAsDataURL(file);

  }
  onUpload(){
    this.submitted=true;
    if(this.form.invalid){
      this.errmessage="Error in game upload. Please read the instructions carefully."
      return;
    }
    this.addgameService.addGame(this.form.value.gamename,this.form.value.file)
    this.submitted=false;
    this.successmessage="Game Uploaded!"
    this.form.reset()

  }
}
