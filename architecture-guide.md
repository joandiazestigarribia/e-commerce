# 🛡️ Guía de Arquitectura (Específica)

## 🎯 Objetivo
Base reusable para crear apps React con estructura escalable, reglas claras y ejemplos listos para copiar. Úsalo como contexto en Cursor.

---

## 📦 Estructura de carpetas (estable)
```
src/
├── app/               # Router, layouts de app, providers, rutas
├── components/        # UI compartida + patrones (cva, radix)
├── features/          # Módulos por dominio (aislados)
├── hooks/             # Hooks compartidos
├── lib/               # Integraciones (api-client, auth, react-query)
├── testing/           # Mocks MSW, utils, setup tests y e2e
├── types/             # Tipos globales (API/DTOs)
├── utils/             # Helpers (cn, format, etc)
└── assets/            # Estáticos (svgs, imágenes)
```

¿Quieres que lo adapte a Next.js o que te genere una versión con “backend real” acoplado a estos contratos?

- Cambios clave propuestos:
  - Reglas ESLint concretas y extractos listos.
  - Env exactos y comandos reales del proyecto.
  - Contratos de API y formas de error esperadas.
  - Patrones específicos de React Query (invalidate + prefetch + infinite).
  - Snippets de UI/Forms y pautas de seguridad/a11y/performance.
  - Guía práctica para usarlo como contexto en Cursor.

---

## 🧭 Reglas de imports (ESLint)
- Prohibir cross-feature + flujo unidireccional + orden de imports + convenciones de nombres.

```js
// .eslintrc.cjs (extracto)
'rules': {
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        { target: './src/features/auth',        from: './src/features', except: ['./auth'] },
        { target: './src/features/comments',    from: './src/features', except: ['./comments'] },
        { target: './src/features/discussions', from: './src/features', except: ['./discussions'] },
        { target: './src/features/teams',       from: './src/features', except: ['./teams'] },
        { target: './src/features/users',       from: './src/features', except: ['./users'] },
        // Unidireccional
        { target: './src/features', from: './src/app' },
        // Shared solo se importa desde app/features
        {
          target: ['./src/components','./src/hooks','./src/lib','./src/types','./src/utils'],
          from: ['./src/features','./src/app'],
        },
      ],
    },
  ],
  'import/no-cycle': 'error',
  'import/order': ['error', { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } }],
  'check-file/filename-naming-convention': ['error', { '**/*.{ts,tsx}': 'KEBAB_CASE' }, { ignoreMiddleExtensions: true }],
}
```

---

## ⚙️ Configuración de entorno (.env)
- Los env se leen con prefijo `VITE_APP_` y se validan con Zod (`src/config/env.ts`).

```env
# Frontend
VITE_APP_API_URL=http://localhost:8080
VITE_APP_ENABLE_API_MOCKING=true
VITE_APP_APP_URL=http://localhost:3000
VITE_APP_APP_MOCK_API_PORT=8080
```

---

## 🧪 Testing y mocks
- Unit/Integration: Vitest + Testing Library (`src/testing/setup-tests.ts`).
- E2E: Playwright (`apps/react-vite/e2e/`), inicia app y usa estado de auth.
- Mocks API: MSW (browser + node), DB con `@mswjs/data` y persistencia local.

Comandos clave (package.json):
- Dev: `yarn dev`
- Tests unitarios: `yarn test`
- Storybook: `yarn storybook`
- E2E: `yarn test-e2e` (levanta mock server con `run-mock-server`)
- Mock server (Node): `yarn run-mock-server`

Habilitar mocks en runtime:
- `enableMocking()` en `src/main.tsx` usa MSW en dev.
- Servidor mock Express (`mock-server.ts`) para e2e/local.

---

## 🔐 Autenticación y autorización
- Auth centralizado en `src/lib/auth.tsx` con `react-query-auth`.
- Cookies con credenciales (`api-client.ts` establece `withCredentials`).
- En 401, redirect automático a login con `redirectTo`:
```ts
// src/lib/api-client.ts (extracto)
if (error.response?.status === 401) {
  const redirectTo = new URLSearchParams().get('redirectTo') || window.location.pathname;
  window.location.href = paths.auth.login.getHref(redirectTo);
}
```
- Roles: `ADMIN` | `USER` (`src/lib/authorization.tsx`).
- Autorización por:
  - Roles: `<Authorization allowedRoles={[ROLES.ADMIN]}>`
  - Políticas: `POLICIES['comment:delete'](user, comment)`

---

## 🌐 API: contratos mínimos
Tipos compartidos (`src/types/api.ts`):
```ts
type User = {
  id; createdAt; firstName; lastName; email; role: 'ADMIN'|'USER'; teamId; bio;
}
type Team = { id; createdAt; name; description; }
type Discussion = { id; createdAt; title; body; teamId; author: User; }
type Comment = { id; createdAt; body; discussionId; author: User; }
type Meta = { page; total; totalPages; }
type AuthResponse = { jwt: string; user: User; }
```

