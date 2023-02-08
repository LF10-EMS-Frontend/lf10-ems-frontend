import {Component, Input, NgZone, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  @Input() header:string = '';
  @Input() content:string = '';
  @Input() decision:boolean = false;


  constructor(public activeModal:NgbActiveModal, private ngZone:NgZone) {}

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }
}
