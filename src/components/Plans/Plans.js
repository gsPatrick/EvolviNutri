// src/components/Plans/Plans.js
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck } from 'lucide-react'; // Importei o ShieldCheck
import styles from './Plans.module.css';

const plans = [
    {
        name: "Plano Básico",
        price: "R$ 47", // PREÇO ATUALIZADO
        planKey: "basic",
        features: [ // FEATURES ATUALIZADAS
            "Plano alimentar 100% personalizado e individualizado",
            "Lista de compras automatizada",
            "Guia de Suplementação básica",
            "Acesso via PDF",
            "1 contato com o Nutricionista a cada 15 dias (via e-mail)"
        ],
        cta: "Selecionar Plano Básico",
        isPremium: false
    },
    {
        name: "Plano Premium",
        price: "R$ 397", // PREÇO ATUALIZADO
        planKey: "premium",
        features: [ // FEATURES ATUALIZADAS
            "Tudo do Plano Básico",
            "1 chamada de vídeo com Nutricionista de 1 hora",
            "Ajustes mensais na dieta",
            "Feedback semanais",
            "Suporte prioritário",
            "Bônus: Avaliação de treino com profissional de educação física",
            "Livro de receitas práticas para o dia-a-dia"
        ],
        cta: "Selecionar Plano Premium",
        isPremium: true
    }
];

export default function Plans() {
    return (
        <section className={styles.plansSection} id="planos">
            <h2 className={styles.title}>Dê o próximo passo para sua evolução.</h2>
            <div className={styles.plansContainer}>
                {plans.map((plan, index) => (
                    <motion.div 
                        key={index} 
                        className={`${styles.planCard} ${plan.isPremium ? styles.premium : ''}`}
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        {plan.isPremium && <div className={styles.premiumBadge}>Mais Popular</div>}
                        <h3>{plan.name}</h3>
                        <p className={styles.price}>{plan.price}</p>
                        <ul className={styles.features}>
                            {plan.features.map((feature, i) => (
                                <li key={i}>
                                    <CheckCircle2 size={18} className={styles.checkIcon} /> {feature}
                                </li>
                            ))}
                        </ul>
                        <a href={`/formulario?plan=${plan.planKey}`} className={styles.ctaButton}>
                            {plan.cta}
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* --- SEÇÃO DE GARANTIA ADICIONADA --- */}
            <motion.div 
                className={styles.guaranteeSection}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <ShieldCheck size={32} className={styles.guaranteeIcon} />
                <h3 className={styles.guaranteeTitle}>Garantia de Resultado ou Seu Dinheiro de Volta</h3>
                <p className={styles.guaranteeText}>
                    Você tem 100% de segurança no investimento.
                    Se, após 30 dias de acompanhamento e registro completo das refeições, nenhum resultado for alcançado, nós reembolsamos 100% do valor pago.
                </p>
                <p className={styles.guaranteeCondition}>
                    📸 Basta enviar as fotos de todas as suas refeições durante o período contratado para validar a garantia.
                </p>
            </motion.div>
        </section>
    );
}