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
  dropdownList:any= { Suplier_Name: [], Importer_Name: [] ,Item_Description:[]};
  selectedItems: any = [];
  uploading: boolean = false;
  loading: boolean = false;
  fetching: boolean = false;
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
    this.getAllDBCollection()
  }
  arrayofselectedItem:any=[];
  databaseName:string='';
  collectionName:string='';
  fetchDropdownData(item: any, searchType: string): void {
   debugger
    // this.arrayofselectedItem.push(item);
    if(this.collectionName==""){
      alert("please select section")
      return
    }
    this.loading=true;
    let params = new HttpParams();
    item.forEach((item:any) => {
      params = params.append('searchTerms', item);
      
    });

    params = params.set('databaseName', this.databaseName)
    .set('collectionName', this.collectionName);
    // this.http.get(`${this.service.publishUrl}StringSearch/${searchType}`, { params })
    //https://localhost:7022/api/StringSearch/Suplier_Name?databaseName=2023&collectionName=part1&searchTerms=TECHGEN%20MACHINERIES%20LTD
    this.http.get(`https://localhost:7022/api/StringSearch/${searchType}?databaseName=${this.databaseName}&collectionName=${this.collectionName}`, { params })
      .subscribe({
        next:async(res:any)=>{
          this.isrecordsCount=true;
          this.recordsCount= await res.length;
    
          if (searchType === 'Suplier_Name') {
            this.selectedItems = []; // Reset selected items if it's Supplier Name dropdown
          }
          // Update dropdown list based on search type
          switch (searchType) {
            case 'Suplier_Name':
           
              // this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.supplier_Name.toString())));
              this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.importer_Name)));
              this.dropdownList.Item_Description = Array.from(new Set(res.map((obj: any) => obj.item_Description)));
              let itemuniqueArray = [...new Set(this.dropdownList.Item_Description)];
              this.dropdownList.Item_Description=itemuniqueArray;
              // console.log(  this.dropdownList.Item_Description);
              this.loading=false;
              break;
            case 'Importer_Name':
           
              // this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.importer_Name.toString())));
              this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.supplier_Name.toString())));
              this.dropdownList.Item_Description = Array.from(new Set(res.map((obj: any) => obj.item_Description)));
              let ItemuniqueArray = [...new Set(this.dropdownList.Item_Description)];
              this.dropdownList.Item_Description=ItemuniqueArray;
              this.loading=false;
              break;
            case 'Item_Description':
              
               this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.Importer_Name)));
               this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.Suplier_Name)));
               this.loading=false;
              break;
            default:
              break;
          }
        },
        error:(err)=>{
console.log(`catch Error`,err);
switch (searchType) {
  case 'Suplier_Name':
  this.recordsCount= 0;
  this.refresh()
  this.getDropdownData();

    break;
  case 'Importer_Name':
    this.recordsCount= 0;
    this.refresh()
    this.getDropdownData();
   
    break;
  case 'Item_Description':
    this.recordsCount=  0;
   this.refresh()

    break;
  default:
    break;
}
        }
      });
  }
  golbaldropdownValues:any;
  getDropdownData(): void {
    this.loading=true;
    this.http.get(`${this.service.publishUrl}DropDown/uniquevalues`).subscribe((res: any) => {
      
      this.dropdownList = {
        Suplier_Name: res.supplier_Name,
        Importer_Name: res.importer_Name,
        Item_Description:res.item_Description,
      };
      this.loading=false;
      console.log(`Item_Description`,this.dropdownList);
      this.golbaldropdownValues=this.dropdownList 
    });
   
    
  }

  onSuplierSelectAll(event: any): void {
    debugger
    this.selectedItems=event;
    if(this.selectedItems.length<20){
      this.fetchDropdownData(event,'Suplier_Name');

    }
    else{
      alert("please select 20 records below!");
     location.reload();
    }


  }
 
  onImporterSelectAll(event: any): void {
debugger
    this.selectedItems=event;

    if(this.selectedItems.length<20){
      this.fetchDropdownData(event,'Importer_Name');


    }
    else{
      alert("please select 20 records below!");
     location.reload();
    }
  }

  onItemSelectAll(event: any): void {
debugger
     console.log(event);
     this.selectedItems=event;
    if(this.selectedItems.length<90){
      this.fetchDropdownData(event,'Item_Description');


    }
    else{
      alert("please select 90 records below!");
     location.reload();
    }
    this.fetchDropdownData(event,'Item_Description');
    
  }
  onSuplierDeslectAll(event:any){
    this.selectedItems=event;
    this.fetchDropdownData(event,'Suplier_Name');
  }
  onImporterDeselectAll(event:any){
    this.selectedItems=event;
    this.fetchDropdownData(event,'Importer_Name');
  }
  onItemDeSelectAll(event:any){
    this.selectedItems=event;
    this.fetchDropdownData(event,'Item_Description');
  }
  onScrollToEnd(): void {}


 //https://localhost:7022/api/DropDown/aggregate?supplierName

  onSearchChange(event: any, searchType: string): void {

    console.log(this.golbaldropdownValues);
    
    const searchStr = event.target.value;
    if (searchStr.length >= 3) {
      debugger
      this.loading=true;
      let suplier:any;
      let impoter :any;
      let itemDescription:any;
      this.http.get(`${this.service.publishUrl}DropDown/aggregate?${searchType}=${searchStr}`).subscribe((res: any) => {
        if(res.supplierNames.length==0){
           suplier =this.golbaldropdownValues.Suplier_Name;
        }
       if(res.supplierNames.length!=0){
          suplier = res.supplierNames;
        }
   if(res.importerNames.length ==0){
      impoter = this.golbaldropdownValues.Importer_Name;
    }
 if(res.importerNames.length!=0){
  impoter = res.importerNames;

}
 if(res.item.length==0){
  itemDescription=this.golbaldropdownValues.Item_Description;
}
 if(res.item.length!=0){
  itemDescription=res.item;
}  
        this.dropdownList.Suplier_Name=suplier;
        this.dropdownList.Importer_Name= impoter;
        this.dropdownList.Item_Description=itemDescription;
        const suplieruniqueArray = [...new Set(this.dropdownList.Suplier_Name)];
        const impoteruniqueArray = [...new Set(this.dropdownList.Importer_Name)];
        const itemDescriptionuniqueArray=[...new Set(this.dropdownList.Item_Description)];
        this.dropdownList.Suplier_Name =suplieruniqueArray;
        this.dropdownList.Importer_Name =impoteruniqueArray;
        this.dropdownList.Item_Description=itemDescriptionuniqueArray;
        this.loading=false;
      });
    }
    else{
      this.loading=false;
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

 this.http.get(`${this.service.publishUrl}StringSearch/clear`).subscribe({
  next:(res:any)=>{
    console.log(res);
    alert(res.message)
    location.reload();
  },
  error:(err)=>{
    console.log(err);
    
  }
 })
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
selectedSuppliers: any[] = [];
selectedImporters: any[] = [];
onSuplierDeselect(item: any): void {
 
  // const index = this.selectedSuppliers.findIndex(x => x.id === item.id);
  // if (index !== -1) {
  //   this.selectedSuppliers.splice(index, 1); 

  // }
  //  this.fetchDropdownData(this.selectedSuppliers,'Suplier_Name');
 
  debugger

  // Check if the item is a string
  if (typeof item === 'string') {
    // Filter out items that contain the specified string in their Suplier_Name
    this.selectedSuppliers = this.selectedSuppliers.filter(x => !x.includes(item));
  } else {
    // Otherwise, remove the specific item from the array
    const index = this.selectedSuppliers.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedSuppliers.splice(index, 1);
    }
  }

  // Fetch dropdown data after removing the item(s)
  this.fetchDropdownData(this.selectedSuppliers, 'Suplier_Name');
}
selectedItem_Description: any[] = [];
onItemSelect(item: any): void {
  debugger
  if (item !="") {
    this.selectedItem_Description.push(item);
  } else {
    const index = this.selectedItem_Description.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedItem_Description.splice(index, 1); // Remove deselected item
    }
  }
  this.fetchDropdownData(this.selectedItem_Description,'Item_Description');

}


