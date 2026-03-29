🚀 Overview

AI Money Mentor is a smart financial assistant web application that helps users manage their money effectively. It allows users to track expenses, set financial goals, analyze spending patterns, and receive intelligent financial advice using AI.

🎯 Features
💰 Expense Tracking
📈 Income vs Expense Charts
🎯 Goal Planning
🧠 Financial Health Score
🤖 AI-based Financial Suggestions
🔐 User Authentication
🏗️ System Architecture

The application follows a modern architecture:

Frontend built using React and TypeScript
Backend handled by Supabase (Database + Auth + APIs)
AI integration using OpenAI GPT API
🔄 Workflow
User enters financial data or asks a question
Data is sent to the backend (Supabase)
Data is stored in the database
Request is processed and sent to AI (GPT API)
AI generates financial advice
Response is displayed to the user

💻 Technologies Used
🌐 Frontend:
React
TypeScript
Tailwind CSS
Vite
⚙️ Backend:
Supabase (Backend-as-a-Service)
🗄️ Database:
PostgreSQL (via Supabase)
🤖 AI:
OpenAI GPT API


⚙️ Setup Instructions

Install dependencies:
npm install
Run the project:
npm run dev

Add your .env file:
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
OPENAI_API_KEY=your_key

🙌 Conclusion

AI Money Mentor makes financial planning simple, affordable, and accessible for everyone. It helps users build better financial habits and make smarter decisions.
