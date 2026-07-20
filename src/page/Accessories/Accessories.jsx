// Developer: Mahmoud Sameh Fathy Ibrahim
// Student Code: 624018

import React, { useContext } from 'react';
import './Accessories.css';
import { LanguageContext } from '../../components/context/LanguageContext';

function Accessories() {
    const { t } = useContext(LanguageContext) || {};

    return (
        <div className='static_page'>
            <div className="container">
                <h1 className='page_title'>{t ? t('accessories') : 'Accessories'}</h1>
                <div className='page_content'>
                    <p>
                        {t 
                          ? t('accessoriesDesc') 
                          : 'Discover our wide range of premium accessories tailored fit your every need. From tech gadgets to daily essentials, we have it all.'
                        }
                    </p>
                </div>
                <div className='placeholder_grid'>
                    {/* Placeholder for future products */}
                    <p>{t ? t('moreItemsSoon') : 'More items coming soon...'}</p>
                </div>
            </div>
        </div>
    );
}

export default Accessories;
