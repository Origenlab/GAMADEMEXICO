#!/usr/bin/env python3
"""
NeuronWriter SEO Analysis Script
================================
Analiza páginas de Astro contra recomendaciones de NeuronWriter API.

Uso:
  python3 scripts/neuronwriter-seo.py --query QUERY_ID --file src/pages/archivo.astro
  python3 scripts/neuronwriter-seo.py --list-queries
  python3 scripts/neuronwriter-seo.py --query QUERY_ID --recommendations

Configuración:
  Crear archivo .env con:
    NEURONWRITER_API_KEY=tu-api-key
    NEURONWRITER_PROJECT_ID=tu-project-id
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("Error: requests no instalado. Ejecuta: pip3 install requests")
    sys.exit(1)

# Configuración
API_BASE = "https://app.neuronwriter.com/neuron-api/0.5/writer"
API_KEY = os.environ.get("NEURONWRITER_API_KEY", "n-454030e38cf527b3a257b7780b9a4c1c")
PROJECT_ID = os.environ.get("NEURONWRITER_PROJECT_ID", "56bfecc8c4642d6b")

HEADERS = {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json"
}


def api_call(endpoint: str, data: dict) -> dict:
    """Llama a la API de NeuronWriter."""
    url = f"{API_BASE}/{endpoint}"
    response = requests.post(url, headers=HEADERS, json=data)
    return response.json()


def list_projects():
    """Lista todos los proyectos disponibles."""
    result = api_call("list-projects", {})
    print("\n📁 PROYECTOS NEURONWRITER\n" + "=" * 50)
    for p in result:
        print(f"  ID: {p['project']}")
        print(f"  Nombre: {p['name']}")
        print(f"  Idioma: {p['language']}")
        print(f"  Motor: {p['engine']}")
        print("-" * 50)


def list_queries():
    """Lista todas las queries del proyecto."""
    result = api_call("list-queries", {"project": PROJECT_ID})
    print(f"\n📝 QUERIES EN PROYECTO {PROJECT_ID}\n" + "=" * 60)
    if not result:
        print("  No hay queries creadas. Crea una en NeuronWriter primero.")
        return
    for q in result:
        print(f"  ID: {q['query']}")
        print(f"  Keyword: {q['keyword']}")
        print(f"  URL: {q['query_url']}")
        print("-" * 60)


def get_recommendations(query_id: str):
    """Obtiene y muestra las recomendaciones SEO de una query."""
    result = api_call("get-query", {"query": query_id})

    if "error" in result:
        print(f"Error: {result['error']}")
        return None

    print("\n" + "╔" + "═" * 60 + "╗")
    print(f"║  RECOMENDACIONES SEO - {result.get('keyword', 'N/A')[:40]:<40} ║")
    print("╚" + "═" * 60 + "╝")

    terms = result.get("terms", {})
    terms_txt = result.get("terms_txt", {})

    # Title
    print("\n📌 TITLE TAG - Incluir:")
    for t in terms.get("title", [])[:5]:
        print(f"   • {t['t']} ({t['usage_pc']}% competidores)")

    # H1
    print("\n📌 H1 - Incluir:")
    for t in terms.get("h1", [])[:5]:
        print(f"   • {t['t']} ({t['usage_pc']}% competidores)")

    # Keywords básicas
    print("\n📌 KEYWORDS BÁSICAS (frecuencia):")
    basic = terms_txt.get("content_basic_w_ranges", "").split("\n")
    for kw in basic[:15]:
        if kw.strip():
            print(f"   • {kw}")

    # Keywords extendidas
    print("\n📌 KEYWORDS EXTENDIDAS (usar 1x):")
    extended = terms_txt.get("content_extended", "").split("\n")
    for kw in extended[:20]:
        if kw.strip():
            print(f"   • {kw}")

    # Preguntas
    print("\n📌 PREGUNTAS A RESPONDER:")
    ideas = result.get("ideas", {})
    for q, info in list(ideas.get("topic_matrix", {}).items())[:7]:
        print(f"   [{info['importance']}/10] {q}")

    # Competidor
    print("\n📊 COMPETIDOR TOP:")
    comps = result.get("competitors", [])
    if len(comps) > 1:
        comp = comps[1]
    elif comps:
        comp = comps[0]
    else:
        comp = {}
    print(f"   URL: {comp.get('url', 'N/A')}")
    print(f"   Content Score: {comp.get('content_score', 'N/A')}")
    print(f"   Palabras: {comp.get('word_count', 'N/A')}")

    return result


def extract_text_from_astro(filepath: str) -> str:
    """Extrae el texto visible de un archivo Astro."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remover frontmatter
    content = re.sub(r'^---[\s\S]*?---', '', content)
    # Remover scripts
    content = re.sub(r'<script[\s\S]*?</script>', '', content)
    # Remover tags HTML
    content = re.sub(r'<[^>]+>', ' ', content)
    # Remover entidades HTML
    content = re.sub(r'&[a-z]+;', ' ', content)
    # Limpiar espacios
    content = re.sub(r'\s+', ' ', content)

    return content.strip()


