import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import App from './App';
import { BrowserRouter, HashRouter } from 'react-router-dom'
import ScrollToTop from './ScrollToTop';

ReactDOM.render(
    <BrowserRouter>
        <Provider store= { store }>    
            <HashRouter>
                <ScrollToTop>
                    <App></App>
                </ScrollToTop>
            </HashRouter>
        </Provider>
    </BrowserRouter>
        ,
        document.getElementById('root')
    
);

