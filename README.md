# GamaynoGmsAngular

## App Folder Structure (2025 Refactor)

The `src/app` folder is organized into a scalable, maintainable structure:

```
app
 ├─ core
 │   ├─ services/
 │   │   ├─ members.service.ts        # CRUD for members + balance
 │   │   ├─ subscriptions.service.ts  # new, renew, cancel subscription
 │   │   ├─ cash.service.ts           # transactions, balance, reports
 │   │   └─ api.interceptor.ts        # attach base URL, handle errors
 │   │
 │   ├─ guards/
 │   │   └─ auth.guard.ts
 │   │
 │   ├─ models/
 │   │   ├─ member.model.ts           # {id, name, balance, debt, ...}
 │   │   ├─ subscription.model.ts     # {id, memberId, type, status, ...}
 │   │   ├─ cash-transaction.model.ts # {id, type, amount, memberId, ...}
 │   │   └─ balance.model.ts          # {memberId, credit, debit}
 │   │
 │   └─ layout/
 │       ├─ navbar.component.ts
 │       ├─ sidebar.component.ts
 │       └─ layout.component.ts
 │
 ├─ shared
 │   ├─ components/
 │   │   ├─ card.component.ts
 │   │   ├─ table.component.ts
 │   │   └─ modal.component.ts
 │   │
 │   ├─ pipes/
 │   │   └─ currency.pipe.ts          # format money EGP / SAR
 │   │
 │   └─ directives/
 │       └─ autofocus.directive.ts
 │
 ├─ features
 │   ├─ members/
 │   │   ├─ members-list.component.ts      # GET /api/members
 │   │   ├─ member-details.component.ts    # GET /api/members/{id}
 │   │   ├─ member-create.component.ts     # POST /api/members
 │   │   ├─ member-edit.component.ts       # PUT /api/members/{id}
 │   │   ├─ member-balance.component.ts    # GET /api/members/{id}/balance
 │   │   └─ members.routes.ts
 │   │
 │   ├─ subscriptions/
 │   │   ├─ subscriptions-list.component.ts
 │   │   ├─ subscription-details.component.ts
 │   │   ├─ subscription-create.component.ts
 │   │   ├─ subscription-cancel.component.ts
 │   │   └─ subscriptions.routes.ts
 │   │
 │   ├─ cash/
 │   │   ├─ cash-list.component.ts
 │   │   ├─ cash-transaction.component.ts
 │   │   ├─ cash-report.component.ts
 │   │   └─ cash.routes.ts
 │   │
 │   └─ ... (other feature folders)
```

### Structure Purpose
- **core/**: App-wide singletons, base services, models, guards, and layout components.
- **shared/**: Reusable UI components, pipes, and directives used across features.
- **features/**: Domain-specific modules and components (members, subscriptions, cash, etc.).

Each folder is self-contained and focused, making the project easy to scale and maintain.


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

# Using IcoMoon for Custom Icons

This project uses [IcoMoon](https://icomoon.io/) to manage and generate custom icon fonts.

## How to Add and Use IcoMoon Icons

### 1. Access IcoMoon App
- Go to [https://icomoon.io/app](https://icomoon.io/app)

### 2. Import Existing Selection (Optional)
- If you have a previous `selection.json` file from your project, click **Import Icons** (top left) and upload `selection.json` to load your current icon set.

### 3. Add Icons
- Click **IcoMoon Library** or **Import Icons** to add new SVG icons.
- Select the icons you want to include.

### 4. Generate Font
- Click **Generate Font** (bottom right).
- Download the generated font package.

### 5. Add to Project
- Copy the contents of the downloaded `fonts` folder (usually contains `.ttf`, `.woff`, `.eot`, `.svg` files) into your project at `src/assets/fonts/`.
- Copy the `style.css` or `icomoon.css` file into `src/assets/fonts/` (rename as `icomoon.css` if needed).

### 6. Integrate in Angular
- The global stylesheet `src/styles.scss` imports the IcoMoon CSS with:

```scss
@import 'assets/fonts/icomoon.css';
```

- No need to add to the `angular.json` styles array if using the above import.
- Font paths in `icomoon.css` should be relative as generated by IcoMoon (they will work as long as fonts and CSS are in `src/assets/fonts/`).

### 7. Use Icons in Your App
- Use the icon class in your HTML:

```html
<span class="icon-home"></span>
```

---

## Adding New Icons / Updating Font
1. Repeat steps 1-4 above to add new icons in IcoMoon.
2. Download and replace the files in `src/assets/fonts/` (`icomoon.eot`, `.ttf`, `.woff`, `.svg`, and `icomoon.css`).
3. Commit changes to version control.

---

## Tips
- Always keep a backup of your `selection.json` for easy updates.
- You can customize icon class names in IcoMoon before generating the font.

## References
- [IcoMoon Docs](https://icomoon.io/#docs)
- [IcoMoon App](https://icomoon.io/app)

# 🚀 HTTP Flow Documentation

## 1. Create a Feature Service

Every feature should have its own service (e.g. `MembersService`). This service **injects the shared** `HttpService`.

```typescript
@Injectable({ providedIn: "root" })
export class MembersService {
  constructor(private httpService: HttpService) {}
  members = signal<ApiState<any[]>>({
    loading: false,
    data: null,
    error: null,
  });

  getMembers(query: { page?: number; limit?: number; search?: string }) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpService.get<Member[]>("/api/members", this.members(), {
      params,
    });
  }
}
```

## 2. Do **not** subscribe in the service

#### Always **subscribe in the component** that uses the service:
#### Use takeUntilDestroyed (Angular 16+)
#### Angular gives you a built-in way to auto-unsubscribe when the component is destroyed:

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MembersComponent implements OnInit{
  private membersService = inject(MembersService);
  ngOnInit(): void {
  this.membersService.getMembers().pipe(takeUntilDestroyed()).subscribe();
  }
}
```

## 3. Enable Global Loading & Error (optional)

Use `HttpContext` when you want the **global spinner** or **error toast**:

```typescript
import { HttpContext } from "@angular/common/http";
  getMembers(query: { page?: number; limit?: number; search?: string }) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpService.get<Member[]>("/api/members", this.members(), {
      params,
        context: new HttpContext().set(ENABLE_LOADING, true).set(ENABLE_ERROR, true),

    });
  }
```

## ✅ Summary

- Create a service → inject `HttpService`.
- Call `.get/.post/.put/.delete` with type + endpoint (+ params).
- Subscribe only in the component.
- Use Angular’s `takeUntilDestroyed` to auto-unsubscribe:
- Use `ENABLE_LOADING` and `ENABLE_ERROR` when you want global spinner + toast.

