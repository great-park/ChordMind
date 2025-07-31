FROM python:3.11-slim

WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 파일 복사
COPY requirements.txt .

# Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 복사
COPY . .

# 포트 노출
EXPOSE 8083

# 헬스체크 엔드포인트 추가
RUN echo 'from fastapi import FastAPI\napp = FastAPI()\n@app.get("/health")\ndef health_check():\n    return {"status": "healthy"}' > health_check.py

# 애플리케이션 실행
CMD ["python", "main.py"] 