def analyze_content(query_id: str, filepath: str):
    """Analiza un archivo Astro contra las recomendaciones de NeuronWriter."""
    # Obtener recomendaciones
    result = api_call("get-query", {"query": query_id})

    if "error" in result:
        print(f"Error: {result['error']}")
        return

    # Extraer contenido
    if not os.path.exists(filepath):
        print(f"Error: Archivo no encontrado: {filepath}")
        return

    content = extract_text_from_astro(filepath).lower()
    word_count = len(content.split())

    print("\n" + "╔" + "═" * 60 + "╗")
    print(f"║  ANÁLISIS SEO: {os.path.basename(filepath):<42} ║")
    print(f"║  Query: {result.get('keyword', 'N/A')[:49]:<49} ║")
    print("╚" + "═" * 60 + "╝")

    # Métricas generales
    comps = result.get("competitors", [])
    comp_words = comps[1].get("word_count", 1500) if len(comps) > 1 else 1500

    print(f"\n📊 MÉTRICAS GENERALES")
    print(f"   Palabras: {word_count}")
    print(f"   Objetivo: {comp_words}+")
    print(f"   Status: {'✅ CUMPLE' if word_count >= comp_words else '⚠️  NECESITA MÁS CONTENIDO'}")

    # Analizar keywords básicas
    terms_txt = result.get("terms_txt", {})
    basic_raw = terms_txt.get("content_basic_w_ranges", "")

    print(f"\n📌 KEYWORDS BÁSICAS")
    print("-" * 60)

    good = 0
    total = 0
    missing = []

    for line in basic_raw.split("\n"):
        if not line.strip() or ":" not in line:
            continue

        parts = line.split(":")
        kw = parts[0].strip()
        range_str = parts[1].strip() if len(parts) > 1 else "1x"

        # Parsear rango
        match = re.search(r'(\d+)-?(\d+)?', range_str)
        if match:
            min_val = int(match.group(1))
            max_val = int(match.group(2)) if match.group(2) else min_val * 3
        else:
            min_val, max_val = 1, 10

        count = len(re.findall(re.escape(kw), content))
        total += 1

        if count == 0:
            status = "❌ FALTA"
            missing.append(kw)
        elif count < min_val:
            status = f"⚠️  BAJO ({count}/{min_val}-{max_val})"
        elif count > max_val:
            status = f"⚠️  ALTO ({count}/{min_val}-{max_val})"
            good += 1
        else:
            status = f"✅ OK ({count}/{min_val}-{max_val})"
            good += 1

        print(f"   {kw:30} {status}")

    # Keywords extendidas
    extended_raw = terms_txt.get("content_extended", "")
    extended_keywords = [kw.strip() for kw in extended_raw.split("\n") if kw.strip()]

    present = []
    absent = []
    for kw in extended_keywords:
        if kw.lower() in content:
            present.append(kw)
        else:
            absent.append(kw)

    print(f"\n📌 KEYWORDS EXTENDIDAS ({len(present)}/{len(extended_keywords)} presentes)")
    print("-" * 60)

    if absent[:10]:
        print("   ❌ Faltan:")
        for kw in absent[:10]:
            print(f"      • {kw}")
        if len(absent) > 10:
            print(f"      ... y {len(absent)-10} más")

    # Score estimado
    basic_score = (good / max(total, 1)) * 40
    extended_score = (len(present) / max(len(extended_keywords), 1)) * 40
    word_score = min(word_count / max(comp_words, 1), 1) * 20

    score = int(basic_score + extended_score + word_score)

    comp_score_raw = comps[1].get("content_score", 50) if len(comps) > 1 else 50
    comp_score = int(comp_score_raw) if str(comp_score_raw).isdigit() else 50

    print(f"\n📈 SCORE SEO ESTIMADO: {score}/100")
    print(f"   Objetivo: {comp_score}+ (superar competidor)")
    print(f"   Status: {'✅ SUPERADO' if score >= comp_score else '⚠️  MEJORAR'}")

    if missing:
        print(f"\n⚠️  ACCIÓN: Agregar keywords faltantes: {', '.join(missing[:5])}")


def main():
    parser = argparse.ArgumentParser(description="NeuronWriter SEO Analysis")
    parser.add_argument("--list-projects", action="store_true", help="Listar proyectos")
    parser.add_argument("--list-queries", action="store_true", help="Listar queries del proyecto")
    parser.add_argument("--query", "-q", help="ID de la query a analizar")
    parser.add_argument("--file", "-f", help="Archivo Astro a analizar")
    parser.add_argument("--recommendations", "-r", action="store_true", help="Mostrar solo recomendaciones")

    args = parser.parse_args()

    if args.list_projects:
        list_projects()
    elif args.list_queries:
        list_queries()
    elif args.query and args.recommendations:
        get_recommendations(args.query)
    elif args.query and args.file:
        analyze_content(args.query, args.file)
    else:
        parser.print_help()
        print("\n📌 Ejemplos:")
        print("  python3 scripts/neuronwriter-seo.py --list-queries")
        print("  python3 scripts/neuronwriter-seo.py -q 87f2e3c5d13e379f -r")
        print("  python3 scripts/neuronwriter-seo.py -q 87f2e3c5d13e379f -f src/pages/monitores-contra-incendios.astro")


if __name__ == "__main__":
    main()
