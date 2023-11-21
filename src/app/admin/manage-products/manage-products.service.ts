import { Injectable, Injector } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

interface PreSignedURL {
  signedURL: string;
}

@Injectable()
export class ManageProductsService extends ApiService {
  constructor(injector: Injector) {
    super(injector);
  }

  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config'
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap(({ signedURL }) =>
        this.http.put(signedURL, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'text/csv',
          },
        })
      )
    );
  }

  private getPreSignedUrl(fileName: string): Observable<PreSignedURL> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const auth_token = localStorage.getItem('authorization_token');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Basic ${auth_token}`
    });
    const url = this.getUrl('import', 'import');

    return this.http.get<PreSignedURL>(url, {
      headers,
      params: {
        name: fileName,
      },
    });
  }
}
