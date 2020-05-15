import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { timer, Observable, throwError, interval, Subject } from 'rxjs';
import { takeUntil, startWith, pairwise } from 'rxjs/operators';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpClient } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  n: FormControl = new FormControl('', [Validators.required, Validators.min(2), Validators.max(4096)]);
  target: FormControl = new FormControl('', [Validators.required, this.isPowOfTwo]);
  hash: FormControl = new FormControl('', []);
  isRun: boolean = false;

  isClassicalRun: boolean = false;
  isQuantumLocalRun: boolean = false;
  isQuantumSimulatorRun: boolean = false;
  isQuantumRealRun: boolean = false;

  classicalTime: FormControl = new FormControl('', []);
  classicalResult: FormControl = new FormControl('', []);

  localTime: FormControl = new FormControl('', []);
  localResult: FormControl = new FormControl('', []);
  localMeasurements: FormControl = new FormControl('', []);

  simulatorTime: FormControl = new FormControl('', []);
  simulatorResult: FormControl = new FormControl('', []);
  simulatorMeasurements: FormControl = new FormControl('', []);

  realTime: FormControl = new FormControl('', []);
  realResult: FormControl = new FormControl('', []);
  realMeasurements: FormControl = new FormControl('', []);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.n.setValue(1024);
    this.hash.disable();
    this.classicalTime.disable()
    this.classicalResult.disable()
    this.localTime.disable()
    this.localResult.disable();
    this.localMeasurements.disable();
    this.simulatorTime.disable()
    this.simulatorResult.disable();
    this.simulatorMeasurements.disable();
    this.realTime.disable()
    this.realResult.disable();
    this.realMeasurements.disable();

    this.target
      .valueChanges
      .pipe(startWith(null), pairwise())
      .subscribe(([prev, next]: [number, number]) => {
        if (prev !== next && this.target.status === 'VALID') {
          var md5 = new Md5();
          md5.appendStr(next.toString());
          this.hash.setValue(md5.end());
        }
      });
  }

  isPowOfTwo(control: FormControl) {
    const isPow = (Math.log(control.value || 0) / Math.log(2)) % 1 === 0;
    return isPow ? null : { 'not_pow_of_two': true };
  }

  run() {
    console.log('Start experiment!');
    this.isRun = true;
    this.isClassicalRun = true;
    this.isQuantumLocalRun = true;
    this.isQuantumSimulatorRun = true;
    this.isQuantumRealRun = true;

    this.http.get<any>(`/api/solve?backend=classical&hash=${this.hash.value}&n=${this.n.value}`).subscribe(
      (data) => {
        this.isClassicalRun = false;
        if (data) {
          this.classicalTime.setValue(data.seconds);
          this.classicalResult.setValue(data.value);
        }
      }
    );
    this.http.get<any>(`/api/solve?backend=quantum_local&hash=${this.hash.value}&n=${this.n.value}`).subscribe(
      (data) => {
        this.isQuantumLocalRun = false;
        this.localTime.setValue(data.seconds);
        this.localResult.setValue(data.value.best_value);
        this.localMeasurements.setValue(data.value.measurements);
      }
    );
    this.http.get<any>(`/api/solve?backend=quantum_simulator&hash=${this.hash.value}&n=${this.n.value}`).subscribe(
      (data) => {
        this.isQuantumSimulatorRun = false;
        this.simulatorTime.setValue(data.seconds);
        this.simulatorResult.setValue(data.value.best_value);
        this.simulatorMeasurements.setValue(data.value.measurements);
      }
    );
    this.http.get<any>(`/api/solve?backend=quantum_real&hash=${this.hash.value}&n=${this.n.value}`).subscribe(
      (data) => {
        this.isQuantumRealRun = false;
        this.realTime.setValue(data.seconds);
        this.realResult.setValue(data.value.best_value);
        this.realMeasurements.setValue(data.value.measurements);
      }
    );
  }
}
