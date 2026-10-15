# Vistar Models

Scale-model consultancy platform for India — connecting architectural studios, developers, engineering firms, and industrial clients with suitable physical scale-model makers.

## Tech Stack
- **Framework**: React Router v7/v8 (SSR & Vite)
- **Styling**: Tailwind CSS & Radix UI
- **Deployment**: Vercel ready (`@vercel/react-router`)

## Running Locally

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Run in development mode on **Port 302**:
   ```bash
   npm run dev:302
   ```
   Open [http://localhost:302](http://localhost:302) in your browser.

3. Build for production:
   ```bash
   npm run build
   ```

## Deploying to Vercel

1. Import this repository in the [Vercel Dashboard](https://vercel.com).
2. Set **Root Directory** to `apps/web`.
3. In **Build and Output Settings**, override the **Install Command**:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Click **Deploy**.
