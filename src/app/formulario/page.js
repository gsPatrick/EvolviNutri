// /src/app/formulario/page.js

import { Suspense } from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import FormularioClient from './FormularioClient'; // <-- Importa o seu formulário
import styles from './Formulario.module.css';
import { LoaderCircle } from 'lucide-react';

// Componente de carregamento que aparece enquanto o formulário é preparado
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
                <Suspense fallback={<FormularioLoading />}>
                    <FormularioClient />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}