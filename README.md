# 🛍️ Shofy - Modern E-Commerce Platform

A full-featured, modern e-commerce application built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Firebase**. Shofy provides a complete shopping experience with advanced product filtering, authentication, cart management, and more.

![Shofy E-Commerce](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-9.0-orange?style=for-the-badge&logo=firebase)

## 🌟 Features

### 🔐 **Authentication System**

- **Email/Password Authentication** with secure bcrypt hashing
- **OAuth Integration** (Google & GitHub)
- **User Registration & Login** with form validation
- **Protected Routes** with middleware
- **User Profile Management**
- **Session Management** with NextAuth.js

### 🛒 **E-Commerce Functionality**

- **Product Catalog** with advanced filtering and sorting
- **Shopping Cart** with Redux state management
- **Wishlist** functionality
- **Product Search** with real-time results
- **Category Browsing** with dynamic product counts
- **Special Offers** page with discount filtering
- **Responsive Product Cards** (Grid & List views)

### 🎨 **Modern UI/UX**

- **Responsive Design** (Mobile-first approach)
- **Professional Animations** with Framer Motion
- **Loading Skeletons** for better UX
- **Toast Notifications** for user feedback
- **Dynamic Navigation** with mobile optimization
- **Professional Color Scheme** with consistent branding

### 📱 **Mobile Experience**

- **Mobile Navigation** with hamburger menu
- **Touch-Friendly** interface
- **Optimized Performance** for mobile devices
- **Progressive Web App** ready

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **pnpm** package manager
- **Firebase Account** (for database and authentication)
- **Google Cloud Console** account (for Google OAuth)
- **GitHub** account (for GitHub OAuth)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/noorjsdivs/shofy-commerce-app.git
   cd shofy-commerce-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Setup](#-environment-setup) below)

4. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth Configuration
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK (for server-side operations)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## 🔑 How to Obtain Environment Credentials

### 🔥 Firebase Setup

1. **Create a Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Enter project name (e.g., "shofy-ecommerce")
   - Enable Google Analytics (optional)

2. **Get Firebase Client Configuration**

   - In Firebase Console, click "Add app" → "Web"
   - Register your app with a nickname
   - Copy the configuration object values:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-api-key", // → NEXT_PUBLIC_FIREBASE_API_KEY
       authDomain: "your-project.firebaseapp.com", // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
       projectId: "your-project-id", // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
       storageBucket: "your-project.appspot.com", // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
       messagingSenderId: "123456789", // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
       appId: "your-app-id", // → NEXT_PUBLIC_FIREBASE_APP_ID
     };
     ```

3. **Set up Firestore Database**

   - Go to "Firestore Database" in Firebase Console
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location

4. **Get Firebase Admin SDK**
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Extract values:
     - `project_id` → `FIREBASE_PROJECT_ID`
     - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the newlines as \n)
     - `client_email` → `FIREBASE_CLIENT_EMAIL`

### 🔐 Google OAuth Setup

1. **Go to Google Cloud Console**

   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**

   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)
   - Copy the Client ID and Client Secret

### 🐙 GitHub OAuth Setup

1. **Go to GitHub Developer Settings**

   - Visit [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"

2. **Configure OAuth App**

   - **Application name**: Shofy E-Commerce
   - **Homepage URL**: `http://localhost:3000` (development)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - Click "Register application"

3. **Get Credentials**
   - Copy the Client ID → `GITHUB_ID`
   - Generate a new client secret → `GITHUB_SECRET`

### 🔒 NextAuth Secret

Generate a secure secret for NextAuth:

```bash
# Using openssl
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the generated string to `NEXTAUTH_SECRET`

### 💳 Stripe Setup (Optional)

1. **Create Stripe Account**

   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Create an account or log in

2. **Get API Keys**
   - Go to "Developers" → "API keys"
   - Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy "Secret key" → `STRIPE_SECRET_KEY`

## 📁 Project Structure

```
shofy-commerce-app/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── signin/        # Sign in page
│   │   │   └── register/      # Registration page
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication API
│   │   ├── cart/              # Shopping cart page
│   │   ├── offers/            # Special offers page
│   │   ├── products/          # Product pages
│   │   └── profile/           # User profile page
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── cart/              # Cart components
│   │   ├── header/            # Header components
│   │   ├── pages/             # Page-specific components
│   │   └── ui/                # UI components
│   ├── lib/                   # Utility libraries
│   │   ├── auth/              # Authentication configuration
│   │   └── firebase/          # Firebase configuration
│   ├── redux/                 # State management
│   ├── constants/             # Application constants
│   └── assets/                # Static assets
├── public/                    # Public assets
├── .env                       # Environment variables
└── package.json               # Dependencies and scripts
```

## 🛠️ Technologies Used

### **Frontend**

- **Next.js 15.4.6** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications

### **Authentication**

- **NextAuth.js** - Authentication framework
- **Firebase Auth** - Authentication provider
- **bcryptjs** - Password hashing

### **Database**

- **Firebase Firestore** - NoSQL document database
- **Firebase Storage** - File storage

### **State Management**

- **Redux Toolkit** - Predictable state container
- **React Redux** - React bindings for Redux

### **Development Tools**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🎯 Key Features Explained

### 🔐 Authentication Flow

1. **Registration**: Users create accounts with email/password or OAuth
2. **Verification**: Email verification (optional)
3. **Login**: Secure login with session management
4. **Protected Routes**: Middleware protects authenticated pages
5. **User Profile**: Complete profile management

### 🛒 Shopping Experience

1. **Product Browsing**: Advanced filtering and sorting
2. **Search**: Real-time product search
3. **Cart Management**: Add/remove items with quantity control
4. **Wishlist**: Save favorite products
5. **Checkout**: Secure payment processing (Stripe integration)

### 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Proper layout for tablets
- **Desktop**: Full-featured desktop experience
- **Cross-Browser**: Compatible with all modern browsers

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Update Environment Variables**
   - Update `NEXTAUTH_URL` to your Vercel domain
   - Update OAuth redirect URIs to match your domain

### Other Deployment Options

- **Netlify**
- **Railway**
- **Digital Ocean**
- **AWS**

## 🔧 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Firebase Team** for the backend services
- **Tailwind CSS** for the utility-first CSS framework
- **DummyJSON** for the product API
- **React Community** for the excellent ecosystem

## 📞 Support

If you have any questions or need help, please:

1. **Check the documentation** above
2. **Open an issue** on GitHub
3. **Join our Discord** (coming soon)
4. **Contact the maintainer**: [noorjsdivs@gmail.com](mailto:noorjsdivs@gmail.com)

## 🎉 Features Roadmap

- [ ] **Email Verification**
- [ ] **Password Reset**
- [ ] **Admin Dashboard**
- [ ] **Order Management**
- [ ] **Inventory Management**
- [ ] **Product Reviews**
- [ ] **Advanced Analytics**
- [ ] **Multi-language Support**
- [ ] **Dark Mode**
- [ ] **PWA Features**

---

**Made with ❤️ by [Noor Mohammad](https://github.com/noorjsdivs)**

**⭐ Star this repository if you find it helpful!**
