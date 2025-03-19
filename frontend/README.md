# Installation Guide for Your-Business-Companion

Your-Business-Companion is a powerful AI-driven business assistant built using React and Vite. Follow this guide to install and set up the project.

## Prerequisites
Before installing, ensure you have the following installed on your system:
- **Node.js** (version 16 or later) – [Download here](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **Git** (optional, for cloning the repository) – [Download here](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository
If you haven’t already, clone the repository from GitHub:
```sh
git clone git@github.com:serdesiyont/Your-Business-Companion.git
cd your-business-companion
```

### 2. Install Dependencies
Run the following command to install the required packages:
```sh
npm install
```
Or if using **yarn**:
```sh
yarn install
```

### 3. Start the Development Server
To start the local development server, run:
```sh
npm run dev
```
Or with **yarn**:
```sh
yarn dev
```
This will start the app, and you can access it at **[http://localhost:5173/](http://localhost:5173/)** (default Vite port).

### 4. Build for Production
To create an optimized production build, run:
```sh
npm run build
```
Or with **yarn**:
```sh
yarn build
```
The built files will be available in the `dist` directory.

### 5. Preview the Build (Optional)
To test the production build locally:
```sh
npm run preview
```
Or with **yarn**:
```sh
yarn preview
```
This will start a local server to preview the built project.

## Environment Variables (Optional)
If the project requires environment variables, create a `.env` file in the root directory and add necessary configurations, for example:
```sh
VITE_API_URL=https://your-api-endpoint.com
VITE_OTHER_CONFIG=value
```

## Deployment
To deploy Your-Business-Companion, you can use platforms like:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist` folder or use the CLI
- **GitHub Pages** (with additional configurations)

## Troubleshooting
If you encounter any issues:
- Ensure all dependencies are installed properly
- Delete `node_modules` and `package-lock.json` or `yarn.lock`, then reinstall:
  ```sh
  rm -rf node_modules package-lock.json && npm install
  ```
- Check logs for specific errors using:
  ```sh
  npm run dev -- --debug
  ```
- Ensure the correct Node.js version is installed

For further assistance, refer to the official [Vite documentation](https://vitejs.dev/).

---
Your-Business-Companion is now set up and ready to use! 🚀

