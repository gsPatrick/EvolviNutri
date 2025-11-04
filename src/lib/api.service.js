// src/lib/api.service.js

// A URL base da sua API de produção.
const API_BASE_URL = 'https://geral-evolvi-nutri-api.r954jc.easypanel.host';

/**
 * Cria a preferência de pagamento no backend.
 * Envia todos os dados do cliente e do formulário para a API.
 * @param {object} payload - Os dados completos do cliente.
 * @returns {Promise<object>} A resposta da API, contendo a checkoutUrl.
 */
export const createCheckout = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/checkout/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Se a resposta da API não for bem-sucedida (ex: erro 400, 500),
        // tentamos ler a mensagem de erro e a lançamos.
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ocorreu um erro no servidor.');
        }

        // Se a resposta for bem-sucedida, retornamos os dados (ex: { checkoutUrl: '...' })
        return await response.json();

    } catch (error) {
        console.error('Falha ao criar o checkout:', error);
        // Lança o erro para que o componente que chamou possa tratá-lo (ex: mostrar na tela)
        throw error;
    }
};