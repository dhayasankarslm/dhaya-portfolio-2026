import React from "react";
import {ArrowUp,DownloadSimple,EnvelopeSimple,InstagramLogo} from "@phosphor-icons/react";

export function PersonalFooter({email,cv}){
  return <footer id="contact" className="personal-footer yash-footer" data-scene="contact">
    <div className="footer-stage">
      <span className="footer-doodle flower-left" aria-hidden="true">✿</span>
      <span className="footer-doodle flower-right" aria-hidden="true">✿</span>
      <span className="footer-doodle flower-right-small" aria-hidden="true">✿</span>
      <span className="footer-doodle footer-dot" aria-hidden="true">●</span>
      <div className="footer-copy">
        <h2><span>All Designs</span><span className="footer-second-line"><i aria-hidden="true">●</i>Shippable</span></h2>
      </div>
      <span className="footer-signature" aria-label="Dhaya">dhaya</span>
      <span className="footer-heart" aria-hidden="true">♥</span>
    </div>
    <div className="footer-bar">
      <span className="footer-copyright">© {new Date().getFullYear()} Dhayasankar Vasudevan</span>
      <nav aria-label="Footer links">
        <a href="https://www.instagram.com/__.dhayasankar.__/" target="_blank" rel="noopener noreferrer"><InstagramLogo/>Instagram</a>
        <a href={"mailto:" + email}><EnvelopeSimple/>Email</a>
        <a href={cv} download>Download my CV <DownloadSimple/></a>
      </nav>
      <a className="footer-top" href="#home">Back to top <ArrowUp/></a>
    </div>
  </footer>;
}
