# Step 11 - KBO Real Provider

## 목표

야구 비서가 `mock` 데이터뿐 아니라 KBO 공식 사이트의 순위, 일정, 뉴스 데이터를 읽어 실제 KBO 브리핑을 생성할 수 있도록 provider 계층을 확장합니다.

## 가정

- Step 10까지의 변경은 현재 작업 트리에 반영되어 있습니다.
- 기본 provider는 계속 `mock`이고, `BASEBALL_PROVIDER=kbo`일 때만 실제 데이터를 사용합니다.
- 이번 step에서는 KBO 퓨처스리그가 아니라 KBO 리그 1군 데이터만 다룹니다.
- 공식 API 문서가 별도로 공개되지 않은 영역이므로, KBO 공식 웹페이지 HTML 구조를 읽는 adapter를 사용합니다.

## 범위

- `BASEBALL_PROVIDER=kbo` 선택지 추가
- KBO 공식 영문 standings 페이지에서 팀 순위 데이터 수집
- KBO 공식 영문 daily schedule 페이지에서 최근 경기/다음 경기 데이터 수집
- KBO 공식 breaking news 페이지에서 팀별 최신 기사 데이터 수집
- 수집 데이터를 공통 `BaseballProviderResult` 형태로 정규화
- README, `.env.example`, provider 문서, 테스트 갱신

## 범위 제외

- 선수 세부 기록 API 또는 비공식 endpoint 연동
- 퓨처스리그 지원
- 경기별 박스스코어 세부 스탯 수집
- 기사 본문 deep parsing, 하이라이트 영상 연동, 캐싱

## 구현 단계

1. Step 11 계획 문서와 bootstrap 문서를 작성합니다.
2. 팀 코드/팀명 매핑과 공식 KBO 페이지 URL을 정리합니다.
3. standings, daily schedule, breaking news HTML 파서를 구현합니다.
4. 최근 경기, 다음 경기, 최신 기사, 순위를 합쳐 `KboOfficialProvider`를 구현합니다.
5. `createBaseballProvider`가 `mock`, `kbo`를 선택할 수 있게 확장합니다.
6. provider 테스트와 문서, 환경변수를 갱신합니다.
7. `lint`, `typecheck`, `test`를 실행합니다.

## 리스크

- 공식 HTML 구조가 변경되면 파서가 깨질 수 있습니다.
- breaking news 제목은 팀명을 명시하지 않는 경우가 있어 일부 팀은 최신 기사 매칭이 느슨할 수 있습니다.
- 기사 제목 기반 `keyPlayer` 추출은 휴리스틱이므로 완전하지 않습니다.
- 월초/월말에는 monthly schedule 한 페이지에서 이전 경기나 다음 경기를 모두 확보하지 못할 수 있습니다.

## 검증 방법

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 확인
  - `BASEBALL_PROVIDER=mock`에서 기존 동작 유지
  - `BASEBALL_PROVIDER=kbo`에서 선택 팀의 순위/최근 경기/다음 경기/기사 요약이 채워지는지 확인
  - KBO 공식 페이지 응답이 비어 있거나 파싱 실패 시 명확한 서버 에러가 발생하는지 확인

## 결과물

- `docs/execplans/step-11-kbo-provider.md`
- `docs/steps/bootstrap-step-11-kbo-provider.md`
- 확장된 `src/lib/providers/baseball.ts`
- KBO provider 테스트
- README, `.env.example`, provider 문서 갱신
