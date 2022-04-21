import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ms365statusEntity } from './entity/ms365status.entity';
import { Ms365statusService } from './service/ms365status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  results = new Array<Ms365statusEntity>();

  constructor(private ms365statusService: Ms365statusService) {}

  onSubmit(f: NgForm): void {
    const q = f.value['hostname'] as string;
    const atidx = q.lastIndexOf('@');
    const hostname = atidx > 0 ? q.substring(atidx + 1) : q;

    const result = this.ms365statusService.lookup(hostname);
    this.results.unshift(result);
  }
}
