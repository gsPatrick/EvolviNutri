// /src/components/Calculator/Calculator.js
'use client';

// --- Importações ---
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import Image from 'next/image';
import { Zap, TrendingUp } from 'lucide-react';
import styles from './Calculator.module.css';

/**
 * Componente para animar a contagem de um número.
 * @param {{ value: number }} props - O valor final para a animação.
 */
function AnimatedNumber({ value }) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 1.5,
            ease: "easeOut",
        });
        return controls.stop;
    }, [value, count]);

    return <motion.span>{rounded}</motion.span>;
}

// --- Componente Principal da Calculadora ---
export default function Calculator() {
    // --- Estados do Componente ---
    const [formData, setFormData] = useState({
        sexo: 'masculino',
        biotipo: 'mesomorfo',
        idade: '',
        peso: '',
        altura: '',
        atividade: 1.55, // Moderadamente ativo
        objetivo: 'manter_peso', // Chave string para o objetivo
        estado_atual: 'magro_gordura_moderada'
    });
    const [results, setResults] = useState(null); // Armazena os resultados do cálculo
    const resultsRef = useRef(null); // Referência para scroll automático

    const isFormValid = formData.idade > 0 && formData.peso > 0 && formData.altura > 0;

    /**
     * Lida com mudanças em campos de texto e select.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (results) setResults(null); // Esconde resultados antigos
    };
    
    /**
     * Lida com mudanças em campos numéricos.
     */
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: parseFloat(value) || ''}));
        if (results) setResults(null);
    }
    
    // =============================================================================
    // ======================== LÓGICA DE CÁLCULO ATUALIZADA ========================
    // =============================================================================
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        
        const { sexo, idade, peso, altura, atividade, objetivo, biotipo, estado_atual } = formData;

        // --- 1) Calcular TMB (Mifflin-St Jeor) ---
        let tmb;
        if (sexo === 'masculino') {
            tmb = 10 * peso + 6.25 * altura - 5 * idade + 5;
        } else { // feminino
            tmb = 10 * peso + 6.25 * altura - 5 * idade - 161;
        }
        tmb = Math.max(tmb, 1000);

        // --- 2) Ajuste por Estado Atual ---
        const fatoresTMB = {
            magro: 1.03,
            magro_gordura_moderada: 0.98,
            falso_magro: 0.95,
            muito_acima_peso: 0.90,
        };
        const tmb_ajustado = tmb * (fatoresTMB[estado_atual] || 1.0);

        // --- 3) Calcular TDEE ---
        const tdee = tmb_ajustado * atividade;

        // --- 4) Ajuste por Biotipo ---
        const fatoresTDEE = {
            ectomorfo: 1.05,
            mesomorfo: 1.00,
            endomorfo: 0.95,
        };
        const tdee_final = tdee * (fatoresTDEE[biotipo] || 1.0);

        // --- 5) Ajuste pelo Objetivo ---
        const multiplicadoresObjetivo = {
            emagrecer_leve: 0.85,
            emagrecer_agressivo: 0.70,
            manter_peso: 1.00,
            ganhos_secos: 1.07,
            ganhar_agressivo: 1.15,
        };
        let calorias_totais = tdee_final * (multiplicadoresObjetivo[objetivo] || 1.0);

        // --- Validação de calorias mínimas ---
        const minCalorias = sexo === 'masculino' ? 1400 : 1200;
        calorias_totais = Math.max(calorias_totais, minCalorias);
        calorias_totais = Math.round(calorias_totais);

        // ================= INÍCIO DA SEÇÃO MODIFICADA =================
        // --- 6) Cálculo de Macronutrientes (LÓGICA ATUALIZADA CONFORME SOLICITADO) ---
        
        // Fatores de proteína por kg de peso corporal, baseados no estado atual.
        const fatoresProteina = {
            muito_acima_peso: 1.8,
            magro: 2.0,
            falso_magro: 2.15,
            magro_gordura_moderada: 2.2,
        };

        // Gordura: Fixa em 0.8g por kg de peso corporal.
        const gordura_g = peso * 0.8;
        const calorias_gordura = gordura_g * 9;

        // Proteína: Varia conforme o estado atual, com um padrão de 2.0g/kg.
        const proteina_multiplicador = fatoresProteina[estado_atual] || 2.0;
        const proteina_g = peso * proteina_multiplicador;
        const calorias_proteina = proteina_g * 4;

        // Carboidratos: O restante das calorias.
        const calorias_restantes = calorias_totais - calorias_proteina - calorias_gordura;
        let carboidrato_g = calorias_restantes / 4;

        // Validação para garantir que carboidratos não fiquem negativos.
        if (carboidrato_g < 0) {
            carboidrato_g = 0;
        }
        // ================== FIM DA SEÇÃO MODIFICADA ==================
        
        // --- Arredondamentos Finais ---
        setResults({
            tmb: Math.round(tmb),
            tdee: Math.round(tdee_final),
            finalCalories: Math.round(calorias_totais),
            proteinGrams: Math.round(proteina_g),
            carbsGrams: Math.round(carboidrato_g),
            fatGrams: Math.round(gordura_g),
        });
        
        localStorage.setItem('evolviNutriCalculatorData', JSON.stringify(formData));
        
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1, y: 0,
            transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
        }),
    };

    return (
        <div className={styles.calculatorWrapper}>
            <form onSubmit={handleSubmit}>
                <motion.div className={styles.formSection} custom={0} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Sexo</h2>
                    <div className={styles.radioGrid}>
                        <label className={`${styles.radioCard} ${formData.sexo === 'masculino' ? styles.selected : ''}`}>
                            <input type="radio" name="sexo" value="masculino" checked={formData.sexo === 'masculino'} onChange={handleChange} />
                            Masculino
                        </label>
                        <label className={`${styles.radioCard} ${formData.sexo === 'feminino' ? styles.selected : ''}`}>
                            <input type="radio" name="sexo" value="feminino" checked={formData.sexo === 'feminino'} onChange={handleChange} />
                            Feminino
                        </label>
                    </div>
                </motion.div>

                <motion.div className={styles.formSection} custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Biotipo</h2>
                    <Image src="/images/biotypes.png" alt="Biotipos" width={300} height={100} className={styles.biotypeImage} />
                    <div className={styles.radioGridThree}>
                         <label className={`${styles.radioCard} ${formData.biotipo === 'ectomorfo' ? styles.selected : ''}`}>
                            <input type="radio" name="biotipo" value="ectomorfo" checked={formData.biotipo === 'ectomorfo'} onChange={handleChange} />
                            Ectomorfo
                        </label>
                        <label className={`${styles.radioCard} ${formData.biotipo === 'mesomorfo' ? styles.selected : ''}`}>
                            <input type="radio" name="biotipo" value="mesomorfo" checked={formData.biotipo === 'mesomorfo'} onChange={handleChange} />
                            Mesomorfo
                        </label>
                         <label className={`${styles.radioCard} ${formData.biotipo === 'endomorfo' ? styles.selected : ''}`}>
                            <input type="radio" name="biotipo" value="endomorfo" checked={formData.biotipo === 'endomorfo'} onChange={handleChange} />
                            Endomorfo
                        </label>
                    </div>
                </motion.div>

                <motion.div className={styles.formSection} custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="idade">Idade (anos)</label>
                        <input type="number" id="idade" name="idade" value={formData.idade} onChange={handleNumericChange} min="1" placeholder="Ex: 25" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="altura">Altura (cm)</label>
                        <input type="number" id="altura" name="altura" value={formData.altura} onChange={handleNumericChange} min="1" placeholder="Ex: 175" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="peso">Peso (kg)</label>
                        <input type="number" id="peso" name="peso" value={formData.peso} onChange={handleNumericChange} min="1" placeholder="Ex: 70" required />
                    </div>
                </motion.div>

                <motion.div className={styles.formSection} custom={3} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Atividade e Objetivos</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="atividade">Nível de Atividade</label>
                        <select id="atividade" name="atividade" value={formData.atividade} onChange={handleNumericChange}>
                            <option value={1.2}>Sedentário (pouco ou nenhum exercício)</option>
                            <option value={1.375}>Levemente ativo (exercício leve 1-3 dias/semana)</option>
                            <option value={1.55}>Moderadamente ativo (exercício moderado 3-5 dias/semana)</option>
                            <option value={1.725}>Muito ativo (exercício pesado 6-7 dias/semana)</option>
                            <option value={1.9}>Extremamente ativo (exercício muito pesado, trabalho físico)</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="objetivo">Objetivo</label>
                        <select id="objetivo" name="objetivo" value={formData.objetivo} onChange={handleChange}>
                            <option value="emagrecer_leve">Emagrecer (Leve)</option>
                            <option value="emagrecer_agressivo">Emagrecer Agressivo</option>
                            <option value="manter_peso">Manter peso</option>
                            <option value="ganhos_secos">Ganhos Secos (Leve)</option>
                            <option value="ganhar_agressivo">Ganhar Peso Agressivo</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="estado_atual">Estado Atual</label>
                        <select id="estado_atual" name="estado_atual" value={formData.estado_atual} onChange={handleChange}>
                            <option value="magro">Magro</option>
                            <option value="magro_gordura_moderada">Magro com gordura moderada</option>
                            <option value="falso_magro">Falso magro (skinny fat)</option>
                            <option value="muito_acima_peso">Muito acima do peso</option>
                        </select>
                    </div>
                </motion.div>

                <motion.button type="submit" className={styles.ctaButton} disabled={!isFormValid} whileHover={{ scale: isFormValid ? 1.03 : 1 }} whileTap={{ scale: isFormValid ? 0.98 : 1 }}>
                    <Zap size={20} /> Calcular Minha Dieta
                </motion.button>
            </form>

            <AnimatePresence>
                {results && (
                    <div ref={resultsRef} className={styles.resultsContainer}>
                        <motion.h2 className={styles.sectionTitle} initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.2}}>Resultados da Sua Dieta</motion.h2>
                        <div className={styles.resultsGrid}>
                            <motion.div className={styles.resultBlock} custom={0} initial="hidden" animate="visible" variants={cardVariants}>
                                <p>Taxa Metabólica Basal (TMB)</p>
                                <span className={styles.resultValue}><AnimatedNumber value={results.tmb} /> Kcal</span>
                            </motion.div>
                            <motion.div className={styles.resultBlock} custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                                <p>Gasto Energético Total (TDEE)</p>
                                <span className={styles.resultValue}><AnimatedNumber value={results.tdee} /> Kcal</span>
                            </motion.div>
                            <motion.div className={`${styles.resultBlock} ${styles.highlight}`} custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                                <p>Calorias Diárias (Objetivo)</p>
                                <span className={styles.resultValue}><AnimatedNumber value={results.finalCalories} /> Kcal</span>
                            </motion.div>
                        </div>
                        <motion.div className={styles.macrosSection} custom={3} initial="hidden" animate="visible" variants={cardVariants}>
                             <h3 className={styles.macrosTitle}>Macronutrientes</h3>
                             <div className={styles.macrosGrid}>
                                <div><h4>Carboidratos</h4><span><AnimatedNumber value={results.carbsGrams} /> g</span></div>
                                <div><h4>Proteínas</h4><span><AnimatedNumber value={results.proteinGrams} /> g</span></div>
                                <div><h4>Gorduras</h4><span><AnimatedNumber value={results.fatGrams} /> g</span></div>
                             </div>
                        </motion.div>
                        <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{delay: 0.8}}>
                            <a href="#planos" className={styles.nextStepButton}>
                                <TrendingUp size={20} /> Escolher Meu Plano Agora
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}