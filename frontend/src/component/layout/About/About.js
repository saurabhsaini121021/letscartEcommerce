import React from "react";
import "./aboutSection.css";
import { Typography, Avatar } from "@material-ui/core";


const About = () => {
    return (
        <div className="aboutSection">
            <div></div>
            <div className="aboutSectionGradient"></div>
            <div className="aboutSectionContainer">
                <Typography component="h1">About</Typography>

                <div>
                    <div>
                        <Avatar
                            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
                            src="https://saurabhsaini121021.github.io/MyPortfolio/static/media/profile.cb98ab35.JPG"
                            alt="Founder"
                        />
                        <Typography>Saurabh Saini</Typography>
                        <span>
                            Hi there! I am
                            Saurabh Saini

                            I am a Full Stack Web Developer with React.js, Redux, Express.js, Node.js, and Mongo DB as my tech stack.
                            I'm currently a final year student at Chandigarh Group of Colleges pursuing Btech in Computer Science Engineering
                            I'm experienced in developing and designing products for the web, from simple landing pages to full-fledged web apps.
                            I love learning about new technologies and I have good problem solving skills.
                        </span>
                        <a href="https://saurabhsaini121021.github.io/MyPortfolio/" rel="noopener noreferrer" style={{ textDecoration: 'none' }} target="_blank">
                            <span >Here Checkout my Personal Portfolio</span>
                        </a>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default About;