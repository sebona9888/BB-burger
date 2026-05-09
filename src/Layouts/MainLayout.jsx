import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from '../comp_temp/Navbar/Navbar';
import Footer from '../comp_temp/Footer/Footer';

const MainLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;