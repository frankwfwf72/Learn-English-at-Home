import { NextRequest, NextResponse } from 'next/server';
import { ASRClient, LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';
import { S3Storage } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;
    const targetWord = formData.get('targetWord') as string;

    if (!audio || !targetWord) {
      return NextResponse.json(
        { error: 'Audio file and target word are required' },
        { status: 400 }
      );
    }

    // Step 1: Upload audio to object storage
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: '',
      secretKey: '',
      bucketName: process.env.COZE_BUCKET_NAME,
      region: 'cn-beijing',
    });

    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const audioKey = await storage.uploadFile({
      fileContent: audioBuffer,
      fileName: `pronunciation/${Date.now()}_${audio.name}`,
      contentType: audio.type || 'audio/webm',
    });

    // Generate signed URL for ASR
    const audioUrl = await storage.generatePresignedUrl({
      key: audioKey,
      expireTime: 3600, // 1 hour
    });

    // Step 2: Use ASR to recognize the speech
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
    const config = new Config();
    const asrClient = new ASRClient(config);

    const asrResult = await asrClient.recognize({
      uid: 'student-' + Date.now(),
      url: audioUrl,
    });

    const recognizedText = asrResult.text.toLowerCase().trim();
    const targetWordLower = targetWord.toLowerCase();

    // Step 3: Use LLM to evaluate pronunciation and provide feedback
    const llmClient = new LLMClient(config);

    const prompt = `You are an expert English pronunciation teacher for children. 
Please evaluate the student's pronunciation.

Target word: "${targetWord}"
Student's pronunciation (as recognized): "${asrResult.text}"

Provide your evaluation in the following JSON format:
{
  "isCorrect": boolean (whether the pronunciation is correct),
  "score": number (0-100 score based on pronunciation accuracy),
  "feedback": string (give encouraging feedback and specific tips in simple, friendly language suitable for children in Chinese),
  "recognizedText": "${asrResult.text}"
}

Evaluation criteria:
- Give a score of 90-100 if the pronunciation is very accurate
- Give a score of 70-89 if the pronunciation is acceptable with minor issues
- Give a score of 50-69 if the pronunciation has noticeable errors
- Give a score of 0-49 if the pronunciation is completely wrong

For feedback:
- Be encouraging and supportive
- Provide specific, actionable tips
- Use simple language that children can understand
- Write in Chinese
- Focus on the most important improvements needed

Please respond with ONLY the JSON, no additional text.`;

    const llmResponse = await llmClient.invoke(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3 }
    );

    // Parse LLM response
    let evaluation;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = llmResponse.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback evaluation if JSON parsing fails
        const isCorrect = recognizedText === targetWordLower ||
                         recognizedText.includes(targetWordLower);
        evaluation = {
          isCorrect,
          score: isCorrect ? 95 : 60,
          feedback: isCorrect 
            ? '太棒了！你的发音很准确！继续保持！' 
            : '再试一次！注意仔细听标准发音的语调和发音。',
          recognizedText: asrResult.text
        };
      }
    } catch (error) {
      // Fallback evaluation if parsing fails
      const isCorrect = recognizedText === targetWordLower ||
                       recognizedText.includes(targetWordLower);
      evaluation = {
        isCorrect,
        score: isCorrect ? 95 : 60,
        feedback: isCorrect 
          ? '太棒了！你的发音很准确！继续保持！' 
          : '再试一次！注意仔细听标准发音的语调和发音。',
        recognizedText: asrResult.text
      };
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Pronunciation evaluation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to evaluate pronunciation',
        isCorrect: false,
        score: 0,
        feedback: '评估过程中出现错误，请重试。',
        recognizedText: ''
      },
      { status: 500 }
    );
  }
}
