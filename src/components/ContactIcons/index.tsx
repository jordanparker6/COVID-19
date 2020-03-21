import React from 'react'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

import './index.css'

export default function ContactIcons() {
    return (
        <div id="contact-icon-list">
            <a className="contact-icon" href="https://www.linkedin.com/in/jordan-parker-092a7258/">
                <LinkedInIcon/>
            </a>
            <a className="contact-icon" href="https://github.com/jordanparker6/COVID-19">
                <GitHubIcon/>
            </a>
        </div>
    );
}
