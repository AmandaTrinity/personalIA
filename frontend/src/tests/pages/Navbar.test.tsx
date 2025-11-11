import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

//Componente que estamos testando
import Navbar from '../../pages/Navbar';

//Componentes mock para simular as páginas de destino
const MockHomePage = () => <div>Página Inicial</div>;
const MockChatPage = () => <div>Página de Chat</div>;

describe('Componente: Navbar', () => {

  //Função auxiliar para renderizar a Navbar dentro do contexto do React Router
  const renderNavbar = (initialRoute = '/') => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Navbar />
        <Routes>
          <Route path="/" element={<MockHomePage />} />
          <Route path="/chat" element={<MockChatPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('deve renderizar o título do site e os links de navegação', () => {
    renderNavbar();

    //Verifica se o título do site, que é um link para a home, está presente
    expect(screen.getByRole('link', { name: /personal ai/i })).toBeInTheDocument();

    //Verifica se os links de navegação estão presentes
    const chatLinks = screen.getAllByRole('link', { name: /chat/i });
    expect(chatLinks.length).toBeGreaterThan(0);
    chatLinks.forEach(link => expect(link).toBeInTheDocument());
  });

  test('deve navegar para a página inicial ao clicar no título', async () => {
    const user = userEvent.setup();
    //Começa em uma página diferente da inicial
    renderNavbar('/chat');

    //Clica no título do site
    await user.click(screen.getByRole('link', { name: /personal ai/i }));

    //Verifica se a navegação para a página inicial ocorreu
    expect(screen.getByText('Página Inicial')).toBeInTheDocument();
  });

  test('deve navegar para a página de chat ao clicar no link "Chat"', async () => {
    const user = userEvent.setup();
    renderNavbar('/');

    //Clica no primeiro link "Chat" encontrado
    await user.click(screen.getAllByRole('link', { name: /chat/i })[0]);

    //Verifica se a navegação para a página de chat ocorreu
    expect(screen.getByText('Página de Chat')).toBeInTheDocument();
  });

  test('deve aplicar a classe "active" ao link da página atual', () => {
    renderNavbar('/chat');

    //O link "Chat" deve estar dentro de um <li> com a classe "active"
    const chatLink = screen.getAllByRole('link', { name: /chat/i })[0];
    expect(chatLink.closest('li')).toHaveClass('active');
  });
});