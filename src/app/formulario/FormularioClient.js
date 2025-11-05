// /src/app/formulario/FormularioClient.js
'use client';

import { motion } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShieldCheck, User, Mail, Phone, HeartPulse, Utensils, Clock, BookOpen, Atom } from 'lucide-react';
import styles from './Formulario.module.css';

export default function FormularioClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Efeito para verificar se os dados da calculadora existem.
    useEffect(() => {
        const calculatorData = localStorage.getItem('evolviNutriCalculatorData');
        if (!calculatorData) {
            alert("Dados da calculadora não encontrados. Por favor, preencha a calculadora na página inicial primeiro.");
            router.push('/');
        }
    }, [router]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formElement = e.target;
        const formData = new FormData(formElement);
        const anamneseData = Object.fromEntries(formData.entries());
        
        const calculatorData = JSON.parse(localStorage.getItem('evolviNutriCalculatorData') || '{}');
        const selectedPlan = searchParams.get('plan') || 'basic';
        
        // Estrutura final que será salva e usada pelo backend
        const finalPayload = {
            plan: selectedPlan,
            // Dados para acesso rápido do backend
            clientName: anamneseData.name,
            clientEmail: anamneseData.email,
            clientWhatsapp: anamneseData.whatsapp,
            // O objeto 'formData' agora contém TUDO que a IA precisa
            formData: {
                ...calculatorData, // Junta os dados da calculadora (peso, altura, etc.)
                ...anamneseData    // Junta os dados deste formulário de anamnese
            }
        };
        
        localStorage.setItem('evolviNutriUserData', JSON.stringify(finalPayload));
    
        router.push('/pagamento');
    };

    return (
        <motion.div 
            className={styles.formContainer}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <div className={styles.header}>
                <h2>Ficha de Anamnese Detalhada</h2>
                <p>Suas respostas são o segredo para um plano 100% personalizado. Por favor, seja o mais detalhista possível.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                
                <fieldset className={styles.fieldset}>
                    <legend><User /> Dados de Contato</legend>
                    <div className={styles.inputGroup}><User className={styles.inputIcon}/><input type="text" name="name" placeholder="Nome Completo *" required /></div>
                    <div className={styles.inputGroup}><Mail className={styles.inputIcon}/><input type="email" name="email" placeholder="Seu melhor e-mail *" required /></div>
                    <div className={styles.inputGroup}><Phone className={styles.inputIcon}/><input type="tel" name="whatsapp" placeholder="WhatsApp (com DDD) *" required /></div>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend><Clock /> Rotina e Hábitos</legend>
                    <label>Em qual horário costuma treinar ou se exercitar?</label>
                    <input type="time" name="horario_treino" defaultValue="08:00" />

                    <label>Quantas refeições faz ou gostaria de fazer no dia?</label>
                    <select name="num_refeicoes" required>
                        <option value="3">3 Refeições</option>
                        <option value="4" selected>4 Refeições</option>
                        <option value="5">5 Refeições</option>
                        <option value="6">6 Refeições</option>
                    </select>

                    <label>Prefere refeições mais simples e rápidas ou pratos mais elaborados?</label>
                    <select name="preferencia_preparo" required>
                        <option value="Refeições rápidas e práticas na maior parte do tempo.">Na maior parte, rápidas e práticas</option>
                        <option value="Um misto, gosto de praticidade no dia a dia e algo mais elaborado à noite/finais de semana.">Um misto, praticidade e pratos elaborados</option>
                        <option value="Gosto de cozinhar e prefiro pratos mais elaborados.">Prefiro pratos mais elaborados</option>
                    </select>

                    <label>Breve relato da sua rotina (trabalho, estudos, horários, etc.) *</label>
                    <textarea name="relato_rotina" placeholder="Ex: Trabalho no escritório das 9h às 18h, vou para a academia logo depois e chego em casa por volta das 20h." rows="4" required></textarea>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend><Utensils /> Preferências Alimentares</legend>
                    <label>Alimentos que você GOSTA *</label>
                    <textarea name="alimentos_gosta" placeholder="Ex: Frango, ovos, arroz, feijão, batata doce, banana..." rows="3" required></textarea>
                    
                    <label>Alimentos que você NÃO GOSTA *</label>
                    <textarea name="alimentos_nao_gosta" placeholder="Ex: Fígado, quiabo, jiló..." rows="3" required></textarea>

                    <label>Alimentos indispensáveis na sua rotina (se houver)</label>
                    <textarea name="alimentos_indispensaveis" placeholder="Ex: Café pela manhã, uma fruta à tarde..." rows="2"></textarea>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend><HeartPulse /> Saúde e Restrições</legend>
                    <label>Intolerâncias ou alergias a algum alimento? *</label>
                    <textarea name="alergias_intolerancias" placeholder="Ex: Intolerância a lactose, alergia a amendoim, etc. Se não tiver, escreva 'Nenhuma'." rows="2" required></textarea>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend><BookOpen /> Conhecendo seus Favoritos</legend>
                    <label>Cite 5 ou mais FRUTAS que você consome ou gostaria de consumir *</label>
                    <textarea name="frutas_consumo" placeholder="Ex: Maçã, Banana, Morango, Mamão, Laranja" rows="2" required></textarea>

                    <label>Cite 5 ou mais LEGUMES que você consome ou gostaria de consumir *</label>
                    <textarea name="legumes_consumo" placeholder="Ex: Cenoura, Abobrinha, Beterraba, Chuchu, Vagem" rows="2" required></textarea>

                    <label>Cite 5 ou mais HORTALIÇAS/VERDURAS que você consome ou gostaria de consumir *</label>
                    <textarea name="hortalicas_consumo" placeholder="Ex: Alface, Rúcula, Espinafre, Couve, Brócolis" rows="2" required></textarea>
                </fieldset>

                <fieldset className={styles.fieldset}>
                    <legend><Atom /> Suplementação</legend>
                    <label>Usa ou gostaria de usar suplementos? Se sim, quais?</label>
                    <textarea name="suplementos" placeholder="Ex: Whey Protein, Creatina, Multivitamínico. Se não usa, escreva 'Nenhum'." rows="2"></textarea>
                </fieldset>

                <div className={styles.reassuranceText}>
                    <ShieldCheck size={18} />
                    <span>Após o pagamento, seu plano será gerado e enviado para seu WhatsApp e E-mail.</span>
                </div>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Finalizar e Ir para o Pagamento'}
                </button>
            </form>
        </motion.div>
    );
}