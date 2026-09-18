import logging
from fastapi import APIRouter, Request, Response, Depends, Query, status, HTTPException
from sqlalchemy.orm import Session
import httpx

from app.core.config import settings
from app.db.database import get_db
from app.db.models import Lead, WhatsAppLog
from app.ai_services.chatbot import chatbot_service

router = APIRouter()
logger = logging.getLogger(__name__)


@router.get("/whatsapp")
async def verify_whatsapp_webhook(
    mode: str = Query(None, alias="hub.mode"),
    token: str = Query(None, alias="hub.verify_token"),
    challenge: str = Query(None, alias="hub.challenge")
):
    """
    WhatsApp Cloud API Webhook Verification Endpoint.
    Meta servers send a GET request to verify the webhook endpoint.
    """
    if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
        logger.info("WhatsApp webhook verified successfully.")
        return Response(content=challenge, media_type="text/plain", status_code=200)
    
    logger.warning("WhatsApp webhook verification token mismatch.")
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification token mismatch")


@router.post("/whatsapp")
async def handle_whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """
    WhatsApp Cloud API Inbound Message Handler.
    Receives incoming WhatsApp messages, triggers AI chatbot logic,
    creates Lead entry, logs message, and sends back reply.
    """
    try:
        payload = await request.json()
    except Exception as e:
        logger.error(f"Error parsing WhatsApp webhook payload: {e}")
        return {"status": "error", "message": "Invalid JSON"}

    # Process standard Meta WhatsApp Cloud payload
    try:
        entries = payload.get("entry", [])
        for entry in entries:
            changes = entry.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                messages = value.get("messages", [])
                contacts = value.get("contacts", [])

                for msg in messages:
                    sender_number = msg.get("from")
                    sender_name = contacts[0].get("profile", {}).get("name", "WhatsApp Lead") if contacts else "WhatsApp Lead"
                    msg_type = msg.get("type")
                    text_body = ""

                    if msg_type == "text":
                        text_body = msg.get("text", {}).get("body", "")

                    if text_body:
                        # 1. Generate AI Response
                        ai_result = chatbot_service.generate_response(text_body)
                        ai_reply = ai_result["response"]

                        # 2. Log message in database
                        log_entry = WhatsAppLog(
                            from_number=sender_number,
                            message_body=text_body,
                            response_sent=ai_reply,
                            status="RESPONDED"
                        )
                        db.add(log_entry)

                        # 3. Create or update Lead in Database
                        service_name = ai_result.get("service_identified", "AI & Software Development")
                        lead_tier = ai_result.get("lead_tier", "HOT")
                        score = ai_result.get("qualification_score", 80)
                        language = ai_result.get("language", "English")
                        handoff = (ai_result.get("action_suggested") == "contact_founder")

                        existing_lead = db.query(Lead).filter(Lead.phone == sender_number).first()
                        if not existing_lead:
                            new_lead = Lead(
                                name=sender_name,
                                email=f"{sender_number}@whatsapp.lead",
                                phone=sender_number,
                                company="WhatsApp Business Lead",
                                service_interest=service_name,
                                message=text_body,
                                source="WHATSAPP",
                                status="NEW",
                                lead_tier=lead_tier,
                                qualification_score=score,
                                handoff_requested=handoff,
                                preferred_channel="WHATSAPP",
                                language=language
                            )
                            db.add(new_lead)
                        else:
                            existing_lead.message = f"{existing_lead.message}\n[WhatsApp]: {text_body}"
                            existing_lead.lead_tier = lead_tier
                            existing_lead.qualification_score = max(existing_lead.qualification_score or 0, score)
                            if handoff:
                                existing_lead.handoff_requested = True
                        
                        db.commit()

                        # 4. Optional: Send WhatsApp reply via Cloud API if token configured
                        if settings.WHATSAPP_API_TOKEN and settings.WHATSAPP_PHONE_NUMBER_ID:
                            await send_whatsapp_message(sender_number, ai_reply)

        return {"status": "success", "detail": "Processed successfully"}

    except Exception as e:
        logger.error(f"Error handling WhatsApp message: {e}")
        return {"status": "error", "message": str(e)}


async def send_whatsapp_message(to_number: str, message_text: str):
    """Dispatches outgoing message via Meta WhatsApp Cloud API."""
    url = f"https://graph.facebook.com/v19.0/{settings.WHATSAPP_PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {settings.WHATSAPP_API_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": to_number,
        "type": "text",
        "text": {"body": message_text}
    }
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, headers=headers, json=payload, timeout=10.0)
            logger.info(f"WhatsApp message dispatched to {to_number}, status: {res.status_code}")
    except Exception as err:
        logger.error(f"Failed to dispatch WhatsApp message: {err}")
