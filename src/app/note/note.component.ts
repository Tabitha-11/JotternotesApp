import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { INote, IListDialogue } from '../shared/interface';
import { NoteService } from '../shared/note.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

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
    private noteService: NoteService,
    private dialog: MatDialog
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

  onDelete(key: string) {
    console.log(key);
    return this.noteService.deleteNote(key);
  }

  onEdit(key: string) {
    const dialogRef = this.dialog.open(ListingDialogueBoxComponent, {
      width: '900px',
      data: {
        $key: key,
        title: '',
        body: '',
        date: Date.now()
      }
    });

  }
}

@Component({
  selector: 'app-update-note',
  templateUrl: './noteUpdate.component.html',
  styleUrls: ['./noteUpdate.component.css']
})
export class ListingDialogueBoxComponent implements OnInit {
  dialogForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ListingDialogueBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private noteService: NoteService
  ) {}
  ngOnInit(): void {
    this.initializeForm();
    this.dialogForm.reset();
    this.dialogForm.markAsUntouched();
    this.dialogForm.markAsPristine();
  }
  private initializeForm() {
    this.dialogForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
      date: Date.now()
    });
  }

  onUpdatNote() {
    this.dialogRef.close();
    let key = this.data.$key;
    this.noteService.updateNote(key, this.dialogForm.value);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
