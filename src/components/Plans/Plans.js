// src/components/Plans/Plans.js
'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import styles from './Plans.module.css';

const plans = [
    {
        name: "Plano Básico",
        price: "R$ 97",
        planKey: "basic", // <-- Chave para o parâmetro de URL
        features: [
            "Plano Alimentar 100% Personalizado",
            "Gerado por Inteligência Artificial",
            "Lista de Compras Automatizada",
            "Guia de Suplementação Essencial",
            "Acesso via PDF"
        ],
        cta: "Selecionar Plano Básico",
        isPremium: false
    },
    {
        name: "Plano Premium",
        price: "R$ 197",
        planKey: "premium", // <-- Chave para o parâmetro de URL
        features: [
            "Tudo do Plano Básico",
            "Acompanhamento profissional via WhatsApp",
            "Ajustes mensais na dieta",
            "Bônus: Guia de Treinos para seus objetivos",
            "Suporte prioritário"
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
                        {/* --- MUDANÇA CRUCIAL AQUI --- */}
                        {/* O link agora aponta para o formulário com o plano selecionado */}
                        <a href={`/formulario?plan=${plan.planKey}`} className={styles.ctaButton}>
                            {plan.cta}
                        </a>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}