# Icon Components

This directory contains reusable SVG icon components for the Angular application.

## Available Icons

- `DeleteIconComponent` - Delete/trash icon
- `AddIconComponent` - Plus/add icon

## Usage

### Basic Usage

```html
<app-delete-icon></app-delete-icon> <app-add-icon></app-add-icon>
```

### With Custom Properties

```html
<app-delete-icon width="20" height="20" fill="red"> </app-delete-icon>
```

## Properties

All icon components support these inputs:

- `width` - Icon width (default: varies by icon)
- `height` - Icon height (default: varies by icon)
- `viewBox` - SVG viewBox (default: varies by icon)
- `fill` - Fill color (default: 'currentColor')

## Adding New Icons

1. Create a new component file: `icon-name.component.ts`
2. Copy the SVG path data into the template
3. Add the component to `shared.module.ts`
4. Export it from `index.ts`

### Example Template

```typescript
@Component({
  selector: 'app-icon-name',
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="viewBox"
      [attr.fill]="fill"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- SVG path data here -->
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }
      svg {
        display: block;
      }
    `,
  ],
})
export class IconNameComponent {
  @Input() width: string | number = '24';
  @Input() height: string | number = '24';
  @Input() viewBox: string = '0 0 24 24';
  @Input() fill: string = 'currentColor';
}
```

## Benefits

- **Reusable** - Use the same icon throughout the app
- **Customizable** - Change size, color, and other properties
- **Maintainable** - Update icons in one place
- **Type-safe** - Full TypeScript support
- **Performance** - No external icon libraries needed
