import {Component, OnInit} from '@angular/core';
import {DataTag, DataTagInput} from "../core/type/graphql-type";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {PolicyService} from "../core/service/policy.service";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.less']
})
export class PolicyComponent implements OnInit {

  listOfData: DataTag[] = []
  pageSize: number = 10
  totalData: number = 0
  currentPageIndex: number = 1
  isVisible = false;
  isOkLoading = false;
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private policyService: PolicyService,
    private message: NzMessageService
  ) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      level: [null, [Validators.required]],
      alert: [null, [Validators.required]],
    });
    this.pagingQueryConnectors(this.pageSize, 0)
  }

  pagingQueryConnectors(first: number, skip: number) {
    this.policyService.pagingQueryDataTags(first, skip).valueChanges.subscribe({
      next: r => {
        this.listOfData = r.data.dataTags.items as DataTag[]
        this.totalData = r.data.dataTags.total
      }, error: e => {
        console.error(e)
      }
    })
  }


  pageChange() {
    this.pagingQueryConnectors(this.pageSize, (this.currentPageIndex - 1) * this.pageSize)
  }


  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isOkLoading = true


      const dataTagInput: DataTagInput = {
        name: this.validateForm.value.name,
        level: this.validateForm.value.level,
        alert: this.validateForm.value.alert
      }


      this.policyService.addDataTag(dataTagInput).subscribe({
        next: _ => {
          this.isOkLoading = false
          this.isVisible = false
          this.policyService.pagingQueryDataTags(this.pageSize, (this.currentPageIndex - 1) * this.pageSize).refetch()
        }, error: e => {
          this.isOkLoading = false
          this.isVisible = false
          this.message.create('error', `添加出错`);
          console.error(e)
        }
      })
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  // ngOnDestroy() {
  //   this.querySubscription.unsubscribe();
  // }


}
