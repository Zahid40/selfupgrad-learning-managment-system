// _SOCIAL_.ts

class Social {
  // Base Info
  email = ["zahiddevz@gmail.com"];
  phone = ["+91 9625162488"];
  address = ["Delhi , India"];

  // Social Usernames
  whatsappNumber = this.phone[0];
  instagramUsername = "zahidxdev";
  githubUsername = "Zahid40";
  facebookUsername = "Zahid-Ansari";
  linkedinUsername = "zahidxdev";
  twitterUsername = "zahidxdev";
  dribbbleUsername = "zahidxdev";
  figmaUsername = "@zahidxdev";
  behanceUsername = "zahidxdev";
  buyMeACoffeeUsername = "zahidxdev";

  // Computed Links (getters)
  get whatsapp() {
    return `https://wa.me/${this.whatsappNumber}`;
  }

  get instagram() {
    return `https://www.instagram.com/${this.instagramUsername}`;
  }

  get github() {
    return `https://github.com/${this.githubUsername}`;
  }

  get facebook() {
    return `https://www.facebook.com/profile.php?id=100027719821310`; // You already have full link
  }

  get linkedin() {
    return `https://www.linkedin.com/in/${this.linkedinUsername}`;
  }

  get twitter() {
    return `https://x.com/${this.twitterUsername}`;
  }

  get dribbble() {
    return `https://dribbble.com/${this.dribbbleUsername}`;
  }

  get figma() {
    return `https://www.figma.com/${this.figmaUsername}`;
  }

  get behance() {
    return `https://www.behance.net/${this.behanceUsername}`;
  }

  get buyMeACoffee() {
    return `https://buymeacoffee.com/${this.buyMeACoffeeUsername}`;
  }
}

export const SOCIAL = new Social();
