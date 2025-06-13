import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {FirstView10ApiService} from '../api/first-view10-api.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  apiResponse: any = null;
  error: string | null = null;

  constructor(private api: FirstView10ApiService) {}

  testStudentTrips(): void {
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.api.getStudentTrips(currentDate).subscribe({
      next: (res: any) => {
        this.apiResponse = res;
        this.error = null;
      },
      error: (err: any) => {
        this.apiResponse = null;
        this.error = err.message || 'Error fetching student trips';
      }
    });
  }

  testLiveVehicleLocations(): void {
    const currentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.api.getStudentTrips(currentDate).subscribe({
      next: (res: any) => {
        const trips = res?.items || [];
        const vehicleIds = trips
          .filter((trip: any) => trip.status === 'LIVE')
          .map((trip: any) => trip.vehicleId)
          .filter((id: any) => !!id)
          .filter((value: any, index: number, self: any[]) => self.indexOf(value) === index)
          .join(',');
        if (vehicleIds) {
          this.api.getRecentLocation(vehicleIds).subscribe({
            next: (locations: any) => {
              this.apiResponse = locations;
              this.error = null;
            },
            error: (err: any) => {
              this.apiResponse = null;
              this.error = err.message || 'Error fetching recent locations';
            }
          });
        } else {
          this.apiResponse = [];
          this.error = 'No LIVE vehicles found';
        }
      },
      error: (err: any) => {
        this.apiResponse = null;
        this.error = err.message || 'Error fetching student trips';
      }
    });
  }

  testRecentLocationsManual(vehicleIds: string): void {
    this.api.getRecentLocation(vehicleIds).subscribe({
      next: (res: any) => {
        this.apiResponse = res;
        this.error = null;
      },
      error: (err: any) => {
        this.apiResponse = null;
        this.error = err.message || 'Error fetching recent locations';
      }
    });
  }

  clearResponse(): void {
    this.apiResponse = null;
    this.error = null;
  }
}
