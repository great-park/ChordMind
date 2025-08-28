"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Form, Badge, Alert, ProgressBar, Modal } from 'react-bootstrap';
import { aiService, AIHarmonyPattern } from '../services/aiService';
import { CARD_STYLES, BUTTON_STYLES } from '../constants/styles';

interface CompositionProject {
  id: string;
  title: string;
  style: string;
  difficulty: string;
  mood: string;
  harmony_progression: string[];
  melody_notes: any[];
  created_at: Date;
  status: 'draft' | 'in_progress' | 'completed';
}

const AICompositionStudio: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<CompositionProject | null>(null);
  const [generatedPattern, setGeneratedPattern] = useState<AIHarmonyPattern | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [compositionSettings, setCompositionSettings] = useState({
    style: 'classical',
    difficulty: 'intermediate',
    length: 8,
    mood: 'neutral',
    key: 'C',
    tempo: 120
  });

  const [projects, setProjects] = useState<CompositionProject[]>([]);

  useEffect(() => {
    loadSavedProjects();
  }, []);

  const loadSavedProjects = () => {
    const saved = localStorage.getItem('chordmind_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  };

  const saveProject = () => {
    if (!generatedPattern || !projectTitle.trim()) return;

    const newProject: CompositionProject = {
      id: Date.now().toString(),
      title: projectTitle,
      style: generatedPattern.style,
      difficulty: generatedPattern.difficulty,
      mood: generatedPattern.mood,
      harmony_progression: generatedPattern.chords,
      melody_notes: [],
      created_at: new Date(),
      status: 'draft'
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('chordmind_projects', JSON.stringify(updatedProjects));
    setShowSaveModal(false);
    setProjectTitle('');
  };

  const generateHarmonyPattern = async () => {
    setIsGenerating(true);
    try {
      const pattern = await aiService.generateEnhancedHarmonyPattern(
        compositionSettings.style,
        compositionSettings.difficulty,
        compositionSettings.length,
        compositionSettings.mood
      );
      setGeneratedPattern(pattern);
      
      // 새 프로젝트 시작
      setCurrentProject({
        id: Date.now().toString(),
        title: `새 작곡 - ${compositionSettings.style} ${compositionSettings.difficulty}`,
        style: compositionSettings.style,
        difficulty: compositionSettings.difficulty,
        mood: compositionSettings.mood,
        harmony_progression: pattern.chords,
        melody_notes: [],
        created_at: new Date(),
        status: 'in_progress'
      });
    } catch (error) {
      console.error('화성 패턴 생성 실패:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const playChordProgression = () => {
    if (!generatedPattern) return;
    
    // 간단한 Web Audio API를 사용한 화음 재생
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    generatedPattern.chords.forEach((chord, index) => {
      setTimeout(() => {
        playChord(audioContext, chord, compositionSettings.key);
      }, index * 1000); // 1초마다 화음 재생
    });
  };

  const playChord = (audioContext: AudioContext, chord: string, key: string) => {
    const frequencies = getChordFrequencies(chord, key);
    
    frequencies.forEach(freq => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    });
  };

  const getChordFrequencies = (chord: string, key: string): number[] => {
    const baseFreq = getKeyFrequency(key);
    const chordIntervals = getChordIntervals(chord);
    
    return chordIntervals.map(interval => baseFreq * Math.pow(2, interval / 12));
  };

  const getKeyFrequency = (key: string): number => {
    const keyFrequencies: { [key: string]: number } = {
      'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
      'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
      'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
    };
    return keyFrequencies[key] || 261.63;
  };

  const getChordIntervals = (chord: string): number[] => {
    if (chord.includes('maj7')) return [0, 4, 7, 11];
    if (chord.includes('7')) return [0, 4, 7, 10];
    if (chord.includes('m')) return [0, 3, 7];
    if (chord.includes('dim')) return [0, 3, 6];
    if (chord.includes('aug')) return [0, 4, 8];
    return [0, 4, 7]; // 기본 메이저
  };

  const exportToMidi = () => {
    if (!generatedPattern) return;
    
    // MIDI 파일 생성 로직 (간단한 버전)
    const midiData = generateMidiData(generatedPattern.chords);
    downloadMidiFile(midiData, `${compositionSettings.style}_progression.mid`);
  };

  const generateMidiData = (chords: string[]): string => {
    // 간단한 MIDI 데이터 생성 (실제로는 더 복잡한 로직 필요)
    return `MThd\n0006\n0001\n0001\nMTrk\n0004\n00FF\n02\n0000\n00FF\n51\n03\n07A120\n00C0\n00\n00C1\n01\n00C2\n02\n00C3\n03\n00C4\n04\n00C5\n05\n00C6\n06\n00C7\n07\n00C8\n08\n00C9\n09\n00CA\n0A\n00CB\n0B\n00CC\n0C\n00CD\n0D\n00CE\n0E\n00CF\n0F\n00FF\n2F\n00`;
  };

  const downloadMidiFile = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ai-composition-studio">
      <h2 className="mb-4">🎼 AI 작곡 스튜디오</h2>
      
      {/* 작곡 설정 */}
      <Card style={CARD_STYLES.primary} className="mb-4">
        <Card.Body>
          <h5>🎛️ 작곡 설정</h5>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>음악 스타일</Form.Label>
                <Form.Select
                  value={compositionSettings.style}
                  onChange={(e) => setCompositionSettings({
                    ...compositionSettings,
                    style: e.target.value
                  })}
                >
                  <option value="classical">클래식</option>
                  <option value="jazz">재즈</option>
                  <option value="pop">팝</option>
                  <option value="baroque">바로크</option>
                  <option value="romantic">낭만주의</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>난이도</Form.Label>
                <Form.Select
                  value={compositionSettings.difficulty}
                  onChange={(e) => setCompositionSettings({
                    ...compositionSettings,
                    difficulty: e.target.value
                  })}
                >
                  <option value="beginner">초급</option>
                  <option value="intermediate">중급</option>
                  <option value="advanced">고급</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>화음 개수</Form.Label>
                <Form.Control
                  type="number"
                  min="2"
                  max="20"
                  value={compositionSettings.length}
                  onChange={(e) => setCompositionSettings({
                    ...compositionSettings,
                    length: parseInt(e.target.value)
                  })}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>무드</Form.Label>
                <Form.Select
                  value={compositionSettings.mood}
                  onChange={(e) => setCompositionSettings({
                    ...compositionSettings,
                    mood: e.target.value
                  })}
                >
                  <option value="neutral">중립</option>
                  <option value="happy">밝은</option>
                  <option value="sad">슬픈</option>
                  <option value="mysterious">신비로운</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>조성</Form.Label>
                <Form.Select
                  value={compositionSettings.key}
                  onChange={(e) => setCompositionSettings({
                    ...compositionSettings,
                    key: e.target.value
                  })}
                >
                  {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>템포 (BPM)</Form.Label>
                <Form.Control
                  type="number"
                  min="60"
                  max="200"
                  value={compositionSettings.tempo}
                  onChange={(e) => setCompositionSettings({
                    ...compositionSettings,
                    tempo: parseInt(e.target.value)
                  })}
                />
              </Form.Group>
            </Col>
            
            <Col md={6} className="d-flex align-items-end">
              <Button
                variant="primary"
                size="lg"
                onClick={generateHarmonyPattern}
                disabled={isGenerating}
                style={BUTTON_STYLES.primary}
                className="w-100"
              >
                {isGenerating ? '🎵 생성 중...' : '🎼 화성 진행 생성'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 생성된 화성 진행 */}
      {generatedPattern && (
        <Card style={CARD_STYLES.secondary} className="mb-4">
          <Card.Body>
            <h5>🎵 생성된 화성 진행</h5>
            <div className="mb-3">
              <strong>패턴:</strong> {generatedPattern.pattern_name}<br/>
              <strong>스타일:</strong> {generatedPattern.style}<br/>
              <strong>난이도:</strong> {generatedPattern.difficulty}<br/>
              <strong>무드:</strong> {generatedPattern.mood}<br/>
              <strong>소스:</strong> {generatedPattern.source}
            </div>
            
            <div className="mb-4">
              <strong>화성 진행:</strong>
              <div className="d-flex gap-2 flex-wrap mt-2 mb-3">
                {generatedPattern.chords.map((chord, index) => (
                  <Badge 
                    key={index} 
                    bg="primary" 
                    className="fs-5 px-3 py-2 cursor-pointer"
                    onClick={() => {
                      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                      playChord(audioContext, chord, compositionSettings.key);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {chord}
                  </Badge>
                ))}
              </div>
              
              <div className="d-flex gap-2">
                <Button 
                  variant="success" 
                  onClick={playChordProgression}
                  style={BUTTON_STYLES.success}
                >
                  ▶️ 전체 재생
                </Button>
                <Button 
                  variant="info" 
                  onClick={() => setShowSaveModal(true)}
                  style={BUTTON_STYLES.info}
                >
                  💾 프로젝트 저장
                </Button>
                <Button 
                  variant="warning" 
                  onClick={exportToMidi}
                  style={BUTTON_STYLES.warning}
                >
                  📁 MIDI 내보내기
                </Button>
              </div>
            </div>

            {generatedPattern.enhancements && (
              <div>
                <strong>적용된 향상기능:</strong>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {Object.entries(generatedPattern.enhancements).map(([key, value]) => (
                    <Badge 
                      key={key} 
                      bg={value ? 'success' : 'secondary'}
                      className="fs-6"
                    >
                      {key.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* 저장된 프로젝트들 */}
      {projects.length > 0 && (
        <Card style={CARD_STYLES.default} className="mb-4">
          <Card.Body>
            <h5>📚 저장된 프로젝트</h5>
            <Row>
              {projects.map(project => (
                <Col md={6} lg={4} key={project.id} className="mb-3">
                  <Card style={CARD_STYLES.accent}>
                    <Card.Body>
                      <h6>{project.title}</h6>
                      <div className="mb-2">
                        <Badge bg="primary" className="me-1">{project.style}</Badge>
                        <Badge bg="info" className="me-1">{project.difficulty}</Badge>
                        <Badge bg="success" className="me-1">{project.mood}</Badge>
                      </div>
                      <div className="mb-2">
                        <small className="text-muted">
                          {project.harmony_progression.slice(0, 4).join(' - ')}
                          {project.harmony_progression.length > 4 && '...'}
                        </small>
                      </div>
                      <div className="d-flex gap-1">
                        <Button size="sm" variant="outline-primary">편집</Button>
                        <Button size="sm" variant="outline-success">재생</Button>
                        <Button size="sm" variant="outline-warning">내보내기</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* 저장 모달 */}
      <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>프로젝트 저장</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>프로젝트 제목</Form.Label>
            <Form.Control
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="예: 클래식 화성 진행 1"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={saveProject} disabled={!projectTitle.trim()}>
            저장
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AICompositionStudio;
