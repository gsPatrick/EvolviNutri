// /src/app/formulario/page.js

import { Suspense } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FormularioClient from './FormularioClient'; // <-- Importa o novo componente
import styles from './Formulario.module.css';
import { LoaderCircle } from 'lucide-react';

/**
 * Componente de fallback que será exibido enquanto o formulário principal está carregando.
 * Isso é essencial para o <Suspense> funcionar.
 */
function FormularioLoading() {
    return (
        <div className={styles.loadingContainer}>
            <LoaderCircle size={48} className={styles.spinner} />
            <p>Carregando seu formulário...</p>
        </div>
    );
}

export default function FormularioPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                {/* 
                  A MÁGICA ACONTECE AQUI:
                  <Suspense> diz ao Next.js para renderizar o 'fallback' (nosso componente de loading)
                  no servidor, e só tentar renderizar <FormularioClient /> quando ele estiver
                  no navegador do cliente. Isso evita que o hook 'useSearchParams' quebre o build.
                */}
                <Suspense fallback={<FormularioLoading />}>
                    <FormularioClient />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}