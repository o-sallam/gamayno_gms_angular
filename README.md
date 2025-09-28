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

# Feature Development Guide

This guide explains how to create a new feature (service + state management) following the project’s conventions.  
We will use `MembersService` as a reference.

---

## 📂 Folder Structure

Each feature should live in its own module/folder under the `src/app/features` directory.

Example for **Members**:
```
src/app/features/members/
  ├── models/
  │     └── member.model.ts
  ├── services/
  │     └── members.service.ts
  └── pages/
       └── members/
       └── members-crud-dialog/
```

---

## 🛠 Steps to Create a New Feature

### 1. Define a Model
Inside `models/`, create a file describing your data shape.

Example `member.model.ts`:
```ts
export interface Member {
  id: number;
  code: string;
  name: string;
  balance: number;
  debt: number;
  credit: number;
  address: string;
  phone: string;
  status?: string;
}
```

---

### 2. Create a Service
Inside `services/`, create a new service file (e.g., `members.service.ts`).

The service should:
- Import `HttpService` for API communication.
- Use **signals** to manage local state (`ApiState`).
- Provide CRUD methods (`getAll`, `getById`, `create`, `update`, `delete`).

Example:
```ts
@Injectable({ providedIn: 'root' })
export class MembersService {
  membersState = signal<ApiState<ApiResponse<Member[]>>>({
    loading: false,
    response: null,
    error: null,
  });

  memberState = signal<ApiState<ApiResponse<Member>>>({
    loading: false,
    response: null,
    error: null,
  });

  constructor(private http: HttpService) {}

  getAll(): Observable<ApiResponse<Member[]>> {
    return this.http.get<ApiResponse<Member[]>>('members', this.membersState());
  }

  getById(id: number): Observable<ApiResponse<Member>> {
    return this.http.get<ApiResponse<Member>>(`members/${id}`, this.memberState());
  }

  create(member: Partial<Member>): Observable<ApiResponse<Member>> {
    return this.http.post<ApiResponse<Member>>('members', member, {
      context: new HttpContext().set(ENABLE_SUCCESS, true),
    });
  }

  update(id: number, member: Partial<Member>): Observable<ApiResponse<Member>> {
    return this.http.put<ApiResponse<Member>>(`members/${id}`, member, {
      context: new HttpContext().set(ENABLE_SUCCESS, true),
    });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`members/${id}`, {
      context: new HttpContext().set(ENABLE_SUCCESS, true),
    });
  }
}
```

---

### 3. Use Context Tokens
Context tokens control interceptor behavior (loading, success messages, error handling).  
They are declared in `core/interceptors/http-context-tokens.ts`. `ENABLE_LOADING` and `ENABLE_ERROR` are true by default
and `ENABLE_SUCCESS` is false by default this means every time there is an http request loading will trigger and if there is an error error message will show
and if you want to show success message you should change `ENABLE_SUCCESS` to true like in the example 
```ts
export const ENABLE_LOADING = new HttpContextToken<boolean>(() => true);
export const ENABLE_ERROR = new HttpContextToken<boolean>(() => true);
export const ENABLE_SUCCESS = new HttpContextToken<boolean>(() => false);
```

Usage inside a request:
```ts
this.http.post('endpoint', body, {
  context: new HttpContext().set(ENABLE_SUCCESS, true),
});
```

---

### 4. State Management with Signals
Each service manages its own state using Angular’s `signal`.

Pattern:
```ts
entityListState = signal<ApiState<ApiResponse<Entity[]>>>({
  loading: false,
  response: null,
  error: null,
});

entityState = signal<ApiState<ApiResponse<Entity>>>({
  loading: false,
  response: null,
  error: null,
});
```

---

### 5. Connect to Components
- Inject your service in the component.
- Use `async` pipe in templates where possible.
- Always **subscribe in the component** that uses the service:
- Use `takeUntilDestroyed` (Angular 16+)
- Angular gives you a built-in way to auto-unsubscribe when the component is destroyed:
- `takeUntilDestroyed()` needs to run inside Angular’s injection context (constructor, field initializer, or with `DestroyRef`).
- You must use `(DestroyRef)` with a normal method `(fetch)`, because Angular doesn’t know which injection context to bind it to.

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MembersComponent implements OnInit{
  private destroyRef = inject(DestroyRef); // 👈 add this
  private membersService = inject(MembersService);

  ngOnInit(): void {
    this.fetch();
  }
  fetch(filterBody?: TableFilterBody) {
    this.membersService
      .getAll(filterBody)
      .pipe(takeUntilDestroyed(this.destroyRef)) // 👈 pass DestroyRef
      .subscribe();
  }
}
```


---

## ✅ Best Practices
- Always define a **model** before creating the service.
- Use **signals** for local state instead of `BehaviorSubject`.
- Always wrap API calls with `HttpService` (never use `HttpClient` directly).
- Use **context tokens** to control interceptors instead of hardcoding logic.

---

## 🚀 Creating a New Feature (Quick Checklist)
1. Create a `models/your-feature.model.ts`.
2. Create a `services/your-feature.service.ts`.
3. Add CRUD methods using `HttpService`.
4. Use `signal` for state management.
5. Apply `ENABLE_SUCCESS`, `DISABLE_ERROR`, `DISABLE_LOADING` where needed.
6. Connect service state to components.

---

Now you can easily add new features following the **MembersService** pattern.

