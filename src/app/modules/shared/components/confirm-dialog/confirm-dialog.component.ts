import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { DialogService } from '@ngneat/dialog';
import { Subscription } from 'rxjs';
import { ConfirmModalConfig } from 'src/app/models';
import { StringService } from '../../services/string.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() public onClickAccept: EventEmitter<void> = new EventEmitter();
  @Output() public onClickCancel: EventEmitter<void> = new EventEmitter();
  @Input() public config: ConfirmModalConfig;

  @ViewChild('confirmrModalTemplate', { read: TemplateRef })
  confirmrModalTemplate: TemplateRef<any>;

  private dialogBackdropClick$: Subscription;

  constructor(public stringSrv: StringService, private dialog: DialogService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dialog.open(this.confirmrModalTemplate, { closeButton: false });
    this.dialogBackdropClick$ = this.dialog.dialogs[0].backdropClick$.subscribe(() => this.onClickCancel.emit());
  }
  ngOnDestroy(): void {
    this.dialogBackdropClick$.unsubscribe();
  }

  public onClicktBtn(cancel: boolean = false): void {
    this.dialog.dialogs[0].close();
    cancel ? this.onClickCancel.emit() : this.onClickAccept.emit();
  }
}
