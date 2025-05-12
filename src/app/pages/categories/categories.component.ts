import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Category } from 'src/app/model/category';
import { CategoryService } from 'src/app/services/category.service';
import { DialogService } from 'src/app/services/dialog.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService : CategoryService, 
    private router: Router,
    private _snackBar: MatSnackBar,
    private dialogService: DialogService){
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.categoryService.getAllCategory().subscribe({
      next: (data) => {
        this.categories = data.body
      },
      error: (error) => {
        this._snackBar.open(error.error.errorMessage, "OK", {
          duration: 3000,
          verticalPosition: 'top'
        })
      }
    })
  }

  addCategory(): void {
    this.router.navigate([`/admin/add-category`]);
  }

  updateCategory(category: Category) {
    this.router.navigate([`/admin/update-category/${category.categoryId}`]);
  }

  deleteCategory(category: Category) {
    this.dialogService.openConfirmDialog('Are you sure you want to delete this category?')
    .afterClosed().subscribe((res:boolean) =>{
      if(res){
        this.categoryService.deleteCategory(category.categoryId!).subscribe({
          next: (data) => {
            this._snackBar.open(data.message, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
            this.getAllCategories();
          },
          error: (error) => {
            this._snackBar.open(error.error.errorMessage, "OK", {
              duration: 3000,
              verticalPosition: 'top'
            })
          }
        });
      }
    });
  }

}
