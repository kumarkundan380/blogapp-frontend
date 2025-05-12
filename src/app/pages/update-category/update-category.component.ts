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
  formChanged = false;


  constructor(private activateRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router){ }
  

  ngOnInit(): void {
    this.categoryId = this.activateRoute.snapshot.params['categoryId'];
    this.initializeForm();
    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (data) => {
        this.category = data.body;
        this.populateForm(data.body);
      },
      error: (error) => {
        this.showMessage(error.error?.errorMessage);
      }
    })
  }

  private initializeForm(): void {

    this.updateCategoryForm = this.formBuilder.group({
	    categoryTitle: new FormControl('', Validators.required),
	    categoryDescription: new FormControl('', Validators.required)
    });
  }

  // Populate form fields with user data
  private populateForm(category: Category): void {
    
    if (!category) return;

  //  this.updateCategoryForm.patchValue(adress);
    this.updateCategoryForm.patchValue({
      categoryTitle:this.category.categoryTitle,
      categoryDescription:this.category.categoryDescription
    });

    this.updateCategoryForm.valueChanges.subscribe(() => {
      this.formChanged = !this.isFormUnchanged();
    });
  }

  private isFormUnchanged(): boolean {
    
    const formValue = this.updateCategoryForm.value;
  
    const trim = (val: any) => typeof val === 'string' ? val.trim() : val;
  
    const updatedCategory: Partial<Category> = {
      categoryTitle: trim(formValue.categoryTitle),
      categoryDescription: trim(formValue.categoryDescription)
    };
  
    const originalCategory = {
      categoryTitle: this.category.categoryTitle,
      categoryDescription: this.category.categoryDescription
    };
  
    // Compare JSON stringified versions
    return JSON.stringify(updatedCategory) === JSON.stringify(originalCategory);
  }

  resetForm(): void {
    
    if (!this.category) return;
  
    this.updateCategoryForm.patchValue({
      categoryTitle: this.category.categoryTitle,
      categoryDescription: this.category.categoryDescription
    });
    this.updateCategoryForm.markAsPristine();
    this.updateCategoryForm.markAsUntouched();
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
        this.showMessage(data.message);
        this.updateCategoryForm.reset();
        this.router.navigate([`/admin/categories`]);
      },
      error: (error) => {
        this.showMessage(error.error?.errorMessage);
      }
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }


}
