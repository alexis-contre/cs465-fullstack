import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { TripDataService } from '../services/trip-data.service';
import { AuthenticationService } from '../services/authentication.service';
@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css',
})
export class TripCardComponent implements OnInit {
  @Input('trip') trip: any;

  constructor(
    private router: Router,
    private tripDataService: TripDataService,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {}

  public editTrip(): void {
    this.router.navigate(['edit-trip', this.trip.code]);
  }

  public deleteTrip(): void {
    const confirmed = confirm(
      `Are you sure you want to delete ${this.trip.name}?`,
    );

    if (!confirmed) {
      return;
    }

    this.tripDataService.deleteTrip(this.trip.code).subscribe({
      next: () => {
        window.location.reload();
      },

      error: (error: any) => {
        console.log('Error deleting trip:', error);
      },
    });
  }
}
