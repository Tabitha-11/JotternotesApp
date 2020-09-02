import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { INote } from '../shared/interface';
import { NoteService } from '../shared/note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  myForm: FormGroup;
  allNotes: Observable<INote[]>;

  constructor(
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {}

  ngOnInit(): void {
    this.intializeForm();
    this.allNotes = this.noteService.getAllNotes();
  }

  private intializeForm() {
    this.myForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      date: Date.now()
    });
  }

  onPostNote() {
    const note: INote = this.myForm.value;
    this.noteService.addToNotes(note).then(() => {
      this.myForm.reset();
      this.myForm.markAsUntouched();
      this.myForm.markAsPristine();
    });
  }
}
