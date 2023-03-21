import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonDataService } from 'src/app/common/common-data.service';
import { PagedResponse } from 'src/app/common/model/paged-response';
import { CustomerCategoryFilter } from 'src/app/filter/customer-category-filter';
import { CustomerCategoryModel } from 'src/app/model/customer-category-model';
import { DomainCategoryModel } from 'src/app/model/domain-category-model';
import { CustomerCategoryService } from '../../services/customer-category/customer-category.service';
import { DomainCategoryService } from '../../services/domainCategory/domain-category.service';
import { CustomerCategoryAddComponent } from '../customer-category-add/customer-category-add.component';



@Component({
  selector: 'app-customer-category',
  templateUrl: './customer-category.component.html',
  styleUrls: ['./customer-category.component.scss']
})
export class CustomerCategoryComponent implements OnInit {

  customerCategoryResponse: PagedResponse<CustomerCategoryModel> = new PagedResponse<CustomerCategoryModel>();
  domainCategoryResponse: PagedResponse<DomainCategoryModel> = new PagedResponse<DomainCategoryModel>();
  customerCategoryModel: CustomerCategoryModel = new CustomerCategoryModel();
  domainCategoryModel: DomainCategoryModel = new DomainCategoryModel();
  filter: CustomerCategoryFilter = new CustomerCategoryFilter();
  loadingCustomerCategory: boolean = true;
  modelChanged: Subject<string> = new Subject<string>();
  buttonClicked: boolean = false;
  domainCategory: Array<DomainCategoryModel> = [];
  customerCategoryFilter: CustomerCategoryFilter = new CustomerCategoryFilter();
  bool!: boolean;
  userPermissions !: Array<any>;

  constructor(
    private toastr: ToastrService,
    private customerCategoryService: CustomerCategoryService,
    private domainCategoryService: DomainCategoryService,
    private modalService: NgbModal,
    private commonDataService: CommonDataService,
  ) { }

  ngOnInit(): void {
    this.bool=false;
    this.modelChanged
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((model) => this.getCustomerCategory(0));
      this.commonDataService.permissions.subscribe((response) => {
        this.userPermissions = response;
        if(response)
          this.getCustomerCategory(0);
      })
  }

  getCustomerCategory(page?: any): void {
    this.loadingCustomerCategory = true;
    this.filter.pageable.page = page ? page : 1;
    this.customerCategoryService.getPagedResponseByFilter(this.filter).subscribe((response) => {
      this.customerCategoryResponse = response;
      this.loadingCustomerCategory = false;
    })
  }

  getDomainCategory(page?: any): void {
    this.customerCategoryFilter.pageable.page = page ? page : 1;
    this.customerCategoryFilter.pageable.size = 10000;
    this.domainCategoryService
      .getPagedResponseByFilter(this.customerCategoryFilter)
      .subscribe((response) => {
        response.content = response as any;
        this.domainCategoryResponse = response;
      });
  }

  addCustomerCategory() {
    const modalRef = this.modalService.open(CustomerCategoryAddComponent,
      {
        size: 'lg',
      });
    modalRef.componentInstance.type = 'add';
    modalRef.result.then((Response) => {
      if (Response == 'SUCCESSFUL') {
        this.getCustomerCategory();
      } else {
        modalRef.dismiss('CROSS_CLICK');
      }
    },
    (reason) => {
      modalRef.dismiss('CROSS_CLICK');
    });
  }

  editCustomerCategory(customerCategoryModel: CustomerCategoryModel) {
    if(this.bool){
      this.toastr.warning('Please edit or close previously selected.')
    }
    if(this.bool == false){
      customerCategoryModel.editable = true;
      this.bool = true;
    }
     this.getDomainCategory(0);
  }

  updateCustomerCategory(customerCategoryModel: CustomerCategoryModel) {
    this.customerCategoryService.update(customerCategoryModel.id, customerCategoryModel).subscribe({
      next: (response) => { 
        this.toastr.success('Customer Category updated sucessfully.', 'Successfully');
         this.getCustomerCategory();
         this.bool=false;
         customerCategoryModel.editable = false;
         this.buttonClicked = false;
      },
      error: (error) => {
        this.toastr.error(error.error.errors.join(' '));
        this.getCustomerCategory();
        this.bool=false;
        customerCategoryModel.editable = false;
        this.buttonClicked = false;
      }
    });
  }

  close(customerCategoryModel: CustomerCategoryModel) {
    customerCategoryModel.editable = false;
    this.bool=false;
    this.getCustomerCategory(0);
  }

  // deleteCustomerCategory(CustomerCategoryId: number) {
  //   this.buttonClicked = true;
  //   this.customerCategoryService.delete(CustomerCategoryId).subscribe({
  //     next: (response) => {
  //       this.toastr.success('Customer Category deleted sucessfully.', 'Successfuly');
  //       this.getCustomerCategory();
  //       this.buttonClicked = false;
  //     },
  //     error: (error) => {
  //       this.toastr.error(error.error.errors.join(' '));
  //       this.buttonClicked = false;
  //     }
  //   });
  // }

  debounceEvent(text: string) {
    this.modelChanged.next(text);
  }

}
