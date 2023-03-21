import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CommonDataService } from 'src/app/common/common-data.service';
import { PagedResponse } from 'src/app/common/model/paged-response';
import { ItemCategoryFilter } from 'src/app/filter/item-category-filter';
import { ItemCategoryModel } from 'src/app/model/item-category-model';
import { ItemCategoryService } from '../../services/item-category/item-category.service';
import { ItemCategoryAddComponent } from '../item-category-add/item-category-add.component';

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category.component.html',
  styleUrls: ['./item-category.component.scss']
})
export class ItemCategoryComponent implements OnInit {

  itemCategoryResponse: PagedResponse<ItemCategoryModel> = new PagedResponse<ItemCategoryModel>();
  filter: ItemCategoryFilter = new ItemCategoryFilter();
  loadingItemCategory: boolean = true;
  modelChanged: Subject<string> = new Subject<string>();
  userPermissions !: Array<any>;

  constructor(
    private itemCategoryService: ItemCategoryService,
    private commonDataService: CommonDataService,

    config: NgbModalConfig,
    private modalService: NgbModal) 
    {
    config.backdrop = true;
    config.keyboard = false;
    this.modelChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(model => this.getItemCategory(0));
  }

  ngOnInit(): void {
    this.commonDataService.permissions.subscribe((response) => {
      this.userPermissions = response;
      if(response)
        this.getItemCategory(0);
    })
  }

  getItemCategory(page?: any): void {
    this.loadingItemCategory = true;
    this.filter.pageable.page = page ? page : 1;
    this.itemCategoryService.getPagedResponseByFilter(this.filter).subscribe((response) => {
      this.loadingItemCategory = false;
      this.itemCategoryResponse = response;
    })
  }

  debounceEvent(text: string) {
    this.modelChanged.next(text);
  }

  addItemCategory() {
    const modalRef = this.modalService.open(ItemCategoryAddComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.type = 'add';
    modalRef.result.then((Response) => {
      if (Response == 'SUCCESSFULL') {
        this.getItemCategory();
      } else {
        modalRef.dismiss('CROSS_CLICK');
      }
    },
    (reason) => {
      modalRef.dismiss('CROSS_CLICK');
    });
  }

  editItemCategory(id: number) {
    const modalRef = this.modalService.open(ItemCategoryAddComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((Response) => {
      if (Response == 'SUCCESSFULL') {
        this.getItemCategory();
      } else {
        modalRef.dismiss('CROSS_CLICK');
      }
    },
    (reason) => {
      modalRef.dismiss('CROSS_CLICK');
    });
  }
}
