import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import ChatArea from '../../components/ChatArea';

describe('Componente: ChatArea', () => {

  // Teste 1: Verifica se o cabeçalho estático do componente é renderizado.
  test('deve renderizar o cabeçalho estático (título e subtítulo)', () => {
    // Renderiza o componente com uma resposta mockada.
    render(<ChatArea iaResponse="Qualquer resposta" />);

    // Verifica a presença do título "PersonalIA"
    expect(screen.getByRole('heading', { name: /PersonalIA/i })).toBeInTheDocument();

    // Verifica a presença do subtítulo
    expect(screen.getByText(/Descreva o seu objetivo e eu criarei o seu treino perfeito/i)).toBeInTheDocument();
  });

  // Teste 2: Verifica se a string da resposta da IA é exibida corretamente.
  test('deve exibir a resposta da IA passada via prop', () => {
    const mockResponse = 'Este é o plano de treino gerado para iniciantes.';
    render(<ChatArea iaResponse={mockResponse} />);

    // Verifica se o texto da resposta está visível no documento
    expect(screen.getByText(mockResponse)).toBeInTheDocument();
  });

  // Teste 3: Verifica se o suporte a Markdown está funcionando (testando texto em negrito).
  test('deve renderizar o conteúdo da resposta com suporte a Markdown', () => {
    // String com Markdown para negrito
    const markdownResponse = 'Seu treino é **muito importante** para sua saúde.';
    render(<ChatArea iaResponse={markdownResponse} />);

    // Como o ReactMarkdown converte **texto** para <strong>texto</strong>,
    // procuramos o texto "muito importante" e verificamos se ele está dentro
    // de um elemento <strong> (que é o comportamento esperado para o Markdown).
    const strongText = screen.getByText('muito importante', { selector: 'strong' });
    
    // Verifica se o elemento <strong> foi encontrado e se a tag é correta.
    expect(strongText).toBeInTheDocument();
    expect(strongText.tagName).toBe('STRONG');
  });

  // Teste 4: Testa se o componente renderiza corretamente com uma resposta vazia.
  test('deve renderizar o componente sem falhar, mesmo com iaResponse vazio', () => {
    render(<ChatArea iaResponse="" />);
    
    // O componente não deve falhar a renderização e o título deve estar lá.
    expect(screen.getByRole('heading', { name: /PersonalIA/i })).toBeInTheDocument();
  });
});