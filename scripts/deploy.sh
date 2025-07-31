#!/bin/bash

echo "🚀 ChordMind 배포를 시작합니다..."

# Docker 환경 확인
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다."
    exit 1
fi

# 기존 컨테이너 정리
echo "🧹 기존 컨테이너를 정리합니다..."
docker-compose down --volumes --remove-orphans

# 이미지 빌드
echo "🔨 Docker 이미지를 빌드합니다..."
docker-compose build --no-cache

# 서비스 시작
echo "🚀 서비스를 시작합니다..."
docker-compose up -d

echo "⏳ 서비스 시작 대기 중..."
sleep 30

echo "✅ 배포 완료!"
echo "📱 Frontend: http://localhost:3000"
echo "🔌 API Gateway: http://localhost:8080" 