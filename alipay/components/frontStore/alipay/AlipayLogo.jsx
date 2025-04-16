import React from 'react';
import PropTypes from 'prop-types';

export default function AlipayLogo({ width = 100 }) {
    return (
        <div style={{ width: `${width}px` }}>
            {/* Replace with your logo from public folder */}
            <img
                src="/alipay_logo.svg"
                alt="Alipay"
                style={{ width: '100%', height: 'auto' }}
            />
        </div>
    );
}

AlipayLogo.propTypes = {
    width: PropTypes.number
};