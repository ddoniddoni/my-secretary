# Step 04 비서 CRUD

## 목표

인증 셸과 데이터베이스 스키마를 실제 비서 관리 흐름으로 연결해, 사용자가 템플릿을 둘러보고, 비서를 생성하고, 자신의 비서를 조회·수정·삭제할 수 있도록 만듭니다.

## 가정

- Step 03 스키마와 seed SQL은 이미 `develop`에 머지되어 있습니다.
- 수동 end-to-end 테스트 전에 대상 환경에는 Step 03 migration과 seed가 적용되어 있습니다.
- 이 step에서는 seed된 `news`, `stock` 템플릿만 지원하면 충분합니다.
- AI 실행과 실행 기록은 이후 step에서 다루므로, 현재 대시보드 카드는 실제 결과 대신 생성 메타데이터를 보여줘도 됩니다.

## 범위

- 비서 템플릿과 사용자 비서 CRUD용 API route를 추가합니다.
- 비서 설정 payload에 대한 Zod validation을 추가합니다.
- 템플릿과 사용자 비서용 Supabase repository 헬퍼를 추가합니다.
- 대시보드 골격을 실제 비서 목록, empty state, 생성 모달, 삭제 확인 흐름으로 교체합니다.
- 비서 상세 골격을 실제 비서 데이터와 수정 가능한 설정 폼으로 교체합니다.
- 대시보드 route에 loading/error 상태를 추가합니다.
- 설정 검증과 payload 정규화를 위한 집중 테스트를 추가합니다.

## 범위 제외

- 비서 실행
- 실제 데이터 기반 실행 기록 렌더링
- 뉴스/주식 결과 UI
- 비서 목록 페이지네이션
- 프로필/설정 페이지 작업

## 구현 단계

1. Step 04 기획 문서를 추가합니다.
2. 비서 도메인 검증과 repository 헬퍼를 만듭니다.
   - template query
   - user assistant list/create/read/update/delete
   - 비서 타입별 config validation
3. 아래 Route Handler를 추가합니다.
   - `GET /api/assistants/templates`
   - `GET /api/assistants`
   - `POST /api/assistants`
   - `GET /api/assistants/[assistantId]`
   - `PATCH /api/assistants/[assistantId]`
   - `DELETE /api/assistants/[assistantId]`
4. 대시보드 UI를 구현합니다.
   - 실제 비서 카드
   - empty state
   - 비서 추가 모달
   - 삭제 확인 모달
   - loading/error 상태
5. 비서 상세 UI를 구현합니다.
   - 비서 헤더와 템플릿 메타데이터
   - 설정 요약
   - PATCH API로 저장하는 수정 폼
6. 설정 파싱과 payload 정규화 테스트를 추가합니다.
7. README 상태를 갱신하고 lint, typecheck, test를 실행합니다.

## 리스크

- 생성된 Supabase 타입이 없으면 repository 코드에서 row 매핑과 런타임 검증을 더 주의 깊게 다뤄야 합니다.
- 생성/수정 흐름 간 config 처리가 공용 헬퍼 없이 분리되면 중복이 빠르게 늘어날 수 있습니다.
- 환경에 Step 03 SQL이 아직 적용되지 않았다면 앱이 로컬에서 타입체크를 통과해도 CRUD API는 런타임에 실패할 수 있습니다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 검토 및 Supabase가 연결된 경우 확인할 항목:
  - 템플릿 목록 조회
  - 템플릿 기반 비서 생성
  - 새 비서가 대시보드에 반영되는지 확인
  - 비서 수정 가능 여부
  - 비서 삭제 가능 여부
  - 다른 사용자의 비서에 접근할 수 없는지 확인

## 결과물

- `docs/execplans/step-04-assistant-crud.md`
- `docs/steps/bootstrap-step-04-assistant-crud.md`
- 비서 CRUD API
- 동작하는 대시보드 비서 관리 UI
- 수정 가능한 설정을 가진 실제 비서 상세 페이지
- 설정 검증 헬퍼 테스트
