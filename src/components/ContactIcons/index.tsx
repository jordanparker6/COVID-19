import React from 'react'
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import IconButton from '@material-ui/core/IconButton'

import './index.css'

export default function ContactIcons() {
    return (
        <div id="contact-icon-list">
            <ContactIcon href="https://www.linkedin.com/in/jordan-parker-092a7258/">
                <LinkedInIcon/>
            </ContactIcon>
            <ContactIcon href="https://github.com/jordanparker6/COVID-19">
                <GitHubIcon/>
            </ContactIcon>
        </div>
    );
}


type IconProps = { href: string, children: React.ReactNode }
function ContactIcon(props: IconProps) {
    const style = {
        padding: 0
    }
    return (
        <IconButton style={style} component="a" className="contact-icon" href={props.href}>
            {props.children}
        </IconButton>
    )
} 