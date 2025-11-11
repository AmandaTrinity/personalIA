import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Home from '../../pages/Home';

//Um componente mock simples para a página de destino do link
const MockChatPage = () => <div>Você está na página de Chat</div>;

describe('Página: Home', () => {

  //Função auxiliar para renderizar o componente Home dentro do contexto do React Router
  const renderHomePage = () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<MockChatPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('deve renderizar o título, a descrição e o botão corretamente', () => {
    renderHomePage();

    //Verifica se o título principal está na tela
    expect(screen.getByRole('heading', { name: /personalia/i })).toBeInTheDocument();

    //Verifica se os textos de descrição estão presentes
    expect(screen.getByText('Seu personal trainer de inteligência artificial.')).toBeInTheDocument();
    expect(screen.getByText('Descreva seus objetivos e criaremos o treino perfeito para você!')).toBeInTheDocument();

    //Verifica se o botão "Começar Agora" está na tela
    const startButton = screen.getByRole('button', { name: /começar agora/i });
    expect(startButton).toBeInTheDocument();
  });

  test('deve navegar para a página /chat ao clicar no botão "Começar Agora"', async () => {
    const user = userEvent.setup();
    renderHomePage();

    //Encontra o botão
    const startButton = screen.getByRole('button', { name: /começar agora/i });

    //Simula o clique do usuário no botão
    await user.click(startButton);

    //Verifica se a navegação ocorreu e o conteúdo da página de chat é exibido
    expect(screen.getByText('Você está na página de Chat')).toBeInTheDocument();
  });
});