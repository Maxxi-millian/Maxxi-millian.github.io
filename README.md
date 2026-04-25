# 🚀 GitHub Portal - Tu Portafolio Autogestionado

Este es un portal personal dinámico para **Maxxi-millian** que se autogestiona utilizando tus repositorios públicos de GitHub. No necesitas editar código para añadir nuevos proyectos, descargas o secciones una vez configurado.

## 🛠️ Guía de Subida y Despliegue (Sin usar Git)

Como no quieres usar Git en tu PC, sigue estos pasos para subirlo directamente desde el navegador:

### 1. Crea el repositorio en GitHub
1. Entra en tu cuenta: [https://github.com/Maxxi-millian](https://github.com/Maxxi-millian).
2. Crea un nuevo repositorio llamado `Maxxi-millian.github.io` (o el nombre que prefieras). **Déjalo vacío, no añadas README ni .gitignore.**

### 2. Sube los archivos (Arrastrar y Soltar)
1. En la página de tu nuevo repositorio vacío, haz clic en el enlace que dice **"uploading an existing file"**.
2. **IMPORTANTE:** Selecciona todos los archivos de esta carpeta (incluyendo carpetas como `src`, `public`, `.github`, etc.) y arrástralos a la ventana de GitHub.
3. Espera a que se suban todos (puede tardar un minuto).
4. Escribe un mensaje de confirmación (ej: "Subida inicial") y dale al botón verde **"Commit changes"**.

### 3. ¡Despliegue Automático!
He configurado una "GitHub Action" en la carpeta `.github/workflows`.
1. Una vez que hayas subido los archivos, haz clic en la pestaña **"Actions"** de tu repositorio en GitHub.
2. Verás que hay un proceso en marcha llamado "Deploy to GitHub Pages".
3. Cuando termine (se ponga en verde), ve a **Settings > Pages**.
4. En "Build and deployment", asegúrate de que en "Branch" esté seleccionado **`gh-pages`** y la carpeta `/(root)`.
5. ¡Tu web estará online en unos segundos!

---

## 🏠 Cómo usar un Repo para el Inicio (Home)

Si quieres que el texto de la página de inicio se pueda cambiar desde GitHub sin tocar este código, haz lo siguiente:

1. Crea un repositorio llamado por ejemplo `home-content`.
2. Crea un archivo `portal.config.json` dentro de ese repo para definir el título y subtítulo del inicio.
3. El README de ese repo será el texto que aparezca en la descripción del inicio.
4. En este proyecto (el portal), abre `src/config/portal.ts` y cambia la opción `homeRepoName: 'home-content'`.

---

## 📂 Ejemplos de Configuración para tus Repos

Para que tus otros proyectos aparezcan en el portal, crea un archivo llamado `portal.config.json` en la raíz de esos repos:

### 🌟 Caso 1: Tarjeta Normal
```json
{
  "version": 1,
  "kind": "card",
  "title": "Mi Proyecto",
  "description": "Una descripción genial.",
  "section": "Herramientas",
  "icon": "code",
  "featured": true
}
```

### 🌐 Caso 2: Web Completa (Iframe)
```json
{
  "version": 1,
  "kind": "page",
  "title": "Ver Demo",
  "iframe": true,
  "icon": "globe"
}
```

---

## ❓ Preguntas Frecuentes
- **¿Puedo subirlo arrastrando?** ¡Sí! Acabo de dejarlo preparado para que al arrastrar la carpeta completa a GitHub, todo se configure solo.
- **¿Cómo cambio mi nombre?** Edita `src/config/portal.ts`.
