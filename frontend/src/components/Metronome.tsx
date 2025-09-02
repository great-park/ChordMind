'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { GRADIENTS, COLORS, CARD_STYLES, BUTTON_STYLES } from '../constants/styles';

interface MetronomeProps {
  onBeat?: (beat: number) => void;
  onStart?: () => void;
  onStop?: () => void;
}

const Metronome: React.FC<MetronomeProps> = ({
  onBeat,
  onStart,
  onStop
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState('4/4');
  const [currentBeat, setCurrentBeat] = useState(1);
  const [volume, setVolume] = useState(0.7);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // AudioContext 초기화
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context;
        
        const gainNode = context.createGain();
        gainNode.connect(context.destination);
        gainNode.gain.value = volume;
        gainNodeRef.current = gainNode;
      } catch (error) {
        console.error('AudioContext 초기화 실패:', error);
      }
    };

    initAudioContext();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 볼륨 변경 시 gainNode 업데이트
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // 메트로놈 재생/정지
  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm; // BPM을 밀리초로 변환
      
      intervalRef.current = setInterval(() => {
        playClick();
        setCurrentBeat(prev => {
          const beatsPerMeasure = parseInt(timeSignature.split('/')[0]);
          const nextBeat = prev >= beatsPerMeasure ? 1 : prev + 1;
          onBeat?.(nextBeat);
          return nextBeat;
        });
      }, interval);

      onStart?.();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentBeat(1);
      onStop?.();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, timeSignature, onBeat, onStart, onStop]);

  const playClick = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(gainNodeRef.current);

      // 첫 번째 박자는 높은 음, 나머지는 낮은 음
      const isFirstBeat = currentBeat === 1;
      oscillator.frequency.setValueAtTime(
        isFirstBeat ? 1000 : 800, 
        audioContextRef.current.currentTime
      );
      oscillator.type = 'sine';

      // 짧은 클릭 사운드
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.error('클릭 사운드 재생 실패:', error);
    }
  };

  const toggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  const adjustBpm = (change: number) => {
    setBpm(prev => Math.max(40, Math.min(200, prev + change)));
  };

  const timeSignatures = ['4/4', '3/4', '2/4', '6/8', '12/8'];

  return (
    <Card style={{
      ...CARD_STYLES.large,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none'
    }}>
      <Card.Header className="border-0 bg-transparent p-4">
        <div className="text-center">
          <h4 className="mb-2">🎵 메트로놈</h4>
          <p className="mb-0" style={{ opacity: 0.9 }}>
            정확한 박자로 연습하세요
          </p>
        </div>
      </Card.Header>
      
      <Card.Body className="p-4">
        {/* BPM 표시 및 조절 */}
        <div className="text-center mb-4">
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}>
            {bpm}
          </div>
          <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>BPM</div>
          
          <div className="mt-3">
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => adjustBpm(-10)}
              style={{ marginRight: '0.5rem' }}
            >
              -10
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => adjustBpm(-1)}
              style={{ marginRight: '0.5rem' }}
            >
              -1
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => adjustBpm(1)}
              style={{ marginRight: '0.5rem' }}
            >
              +1
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => adjustBpm(10)}
            >
              +10
            </Button>
          </div>
        </div>

        {/* 박자 표시 */}
        <div className="text-center mb-4">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {timeSignature}
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>박자</div>
          
          <div className="mt-3">
            {timeSignatures.map(signature => (
              <Button
                key={signature}
                variant={timeSignature === signature ? 'light' : 'outline-light'}
                size="sm"
                onClick={() => setTimeSignature(signature)}
                style={{ margin: '0 0.25rem' }}
              >
                {signature}
              </Button>
            ))}
          </div>
        </div>

        {/* 현재 박자 표시 */}
        <div className="text-center mb-4">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {Array.from({ length: parseInt(timeSignature.split('/')[0]) }, (_, i) => (
              <div
                key={i}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: i + 1 === currentBeat 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: i + 1 === currentBeat ? '#667eea' : 'white',
                  transition: 'all 0.2s ease'
                }}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 볼륨 조절 */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ fontSize: '0.9rem' }}>볼륨</span>
            <span style={{ fontSize: '0.9rem' }}>{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: 'rgba(255, 255, 255, 0.3)',
              outline: 'none',
              appearance: 'none'
            }}
          />
        </div>

        {/* 재생/정지 버튼 */}
        <div className="text-center">
          <Button
            onClick={toggleMetronome}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: 'none',
              fontSize: '2rem',
              background: isPlaying 
                ? 'rgba(220, 53, 69, 0.9)' 
                : 'rgba(40, 167, 69, 0.9)',
              color: 'white',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </Button>
        </div>

        {/* 상태 표시 */}
        <div className="text-center mt-3">
          <div style={{
            fontSize: '0.9rem',
            opacity: 0.8
          }}>
            {isPlaying ? '재생 중...' : '정지됨'}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Metronome;