onItemDeselect(item: any): void {
  // debugger
  // const index = this.selectedItems.findIndex((x:any) => x.id === item.id);
  // if (index !== -1) {
  //   this.selectedItems.splice(index, 1); // Remove deselected item
  // }
  // this.fetchDropdownData(this.selectedItems,'Item_Description');


  debugger

  // Check if the item is a string
  if (typeof item === 'string') {
    // Filter out items that contain the specified string in their Suplier_Name
    this.selectedItem_Description = this.selectedItem_Description.filter((x:any) => !x.includes(item));
  } else {
    // Otherwise, remove the specific item from the array
    const index = this.selectedItem_Description.findIndex((x:any) => x.id === item.id);
    if (index !== -1) {
      this.selectedItem_Description.splice(index, 1);
    }
  }

  // Fetch dropdown data after removing the item(s)
  this.fetchDropdownData(this.selectedItem_Description, 'Item_Description');
}

onImporterSelect(item: any): void {
  debugger
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

  
 
  onImporterDeselect(item: any): void {
    // debugger
    // const index = this.selectedImporters.findIndex(x => x.id === item.id);
    // if (index !== -1) {
    //   this.selectedImporters.splice(index, 1); // Remove deselected item
    // }
    // this.fetchDropdownData(this.selectedImporters,'Importer_Name');




    debugger

    // Check if the item is a string
    if (typeof item === 'string') {
      // Filter out items that contain the specified string in their Suplier_Name
      this.selectedImporters = this.selectedImporters.filter(x => !x.includes(item));
    } else {
      // Otherwise, remove the specific item from the array
      const index = this.selectedImporters.findIndex(x => x.id === item.id);
      if (index !== -1) {
        this.selectedImporters.splice(index, 1);
      }
    }
  
    // Fetch dropdown data after removing the item(s)
    this.fetchDropdownData(this.selectedImporters, 'Importer_Name');
  }
  

  
  //end testing code

  selectedYear:string=''
selectYear(event: any) {

  this.selectedYear = event.target.value;
  this.databaseName=event.target.value;
if(this.selectedYear!=""){
  this.showSections()
}
 
}
years: number[] = [];
ArrayOfSections:any=[];
allDbCollaectionValue:any=[];
filterDbArrayValues:any=[];
showSections(){
  this.ArrayOfSections=[];
  this.filterDbArrayValues.filter((ele:any)=>{
    if(this.selectedYear==ele.dataBaseName){
      this.ArrayOfSections.push(ele.collections);
    }
    console.log(this.ArrayOfSections);
    
  })
}
selectedSection:string=''
selectSection(event:any){
  this.selectedSection=event.target.value;
  this.collectionName=event.target.value;
}
getAllDBCollection(){
  this.service.getAllDBCollection().subscribe({
    next:(res:any)=>{

      console.log(res);
   this.allDbCollaectionValue =  res;
      if(this.allDbCollaectionValue.length>0){
        this.allDbCollaectionValue.forEach((element:any) => {
          let dbName=element.dataBaseName.toString();
          if(dbName.startsWith("20")){
        
            this.filterDbArrayValues.push(element);
            this.years.push(dbName);
          }
        });
      }
      console.log(this.filterDbArrayValues);
   
    }
  })
}
}
