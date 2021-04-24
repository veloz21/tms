import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import * as places from 'places.js';

@Component({
  selector: 'b404-places',
  template: `
    <input style="height:50px;" #input type="search" [placeholder]="placeholder" />
    <div #map class="places-map"></div>
  `,
  styles: [`
    .places-map {
      z-index: 1;
      height: 300px;
    };
  `],
})
export class PlacesComponent implements AfterViewInit, OnDestroy, OnChanges {
  private instance = null;

  @ViewChild('map') mapEl: ElementRef;
  @ViewChild('input') input: ElementRef;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onChange = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClear = new EventEmitter();

  @Input() type: string = 'address';
  @Input() placeholder: string;
  @Input() coordinates: number[] = [0, 0];

  map: L.Map;
  markers: L.Marker<any>[];

  ngAfterViewInit() {
    this.instance = places({
      appId: 'pl6M28ZJIIFM',
      apiKey: '6e4b81520a26ea955c5b3b831ba84955',
      container: this.input.nativeElement,
    }).configure({
      type: this.type,
      countries: ['MX']
    });

    this.map = L.map(this.mapEl.nativeElement, {
      scrollWheelZoom: false,
      zoomControl: false
    });

    var osmLayer = new L.TileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 1,
      maxZoom: 13,
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    this.markers = [];

    this.map?.setView(new L.LatLng(0, 0), 1);
    this.map?.addLayer(osmLayer);

    if (this.coordinates[1] != 0 && this.coordinates[0] != 0) {
      this.map?.setView(new L.LatLng(this.coordinates[1], this.coordinates[0]), 12);
      this.markers.push(L.marker([this.coordinates[1], this.coordinates[0]]).addTo(this.map),);
      this.findBestZoom(self);
    }

    this.instance.on('change', (e) => {
      const self = this;

      console.log('instance.on change getVal', this.instance.getVal());

      this.markers
        .forEach(function (marker, markerIndex) {
          if (markerIndex === e.suggestionIndex) {
            self.markers = [marker];
            marker.setOpacity(1);
            self.findBestZoom(self);
          } else {
            self.removeMarker(marker, self);
          }
        });
      this.onChange.emit(e);
    });

    this.instance.on('clear', (e) => {
      const self = this;
      this.map?.setView(new L.LatLng(0, 0), 1);
      this.markers.forEach(m => this.removeMarker(m, self));
      this.onClear.emit(e);
    });

    this.instance.on('suggestions', (e) => {
      const self = this;
      this.markers.forEach(m => this.removeMarker(m, self));
      this.markers = [];

      if (e.suggestions.length === 0) {
        this.map?.setView(new L.LatLng(0, 0), 1);
        return;
      }

      e.suggestions.forEach(s => this.addMarker(s, self));
      this.findBestZoom(self);
    });

    this.instance.on('cursorchanged', (e) => {
      this.markers
        .forEach(function (marker, markerIndex) {
          if (markerIndex === e.suggestionIndex) {
            marker.setOpacity(1);
            marker.setZIndexOffset(1000);
          } else {
            marker.setZIndexOffset(0);
            marker.setOpacity(0.5);
          }
        });
    });
  }

  addMarker(suggestion, self) {
    var marker = L.marker(suggestion.latlng, { opacity: .4 });
    marker.addTo(self.map);
    self.markers.push(marker);
  }

  removeMarker(marker, self) {
    self.map?.removeLayer(marker);
  }

  findBestZoom(self) {
    var featureGroup = L.featureGroup(self.markers);
    self.map?.fitBounds(featureGroup.getBounds().pad(0.5), { animate: false });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.type && this.instance) {
      this.instance.configure({
        type: changes.type.currentValue,
      });
    }
  }

  ngOnDestroy() {
    this.instance.removeAllListeners('change');
    this.instance.removeAllListeners('clear');
    this.instance.destroy();
  }
}
