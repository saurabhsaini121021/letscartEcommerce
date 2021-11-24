import React from "react";
import logo from '../../../images/logo.jpg';
import "./Footer.css";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <img src={logo} alt="logo" />
            </div>

            <div className="midFooter">
                <h1>LET'S CART</h1>
                <p>Don't worry we have it</p>

                <p>{(new Date().getFullYear())} &copy; Saurabh Saini</p>
            </div>

            <div className="rightFooter">
                <h4>Contact Us</h4>
                <a href="https://www.linkedin.com/in/saurabh-saini-546954156/">LinkedIn</a>
                <a href="https://www.facebook.com/profile.php?id=100004964596174">Facebook</a>
                <a target='blank' href="mailto:sainisaurabh121021@gmail.com">Gmail</a>
            </div>
        </footer>
    );
};

export default Footer;