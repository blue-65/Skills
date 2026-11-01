# Scrap Derby

Three.js 차량 기반 io 게임. 파일 하나(`index.html`), 빌드 없음.

- 고철(노란 육각 너트)을 모으면 적재량(kg)이 늘고 차가 커집니다. 무거울수록 박는 힘이 세고 덜 밀립니다.
- 정면 범퍼로 박으면 받는 피해 70% 감소. 상대 옆구리를 찍으면 넉백과 스턴이 걸립니다.
- 아레나 밖으로 떨어지거나 차체 내구도가 0이 되면 탈락. 마지막에 들이받은 차가 격파 보너스를 가져갑니다.
- 봇 14대가 고철 수집, 추격, 도주, 가장자리 회피 AI로 움직입니다 (싱글플레이, 서버 없음).

## 조작

| 입력 | 동작 |
| --- | --- |
| `W A S D` / 방향키 | 누른 방향으로 주행 (화면 기준) |
| `Space` | 니트로 부스트 |
| `Shift` | 드리프트 (미끄러지는 동안 니트로 충전) |
| 마우스 왼쪽 누르기 | 커서 쪽으로 주행 (오른쪽 버튼 = 니트로) |
| 터치 | 왼쪽 드래그 조이스틱, 오른쪽 니트로/드리프트 버튼 |
| `M` | 소리 켜기/끄기 |

## 실행

```bash
npx serve games/scrap-derby   # 또는 index.html을 브라우저로 바로 열기
```

Three.js r128은 cdnjs에서, 폰트는 Google Fonts에서 불러옵니다.

## 튜닝 포인트

`index.html` 상단 상수: `ARENA_R`(아레나 반지름), `BOT_COUNT`, `BASE_SCRAP`, `SCRAP_KG`.
충돌 피해는 `collideCars()`, 주행 감각은 `driveCar()`(grip, turnRate, maxV), 봇 성향은 `createCar()`의 `ai.aggro / caution / playerBias`.
