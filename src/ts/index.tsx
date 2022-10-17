import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

new Promise<void>(resolv => window.onload = () => resolv())
.then(() => {
    const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );    
});
