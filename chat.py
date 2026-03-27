def ai_chat(data):
    question = data["question"]

    # Simple rule-based AI (no API needed)
    if "invest" in question.lower():
        answer = "Start SIP in mutual funds with long-term goals."
    elif "save tax" in question.lower():
        answer = "Use 80C, ELSS, and NPS for tax saving."
    else:
        answer = "Track expenses and invest regularly."

    return {"response": answer}