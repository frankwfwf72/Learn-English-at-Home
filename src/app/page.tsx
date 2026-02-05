'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, CheckCircle2, XCircle, RefreshCw, Loader2 } from 'lucide-react';

interface Word {
  id: string;
  english: string;
  chinese: string;
  emoji: string;
}

const words: Word[] = [
  { id: '1', english: 'sheep', chinese: '绵羊', emoji: '🐑' },
  { id: '2', english: 'pig', chinese: '猪', emoji: '🐷' },
  { id: '3', english: 'horse', chinese: '马', emoji: '🐴' },
  { id: '4', english: 'cow', chinese: '奶牛', emoji: '🐄' },
  { id: '5', english: 'rabbit', chinese: '兔子', emoji: '🐰' },
];

interface PronunciationResult {
  recognizedText: string;
  isCorrect: boolean;
  feedback: string;
  score?: number;
}

export default function Home() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const playStandardAudio = async (word: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: word }),
      });
      
      if (!response.ok) throw new Error('Failed to generate audio');
      
      const data = await response.json();
      const audio = new Audio(data.audioUri);
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        await analyzePronunciation(audioFile);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setPronunciationResult(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('无法访问麦克风，请确保已授权');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  const analyzePronunciation = async (audioFile: File) => {
    if (!selectedWord) return;

    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('targetWord', selectedWord.english);

    try {
      const response = await fetch('/api/evaluate-pronunciation', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze pronunciation');

      const result = await response.json();
      setPronunciationResult(result);
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      alert('发音分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playRecordedAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 70) return '良好';
    if (score >= 60) return '及格';
    return '需要改进';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2">
            🎤 儿童英语发音练习
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            选择一个单词，听发音，然后跟读练习！
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              单词列表
            </h2>
            {words.map((word) => (
              <Card
                key={word.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedWord?.id === word.id
                    ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'hover:scale-105'
                }`}
                onClick={() => {
                  setSelectedWord(word);
                  setPronunciationResult(null);
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{word.emoji}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                          {word.english}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {word.chinese}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        playStandardAudio(word.english);
                      }}
                    >
                      <Volume2 className="h-6 w-6" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              发音练习
            </h2>

            {!selectedWord ? (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    请从左侧选择一个单词开始练习
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="text-center">
                    <span className="text-8xl">{selectedWord.emoji}</span>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-white mt-4">
                      {selectedWord.english}
                    </h3>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">
                      {selectedWord.chinese}
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={() => playStandardAudio(selectedWord.english)}
                      className="flex-1 max-w-xs"
                      variant="outline"
                    >
                      <Volume2 className="mr-2 h-5 w-5" />
                      听标准发音
                    </Button>
                  </div>

                  <div className="border-t pt-6 space-y-4">
                    <p className="text-center text-gray-600 dark:text-gray-300">
                      点击下方按钮开始录音
                    </p>

                    <div className="flex gap-3 justify-center">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          disabled={isAnalyzing}
                          className="flex-1 max-w-xs"
                          size="lg"
                        >
                          <Mic className="mr-2 h-5 w-5" />
                          开始录音
                        </Button>
                      ) : (
                        <Button
                          onClick={stopRecording}
                          className="flex-1 max-w-xs"
                          size="lg"
                          variant="destructive"
                        >
                          <XCircle className="mr-2 h-5 w-5" />
                          停止录音
                        </Button>
                      )}
                    </div>

                    {isRecording && (
                      <div className="flex items-center justify-center gap-2 text-red-500">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="font-medium">正在录音...</span>
                      </div>
                    )}

                    {isAnalyzing && (
                      <div className="flex items-center justify-center gap-2 text-blue-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="font-medium">正在分析发音...</span>
                      </div>
                    )}
                  </div>

                  {pronunciationResult && (
                    <div className="border-t pt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-2">
                        {pronunciationResult.isCorrect ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                        <span className="font-bold text-lg">
                          {pronunciationResult.isCorrect ? '发音正确！' : '发音需要改进'}
                        </span>
                      </div>

                      {pronunciationResult.score !== undefined && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-300">发音得分</span>
                            <span className={`text-3xl font-bold ${getScoreColor(pronunciationResult.score)}`}>
                              {pronunciationResult.score}
                            </span>
                          </div>
                          <Badge
                            variant={pronunciationResult.score >= 90 ? 'default' : 'secondary'}
                          >
                            {getScoreText(pronunciationResult.score)}
                          </Badge>
                        </div>
                      )}

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          识别到的发音：
                        </p>
                        <p className="text-lg font-bold text-gray-800 dark:text-white">
                          {pronunciationResult.recognizedText}
                        </p>
                      </div>

                      {pronunciationResult.feedback && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            💡 发音建议：
                          </p>
                          <p className="text-gray-800 dark:text-white">
                            {pronunciationResult.feedback}
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          setPronunciationResult(null);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        再次练习
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
