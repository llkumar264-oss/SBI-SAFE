from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sbisafe.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── Models ────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    risk_score = Column(Float, default=0.0)


class ScannedLink(Base):
    __tablename__ = "scanned_links"
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(2048), nullable=False)
    classification = Column(String(20), nullable=False)   # safe / suspicious / phishing
    risk_score = Column(Float, default=0.0)
    features = Column(Text, nullable=True)                # JSON string
    scanned_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, nullable=True)


class FraudReport(Base):
    __tablename__ = "fraud_reports"
    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String(30), nullable=False)       # sms / link / app / call
    content = Column(Text, nullable=False)
    location = Column(String(200), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    severity = Column(String(10), default="medium")        # low / medium / high
    verified = Column(Boolean, default=False)
    reported_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, nullable=True)
    upvotes = Column(Integer, default=0)


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    alert_type = Column(String(30), nullable=False)
    severity = Column(String(10), default="medium")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, nullable=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
