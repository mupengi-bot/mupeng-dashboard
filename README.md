# 🐧 무펭이 대시보드

AI 에이전트(무펭이)가 자율 판단하기 위한 전략 대시보드입니다. 에이전트가 heartbeat에서 이 대시보드 데이터를 보고 선제적 제안을 합니다.

## 🎯 목적

- **사업 건강도 모니터링**: ARR/MRR, 고객 수, 런웨이 추적
- **스킬 생태계 분석**: ClawHub 스킬 사용 현황 및 다운로드 추이
- **에이전트 성장 추적**: 제안 채택률, 실수 빈도, 자율 행동 로그
- **운영 현황 파악**: 고객사별 에이전트 상태, 스킬 사용률, 선제적 제안 큐

## 🛠️ 기술 스택

- **Static HTML + Vanilla JavaScript + CSS** (프레임워크 없음)
- **Chart.js** (차트 라이브러리)
- **Pretendard** 폰트
- **다크 네이비 테마** (#1a1a2e 기반)
- **반응형 디자인** (모바일 대응)

## 📁 파일 구조

```
mupeng-dashboard/
├── index.html      # 메인 대시보드 HTML
├── data.json       # 데이터 소스 (샘플 포함)
├── style.css       # 스타일시트
├── app.js          # JavaScript 로직
└── README.md       # 이 문서
```

## 🚀 사용 방법

### 1. 로컬에서 실행

간단한 HTTP 서버로 실행:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (http-server 설치 필요)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

브라우저에서 `http://localhost:8000` 접속

### 2. 데이터 업데이트

`data.json` 파일을 편집하여 실시간 데이터를 반영:

```bash
# 수동 편집
vi data.json

# 또는 스크립트로 자동 생성
node update-dashboard-data.js  # (별도 작성 필요)
```

### 3. 자동 새로고침 (선택사항)

`app.js` 하단의 주석 해제:

```javascript
// Auto Refresh (Optional)
setInterval(async () => {
  await loadData();
  renderDashboard();
  updateLastUpdateTime();
}, 5 * 60 * 1000);  // 5분마다 새로고침
```

## 📊 대시보드 섹션

### 1️⃣ 사업 건강 지표 (Business Health)

- **ARR/MRR 추이**: 월별 매출 성장 차트
- **고객 수 & 이탈률**: 활성 고객 및 이탈률
- **파이프라인**: 잠재 고객 목록 및 단계
- **런웨이**: 현금 소진까지 남은 개월 수 (프로그레스 바)

### 2️⃣ 스킬 생태계 (Skill Ecosystem)

- **ClawHub 스킬 현황**: 배포/로컬 스킬 수, 총 다운로드
- **다운로드 추이**: 7일간 일별 다운로드 추세
- **카테고리 분포**: 마케팅/운영/개발/분석/기타 도넛 차트
- **Top 10 인기 스킬**: 다운로드 수 기준 바 차트
- **한국 특화 스킬**: 비율 및 개수

### 3️⃣ 에이전트 성장 (Agent Growth)

- **제안 채택률**: 주별 제안 채택률 (상승 추세 목표)
- **실수 빈도**: 주별 실수 횟수 (감소 추세 목표)
- **스킬 개발 속도**: 주당 신규 스킬 개발 수
- **자율 행동 로그**: 최근 10개 자율 행동 및 결과

### 4️⃣ 운영 현황 (Operations)

- **고객별 에이전트 상태**: 가동률, 상태 (초록/노랑/빨강)
- **스킬 사용률 히트맵**: 고객 × 스킬 교차 사용량
- **이벤트 피드**: 최근 20개 알림/이벤트
- **선제적 제안 큐**: 미처리 제안 목록 (우선순위별)

## 🎨 디자인 가이드

### 색상 팔레트

- **배경**: `#1a1a2e` (다크 네이비)
- **카드**: `#16213e` (세컨더리 네이비)
- **보더**: `#0f3460` (파랑 액센트)
- **텍스트**: `#eee` (기본), `#aaa` (보조)
- **상태 색상**:
  - 정상: `#53bf6b` (초록)
  - 경고: `#f0a500` (노랑)
  - 위험: `#e94560` (빨강)

### 반응형 브레이크포인트

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: ≤ 480px

## 📝 데이터 스키마

`data.json` 구조:

```json
{
  "businessHealth": {
    "arr": number,
    "mrr": number,
    "customers": { "total": number, "active": number, "churnRate": number },
    "revenue": [{ "month": string, "arr": number, "mrr": number }],
    "pipeline": [{ "name": string, "industry": string, "potential": number, "stage": string }],
    "runway": { "cashOnHand": number, "monthlyBurn": number, "months": number }
  },
  "skillEcosystem": {
    "total": { "published": number, "local": number, "totalDownloads": number },
    "downloadTrend": [{ "date": string, "downloads": number }],
    "categories": [{ "name": string, "count": number, "downloads": number }],
    "topSkills": [{ "name": string, "downloads": number, "category": string }],
    "koreanSpecific": { "count": number, "percentage": number }
  },
  "agentGrowth": {
    "proposalAcceptance": [{ "week": string, "rate": number }],
    "errorFrequency": [{ "week": string, "errors": number }],
    "skillDevelopment": [{ "week": string, "newSkills": number }],
    "autonomousActions": [{ "timestamp": string, "action": string, "result": string, "impact": string }]
  },
  "operations": {
    "customerStatus": [{ "name": string, "industry": string, "status": string, "agentUptime": number, "lastActivity": string }],
    "skillUsageHeatmap": [{ "customer": string, "skills": { "skillName": number } }],
    "recentEvents": [{ "timestamp": string, "type": string, "message": string }],
    "proactiveQueue": [{ "id": string, "priority": string, "customer": string, "proposal": string, "created": string }]
  }
}
```

## 🔧 커스터마이징

### 차트 색상 변경

`app.js`에서 Chart.js 옵션 수정:

```javascript
borderColor: '#your-color',
backgroundColor: 'rgba(r, g, b, 0.2)',
```

### 자동 새로고침 간격 조정

`app.js` 하단:

```javascript
5 * 60 * 1000  // 5분 → 원하는 시간(ms)로 변경
```

### 추가 섹션 생성

1. `index.html`에 섹션 추가
2. `style.css`에 스타일 정의
3. `app.js`에 렌더링 함수 작성
4. `data.json`에 데이터 추가

## 🚨 에이전트 활용 예시

### Heartbeat에서 대시보드 읽기

```javascript
// HEARTBEAT.md 또는 에이전트 코드
const response = await fetch('/path/to/data.json');
const dashboard = await response.json();

// 예: 런웨이 6개월 이하면 알림
if (dashboard.businessHealth.runway.months < 6) {
  alert('⚠️ 런웨이 6개월 미만! 자금 확보 필요');
}

// 예: 이탈률 10% 이상이면 고객 리텐션 전략 제안
if (dashboard.businessHealth.customers.churnRate > 10) {
  suggest('고객 이탈률 증가 → 만족도 조사 및 개선안 필요');
}
```

## 📈 향후 개선 사항

- [ ] 실시간 WebSocket 연동
- [ ] 데이터 필터링 (기간, 고객별)
- [ ] CSV/PDF 내보내기
- [ ] 알림 설정 (임계값 도달 시)
- [ ] 다크/라이트 테마 토글
- [ ] 사용자 인증 및 권한 관리

## 📄 라이선스

MIT License (내부 프로젝트용)

---

**Made with ❤️ by 무펭이**  
2026년 2월
