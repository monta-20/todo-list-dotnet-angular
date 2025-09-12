import { Component, OnInit } from '@angular/core';
import { ConfirmService } from '../../core/services/Confirm/confirm.service';
import { ConfirmData } from '../../models/ConfirmData';

@Component({
  selector: 'app-confirm-container-component',
  standalone: false,
  templateUrl: './confirm-container-component.html',
  styleUrl: './confirm-container-component.css'
})
export class ConfirmContainerComponent implements OnInit {
  data: ConfirmData | null = null;

  constructor(private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.confirmService.confirmState$.subscribe(d => this.data = d);
  }

  onConfirm(result: boolean) {
    this.confirmService.resolve(result);
  }
}
