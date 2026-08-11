# Security Hardening (ToB Website)

Este documento resume las configuraciones de seguridad implementadas en el proyecto del Technology On Business (ToB) para prevenir ataques comunes. Como este sitio web es puramente estático (sin backend, base de datos o autenticación), el enfoque principal es disuadir comportamientos maliciosos y proteger el entorno del cliente.

## 1. Configuración de Headers (Vercel)
Se agregaron headers HTTP estrictos a través del archivo `vercel.json`:
- **Content-Security-Policy (CSP)**: Limita la ejecución de scripts a los dominios del proyecto y al CDN de Cloudflare (GSAP), mitigando el riesgo de XSS. Se restringieron object-src, base-uri y se desactivó el embedding de la página (frame-ancestors).
- **X-Content-Type-Options: nosniff**: Evita ataques de confusión de tipo MIME.
- **X-Frame-Options: DENY**: Protege contra Clickjacking evitando que el sitio se cargue dentro de iframes.
- **Referrer-Policy**: `strict-origin-when-cross-origin` para controlar qué información de navegación se envía en enlaces externos.
- **Permissions-Policy**: Restringe el acceso a la cámara, micrófono y geolocalización, que no son necesarios para este evento.

## 2. Redirección y Limpieza de HTML
- El script de redirección embebido en `index.html` ha sido reemplazado por una redirección permanente y directa desde la configuración de Vercel (evitando ejecución de código para esto).

## 3. Minificación en Producción
- Se configuró un entorno de `build` en Vercel (usando `package.json` y `build.js` con *Terser*) para minificar el código de JavaScript. Esto dificulta el análisis rápido de vulnerabilidades en producción, manteniendo la legibilidad y facilidad de desarrollo del código fuente en local.

## 4. Prevención de Tabnabbing
- A todos los enlaces con atributos `target="_blank"` se les agregó automáticamente la propiedad `rel="noopener noreferrer"`. Esto protege a los usuarios en caso de que hagan clic en un enlace externo que los lleve a un sitio comprometido, previniendo que dicho sitio malicioso pueda secuestrar la pestaña original.

## 5. Subresource Integrity (SRI)
- Se añadieron validaciones de integridad (hashes SHA384) a los scripts externos cargados desde CDN (GSAP y ScrollTrigger). De este modo, si la red de distribución de contenidos fuera vulnerada e inyectaran código malicioso en esas librerías, el navegador se negaría a cargarlas.

## 6. Prevención de Self-XSS (Social Engineering)
- Se agregó una advertencia llamativa en la consola del navegador que indica a los usuarios que pegar código en dicha ventana puede exponerlos a ataques (Self-XSS).

## 7. Manejo del DOM
- El código en JS fue validado para asegurar que los pocos usos de `.innerHTML` son completamente seguros y estáticos (no reciben ni parsean datos desde URLs o inputs del usuario).
