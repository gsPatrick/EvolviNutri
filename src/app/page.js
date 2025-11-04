// src/app/page.js

import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Plans from "@/components/Plans/Plans"; // Importe o componente
import styles from './page.module.css';
import Footer from "@/components/Footer/Footer";
export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <Hero />
      <Plans /> {/* Adicione a seção de planos aqui */}
      <Footer />
      {/* Footer virá aqui */}
    </main>
  );
}