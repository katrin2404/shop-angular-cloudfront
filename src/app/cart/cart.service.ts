import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { Product, ProductsResponse } from '../products/product.interface';
import { CartResponse } from './cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService extends ApiService {
  #cartSource = new BehaviorSubject<Record<string, number>>({});
  // eslint-disable-next-line @typescript-eslint/member-ordering
  cart$ = this.#cartSource.asObservable();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  totalInCart$: Observable<number> = this.cart$.pipe(
    map((cart) => {
      const values = Object.values(cart);

      if (!values.length) {
        return 0;
      }

      return values.reduce((acc, val) => acc + val, 0);
    }),
    shareReplay({
      refCount: true,
      bufferSize: 1,
    })
  );

  constructor(injector: Injector) {
    super(injector);
  }

  getCart(): Observable<CartResponse> {
    if (!this.endpointEnabled('cart')) {
      console.warn(
        'Endpoint "cart" is disabled. To enable change your environment.ts config'
      );
      return of({} as CartResponse);
    }

    const userId = '9fa24c5b-8145-4f5e-94e6-727c690e4a51';
    const url = this.getUrl('cart', `api/profile/cart?userId=${userId}`);
    return this.http.get<CartResponse>(url);
  }

  addItem(id: string): void {
    this.updateCount(id, 1);
  }

  removeItem(id: string): void {
    this.updateCount(id, -1);
  }

  empty(): void {
    this.#cartSource.next({});
  }

  private updateCount(id: string, type: 1 | -1): void {
    const val = this.#cartSource.getValue();
    const newVal = {
      ...val,
    };

    if (!(id in newVal)) {
      newVal[id] = 0;
    }

    if (type === 1) {
      newVal[id] = ++newVal[id];
      this.#cartSource.next(newVal);
      return;
    }

    if (newVal[id] === 0) {
      console.warn('No match. Skipping...');
      return;
    }

    newVal[id]--;

    if (!newVal[id]) {
      delete newVal[id];
    }

    this.#cartSource.next(newVal);
  }
}
