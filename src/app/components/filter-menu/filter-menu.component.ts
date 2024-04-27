import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DbserviceService } from 'src/app/service/dbservice.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css']
})
export class FilterMenuComponent implements OnInit{
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
    // this.getDropdownData();
     this.getAllDBCollection()
  }
  ngDoCheck(){
//  debugger
    // if(this.recordsCount!=this.camparetotalCount){
    //   debugger
    //   console.log('doCheck recordsCount',this.recordsCount);
    //   console.log('doCheck camparetotalCount',this.camparetotalCount);
    //   this.loading=true;

    // }
    // if(this.recordsCount==this.camparetotalCount){
    //   this.loading=false;
    // }
    // if(this.selectSuplierCountForLoadingAnimation==this.suplierCountLoding){
    //   this.loading=false;
    // }
  }
  arrayofselectedItem:any=[];
  databaseName:string='';
  collectionName:string='';
  camparetotalCount:number=0;
  suplierCountLoding:number=0;
  fetchDropdownData(item: any, searchType: string): void {
debugger

    // this.arrayofselectedItem.push(item);
    if(this.collectionName==""){
      alert("please select section")
      return
    }
   
    let params = new HttpParams();
    item.forEach((item:any) => {
      params = params.append('searchTerms', item);
      
    });

    params = params.set('databaseName', this.databaseName)
    .set('collectionName', this.collectionName);
    this.loading=true;
    // this.http.get(`${this.service.publishUrl}StringSearch/${searchType}`, { params })
    //https://localhost:7022/api/StringSearch/Suplier_Name?databaseName=2023&collectionName=part1&searchTerms=TECHGEN%20MACHINERIES%20LTD
    this.http.get(`${this.service.publishUrl}StringSearch/${searchType}?databaseName=${this.databaseName}&collectionName=${this.collectionName}`, { params })
      .subscribe({
        
        next:async(res:any)=>{
          this.suplierCountLoding++;
          this.loading=true;
          this.recordsCount= await res.length;
          this.recordsCount=this.recordsCount;
          this.camparetotalCount=Number(this.recordsCount);
console.log(this.recordsCount);
console.log(this.camparetotalCount);

    if(res.length!=0 && res.length!=undefined){
      if (searchType === 'Suplier_Name') {
        this.selectedItems = []; // Reset selected items if it's Supplier Name dropdown
      }
      // Update dropdown list based on search type
      switch (searchType) {
        case 'Suplier_Name':
          this.loading=true;
          // this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.supplier_Name.toString())));
          this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.importer_Name)));
          this.dropdownList.Item_Description = Array.from(new Set(res.map((obj: any) => obj.item_Description)));
          let itemuniqueArray = [...new Set(this.dropdownList.Item_Description)];
          let importerqueArray = [...new Set(this.dropdownList.Importer_Name)];
          this.dropdownList.Item_Description=itemuniqueArray;
          this.dropdownList.Importer_Name=importerqueArray;
          this.loading=false;
          break;
        case 'Importer_Name':
          this.loading=true;
          // this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.importer_Name.toString())));
          // this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.supplier_Name.toString())));
          this.dropdownList.Item_Description = Array.from(new Set(res.map((obj: any) => obj.item_Description)));
          let ItemuniqueArray = [...new Set(this.dropdownList.Item_Description)];
          this.dropdownList.Item_Description=ItemuniqueArray;
           this.loading=false;
          break;
        case 'Item_Description':
            this.loading=true;
           this.dropdownList.Importer_Name = Array.from(new Set(res.map((obj: any) => obj.Importer_Name)));
           this.dropdownList.Suplier_Name = Array.from(new Set(res.map((obj: any) => obj.Suplier_Name)));
            this.loading=false;
          break;
        default:
          break;
      }
      this.isrecordsCount=true;
    }
       else{
        // this.getDropdownData()
        this.isrecordsCount=false;
        this.loading=false;
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
    //https://localhost:7022/api/DropDown/uniquevalues?databaseName=2023&collectionName=code1
    this.http.get(`${this.service.publishUrl}DropDown/uniquevalues?databaseName=${this.selectedYear}&collectionName=${this.selectedSection}`).subscribe((res: any) => {
      
      this.dropdownList = {
        Suplier_Name: res.supplier_Name,
        Importer_Name: res.importer_Name,
        Item_Description:res.item_Description,
      };
      this.loading=false;
  
      this.golbaldropdownValues=this.dropdownList 
    });
   
    
  }

  onSuplierSelectAll(event: any): void {

    this.selectedItems=event;
    if(this.selectedItems.length<100){
      this.fetchDropdownData(event,'Suplier_Name');

    }
    else{
      alert("please select 100 records below!");
     location.reload();
    }


  }
 
  onImporterSelectAll(event: any): void {

    // this.selectedItems=event;

    // if(this.selectedItems.length<100){
    //   this.fetchDropdownData(event,'Importer_Name');


    // }
    // else{
    //   alert("please select 100 records below!");
    //  location.reload();
    // }
  }

  onItemSelectAll(event: any): void {

     this.selectedItems=event;
    // if(this.selectedItems.length<90){
    //   this.fetchDropdownData(event,'Item_Description');


    // }
    // else{
    //   alert("please select 90 records below!");
    //  location.reload();
    // }
    //this.fetchDropdownData(event,'Item_Description');
    
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
    // debugger
    const searchStr = event.target.value;
    if (searchStr.length >= 3) {
      this.loading=true;
      let suplier:any;
      let impoter :any;
      let itemDescription:any;
      this.http.get(`${this.service.publishUrl}DropDown/aggregate?${searchType}=${searchStr}&DbName=${this.selectedYear}`).subscribe((res: any) => {
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
      this.getDropdownData()
    }
  }

  exportToExcel(): void {

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
    alert(res.message)
    location.reload();
  },
  error:(err)=>{
    console.log(err);
    
  }
 })
}

