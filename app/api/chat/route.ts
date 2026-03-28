import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, history } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a stylish AI assistant." },
          ...history,
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ text: "Technical error." }, { status: 500 });
  }
}
