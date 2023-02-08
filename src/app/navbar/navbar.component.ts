import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {debounceTime, distinctUntilChanged, startWith} from "rxjs";
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
  @Input() header:string = 'Leave confirmation';
  @Input() content:string = 'Do you really want to leave the page?';

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
    this.yesNo = true;
    this.openPopup('Logout confirmation', 'Do you really want to logout?').then((r) => {
      if (r) {
        this.keycloakService.logout('http://localhost:4200/').then();
      }
    })
  }

  openCancelPopup(destination:string) {
    if (!this.popups) {
      this.router.navigate([destination]).then();
    } else {
      this.openPopup(this.header, this.content).then((r) => {
        if (r == true) {
          this.router.navigate([destination]).then();
        }
      });
    }
  }

  private openPopup(header:string, content:string) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    const modalRef = this.modalService.open(PopupComponent, ngbModalOptions);
    modalRef.componentInstance.header = header;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.decision = this.yesNo;
    return modalRef.result;
  }
}
