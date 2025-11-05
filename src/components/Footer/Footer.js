// src/components/Footer/Footer.js
import { Dna, ArrowRight, MessageCircle } from 'lucide-react';
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
                </div>

                <div className={styles.footerColumn}>
                    <h4 className={styles.columnTitle}>Suporte ao Cliente</h4>
                    <a href="tel:+5513997433976" className={styles.contactLink}>
                        (13) 99743-3976
                    </a>
                    <a href="#" className={styles.subLink}>
                        Central de Atendimento <ArrowRight size={16} />
                    </a>
                </div>

                <div className={styles.footerColumn}>
                    <h4 className={styles.columnTitle}>Consultoria Premium</h4>
                    <a href="tel:+5513981086937" className={styles.contactLink}>
                        (13) 98108-6937
                    </a>
                    <a href="#" className={styles.subLink}>
                        Fale com um especialista <ArrowRight size={16} />
                    </a>
                </div>
            </footer>

            <div className={styles.creditBar}>
                <p>
                    Desenvolvido por{' '}
                    <a
                        href="https://www.codebypatrick.dev/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Patrick.Developer
                    </a>
                </p>
            </div>

            {/* Botão Flutuante do WhatsApp */}
            <a 
                href="https://wa.me/5513981086937" 
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
