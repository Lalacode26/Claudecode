import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { topic, category } = await request.json()
    if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 })

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Bạn là content strategist chuyên nghiệp cho fanpage trung tâm dạy lập trình tại Việt Nam.

Sinh 5 ý tưởng bài đăng Facebook cho fanpage trung tâm lập trình về chủ đề: "${topic}". Loại bài: ${category}.

Trả về JSON với format:
{
  "ideas": [
    { "title": "tiêu đề ngắn gọn, hấp dẫn", "angle": "góc tiếp cận độc đáo, 1 câu" }
  ]
}

Yêu cầu:
- Tiêu đề kích thích tò mò, gây chú ý trên news feed
- Góc tiếp cận cụ thể, thiết thực với học viên lập trình Việt Nam
- Đa dạng format: list, câu hỏi, câu chuyện, so sánh
- Chỉ trả về JSON, không có text thêm`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('AI ideas error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
