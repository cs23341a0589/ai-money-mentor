def calculate_score(data):
    print("Received:", data)

    income = float(data.get("income", 0))
    savings = float(data.get("savings", 0))

    if income <= 0:
        raise ValueError("Income must be greater than 0")

    score = 50

    if savings >= income * 6:
        score += 30
    elif savings >= income * 3:
        score += 15

    status = "Excellent" if score > 80 else "Good" if score > 60 else "Needs Improvement"

    return {
        "score": score,
        "status": status,
        "message": f"Your financial health score is {score}/100"
    }