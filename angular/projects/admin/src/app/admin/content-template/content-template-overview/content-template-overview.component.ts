import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SiteTheme } from 'tanam-models';
import { ContentTemplateService } from '../../../services/content-template.service';
import { SiteThemeService } from '../../../services/site-theme.service';

@Component({
  selector: 'app-content-template-overview',
  templateUrl: './content-template-overview.component.html',
  styleUrls: ['./content-template-overview.component.scss']
})
export class ContentTemplateOverviewComponent implements OnInit {
  theme$: Observable<SiteTheme>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly siteThemeservice: SiteThemeService,
    private readonly contentTemplateService: ContentTemplateService,
  ) { }

  ngOnInit() {
    this.theme$ = this.route.paramMap.pipe(switchMap(params => {
      const themeId = params.get('themeId');
      return this.siteThemeservice.getTheme(themeId);
    }));
  }

  async createNewTemplate(theme: SiteTheme) {
    // TODO: Implement new way of creating template
    // const newId = await this.contentTemplateService.createTemplateInTheme(theme);
    // this.router.navigateByUrl(`/_/admin/templates/${newId}`);
  }

  editTheme(theme: SiteTheme) {
    this.router.navigateByUrl(`/_/admin/themes/${theme.id}/edit`);
  }
}
