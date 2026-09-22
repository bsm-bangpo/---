# 오늘의 체육수업 (연습용 클론)

letsgritpe.netlify.app을 참고해서 만든 연습용 프로젝트입니다.
영상 필터 검색 + 클릭 시 해당 구간부터 재생 + **실시간 댓글**(원본엔 없던 기능) 을 담았습니다.

## 실행 전 꼭 해야 할 것: Supabase 연결

1. [supabase.com](https://supabase.com) 에서 새 프로젝트를 만듭니다.
2. 왼쪽 메뉴 **SQL Editor** 로 들어가서, 이 프로젝트의 `supabase.sql` 파일 내용을 통째로 붙여넣고 **Run** 을 누릅니다.
   → 테이블 2개(activities, comments)와 샘플 데이터 3개가 자동으로 생성됩니다.
3. 왼쪽 메뉴 **Settings > API** 에서 `Project URL` 과 `anon public` 키를 복사합니다.
4. 이 프로젝트 폴더에 `.env.example` 파일을 복사해서 `.env` 라는 이름으로 저장하고, 방금 복사한 값을 붙여넣습니다.

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOि....
```

## 내 컴퓨터에서 실행해보기

```
npm install
npm run dev
```

터미널에 나오는 주소(보통 http://localhost:5173)를 브라우저에서 열면 됩니다.
카드를 클릭하면 영상이 뜨고, 댓글을 달면 실시간으로 반영되는지 확인해보세요
(브라우저 창을 2개 띄워서 하나에 댓글을 달면 다른 창에도 바로 뜨는지 테스트해보면 재밌어요).

## 실제 영상으로 바꾸기

`supabase.sql` 안 샘플 데이터는 테스트용 영상(youtube_id: dQw4w9WgXcQ)입니다.
Supabase 대시보드의 **Table Editor > activities** 에서 직접 행을 수정하거나 추가하면
내가 가진 실제 체육수업 영상으로 바꿀 수 있습니다. (youtube_id는 유튜브 주소의 `v=` 뒤에 오는 부분)

## Netlify에 배포하기

1. 이 폴더를 GitHub 저장소로 올립니다 (GitHub Desktop을 쓰면 클릭만으로 가능).
2. [netlify.com](https://netlify.com) 에서 **Add new site > Import an existing project** 로 그 저장소를 선택합니다.
3. Build command는 자동으로 `npm run build`, Publish directory는 `dist` 로 잡힙니다 (netlify.toml에 이미 설정되어 있음).
4. **Site settings > Environment variables** 에 `.env` 에 넣었던 두 값을 그대로 등록합니다.
5. Deploy 누르면 몇 분 뒤 실제 주소(예: your-site.netlify.app)가 생깁니다.
