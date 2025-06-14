import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { StudentTrips, RecentLocation } from '../../../api/first-view10-models';
import { environmentSecret } from '../../../environments/environment.secret';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnChanges, AfterViewInit {
  @Input() trips: StudentTrips | null = null;
  @Input() locations: RecentLocation[] | null = [];
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  private map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];
  private mapLoaded = false;

  ngAfterViewInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initMap();
      this.mapLoaded = true;
      this.updateMarkers();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.mapLoaded) {
      this.updateMarkers();
    }
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environmentSecret.GOOGLE_MAP_API_KEY;
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  private initMap() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: { lat: 39.8283, lng: -98.5795 },
      zoom: 4,
      mapTypeId: 'roadmap',
      zoomControl: true,
      mapTypeControl: false
    });
  }

  private updateMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    const markerPositions: { lat: number, lng: number, label?: string, heading?: number, isVehicle?: boolean }[] = [];

    if (this.locations && this.locations.length > 0) {
      this.locations.forEach(loc => {
        if (loc.latitude && loc.longitude) {
          markerPositions.push({
            lat: loc.latitude,
            lng: loc.longitude,
            label: loc.vehicleId ? `${loc.vehicleId}` : undefined,
            heading: loc.heading,
            isVehicle: true
          });
        }
      });
    }

    if (this.trips && Array.isArray(this.trips.items)) {
      this.trips.items.forEach(trip => {
        if (trip.runs && Array.isArray(trip.runs)) {
          trip.runs.forEach(run => {
            if (run.stops && Array.isArray(run.stops)) {
              run.stops.forEach(stop => {
                if (stop.latitude && stop.longitude) {
                  markerPositions.push({
                    lat: stop.latitude,
                    lng: stop.longitude,
                    label: stop.addressName ? stop.addressName : undefined,
                    isVehicle: false
                  });
                }
              });
            }
          });
        }
      });
    }

    this.mockData(markerPositions);

    markerPositions.forEach(pos => {
      const marker = new google.maps.Marker({
        position: { lat: pos.lat, lng: pos.lng },
        map: this.map,
        icon: pos.isVehicle
          ? {
              url: '/assets/bus.png',
              scaledSize: new google.maps.Size(48, 48),
              anchor: new google.maps.Point(24, 24),
              rotation: pos.heading || 0
            }
          : undefined,
        label: pos.label
      });
      this.markers.push(marker);
    });

    this.addHomeMarker();
    this.adjustZoom();
  }

  private addHomeMarker() {
    const homeEnv = environmentSecret.HOME;
    if (!homeEnv) {
      console.error("HOME environment variable is not set.");
      return;
    }

    const [lat, lng] = homeEnv.split(',').map(Number);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Invalid HOME environment variable format. Expected 'lat,lng'.");
      return;
    }

    const homeMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      title: "Home",
      icon:  {
              url: '/assets/house.png',
              scaledSize: new google.maps.Size(48, 48),
              anchor: new google.maps.Point(24, 24)
            }
    });

    this.markers.push(homeMarker);
  }

  private adjustZoom() {
    if (this.markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => bounds.extend(marker.getPosition()!));

      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const latDiff = Math.abs(northEast.lat() - southWest.lat());
      const lngDiff = Math.abs(northEast.lng() - southWest.lng());

      const minLatDiff = 0.01;
      const minLngDiff = 0.01;

      if (latDiff < minLatDiff || lngDiff < minLngDiff) {
        const expandLat = (minLatDiff - latDiff) / 2;
        const expandLng = (minLngDiff - lngDiff) / 2;

        bounds.extend({
          lat: northEast.lat() + expandLat,
          lng: northEast.lng() + expandLng
        });
        bounds.extend({
          lat: southWest.lat() - expandLat,
          lng: southWest.lng() - expandLng
        });
      }

      this.map.fitBounds(bounds);
    }
  }

  mockData(markerPositions: { lat: number, lng: number, label?: string, isVehicle?: boolean }[]) {
    if ((!this.locations || this.locations.length === 0) && markerPositions.length > 0) {
      const first = markerPositions[0];
      markerPositions.push({
        lat: first.lat - 0.01,
        lng: first.lng - 0.01,
        label: 'Fake',
        isVehicle: true
      });
    }
  }
}
