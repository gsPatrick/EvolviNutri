// /src/app/formulario/FormularioClient.js
'use client'; // <-- ESSENCIAL: Marca este como um Componente de Cliente

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Phone, LoaderCircle } from 'lucide-react';
import styles from './Formulario.module.css';

export default function FormularioClient() {
    // Hooks do Next.js e React
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan'); // Lê "?plan=..." da URL

    // Estados do componente
    const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
    const [calculatorData, setCalculatorData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Efeito para carregar dados essenciais quando o componente montar
    useEffect(() => {
        // Tenta buscar os dados da calculadora salvos na etapa anterior
        const storedCalculatorData = localStorage.getItem('evolviNutriCalculatorData');
        
        if (!storedCalculatorData || !plan) {
            // Se não houver dados ou plano, o funil foi quebrado. Redireciona para o início.
            alert("Dados não encontrados. Por favor, preencha a calculadora primeiro.");
            router.push('/');
        } else {
            setCalculatorData(JSON.parse(storedCalculatorData));
        }
    }, [plan, router]);
    
    // Função para atualizar o estado do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Função para lidar com o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        // Validação simples
        if (!formData.name || !formData.email || !formData.whatsapp) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setIsLoading(true);

        try {
            // Monta o objeto final que a página de pagamento espera
            const userData = {
                plan: plan,
                calculator: calculatorData,
                personal: formData
            };

            // Salva os dados completos no localStorage para a próxima etapa
            localStorage.setItem('evolviNutriUserData', JSON.stringify(userData));

            // Redireciona para a página de pagamento
            router.push('/pagamento');

        } catch (err) {
            setError('Ocorreu um erro ao salvar seus dados. Tente novamente.');
            console.error(err);
            setIsLoading(false);
        }
    };

    // Não renderiza nada se os dados ainda não estiverem prontos (evita flicker)
    if (!calculatorData) {
        return null;
    }

    return (
        <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>Estamos quase lá!</h1>
                <p className={styles.subtitle}>Preencha seus dados para montarmos o plano perfeito para você.</p>
            </div>

            <div className={styles.planInfo}>
                Plano Selecionado: <span>{plan === 'premium' ? 'Premium' : 'Básico'}</span>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <User className={styles.inputIcon} size={20} />
                    <input
                        type="text"
                        name="name"
                        placeholder="Seu nome completo"
                        className={styles.inputField}
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Mail className={styles.inputIcon} size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Seu melhor e-mail"
                        className={styles.inputField}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <Phone className={styles.inputIcon} size={20} />
                    <input
                        type="tel"
                        name="whatsapp"
                        placeholder="Seu WhatsApp (com DDD)"
                        className={styles.inputField}
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}
                
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? <LoaderCircle size={24} className={styles.spinner} /> : 'Ir para o Pagamento'}
                </button>
            </form>
        </motion.div>
    );
}