// /src/app/pagamento/page.js
'use client';

// --- Importações ---
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, LoaderCircle } from 'lucide-react';
import Header from '@/components/Header/Header';
import { createCheckout } from '@/lib/api.service'; // Importa a função centralizada de chamada à API
import styles from './Pagamento.module.css';

// --- Componente da Página de Pagamento ---
export default function PagamentoPage() {
    // --- Estados do Componente ---
    const [loadingPlan, setLoadingPlan] = useState(null); // Controla qual botão está em estado de carregamento ('basic', 'premium', ou null)
    const [error, setError] = useState(''); // Armazena mensagens de erro para exibir na UI
    const [userData, setUserData] = useState(null); // Armazena os dados completos do usuário recuperados do localStorage
    const [selectedPlan, setSelectedPlan] = useState(null); // Armazena o plano que o usuário escolheu na página inicial

    // --- Efeito para Carregar Dados ---
    // Executa uma vez quando o componente é montado para buscar os dados do usuário.
    useEffect(() => {
        try {
            const storedData = localStorage.getItem('evolviNutriUserData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setUserData(parsedData);
                setSelectedPlan(parsedData.plan); // Define o plano selecionado para destacar na UI
            } else {
                // Se não houver dados, o funil foi quebrado. Informa o usuário.
                setError('Dados do formulário não encontrados. Por favor, preencha a calculadora novamente.');
            }
        } catch (e) {
            // Caso o JSON no localStorage esteja corrompido
            setError('Erro ao carregar os dados. Por favor, tente novamente.');
            console.error('Erro ao parsear dados do localStorage:', e);
        }
    }, []);

    /**
     * Função principal para lidar com o processo de pagamento.
     * É chamada quando o usuário clica em um dos botões de pagamento.
     * @param {'basic' | 'premium'} planType - O tipo de plano que o usuário está comprando.
     */
    const handlePayment = async (planType) => {
        // Validação para garantir que os dados do usuário foram carregados
        if (!userData) {
            setError('Não foi possível iniciar o pagamento. Dados do usuário ausentes.');
            return;
        }

        // Inicia o estado de carregamento e limpa erros anteriores
        setLoadingPlan(planType);
        setError('');

        try {
            // 1. Monta o payload (corpo da requisição) com a estrutura que a API espera
            const payload = {
                planType: planType,
                clientName: userData.personal.name,
                clientEmail: userData.personal.email,
                clientWhatsapp: userData.personal.whatsapp,
                formData: {
                    ...userData.calculator,
                    ...userData.personal,
                }
            };

            // 2. Chama a função do nosso serviço de API para criar o checkout
            const data = await createCheckout(payload);
            
            // 3. Se a chamada for bem-sucedida, redireciona o usuário para a URL de pagamento do Mercado Pago
            if (data && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("A resposta da API não continha uma URL de checkout.");
            }

        } catch (err) {
            // Se ocorrer qualquer erro durante o processo, exibe a mensagem na tela
            console.error("Erro ao criar pagamento:", err);
            setError(err.message);
            setLoadingPlan(null); // Libera os botões para uma nova tentativa
        }
    };

    // --- Renderização do Componente ---
    return (
        <>
            <Header />
            <main className={styles.main}>
                <motion.div
                    className={styles.paymentContainer}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                    <div className={styles.header}>
                        <ShieldCheck size={40} className={styles.shieldIcon} />
                        <h2>Complete Sua Compra</h2>
                        <p>Escolha sua opção e finalize em um ambiente 100% seguro.</p>
                    </div>

                    {/* Exibe a mensagem de erro se houver alguma */}
                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.plans}>
                        {/* Card do Plano Básico */}
                        <div className={`${styles.planCard} ${selectedPlan === 'basic' ? styles.highlight : ''}`}>
                            <h3>Plano Básico</h3>
                            <p className={styles.price}>R$ 47<span>/único</span></p> {/* PREÇO ATUALIZADO */}
                            <ul className={styles.features}>
                                <li>Plano Alimentar Personalizado via IA</li>
                                <li>Lista de Compras Automatizada</li>
                                <li>Acesso vitalício ao plano gerado</li>
                            </ul>
                            <button 
                                className={styles.payButton} 
                                onClick={() => handlePayment('basic')}
                                disabled={loadingPlan !== null || !userData}
                            >
                                {loadingPlan === 'basic' ? <LoaderCircle className={styles.loader} /> : <CreditCard size={20} />}
                                {loadingPlan === 'basic' ? 'Processando...' : 'Pagar com Mercado Pago'}
                            </button>
                        </div>

                        {/* Card do Plano Premium */}
                        <div className={`${styles.planCard} ${styles.premium} ${selectedPlan === 'premium' ? styles.highlight : ''}`}>
                            <div className={styles.premiumBadge}>Recomendado</div>
                            <h3>Plano Premium</h3>
                            <p className={styles.price}>R$ 397<span>/único</span></p> {/* PREÇO ATUALIZADO */}
                            <ul className={styles.features}>
                                <li><b>Tudo do Plano Básico +</b></li>
                                <li>Acompanhamento profissional</li>
                                <li>Ajustes mensais na dieta</li>
                                <li>Bônus: Guia de Treinos</li>
                            </ul>
                            <button 
                                className={styles.payButtonPremium} 
                                onClick={() => handlePayment('premium')}
                                disabled={loadingPlan !== null || !userData}
                            >
                                {loadingPlan === 'premium' ? <LoaderCircle className={styles.loader} /> : <CreditCard size={20} />}
                                {loadingPlan === 'premium' ? 'Processando...' : 'Pagar com Mercado Pago'}
                            </button>
                        </div>
                    </div>
                    <div className={styles.secureFooter}>
                        <p>Pagamento seguro processado por Mercado Pago.</p>
                    </div>
                </motion.div>
            </main>
        </>
    );
}