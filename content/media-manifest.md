# Media manifest

Assets under `public/media/`. Prefer calm loops; no frantic GIFs yet.

## atmosphere

| File | Source | Query / prompt | Notes |
|------|--------|----------------|-------|
| `skyline.png` | logo-generator (gpt-image-1) | dark night city skyline teal/amber | Title backdrop |

## encounters

| File | Source | Query | Notes |
|------|--------|-------|-------|
| `times-square.jpg` | Wikimedia | Times Square | Hook slide |
| `times-square-2.jpg` | Wikimedia | Times Square | Spare |
| `shibuya.jpg` | Wikimedia | Shibuya crossing | Spare city visual |

## chess

| File | Source | Query / prompt | Notes |
|------|--------|----------------|-------|
| `pieces.jpg` | Wikimedia | chess pieces | Hook backdrop |
| `king.png` | logo-generator | chess king silhouette teal glow | Spare |

## war

| File | Source | Query / prompt | Notes |
|------|--------|----------------|-------|
| `dice.jpg` | Wikimedia | dice cubes | Spare |
| `map.png` | logo-generator | stylized world map teal/amber | Hook backdrop |

## dogs

| File | Source | Query | Notes |
|------|--------|-------|-------|
| `silhouette.png` | Wikimedia | dog silhouette | Ethics slide; neutral framing |

## Gaps / follow-up

Wikimedia rate-limited mid-run (João Pessoa, Paulista, Risk board). Re-run with `pictures/wikimedia` or Pexels when keys available:

```bash
python wikimedia/main.py "João Pessoa beach" -n 2 -o /tmp/prob-media
python pexels/main.py "recife brazil" -n 3 -o /tmp/prob-media
```

Copy into `public/media/encounters/` and wire via `MediaBackdrop`.
