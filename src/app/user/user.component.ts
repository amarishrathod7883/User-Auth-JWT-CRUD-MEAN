import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  form: any = {
    firstname: null,
    lastname: null,
    username: null,
    email: null,
    role_name: null,
    profileimage: null
  };
  currentUserId: any;
  isSuccessful = false;
  isUpdateFailed = false;
  errorMessage = '';
  imagePreview: string;

  constructor(private UserService: UserService, private route: ActivatedRoute, private router: Router) 
  { 
  }

  ngOnInit(): void 
  {
    this.currentUserId = this.route.snapshot.params.id;
    this.getSingleUser(this.currentUserId);
  }

  getSingleUser(id: string): void {
    this.UserService.getSingleUser(id)
      .subscribe(
        res => {
          
          var response = JSON.parse(res);
          var responseNew = response.data;
          console.log("responseNew", responseNew);
          this.form.firstname = responseNew.firstname;
          this.form.lastname = responseNew.lastname;
          this.form.username = responseNew.username;
          this.form.email = responseNew.email;
          this.form.role_name = responseNew.user_role_id.role_name;
        },
        error => {
          console.log(error);
        });
  }

  uploadFile(event) 
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.profileimage = file;
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  onUpdate(): void 
  {
    this.form.role_name = (this.form.role_name == '' ? 'user' : this.form.role_name);
    console.log("this.form", this.form);
    var formData: any = new FormData();
    formData.append('firstname', this.form.firstname);
    formData.append('lastname', this.form.lastname);
    formData.append('username', this.form.username);
    formData.append('email', this.form.email);
    
    formData.append('profileimage', this.form.profileimage);
    formData.append('role_name', this.form.role_name);
    this.UserService.updateUser(this.currentUserId, formData).subscribe(
      res => {
        this.isSuccessful = true;
        this.isUpdateFailed = false;
        this.router.navigate(['home']);
      },
      err => {
        var error = err.error;
        this.errorMessage = error.message;
        this.isUpdateFailed = true;
      }
    );
  }

}
