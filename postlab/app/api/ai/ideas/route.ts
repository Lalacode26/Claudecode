import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  try {
    const { topic, category } = await request.json()
    if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 })

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

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Invalid AI response')

    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('AI ideas error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
