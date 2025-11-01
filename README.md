# GoodTOGO - Modern E-commerce Website

A sophisticated, fully-functional e-commerce website built with modern web technologies, featuring smooth animations, responsive design, and complete shopping cart functionality.

## 🚀 Features

### Core Functionality
- **Interactive Shopping Cart** - Add/remove items, quantity management, persistent storage
- **Product Catalog** - Dynamic product display with search and category filtering
- **Checkout System** - Complete order processing with form validation
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Advanced Features
- **Smooth Scrolling** - Locomotive Scroll integration for premium user experience
- **GSAP Animations** - Professional-grade animations and transitions
- **Local Storage** - Cart persistence across browser sessions
- **Quick View Modal** - Product preview without page navigation
- **Real-time Search** - Instant product filtering as you type
- **Category Filtering** - Filter products by care-packs, food, and gifts
- **Custom Cursor** - Interactive cursor effects on hover
- **Loading Animations** - Smooth page load transitions

### UI/UX Excellence
- **Modern Design** - Clean, minimalist interface with custom typography
- **Micro-interactions** - Hover effects, button animations, and feedback
- **Success Messages** - Visual confirmation for user actions
- **Mobile-First** - Responsive design that works on all screen sizes
- **Accessibility** - Semantic HTML and keyboard navigation support

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced styling with Flexbox, Grid, and animations
- **Vanilla JavaScript** - Modern ES6+ features and DOM manipulation
- **GSAP** - Professional animation library
- **Locomotive Scroll** - Smooth scrolling library
- **Remix Icons** - Beautiful icon set

### Architecture
- **Component-based JS** - Modular cart and product catalog classes
- **Local Storage API** - Client-side data persistence
- **CSS Grid & Flexbox** - Modern layout techniques
- **CSS Custom Properties** - Maintainable styling system

## 📁 Project Structure

```
Shopping website/
├── index.html          # Main HTML file
├── style.css           # Main stylesheet
├── script.js           # Core animations and interactions
├── cart.js             # Shopping cart functionality
├── products.js         # Product catalog system
├── Futura-Bold.ttf     # Custom font
├── Gilroy-Medium.ttf   # Custom font
├── video.mp4           # Hero video
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional but recommended)

### Installation

1. **Clone or Download** the project files
2. **Open in Browser** - Simply open `index.html` in your browser
3. **Or Use Local Server** (recommended):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Usage

1. **Browse Products** - Scroll to the products section or click "Shop" in navigation
2. **Search & Filter** - Use the search bar or category buttons to find products
3. **Add to Cart** - Click "Add to Cart" on any product
4. **View Cart** - Click the cart icon in the navigation
5. **Checkout** - Click "Proceed to Checkout" and fill out the form
6. **Complete Order** - Submit the form to simulate order completion

## 🎨 Customization

### Adding New Products
Edit the `products` array in `products.js`:

```javascript
{
    id: 'unique-product-id',
    name: 'Product Name',
    price: 29.99,
    category: 'category-name',
    image: 'image-url',
    description: 'Product description',
    inStock: true
}
```

### Styling
- **Colors**: Modify CSS custom properties in `style.css`
- **Fonts**: Replace font files and update `@font-face` declarations
- **Layout**: Adjust grid and flexbox properties for different layouts

### Animations
- **GSAP Animations**: Modify timing and effects in `script.js`
- **Scroll Triggers**: Adjust scroll-based animations in ScrollTrigger sections

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

Key responsive features:
- Collapsible navigation menu
- Stacked product grid on mobile
- Full-width cart sidebar on mobile
- Touch-friendly buttons and interactions

## 🔧 Browser Support

- **Chrome**: 60+
- **Firefox**: 60+
- **Safari**: 12+
- **Edge**: 79+

## 📈 Performance Features

- **Lazy Loading**: Images load as they enter viewport
- **Optimized Assets**: Compressed images and minified code
- **Efficient Animations**: Hardware-accelerated CSS and GSAP
- **Local Storage**: Reduces server requests for cart data

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source branch (main/master)
4. Access via `https://username.github.io/repository-name`

### Netlify
1. Drag and drop project folder to Netlify
2. Or connect GitHub repository
3. Automatic deployment on code changes

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## 🎯 Future Enhancements

- [ ] User authentication system
- [ ] Backend integration with database
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order tracking system
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Social media integration
- [ ] SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Created with ❤️ by [Your Name]

---

**Note**: This is a demonstration project showcasing modern web development techniques. The checkout process is simulated and no real payments are processed.
