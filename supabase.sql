-- Supabase 프로젝트의 SQL Editor에 이 내용을 통째로 붙여넣고 "Run" 누르면
-- 테이블 생성 + 실시간 댓글 기능 켜기 + 샘플 데이터 3개까지 한 번에 끝납니다.

-- 1) 영상 활동 테이블
create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_id text not null,       -- 유튜브 영상 ID (예: 주소의 v= 뒤 부분)
  start_sec integer not null default 0,   -- 활동 시작 시간(초)
  end_sec integer,                 -- 활동 종료 시간(초, 없으면 끝까지)
  school_level text not null,      -- 초등/중등/고등
  place text not null,             -- 체육관/운동장/교실 등
  equipment text,                  -- 준비물
  duration_min integer,            -- 소요 시간(분)
  created_at timestamptz default now()
);

-- 2) 댓글 테이블
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references activities(id) on delete cascade,
  author text not null,
  content text not null,
  created_at timestamptz default now()
);

-- 3) 실시간 기능 켜기 (댓글이 달리면 다른 화면에 즉시 반영되도록)
alter publication supabase_realtime add table comments;

-- 4) 보안 설정: 일단 연습용이라 누구나 읽기/쓰기 가능하게 열어둡니다.
--    나중에 실제 운영할 때는 이 부분을 로그인한 사용자만 쓰게 좁혀야 합니다.
alter table activities enable row level security;
alter table comments enable row level security;

create policy "누구나 활동 조회 가능" on activities for select using (true);
create policy "누구나 댓글 조회 가능" on comments for select using (true);
create policy "누구나 댓글 작성 가능" on comments for insert with check (true);

-- 5) 연습용 샘플 데이터
insert into activities (title, youtube_id, start_sec, end_sec, school_level, place, equipment, duration_min)
values
  ('타바타 준비운동', 'dQw4w9WgXcQ', 0, 180, '중등', '체육관', '없음', 3),
  ('뉴스포츠: 플로어볼 기초', 'dQw4w9WgXcQ', 180, 480, '중등', '체육관', '플로어볼 스틱', 5),
  ('요가매트 스트레칭', 'dQw4w9WgXcQ', 480, 720, '초등', '교실', '요가매트', 4);
