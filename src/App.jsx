import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AppFooter } from './cmps/AppFooter.jsx';
import { Index } from './cmps/Index.jsx';
import { UserMsg } from './cmps/UserMsg';
import { Home } from './pages/Home.jsx';

export function App() {
    return (
        <Router>
            <section className='main-app'>
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/melodiva/home" replace />} />
                        <Route path="/melodiva/:tab" element={<Index />} />
                    </Routes>
                </main>
                <UserMsg />
                <AppFooter />
            </section>
        </Router>
    );
}