import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { IListDialogue, INote } from './interface';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  notes: INote[];
  constructor(private afd: AngularFireDatabase) {}

  addToNotes(newNote) {
    console.log(newNote);
    return this.afd.list('notes').push(newNote);
  }

  getAllNotes() {
    return this.afd
      .list('notes')
      .snapshotChanges()
      .pipe(
        map((val: SnapshotAction<INote>[]) => {
          return val.map((action: SnapshotAction<INote>) => {
            const $key = action.payload.key;
            return { $key, ...action.payload.val() };
          });
        }),
        catchError(e => {
          console.log(e);
          return of([]);
        }),
        shareReplay()
      );
  }

  updateNote(key: string, newNote: IListDialogue) {
    console.log(newNote);
    return this.afd.list('notes').update(key, {
      title: newNote.title,
      body: newNote.body,
      date: newNote.date
    });
  }

  deleteNote(noteId: string) {
    return this.afd.list('notes').remove(noteId);
  }
}