selectSuplierCountForLoadingAnimation:number=0;
//testing selecting**********
onSuplierSelect(item: any): void {
  this.selectSuplierCountForLoadingAnimation++;
  if (item !="") {
    this.selectedSuppliers.push(item);
  } else {
    const index = this.selectedSuppliers.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedSuppliers.splice(index, 1); // Remove deselected item
    }
  }
 

}
GetStepOneFilterValue(){
  this.isrecordsCount=false;
  this.fetchDropdownData(this.selectedSuppliers,'Suplier_Name');
}



selectedSuppliers: any[] = [];
selectedImporters: any[] = [];
onSuplierDeselect(item: any): void {
 debugger
  const index = this.selectedSuppliers.findIndex(selected => selected === item);
    if (index !== -1) {
      this.selectedSuppliers.splice(index, 1); // Remove exact string on deselect
    }
  // Fetch dropdown data after removing the item(s)
 // this.fetchDropdownData(this.selectedSuppliers, 'Suplier_Name');
}
selectedItem_Description: any[] = [];
onItemSelect(item: any): void {
  // if (item !="") {
  //   this.selectedItem_Description.push(item);
  // } else {
  //   const index = this.selectedItem_Description.findIndex(x => x.id === item.id);
  //   if (index !== -1) {
  //     this.selectedItem_Description.splice(index, 1); // Remove deselected item
  //   }
  // }
  
  debugger
  // this.selectSuplierCountForLoadingAnimation++;
  if (item !="") {
    this.selectedItem_Description.push(item);
  } else {
    const index = this.selectedItem_Description.findIndex(x => x === item);
    if (index !== -1) {
      this.selectedItem_Description.splice(index, 1); // Remove deselected item
    }
  }


  // this.selectedItem_Description.push(item);
  // const index = this.selectedItem_Description.findIndex(selected => selected === item);
  // if (index !== -1) {
  //   this.selectedItem_Description.splice(index, 1); // Remove exact string on deselect
  // }
  this.fetchDropdownData(this.selectedItem_Description,'Item_Description');

}


onItemDeselect(item: any): void {


  // // Check if the item is a string
  // if (typeof item === 'string') {
  //   // Filter out items that contain the specified string in their Suplier_Name
  //   this.selectedItem_Description = this.selectedItem_Description.filter((x:any) => !x.includes(item));
  // } else {
  //   // Otherwise, remove the specific item from the array
  //   const index = this.selectedItem_Description.findIndex((x:any) => x.id === item.id);
  //   if (index !== -1) {
  //     this.selectedItem_Description.splice(index, 1);
  //   }
  // }


  const index = this.selectedItem_Description.findIndex(selected => selected === item);
  if (index !== -1) {
    this.selectedItem_Description.splice(index, 1); // Remove exact string on deselect
  }
  // Fetch dropdown data after removing the item(s)
  this.fetchDropdownData(this.selectedItem_Description, 'Item_Description');
}

onImporterSelect(item: any): void {

  if (item !="") {
    let ImporterStr=item.toString().trim();

    this.selectedImporters.push(ImporterStr);
    this.selectedImporters = [...new Set(this.selectedImporters)];

  } else {
    const index = this.selectedImporters.findIndex(x => x.id === item.id);
    if (index !== -1) {
      this.selectedImporters.splice(index, 1); // Remove deselected item
    }
  }
  this.fetchDropdownData(this.selectedImporters,'Importer_Name');
}

 
  onImporterDeselect(item: any): void {
   
  

    const index = this.selectedImporters.findIndex(selected => selected === item);
    if (index !== -1) {
      this.selectedImporters.splice(index, 1); // Remove exact string on deselect
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
      let collection =ele.collections;
     
      
      collection.forEach((data:any)=>{
      
        
        if(data.startsWith("code")){
          this.ArrayOfSections.push(data);
        
        }
      })
      this.ArrayOfSections.sort();
    }
    
  })
}
selectedSection:string=''
selectSection(event:any){
  this.selectedSection=event.target.value;
  this.collectionName=event.target.value;
  this.getDropdownData();
}
getAllDBCollection(){
  this.service.getAllDBCollection().subscribe({
    next:(res:any)=>{
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
  
   
    }
  })
}
}
