import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-icon',
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="viewBox"
      [attr.fill]="fill"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.875 7.875H10.125V1.125C10.125 0.503684 9.62132 0 9 0C8.37868 0 7.875 0.503684 7.875 1.125V7.875H1.125C0.503684 7.875 0 8.37868 0 9C0 9.62132 0.503684 10.125 1.125 10.125H7.875V16.875C7.875 17.4963 8.37868 18 9 18C9.62132 18 10.125 17.4963 10.125 16.875V10.125H16.875C17.4963 10.125 18 9.62132 18 9C18 8.37868 17.4963 7.875 16.875 7.875Z"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
        height: max-content;
      }
      svg {
        display: block;
      }
    `,
  ],
})
export class AddIconComponent {
  @Input() width: string | number = '24';
  @Input() height: string | number = '24';
  @Input() viewBox: string = `0 0 24 24`;
  @Input() fill: string = 'currentColor';
}
