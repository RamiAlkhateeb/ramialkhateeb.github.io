# Kotobiyat (كتيبات) 📚

A blazing-fast, static storefront dedicated to selling high-quality, practical digital booklets (كتيبات) and guides for Arabic-speaking software developers. 

## 🚀 Live Website
- **Storefront:** [Insert your new link here]
- **Tech Stack:** Pure HTML, CSS, Vanilla JavaScript (Jamstack)

## 💡 About The Project
Kotobiyat transitioned from a personal portfolio into a dedicated e-commerce platform. It is designed to be lightweight, instantaneous, and completely serverless. 

Instead of relying on heavy CMS frameworks or databases, it uses a highly optimized Jamstack architecture:
- **E-commerce & Checkout:** Handled securely via embedded [Payhip](https://payhip.com/) buttons.
- **Content Management (Posts):** Fetched dynamically on the client-side from a published Google Sheet (CSV), allowing for instant content updates without rebuilding the site.
- **PDF Previews:** In-browser PDF previews natively integrated to improve mobile conversion rates.
- **Hosting:** Deployed via GitHub Actions to GitHub Pages.

## 🏗️ Architecture & Features
- **Zero Build Step:** No Webpack, Node.js, or compilation required. Just pure web standards.
- **RTL First:** Custom UI/UX perfectly tailored for Arabic reading (Right-to-Left).
- **Graceful Degradation:** If the CSV fetch for articles fails, the site gracefully falls back to a hardcoded static post without breaking the UI.
- **Event Tracking:** Custom lightweight Google Analytics (GA4) integration for tracking PDF previews, guide clicks, and purchases.

## 📝 License
All digital guides and content belong to Rami Alkhateeb. The source code structure is proprietary for this storefront.