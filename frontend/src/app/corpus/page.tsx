'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { BADGE_STYLES, BUTTON_STYLES, CARD_STYLES, COLORS, GRADIENTS } from '../../constants/styles';
import { corpusService, CorpusItem, CorpusStatistics, HarmonyAnalysis } from '../../services/corpusService';

const CorpusExplorer: React.FC = () => {
  const [corpusItems, setCorpusItems] = useState<CorpusItem[]>([]);
  const [statistics, setStatistics] = useState<CorpusStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedComposer, setSelectedComposer] = useState<string>('');
  const [genres, setGenres] = useState<string[]>([]);
  const [composers, setComposers] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<CorpusItem | null>(null);
  const [harmonyAnalysis, setHarmonyAnalysis] = useState<HarmonyAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadCorpusData();
  }, []);

  const loadCorpusData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 코퍼스 스캔
      const scanResult = await corpusService.scanCorpus();
      setStatistics(scanResult.statistics);

      // 코퍼스 아이템 로드
      const itemsResult = await corpusService.getCorpusItems();
      setCorpusItems(itemsResult.items);

      // 장르 및 작곡가 목록 로드
      const genresList = await corpusService.getGenres();
      setGenres(genresList);

      const composersList = await corpusService.getComposers();
      setComposers(composersList);

    } catch (err) {
      setError('코퍼스 데이터 로드에 실패했습니다.');
      console.error('코퍼스 데이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const searchResult = await corpusService.searchCorpus(searchQuery);
      setCorpusItems(searchResult.results);
    } catch (err) {
      setError('검색에 실패했습니다.');
      console.error('검색 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreFilter = async (genre: string) => {
    try {
      setLoading(true);
      setSelectedGenre(genre);
      setSelectedComposer('');

      const itemsResult = await corpusService.getCorpusItems(genre);
      setCorpusItems(itemsResult.items);

      // 해당 장르의 작곡가 목록 로드
      const composersList = await corpusService.getComposers(genre);
      setComposers(composersList);
    } catch (err) {
      setError('장르 필터링에 실패했습니다.');
      console.error('장르 필터링 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComposerFilter = async (composer: string) => {
    try {
      setLoading(true);
      setSelectedComposer(composer);

      const itemsResult = await corpusService.getCorpusItems(selectedGenre, composer);
      setCorpusItems(itemsResult.items);
    } catch (err) {
      setError('작곡가 필터링에 실패했습니다.');
      console.error('작곡가 필터링 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = async (item: CorpusItem) => {
    setSelectedItem(item);
    setHarmonyAnalysis(null);

    // 화성 분석 수행
    try {
      setAnalyzing(true);
      const analysis = await corpusService.processScore(item.score_path);
      setHarmonyAnalysis(analysis);
    } catch (err) {
      console.error('화성 분석 실패:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const exportResult = await corpusService.exportCorpusData(format);
      console.log(`${format.toUpperCase()} 내보내기 완료:`, exportResult);

      // 파일 다운로드
      const blob = await corpusService.downloadCorpusData(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `corpus_export.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(`${format.toUpperCase()} 내보내기에 실패했습니다.`);
      console.error('내보내기 실패:', err);
    }
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedComposer('');
    setSearchQuery('');
    loadCorpusData();
  };

  if (loading && !corpusItems.length) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">코퍼스 데이터를 로드하고 있습니다...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* 헤더 */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <Badge style={BADGE_STYLES.primary} className="mb-3">
              When-in-Rome 코퍼스
            </Badge>
            <h1 className="display-4 fw-bold text-white mb-3">
              음악 코퍼스 탐색 및 분석
            </h1>
            <p className="lead text-muted">
              When-in-Rome 코퍼스를 통해 체계적인 화성학 학습과 AI 기반 분석을 경험하세요
            </p>
          </div>
        </Col>
      </Row>

      {/* 통계 정보 */}
      {statistics && (
        <Row className="mb-5">
          <Col>
            <Card style={CARD_STYLES.primary} className="text-center">
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <h3 className="text-primary">{statistics.total_items}</h3>
                    <p className="text-muted mb-0">전체 곡목</p>
                  </Col>
                  <Col md={3}>
                    <h3 className="text-success">{Object.keys(statistics.genre_distribution).length}</h3>
                    <p className="text-muted mb-0">장르</p>
                  </Col>
                  <Col md={3}>
                    <h3 className="text-info">{Object.keys(statistics.composer_distribution).length}</h3>
                    <p className="text-muted mb-0">작곡가</p>
                  </Col>
                  <Col md={3}>
                    <h3 className="text-warning">{statistics.manual_analysis_count}</h3>
                    <p className="text-muted mb-0">수동 분석</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 검색 및 필터 */}
      <Row className="mb-4">
        <Col>
          <Card style={CARD_STYLES.secondary}>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="곡명, 작곡가, 장르로 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button 
                      style={BUTTON_STYLES.primary}
                      onClick={handleSearch}
                    >
                      검색
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={6} className="d-flex gap-2">
                  <Form.Select
                    value={selectedGenre}
                    onChange={(e) => handleGenreFilter(e.target.value)}
                  >
                    <option value="">모든 장르</option>
                    {genres.map(genre => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </Form.Select>
                  <Form.Select
                    value={selectedComposer}
                    onChange={(e) => handleComposerFilter(e.target.value)}
                    disabled={!selectedGenre}
                  >
                    <option value="">모든 작곡가</option>
                    {composers.map(composer => (
                      <option key={composer} value={composer}>{composer}</option>
                    ))}
                  </Form.Select>
                  <Button 
                    variant="outline-secondary"
                    onClick={clearFilters}
                  >
                    초기화
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 에러 메시지 */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* 코퍼스 아이템 목록 */}
      <Row className="mb-4">
        <Col md={6}>
          <Card style={CARD_STYLES.secondary}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">코퍼스 아이템</h5>
              <div>
                <Button 
                  size="sm" 
                  variant="outline-success" 
                  onClick={() => handleExport('json')}
                  className="me-2"
                >
                  JSON
                </Button>
                <Button 
                  size="sm" 
                  variant="outline-info" 
                  onClick={() => handleExport('csv')}
                >
                  CSV
                </Button>
              </div>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {corpusItems.length === 0 ? (
                <p className="text-muted text-center">검색 결과가 없습니다.</p>
              ) : (
                <div className="d-grid gap-2">
                  {corpusItems.map((item, index) => (
                    <Card
                      key={index}
                      style={{
                        ...CARD_STYLES.tertiary,
                        cursor: 'pointer',
                        border: selectedItem === item ? `2px solid ${COLORS.primary}` : undefined
                      }}
                      onClick={() => handleItemSelect(item)}
                      className="hover-lift"
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1">{item.metadata.title || '제목 없음'}</h6>
                          <Badge bg="secondary" className="ms-2">
                            {item.genre}
                          </Badge>
                        </div>
                        <p className="text-muted mb-1">
                          <strong>작곡가:</strong> {item.composer}
                        </p>
                        <p className="text-muted mb-1">
                          <strong>조성:</strong> {item.metadata.key_signature} | 
                          <strong>박자:</strong> {item.metadata.time_signature}
                        </p>
                        <p className="text-muted mb-0">
                          <strong>마디:</strong> {item.metadata.total_measures} | 
                          <strong>분석:</strong> {item.analysis_path ? '✅' : '❌'}
                        </p>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 선택된 아이템 상세 정보 */}
        <Col md={6}>
          <Card style={CARD_STYLES.secondary}>
            <Card.Header>
              <h5 className="mb-0">상세 정보</h5>
            </Card.Header>
            <Card.Body>
              {selectedItem ? (
                <div>
                  <h6>{selectedItem.metadata.title || '제목 없음'}</h6>
                  <p className="text-muted mb-3">
                    {selectedItem.composer} • {selectedItem.genre}
                  </p>
                  
                  <div className="mb-3">
                    <strong>기본 정보:</strong>
                    <ul className="list-unstyled mt-2">
                      <li>조성: {selectedItem.metadata.key_signature}</li>
                      <li>박자: {selectedItem.metadata.time_signature}</li>
                      <li>마디 수: {selectedItem.metadata.total_measures}</li>
                      <li>총 길이: {selectedItem.metadata.total_duration}</li>
                    </ul>
                  </div>

                  <div className="mb-3">
                    <strong>파일 경로:</strong>
                    <ul className="list-unstyled mt-2">
                      <li>악보: {selectedItem.score_path}</li>
                      {selectedItem.analysis_path && (
                        <li>수동 분석: {selectedItem.analysis_path}</li>
                      )}
                      {selectedItem.auto_analysis_path && (
                        <li>자동 분석: {selectedItem.auto_analysis_path}</li>
                      )}
                    </ul>
                  </div>

                  {/* 화성 분석 결과 */}
                  {analyzing && (
                    <div className="text-center">
                      <Spinner animation="border" size="sm" />
                      <p className="mt-2">화성 분석 중...</p>
                    </div>
                  )}

                  {harmonyAnalysis && (
                    <div className="mt-3">
                      <h6>화성 분석 결과</h6>
                      <div className="mb-2">
                        <strong>로마 숫자:</strong>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {harmonyAnalysis.roman_numerals.map((num, idx) => (
                            <Badge key={idx} bg="primary">{num}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <strong>화성 진행:</strong>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          {harmonyAnalysis.chord_progressions.map((prog, idx) => (
                            <Badge key={idx} bg="success">{prog}</Badge>
                          ))}
                        </div>
                      </div>

                      {harmonyAnalysis.cadences.length > 0 && (
                        <div className="mb-2">
                          <strong>종지:</strong>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {harmonyAnalysis.cadences.map((cadence, idx) => (
                              <Badge key={idx} bg="warning">{cadence}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted text-center">
                  왼쪽에서 아이템을 선택하여 상세 정보를 확인하세요.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* AI 모델 관련 기능 */}
      <Row className="mb-4">
        <Col>
          <Card style={CARD_STYLES.secondary}>
            <Card.Header>
              <h5 className="mb-0">AI 모델 기능</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Button 
                    style={BUTTON_STYLES.primary}
                    className="w-100 mb-2"
                    onClick={() => corpusService.loadAIModel()}
                  >
                    AI 모델 로드
                  </Button>
                  <p className="text-muted small">
                    Harmony Transformer 모델을 로드합니다.
                  </p>
                </Col>
                <Col md={4}>
                  <Button 
                    style={BUTTON_STYLES.success}
                    className="w-100 mb-2"
                    onClick={() => corpusService.prepareTrainingData()}
                  >
                    학습 데이터 준비
                  </Button>
                  <p className="text-muted small">
                    코퍼스 데이터를 학습용으로 변환합니다.
                  </p>
                </Col>
                <Col md={4}>
                  <Button 
                    style={BUTTON_STYLES.warning}
                    className="w-100 mb-2"
                    onClick={() => corpusService.startModelTraining()}
                  >
                    모델 파인튜닝
                  </Button>
                  <p className="text-muted small">
                    AI 모델 파인튜닝을 시작합니다.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CorpusExplorer;
