'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GRADIENTS, COLORS, CARD_STYLES } from '../constants/styles';

interface PianoKey {
  note: string;
  isBlack: boolean;
  frequency: number;
  isPressed: boolean;
}

interface VirtualPianoProps {
  onNotePlay?: (note: string, frequency: number) => void;
  onNoteStop?: (note: string) => void;
  showNoteNames?: boolean;
  octave?: number;
}

const VirtualPiano: React.FC<VirtualPianoProps> = ({
  onNotePlay,
  onNoteStop,
  showNoteNames = true,
  octave = 4
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const oscillators = useRef<Map<string, OscillatorNode>>(new Map());

  // 피아노 키 정의 (C4부터 B4까지)
  const pianoKeys: PianoKey[] = [
    { note: 'C', isBlack: false, frequency: 261.63, isPressed: false },
    { note: 'C#', isBlack: true, frequency: 277.18, isPressed: false },
    { note: 'D', isBlack: false, frequency: 293.66, isPressed: false },
    { note: 'D#', isBlack: true, frequency: 311.13, isPressed: false },
    { note: 'E', isBlack: false, frequency: 329.63, isPressed: false },
    { note: 'F', isBlack: false, frequency: 349.23, isPressed: false },
    { note: 'F#', isBlack: true, frequency: 369.99, isPressed: false },
    { note: 'G', isBlack: false, frequency: 392.00, isPressed: false },
    { note: 'G#', isBlack: true, frequency: 415.30, isPressed: false },
    { note: 'A', isBlack: false, frequency: 440.00, isPressed: false },
    { note: 'A#', isBlack: true, frequency: 466.16, isPressed: false },
    { note: 'B', isBlack: false, frequency: 493.88, isPressed: false },
  ];

  // AudioContext 초기화
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      } catch (error) {
        console.error('AudioContext 초기화 실패:', error);
      }
    };

    initAudioContext();

    return () => {
      // 컴포넌트 언마운트 시 모든 오실레이터 정리
      oscillators.current.forEach(oscillator => {
        try {
          oscillator.stop();
        } catch (error) {
          // 이미 정지된 오실레이터는 무시
        }
      });
      oscillators.current.clear();
    };
  }, []);

  // 키보드 이벤트 리스너
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: { [key: string]: string } = {
        'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
        'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
        'u': 'A#', 'j': 'B'
      };

      const note = keyMap[event.key.toLowerCase()];
      if (note && !pressedKeys.has(note)) {
        playNote(note);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyMap: { [key: string]: string } = {
        'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E',
        'f': 'F', 't': 'F#', 'g': 'G', 'y': 'G#', 'h': 'A',
        'u': 'A#', 'j': 'B'
      };

      const note = keyMap[event.key.toLowerCase()];
      if (note) {
        stopNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [pressedKeys]);

  const playNote = (note: string) => {
    if (!audioContext) return;

    const key = pianoKeys.find(k => k.note === note);
    if (!key || pressedKeys.has(note)) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(key.frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      // 부드러운 페이드 인
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);

      oscillator.start();

      oscillators.current.set(note, oscillator);
      setPressedKeys(prev => new Set(prev).add(note));

      onNotePlay?.(note, key.frequency);
    } catch (error) {
      console.error('음표 재생 실패:', error);
    }
  };

  const stopNote = (note: string) => {
    const oscillator = oscillators.current.get(note);
    if (oscillator) {
      try {
        oscillator.stop();
        oscillators.current.delete(note);
      } catch (error) {
        // 이미 정지된 오실레이터는 무시
      }
    }

    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });

    onNoteStop?.(note);
  };

  const handleMouseDown = (note: string) => {
    playNote(note);
  };

  const handleMouseUp = (note: string) => {
    stopNote(note);
  };

  const handleMouseLeave = (note: string) => {
    stopNote(note);
  };

  return (
    <div style={{
      ...CARD_STYLES.large,
      padding: '2rem',
      margin: '1rem 0'
    }}>
      <div className="text-center mb-4">
        <h4 style={{ color: COLORS.text.primary }}>🎹 가상 피아노</h4>
        <p style={{ color: COLORS.text.secondary }}>
          마우스로 클릭하거나 키보드로 연주하세요
        </p>
        {showNoteNames && (
          <div className="mb-3">
            <small style={{ color: COLORS.text.tertiary }}>
              키보드: A S D F G H J (흰건반), W E T Y U (검은건반)
            </small>
          </div>
        )}
      </div>

      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
      }}>
        {/* 흰 건반들 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2px',
          marginBottom: '1rem'
        }}>
          {pianoKeys.filter(key => !key.isBlack).map((key) => (
            <div
              key={key.note}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseLeave={() => handleMouseLeave(key.note)}
              style={{
                width: '60px',
                height: '200px',
                background: pressedKeys.has(key.note) 
                  ? 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                borderRadius: '0 0 8px 8px',
                border: '2px solid #cbd5e0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '1rem',
                transition: 'all 0.1s ease',
                transform: pressedKeys.has(key.note) ? 'scale(0.98)' : 'scale(1)',
                boxShadow: pressedKeys.has(key.note)
                  ? 'inset 0 4px 8px rgba(0, 0, 0, 0.2)'
                  : '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}
            >
              {showNoteNames && (
                <span style={{
                  color: pressedKeys.has(key.note) ? '#2d3748' : '#4a5568',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>
                  {key.note}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 검은 건반들 */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '2px',
          zIndex: 2
        }}>
          {pianoKeys.filter(key => key.isBlack).map((key) => (
            <div
              key={key.note}
              onMouseDown={() => handleMouseDown(key.note)}
              onMouseUp={() => handleMouseUp(key.note)}
              onMouseLeave={() => handleMouseLeave(key.note)}
              style={{
                width: '40px',
                height: '120px',
                background: pressedKeys.has(key.note)
                  ? 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
                  : 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
                borderRadius: '0 0 6px 6px',
                border: '2px solid #1a202c',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '0.5rem',
                transition: 'all 0.1s ease',
                transform: pressedKeys.has(key.note) ? 'scale(0.98)' : 'scale(1)',
                boxShadow: pressedKeys.has(key.note)
                  ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                  : '0 2px 4px rgba(0, 0, 0, 0.2)',
                marginLeft: key.note === 'C#' ? '45px' : 
                           key.note === 'D#' ? '45px' :
                           key.note === 'F#' ? '45px' :
                           key.note === 'G#' ? '45px' :
                           key.note === 'A#' ? '45px' : '0'
              }}
            >
              {showNoteNames && (
                <span style={{
                  color: pressedKeys.has(key.note) ? '#e2e8f0' : '#a0aec0',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {key.note}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 연주 정보 */}
      <div className="mt-4 text-center">
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '10px',
          padding: '1rem',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <h6 style={{ color: COLORS.text.primary, marginBottom: '0.5rem' }}>
            🎵 현재 연주 중인 음표
          </h6>
          <div style={{ color: COLORS.primary.light, fontSize: '1.2rem', fontWeight: 'bold' }}>
            {pressedKeys.size > 0 ? Array.from(pressedKeys).join(', ') : '없음'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualPiano;
