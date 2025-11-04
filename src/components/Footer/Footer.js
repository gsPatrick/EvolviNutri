// src/components/Footer/Footer.js
import { Dna, Instagram, Facebook, ArrowRight, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <div className={styles.footerWrapper}>
            <footer className={styles.mainFooter}>
                <div className={styles.footerColumn}>
                    <div className={styles.logo}>
                        <Dna size={32} color="#32A852" />
                        <h2>Evolvi Nutri</h2>
                    </div>
                    <p className={styles.description}>
                        Ciência e tecnologia para desbloquear o seu máximo potencial.
                    </p>
                    <div className={styles.socials}>
                        <a href="#" aria-label="Instagram" className={styles.socialIcon}><Instagram size={22} /></a>
                        <a href="#" aria-label="Facebook" className={styles.socialIcon}><Facebook size={22} /></a>
                    </div>
                </div>

                <div className={styles.footerColumn}>
                    <h4 className={styles.columnTitle}>Suporte ao Cliente</h4>
                    <a href="tel:+5511999998888" className={styles.contactLink}>
                        (11) 99999-8888
                    </a>
                    <a href="#" className={styles.subLink}>
                        Central de Atendimento <ArrowRight size={16} />
                    </a>
                </div>

                <div className={styles.footerColumn}>
                    <h4 className={styles.columnTitle}>Consultoria Premium</h4>
                    <a href="tel:+5511999997777" className={styles.contactLink}>
                        (11) 99999-7777
                    </a>
                     <a href="#" className={styles.subLink}>
                        Fale com um especialista <ArrowRight size={16} />
                    </a>
                </div>
            </footer>
            <div className={styles.creditBar}>
                <p>
                    Desenvolvido por <a href="https://www.codebypatrick.dev/" target="_blank" rel="noopener noreferrer">Patrick.Developer</a>
                </p>
            </div>

            {/* Botão Flutuante do WhatsApp */}
            <a 
                href="https://wa.me/SEUNUMERODOWHATSAPP" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.whatsappButton}
                aria-label="Fale conosco pelo WhatsApp"
            >
                <MessageCircle size={32} />
            </a>
        </div>
    );
}