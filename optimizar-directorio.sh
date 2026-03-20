#!/bin/bash
# Optimizar imágenes del directorio de empresas — PNG → AVIF 1200×675
# Uso: ./optimizar-directorio.sh
# Draco 🐉 — 2026-03-19

DIR="public/img/directorio/empresas"
COUNT=0
ERRORS=0

echo "🐉 Optimizando imágenes del directorio..."
echo ""

for f in "$DIR"/*.png "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.webp; do
  [ -f "$f" ] || continue
  
  slug=$(basename "$f" | sed 's/\.\(png\|jpg\|jpeg\|webp\)$//')
  output="$DIR/${slug}.avif"
  
  if [ -f "$output" ]; then
    echo "⏭️  Ya existe: $slug.avif"
    continue
  fi
  
  echo -n "🔄 $slug..."
  npx sharp-cli -i "$f" -o "$output" --format avif -mq 70 resize 1200 675 2>/dev/null
  
  if [ $? -eq 0 ]; then
    echo " ✅"
    COUNT=$((COUNT + 1))
    # Eliminar el original después de convertir
    rm "$f"
  else
    echo " ❌ ERROR"
    ERRORS=$((ERRORS + 1))
  fi
done

echo ""
echo "📊 Resultado: $COUNT convertidas, $ERRORS errores"

# Actualizar los .md con las nuevas rutas
echo ""
echo "🔄 Actualizando rutas en fichas .md..."
UPDATED=0

for md in src/content/empresas-certificadas/*.md; do
  slug=$(grep "slug:" "$md" | head -1 | sed 's/slug: *"//;s/"//g' | tr -d ' ')
  avif="$DIR/${slug}.avif"
  
  if [ -f "$avif" ]; then
    # Verificar si aún tiene el placeholder
    if grep -q 'imagen: "/img/gama-de-mexico.avif"' "$md"; then
      sed -i '' "s|imagen: \"/img/gama-de-mexico.avif\"|imagen: \"/img/directorio/empresas/${slug}.avif\"|" "$md"
      echo "✅ Actualizado: $slug"
      UPDATED=$((UPDATED + 1))
    fi
  fi
done

echo ""
echo "📊 Fichas actualizadas: $UPDATED de 53"
echo "🐉 Listo!"
