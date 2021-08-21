import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <section id="content">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </section>
  `,
  styleUrls: []
})
export class ContentComponent {
}
