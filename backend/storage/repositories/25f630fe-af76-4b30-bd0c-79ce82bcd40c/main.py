"""Main API application entrypoint for the demo codebase."""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from app.demo_repo.services.user_service import UserService
from app.demo_repo.services.payment_service import PaymentService

app = FastAPI(title="Demo Microservice API", version="1.0.0")

user_service = UserService()
payment_service = PaymentService(user_service)

class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    name: str

class ChargeSchema(BaseModel):
    user_id: str
    amount: int

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "demo-backend"}

@app.post("/users/register")
def register_endpoint(payload: UserRegisterSchema):
    try:
        user = user_service.register_user(payload.email, payload.password, payload.name)
        return user.to_dict()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/payments/charge")
def charge_endpoint(payload: ChargeSchema):
    try:
        receipt = payment_service.process_charge(payload.user_id, payload.amount)
        return receipt
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
