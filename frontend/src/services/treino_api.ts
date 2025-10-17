const API_URL = 'http://localhost:8000';

export async function getTreinos(prompt: string): Promise <string> {
    
    try {
        const response = await fetch(`${API_URL}/mensagem/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // O backend espera um objeto com a estrutura de 'MensagemChat'.
            body: JSON.stringify({ mensagem_usuario: prompt }),
    });
        if (!response.ok) {
            // Captura mais detalhes do erro para facilitar a depuração
            const errorData = await response.text();
            throw new Error(`Falha na requisição: ${response.status} ${response.statusText} - ${errorData}`);
        }
        return response.text();
    }
    catch (error) {
        console.error('Erro ao buscar treinos', error);
        return 'Ocorreu um erro ao conectar com o serviço de IA. Por favor, verifique sua conexão e o servidor backend.';
    }
}
