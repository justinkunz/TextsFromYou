import React from "react";

class FooterLinks extends React.Component {
  openLink(url) {
    const win = window.open(url, "_blank");
    win.focus();
  }

  footerLinks = [
    {
      title: "Privacy Policy",
      onClick: () => this.props.handlePrivacyToggle(),
      key: "privacy"
    },
    {
      title: "Terms of Use",
      onClick: () => this.openLink(this.props.termsLink),
      key: "terms"
    },
    {
      title: "Unsubscribe",
      onClick: () => this.props.toggleUnsub(),
      key: "unsub"
    },
    {
      title: "Report A Bug / Contact Us",
      onClick: () => this.props.toggleContact(),
      key: "contact"
    }
  ];

  render() {
    return (
      <React.Fragment>
        {this.footerLinks.map(link => (
          <div className="footerLink" key={link.key} onClick={link.onClick}>
            {link.title}
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default FooterLinks;
