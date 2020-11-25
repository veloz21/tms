// Angular
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'b404-notice',
	templateUrl: './notice.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeComponent implements OnInit {
	// Public properties
	@Input() classes: any = '';
	@Input() icon: any;

	/**
	 * Component constructor
	 */
	constructor() {}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.icon) {
			this.classes += ' b404-alert--icon';
		}
	}
}
