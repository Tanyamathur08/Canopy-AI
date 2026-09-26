"""Payment processing service coordinating transaction receipts and user accounts."""
import uuid
from typing import Dict, Any
from app.demo_repo.services.user_service import UserService

class PaymentService:
    def __init__(self, user_service: UserService):
        self.user_service = user_service
        self._transactions: Dict[str, Dict[str, Any]] = {}

    def process_charge(self, user_id: str, amount_cents: int, currency: str = "USD") -> Dict[str, Any]:
        """Charges a registered user account and records transaction ledger."""
        user = self.user_service.get_by_id(user_id)
        if not user:
            raise ValueError(f"User {user_id} not found for charge processing.")
        
        tx_id = f"tx_{uuid.uuid4().hex[:12]}"
        record = {
            "transaction_id": tx_id,
            "user_id": user_id,
            "user_email": user.email,
            "amount_cents": amount_cents,
            "currency": currency,
            "status": "SUCCEEDED"
        }
        self._transactions[tx_id] = record
        return record
