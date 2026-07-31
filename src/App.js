import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { LoadingState } from './components/UI';
import { LanguageProvider, useI18n } from './i18n';
import './App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const CarsPage = lazy(() => import('./pages/CarsPage'));
const CarDetailsPage = lazy(() => import('./pages/CarDetailsPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function Router() {
  const { t } = useI18n();
  return <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Layout><Suspense fallback={<section className="section"><div className="container"><LoadingState label={t('common.loading')} /></div></section>}><Routes><Route path="/" element={<HomePage />} /><Route path="/cars" element={<CarsPage />} /><Route path="/cars/:carId" element={<CarDetailsPage />} /><Route path="/booking" element={<BookingPage />} /><Route path="/about" element={<AboutPage />} /><Route path="/shop" element={<ShopPage />} /><Route path="/partner" element={<PartnerPage />} /><Route path="/contact" element={<ContactPage />} /><Route path="*" element={<NotFoundPage />} /></Routes></Suspense></Layout></HashRouter>;
}

function App() {
  return <LanguageProvider><Router /></LanguageProvider>;
}

export default App;
