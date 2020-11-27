import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutConfigService, SplashScreenService, TranslationService } from './core/_base/layout';
import { locale as enLang } from './core/_config/i18n/en';
import { locale as esLang } from './core/_config/i18n/es';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[b404-root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TMS';
  loader: boolean;

  private ngUnsuscribe = new Subject();
  constructor(
    private router: Router,
    private translationService: TranslationService,
    private layoutConfigService: LayoutConfigService,
    private splashScreenService: SplashScreenService,
    private splashScreenService2: SplashScreenService
  ) { }

  ngOnInit(): void {
    this.translationService.loadTranslations(esLang, enLang);

    // enable/disable loader
    this.loader = this.layoutConfigService.getConfig('loader.enabled');

    this.router.events.pipe(
      takeUntil(this.ngUnsuscribe)
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('b404-page--loaded');
        }, 500);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsuscribe.next();
    this.ngUnsuscribe.complete();
  }
}
