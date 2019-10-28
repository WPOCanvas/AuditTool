import React from 'react';
import './layout.css';
const Layout = ({ children }) => {
    return (
        <div className= "boxFit">
            <div className="rowFit content">{children}</div>
        </div>
    )
}

export default Layout;