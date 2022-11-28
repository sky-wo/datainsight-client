import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertInfo, AlertService, IAlertInfo, TagInfo } from 'src/app/core/service/alert.service';
import { TaskService } from 'src/app/core/service/task.service';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.less']
})
export class AlertListComponent implements OnInit {

  items!: AlertInfo[]

  alertItems!: TagInfo[]

  isVisible = false;
  constructor(private taskService: TaskService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.alertItems$.subscribe(r => {
      this.items = r
    })

    //TODO 后期制作分页
    this.taskService.queryTasksAlert(100, 0).valueChanges.subscribe({

      next: r => {
        const alertItems: IAlertInfo[] = []
        r.data.tasks.items.forEach(v => {
          if (v.counter) {
            v.counter.streamProperties.forEach(k => {
              const alertList: IAlertInfo = {
                database: '',
                table: '',
                counter: [],
                tableRow: ''
              }
              alertList.database = v.actor.name
              alertList.table = k.stream.split(".")[1]
              alertList.tableRow = k.property
              if (k.counters) {
                alertList.counter = k.counters
              }
              alertItems.push(alertList)
            })
          }

        })
        this.alertService.toggleAlertItems(alertItems)
      }
    })
  }

  showModal(index: number) {
    this.alertItems = this.items[index].tagInfo
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
