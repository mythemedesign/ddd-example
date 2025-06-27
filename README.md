# Domain-Driven Design Example with TypeScript

This project demonstrates the implementation of Domain-Driven Design (DDD) principles using TypeScript, Express.js, MongoDB, and Kafka.

## Project Structure

```
src/
├── domain/                      # Core business logic (DDD)
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   ├── events/
│   └── repository/
├── application/                 # Use cases (Clean Architecture)
│   ├── use-cases/
│   └── dtos/
├── infrastructure/             # Implementations
│   ├── database/
│   ├── messaging/
│   └── config/
├── interfaces/                 # Entry points
│   └── http/
└── shared/                     # Common utilities
    ├── base/
    ├── errors/
    └── utils/
```

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB
- Kafka

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the infrastructure services:
   ```bash
   docker-compose up -d
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev`: Start the development server with hot-reload
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server
- `npm test`: Run tests
- `npm run lint`: Run ESLint

## API Endpoints

### Orders

- `POST /api/orders`: Create a new order
- `GET /api/orders/:orderId`: Get order by ID
- `GET /api/orders/customer/:customerId`: Get orders by customer ID
- `POST /api/orders/:orderId/confirm`: Confirm an order
- `POST /api/orders/:orderId/cancel`: Cancel an order
- `POST /api/orders/:orderId/deliver`: Mark an order as delivered

## Architecture

This project follows Domain-Driven Design principles and Clean Architecture:

1. **Domain Layer**: Contains the core business logic, entities, and business rules
2. **Application Layer**: Orchestrates the flow of data and implements use cases
3. **Infrastructure Layer**: Provides implementations for external services
4. **Interface Layer**: Handles external requests and responses

## Testing

The project includes unit tests and integration tests. Run them using:

```bash
npm test
```

## Docker

The project includes Docker configuration for easy deployment:

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT