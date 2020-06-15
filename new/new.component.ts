import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {


  fData;
  registrationForm: FormGroup;


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string,private _formBuilder: FormBuilder) { }

  ngOnInit() {

    this.registrationForm = this._formBuilder.group({

      FirstName: ["", [Validators.required]],
      LastName: ["", [Validators.required]],
      Contact: ["", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      Email: ["", [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"), Validators.maxLength(100)]],
      Password: ["", [Validators.minLength(6), Validators.maxLength(15)]],
      ConfirmPassword: ["", [Validators.minLength(6), Validators.maxLength(15)]],
      File: ["", [Validators.required]]


    })

  }
  get fristname() {
    console.log(this.registrationForm)
    return this.registrationForm.get("FirstName");
  }
  get f() {
    console.log(this.registrationForm.controls.FirstName.value)
    return this.registrationForm.controls;
  }

  onSubmit() {

    console.log(this.registrationForm)
    //this.sbdata({ File: this.fd, ...this.registrationForm.value}
    this.sbdata( this.registrationForm.value );
    
  
  }

  sbdata(data) {

    //let adto = new Dto();
    //adto.Registration = data;
    //adto.FormData = formdata;

    this.http.post(this.baseUrl + 'weatherforecast/uploadData', data).subscribe(result => {
      console.log(result)
    }, error => console.error(error));
    console.log();

  }
   fd = new FormData();
  onImageChange(image) {

  
    let file = image.target.files;

    
    this.fd.append("Files", file[0]);



    this.http.post(this.baseUrl + 'weatherforecast/uploadImage',this.fd).subscribe(result => {
      console.log(result)
    }, error => console.error(error));
    console.log();

  //  this.fd.append("Data", (this.registrationForm.controls.FirstName.value as string).toString());

    //this.registrationForm.patchValue({ File: this.fd });
    //console.log(this.registrationForm.value);

  }

}

export class Dto {

  Registration: any;
  FormData: FormData;
}
