FROM python:3.11-slim

WORKDIR /app

# 시스템 의존성 설치
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

# DB 초기화 스크립트 복사
COPY database/schema.sql /docker-entrypoint-initdb.d/
COPY database/init_data.sql /docker-entrypoint-initdb.d/

# 포트 노출
EXPOSE 8082

# 애플리케이션 실행
CMD ["python", "main.py"] 