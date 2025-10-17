const API_URL = 'http://localhost:8000';

export async function getTreinos(usuarioId: string, prompt: string): Promise<string> {
        
    try {
        const response = await fetch(`${API_URL}/treinos/${usuarioId}`, {
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

        // Converte a resposta completa para um objeto JSON
        const data = await response.json();

        // Extrai APENAS o texto do plano de treino de dentro do objeto
        const planoGerado = data.treino.plano_gerado;

        // Retorna somente a string do plano, que será formatada pelo ReactMarkdown
        return planoGerado;
    }
    catch (error) {
        console.error('Erro ao buscar treinos', error);
        return 'Ocorreu um erro ao conectar com o serviço de IA. Por favor, verifique sua conexão e o servidor backend.';
    }
}
