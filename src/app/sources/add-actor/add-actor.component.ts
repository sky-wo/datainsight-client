import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SourcesService } from 'src/app/core/service/sources.service';
import { Connector } from 'src/app/core/type/graphql-type';

@Component({
  selector: 'app-add-connector',
  templateUrl: './add-actor.component.html',
  styleUrls: ['./add-actor.component.less']
})
export class AddActorComponent implements OnInit {

  dataList!: readonly Connector[];
  selectChoose: String = ""
  constructor(
    private sourcesService: SourcesService,
    private route: Router) { }

  ngOnInit(): void {
    this.sourcesService.connectors().subscribe({
      next: r => {
        this.dataList = r.connectors.items
      },
      error: e => {
        console.error("add-Sources出错了" + e)
      }
    })
  }

  nextChoose() {
    this.route.navigate(["/frame/sources/spec/", this.selectChoose])
  }
}
