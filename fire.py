def calculate_fire(data):
    print("Received:", data)

    income = float(data.get("income", 0))
    expenses = float(data.get("expenses", 0))
    age = int(data.get("age", 0))

    if income <= 0 or expenses < 0 or age <= 0:
        raise ValueError("Invalid input values")

    savings = income - expenses
    sip = savings * 0.6

    years_left = max(0, 45 - age)
    corpus = sip * 12 * years_left * 1.5

    return {
        "monthly_sip": round(sip),
        "retire_age": 45,
        "years_left": years_left,
        "estimated_corpus": round(corpus),
        "message": f"Invest ₹{round(sip)} per month to retire at 45"
    }