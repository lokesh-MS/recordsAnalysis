import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DbserviceService } from 'src/app/service/dbservice.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css']
})
export class FilterMenuComponent {
  dropdownList:any= { Suplier_Name: [], Importer_Name: [] };
  selectedItems: any = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 0,
    allowSearchFilter: true
  };

  constructor(private service: DbserviceService, private http: HttpClient) {}
  isrecordsCount:boolean=false;
  recordsCount:number=0;
  ngOnInit(): void {
    this.getDropdownData();
  }
  arrayofselectedItem:any=[];
  // onSuplierSelect(item: any): void {
    
  //   this.fetchDropdownData(item, 'Suplier_Name');
  // }

  // onItemSelect(item: any): void {
  //   this.fetchDropdownData(item, 'Item_Description');
  // }

  // onImporterSelect(item: any): void {
  //   this.fetchDropdownData(item, 'Importer_Name');
  // }






  fetchDropdownData(item: any, searchType: string): void {
   debugger
    // this.arrayofselectedItem.push(item);
    let params = new HttpParams();
    item.forEach((item:any) => {
      params = params.append('searchTerms', item);
    });
    // const params = new HttpParams().append('searchTerms', item);
    this.http.get(`https://localhost:7022/api/StringSearch/${searchType}`, { params })
      .subscribe({
        next:(res:any)=>{

          // console.log(res);
          this.recordsCount=res.length;
          // console.log( this.recordsCount);
       
          this.isrecordsCount=true;
          if (searchType === 'Suplier_Name') {
            this.selectedItems = []; // Reset selected items if it's Supplier Name dropdown
          }
   
          // Update dropdown list based on search type
          switch (searchType) {
            case 'Suplier_Name':
             
              // this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.supplier_Name.toString())));
              this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.importer_Name.toString())));
              this.dropdownList.Item_Description = Array.from(new Set(res.map((obj: any) => obj.item_Description.toString())));
              let itemuniqueArray = [...new Set(this.dropdownList.Item_Description)];
              this.dropdownList.Item_Description=itemuniqueArray;
              // console.log(  this.dropdownList.Item_Description);
              
              break;
            case 'Importer_Name':
              // this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.importer_Name.toString())));
             // this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.supplier_Name.toString())));
              this.dropdownList.Item_Description = Array.from(new Set(res.map((obj: any) => obj.item_Description.toString())));
              let ItemuniqueArray = [...new Set(this.dropdownList.Item_Description)];
              this.dropdownList.Item_Description=ItemuniqueArray;
              break;
            case 'Item_Description':
               this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.Importer_Name.toString())));
               this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.Suplier_Name.toString())));
              break;
            default:
              break;
          }
        },
        error:(err)=>{
console.log(`catch Error`,err);
switch (searchType) {
  case 'Suplier_Name':
   
  // this.dropdownList.Suplier_Name =[];
  this.recordsCount= 0;
  this.getDropdownData();
    break;
  case 'Importer_Name':
    // this.dropdownList.Importer_Name=[]
    this.recordsCount= 0;
    this.getDropdownData();
    break;
  case 'Item_Description':
    // this.dropdownList.Item_Description=[];
    this.recordsCount=  0;
   this.refresh()

    break;
  default:
    break;
}
        }
      });
  }
  
  getDropdownData(): void {
    this.http.get('https://localhost:7022/api/DropDown/uniquevalues').subscribe((res: any) => {
      this.dropdownList = {
        Suplier_Name: res.supplier_Name,
        Importer_Name: res.importer_Name
      };
    });
  }

  onSuplierSelectAll(event: any): void {
    this.selectedItems=event;
    this.fetchDropdownData(event,'Suplier_Name');
  }

  onImporterSelectAll(event: any): void {
debugger
    this.selectedItems=event;
    this.fetchDropdownData(event,'Importer_Name');
  }

  onItemSelectAll(event: any): void {
debugger
     console.log(event);
     this.selectedItems=event;
    this.fetchDropdownData(event,'Item_Description');
    
  }
  onItemDeSelectAll(event:any){
    this.selectedItems=event;
    this.fetchDropdownData(event,'Item_Description');
  }
  onScrollToEnd(): void {}


 //https://localhost:7022/api/DropDown/aggregate?supplierName

  onSearchChange(event: any, searchType: string): void {
    debugger
    const searchStr = event.target.value;
    if (searchStr.length >= 3) {
      this.http.get(`https://localhost:7022/api/DropDown/aggregate?${searchType}=${searchStr}`).subscribe((res: any) => {
 
     
        let suplier =res.supplierNames;
        let impoter = res.importerNames;
       
        this.dropdownList.Suplier_Name=suplier;
        this.dropdownList.Importer_Name= impoter;
        const suplieruniqueArray = [...new Set(this.dropdownList.Suplier_Name)];
        const impoteruniqueArray = [...new Set(this.dropdownList.Importer_Name)];
        this.dropdownList.Suplier_Name =suplieruniqueArray;
        this.dropdownList.Importer_Name =impoteruniqueArray;
      });
    }
  }

  exportToExcel(): void {
    debugger
    this.service.exportToalldropdowndata().subscribe(
      (response: any) => {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'exported_data.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        console.log('Error exporting Excel data:', error.message);
        alert('No data found!');
      }
    );
  }




refresh(){
  location.reload()
}





//testing selecting**********
onSuplierSelect(item: any): void {
debugger
  if (item !="") {
    this.selectedSuppliers.push(item);
  } else {
    const index = this.selectedSuppliers.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedSuppliers.splice(index, 1); // Remove deselected item
    }
  }
  this.fetchDropdownData(this.selectedSuppliers,'Suplier_Name');

}

onItemSelect(item: any): void {
  if (item !="") {
    this.selectedItems.push(item);
  } else {
    const index = this.selectedItems.findIndex((x:any) => x.id === item.id);
    if (index !== -1) {
      this.selectedItems.splice(index, 1); // Remove deselected item
    }
  }
  this.fetchDropdownData(this.selectedItems,'Item_Description');

}

onImporterSelect(item: any): void {
  if (item !="") {
    this.selectedImporters.push(item);
  } else {
    const index = this.selectedImporters.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedImporters.splice(index, 1); // Remove deselected item
    }
  }
  this.fetchDropdownData(this.selectedImporters,'Importer_Name');
}



//end select*********


  //testing deslect options
  selectedSuppliers: any[] = [];
  selectedImporters: any[] = [];
  onSuplierDeselect(item: any): void {
    debugger
    const index = this.selectedSuppliers.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedSuppliers.splice(index, 1); // Remove deselected item

    }
     this.fetchDropdownData(this.selectedSuppliers,'Suplier_Name');
   
  }
  
 
  onImporterDeselect(item: any): void {
    const index = this.selectedImporters.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedImporters.splice(index, 1); // Remove deselected item
    }
    this.fetchDropdownData(this.selectedImporters,'Importer_Name');
  }
  
  onItemDeselect(item: any): void {
    debugger
    const index = this.selectedItems.findIndex((x:any) => x.id === item.id);
    if (index !== -1) {
      this.selectedItems.splice(index, 1); // Remove deselected item
    }
    this.fetchDropdownData(this.selectedItems,'Item_Description');
  }
  
  //end testing code
}
