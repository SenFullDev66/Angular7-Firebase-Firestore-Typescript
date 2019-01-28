import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentEntry } from '../../../../models/content-entry';
import { ContentType } from '../../../../models/content-type';

export interface ContentTypeQueryOptions {
  limit?: number;
  orderBy?: {
    field: string,
    sortOrder: 'asc' | 'desc',
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContentEntryService {

  constructor(
    private readonly firestore: AngularFirestore,
  ) { }

  getNewId() {
    return this.firestore.createId();
  }

  async create(contentType: ContentType, id: string = this.firestore.createId()) {
    return this.firestore
      .collection('tanam-entries').doc<ContentEntry>(id)
      .set({
        id: id,
        contentType: contentType.id,
        title: '',
        url: {
          root: contentType.slug,
          path: '',
        },
        revision: 0,
        standalone: contentType.standalone,
        status: 'unpublished',
        data: {},
        tags: [],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      } as ContentEntry);
  }

  update(entry: ContentEntry) {
    if (!entry.id) {
      throw new Error('Document ID must be provided as an attribute when updating an entry.');
    }

    entry.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    return this.firestore
      .collection<ContentEntry>('tanam-entries').doc(entry.id)
      .update(entry);
  }

  delete(entryId: string) {
    if (!entryId) {
      throw new Error('Document ID must be provided as an attribute when deleting an entry.');
    }
    console.log(entryId);
    return this.firestore
      .collection<ContentEntry>('tanam-entries').doc(entryId)
      .delete();
  }

  findByUrl(root: string, path: string): Observable<ContentEntry> {
    console.log(`[ContentEntryService:findContentEntryByUrl] ${JSON.stringify({ root, path })}`);

    const queryFn = (ref: CollectionReference) =>
      ref.where('url.root', '==', root).where('url.path', '==', path).limit(1);

    return this.firestore
      .collection<ContentEntry>('tanam-entries', queryFn)
      .valueChanges()
      .pipe(map(entry => entry[0]));
  }

  get(entryId: string): Observable<ContentEntry> {
    return this.firestore
      .collection('tanam-entries').doc<ContentEntry>(entryId)
      .valueChanges();
  }

  query(contentTypeId: string, queryOpts: ContentTypeQueryOptions = {}): Observable<ContentEntry[]> {
    console.log(`[ContentEntryService:getContentTypeFields] ${contentTypeId}, query=${JSON.stringify(queryOpts)}`);

    const queryFn = (ref: CollectionReference) => {
      let query = ref.where('contentType', '==', contentTypeId);

      if (queryOpts.orderBy) {
        query = query.orderBy(queryOpts.orderBy.field, queryOpts.orderBy.sortOrder);
      }

      if (queryOpts.limit) {
        query = query.limit(queryOpts.limit);
      }

      return query;
    };

    return this.firestore
      .collection<ContentEntry>('tanam-entries', queryFn)
      .valueChanges();
  }
}
