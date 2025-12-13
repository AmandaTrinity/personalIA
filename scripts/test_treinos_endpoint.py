#!/usr/bin/env python3
"""scripts/test_treinos_endpoint.py

Pequeno utilitário CLI para testar o endpoint /treinos/ do backend.

Uso:
  # usando variáveis de ambiente
  API_URL=https://personalia.onrender.com TOKEN=eyJ... python scripts/test_treinos_endpoint.py --post

  # ou via argumentos
  python scripts/test_treinos_endpoint.py --api https://personalia.onrender.com --token eyJ... --post --payload '{"mensagem_usuario":"Teste"}'

O script pode:
 - enviar um OPTIONS (preflight) e mostrar headers de resposta
 - enviar um POST para /treinos/ e mostrar status, headers e body

Dependências: requests (instale com `pip install requests`) se já não estiver no seu ambiente.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Optional

try:
    import requests
except Exception:  # pragma: no cover - facil de instalar se faltar
    print("Módulo 'requests' não encontrado. Instale com: pip install requests")
    raise


def pretty_headers(h: dict) -> str:
    return "\n".join(f"{k}: {v}" for k, v in h.items())


def do_options(url: str, origin: Optional[str] = None) -> None:
    headers = {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type,Authorization",
    }
    if origin:
        headers["Origin"] = origin
    print(f"-> Enviando OPTIONS para {url} (Origin={origin})")
    r = requests.options(url, headers=headers, timeout=15)
    print(f"STATUS: {r.status_code} {r.reason}")
    print("HEADERS:\n" + pretty_headers(dict(r.headers)))
    print("BODY:\n" + (r.text or "<empty>"))


def do_post(url: str, token: Optional[str], payload: dict) -> None:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    print(f"-> Enviando POST para {url}")
    print("REQUEST headers:\n" + pretty_headers(headers))
    print("REQUEST body:\n" + json.dumps(payload, indent=2, ensure_ascii=False))

    r = requests.post(url, headers=headers, json=payload, timeout=60)

    print(f"RESPONSE STATUS: {r.status_code} {r.reason}")
    print("RESPONSE headers:\n" + pretty_headers(dict(r.headers)))
    body = None
    try:
        body = r.json()
        print("RESPONSE JSON:\n" + json.dumps(body, indent=2, ensure_ascii=False))
    except Exception:
        print("RESPONSE TEXT:\n" + (r.text or "<empty>"))


def main(argv: Optional[list[str]] = None) -> int:
    p = argparse.ArgumentParser(description="Testa /treinos/ no backend PersonalIA")
    p.add_argument("--api", "-a", default=os.environ.get("API_URL") or os.environ.get("VITE_API_URL") or "https://personalia.onrender.com", help="Base URL da API (ex: https://personalia.onrender.com)")
    p.add_argument("--token", "-t", default=os.environ.get("TOKEN") or os.environ.get("AUTH_TOKEN"), help="Token Bearer (opcional)")
    p.add_argument("--payload", "-p", default='{"mensagem_usuario":"Quero um treino de perna"}', help="Payload JSON para o POST (string)" )
    p.add_argument("--post", action="store_true", help="Executa POST /treinos/")
    p.add_argument("--options", action="store_true", help="Executa OPTIONS (preflight) para /treinos/")
    p.add_argument("--origin", default=os.environ.get("ORIGIN"), help="Origin header para OPTIONS (opcional)")
    args = p.parse_args(argv)

    base = args.api.rstrip("/")
    treinos_url = base + "/treinos/"

    # parse payload
    try:
        payload = json.loads(args.payload)
    except Exception as e:
        print(f"Payload inválido: {e}")
        return 2

    if args.options:
        try:
            do_options(treinos_url, origin=args.origin)
        except Exception as e:
            print(f"Erro no OPTIONS: {e}")
            return 3

    if args.post:
        try:
            do_post(treinos_url, args.token, payload)
        except Exception as e:
            print(f"Erro no POST: {e}")
            return 4

    if not args.post and not args.options:
        print("Nada feito: use --post e/ou --options. Veja --help")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
