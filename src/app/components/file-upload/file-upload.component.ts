import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DbserviceService } from 'src/app/service/dbservice.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{
constructor(private service:DbserviceService){

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
  if (!this.selectedFile) {
    this.uploading = false;
    this.uploadingSuccess = false;
    alert('Please select a file!');
    return;
  }
  if(this.selectedSection ==''){
    this.uploading = false;
    this.uploadingSuccess = false;
alert('Please select Section');
return
  }
  this.service.uploadFile(this.selectedFile,this.selectedYear,this.selectedSection).subscribe({
    next: (res:any) => {
      this.uploadSuccess = true;
      this.uploading = false;
      this.uploadingSuccess = true;
      this.fileNameinitalStae = false;
      this.uploadMessage = res.message;
      
    
      this.fileName = '';
      this.buttonbgColor = '#fd6436';
      this.buttonColor = 'black';
    
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
  // const currentYear = new Date().getFullYear();
  // for (let year = currentYear - 10; year <= currentYear + 10; year++) {
  //   this.years.push(year);
  // }
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
}
}
