#!/usr/bin/env python3
"""
Script para procesar imágenes de Mangueras Blindex contra Incendios
Reemplaza placeholders con imágenes reales, convierte a AVIF 40-45%
"""

import os
import glob
from PIL import Image
import pillow_avif

# Configuración
IMG_DIR = "/Users/carsolio/Desktop/PAGINAS-HTML/gamademexico-astro/public/img/mangueras-contra-incendios"
HERO_SIZE = (600, 450)
QUALITY = 42

# Productos de mangueras - SOLO BLINDEX
PRODUCTS = {
    "manguera-blindex-1-5-15m": ["frontal", "enrollada", "detalle", "gabinete", "instalada"],
    "manguera-blindex-1-5-30m": ["frontal", "detalle", "capas", "industrial", "instalacion"],
    "manguera-blindex-2-5-15m": ["frontal", "enrollada", "conexion", "brigada", "modular"],
    "manguera-blindex-2-5-30m": ["frontal", "enrollada", "capas", "brigada", "refineria"],
    "manguera-blindex-afff": ["frontal", "detalle", "espuma", "aplicacion", "aeropuerto"],
    "manguera-blindex-nitrilo": ["frontal", "detalle", "corte", "quimica", "laboratorio"],
    "manguera-blindex-pemex": ["frontal", "certificacion", "documentos", "brigada", "refineria"],
    "manguera-blindex-storz": ["frontal", "conexion", "acople", "brigada", "refineria"],
}

def get_source_images():
    """Obtiene todas las imágenes fuente nuevas"""
    patterns = [
        os.path.join(IMG_DIR, "Whisk_*.png"),
        os.path.join(IMG_DIR, "Whisk_*.jpeg"),
        os.path.join(IMG_DIR, "Captura de pantalla*.png"),
        os.path.join(IMG_DIR, "task_*.webp")
    ]

    images = []
    for pattern in patterns:
        images.extend(glob.glob(pattern))

    # Eliminar duplicados (archivos con (1) en el nombre)
    unique_images = []
    seen_bases = set()
    for img in sorted(images):
        base = os.path.basename(img).replace(" (1)", "").replace("(1)", "").replace("-1.webp", ".webp")
        if base not in seen_bases:
            unique_images.append(img)
            seen_bases.add(base)

    return unique_images

def process_image(source_path, dest_path, size=HERO_SIZE):
    """Procesa una imagen: redimensiona y convierte a AVIF"""
    try:
        with Image.open(source_path) as img:
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')

            img_ratio = img.width / img.height
            target_ratio = size[0] / size[1]

            if img_ratio > target_ratio:
                new_height = size[1]
                new_width = int(new_height * img_ratio)
            else:
                new_width = size[0]
                new_height = int(new_width / img_ratio)

            img = img.resize((new_width, new_height), Image.LANCZOS)

            left = (new_width - size[0]) // 2
            top = (new_height - size[1]) // 2
            img = img.crop((left, top, left + size[0], top + size[1]))

            img.save(dest_path, 'AVIF', quality=QUALITY)
            return os.path.getsize(dest_path)
    except Exception as e:
        print(f"  Error: {e}")
        return 0

def main():
    print("=" * 70)
    print("  PROCESADOR DE IMÁGENES - MANGUERAS BLINDEX")
    print("=" * 70)

    source_images = get_source_images()
    print(f"\nImágenes fuente encontradas: {len(source_images)}")

    if len(source_images) == 0:
        print("No se encontraron imágenes para procesar")
        return

    total_original = sum(os.path.getsize(f) for f in source_images)
    print(f"Tamaño original: {total_original / (1024*1024):.2f} MB")

    # Eliminar SOLO imágenes AVIF de Blindex existentes (placeholders)
    print("\nEliminando placeholders existentes de Blindex...")
    old_images = glob.glob(os.path.join(IMG_DIR, "manguera-blindex-*.avif"))
    for old in old_images:
        os.remove(old)
    print(f"  Eliminados: {len(old_images)} archivos")

    total_processed = 0
    total_new_size = 0
    source_idx = 0

    for product_key, image_types in PRODUCTS.items():
        print(f"\n{'='*50}")
        print(f"Procesando: {product_key}")
        print(f"{'='*50}")

        for img_type in image_types:
            if source_idx >= len(source_images):
                source_idx = 0

            source_path = source_images[source_idx]
            dest_name = f"{product_key}-{img_type}.avif"
            dest_path = os.path.join(IMG_DIR, dest_name)

            short_source = os.path.basename(source_path)[:35]
            print(f"  {short_source}... -> {dest_name}")

            new_size = process_image(source_path, dest_path)
            if new_size > 0:
                total_new_size += new_size
                total_processed += 1

            source_idx += 1

    print(f"\n{'='*70}")
    print("RESUMEN")
    print(f"{'='*70}")
    print(f"Imágenes procesadas: {total_processed}")
    print(f"Tamaño original: {total_original / (1024*1024):.2f} MB")
    print(f"Tamaño nuevo: {total_new_size / 1024:.2f} KB")
    if total_original > 0:
        print(f"Reducción: {(1 - total_new_size/total_original)*100:.1f}%")

    # Eliminar imágenes fuente
    print(f"\nEliminando imágenes fuente...")
    all_sources = glob.glob(os.path.join(IMG_DIR, "Whisk_*"))
    all_sources += glob.glob(os.path.join(IMG_DIR, "Captura de pantalla*"))
    all_sources += glob.glob(os.path.join(IMG_DIR, "task_*"))
    for source in all_sources:
        os.remove(source)
    print(f"  Eliminados: {len(all_sources)} archivos fuente")

    print("\n¡Procesamiento completado!")

if __name__ == "__main__":
    main()
