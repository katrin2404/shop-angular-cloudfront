import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from './order.interface';
import { ApiService } from '../../core/api.service';

@Injectable()
export class OrdersService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  getOrders(): Observable<Order[]> {
    return of([]);
  }
}
