import {Component, OnInit} from '@angular/core';
import {DagreNodesOnlyLayout, Edge, Layout, Node} from "@swimlane/ngx-graph";


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent implements OnInit {

  public layout: Layout = new DagreNodesOnlyLayout();
  public links: Edge[] = [
    {
      id: 'a',
      source: 'first',
      target: 'second'
    },
    {
      id: 'b',
      source: 'first',
      target: 'third'
    },
    {
      id: 'c',
      source: 'first',
      target: 'fourth'
    },
    {
      id: 'c95',
      source: 'r2',
      target: 'c2'
    }
  ];
  public nodes: Node[] = [
    {
      id: 'first',
      label: 'wwa'
    },
    {
      id: 'second',
      label: 'ww'
    },
    {
      id: 'third',
      label: 'ww'
    },
    {
      id: 'fourth',
      label: 'ww'
    },
    {
      id: 'r2',
      label: 'wwdd'
    },
    {
      id: 'c2',
      label: 'ww'
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
