# Scrap Derby 앱 출시 작업 인계서

목표: 새 GitHub 레포로 옮기기 → Capacitor 안드로이드 빌드 → Google Play Console 등록 → 내부 테스트 시작.

작업을 셋으로 나눴습니다.
- **A. 이미 끝난 것**: 클라우드 세션(Claude)이 해 둔 작업
- **B. 로컬 Claude Code에 맡길 것**: 내 PC에서 명령으로 할 수 있는 작업. 아래 프롬프트를 붙여넣으면 됩니다.
- **C. 직접 해야 하는 것**: 계정, 결제, 법적 동의, 콘솔 화면 조작

---

## A. 이미 끝난 것

| 항목 | 위치 |
| --- | --- |
| Capacitor 8 프로젝트 (안드로이드 플랫폼 추가 완료, compile/target SDK 36, min SDK 24) | `package.json`, `capacitor.config.json`, `android/` |
| 오프라인 빌드: three.js와 폰트를 CDN 대신 로컬 파일로 묶음 | `scripts/build-web.mjs` → `www/` |
| 게임 소스 (이제 이 레포가 원본) | `src/index.html` |
| Google Play 결제 연동 (cordova-plugin-purchase 13, 상품 7종, 소모성/비소모성 구분, 재설치 시 비소모성 복원) | `src/index.html`의 `initBilling()` |
| AdMob 전면 광고 연동 (@capacitor-community/admob 8, 동의 화면 요청, 로드 실패 시 결과 화면을 막지 않음). 지금은 **Google 공개 테스트 ID** 사용 | `src/index.html`의 `ADMOB`, `AndroidManifest.xml`의 `APPLICATION_ID` |
| 안드로이드 설정: 세로 고정, 진동 권한, 뒤로가기 버튼 처리, 릴리스 서명 설정(keystore.properties 사용) | `android/app/src/main/AndroidManifest.xml`, `android/app/build.gradle` |
| 앱 아이콘(적응형 포함)과 스플래시 74종 | `assets/` 원본, `android/app/src/main/res/` 생성본 |
| 스토어 그래픽: 아이콘 512, 그래픽 이미지 1024×500, 스크린샷 1080×1920 6장 | `store/` |
| 스토어 문구, 인앱 상품 표, 앱 콘텐츠 설문 답변 초안 | `store/listing.md` |
| 개인정보처리방침 초안 | `docs/privacy.html` |

브라우저에서는 결제와 광고가 테스트 모드로 동작하고, 앱(Capacitor)에서는 실제 플러그인이 자동으로 쓰입니다.

**아직 확인하지 못한 것**: 클라우드 환경에서는 Android SDK를 받을 수 없어서 **Gradle 빌드와 실기기 테스트를 한 번도 못 했습니다.** 그래서 B-4가 첫 빌드이고, 여기서 나오는 오류는 로컬에서 고쳐야 합니다.

---

## B. 로컬 Claude Code에 맡길 것

### 준비물 (로컬 PC)
- Node 20 이상, Git, GitHub CLI(`gh auth login` 완료)
- JDK 21, Android Studio (SDK Platform 36, Build-Tools, Platform-Tools)와 `ANDROID_HOME` 설정
- 안드로이드 폰(USB 디버깅 켜기) 또는 에뮬레이터

### 붙여넣을 프롬프트

```text
https://github.com/blue-65/Skills 의 ccr-39217703-3hctbo 브랜치에 있는 games/scrap-derby-app 폴더를
독립된 새 GitHub 레포로 옮기고, 안드로이드 빌드와 기기 테스트까지 진행해줘.
games/scrap-derby-app/HANDOFF.md 의 "B. 로컬 Claude Code에 맡길 것" 단계를 순서대로 따라줘.
- 레포 이름: scrap-derby (비공개)
- 패키지 이름(applicationId): <여기에 결정한 값, 예: com.내도메인.scrapderby>
- 키스토어 비밀번호는 나한테 직접 물어보고, 파일이나 커밋에 절대 남기지 마.
각 단계가 끝날 때마다 체크리스트 결과를 보고하고, 빌드 오류가 나면 원인과 수정 내용을 알려줘.
```

### 단계

**B-1. 새 레포로 옮기기**
```bash
git clone --branch ccr-39217703-3hctbo --depth 1 https://github.com/blue-65/Skills.git /tmp/skills-src
cp -r /tmp/skills-src/games/scrap-derby-app ~/scrap-derby
cd ~/scrap-derby && git init -b main && git add -A && git commit -m "Initial import: Scrap Derby Capacitor app"
gh repo create scrap-derby --private --source=. --remote=origin --push
```
확인: `node_modules/`, `www/`, `*.jks`, `keystore.properties`가 커밋에 들어가지 않았는지 (`.gitignore`).

**B-2. 패키지 이름 바꾸기** (기본값 `com.scrapderby.game`. **첫 업로드 후에는 영영 못 바꿉니다**)
- `capacitor.config.json` → `appId`
- `android/app/build.gradle` → `namespace`, `applicationId`
- `android/app/src/main/java/com/scrapderby/game/MainActivity.java`를 새 패키지 경로로 옮기고 `package` 선언 수정
- `android/app/src/main/res/values/strings.xml` → `package_name`, `custom_url_scheme`

**B-3. 의존성과 웹 빌드**
```bash
npm ci
npm run sync        # www/ 빌드 + cap sync android
```
확인: `www/index.html`에 `cdnjs`나 `fonts.googleapis`가 없어야 함 (빌드 스크립트가 남아 있으면 실패 처리함).

