# Donation Transparency Platform Plugins

This repository contains the four core WordPress plugins that power the Donation Transparency platform, a system that connects "givers" (donors) with "receivers" (individuals or businesses seeking funding) through a transparent financial relationship.

## Key Feature: Complete Financial Transparency

What makes this platform unique is that **receivers make their bank transaction history completely visible to donors**, creating unprecedented accountability in how funds are utilized. The platform replaces trust with verification, allowing donors to make more informed decisions about who they support based on demonstrated spending habits.

## Four-Plugin Architecture

The platform follows a feature-based organization with four focused plugins that work together:

```
Base System → Financial Connections → Transactions & Donations → Discovery
```

### 1. Base System Plugin

**Primary Role**: Foundation and user management for the entire platform

**Key Responsibilities**:
- User management for ALL user types (Givers and Receivers)
- User authentication and authorization
- Role and capability management
- Basic profile functionality
- Common utilities and helpers
- Shared UI components
- Database schema foundations
- Hooks/filters system
- Basic dashboard templates

### 2. Financial Connections Plugin

**Primary Role**: External financial service integrations and account management

**Key Responsibilities**:
- Stripe Connect integration
- Plaid Link integration
- Financial account connections
- API communication with financial services
- Secure credential storage
- Webhook handling
- Connection status management
- Initial account setup for Receivers
- Financial account verification

### 3. Transactions & Donations Plugin

**Primary Role**: Transaction management, donation processing, and financial operations

**Key Responsibilities**:
- Transaction display and management
- Transaction categorization and notes
- Transaction "liking" system
- Plaid transaction sync ongoing management
- Donation processing/checkout
- FIFO tracking algorithm
- Payment history and receipts
- Email notifications for FIFO updates
- Donation reporting

### 4. Discovery Plugin

**Primary Role**: Public-facing search and discovery

**Key Responsibilities**:
- Search and browse functionality
- Categories and filtering
- Receiver profiles and public pages
- Featured receivers
- Recommendation engine
- Social sharing
- Community features
- Engagement metrics
- Public transparency displays

## Integration and Data Flow

The plugins are designed with clear integration points and a structured data flow:

1. **Base System** provides the foundation for all other plugins
2. **Financial Connections** handles external integrations and feeds data to the transaction system
3. **Transactions & Donations** processes and displays financial data to users
4. **Discovery** presents public-facing profiles and transparency features

## Documentation

Each plugin contains a `memory-bank` directory with detailed documentation about implementation details, troubleshooting information, and architectural decisions.

## Development and Contribution

This repository follows a monorepo approach, keeping all plugins in a single repository to simplify development workflow and ensure compatibility between the components.

## License

Private - All rights reserved
