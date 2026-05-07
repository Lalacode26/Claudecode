import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { idea, tone } = await request.json()
    if (!idea) return NextResponse.json({ error: 'idea required' }, { status: 400 })

    const toneDesc: Record<string, string> = {
      friendly: 'thân thiện, gần gũi như người bạn đồng hành',
      professional: 'chuyên nghiệp, đáng tin cậy, thể hiện chuyên môn',
      inspiring: 'truyền cảm hứng, đầy năng lượng, khích lệ hành động',
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `Bạn là content writer chuyên viết caption Facebook cho fanpage trung tâm dạy lập trình tại Việt Nam.

Viết caption Facebook cho bài đăng về: "${idea}"
Tone: ${toneDesc[tone] ?? toneDesc.friendly}

Yêu cầu:
- Hook mạnh ở câu đầu tiên (gây tò mò hoặc đặt câu hỏi)
- Nội dung có giá trị thực tế (dùng emoji và xuống dòng cho dễ đọc)
- CTA rõ ràng ở cuối (bình luận, tag bạn bè, hoặc nhắn tin)
- Độ dài: 150-250 từ

Sau caption, thêm chính xác dòng "---HASHTAGS---" rồi liệt kê 8-10 hashtags.

Chỉ trả về caption và hashtags, không có text giải thích thêm.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const parts = text.split('---HASHTAGS---')
    const caption = parts[0].trim()
    const hashtags = parts[1]?.trim() ?? ''

    return NextResponse.json({ caption, hashtags })
  } catch (error) {
    console.error('AI caption error:', error)
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 })
  }
}
