from typing import Dict, Any, Optional
import logging
from app.core.config import settings
from app.ai_services.chatbot import chatbot_service

logger = logging.getLogger(__name__)


class VoiceAgentService:
    """
    Voice AI Service for handling real-time voice consultations, audio speech processing,
    and automated phone/web voice agents for Infotech Software.
    """
    def __init__(self, agent_name: str = "Aria"):
        self.agent_name = agent_name
        self.system_prompt = (
            f"You are {agent_name}, the professional Voice AI Concierge for Infotech Software. "
            f"Keep your spoken answers concise (under 3 sentences), highly articulated, natural, and welcoming."
        )

    def process_voice_input(self, transcript: str, state: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Takes speech-to-text transcript and generates a spoken-optimized response,
        detecting intent and next-step actions.
        """
        transcript_clean = transcript.strip()
        if not transcript_clean:
            return {
                "reply_text": f"Hello! I am {self.agent_name} from Infotech Software. How can I assist you with your software or AI project today?",
                "intent": "GREETING",
                "suggested_action": "listen"
            }

        # Intent detection
        lower = transcript_clean.lower()
        if any(w in lower for w in ["call back", "schedule", "meet", "appointment", "demo"]):
            intent = "SCHEDULE_CALL"
            suggested_action = "collect_contact_info"
            reply = (
                f"I would be delighted to schedule a consultation with our Founder, Mohammad Shahabuddin. "
                f"Please share your best contact number or email, and our technical team will reach out promptly."
            )
        elif any(w in lower for w in ["cost", "estimate", "pricing", "budget", "quote"]):
            intent = "QUOTE_REQUEST"
            suggested_action = "request_project_brief"
            reply = (
                "Our full-stack web and SaaS projects typically start around thirty-five hundred dollars, "
                "and custom AI systems start at twenty-five hundred dollars. Could you tell me a little about your project goals?"
            )
        elif any(w in lower for w in ["who is", "founder", "owner", "shahabuddin"]):
            intent = "FOUNDER_QUERY"
            suggested_action = "provide_founder_links"
            reply = (
                "Infotech Software is directed by Mohammad Shahabuddin, Lead Software Architect. "
                "You can connect directly with him on LinkedIn or reach out at mdskhan2002@gmail.com."
            )
        else:
            # Leverage AI Chatbot service for general intelligence
            ai_res = chatbot_service.generate_response(transcript_clean)
            reply = ai_res["response"]
            intent = "GENERAL_INQUIRY"
            suggested_action = ai_res.get("action_suggested", "continue_conversation")

        return {
            "reply_text": reply,
            "intent": intent,
            "confidence": 0.98,
            "suggested_action": suggested_action
        }


voice_agent_service = VoiceAgentService()
