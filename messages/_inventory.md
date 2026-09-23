# Message catalog inventory

Output:

- `messages/en.json`
- `messages/ar.json`

Both files share an identical nested key structure. Values are locale-specific. Keep keys in sync when adding copy.

## Namespaces

| Namespace | Notes |
|---|---|
| `Metadata` | Root title template (`appName`, `title`, `description`) |
| `Common` | Shared chrome plus `breadcrumb`, `error`, `forbidden`, `notFound` |
| `Nav` | Sidebar titles (`titleKey` in `config/navigation.ts`) |
| `Auth` | Login page + `loginForm` (fields, validation, submitting) |
| `Crud` | Confirm/cancel/save/errors for `src/lib/forms` |
| `Dashboard` | Home page sections and module cards |
| `Filters` | Filter primitives + demo pages |
| `Forms` | Forms index + demo pages + uploader/editor strings |
| `Charts` | Charts pages + chart-data labels |
| `Table` | Table demo, product rows, `empty`, `selection.*`, `bulk.*` |
| `Settings` | Settings hub + dark-theme presets |
| `User` | Demo user display name/email |

## Notes

- Add every new key to **both** catalogs.
- ICU/`next-intl` placeholders in use include `{count}`, `{ms}`, `{maxFiles}`, `{maxImages}`, `{maxSize}`, `{name}`, `{label}`, `{percent}`, `{appName}`.
- Shared table chrome (`empty`, `selection.*`) lives in `Table`. Entity column headers stay in the entity namespace when you add real modules.
- `Crud` is consumed by `FormDialog` / `ConfirmDialog` / `FormErrors` / `runAction` fallbacks.
- `Auth.loginForm` is consumed by `Login_FR` + `createLoginSchema`.
