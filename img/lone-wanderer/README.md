# THE LONE WANDERER: formato de entrega

Esta carpeta recibe las 38 cartas de THE LONE WANDERER. Mientras no exista su
línea en `app.js`, nada de aquí aparece en el sitio.

## Imágenes

| | Formato que ya usa la web (img/coleccion) |
|---|---|
| Archivo | `.webp`, calidad 88 |
| Tamaño | lado largo = **1100 px**; una pieza 2:3 vertical queda en **738 × 1100** |
| Peso | ~100–150 KB por carta (hoy van de 15 a 300 KB, promedio 107) |
| Nombre | `lw-001.webp` … `lw-038.webp` (minúsculas, sin espacios) |

Desde los PNG de 3392 × 5056 (Pillow):

```python
from PIL import Image
im = Image.open("lw-001.png").convert("RGB")
im.thumbnail((1100, 1100))          # 3392×5056 → 738×1100
im.save("lw-001.webp", quality=88)
```

Los PNG originales NO se suben al repo (son ~5 MB cada uno y la web no los usa).
Si hace falta guardarlos aquí, van en `originales/`, que está en `.gitignore`.

## Cómo es una carta (app.js, no config.js)

`config.js` sólo guarda el precio del mint y los links. Las cartas son objetos en
`app.js`; la colección de RONIN está en `RONIN_NFTS`:

```js
{dir:'lone-wanderer', f:'lw-001', t:'Nombre de la carta', jt:'漢字', r:'Rare', e:150, p:0.9, fx:'clouds', bg:'shore', d:'Una línea de historia.'},
```

| Campo | Qué es | Obligatorio |
|---|---|---|
| `dir` | carpeta dentro de `img/` → `'lone-wanderer'` | sí (sin él busca en `img/coleccion`) |
| `f` | nombre del archivo sin `.webp` | sí |
| `t` | nombre (= `name` de su JSON) | sí |
| `r` | rareza, EXACTAMENTE `Common`, `Rare`, `Epic` o `Legendary` (otra palabra rompe colores y probabilidades) | sí |
| `e` | ediciones de esa carta; suman al total y definen la probabilidad en Draw | sí |
| `p` | valor estimado en SOL (se muestra en el detalle y genera los Listings de ejemplo) | sí |
| `d` | descripción de una línea | sí |
| `jt` | título en japonés bajo el nombre | opcional |
| `fx` | partículas del detalle: `petals` `leaves` `clouds` `seeds` `rays` `dust` `bubbles` `snow` `embers` | sí |
| `bg` | escena de fondo del detalle, una de `img/escenas/` (ej. `shore`, `meadow`, `stillness`, `cedar-path`, `above-clouds`, `bamboo`, `falls`, `dojo`, `sumi`) | sí, si no, el fondo sale vacío |
| `wide:1` | sólo si la pieza es horizontal | no |

Del JSON estilo OpenSea/Metaplex: `name` → `t`, `description` → `d`,
el atributo `Rarity` → `r` (mapeado a las 4 palabras de arriba),
`image` (`lw-001.png`) → `f:'lw-001'`.

Al agregarlas:
- **Inicio:** sigue mostrando las primeras 7 cartas.
- **Cards:** las agrupa por rareza.
- **Draw:** recalcula las probabilidades con `e`.
- **Listings:** crea 2 ejemplos por carta (1 si es Legendary).
