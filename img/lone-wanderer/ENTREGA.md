# THE LONE WANDERER: entrega de las 38 cartas

Autor: Gregorio Sánchez Calderón. Personaje original (nombre interno Isao).

- 38 `.webp`, calidad 88, 738 × 1100 (lado largo 1100). Peso: 15–431 KB, promedio 106 KB.
- Rarezas (del atributo `Rarity` de cada JSON, sin remapear): Common 17, Rare 12, Epic 6, Legendary 3.
- `e` y `p` siguen los valores que ya usa RONIN por rareza: Common 200 / 0.5 SOL · Rare 150 / 0.9 · Epic 100 / 1.8 · Legendary 33 / 4.5. Ajusta a tu criterio.
- `d` es la primera frase de la descripción de cada JSON. `jt`, `fx` y `bg` los propuse yo (bg sale del `Environment` de cada pieza); revísalos.
- Las 38 líneas listas para pegar están en `cartas.js`. Este PR **no toca `app.js`**: nada aparece en el sitio hasta que las pegues.
- Ojo: la #035 se llama *Bamboo Rest*, igual que tu carta `bamboo`. Si quieres evitar el nombre repetido, cámbiale el `t`.

| # | f | t | jt | r | e | p | fx | bg | d |
|---|---|---|---|---|---|---|---|---|---|
| 001 | `lw-001` | The First Light | 初光 | Rare | 150 | 0.9 | petals | pink-field | Before the sun had a name, he was already awake. |
| 002 | `lw-002` | Silent Path | 静かな道 | Common | 200 | 0.5 | leaves | cedar-path | No one walks beside him. |
| 003 | `lw-003` | The Observer | 観る者 | Common | 200 | 0.5 | leaves | meadow | He cleans the scabbard before cleaning the blade, because what protects is tended first. |
| 004 | `lw-004` | Wandering Soul | 彷徨う魂 | Common | 200 | 0.5 | seeds | meadow | Seen from above, a man is only a line of intention crossing the water. |
| 005 | `lw-005` | The Beginning | 始まり | Common | 200 | 0.5 | clouds | above-clouds | The mountain measured him before he took the first step, and found him sufficient. |
| 006 | `lw-006` | Sakura Dreams | 桜の夢 | Epic | 100 | 1.8 | leaves | meadow | The cherry tree spends everything it has in a single week and regrets nothing. |
| 007 | `lw-007` | The Green Valley | 緑の谷 | Common | 200 | 0.5 | seeds | meadow | The valley is older than every name anyone gave it. |
| 008 | `lw-008` | The Forest Guardian | 森の守り人 | Common | 200 | 0.5 | leaves | cedar-path | He looks up and the trees do not look back. |
| 009 | `lw-009` | Blooming Silence | 咲く静寂 | Rare | 150 | 0.9 | petals | pink-field | He lay down among the flowers to see whether the world continued without him. |
| 010 | `lw-010` | Mountain Spirit | 山の霊 | Common | 200 | 0.5 | clouds | above-clouds | From here the ranges look like waves that decided to stop. |
| 011 | `lw-011` | The Blade | 刃 | Epic | 100 | 1.8 | dust | the-ground | The blade is honest: it shows him his own face and asks what he intends to do with it. |
| 012 | `lw-012` | Meditation | 瞑想 | Rare | 150 | 0.9 | bubbles | stillness | Stillness is not absence of movement. |
| 013 | `lw-013` | The Ronin | 浪人 | Common | 200 | 0.5 | dust | the-ground | The salt plain keeps no footprints. |
| 014 | `lw-014` | Inner Strength | 内なる力 | Rare | 150 | 0.9 | leaves | cedar-path | The circle in the dust is not a ritual. |
| 015 | `lw-015` | The Oath | 誓い | Legendary | 33 | 4.5 | dust | the-ground | He laid the blade down and knelt. |
| 016 | `lw-016` | The Storm | 嵐 | Rare | 150 | 0.9 | clouds | above-clouds | The storm does not single him out. |
| 017 | `lw-017` | Beyond Darkness | 闇の彼方 | Common | 200 | 0.5 | clouds | above-clouds | The mountain gives him no answer, and the silence turns out to be kinder than one. |
| 018 | `lw-018` | The Awakening | 目覚め | Epic | 100 | 1.8 | rays | stillness | The light broke through and did not ask whether he deserved it. |
| 019 | `lw-019` | After the Rain | 雨上がり | Common | 200 | 0.5 | leaves | cedar-path | The rain stopped and everything it touched kept shining. |
| 020 | `lw-020` | Rebirth | 再生 | Common | 200 | 0.5 | petals | pink-field | White flowers in a field that was ash. |
| 021 | `lw-021` | The Sacred Sun | 聖なる日 | Epic | 100 | 1.8 | rays | dojo | He does not pray to the sun. |
| 022 | `lw-022` | Eternal Peace | 永遠の安らぎ | Common | 200 | 0.5 | seeds | meadow | A small man on a large hill, doing nothing of consequence. |
| 023 | `lw-023` | The Moon | 月 | Rare | 150 | 0.9 | bubbles | stillness | The moon has been cut in half for as long as anyone remembers, and has never complained about it. |
| 024 | `lw-024` | The Sacred Tree | 御神木 | Rare | 150 | 0.9 | leaves | meadow | The rope around the trunk marks what must not be cut. |
| 025 | `lw-025` | The Inner Temple | 心の寺 | Rare | 150 | 0.9 | rays | dojo | The temple has no roof, no door and no priest. |
| 026 | `lw-026` | The Last Journey | 最後の旅 | Common | 200 | 0.5 | snow | sumi | He walks toward the horizon knowing it will not arrive. |
| 027 | `lw-027` | The Eternal Ronin | 永遠の浪人 | Rare | 150 | 0.9 | snow | sumi | The snow settles on his shoulders as if he were part of the landscape. |
| 028 | `lw-028` | Beyond the Mountains | 山の彼方 | Common | 200 | 0.5 | clouds | above-clouds | Beyond the mountains there are more mountains. |
| 029 | `lw-029` | The Final Bloom | 最後の花 | Common | 200 | 0.5 | petals | pink-field | The last flowers open in the snow, out of season and out of sense. |
| 030 | `lw-030` | The Lone Wanderer | 孤高の旅人 | Legendary | 33 | 4.5 | snow | sumi | The last stars are leaving and the crescent moon, the same shape cut into his sword guard, dissolves into the first light. |
| 031 | `lw-031` | Dry Grass Vigil | 枯れ野 | Rare | 150 | 0.9 | dust | the-ground | Seen from above, kneeling in dead grass, he is a brushstroke someone left on a photograph of the world. |
| 032 | `lw-032` | Daylight Crescent | 昼の三日月 | Epic | 100 | 1.8 | clouds | above-clouds | A moon that forgot to leave when morning came. |
| 033 | `lw-033` | Golden Larch Path | 落葉松の道 | Rare | 150 | 0.9 | leaves | cedar-path | The larches turn gold and drop everything, every year, without ceremony. |
| 034 | `lw-034` | Blossom Palm | 花の掌 | Rare | 150 | 0.9 | petals | pink-field | He raises an open hand and a petal lands in it. |
| 035 | `lw-035` | Bamboo Rest | 竹の休み | Common | 200 | 0.5 | leaves | bamboo | The bamboo creaks overhead like a house settling. |
| 036 | `lw-036` | Still Black Water | 黒き静水 | Legendary | 33 | 4.5 | bubbles | stillness | He let the black water hold him and stopped deciding. |
| 037 | `lw-037` | Pink Cosmos Cloud | 秋桜の雲 | Common | 200 | 0.5 | petals | pink-field | Pink to the horizon, clouds piled like something about to be said. |
| 038 | `lw-038` | Black Sand Tide | 黒砂の潮 | Epic | 100 | 1.8 | bubbles | shore | Black sand, white surf, and his sandals set neatly aside. |
