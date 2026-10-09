import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.component.html',
  styleUrl: './edit-trip.component.css',
})
export class EditTripComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;
  tripCode = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tripDataService: TripDataService,
  ) {}

  ngOnInit(): void {
    this.editForm = this.formBuilder.group({
      _id: [''],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripCode = this.route.snapshot.paramMap.get('tripCode') || '';

    console.log('Editing trip:', this.tripCode);

    this.tripDataService.getTrip(this.tripCode).subscribe({
      next: (value: Trip[]) => {
        if (!value || value.length === 0) {
          console.log('No trip found');
          return;
        }

        const trip = value[0];

        this.editForm.patchValue({
          _id: trip._id,
          code: trip.code,
          name: trip.name,
          length: trip.length,
          start: trip.start ? trip.start.substring(0, 10) : '',
          resort: trip.resort,
          perPerson: trip.perPerson,
          image: trip.image,
          description: trip.description,
        });
      },

      error: (error: any) => {
        console.log('Error loading trip:', error);
      },
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.invalid) {
      return;
    }

    this.tripDataService
      .updateTrip(this.tripCode, this.editForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },

        error: (error: any) => {
          console.log('Error updating trip:', error);
        },
      });
  }

  public cancel(): void {
    this.router.navigate(['']);
  }

  get f() {
    return this.editForm.controls;
  }
}
