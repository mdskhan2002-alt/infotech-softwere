from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Connect arguments and engine creation (handling PostgreSQL vs SQLite)
db_url = settings.DATABASE_URL

if db_url.startswith("sqlite"):
    engine = create_engine(
        db_url,
        connect_args={"check_same_thread": False}
    )
else:
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20
        )
        # Test connection eagerly so we can fallback if PostgreSQL isn't running
        with engine.connect() as conn:
            pass
    except Exception as e:
        logger.warning(f"Could not connect using primary DATABASE_URL ({e}). Initializing fallback SQLite engine (infotech.db).")
        engine = create_engine("sqlite:///./infotech.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency that yields a database session and closes it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
