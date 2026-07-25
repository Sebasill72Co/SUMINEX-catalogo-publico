# Catálogo público SUMINEX

Esta carpeta contiene exclusivamente el catálogo estático publicable. No contiene inventario, clientes, finanzas, credenciales ni código administrativo.

## Publicación

La entrada es `index.html` y todas las rutas son relativas, por lo que funciona bajo una ruta de proyecto como:

`https://sebasill72co.github.io/SUMINEX-catalogo-publico/`

Este contenido se publica desde el repositorio público separado `SUMINEX-catalogo-publico`. El repositorio administrativo permanece privado.

La tarifa mayorista se activa desde 12 unidades combinadas, incluso si pertenecen a referencias o colores distintos.

Auditoría Orden 04: el repositorio contiene exclusivamente el catálogo comercial; el sistema administrativo permanece fuera de este repositorio.

## Fotografías

Las 28 imágenes están en `assets/images/products/`, organizadas por referencia. Para reemplazar una fotografía conserve exactamente el nombre, extensión, carpeta y proporción del archivo existente. Los logos están en `assets/images/brand/`.

Después de un cambio ejecute:

```bash
node scripts/verificar-catalogo-publico.mjs
node scripts/probar-umbral-mayorista.mjs
```

## Formas de compartir

- Web: comparta preferentemente la URL pública.
- Descargable: use `entregas/SUMINEX-catalogo-compartible.html`, que lleva imágenes y código embebidos.

Una previsualización de un HTML adjunto en WhatsApp no sustituye el alojamiento web.
