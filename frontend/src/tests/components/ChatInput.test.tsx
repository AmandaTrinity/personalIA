import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, test, expect, vi, beforeEach, type Mock } from 'vitest';
import ChatInput from '../../components/ChatInput';

let mockOnSend: Mock;
let mockSetPrompt: Mock;

describe('Componente: ChatInput', () => {

  beforeEach(() => {
    //"Espiões" para as funções de callback('histórico de chamadas')
    mockOnSend = vi.fn();
    mockSetPrompt = vi.fn();
    
    //Limpa o histórico de chamadas entre os testes
    vi.clearAllMocks();
  });

  //Primeiro Teste: Renderização básica e digitação
  test('deve renderizar corretamente e chamar setPrompt ao digitar', () => {
    render(
      <ChatInput
        prompt=""
        setPrompt={mockSetPrompt}
        onSend={mockOnSend}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/Qual sua dúvida/i);
    expect(input).toBeInTheDocument();

    //Simula o usuário digitando no input
    fireEvent.change(input, { target: { value: 'Minha dúvida' } });

    //Verifica se o setPrompt foi chamado com o valor correto
    expect(mockSetPrompt).toHaveBeenCalledTimes(1);
    expect(mockSetPrompt).toHaveBeenCalledWith('Minha dúvida');
  });

  //Segundo Teste: Validação de envio vazio (Requisito do usuário)
  test('NÃO deve chamar onSend se o prompt estiver vazio', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        prompt=""
        setPrompt={mockSetPrompt}
        onSend={mockOnSend}
        isLoading={false}
      />
    );

    const button = screen.getByRole('button', { name: 'Enviar' });
    
    //botão deve estar desabilitado por padrão (prompt vazio)
    expect(button).toBeDisabled();

    //Mesmo que tentemos clicar (o userEvent não clica em botões desabilitados, 
    //mas a verificação dupla é boa)
    await user.click(button);
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  //Terceito Teste: Validação de envio com espaços em branco (Requisito do usuário)
  test('NÃO deve chamar onSend se o prompt contiver apenas espaços', async () => {
    const user = userEvent.setup();
    //Usa rerender para simular o estado do pai mudando
    const { rerender } = render(
      <ChatInput prompt="" setPrompt={mockSetPrompt} onSend={mockOnSend} isLoading={false} />
    );

    //Pai atualiza o prompt para "   "
    rerender(<ChatInput prompt="   " setPrompt={mockSetPrompt} onSend={mockOnSend} isLoading={false} />);

    const button = screen.getByRole('button', { name: 'Enviar' });

    //botão deve permanecer desabilitado devido ao .trim() na lógica
    expect(button).toBeDisabled();

    await user.click(button);
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  //Quarto teste: Estado de Carregamento (Requisito do usuário)
  test('deve desabilitar input/botão e mostrar "Enviando..." durante isLoading', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        prompt="Uma mensagem válida"
        setPrompt={mockSetPrompt}
        onSend={mockOnSend}
        isLoading={true}
      />
    );

    const input = screen.getByPlaceholderText(/Qual sua dúvida/i);
    const button = screen.getByRole('button');

    //Verificações do estado de carregamento
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Enviando...');

    //Tentativa de envio durante o loading
    await user.click(button);
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  //Quinto Teste: Envio bem-sucedido(Click)
  test('deve chamar onSend ao clicar no botão com um prompt válido', async () => {
    const user = userEvent.setup();
    render(
      <ChatInput
        prompt="Essa é uma dúvida real"
        setPrompt={mockSetPrompt}
        onSend={mockOnSend}
        isLoading={false}
      />
    );

    const button = screen.getByRole('button', { name: 'Enviar' });
    
    //Com prompt válido, o botão deve estar habilitado
    expect(button).toBeEnabled();

    await user.click(button);

    //onSend deve ser chamado
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  //Sexto Teste: Envio bem-sucedido (Submit do formulário)
  test('deve chamar onSend ao submeter o formulário (ex: Enter no input)', () => {
    render(
      <ChatInput
        prompt="Dúvida via Enter"
        setPrompt={mockSetPrompt}
        onSend={mockOnSend}
        isLoading={false}
      />
    );

    //Pegamos o formulário (neste caso, pelo input dentro dele)
    const input = screen.getByPlaceholderText(/Qual sua dúvida/i);
    
    //Simulamos o evento 'submit' no formulário
    fireEvent.submit(input);

    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });
});