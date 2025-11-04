// src/components/Hero/Hero.js
'use client';

import styles from './Hero.module.css';
import Calculator from '../Calculator/Calculator'; // 1. Importe a calculadora

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundGlow}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          O FUTURO DA SUA SAÚDE COMEÇA COM A DECISÃO DE HOJE.
        </h1>
        <p className={styles.subtitle}>
          Use nossa inteligência artificial para gerar um plano nutricional
          baseado em ciência, perfeitamente alinhado aos seus objetivos.
        </p>
        
        {/* 2. Substitua o placeholder pelo componente */}
        <Calculator />
      </div>
    </section>
  );
}