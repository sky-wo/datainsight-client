import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, distinctUntilChanged, tap } from 'rxjs';

export interface SideNavmenu {
  name: string,
  path: string
}


@Injectable({
  providedIn: 'root'
})
export class NavmenuService {

  sideBarData: SideNavmenu[] = [
    {
      name: "概览",
      path: "/frame/dashboard"
    },
    {
      name: "任务",
      path: "/frame/task"
    },
    {
      name: "连接器配置",
      path: "/frame/connector"
    },
    {
      name: "Actor 实例",
      path: "/frame/actor"
    }, {
      name: "策略管理",
      path: "/frame/policy"
    }
  ]

  constructor() { }

}
