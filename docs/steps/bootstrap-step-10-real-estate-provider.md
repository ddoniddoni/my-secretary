# Bootstrap Step 10 - Real Estate Real Provider

## 요약

이번 step은 부동산 비서를 `mock` 중심 MVP에서 한 단계 확장해, 국토교통부 실거래가 OpenAPI를 선택적으로 연결하는 작업입니다. 기존 runner, UI, schema는 유지하고 provider만 교체 가능한 구조를 지키는 것이 핵심입니다.

## 브랜치 계획

- 기준 문서: `docs/execplans/step-10-real-estate-provider.md`
- 권장 브랜치명: `step/10-real-estate-provider`
- 현재 작업은 기존 흐름을 이어서 진행하며, 별도 브랜치 정리는 사용자가 원할 때 수행합니다.

## 커밋 초안

- `docs(planning): add step 10 real estate provider plan`
- `feat(providers): add molit real estate adapter`
- `test(providers): cover molit real estate normalization`
- `docs(readme): document molit real estate setup`

## 예정 작업

- Step 10 계획 문서 작성
- `REAL_ESTATE_PROVIDER=molit` 선택지 추가
- `MOLIT_API_KEY` 환경변수 추가
- 타입별 실거래가 endpoint 호출 및 XML 파싱 구현
- 지역 매핑/오류 처리 추가
- README, `.env.example`, provider 테스트 갱신

## 작업 메모

- 기본 provider는 계속 `mock`로 유지합니다.
- 지원하지 않는 지역 입력은 조용히 무시하지 않고 명확히 실패시킵니다.
- 공급/수요 표현은 실거래 데이터 범위 안에서 보수적으로 생성합니다.
- 원본 API 호출 URL에는 인증키가 포함되므로 source 링크에는 dataset 페이지를 사용합니다.

## 종료 기준

- 부동산 provider가 `mock`, `molit`를 모두 지원합니다.
- `MOLIT_API_KEY` 누락과 지원하지 않는 지역명이 명확한 에러로 surfaced 됩니다.
- 정규화 결과가 기존 runner와 호환됩니다.
- README와 `.env.example`에 설정 방법과 제한사항이 반영됩니다.
- `lint`, `typecheck`, `test` 결과가 확인됩니다.

## 다음 Step 후보

- KBO 실제 provider 확장
- provider 캐싱 및 재시도 전략
- 배포 환경 정리와 preview/prod 문서화
