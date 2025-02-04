# BarterClub - A Barter Community Platform

BarterClub is a platform built for entrepreneurs, professionals, and business owners to exchange goods and services. The application utilizes modern technologies to offer high performance, security, and scalability. With features like **server-side rendering (SSR)**, **Clerk** authentication, **Razorpay** integration, and **Cloudflare Workers**, BarterClub is built for a seamless, real-time barter exchange experience.

## Features

- **Server-Side Rendering (SSR)** for fast page loads and better SEO.
- **User Authentication** powered by **Clerk**.
- **Escrow Transactions** with **Razorpay** integration for secure payments.
- **Admin Dashboard** for managing user profiles, transactions, and community activities.
- **Real-time Notifications and Webhooks** to keep users updated.
- **Cloudflare Workers** for fast, serverless execution and improved scalability.
- **Cloudflare R2** for secure file storage and media management.
- **Performance Monitoring and Testing** using **Grafana** and **K6**.

## Technologies Used

- **Next.js** (with SSR): For fast, SEO-friendly pages and improved user experience.
- **TypeScript**: For type safety and better development practices.
- **Clerk**: For secure user authentication and session management.
- **Redis**: Caching layer for fast data access.
- **Razorpay**: For handling payments and escrow transactions.
- **Cloudflare Workers**: For scalable, serverless compute.
- **Cloudflare R2**: For media storage and file management.
- **Grafana**: For monitoring the application's performance.
- **K6**: For load and stress testing.
- **GitHub Actions**: For continuous integration and deployment (CI/CD).

## Getting Started

### Prerequisites

To run this project locally, you'll need:

- **Node.js** (v16 or higher) installed: [Download Node.js](https://nodejs.org/)
- **Git**: For cloning the repository.
- **Redis**: For caching (optional if you're using a cloud Redis service).
- **Clerk Account**: For user authentication.
- **Razorpay Account**: For payment gateway integration.
- **Cloudflare Account**: For deploying Cloudflare Workers and managing R2.

### How to Clone the Project

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/barterclub.git
    cd barterclub
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables in a `.env.local` file:

    ```bash
    NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET=<your-cloudflare-r2-bucket-name>
    CLERK_API_KEY=<your-clerk-api-key>
    RAZORPAY_API_KEY=<your-razorpay-api-key>
    REDIS_URL=<your-redis-url>
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

The project is deployed using **Cloudflare Workers** and **Razorpay** for payment processing. To deploy the project:

1. Set up **Cloudflare Workers** with the **Cloudflare Workers CLI**.

2. Deploy the project to Cloudflare Workers:

    ```bash
    wrangler publish
    ```

3. Set up **Cloudflare R2** for media storage, ensuring your environment variables are set up properly.

4. For Razorpay integration, ensure your payment routes are configured to handle escrow transactions and callbacks from Razorpay webhooks.

## Testing

### Performance Testing with K6

To perform load testing on the application using K6:

1. Install K6:

    ```bash
    brew install k6
    ```

2. Run K6 test:

    ```bash
    k6 run test-script.js
    ```

### Monitoring with Grafana

Set up Grafana to monitor the application’s performance. You can integrate Grafana with **CloudWatch** or use custom metrics that you send to Grafana.

## CI/CD with GitHub Actions

This project is integrated with **GitHub Actions** for continuous deployment. Each push to the main branch triggers the deployment process:

- **Build and test the application**.
- **Deploy** to Cloudflare Workers.

### GitHub Actions Workflow Example

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Deploy to Cloudflare Workers
        run: wrangler publish
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLERK_API_KEY: ${{ secrets.CLERK_API_KEY }}
          RAZORPAY_API_KEY: ${{ secrets.RAZORPAY_API_KEY }}
