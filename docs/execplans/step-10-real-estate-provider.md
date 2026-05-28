# Step 10 - Real Estate Real Provider

## 목표

부동산 비서가 `mock` 데이터뿐 아니라 국토교통부 실거래가 OpenAPI를 통해 실제 거래 데이터를 읽어 `real_estate` 결과를 생성할 수 있도록 provider 계층을 확장합니다.

## 가정

- Step 09까지의 변경은 이미 현재 작업 트리에 반영되어 있습니다.
- 이번 step은 새 브랜치를 따기보다 현재 작업 흐름을 이어서 구현합니다.
- `REAL_ESTATE_PROVIDER=molit`일 때만 실제 API를 사용하고, 기본값은 계속 `mock`입니다.
- MVP 단계에서는 국토교통부 실거래가 계열 API를 기반으로 `apartment`, `officetel`, `villa` 세 타입만 지원합니다.
- 지역 문자열은 내부 매핑 가능한 행정구역 이름만 우선 지원하며, 지원하지 않는 입력은 명확한 서버 에러로 반환합니다.

## 범위

- `REAL_ESTATE_PROVIDER=molit` 선택지 추가
- `MOLIT_API_KEY` 환경변수 추가
- `apartment`, `officetel`, `villa` 타입별 실거래가 API 호출 구현
- 최근 월별 실거래 데이터를 공통 `RealEstateProviderResult` 형태로 정규화
- 거래 건수, 평균 가격, 최신 거래 시점 등을 바탕으로 공급/수요/가격 흐름 문구 생성
- XML 응답 파싱, 오류 응답 처리, 지원 지역 검증 추가
- README, `.env.example`, provider 테스트 갱신

## 범위 제외

- 코드 입력을 위한 외부 행정구역 API 연동
- 부동산 전월세 API 추가
- 거래가 캐싱, 배치 적재, DB 저장 구조 확장
- 시세 예측, 투자 판단, 법률 해석

## 구현 단계

1. Step 10 계획 문서와 bootstrap 문서를 작성합니다.
2. 부동산 provider가 요구하는 지역 코드 매핑, 타입별 endpoint, XML 파싱 유틸리티를 설계합니다.
3. 국토교통부 실거래가 API 기반 `MolitRealEstateProvider`를 구현합니다.
4. 최근 거래 데이터를 요약해 `priceTrendSummary`, `demandSignal`, `supplySignal`, `keyChanges`를 생성합니다.
5. `createRealEstateProvider`가 `mock`와 `molit`를 선택할 수 있게 확장합니다.
6. README와 `.env.example`에 설정 방법과 지원 범위를 문서화합니다.
7. provider 단위 테스트를 추가하고 `lint`, `typecheck`, `test`를 실행합니다.

## 리스크

- 국토교통부 API는 XML 응답이라 태그 이름 차이에 민감할 수 있습니다.
- 기본 요청 파라미터 문서에는 페이징 정보가 최소로만 노출되어 있어 일부 응답 필드는 추론이 포함될 수 있습니다.
- 자유 입력 지역명을 전부 자동 해석하지 못하므로, 지원하지 않는 이름은 실패 처리해야 합니다.
- 실거래가 데이터는 공급량 자체를 직접 제공하지 않으므로 공급 시그널은 거래 건수와 거래된 단지 수를 이용한 보수적 요약으로 제한됩니다.

## 검증 방법

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- 수동 확인
  - `REAL_ESTATE_PROVIDER=mock`에서 기존 결과가 유지되는지 확인
  - `REAL_ESTATE_PROVIDER=molit`이고 `MOLIT_API_KEY`가 없을 때 명확한 에러가 발생하는지 확인
  - `REAL_ESTATE_PROVIDER=molit`에서 지원 지역/주택 타입 조합이 공통 결과 형태로 정규화되는지 확인

## 결과물

- `docs/execplans/step-10-real-estate-provider.md`
- `docs/steps/bootstrap-step-10-real-estate-provider.md`
- 확장된 `src/lib/providers/real-estate.ts`
- 필요 시 provider 공용 유틸리티 보강
- 부동산 provider 테스트 및 문서 갱신
