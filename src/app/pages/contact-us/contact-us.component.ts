import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactUsService } from 'src/app/services/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  
  contactForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, 
    private contactUsService: ContactUsService,
    private snackBar: MatSnackBar,
    private router: Router) {}

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactUsService.submitContactForm(this.contactForm.value).subscribe({
        next: (response) => {
          this.showMessage(response.message);
          this.contactForm.reset();  // Optional: clear form after submission
          this.router.navigate(['/thank-you']);
        },
        error: (error) => {
          this.showMessage(error.error?.errorMessage || "Something went wrong.");
        }
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "OK", {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
