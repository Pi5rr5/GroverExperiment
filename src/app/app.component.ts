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

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.n.setValue(1024);
    this.hash.disable();

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

    this.http.get<any>('/api/api1').subscribe(
      (data) => {
        this.isClassicalRun = false;
        console.log(data);
      }
    );
    this.http.get<any>('/api/api2').subscribe(
      (data) => {
        this.isQuantumLocalRun = false;
        console.log(data);
      }
    );
    this.http.get<any>('/api/api3').subscribe(
      (data) => {
        this.isQuantumSimulatorRun = false;
        console.log(data);
      }
    );
    this.http.get<any>('/api/api4').subscribe(
      (data) => {
        this.isQuantumRealRun = false;
        console.log(data);
      }
    );
  }
}
