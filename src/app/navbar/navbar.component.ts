import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {debounceTime, distinctUntilChanged, startWith, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {PopupComponent} from "../popup/popup.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() popups:boolean = false;
  @Input() yesNo:boolean = false;
  @Input() searchbar:boolean = true;
  @Input() header:string = 'Warning';
  @Input() content:string = 'Do you really want to continue?';

  constructor(private keycloakService: KeycloakService, private modalService: NgbModal, private router: Router,) {
  }
  @Output() searchChange = new EventEmitter<string>();
  searchControl = new FormControl();

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(100),
        distinctUntilChanged(),
      ).subscribe(search => this.searchChange.emit(search))
  }

  logout(): void {
    this.keycloakService.logout('http://localhost:4200/').then();
  }

  openPopup(destination:string) {
    if (!this.popups) {
      this.router.navigate([destination]).then(() => window.location.reload());
    } else {
      let ngbModalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false
      };
      const modalRef = this.modalService.open(PopupComponent, ngbModalOptions);
      modalRef.componentInstance.header = this.header;
      modalRef.componentInstance.content = this.content;
      modalRef.componentInstance.decision = this.yesNo;
      modalRef.result.then((r) => {
        if (r == true) {
          this.router.navigate([destination]).then(() => window.location.reload());
        }
        console.log(r);
      });
    }
  }
}
