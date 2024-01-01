import { Route, HashRouter as Router, Routes, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { AppFooter } from './cmps/AppFooter';
import { AppHeader } from './cmps/AppHeader';
import { EmailIndex } from './cmps/EmailIndex';
import { EmailDetails } from './cmps/EmailDetails';
import { EmailCompose } from './cmps/EmailCompose';
import { EmailList } from './cmps/EmailList';
import { UserMsg } from './cmps/UserMsg';

export function App() {
    return (
        <Router>
            <section className='main-app'>
                <main className='container'>
                    <Routes>
                        <Route path="/" element={<Navigate to="/email/inbox" replace />} />
                        <Route path="/email/aboutUs" element={<AboutUs />} />
                        <Route path="/email/:folder" element={<EmailIndex />}>
                            <Route index element={<EmailList />} />
                            <Route path=":emailId" element={<EmailDetails />} />
                            <Route path="compose" element={<EmailCompose />} />
                            <Route path="edit/:emailId" element={<EmailCompose />} />
                        </Route>
                    </Routes>
                </main>
                <UserMsg />
                <AppFooter />
            </section>
        </Router>
    );
}
