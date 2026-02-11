# Firebase 환경 변수 설정 가이드

## 문제 해결
`Cannot read properties of null (reading 'store')` 에러는 Firebase가 제대로 초기화되지 않아서 발생합니다.

## 해결 방법

### 1. 로컬 개발 환경 설정

1. `.env.example` 파일을 복사하여 `.env` 파일 생성:
   ```bash
   cp .env.example .env
   ```

2. Firebase 콘솔에서 프로젝트 설정 가져오기:
   - https://console.firebase.google.com/ 접속
   - 프로젝트 선택
   - 프로젝트 설정 → 일반 → 내 앱 → SDK 설정 및 구성

3. `.env` 파일에 실제 Firebase 값 입력:
   ```
   VITE_FIREBASE_API_KEY=실제-API-키
   VITE_FIREBASE_AUTH_DOMAIN=프로젝트-ID.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=프로젝트-ID
   VITE_FIREBASE_STORAGE_BUCKET=프로젝트-ID.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=실제-메시징-센더-ID
   VITE_FIREBASE_APP_ID=실제-앱-ID
   ```

### 2. Cloudflare Pages 배포 설정

Cloudflare Pages 대시보드에서 환경 변수를 설정해야 합니다:

1. Cloudflare Pages 프로젝트 페이지 접속
2. **Settings** → **Environment variables** 클릭
3. **Production** 탭에서 다음 변수들을 추가:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

4. **Save** 클릭 후 재배포

### 3. Tailwind CSS 프로덕션 경고 해결

현재 CDN 방식으로 Tailwind를 사용하고 있어 경고가 발생합니다. 
프로덕션에서는 PostCSS 플러그인 방식을 사용하는 것이 권장됩니다.

#### 옵션 1: Tailwind CSS 제거 (현재 사용 안 함)
`index.html`에서 Tailwind CDN 링크 제거

#### 옵션 2: Tailwind CSS 설치 (필요한 경우)
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 배포 체크리스트

- [ ] `.env` 파일 생성 및 Firebase 설정 입력
- [ ] 로컬에서 `npm run dev` 실행하여 정상 작동 확인
- [ ] Cloudflare Pages에 환경 변수 설정
- [ ] 재배포 후 확인

## 참고사항

- `.env` 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)
- 환경 변수는 빌드 시점에 코드에 포함됩니다
- 환경 변수 변경 후에는 재빌드가 필요합니다
