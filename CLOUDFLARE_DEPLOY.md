# 🚀 Cloudflare Pages 배포 가이드

## ✅ 해결된 문제들

이 프로젝트는 다음 문제들을 해결했습니다:

1. ✅ **Import Map 제거**: ESM.sh import map을 제거하여 Vite 번들과의 충돌 해결
2. ✅ **React 버전 호환성**: React 19 → React 18로 다운그레이드 (react-beautiful-dnd 호환)
3. ✅ **Vite 빌드 설정**: base path 및 빌드 옵션 최적화
4. ✅ **정적 파일 경로**: 올바른 asset 경로 설정

---

## 📋 Cloudflare Pages 배포 설정

### 1️⃣ Cloudflare Pages 대시보드 설정

1. **Cloudflare Pages** 접속: https://pages.cloudflare.com/
2. **Create a project** 클릭
3. **Connect to Git** 선택 (GitHub, GitLab 등)
4. 저장소 선택 후 다음 설정 입력:

#### 빌드 설정
```
프레임워크 프리셋: Vite
빌드 명령어: npm run build
빌드 출력 디렉토리: dist
Node.js 버전: 18 이상
```

#### 환경 변수 (선택사항)
```
GEMINI_API_KEY: (필요한 경우 입력)
```

### 2️⃣ Git에 푸시

```bash
git add .
git commit -m "Fix: Cloudflare Pages 배포 설정"
git push origin main
```

### 3️⃣ 자동 배포

- Git에 푸시하면 Cloudflare Pages가 자동으로 빌드 및 배포를 시작합니다
- 배포 상태는 Cloudflare Pages 대시보드에서 확인 가능

---

## 🔧 로컬 테스트

배포 전 로컬에서 빌드를 테스트하세요:

```bash
# 빌드
npm run build

# 빌드된 파일 미리보기
npm run preview
```

미리보기 서버: http://localhost:4173

---

## 🐛 문제 해결

### 흰 화면이 나타나는 경우

1. **브라우저 콘솔 확인**
   - F12 → Console 탭에서 에러 확인
   
2. **일반적인 원인**
   - ❌ Import map 충돌 → ✅ 제거됨
   - ❌ React 버전 불일치 → ✅ React 18로 수정
   - ❌ 잘못된 base path → ✅ '/'로 설정됨
   
3. **캐시 삭제**
   - Ctrl + Shift + R (하드 리프레시)
   - 브라우저 캐시 완전 삭제

### 빌드 실패 시

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install

# 다시 빌드
npm run build
```

---

## 📊 빌드 결과

현재 빌드 크기:
- `index.html`: 0.78 kB (gzip: 0.44 kB)
- `assets/index-*.js`: ~760 kB (gzip: ~200 kB)

⚠️ **참고**: 번들 크기가 큰 이유는 Firebase와 react-beautiful-dnd 때문입니다.

---

## 🎯 배포 후 확인 사항

✅ 페이지가 정상적으로 로드되는지 확인
✅ 미션 추가/수정/삭제 기능 테스트
✅ 드래그 앤 드롭 기능 테스트
✅ 로컬스토리지 저장 확인
✅ 반응형 디자인 확인 (모바일/데스크톱)

---

## 📞 추가 도움말

- Cloudflare Pages 문서: https://developers.cloudflare.com/pages/
- Vite 배포 가이드: https://vitejs.dev/guide/static-deploy.html

---

**마지막 업데이트**: 2026-02-11

