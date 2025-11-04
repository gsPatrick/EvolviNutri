// src/components/Header/Header.js
'use client';

import Link from 'next/link';
import { Dna } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Header.module.css';

export default function Header() {
  return (
    <motion.header 
      className={styles.header}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Link href="/" className={styles.logo}>
        <Dna size={32} color="#32A852" />
        <h1>Evolvi Nutri</h1>
      </Link>
      <nav className={styles.nav}>
        <motion.a 
          href="#planos" 
          className={styles.ctaButton}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #32A852" }}
          whileTap={{ scale: 0.95 }}
        >
          Ver Planos
        </motion.a>
      </nav>
    </motion.header>
  );
}