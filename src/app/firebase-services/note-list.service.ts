import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { query, orderBy, limit, where, Firestore, collectionData, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NoteComponent } from '../note-list/note/note.component';
@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);
  unsubTrash;
  unsubNotes;
  unsubMarked;

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
    this.unsubMarked = this.subMarkedNotesList();
  }

  subNotesList() {
    const q = query(this.getNotesRef(), limit(100)) //where("marked", "==", true)
    return onSnapshot(q, (list) => {
      this.normalNotes = []
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = []
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true));
    return onSnapshot(q, (list) => {
      this.markedNotes = []
      list.forEach(element => {
        this.markedNotes.push(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarked();
  }

  getColIdFromNote(note: Note) {
    return note.type == "note" ? "notes" : "trash";
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  async updateNote(note: Note) {
    let colId = this.getColIdFromNote(note);
    let noteAsJson = this.getCleanJson(note)
    if (note.id) {
      await updateDoc(this.getSingleDocRef(colId, note.id), noteAsJson).catch(
        (err) => { console.error(err) })
    }
  }

  async addNote(item: Note, colId: "notes" | "trash") {
    await addDoc(colId == "notes" ? this.getNotesRef(): this.getTrashRef(), item).catch(
      (err) => {
        console.error(err)
      }
    ).then(
      (docRef) => {
        console.log("Dokument written with ID: ", docRef?.id);
      }
    )
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, documentId: string) {
    return doc(collection(this.firestore, colId), documentId);
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "New Note",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  async deleteNote(note: Note){ //HIER KÖNNTE ES KLEMMEN evtl. muss man nicht note sondern colId: string, documentId: string übergeben
    if (note.id) {
      await deleteDoc(this.getSingleDocRef(this.getColIdFromNote(note), note.id)).catch(
        (err) => { console.error(err) })
    }
  }
}
