import { Link, useLocation } from 'react-router-dom';
import SuperAgentLogoWhite from "../assets/Logo/SuperAgentLogo.svg";

export const Footer = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <footer style={{ 
            background: 'linear-gradient(180deg, #000000, #001008)', 
            color: '#ffffff', 
            padding: '60px 0 20px', 
            position: 'relative', 
            overflow: 'hidden'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                padding: '0 20px',
                position: 'relative'
            }}>
                {/* Logo Section */}
                <div style={{ marginBottom: '30px', flex: '1 1 200px' }}>
                    <img 
                        src={SuperAgentLogoWhite} 
                        alt="Super Agent" 
                        style={{ 
                            width: '150px', 
                            height: 'auto', 
                            filter: 'grayscale(1) brightness(2)', 
                            transition: 'filter 0.3s ease', 
                            cursor: 'pointer' 
                        }}
                        onMouseOver={(e) => e.target.style.filter = 'grayscale(0) brightness(1)'}
                        onMouseOut={(e) => e.target.style.filter = 'grayscale(1) brightness(2)'} 
                    />
                </div>

                {/* Navigation Section */}
                <div style={{ marginBottom: '30px', flex: '1 1 200px' }}>
                    <h4 style={{ 
                        color: '#ffffff', 
                        marginBottom: '20px', 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        letterSpacing: '1px', 
                        textTransform: 'uppercase' 
                    }}>
                        Explore
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {['/', '/features', '/about', '/contact'].map((path, index) => (
                            <Link
                                key={path}
                                to={path}
                                className={`text-gray-300 relative group transition-colors ${isActive(path) ? "text-blue-500" : ""}`}
                            >
                                {['Home', 'Features', 'About', 'Contact'][index]}
                            </Link>
                        ))}
                        <Link
                            to={isActive("/signup") ? "/login" : "/signup"}
                            className="text-gray-300 relative group transition-colors"
                        >
                            {isActive("/signup") ? "Login" : "Sign Up"}
                        </Link>
                    </div>
                </div>

                {/* Contact Info */}
                <div style={{ marginBottom: '30px', flex: '1 1 200px' }}>
                    <h4 style={{ 
                        color: '#ffffff', 
                        marginBottom: '20px', 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        letterSpacing: '1px', 
                        textTransform: 'uppercase' 
                    }}>
                        Get in Touch
                    </h4>
                    <div style={{ 
                        color: '#bdbdbd', 
                        fontSize: '0.95rem', 
                        lineHeight: '1.6', 
                        margin: '0'
                    }}>
                        <a href="mailto:contact@superagent.com" style={{ 
                            color: '#bdbdbd', 
                            textDecoration: 'none', 
                            transition: 'color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#ffffff'}
                        onMouseOut={(e) => e.target.style.color = '#bdbdbd'}
                        >
                            contact@superagent.com
                        </a>
                        <br />
                        <a href="tel:+1234567890" style={{ 
                            color: '#bdbdbd', 
                            textDecoration: 'none', 
                            transition: 'color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#ffffff'}
                        onMouseOut={(e) => e.target.style.color = '#bdbdbd'}
                        >
                            +251-946-724-764
                        </a>
                        <br />
                        <a href="address: Addis Ababa, Ethiopia" style={{ 
                            color: '#bdbdbd', 
                            textDecoration: 'none', 
                            transition: 'color 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.color = '#ffffff'}
                        onMouseOut={(e) => e.target.style.color = '#bdbdbd'}
                        >
                            Addis Ababa, Ethiopia
                        </a>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div style={{ 
                marginTop: '10px', 
                paddingTop: '30px', 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                fontSize: '0.8rem', 
                color: '#888', 
                textAlign: 'center', 
                position: 'relative',
            }}>
                <p style={{ margin: '0', letterSpacing: '0.5px' }}>
                    &copy; {new Date().getFullYear()} Super Agent. All rights reserved. | 
                    <a href="/privacy" style={{ 
                        color: '#888', 
                        textDecoration: 'none', 
                        marginLeft: '10px', 
                        transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#ffffff'}
                    onMouseOut={(e) => e.target.style.color = '#888'}
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>
        </footer>
    );
};
