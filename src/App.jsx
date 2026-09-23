import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ school_level: '', place: '' })
  const [selected, setSelected] = useState(null)

  // 활동 목록 불러오기 (필터가 바뀔 때마다 다시 조회)
  useEffect(() => {
    async function loadActivities() {
      setLoading(true)
      let query = supabase.from('activities').select('*').order('created_at')

      if (filters.school_level) query = query.eq('school_level', filters.school_level)
      if (filters.place) query = query.eq('place', filters.place)

      const { data, error } = await query
      if (error) console.error(error)
      else setActivities(data)
      setLoading(false)
    }
    loadActivities()
  }, [filters])

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-top">
          <div>
            <h1>오늘의 체육수업 <span className="badge">연습용</span></h1>
            <p className="subtitle">학교스포츠클럽 · 체육수업 영상 콘텐츠 허브</p>
          </div>
          <div className="stats">
            <span>{activities.length}개 활동</span>
          </div>
        </div>

        <div className="filters">
          <select onChange={(e) => setFilters((f) => ({ ...f, school_level: e.target.value }))}>
            <option value="">학교급 전체</option>
            <option value="초등">초등</option>
            <option value="중등">중등</option>
            <option value="고등">고등</option>
          </select>
          <select onChange={(e) => setFilters((f) => ({ ...f, place: e.target.value }))}>
            <option value="">장소 전체</option>
            <option value="체육관">체육관</option>
            <option value="운동장">운동장</option>
            <option value="교실">교실</option>
          </select>
        </div>
      </header>

      {loading ? (
        <p className="status-text">불러오는 중...</p>
      ) : (
        <div className="grid">
          {activities.map((a) => (
            <div key={a.id} className="card" onClick={() => setSelected(a)}>
              <div className="thumb">
                <span className="play">▶</span>
              </div>
              <div className="card-body">
                <span className="tag">{a.school_level} · {a.place}</span>
                <h3>{a.title}</h3>
                <p className="meta">{a.duration_min}분 · 준비물: {a.equipment || '없음'}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && <p className="status-text">조건에 맞는 활동이 없어요.</p>}
        </div>
      )}

      {selected && (
        <div className="player-modal" onClick={() => setSelected(null)}>
          <div className="player-inner" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.title}</h2>
            <iframe
              width="100%"
              height="360"
              src={`https://www.youtube.com/embed/${selected.youtube_id}?start=${selected.start_sec}&autoplay=1`}
              title={selected.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
            <Comments activityId={selected.id} />
            <button onClick={() => setSelected(null)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}

// 실시간 댓글 컴포넌트: 원래 사이트엔 없던, 이번 연습에서 추가한 기능
function Comments({ activityId }) {
  const [comments, setComments] = useState([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    async function loadComments() {
      const { data } = await supabase
        .from('comments')
        .select('*')
        .eq('activity_id', activityId)
        .order('created_at')
      setComments(data || [])
    }
    loadComments()

    // 실시간 구독: 다른 사람이 댓글을 달면 새로고침 없이 바로 화면에 추가됨
    const channel = supabase
      .channel(`comments-${activityId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `activity_id=eq.${activityId}` },
        (payload) => setComments((prev) => [...prev, payload.new])
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [activityId])

  async function submit(e) {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return
    await supabase.from('comments').insert({ activity_id: activityId, author, content })
    setContent('')
  }

  return (
    <div className="comments">
      <h3>실시간 댓글</h3>
      <ul>
        {comments.map((c) => (
          <li key={c.id}><strong>{c.author}</strong>: {c.content}</li>
        ))}
        {comments.length === 0 && <li className="empty">아직 댓글이 없어요.</li>}
      </ul>
      <form onSubmit={submit}>
        <input placeholder="이름" value={author} onChange={(e) => setAuthor(e.target.value)} />
        <input placeholder="댓글 입력" value={content} onChange={(e) => setContent(e.target.value)} />
        <button type="submit">등록</button>
      </form>
    </div>
  )
}

export default App
