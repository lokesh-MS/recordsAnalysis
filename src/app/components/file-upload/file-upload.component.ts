import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbserviceService } from 'src/app/service/dbservice.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{
constructor(private service:DbserviceService,private router:Router){

}
recordsCount: any;
isrecordsCount: boolean = false;
uploading: boolean = false;
fileNameinitalStae: boolean = false;
uploadingSuccess: boolean = false;
loading: boolean = false;
fileName: any;
SearchGroup!: FormGroup;

selectedFile: File | null = null;
uploadSuccess = false;
uploadMessage = '';
fetching: boolean = false;
buttonbgColor: string = '';
buttonColor: string = '';
ngOnInit(): void {
  // this.initializeYears();
  this.getAllDBCollection();
}
allDbCollaectionValue:any=[];
filterDbArrayValues:any=[];

onFileSelected(event: any) {
  this.uploadSuccess = false;
  this.selectedFile = event.target.files[0];
  const file = event.target.files?.[0]; // Use optional chaining to handle possible null or undefined
  if (file) {
    this.fileNameinitalStae = true;
    this.uploadMessage = '';
    this.fileName = file.name;
    this.buttonbgColor = 'green';
    this.buttonColor = 'white';
  }
}
onUpload() {
  this.uploading = true;

  if(this.selectedSection ==''){
    this.uploading = false;
    this.uploadingSuccess = false;
alert('Please select code!');
return
  }
  if (!this.selectedFile) {
    this.uploading = false;
    this.uploadingSuccess = false;
    alert('Please select a file!');
    return;
  }
 
  this.service.uploadFile(this.selectedFile,this.selectedYear,this.selectedSection).subscribe({
    next: (res:any) => {
      this.uploadSuccess = true;
      this.uploading = false;
      this.uploadingSuccess = true;
      this.fileNameinitalStae = false;
      this.fileName = '';
      this.buttonbgColor = '#fd6436';
      this.buttonColor = 'black';
      if(res.message!=undefined && res.message!=""){
        this.uploadMessage = res.message;
      }
    else{
      this.uploadMessage ="File uploaded successfully!"
    }
    },
    error: (err:any) => {
      console.log(err.message);
      this.uploadSuccess = false;
      this.uploadMessage = 'Upload failed. Please try again later.';
      this.uploading = false;
      this.uploadingSuccess = false;
      this.buttonbgColor = '#fd6436';
      this.buttonColor = 'black';
      this.fileNameinitalStae = false;
    },
  });
}
ExportingExcel: boolean = false;
Export() {
  this.ExportingExcel = true;
  if (this.recordsCount == 0) {
    alert('No Data Found!');
    this.ExportingExcel = false;
  } else {
    ;
    this.service.exportToExcel().subscribe(
      (response: any) => {
        // Create a temporary URL for the Blob object
    

        const url = window.URL.createObjectURL(response);

        // Create a link element and configure it for downloading the file
        const link = document.createElement('a');
        link.href = url;
        link.download = 'exported_data.xlsx';

        // Simulate a click event on the link to trigger the file download
        link.click();

        // Clean up by revoking the URL object
        window.URL.revokeObjectURL(url);
        this.ExportingExcel = false;
   
      },
      (error: any) => {
        ;
        this.ExportingExcel = false;
        console.log('Error exporting Excel data:', error.message);
        alert('No data found!');
      }
    );


  }
}

years: number[] = [];
initializeYears() {

}
selectedYear:string=''
selectYear(event: any) {

  this.selectedYear = event.target.value;
if(this.selectedYear!=""){
  this.showSections()
}
 
}
ArrayOfSections:any=[];
showSections(){
  debugger
  this.ArrayOfSections=[];
  this.filterDbArrayValues.filter((ele:any)=>{
    if(this.selectedYear==ele.dataBaseName){
      let collection =ele.collections;
     
      
      collection.forEach((data:any) => {
        if (data.startsWith("code")) {
          this.ArrayOfSections.push(data);
        }
      });
      this.ArrayOfSections.sort();
     
    }
 
    
  })
}
collectionName:any;
selectedSection:string=''
selectSection(event:any){
  this.selectedSection=event.target.value;
  this.collectionName=event.target.value;
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
      console.log(this.filterDbArrayValues);
   
    }
  })
}
goBackToFilter(){
  this.router.navigateByUrl("")
}
}