**B-4. 디버그 빌드와 기기 테스트**
```bash
npm run apk:debug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```
기기에서 확인할 것:
- [ ] 비행기 모드에서도 실행되고 한글 폰트와 3D 화면이 정상 (오프라인 번들 확인)
- [ ] 세로로 고정되고, 기기를 돌려도 화면이 돌아가지 않음
- [ ] 조이스틱, 니트로, 드리프트 터치 반응. 진동 동작
- [ ] 한 판 끝나면 AdMob **테스트 광고**("Test Ad" 표시)가 뜨고, 닫으면 결과 화면
- [ ] 상점의 가격이 "테스트 모드" 문구 없이 표시됨 (결제 상품은 C-5 이후에 실제로 불러와짐)
- [ ] 뒤로가기: 상점·확인 창 닫기 → 결과 화면에서 차고로 → 메인에서 앱 종료
- [ ] `adb logcat | grep -i -E "capacitor|admob|billing|chromium"` 에 반복되는 오류가 없음

**B-5. 업로드 키 만들기** (비밀번호는 사용자에게 받기)
```bash
keytool -genkeypair -v -keystore ~/scrap-derby-upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
cp android/keystore.properties.example android/keystore.properties   # 경로와 비밀번호 채우기, 커밋 금지
```
`.jks` 파일과 비밀번호는 레포 밖 안전한 곳(비밀번호 관리자 등)에 백업하라고 사용자에게 안내.

**B-6. 릴리스 AAB 빌드**
```bash
npm run aab:release
# 결과: android/app/build/outputs/bundle/release/app-release.aab
```
다시 올릴 때마다 `android/app/build.gradle`의 `versionCode`를 1씩 올리기.

**B-7. 개인정보처리방침 공개** (GitHub Pages)
- 레포 Settings → Pages에서 `main` 브랜치의 `/docs`를 공개하거나 `gh api`로 설정
- `docs/privacy.html`의 `[개발자 이름]`, `[이메일]`, 시행일을 사용자에게 받아서 채우기
- 결과 URL(`https://<계정>.github.io/scrap-derby/privacy.html`)을 사용자에게 전달

**B-8. 실제 광고 ID로 교체** (C-6에서 사용자가 ID를 받은 뒤)
- `src/index.html` → `ADMOB.interstitial`을 실제 광고 단위 ID로, `testing: false`
- `AndroidManifest.xml` → `com.google.android.gms.ads.APPLICATION_ID`를 실제 앱 ID로
- 내부 테스트 중에는 테스트 ID를 유지하거나 테스트 기기를 등록할 것 (자기 광고를 누르면 AdMob 계정이 정지될 수 있음)

---

## C. 직접 해야 하는 것

| # | 할 일 | 메모 |
| --- | --- | --- |
| C-1 | **패키지 이름 결정** | 예: `com.내도메인.scrapderby`. 영구적이니 B-2 전에 정하기 |
| C-2 | **Play Console 개발자 계정** 만들기 | 등록비 $25, 신원 확인. 인앱 판매를 하려면 결제 프로필(판매자 계정)도 설정 |
| C-3 | 콘솔에서 **앱 만들기** | 이름·언어·게임·무료 선택, 정책 동의 |
| C-4 | **스토어 등록정보와 앱 콘텐츠** 입력 | `store/listing.md` 문구와 그래픽 사용. 개인정보처리방침 URL(B-7), 광고 포함, 타겟 연령, IARC 등급 설문, 데이터 보안, 광고 ID |
| C-5 | **내부 테스트** 시작 | 테스트 → 내부 테스트 → 새 버전에 `app-release.aab` 업로드 (Play 앱 서명 사용). 테스터 이메일 등록 후 참여 링크 공유 |
| C-6 | **인앱 상품 7개 만들기** | AAB를 한 번 올린 뒤 수익 창출 → 인앱 상품. ID는 `store/listing.md` 표와 정확히 같게, 활성화. 설정 → 라이선스 테스트에 테스터 계정을 넣으면 실제 결제 없이 테스트 구매 가능 |
| C-7 | **AdMob** 계정, 앱, 전면 광고 단위 만들기 | 받은 앱 ID와 광고 단위 ID를 로컬 에이전트에 전달(B-8). 스토어 등록정보에 웹사이트를 넣었다면 app-ads.txt도 올리기 |
| C-8 | 프로덕션 출시 전 **비공개 테스트** | 2023년 11월 이후 만든 개인 계정은 프로덕션 신청 전에 테스터 12명 이상이 14일 연속 참여한 비공개 테스트가 필요합니다. 최신 조건은 콘솔 안내를 확인하세요 |

---

## 참고: 코드 위치

| 바꿀 것 | 위치 |
| --- | --- |
| 상품 ID, 가격, 구성 | `src/index.html`의 `PRODUCTS` (스토어에 표시되는 가격은 콘솔 가격이 우선) |
| 광고 ID, 테스트 여부 | `src/index.html`의 `ADMOB`, `AndroidManifest.xml` |
| 차량, 맵, 난이도, 코인 수치 | `src/index.html`의 `VEHICLES`, `THEMES`, `stageDef()`, `finishMatch()` |
| 앱 이름, 패키지 이름 | `capacitor.config.json`, `android/app/build.gradle`, `strings.xml` |
| 아이콘, 스플래시 | `assets/`를 고친 뒤 `npx capacitor-assets generate --android --iconBackgroundColor '#101217' --splashBackgroundColor '#101217'` |
