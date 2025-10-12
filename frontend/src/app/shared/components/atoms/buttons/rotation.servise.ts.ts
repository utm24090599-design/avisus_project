import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RotationServiseTs {
  private rotationToggleSource = new Subject<void>();

  rotationToggled$ = this.rotationToggleSource.asObservable();

  toggleRotation(): void{
    this.rotationToggleSource.next();
  }
}
