import { Component, OnInit } from '@angular/core';
import { ActorService } from 'src/app/core/service/actor.service';

@Component({
  selector: 'app-add-connector',
  templateUrl: './add-actor.component.html',
  styleUrls: ['./add-actor.component.less']
})
export class AddActorComponent implements OnInit {

  current = 0;
  constructor(private actor: ActorService) {
    this.actor.currentStep$.subscribe(r => {
      this.current = r
    })
  }

  ngOnInit(): void {
  }


  get getStepItems() {
    return this.actor.stepItems
  }
}
