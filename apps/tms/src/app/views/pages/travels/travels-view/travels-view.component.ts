import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TravelModel } from '@tms/models';
import * as L from 'leaflet';

@Component({
  selector: 'b404-travels-view',
  templateUrl: './travels-view.component.html',
  styleUrls: ['./travels-view.component.scss']
})
export class TravelsViewComponent implements OnInit, AfterViewInit {

  public travel: TravelModel;
  public map: L.Map;
  public markers: L.Marker<any>[] = [];
  @ViewChild('map') mapEl: ElementRef;
  constructor(
    private dialogRef: MatDialogRef<TravelsViewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { travel: TravelModel },
  ) { }

  ngOnInit() {
    this.travel = this.data.travel;
  }

  ngAfterViewInit() {
    this.map = L.map(this.mapEl.nativeElement, {
      scrollWheelZoom: false,
      zoomControl: false
    });
    const osmLayer = new L.TileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 1,
      maxZoom: 13,
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    this.map?.setView(new L.LatLng(0, 0), 1);
    this.map?.addLayer(osmLayer);
    this.markers.push(
      L.marker([this.travel.locations.origin.coordinates[1], this.travel.locations.origin.coordinates[0]]).addTo(this.map),
      L.marker([this.travel.locations.destination.coordinates[1], this.travel.locations.destination.coordinates[0]]).addTo(this.map),
    );
    this.findBestZoom();
  }

  close() {
    this.dialogRef.close();
  }

  findBestZoom() {
    const featureGroup = L.featureGroup(this.markers);
    this.map?.fitBounds(featureGroup.getBounds().pad(0.5), { animate: false });
  }

}
