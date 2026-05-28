# Bootstrap Step 11 - KBO Real Provider

## 요약

이번 step은 야구 비서를 실제 KBO 데이터에 연결하는 단계입니다. 공식 KBO 사이트의 팀 순위, 월간 일정, 최신 뉴스를 조합해 팀별 브리핑용 provider 결과를 만들고, 기존 runner와 UI는 그대로 재사용합니다.

## 브랜치 계획

- 기준 문서: `docs/execplans/step-11-kbo-provider.md`
- 권장 브랜치명: `step/11-kbo-provider`
- 현재 작업은 기존 변경 위에서 이어서 진행합니다.

## 커밋 초안

- `docs(planning): add step 11 kbo provider plan`
- `feat(providers): add official kbo baseball adapter`
- `test(providers): cover kbo baseball normalization`
- `docs(readme): document kbo baseball provider`

## 예정 작업

- Step 11 계획 문서 작성
- `BASEBALL_PROVIDER=kbo` 선택지 추가
- KBO standings/schedule/news 파서 구현
- 팀별 최신 경기/다음 경기/기사 요약 정규화
- provider 테스트 및 문서 갱신

## 작업 메모

- 공식 API보다 공식 웹페이지 HTML 구조에 의존하는 step입니다.
- 기사 제목 기반 선수 추출은 휴리스틱이므로, 실패 시 팀 중심 fallback 문구를 사용합니다.
- breaking news를 source로 우선 사용하고, 기사 매칭이 없으면 standings 페이지를 source로 사용합니다.

## 종료 기준

- 야구 provider가 `mock`, `kbo`를 모두 지원합니다.
- 선택 팀별 `latestResult`, `keyStory`, `nextGame`, `recentRecord`가 실제 KBO 데이터로 채워집니다.
- 순위 스냅샷이 공식 standings 기준으로 정규화됩니다.
- README와 `.env.example`에 설정 방법이 반영됩니다.
- `lint`, `typecheck`, `test`가 통과합니다.
