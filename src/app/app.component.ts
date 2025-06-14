import { Component, OnDestroy } from '@angular/core';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FirstView10ApiService } from '../api/first-view10-api.service';
import { MapComponent } from './components/map/map.component';
import { RecentLocation, StudentTrips } from '../api/first-view10-models';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HttpClientModule, MapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  tripsResponse: StudentTrips | null = null;
  locationsResponse: RecentLocation[] | null = null;
  error: string | null = null;
  showResponse = false;
  isLoading = false; 
  isAutoApiCallEnabled = false; 
  private autoApiCallInterval: any = null; // interval ID from setInterval
  private lastApiCallTime: number | null = null;

  constructor(private api: FirstView10ApiService) {}

  testLiveVehicleLocations(): void {
    if (!this.canCallApi()) {
      return;
    }

    this.isLoading = true; 
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.api.getStudentTrips(currentDate).subscribe({
      next: (res: StudentTrips) => {
        this.tripsResponse = res;
        const trips = res?.items || [];
        const vehicleIds = trips
          .filter(trip => trip.status === 'LIVE')
          .map(trip => trip.vehicleId)
          .filter(id => !!id)
          .filter((value, index, self) => self.indexOf(value) === index)
          .join(',');
        if (vehicleIds) {
          this.api.getRecentLocation(vehicleIds).subscribe({
            next: (locations: RecentLocation[]) => {
              this.locationsResponse = locations;
              this.error = null;
              this.isLoading = false; 
            },
            error: (err: any) => {
              this.locationsResponse = null;
              this.error = err.message || 'Error fetching recent locations';
              this.isLoading = false; 
            }
          });
        } else {
          this.locationsResponse = [];
          this.error = 'No LIVE vehicles found';
          this.isLoading = false; 
        }
      },
      error: (err: any) => {
        this.tripsResponse = null;
        this.locationsResponse = null;
        this.error = err.message || 'Error fetching student trips';
        this.isLoading = false; 
      }
    });
  }

  toggleAutoApiCall(): void {
    if (this.isAutoApiCallEnabled) {
      clearInterval(this.autoApiCallInterval);
      this.autoApiCallInterval = null;
      this.isAutoApiCallEnabled = false;
    } else {
      this.isAutoApiCallEnabled = true;
      this.autoApiCallInterval = setInterval(() => {
        this.testLiveVehicleLocations();
      }, 15000);

      this.testLiveVehicleLocations();
    }
  }

  private canCallApi(): boolean {
    const now = Date.now();
    if (this.lastApiCallTime && now - this.lastApiCallTime < 10000) {
      this.error = 'API call throttled...';
      return false;
    }
    this.lastApiCallTime = now;
    this.error = null;
    return true;
  }

  clearResponse(): void {
    this.tripsResponse = null;
    this.locationsResponse = null;
    this.error = null;
  }

  toggleResponse(): void {
    this.showResponse = !this.showResponse;
  }

  ngOnDestroy(): void {
    if (this.autoApiCallInterval) {
      clearInterval(this.autoApiCallInterval);
    }
  }
}
