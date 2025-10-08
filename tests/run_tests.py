#!/usr/bin/env python3
"""
Script utilitário para executar testes individuais
"""
import os
import sys
import subprocess
from pathlib import Path

def main():
    project_root = Path(__file__).parent
    tests_dir = project_root / "tests"
    
    print("🧪 PersonalIA - Executor de Testes Individuais")
    print("=" * 50)
    
    # Listar arquivos de teste disponíveis
    test_files = list(tests_dir.glob("test_*.py"))
    
    if not test_files:
        print("❌ Nenhum arquivo de teste encontrado!")
        return
    
    print("📁 Arquivos de teste disponíveis:")
    for i, test_file in enumerate(test_files, 1):
        print(f"  {i}. {test_file.name}")
    
    print("\n🎯 Opções:")
    print("  0. Executar TODOS os testes (com pytest)")
    print("  a. Usar Makefile (recomendado)")
    
    try:
        choice = input("\n➤ Escolha uma opção (número, 0, ou 'a'): ").strip()
        
        if choice.lower() == 'a':
            print("\n🔧 Executando com Makefile...")
            subprocess.run(["make", "test"], cwd=project_root)
            
        elif choice == '0':
            print("\n🧪 Executando todos os testes com pytest...")
            subprocess.run([sys.executable, "-m", "pytest", "tests/", "-v"], cwd=project_root)
            
        elif choice.isdigit():
            choice_num = int(choice)
            if 1 <= choice_num <= len(test_files):
                selected_file = test_files[choice_num - 1]
                print(f"\n🚀 Executando {selected_file.name}...")
                
                # Executar diretamente
                print(f"\n--- Execução Direta ---")
                subprocess.run([sys.executable, str(selected_file)], cwd=project_root)
                
                # Executar com pytest (mais completo)
                print(f"\n--- Execução com Pytest ---")
                subprocess.run([sys.executable, "-m", "pytest", str(selected_file), "-v"], cwd=project_root)
                
            else:
                print("❌ Opção inválida!")
        else:
            print("❌ Opção inválida!")
            
    except KeyboardInterrupt:
        print("\n\n👋 Cancelado pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro: {e}")

if __name__ == "__main__":
    main()