// /src/app/formulario/page.js
'use client';

// Importações de bibliotecas e componentes
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation'; // Hook para ler parâmetros da URL
import Header from '@/components/Header/Header';
import styles from './Formulario.module.css';

// O componente da página é exportado como default
export default function FormularioPage() {
    // Inicializa o hook para poder ler os parâmetros da URL. Ex: ?plan=premium
    const searchParams = useSearchParams();

    /**
     * Função chamada quando o formulário é enviado.
     * @param {Event} e - O evento de submit do formulário.
     */
    const handleSubmit = (e) => {
        // 1. Previne o comportamento padrão do navegador de recarregar a página ao enviar um formulário.
        e.preventDefault();
        
        // 2. Coleta todos os dados dos campos do formulário atual.
        // A API FormData é uma forma moderna e eficiente de obter todos os valores.
        // É crucial que cada <input>, <select> e <textarea> tenha um atributo 'name'.
        const formElement = e.target;
        const formData = new FormData(formElement);
        const personalData = Object.fromEntries(formData.entries());
        
        // 3. Recupera os dados da calculadora, que foram salvos na etapa anterior no localStorage.
        // O '|| '{}' garante que, se nada for encontrado, teremos um objeto vazio em vez de um erro.
        const calculatorData = JSON.parse(localStorage.getItem('evolviNutriCalculatorData') || '{}');
        
        // 4. Combina todos os dados em um único objeto estruturado.
        // Primeiro, captura o plano selecionado que veio pela URL.
        // Se o parâmetro 'plan' não existir, assume 'basic' como padrão.
        const selectedPlan = searchParams.get('plan') || 'basic';
        
        const finalUserData = {
            personal: personalData,      // Dados deste formulário (nome, email, preferências, etc.)
            calculator: calculatorData,  // Dados da primeira etapa (peso, altura, objetivo, etc.)
            plan: selectedPlan,          // O plano que o usuário selecionou ('basic' ou 'premium')
        };
        
        // 5. Salva o objeto completo no localStorage. A página de pagamento irá ler esta chave ('evolviNutriUserData').
        localStorage.setItem('evolviNutriUserData', JSON.stringify(finalUserData));
    
        // 6. Redireciona o usuário para a etapa final do funil: a página de pagamento.
        window.location.href = '/pagamento';
    };

    // Renderização do JSX do componente
    return (
        <>
            <Header />
            <main className={styles.main}>
                <motion.div 
                    className={styles.formContainer}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className={styles.header}>
                        <h2>Estamos quase lá!</h2>
                        <p>Complete com suas informações para gerarmos seu plano alimentar personalizado.</p>
                    </div>

                    {/* O formulário agora chama a função handleSubmit ao ser enviado */}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGrid}>
                            {/* É crucial que cada input tenha um atributo 'name' para o FormData funcionar */}
                            <input type="text" name="name" placeholder="Nome Completo" required />
                            <input type="email" name="email" placeholder="Seu melhor e-mail" required />
                            <input type="tel" name="whatsapp" placeholder="WhatsApp (com DDD)" required />
                            
                            <textarea name="preferences" placeholder="Quais alimentos você mais gosta?" rows="3"></textarea>
                            <textarea name="restrictions" placeholder="Quais alimentos você não come ou tem alergia?" rows="3"></textarea>
                            
                            <select name="goal_details" required>
                                <option value="">Qual seu principal objetivo físico?</option>
                                <option value="hipertrofia">Hipertrofia Muscular</option>
                                <option value="emagrecimento">Emagrecimento</option>
                                <option value="recomposicao">Recomposição Corporal</option>
                                <option value="saude">Melhorar a Saúde/Disposição</option>
                            </select>

                            <select name="budget">
                                <option value="">Orçamento para dieta (mensal)</option>
                                <option value="baixo">Até R$ 300</option>
                                <option value="medio">R$ 300 - R$ 600</option>
                                <option value="alto">Acima de R$ 600</option>
                            </select>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Finalizar e Ver Opções de Pagamento
                        </button>
                    </form>
                </motion.div>
            </main>
        </>
    );
}