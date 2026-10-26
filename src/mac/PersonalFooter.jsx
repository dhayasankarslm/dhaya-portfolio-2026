import React from "react";
import {ArrowUpRight,ArrowUp,DownloadSimple,EnvelopeSimple,InstagramLogo} from "@phosphor-icons/react";
export function PersonalFooter({email,cv}){
  return <footer id="contact" className="personal-footer yash-footer" data-scene="contact">
    <div className="footer-stage">
      <span className="footer-doodle flower-left" aria-hidden="true">✿</span>
      <span className="footer-doodle flower-right" aria-hidden="true">✿</span>
      <div className="footer-copy">
        <p>ONE LAST THING BEFORE YOU GO</p>
        <h2><span>Good questions</span><span>lead somewhere.</span></h2>
        <a className="footer-talk" href={"mailto:" + email}>Let’s make something together <ArrowUpRight/></a>
      </div>
      <div className="footer-photo"><img src="assets/images/portrait.jpg" alt="Dhaya smiling"/></div>
      <p className="footer-caption">Me, waiting to hear what you’re making :)</p>
      <span className="footer-signature" aria-label="Dhaya">dhaya</span>
    </div>
    <div className="footer-bar">
      <span>© {new Date().getFullYear()} Dhayasankar Vasudevan</span>
      <nav aria-label="Footer links">
        <a href="https://www.instagram.com/__.dhayasankar.__/" target="_blank" rel="noopener noreferrer"><InstagramLogo/>Instagram</a>
        <a href={"mailto:" + email}><EnvelopeSimple/>Email</a>
        <a href={cv} download>Download my CV <DownloadSimple/></a>
        <a href="#home">Back to top <ArrowUp/></a>
      </nav>
    </div>
  </footer>;
}
