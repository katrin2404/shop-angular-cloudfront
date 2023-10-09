import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable, of } from 'rxjs';
import { Product, ProductsResponse } from './product.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products$ = this.productsService
    .getProducts()
    .pipe(map((result) => result.items));

  constructor(private readonly productsService: ProductsService) {}
}
