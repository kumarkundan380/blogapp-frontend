import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {

  categoryId!: number;
  category!: Category
  updateCategoryForm!: FormGroup;
  constructor(private activateRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router){ }
  

  ngOnInit(): void {
    this.categoryId = this.activateRoute.snapshot.params['categoryId'];
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (data) => {
        this.category = data.body;
        this.updateCategoryForm.patchValue({
          categoryTitle:this.category.categoryTitle,
          categoryDescription:this.category.categoryDescription
        });
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
    this.updateCategoryForm = this.formBuilder.group({
      categoryId: new FormControl(),
	    categoryTitle: new FormControl('', Validators.required),
	    categoryDescription: new FormControl('', Validators.required)
    });
  }

  onSubmit(){
    this.category = {
      categoryId:this.updateCategoryForm.get('categoryId')?.value,
      categoryTitle:this.updateCategoryForm.get('categoryTitle')?.value,
      categoryDescription:this.updateCategoryForm.get('categoryDescription')?.value,
    }
    this.updateCategory(this.category,this.categoryId);
  }  

  updateCategory(category:Category, categoryId:number) {
    this.categoryService.updateCategory(category,categoryId).subscribe({
      next: (data) => {
        this._snackBar.open(data.message, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
        this.updateCategoryForm.reset();
        this.router.navigate([`/admin/categories`]);
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
