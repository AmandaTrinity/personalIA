import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// 1. O Componente que estamos testando
import Chat from '../../pages/Chat'; 

// 2. A API que vamos "mockar"
import { getTreinos } from '../../services/treino_api';

// 3. Diz ao Vitest para interceptar chamadas para este arquivo
vi.mock('../../services/treino_api');

// 4. Cria uma versão "espia" da função mockada
const mockedGetTreinos = vi.mocked(getTreinos);

// Helper para renderizar o Chat dentro de um Router
// (Necessário pois o Chat.tsx usa o componente <Link>)
const renderChat = () => {
  render(
    <MemoryRouter>
      <Chat />
    </MemoryRouter>
  );
};

describe('Página: Chat (Integração)', () => {

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    vi.clearAllMocks();
  });

  // -------- TESTE 1: SUCESSO --------
  test('deve enviar um prompt e exibir a resposta da IA na tela', async () => {
    const user = userEvent.setup();
    const promptDoUsuario = 'Quero um treino para peito';
    const respostaMockadaDaIA = 'Aqui está seu treino de peito mockado!';

    // Configura o mock da API para este teste
    mockedGetTreinos.mockImplementation(() => {
      return new Promise(resolve => {
        // Aumenta o tempo para algo mais realista, como 30ms.
        // Isso dá ao 'waitFor' tempo de ver o estado 'Enviando...'
        // antes que a Promise resolva e o estado mude para 'false'.
        setTimeout(() => resolve(respostaMockadaDaIA), 30);
      });
    });
    renderChat();

    // Encontra os elementos na tela
    // (Usando o placeholder que vimos no ChatInput.test.tsx)
    const input = screen.getByPlaceholderText(/Qual sua dúvida/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    // Simula o usuário digitando
    await user.type(input, promptDoUsuario);
    expect(input).toHaveValue(promptDoUsuario);

    // Simula o clique no botão
    await user.click(button);

    // ---- VERIFICAÇÕES ----

    // 1. Aguarda o estado de loading aparecer
    // Precisamos ativamente esperar a UI atualizar
    await waitFor(() => {
      // Procura o botão pelo novo texto "Enviando..." e verifica se está desabilitado
      expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();
    });    
    // 2. Verifica se a API (getTreinos) foi chamada corretamente
    expect(mockedGetTreinos).toHaveBeenCalledTimes(1);
    expect(mockedGetTreinos).toHaveBeenCalledWith(
      "68e96d1811086a10ae8c9173", // O ID de usuário fixo no seu código
      promptDoUsuario
    );

    // 3. Aguarda a resposta aparecer na tela (pois é assíncrono)
    await waitFor(() => {
      // O iaResponse state foi atualizado?
      expect(screen.getByText(respostaMockadaDaIA)).toBeInTheDocument();
    });
    
    // 4. Verifica se o app voltou ao estado normal
    expect(input).toHaveValue(''); // Input foi limpo

    // Nós vamos esperar ativamente até que o app volte ao estado "pronto".
    // O botão deve voltar a ser "Enviar" E deve estar DESABILITADO
    await waitFor(() => {
      // Encontra o botão pelo nome "Enviar"
      const finalButton = screen.getByRole('button', { name: /enviar/i });
      
      // Verifica se o texto é "Enviar" (implícito pelo seletor)
      // e se ele está DESABILITADO (porque o input está vazio)
      expect(finalButton).toBeDisabled();
    });
  });

  // -------- TESTE 2: ERRO --------
  test('deve exibir uma mensagem de erro se a API falhar', async () => {
    const user = userEvent.setup();
    
    // Configura o mock da API para REJEITAR a chamada
    mockedGetTreinos.mockRejectedValue(new Error('Falha na API'));

    renderChat();

    const input = screen.getByPlaceholderText(/Qual sua dúvida/i);
    const button = screen.getByRole('button', { name: /enviar/i });

    // Simula o envio
    await user.type(input, 'Um prompt que vai falhar');
    await user.click(button);

    // Aguarda a resposta de erro aparecer na tela
    await waitFor(() => {
      // Esta é a mensagem de erro definida no seu 'catch' do Chat.tsx
      expect(
        screen.getByText('Erro ao processar sua solicitação. Tente novamente.')
      ).toBeInTheDocument();
    });

    // O estado de loading deve ser desativado mesmo com erro
    expect(button).not.toBeDisabled();
  });
}); 