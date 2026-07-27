# Office Agent Skills

이 포크는 Word, PowerPoint, Excel 산출물을 만들고 편집하고 검증하기 위한
Agent Skills 배포본을 제공합니다.

[MengTo/Skills](https://github.com/MengTo/Skills)의 원본 121개 스킬, 데모,
자산과 MIT 라이선스는 그대로 보존합니다. Office용 결과물은
[`dist/office-skills`](dist/office-skills)에 별도로 생성하므로 원본의 계보를
확인하면서도 설치 대상에는 웹 및 게임 런타임을 섞지 않습니다.

## Office 배포본

| 분류 | 수 | 주요 용도 |
|---|---:|---|
| Common | 12 | 라우팅, 템플릿, 출처, 검증, 접근성, 전달 |
| Word | 14 | 보고서, 제안서, RFP, SOP, 양식, 장문, 리뷰 |
| PowerPoint | 22 | 스토리, 피치, 데이터, 레이아웃, Morph, QA |
| Excel | 16 | 수식, 재무, 예산, 대시보드, 피벗, 검산 |

설치 가능한 스킬은 총 64개입니다. 전체 목록은
[`dist/office-skills/CATALOG.md`](dist/office-skills/CATALOG.md)에 있습니다.
형식이 불분명한 요청은
[`route-office-task`](dist/office-skills/agent-skills/common/route-office-task/SKILL.md)부터
시작합니다.

## 설계 원칙

1. 사용자의 요청, 제공된 원본과 템플릿, 대상 프로젝트의 디자인 시스템을
   저장소 기본값보다 우선합니다.
2. Word는 장문 설명과 기록, PowerPoint는 발표와 의사결정, Excel은 계산과
   반복 갱신을 담당합니다.
3. 기존 파일의 네이티브 스타일, 마스터, 레이아웃, 수식과 차트를 보존하고
   최종 결과도 계속 편집할 수 있게 만듭니다.
4. 주장, 수치, 이미지와 로고에는 출처와 기준일을 남깁니다.
5. 저장 성공만으로 완료하지 않습니다. 저장 후 재열기, 구조 검사, 전체
   렌더링과 시각 검수를 각각 수행합니다.
6. 필수 검증을 실행하지 못한 결과는 `PASS`가 아니라 `INCONCLUSIVE`입니다.

공통 기준은
[`references/office-output-contract.md`](references/office-output-contract.md),
시각 기준은 [`DESIGN.md`](DESIGN.md)에 있습니다.

## 저장소 구조

```text
agent-skills/                    원본 121개 스킬
office-adaptation/source-map.mjs 원본 전체의 Office 처리 원장
scripts/skill-catalog.mjs        Office 스킬의 단일 정의 원본
references/                      공통 및 형식별 제작 계약
dist/office-skills/              설치 가능한 결정적 생성물
```

원본의 모든 `SKILL.md`는 `SOURCE_MAP.json`에 한 번씩 기록됩니다.
Office에 직접 적용할 원리는 `adapt`, 런타임 구현을 그대로 옮기지 않고
참고 자료로만 유지할 항목은 `preserve-reference`로 구분합니다.

## 빌드와 검증

빌드와 OOXML scanner는 Node.js 22와 Python 3.12 표준 라이브러리만
사용합니다. Draft 2020-12 evidence 검증에는 고정된 `jsonschema` 버전을
설치합니다.

```powershell
python -m pip install -r scripts/requirements-validation.txt
node scripts/build-office-skills.mjs
node scripts/validate-office-skills.mjs
python scripts/validate_ooxml.py --self-test
python scripts/scan_office.py --self-test
python scripts/validate_evidence_report.py --self-test
```

빌드는 `dist/office-skills`만 교체하며 원본 스킬에는 손대지 않습니다.
GitHub Actions는 같은 명령을 실행하고 생성물의 변경 여부도 확인합니다.

이 배포본은 Office 제작 워크플로와 검증 계약을 제공하며, Word, PowerPoint,
Excel의 범용 콘텐츠 생성 엔진을 대신하지 않습니다. 설치된 Artifact runtime
또는 Windows desktop Office가 필요합니다. 배포본에는 실행 가능 여부를
확인하는 `office_preflight.ps1`, Office 기반 export를 수행하는
`export_office.ps1`, 결정적 정적 검사를 수행하는 `scan_office.py`를 함께
포함합니다. Evidence report는 `validate_evidence_report.py`가 업무별 의미
불변조건까지 검사합니다.

정적 검사는 실제 Office 애플리케이션의 페이지네이션, PowerPoint 애니메이션,
Excel 재계산 결과를 완전히 증명하지 못합니다. 해당 기능은 산출물 제작
환경에서 Word, PowerPoint, Excel로 다시 열어 확인해야 합니다.

## 기여 규칙

작업 전 [`AGENTS.md`](AGENTS.md)를 읽어야 합니다. 생성된
`dist/office-skills`를 직접 편집하지 말고, 카탈로그와 참조 계약을 바꾼 뒤
다시 빌드합니다. 개인 경로, 비밀값, 비공개 원문, 검증되지 않은 기능 주장은
저장소에 넣지 않습니다.

## 라이선스와 출처

- 원본 저장소: [MengTo/Skills](https://github.com/MengTo/Skills)
- 원본 기준 커밋: `21b278c62f49f3ce3d8c8ecbcc84cbcd534f3e49`
- 라이선스: [MIT](LICENSE)
- 공개 기술 근거: [`references/external-references.md`](references/external-references.md)
