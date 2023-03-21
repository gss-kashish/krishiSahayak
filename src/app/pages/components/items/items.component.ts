import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
  rows = [
    { farmerName: ['Ram Ji Swaroop'], location: 'Banswara', bpl: 'yes', contact: '9921119988', currentStatus: 'available' },
    { farmerName: ['Kisan Meena'], location: 'Rajsamand', bpl: 'no', contact: '9920019988', currentStatus: 'not available' },
    { farmerName: ['Shyam Kanwar'], location: 'Bheelwara', bpl: 'yes', contact: '9323119988', currentStatus: 'available' },
    { farmerName: ['Rajaram Kanwar'], location: 'Bheelwara', bpl: 'yes', contact: '9423119988', currentStatus: 'available' },
    { farmerName: ['Sunil Sahu'], location: 'Khejli', bpl: 'yes', contact: '9913119988', currentStatus: 'available' },
    { farmerName: ['Saroj Kanwar'], location: 'Baswara', bpl: 'yes', contact: '9923019988', currentStatus: 'available' },
    { farmerName: ['Ramswaroop Khattar'], location: 'Bheelwara', bpl: 'no', contact: '9123119988', currentStatus: 'not available' },
    { farmerName: ['Shyam Meena'], location: 'Dosa', bpl: 'yes', contact: '9923119988', currentStatus: 'not available' },
    { farmerName: ['Lalu Kumar'], location: 'Rajsamand', bpl: 'no', contact: '9923119988', currentStatus: 'not available' },
    { farmerName: ['Haswant Singh'], location: 'Fagi', bpl: 'yes', contact: '9923119988', currentStatus: 'available' },
    { farmerName: ['Kanihya Singh'], location: 'Bheelwara', bpl: 'no', contact: '9823119988', currentStatus: 'not available' },

  ];

  columns = [{ prop: 'farmerName' }, { prop: 'location' }, { prop: 'bpl' }, {prop: 'contact'}, {prop: 'currentStatus'}]

}
