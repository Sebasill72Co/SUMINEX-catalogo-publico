# Catálogo público SUMINEX

Esta carpeta contiene exclusivamente el catálogo estático publicable. No contiene inventario, clientes, finanzas, credenciales ni código administrativo.

## Publicación

La entrada es `index.html` y todas las rutas son relativas, por lo que funciona bajo una ruta de proyecto como:

`https://usuario.github.io/SUMINEX/`

GitHub Pages debe apuntar a una fuente que publique **solo esta carpeta**. Si el repositorio administrativo permanece privado o Pages no permite seleccionar esta carpeta directamente, use una rama de publicación dedicada o solicite autorización antes de crear un repositorio público separado.

## Fotografías

Las 28 imágenes están en `assets/images/products/`, organizadas por referencia. Para reemplazar una fotografía conserve exactamente el nombre, extensión, carpeta y proporción del archivo existente. Los logos están en `assets/images/brand/`.

Después de un cambio ejecute:

```bash
node scripts/verificar-catalogo-publico.mjs
```

## Formas de compartir

- Web: comparta preferentemente la URL pública.
- Descargable: use `entregas/SUMINEX-catalogo-compartible.html`, que lleva imágenes y código embebidos.

Una previsualización de un HTML adjunto en WhatsApp no sustituye el alojamiento web.
