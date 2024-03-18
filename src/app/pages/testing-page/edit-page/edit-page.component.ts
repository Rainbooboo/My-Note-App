import { IData } from './../data-interface';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudServices } from 'src/app/crud.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {
  //Definitions
  listDataForm: FormGroup;
  private sub: Subscription;
  item: IData;
  //!End Definitions

  constructor(private fb: FormBuilder,
              private service: CrudServices,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    //form model
    this.listDataForm = this.fb.group({
      number: '',
      parameter: '',
      type: '',
      description: '',
    })

    //---------------------THE NEXT TWO FNS ARE GOOD EXAMPLES OF DIFFERENT WAYS TO WRITE RESPONSES TO OBSERVABLES --------------------

        //reading the id of an item route from the path at the top bar of the page
        this.sub = this.route.paramMap.subscribe(
          params => {
            const id = +params.get('id')!;  //this pulls the id from the parameters array and puts into the const which is then put into the getItemForEditingById method.  <- 'params' can be named anything just like 'response' when subscribing to any observable.
            this.getItemForEditingById(id);
          }
        )
        /*BCUZ IT'S NOT BRINGING THE ID OF THE ITEM CLICKED IN THE ROUTE THAT'S WHY THIS 👆 IS GETTING NULL.
        update: it's bringing the link now, but it still needs the ! for some reason
        */
  }

  getItemForEditingById(id: number): void {
    this.service.getDataById(id)
    .subscribe({
      next: (res: IData) => this.displayItems(res) //running display items fn passing in the res
    });
  }

  displayItems(itemsForDisplay: IData) {
    this.item = itemsForDisplay; //this sends all the items meant to be displayed (that came from the observable in the getDataById method) into the object called 'item'

    // make data appear on form: uses the item's properties to set the values for each of the form controls. The data then appears on the form.
    this.listDataForm.patchValue({
      number: this.item.serialNo,
      parameter: this.item.parameter,
      type: this.item.type,
      description: this.item.description,
    });
  }

  saveEditsFn(): void{
    const I = {...this.item, ...this.listDataForm.value} //copies listDataForm's value over item and puts the result inside I
    this.service.updateItem(I)
      .subscribe({
        next: () => this.onSaveComplete()
      })
  }
  onSaveComplete(): void {
    this.router.navigate(["/pages/testing"]);
  }

  deleteFn() {
    this.service.deleteItemById(this.item.id)
    .subscribe({
      next: () => this.onSaveComplete(),
    })
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
