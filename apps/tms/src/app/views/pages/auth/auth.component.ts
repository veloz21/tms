import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LayoutConfigService, SplashScreenService, TranslationService } from '@tms/layout';
import { AuthNoticeService } from '../../../core/auth';

@Component({
  selector: 'b404-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
  public today: number = Date.now();
  public headerLogo: string;

  constructor(
    private layoutConfigService: LayoutConfigService,
    public authNoticeService: AuthNoticeService,
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService) {
  }

  ngOnInit(): void {
    this.translationService.setLanguage(this.translationService.getSelectedLanguage());
    this.headerLogo = this.layoutConfigService.getLogo();
    this.splashScreenService.hide();
  }
}
