import React from "react";
import {ArrowUpRight,ArrowUp,DownloadSimple,EnvelopeSimple,InstagramLogo} from "@phosphor-icons/react";
export function PersonalFooter({email,cv}){
  return <footer id="contact" className="personal-footer yash-footer" data-scene="contact">
    <div className="footer-stage">
      <svg className="footer-svg-defs" aria-hidden="true" focusable="false"><defs><clipPath id="dhaya-photo-cutout" clipPathUnits="objectBoundingBox"><path d="M .51 .09 C .61 .09 .69 .13 .76 .2 C .82 .27 .86 .36 .86 .45 C .86 .52 .84 .58 .81 .62 C .8 .67 .77 .71 .73 .74 C .76 .78 .83 .8 .9 .83 C .95 .86 .99 .9 1 .95 L 1 1 L 0 1 L 0 .93 C .04 .88 .12 .84 .21 .81 C .28 .78 .31 .75 .32 .71 C .28 .69 .25 .65 .23 .6 C .2 .54 .21 .48 .22 .42 C .23 .36 .24 .3 .28 .25 C .32 .18 .39 .11 .51 .09 Z"/></clipPath></defs></svg>
      <span className="footer-doodle flower-left" aria-hidden="true">✿</span>
      <span className="footer-doodle flower-right" aria-hidden="true">✿</span>
      <div className="footer-copy">
        <p>ONE LAST THING BEFORE YOU GO</p>
        <h2><span>Good questions</span><span>lead somewhere.</span></h2>
        <a className="footer-talk" href={"mailto:" + email}>Let’s make something together <ArrowUpRight/></a>
      </div>
      <div className="footer-photo"><img src="assets/images/dhaya-footer-photo.jpg" alt="Dhaya in a plaid shirt"/></div>
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
