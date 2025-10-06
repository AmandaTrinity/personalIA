# 🧪 Testes - PersonalIA

## Como executar os testes

### Usando o Makefile (Recomendado)

```bash
# Executar todos os testes
make test

# Executar testes com cobertura
make test-cov

# Testar conexão com Gemini
make test-gemini

# Pipeline completo (limpar + instalar + verificar + testar)
make all

# Apenas o pipeline de CI
make ci
```

### Usando pytest diretamente

```bash
# Executar todos os testes
python -m pytest tests/ -v

# Executar um arquivo específico
python -m pytest tests/test_gemini_service.py -v

# Executar com cobertura
python -m pytest tests/ --cov=src --cov-report=html

# Executar testes específicos
python -m pytest tests/ -k "test_gerar_plano"
```

## Estrutura dos Testes

```
tests/
├── __init__.py           # Inicialização do módulo de testes
├── conftest.py          # Configurações do pytest
├── test_gemini_service.py  # Testes do serviço Gemini
├── test_routes.py       # Testes das rotas da API
├── test_schemas.py      # Testes dos schemas Pydantic
└── test_gemini.py       # Testes de integração com Gemini
```

## Tipos de Testes

### 🔸 Testes Unitários
- `test_schemas.py` - Validação de modelos Pydantic
- `test_gemini_service.py` - Lógica de negócio isolada

### 🔸 Testes de Integração  
- `test_routes.py` - Endpoints da API
- `test_gemini.py` - Integração com API externa

## Executando Testes Específicos

```bash
# Apenas testes unitários
python -m pytest tests/ -m "unit"

# Apenas testes de integração  
python -m pytest tests/ -m "integration"

# Pular testes lentos
python -m pytest tests/ -m "not slow"
```

## Cobertura de Código

Para ver a cobertura de código:

```bash
make test-cov
```

Isso irá gerar um relatório HTML em `htmlcov/index.html`.

## Configuração

Os testes usam:
- **pytest** como framework
- **unittest.mock** para mocks
- **FastAPI TestClient** para testes de API
- **conftest.py** para configuração de imports

## Dicas

1. **Mocks**: Use mocks para APIs externas (Gemini)
2. **Fixtures**: Defina fixtures no conftest.py para dados reutilizáveis
3. **Marcadores**: Use marcadores pytest para categorizar testes
4. **Isolamento**: Cada teste deve ser independente
5. **Nomenclatura**: Use nomes descritivos (`test_should_return_error_when_api_key_missing`)

## Problemas Comuns

### ImportError: No module named 'src'
- Solução: Use `make test` ao invés de executar arquivos diretamente
- O conftest.py configura os paths automaticamente

### API Key em Testes
- Use mocks para evitar chamadas reais à API
- Configure variáveis de ambiente para testes de integração

### Testes Lentos
- Marque testes que fazem chamadas externas como `@pytest.mark.slow`
- Use `make ci` para pipeline rápido sem testes lentos