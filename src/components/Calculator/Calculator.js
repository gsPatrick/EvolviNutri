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
        gender: 'male',
        biotype: 'mesomorph',
        age: '',
        weight: '',
        height: '',
        activityLevel: 1.55, // Moderadamente ativo
        objective: 1.0,      // Manter peso
        currentState: 'magro-gordura-moderada'
    });
    const [results, setResults] = useState(null); // Armazena os resultados do cálculo
    const resultsRef = useRef(null); // Referência para scroll automático

    // Validação em tempo real para habilitar o botão de cálculo
    const isFormValid = formData.age > 0 && formData.weight > 0 && formData.height > 0;

    /**
     * Lida com mudanças em campos de texto e select.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - O evento de mudança.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (results) setResults(null); // Esconde resultados antigos se os dados mudarem
    };

    /**
     * Lida com mudanças em campos numéricos, garantindo que o valor seja um número.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - O evento de mudança.
     */
    const handleNumericChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: parseFloat(value) || ''}));
        if (results) setResults(null);
    }

    /**
     * Função chamada ao submeter o formulário de cálculo.
     * @param {React.FormEvent<HTMLFormElement>} e - O evento de submit.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return; // Segurança extra
        
        const { gender, age, weight, height, activityLevel, objective } = formData;

        // Fórmula de Harris-Benedict (revisada) para Taxa Metabólica Basal (TMB)
        let tmb;
        if (gender === 'male') {
            tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Gasto Energético Total Diário (TDEE)
        const tdee = tmb * activityLevel;
        
        // Calorias finais baseadas no objetivo (multiplicador percentual)
        const finalCalories = tdee * objective;

        // Cálculo de Macros (Exemplo: 40% Carboidratos, 30% Proteínas, 30% Gorduras)
        const proteinGrams = (finalCalories * 0.30) / 4;
        const carbsGrams = (finalCalories * 0.40) / 4;
        const fatGrams = (finalCalories * 0.30) / 9;

        // Atualiza o estado para exibir os resultados na UI
        setResults({ tmb, tdee, finalCalories, proteinGrams, carbsGrams, fatGrams });
        
        // --- AÇÃO CRUCIAL PARA O FUNIL ---
        // Salva os dados do formulário no localStorage para serem usados na próxima etapa.
        localStorage.setItem('evolviNutriCalculatorData', JSON.stringify(formData));
        
        // Scroll suave para a seção de resultados após um pequeno delay
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    // Variantes para animação de entrada dos cards
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1, y: 0,
            transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
        }),
    };

    // --- Renderização do Componente ---
    return (
        <div className={styles.calculatorWrapper}>
            <form onSubmit={handleSubmit}>
                {/* --- CARD SEXO --- */}
                <motion.div className={styles.formSection} custom={0} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Sexo</h2>
                    <div className={styles.radioGrid}>
                        <label className={`${styles.radioCard} ${formData.gender === 'male' ? styles.selected : ''}`}>
                            <input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} />
                            Masculino
                        </label>
                        <label className={`${styles.radioCard} ${formData.gender === 'female' ? styles.selected : ''}`}>
                            <input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} />
                            Feminino
                        </label>
                    </div>
                </motion.div>

                {/* --- CARD BIOTIPO --- */}
                <motion.div className={styles.formSection} custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Biotipo</h2>
                    <Image src="/images/biotypes.png" alt="Biotipos" width={300} height={100} className={styles.biotypeImage} />
                    <div className={styles.radioGridThree}>
                         <label className={`${styles.radioCard} ${formData.biotype === 'ectomorph' ? styles.selected : ''}`}>
                            <input type="radio" name="biotype" value="ectomorph" checked={formData.biotype === 'ectomorph'} onChange={handleChange} />
                            Ectomorfo
                        </label>
                        <label className={`${styles.radioCard} ${formData.biotype === 'mesomorph' ? styles.selected : ''}`}>
                            <input type="radio" name="biotype" value="mesomorph" checked={formData.biotype === 'mesomorph'} onChange={handleChange} />
                            Mesomorfo
                        </label>
                         <label className={`${styles.radioCard} ${formData.biotype === 'endomorph' ? styles.selected : ''}`}>
                            <input type="radio" name="biotype" value="endomorph" checked={formData.biotype === 'endomorph'} onChange={handleChange} />
                            Endomorfo
                        </label>
                    </div>
                </motion.div>

                {/* --- CARD DADOS PESSOAIS --- */}
                <motion.div className={styles.formSection} custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="age">Idade (anos)</label>
                        <input type="number" id="age" name="age" value={formData.age} onChange={handleNumericChange} min="1" placeholder="Ex: 25" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="height">Altura (cm)</label>
                        <input type="number" id="height" name="height" value={formData.height} onChange={handleNumericChange} min="1" placeholder="Ex: 175" required />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="weight">Peso (kg)</label>
                        <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleNumericChange} min="1" placeholder="Ex: 70" required />
                    </div>
                </motion.div>

                {/* --- CARD ATIVIDADE E OBJETIVOS --- */}
                <motion.div className={styles.formSection} custom={3} initial="hidden" animate="visible" variants={cardVariants}>
                    <h2 className={styles.sectionTitle}>Atividade e Objetivos</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="activityLevel">Nível de Atividade</label>
                        <select id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleNumericChange}>
                            <option value={1.2}>Sedentário (pouco ou nenhum exercício)</option>
                            <option value={1.375}>Levemente ativo (exercício leve 1-3 dias/semana)</option>
                            <option value={1.55}>Moderadamente ativo (exercício moderado 3-5 dias/semana)</option>
                            <option value={1.725}>Muito ativo (exercício pesado 6-7 dias/semana)</option>
                            <option value={1.9}>Extremamente ativo (exercício muito pesado, trabalho físico)</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="objective">Objetivo</label>
                        <select id="objective" name="objective" value={formData.objective} onChange={handleNumericChange}>
                            <option value={0.85}>Emagrecer (-15%)</option>
                            <option value={0.70}>Emagrecer Agressivo (-30%)</option>
                            <option value={1.0}>Manter peso</option>
                            <option value={1.07}>Ganhos Secos (+7%)</option>
                            <option value={1.15}>Ganhar Peso Agressivo (+15%)</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="currentState">Estado Atual</label>
                        <select id="currentState" name="currentState" value={formData.currentState} onChange={handleChange}>
                            <option value="magro">Magro</option>
                            <option value="magro-gordura-moderada">Magro com gordura moderada</option>
                            <option value="falso-magro">Falso magro (skinny fat)</option>
                            <option value="muito-acima-peso">Muito acima do peso</option>
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
                            <a href="/formulario" className={styles.nextStepButton}>
                                <TrendingUp size={20} /> Criar Minha Dieta Personalizada
                            </a>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}