import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ItemCategoryFilter } from 'src/app/filter/item-category-filter';
import { ItemViewFilter } from 'src/app/filter/item-view-filter';
import { InitialInventoryStockModel } from 'src/app/model/initial-inventory-stock-model';
import { ItemCategoryModel } from 'src/app/model/item-category-model';
import { ItemModel } from 'src/app/model/item-model';
import { ItemCategoryService } from '../../services/item-category/item-category.service';
import { ItemService } from '../../services/item/item.service';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-item-add',
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.scss']
})
export class ItemAddComponent implements OnInit {

  @Input()
  id!: number;

  itemModel: ItemModel = new ItemModel;
  initialInventoryStockModel: InitialInventoryStockModel = new InitialInventoryStockModel;
  itemCategoryFilter: ItemCategoryFilter = new ItemCategoryFilter;
  filter: ItemViewFilter = new ItemViewFilter();
  categories : Array<ItemCategoryModel> = [];
  buttonClicked: boolean = false;
  myimage!: Observable<any>;
  createAnother: boolean = false;

  constructor(
    private itemCategoryService: ItemCategoryService,
    private itemService: ItemService,
    private toastr: ToastrService,
    public activeModal : NgbActiveModal) { }

  ngOnInit(): void {
    this.getCategory(0);
    if(this.id) {
      this.getItem(this.id);
    }
  }

  getCategory(page?: any) : void {
    this.itemCategoryFilter.pageable.page = page ? page : 1;
    this.itemCategoryFilter.pageable.size = 10000;
    this.itemCategoryService.getPagedResponseByFilter(this.itemCategoryFilter).subscribe((response) => {
      this.categories = response.content;
    })
  }

  getItem(id: number) {
    this.itemService.findOne(id).subscribe({
      next: (response) => {
        this.itemModel = response;
      },
      error: (error) => {
        this.toastr.error(error.error.errors.join(' '));
      },
    });
  }

  createItem(){
    if(this.itemModel.costPrice < 0 || this.itemModel.price < 0){
      this.toastr.error('Please enter valid price.')
      return;
    }
    if(this.itemModel.costPrice > this.itemModel.price){
      this.toastr.error('Cost price cannot be greater than selling price.')
      return
    }
    this.buttonClicked = true;
    this.itemService.create(this.itemModel).subscribe({
      next : (response) => {
        this.itemModel = response;
        this.toastr.success('A new item has been created successfully.', 'Successful')
        if(this.createAnother) {
          this.activeModal.close("CREATE_ANOTHER");
        } else {
          this.activeModal.close('SUCCESSFUL');
        }
        this.buttonClicked = false;
      },
      error: (error) => {
        this.toastr.error(error.error.errors.join(' '));
        this.buttonClicked = false;
      }
    })
  }

  editItem(id: number) {
    if(this.itemModel.costPrice < 0 || this.itemModel.price < 0){
      this.toastr.error('Please enter valid price.')
      return
    }
    if(this.itemModel.costPrice > this.itemModel.price){
      this.toastr.error('Cost price cannot be greater than selling price.')
      return
    }
    this.buttonClicked = true;
    this.itemService.update(id, this.itemModel).subscribe({
      next : (response) => {
        this.itemModel = response;
        this.toastr.success('Item has been updated successfully.', 'Successful')
        if(this.createAnother) {
          this.activeModal.close("CREATE_ANOTHER");
        } else {
        this.activeModal.close('SUCCESSFUL');
        }
        this.buttonClicked = false;
      },
      error: (error) => {
        this.toastr.error(error.error.errors.join(' '));
        this.buttonClicked = false;
      }
    })
  }

  onChange(event: Event) {
    const target= event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber: Subscriber<any>) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((d) => {
      this.myimage = d;
      var base64result = d.split(',')[1];
      this.itemModel.image = base64result;
    });
  }

  readFile(file: File, subscriber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };
    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  save() {
    if(this.id) {
      this.editItem(this.id);
    } else {
      this.createItem();
    }
  }

}
