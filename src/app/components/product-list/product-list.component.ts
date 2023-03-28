import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName = "";
  serachMode: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(() => this.getListProducts());

  }

  getListProducts() {

    this.serachMode = this.route.snapshot.paramMap.has('keyword');
    // console.log(`searchMode=${this.serachMode}`);

    if (this.serachMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  private handleSearchProducts() {

    const theKeyWord: string = this.route.snapshot.paramMap.get('keyword')!;
    // console.log(`theKeyword=${theKeyWord}`);

    // Search for products using the keyword
    this.productService.SearchProducts(theKeyWord).subscribe(
      (data: Product[]) => {
        this.products = data;
      }
    );
  }

  private handleListProducts() {

    // Check if parameter 'id' is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    // Get the 'id' param which is a string, and convert it to a nummber, using the "+" symbol
    // Make use of the NON-NULL Assertion Operator "!"
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // Get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      // default to category id 1 and category name to 'Books'
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    // Get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(data => this.products = data);
  }
}