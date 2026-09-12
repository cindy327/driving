# 도로연습 LAB

15년 장롱면허 운전자가 실제 도로주행 전에 **기초조작 → 신호 → 차선변경 → 실제 로드뷰 → 돌발상황**을 미션 방식으로 연습할 수 있는 모바일 우선 정적 웹앱입니다.

## 포함 기능

- 7단계 미션 잠금/해금
- XP / 운전자 등급 / 진행도 저장(localStorage)
- 브레이크, 가속, P/D/R, 방향지시등, 비상등, 거울확인, 차로이동 입력
- 신호/정지선/길 놓침/급정거 등 상황판단 퀴즈
- 카카오 로드뷰 API 미연결 시에도 동작하는 시뮬레이션 모드
- 카카오 JavaScript 키 연결 시 마곡나루역·영등포역·광명역을 검색해 주변 실제 로드뷰 시작
- 실제 로드뷰 `position_changed` 이벤트를 이용한 "한 지점 이동" 미션 판정
- 모바일 화면 최적화

## GitHub Pages 배포

1. 새 GitHub 저장소를 만듭니다.
2. 이 폴더 안의 `index.html`, `styles.css`, `app.js`, `config.js`, `.nojekyll` 파일을 저장소 루트에 올립니다.
3. GitHub 저장소 → **Settings → Pages**로 이동합니다.
4. **Build and deployment → Deploy from a branch**를 선택합니다.
5. Branch는 `main`, 폴더는 `/ (root)`를 선택하고 저장합니다.
6. 발급된 `https://YOUR_USERNAME.github.io/REPOSITORY/` 주소로 접속합니다.

## 카카오 로드뷰 연결

현재 카카오 지도 Web SDK는 **JavaScript 키**를 사용하며, 웹 서비스 도메인을 JavaScript SDK 도메인으로 등록해야 합니다.

1. Kakao Developers에서 앱을 만듭니다.
2. Kakao Map 사용 설정을 켭니다.
3. **플랫폼 키 → JavaScript 키**를 확인합니다.
4. JavaScript SDK 도메인에 아래처럼 GitHub Pages 원본(origin)을 등록합니다.
   - `https://YOUR_USERNAME.github.io`
   - 로컬 테스트가 필요하면 개발용 도메인도 별도 등록합니다.
5. `config.js`를 열고 아래 값을 수정합니다.

```js
window.APP_CONFIG = {
  KAKAO_JS_KEY: "여기에_JavaScript_키"
};
```

> JavaScript 키는 브라우저에서 사용되는 키이므로 소스에 보일 수 있습니다. 반드시 Kakao Developers에서 허용 도메인을 제한해 두세요.

## 로컬 테스트

파일을 더블클릭하기보다 간단한 로컬 서버로 여는 것을 권장합니다.

```bash
python -m http.server 8000
```

그 후 `http://localhost:8000`으로 접속합니다.

## 현재 MVP의 의도적 제한

- 로드뷰는 연속 3D 주행 게임이 아니라 촬영된 파노라마 지점을 이동하는 방식입니다.
- 실제 신호 상태나 실시간 교통을 판단하지 않습니다.
- 법규/표지/도로 구조는 시간이 지나며 변경될 수 있으므로 실제 주행 전 최신 표지와 현장 상황을 우선해야 합니다.
- 실제 운전 중 앱 조작 금지. 전문 운전연수 및 실제 차량의 안전장치·운전자 책임을 대체하지 않습니다.

## 다음 확장 추천

- 실제 출발지/목적지 입력 및 자주 가는 경로 저장
- 카카오모빌리티 자동차 길찾기 API 연계
- 차선선택 미션용 지도 경로 오버레이
- 실제 교차로별 커스텀 미션 데이터(JSON)
- 야간/우천/어린이보호구역/버스전용차로 훈련
- 미션 결과 리포트(신호·차선·시야·속도·돌발대처 별점)
