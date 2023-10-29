import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

  addCategoryForm!: FormGroup;
  category!: Category;

  constructor(private categoryService : CategoryService, 
    private router: Router,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar){
  }

  ngOnInit(): void {
    this.addCategoryForm = this.formBuilder.group({
      categoryTitle: new FormControl('',Validators.required),
	    categoryDescription: new FormControl('', Validators.required),
    });
  }

  onSubmit(){
    this.category = {
      categoryTitle:this.addCategoryForm.get('categoryTitle')?.value,
      categoryDescription:this.addCategoryForm.get('categoryDescription')?.value,
    }
    this.addCategory(this.category);
  }

  addCategory(category:Category){
    this.categoryService.addCategory(category).subscribe({
      next: (data) => {
          this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.addCategoryForm.reset();
        this.router.navigate([`admin/categories`]);
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    });
  }


}
