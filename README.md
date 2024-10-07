# NeighborTrade
A community-driven platform for home growers to trade their surplus fruits, vegetables, and plants. Built with Next.js, NextAuth, Prisma, and PostgreSQL.

# Produce Exchange Platform

A community-driven platform for individuals who grow edible plants, fruits, and vegetables at home. The platform enables users to connect, trade, and exchange their homegrown produce with others in their local area. Built using modern web technologies, it aims to foster a community of home gardeners who can share their surplus harvests.

## Key Features

- **User Registration & Authentication**: Supports sign-up using email/password and Google OAuth.
- **Role-Based Access**: General users can browse the marketplace, while growers can list and manage their produce.
- **Profile Management**: Users can update their profiles and optionally register as growers.
- **Produce Management**: Growers can create listings, edit, and manage their available produce.
- **Marketplace**: A public page showcasing available produce, allowing users to contact growers and propose trades.
- **Trading System**: Facilitates the exchange of produce between growers, encouraging communication and community-building.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/)
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- **Authentication**: [NextAuth](https://next-auth.js.org/) for email/password and OAuth.
- **Database**: [Prisma](https://www.prisma.io/) as the ORM and [PostgreSQL](https://www.postgresql.org/) for persistent storage.

## Project Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- [PostgreSQL](https://www.postgresql.org/) database instance
- [Git](https://git-scm.com/) for version control

### Getting Started

1. **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/produce-exchange-platform.git
    cd produce-exchange-platform
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**
    - Create a `.env` file in the root directory and add the following:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/produce_exchange_db"
    NEXTAUTH_URL="http://localhost:3000"
    NEXTAUTH_SECRET="your-random-secret-key"
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```

4. **Set Up the Database**
    - Run the Prisma migrations to set up the database schema:
    ```bash
    npx prisma migrate dev --name init
    ```

5. **Run the Development Server**
    ```bash
    npm run dev
    ```
    - The app will be available at `http://localhost:3000`.

## Project Structure

my-produce-app/
|-- src/
|   |-- app/           # Contains page components and route handlers (new App Router in Next.js)
|   |-- components/    # Folder for reusable components
|   |-- styles/        # Contains global CSS (including Tailwind CSS integration)
|-- .eslintrc.json     # ESLint configuration file
|-- next.config.js     # Next.js configuration
|-- postcss.config.js  # PostCSS configuration for Tailwind
|-- tailwind.config.js # Tailwind CSS configuration file
|-- package.json       # Project dependencies
|-- public/            # Public assets
|-- README.md          # Project README



## Future Enhancements

- **Local Area Filtering**: Implement search filters based on location.
- **Push Notifications**: Notify growers about new trade proposals or messages.
- **Payment Integration**: Allow payment for produce (post-MVP).

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Add some feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-name
    ```
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [NextAuth](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)

