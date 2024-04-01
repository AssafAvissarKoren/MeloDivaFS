// import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { AppFooter } from './cmps/AppFooter.jsx';
import { Index } from './pages/Index.jsx';
import { UserMsg } from './cmps/UserMsg';
import { Register } from './pages/Register.jsx';

export function App() {
    return (
        <Router>
            <section className='main-app'>
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/melodiva/home" replace />} />
                        <Route path="/melodiva/signup" element={<Register type={"signup"}/>} />
                        <Route path="/melodiva/login" element={<Register type={"login"}/>} />
                        <Route path="/melodiva/:tab/:collectionId?" element={<Index />} />
                    </Routes>
                </main>
                <UserMsg />
                {/* <AppFooter /> */}
            </section>
        </Router>
    );
}