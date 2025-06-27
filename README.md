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

This project follows Domain-Driven Design principles and Clean Architecture, organized into distinct layers:

### 1. Domain Layer (src/domain/)
The heart of the application, containing core business logic and rules:
- **Entities**: Core business objects (e.g., Order)
- **Value Objects**: Immutable objects representing descriptive aspects of the domain (e.g., OrderItem)
- **Domain Services**: Complex operations that don't naturally fit in entities
- **Domain Events**: Business events that domain experts care about
- **Repository Interfaces**: Abstract persistence requirements

### 2. Application Layer (src/application/)
Orchestrates the flow of data and use cases:
- **Use Cases**: Application-specific business rules
- **DTOs**: Data Transfer Objects for input/output

### 3. Infrastructure Layer (src/infrastructure/)
Provides technical capabilities and implementations:
- **Database**: Repository implementations (e.g., MongoDB)
- **Messaging**: Event handling (e.g., Kafka)
- **Configuration**: System configuration management

### 4. Interface Layer (src/interfaces/)
Handles external communication:
- **HTTP Controllers**: Request handling
- **Route Definitions**: API endpoint mapping
- **Request/Response**: Data transformation

### 5. Shared Kernel (src/shared/)
Common utilities and base components:
- **Base Entities**: Abstract base classes
- **Error Handling**: Domain-specific errors
- **Utilities**: Shared helper functions

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