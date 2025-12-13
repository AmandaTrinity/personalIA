#!/usr/bin/env python3
"""scripts/check_gemini_service.py

Verifica se a biblioteca `google.generativeai` e a chave/API do Gemini
estão funcionando para listar modelos e gerar um texto simples.

Uso:
  GEMINI_API_KEY=<sua_key> python scripts/check_gemini_service.py --list
  GEMINI_API_KEY=<sua_key> python scripts/check_gemini_service.py --generate --model gemini-2.0-flash --prompt "Diga olá"

Requisitos:
  pip install google-generativeai

O script imprime saídas detalhadas e retorna 0 em sucesso, >0 em falha.
"""

from __future__ import annotations

import argparse
import os
import sys
import traceback


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Checa serviço Gemini (google.generativeai)")
    p.add_argument("--list", action="store_true", help="Lista modelos visíveis pela API key")
    p.add_argument("--generate", action="store_true", help="Faz uma geração simples de texto com o modelo")
    p.add_argument("--model", default=os.environ.get("GEMINI_MODEL") or "gemini-2.0-flash", help="Modelo a usar para --generate (default from env or gemini-2.0-flash)")
    p.add_argument("--prompt", default="Diga olá mundo em português.", help="Prompt de teste para --generate")
    args = p.parse_args(argv)

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("GEMINI_API_KEY não encontrada no ambiente. Exporte GEMINI_API_KEY antes de rodar.")
        return 2

    try:
        import google.generativeai as genai
    except Exception as e:
        print("Não foi possível importar google.generativeai:")
        traceback.print_exc()
        print("Instale com: pip install google-generativeai")
        return 3

    try:
        genai.configure(api_key=api_key)
        print("genai configurado com GEMINI_API_KEY (não imprimimos a chave por segurança)")
    except Exception:
        print("Falha ao configurar genai: ")
        traceback.print_exc()
        return 4

    if args.list:
        print("Listando modelos disponíveis (pode demorar)...")
        try:
            list_models = getattr(genai, "list_models", None)
            if not callable(list_models):
                print("genai.list_models não disponível nesta versão do cliente.")
            else:
                models = list_models()
                print("Modelos retornados:")
                # models pode ser iterável de objetos/strings
                try:
                    for m in models:
                        print(" -", getattr(m, "name", m))
                except TypeError:
                    print(models)
        except Exception:
            print("Erro ao listar modelos:")
            traceback.print_exc()
            return 5

    if args.generate:
        print(f"Tentando gerar com modelo {args.model}...")
        try:
            Model = getattr(genai, "GenerativeModel", None)
            if Model is None:
                print("genai.GenerativeModel não disponível nesta versão do cliente.")
                return 6

            model = Model(model_name=args.model)
            resp = model.generate_content(args.prompt)
            text = getattr(resp, "text", None) or str(resp)
            print("--- RESPOSTA ---")
            print(text)
            print("--- FIM ---")
        except Exception:
            print("Erro durante geração:")
            traceback.print_exc()
            return 7

    return 0


if __name__ == "__main__":
    sys.exit(main())
