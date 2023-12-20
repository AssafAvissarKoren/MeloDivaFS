import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { AppFooter } from './cmps/AppFooter'
import { AppHeader } from './cmps/AppHeader'
import { EmailIndex } from './cmps/EmailIndex';
import { EmailDetails } from './cmps/EmailDetails';
import { EmailCompose } from './cmps/EmailCompose';

export function App() {
    return (
    <Router>
        <section className='main-app'>
            <AppHeader />
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/aboutUs" element={<AboutUs />} />
                        <Route path="/email" element={<EmailIndex />} />
                        <Route path="/email/:emailId" element={<EmailDetails />} />
                        <Route path="/email/compose" element={<EmailCompose />} />
                    </Routes>
                </main>
            <AppFooter />
        </section>
    </Router>
    )
}

