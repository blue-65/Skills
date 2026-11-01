# Scrap Derby (Android 앱)

Three.js로 만든 차량 배틀로얄 게임을 Capacitor 8로 감싼 안드로이드 앱입니다.

```bash
npm ci
npm run sync         # src/index.html → www/ (CDN을 로컬 파일로 교체) → cap sync android
npm run apk:debug    # 디버그 APK
npm run aab:release  # 스토어 업로드용 AAB (android/keystore.properties 필요)
npm run serve        # 브라우저로 www/ 미리보기 (결제·광고는 테스트 모드)
```

- 게임 원본: `src/index.html` (HTML 파일 하나)
- 출시 절차와 할 일 목록: [HANDOFF.md](HANDOFF.md)
- 스토어 문구와 그래픽: [store/](store/)
- 개인정보처리방침: [docs/privacy.html](docs/privacy.html)
