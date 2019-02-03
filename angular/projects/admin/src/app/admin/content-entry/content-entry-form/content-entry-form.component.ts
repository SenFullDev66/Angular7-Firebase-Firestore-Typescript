import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Document, DocumentStatus, DocumentType } from 'tanam-models';
import { ContentEntryService } from '../../../services/content-entry.service';
import { ContentTypeService } from '../../../services/content-type.service';
import { SiteService } from '../../../services/site.service';


interface StatusOption {
  title: string;
  value: DocumentStatus;
}

@Component({
  selector: 'app-content-entry-form',
  templateUrl: './content-entry-form.component.html',
  styleUrls: ['./content-entry-form.component.scss']
})
export class ContentEntryFormComponent implements OnInit, OnDestroy {
  @Input() contentEntry: Document;
  @Input() afterSaveRoute: string;
  @Input() onCancelRoute: string;

  domain$ = this.siteService.getPrimaryDomain();
  documentType$: Observable<DocumentType>;
  entryForm = this.formBuilder.group({
    title: [null, Validators.required],
    urlPath: [null, Validators.required],
    status: [null, Validators.required],
    dataForm: this.formBuilder.group({}),
  });

  readonly richTextEditorConfig = {
    // toolbar: ['heading', '|', 'bold', 'italic', '|', 'bulletedList', 'numberedList'],
  };

  get dataForm() {
    return this.entryForm.get('dataForm') as FormGroup;
  }

  readonly statusOptions: StatusOption[] = [
    { value: 'unpublished', title: 'Unpublished' },
    { value: 'published', title: 'Published' },
  ];

  private _documentTypeSubscription: Subscription;

  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly contentEntryService: ContentEntryService,
    private readonly documentTypeService: ContentTypeService,
    private readonly siteService: SiteService,
  ) { }


  ngOnInit() {
    this.entryForm.patchValue({
      title: this.contentEntry.title,
      urlPath: this.contentEntry.url.path,
      status: this.contentEntry.status,
    });
    this.documentType$ = this.documentTypeService.getContentType(this.contentEntry.documentType);
    this._documentTypeSubscription = this.documentType$
      .subscribe(documentType => {
        for (const field of documentType.fields) {
          if (this.dataForm.get(field.key)) {
            this.dataForm.setValue(this.contentEntry.data[field.key]);
          } else {
            const formControl = new FormControl(this.contentEntry.data[field.key]);
            this.dataForm.addControl(field.key, formControl);
          }
        }
      });
  }

  ngOnDestroy() {
    if (this._documentTypeSubscription && !this._documentTypeSubscription.closed) {
      this._documentTypeSubscription.unsubscribe();
    }
  }
  cancelEditing() {
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async deleteEntry() {
    await this.contentEntryService.delete(this.contentEntry.id);
    this.router.navigateByUrl(this.onCancelRoute);
  }

  async saveEntry() {
    const formData = this.entryForm.value;
    console.log(`[ContentEntryEditComponent:saveEntry] ${JSON.stringify(formData)}`);


    const updates = {
      id: this.contentEntry.id,
      title: formData.title,
      documentType: this.contentEntry.documentType,
      status: formData.status,
      data: this.dataForm.value,
      url: {
        root: this.contentEntry.url.root,
        path: formData.urlPath,
      },
    } as Document;
    await this.contentEntryService.update(updates);


    if (!!this.afterSaveRoute) {
      this.router.navigateByUrl(this.afterSaveRoute);
    }
  }
}
