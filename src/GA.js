import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalyticsWrapper = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', 'G-3QKMFJSBYQ', {
                page_path: location.pathname + location.search,
            });
        }
    }, [location]);

    return children;
};

export default GoogleAnalyticsWrapper;