Endpoints esperados por el frontend:
- Auth: `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`, `GET /auth/me`
- Users: `GET /users`, `PATCH /users/profile`, `DELETE /users/:userId`
- Teams: `GET /teams`
- Discussions: `GET /discussions?page`, `GET /discussions/:id`, `POST /discussions`, `PATCH /discussions/:id`, `DELETE /discussions/:id`
- Comments: `GET /comments?discussionId&page`, `POST /comments`, `DELETE /comments/:id`

Errores esperados:
```json
{ "message": "Human readable error" }
```

---

## 🔁 Estado del servidor (React Query)
Config por defecto (`staleTime`, `retry`, etc.) en `src/lib/react-query.ts`.

- Queries con opciones reusables:
```ts
export const getDiscussionsQueryOptions = ({ page }: { page?: number } = {}) =>
  queryOptions({ queryKey: page ? ['discussions', { page }] : ['discussions'], queryFn: () => getDiscussions(page) });
```

- Invalidation/prefetching:
```ts
// Prefetch al hover (mejora UX)
queryClient.prefetchQuery(getDiscussionQueryOptions(id));
// Invalidate tras mutación
queryClient.invalidateQueries({ queryKey: getDiscussionsQueryOptions().queryKey });
```

- Infinite queries para comentarios:
```ts
infiniteQueryOptions({
  queryKey: ['comments', discussionId],
  queryFn: ({ pageParam = 1 }) => getComments({ discussionId, page: pageParam }),
  getNextPageParam: (last) => last.meta.page === last.meta.totalPages ? undefined : last.meta.page + 1,
});
```

---

## 🧱 UI: patrones y componentes base
- Variantes con `class-variance-authority` (ej: `Button`, `Drawer`, `Dialog`).
- Formularios con `React Hook Form` + `Zod` y wrappers accesibles (`Form`, `FormItem`, `FormLabel`, `FormMessage`, etc.).
- Notificaciones globales con Zustand (`useNotifications`).
- Markdown seguro con DOMPurify (`MDPreview`).
- Tablas con paginación accesible (`components/ui/table`).

Snippet botón (cva):
```tsx
<Button variant="outline" size="sm" isLoading icon={<Icon/>}>Text</Button>
```

Snippet formulario:
```tsx
<Form schema={schema} onSubmit={handle}>
  {({ register, formState }) => (
    <>
      <Input label="Email" registration={register('email')} error={formState.errors.email} />
      <Button type="submit">Submit</Button>
    </>
  )}
</Form>
```

---

## 📐 Estilo, accesibilidad y performance
- Accesibilidad: Radix primitives + roles/aria en componentes (diálogos/drawers/menus).
- Performance:
  - `staleTime` agresivo para listas
  - Prefetch en hover para detalles
  - Lazy routes con `createBrowserRouter` (rutas `lazy`)
  - Evitar barrel files en `features` (mejor tree-shaking)
- Seguridad:
  - Sanitizar HTML del MD (`DOMPurify`)
  - Nunca interpolar HTML sin sanitizar
- CSS: Tailwind + tokens en `src/index.css` (variables HSL y dark mode).

---

## 🧰 Productividad
- Generador de componentes (Plop):
```bash
yarn generate  # crea componente en feature o en components/
```
- Storybook para documentación visual:
```bash
yarn storybook
```

---

## 🔄 Integrar backend real (opcional)
- Cambiar `VITE_APP_API_URL` al servidor real.
- Mantener mismo contrato: respuestas `{ data, meta }` y errores `{ message }`.
- CORS: permitir `origin = APP_URL`, `credentials = true`.
- Cookies seguras en prod (HttpOnly, Secure, SameSite), y 401 consistente.

---

## ✅ Checklist de calidad
- Lint limpio (`yarn lint`) y TS sin errores (`yarn check-types`).
- Tests unit/integration verdes (`yarn test`) y e2e (`yarn test-e2e`).
- A11y básica en componentes interactivos.
- Imports sin ciclos y sin cross-feature.
- Rutas `lazy` + prefetch en listas.
- README con cómo correr dev/ci/e2e/mock.

---

## 🧭 Cómo usar este archivo con IA (Cursor)
1. Mantén este archivo en el repo (ej. `bulletproof-react-architecture-guide.md`).
2. Áncora este archivo como contexto en el chat.
3. En cada petición, referencia secciones: “según ‘Estado del servidor (React Query)’ añade prefetch…” o “usa ‘Reglas de imports’”.
4. Pide siempre que los nuevos módulos respeten la estructura y reglas de ESLint.