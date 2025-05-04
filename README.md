# BuyBusy - Your Shopping Companion

BuyBusy is a modern e-commerce web application built with React. It provides users with a seamless shopping experience, including features like product browsing, cart management, and user authentication.

---

## Features

- **User Authentication**: Sign up, log in, and log out functionality using Firebase Authentication.
- **Product Browsing**: View a wide range of products with categories and search functionality.
- **Cart Management**: Add, update, and remove items from the cart.
- **Order Management**: View order details and track purchases.
- **Responsive Design**: Fully responsive UI for desktop, tablet, and mobile devices.
- **Firebase Integration**: Real-time database and authentication powered by Firebase.

---

## Tech Stack

- **Frontend**: React, CSS Modules
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Firebase Hosting (or any other hosting platform)
- **State Management**: React Context API with `useReducer`

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/buybusy.git
   cd buybusy

 2. Install dependencies:
   npm install

 3. Create a .env file in the root directory and add your Firebase configuration:
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

4. Start the development server:
npm start

http://localhost:3000