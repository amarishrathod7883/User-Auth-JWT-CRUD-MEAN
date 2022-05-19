import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn = false;
  isDeleted = false;
  getAllUser: any = [];
  getAllUserCount = 0;
  role_name?: string;
  searchCondition: any = {};
  searchUsername: any;
  searchNotifier = new Subject();

  // pagination variables START
  p: any;
  pages: any = 1;
  itemsperpage: any = 5;
  totalpages: any;
  totalitems: any;
  showing: any;
  to: any;
  // pagination variables END

  constructor(private UserService: UserService, private tokenStorageService: TokenStorageService, ) { }

  ngOnInit(): void 
  {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) 
    {
      const user = this.tokenStorageService.getUser();
      this.role_name = user.role_name;

      this.searchCondition = {
        username: '',
        pages: this.pages,
        pageSize: this.itemsperpage 
      };

      if(this.role_name != 'ADMIN')
      {
        this.searchCondition._id = user.id;
      }
      this.getAllUsers(this.searchCondition);
      this.removeAllUser();
    }

    this.searchNotifier.pipe(debounceTime(1000))
    .subscribe(data => {
      this.searchCondition.username = !!this.searchUsername ? this.searchUsername : '';
      this.getAllUsers(this.searchCondition);
    });
  }

  page($pages) 
  {
    this.pages = $pages;
    this.searchCondition.pages = $pages;
    this.getAllUsers(this.searchCondition);
  }

  itemsPerPage($itemsperpage) 
  {
    this.itemsperpage = $itemsperpage;
    this.searchCondition.pageSize = $itemsperpage;
    this.getAllUsers(this.searchCondition);
  }

  showingEntry() 
  {
    if (this.pages === this.totalpages) 
    {
      this.showing = ((this.pages * this.itemsperpage) - this.itemsperpage) + 1;
      this.to = this.pages * this.itemsperpage;
    } 
    else 
    {
      this.showing = ((this.pages * this.itemsperpage) - this.itemsperpage) + 1;
      this.to = this.pages * this.itemsperpage;
    }
  }

  getAllUsers(searchCondition)
  {
    console.log("searchCondition", searchCondition);
    this.UserService.getAllUsers(searchCondition).subscribe(
      response => {
        var res = JSON.parse(response);
        this.getAllUser = res.data;
        this.getAllUserCount = res.fetchedUserCount;
        this.showingEntry();
        this.totalpages = Math.ceil((res.fetchedUserCount)/this.pages);
        this.totalitems = res.fetchedUserCount;
        
        console.log("this.getAllUser", this.getAllUser);
        console.log("this.getAllUserCount", this.getAllUserCount);
      },
      err => {
        this.getAllUser = JSON.parse(err.error).message;
      }
    );
  }

  removeSingleUser(id: string): void 
  {
    this.UserService.removeUser(id)
      .subscribe(
        res => {
          this.isDeleted = true;
          setTimeout(() => {
            this.isDeleted = false;
            this.getAllUsers(this.searchCondition);
          }, 500);
        },
        error => {
          console.log(error);
        });
  }

  removeAllUser(): void 
  {
    this.UserService.removeAllUser()
      .subscribe(
        res => {
          console.log("removeAllUser", res);
        },
        error => {
          console.log(error);
        });
  }
}