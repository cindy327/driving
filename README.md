# 도로연습 LAB V3 — Google 실도로 + SUV Cockpit

장롱면허 사용자가 실제 도로연수 전에 기초 조작과 실제 지역의 거리 구조를 미리 익히는 정적 웹앱입니다.

## V3 핵심
- 2025년형 준중형 SUV/투싼급 감성의 실사형 운전석 UI
- 핸들, 계기판, P/R/N/D, 브레이크, 가속 페달 조작
- Google Street View를 앞유리처럼 표시
- Google 위성 지도를 작은 보조 지도처럼 표시
- 마곡나루 / 영등포 / 광명 실제 지역 체크포인트
- 기본 10단계 미션은 Google 키 없이도 작동

## Google Maps Embed API 설정
Google Maps Embed API는 사용 요청 자체는 무료이며 무제한이지만, Google Cloud 프로젝트의 결제 계정과 API 키가 필요합니다.

1. Google Cloud Console에서 프로젝트 생성
2. 결제 계정 연결
3. `Maps Embed API` 활성화
4. API 키 생성
5. API 키 > 애플리케이션 제한 > `웹사이트` 선택
6. GitHub Pages 도메인 추가
   - 예: `https://USERNAME.github.io/*`
7. API 제한에서 `Maps Embed API`만 허용
8. `config.js` 수정

```js
window.APP_CONFIG.GOOGLE_MAPS_EMBED_KEY = "YOUR_KEY";
```

## GitHub Pages
저장소 최상위에 다음 파일/폴더가 오도록 업로드합니다.

- index.html
- styles.css
- app.js
- config.js
- assets/
- .nojekyll

Settings → Pages → Deploy from a branch → main → /(root)

## 참고
이 앱은 예행연습용이며 실제 도로연수, 교통법규 확인, 현장 판단을 대체하지 않습니다.
