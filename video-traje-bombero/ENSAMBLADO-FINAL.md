# Instrucciones de Ensamblado Final

## Video actual
`video-traje-bombero-elkhart.mp4` — slideshow con Ken Burns zoom (30s, 1080×1920, sin audio)

## Para agregar voz + música + subtítulos

### Paso 1: Grabar voz en off
Texto exacto (archivo: `voz.mp3` o `voz.wav`):
```
Cuando el fuego supera los mil grados,
cada costura cuenta.
Cada capa protege.
Nomex. Kevlar. PBI.
Diseñado para resistir lo que nadie más soporta.
Bandas reflectivas que guían en la oscuridad total.
Barrera térmica que detiene el calor antes de que llegue a tu piel.
No es solo un traje.
Es la diferencia entre volver a casa, o no.
Equipo estructural certificado NFPA 1971.
Gama de México.
```

### Paso 2: Agregar música de fondo
Descargar música épica/industrial libre de derechos. Guardar como `musica.mp3`.

### Paso 3: Ensamblar audio + video
```bash
# Mezclar voz (-6dB) + música (-18dB)
ffmpeg -y \
  -i voz.mp3 -i musica.mp3 \
  -filter_complex "[0:a]volume=0.5[v];[1:a]volume=0.125[m];[v][m]amix=inputs=2:duration=first" \
  audio-mix.mp3

# Combinar video + audio
ffmpeg -y \
  -i video-traje-bombero-elkhart.mp4 \
  -i audio-mix.mp3 \
  -c:v copy -c:a aac -b:a 192k \
  -shortest \
  video-FINAL-traje-bombero.mp4
```

### Paso 4: Subtítulos
El archivo `subtitulos.srt` está listo. Se puede importar en:
- CapCut (automático)
- DaVinci Resolve (importar SRT)
- Premiere Pro (importar captions)
- O subir directamente a Instagram/TikTok como subtítulos

## Archivos entregados
```
video-traje-bombero/
├── GUION.md                          ← Guion completo
├── PROMPTS-VIDEO-SORA.md             ← 8 prompts listos para Sora/Runway
├── REDES-SOCIALES.md                 ← Título, descripción SEO, hashtags
├── ENSAMBLADO-FINAL.md               ← Este archivo
├── subtitulos.srt                    ← Subtítulos sincronizados
├── video-traje-bombero-elkhart.mp4   ← Video slideshow (sin audio)
├── concat.txt                        ← Config de ffmpeg
└── frames/                           ← 8 imágenes 1080×1920
    ├── 01-escena1-fuego-hook.png
    ├── 02-escena2-silueta-bombero.png
    ├── 03-escena3-macro-tela-nomex.png
    ├── 04-escena4-barrera-termica-capas.png
    ├── 05-escena5-combate-accion.png
    ├── 06-escena6-reflectivos-noche.png
    ├── 07-escena7-retrato-bombero.png
    └── 08-escena8-producto-traje-completo.png
```
