import { Component, OnInit } from '@angular/core';
import { PagedResponse } from 'src/app/common/model/paged-response';
import { LedgerFilter } from 'src/app/filter/ledger-filter';
import { LedgerModel } from 'src/app/model/ledger-model';
import { LedgersService } from '../../services/ledgers/ledgers.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LedgersAddComponent } from '../ledgers-add/ledgers-add.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';
import { CategoryFilter } from 'src/app/filter/category-filter';
import { CustomerCategoryModel } from 'src/app/model/customer-category-model';
import { LedgersAdjustComponent } from '../ledgers-adjust/ledgers-adjust.component';
import { Router } from '@angular/router';
import { LedgersAssignComponent } from '../ledgers-assign/ledgers-assign.component';
import { CustomerCategoryService } from '../../services/customer-category/customer-category.service';
import { CommonDataService } from 'src/app/common/common-data.service';

@Component({
  selector: 'app-ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss'],
})
export class LedgersComponent implements OnInit {
  ledgerResponse: PagedResponse<LedgerModel> = new PagedResponse<LedgerModel>();
  filter: LedgerFilter = new LedgerFilter();
  loadingLedgers: boolean = true;
  modelChanged: Subject<string> = new Subject<string>();
  categoryFilter: CategoryFilter = new CategoryFilter();
  category: Array<CustomerCategoryModel> = [];
  userPermissions !: Array<any>;

  constructor(
    private ledgerService: LedgersService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private customerCategoryService: CustomerCategoryService,
    private commonDataService: CommonDataService,
    private router: Router
  ) {
    config.backdrop = true;
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.modelChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((model) => this.getLedgers(0));
    this.commonDataService.permissions.subscribe((response) => {
      this.userPermissions = response;
      if (response)
        this.getLedgers(0);
      this.getCategory(0);
    })
  }
  getLedgers(page?: any): void {
    this.loadingLedgers = true;
    this.filter.pageable.sort = "id,desc";
    this.filter.pageable.page = page ? page : 1;
    this.ledgerService
      .getPagedResponseByFilter(this.filter)
      .subscribe((response) => {
        this.loadingLedgers = false;
        this.ledgerResponse = response;
      });
  }
  getCategory(page?: any): void {
    this.categoryFilter.pageable.page = page ? page : 1;
    this.categoryFilter.pageable.size = 10000
    this.customerCategoryService.getPagedResponseByFilter(this.categoryFilter).subscribe((response) => {
      this.category = response.content;
    })
  }
  addLedgers() {
    const modalRef = this.modalService.open(LedgersAddComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.type = 'add';
    modalRef.result.then((Response) => {
      if (Response == 'SUCCESSFUL') {
        this.getLedgers();
      } else {
        modalRef.dismiss('CROSS_CLICK');
      }
    },
      (reason) => {
        modalRef.dismiss('CROSS_CLICK');
      });
  }
  editLedgers(id: number) {
    const modalRef = this.modalService.open(LedgersAddComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((Response) => {
      if (Response == 'SUCCESSFUL') {
        this.getLedgers();
      } else {
        modalRef.dismiss('CROSS_CLICK');
      }
    },
      (reason) => {
        modalRef.dismiss('CROSS_CLICK');
      });
  }
  adjustLedgers(id: number) {
    const modalRef = this.modalService.open(LedgersAdjustComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((Response) => {
      if (Response == 'SUCCESSFUL') {
        this.getLedgers(0);
      } else {
        modalRef.dismiss('CROSS_CLICK');
      }
    },
      (reason) => {
        modalRef.dismiss('CROSS_CLICK');
      });
  }

  viewLedger(customerId: number) {
    this.router.navigate(['/main/ledgers-view/' + customerId])
  }

  assignLedgers() {
    const modalRef = this.modalService.open(LedgersAssignComponent, {
      size: 'lg',
    })
  }

  debounceEvent(text: string) {
    this.modelChanged.next(text);
  }

}