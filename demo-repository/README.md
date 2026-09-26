# Demo Enterprise Microservice

This is an idiomatic Python enterprise microservice used as a reference codebase for CodeMind AI (AI Codebase Assistant).

## Architecture & Layout
- `main.py`: Microservice entrypoint, health checks, and lifecycle routes.
- `auth/security.py`: JWT token signing, PBKDF2 hashing, and token verification.
- `models/user.py`: Domain entity models for accounts, permissions, and roles.
- `services/user_service.py`: User registration, profile updates, and authentication business rules.
- `services/payment_service.py`: Subscription management, invoice processing, and billing audit logs.
- `tests/test_auth.py`: Pytest unit and regression suite.

## Running Tests
```bash
pytest tests/ -v
```
