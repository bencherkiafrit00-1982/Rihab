import React, { useState, useEffect, useRef } from 'react';
import { UserStats } from '../types';
import { playSound } from '../utils/soundEffects';
import { speakEnglish } from '../utils/speech';
import confetti from 'canvas-confetti';
import { 
  Users, Swords, Trophy, Send, MessageCircle, 
  Crown, Sparkles, Zap, ArrowRight, Copy, Check, 
  Clock, Volume2, ShieldCheck, Flame, Star, 
  Radio, RefreshCw, X, Award, Play
} from 'lucide-react';
import nadjibImg from '../assets/images/nadjib_mascot_icon_1790341480456.jpg';
import rehabImg from '../assets/images/rehab_lifelike_icon_1790342975456.jpg';

export interface MultiplayerArenaProps {
  userStats: UserStats;
  onAwardXp: (xp: number, gems: number) => void;
  onReturnToPath: () => void;
  currentMascot?: 'nadjib' | 'rehab';
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  wilaya: string;
  score: number;
  streak: number;
  correctAnswersCount: number;
  isReady: boolean;
  isHost: boolean;
  hasAnsweredCurrent: boolean;
  lastSelectedAnswerId?: string;
  lastAnswerIsCorrect?: boolean;
  isBot?: boolean;
}

interface ChatMsg {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  wilaya: string;
  text: string;
  timestamp: number;
  isQuickReaction?: boolean;
}

interface Question {
  id: string;
  unitNumber: number;
  category: string;
  questionAr: string;
  questionEn: string;
  options: { id: string; text: string; emoji?: string; ar?: string }[];
  correctAnswerId?: string;
  explanationAr?: string;
  timeLimitSec: number;
}

interface RoomSummary {
  id: string;
  code: string;
  title: string;
  unitName: string;
  status: 'waiting' | 'countdown' | 'in_round' | 'question_review' | 'podium';
  playerCount: number;
  maxPlayers: number;
}

interface RoomDetail {
  id: string;
  code: string;
  title: string;
  unitName: string;
  status: 'waiting' | 'countdown' | 'in_round' | 'question_review' | 'podium';
  hostId: string;
  players: Player[];
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion?: Question;
  roundTimeLeft: number;
  chatMessages: ChatMsg[];
  maxPlayers: number;
}

const ALGERIAN_WILAYAS = [
  'الجزائر العاصمة', 'وهران', 'قسنطينة', 'سطيف', 'الشلف', 'عنابة', 'تلمسان', 
  'باتنة', 'البليدة', 'تيزي وزو', 'بجاية', 'غرداية', 'بسكرة', 'سكيكدة', 
  'جيجل', 'مستغانم', 'برج بوعريريج', 'المسيلة', 'ورقلة', 'أدرار', 'بشار',
  'سيدي بلعباس', 'معسكر', 'الأغواط', 'الوادي', 'خنشلة', 'تيبازة', 'بومرداس'
];

const AVATAR_OPTIONS = ['👦🏻', '👧🏻', '🦊', '🦅', '🦁', '🌟', '🚀', '⚡'];

const QUICK_CHAT_OPTIONS = [
  '👏 أحسنت يا بطل!',
  '⚡ سأجيب أسرع في السؤال القادم!',
  '🇩🇿 تحيا الجزائر وأبطالها!',
  '💡 سؤال ذكي وممتع!',
  '🔥 المنافسة حماسية جداً!',
  '🎯 بالتوفيق لجميع الزملاء!'
];

export const MultiplayerArena: React.FC<MultiplayerArenaProps> = ({
  userStats,
  onAwardXp,
  onReturnToPath,
  currentMascot = 'nadjib',
}) => {
  // Player local profile state
  const [playerName, setPlayerName] = useState(userStats.name || 'بطل 4PS');
  const [playerAvatar, setPlayerAvatar] = useState(currentMascot === 'nadjib' ? '👦🏻' : '👧🏻');
  const [playerWilaya, setPlayerWilaya] = useState('الجزائر العاصمة');
  const [myPlayerId] = useState(() => 'pupil-' + Math.random().toString(36).substring(2, 9));

  // WebSocket connection & rooms state
  const [isConnected, setIsConnected] = useState(false);
  const [roomsList, setRoomsList] = useState<RoomSummary[]>([]);
  const [activeRoom, setActiveRoom] = useState<RoomDetail | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Match interaction state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('تحدي أذكياء الرابعة ابتدائي');
  const [newRoomTopic, setNewRoomTopic] = useState('منهاج الإنجليزية 4PS');
  const [awardedPodium, setAwardedPodium] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Connect WebSocket
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: NodeJS.Timeout;

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setErrorMessage('');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleServerMessage(msg);
        } catch (e) {
          console.error('Error handling WS message:', e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  // Auto-scroll chat messages
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoom?.chatMessages]);

  // Handle incoming server events
  const handleServerMessage = (msg: any) => {
    switch (msg.type) {
      case 'rooms:list':
        setRoomsList(msg.rooms || []);
        break;

      case 'room:joined':
        setActiveRoom(msg.room);
        setSelectedOptionId(null);
        setAwardedPodium(false);
        playSound.click();
        break;

      case 'room:updated':
        setActiveRoom(msg.room);
        break;

      case 'game:countdown':
        setActiveRoom(msg.room);
        playSound.click();
        break;

      case 'question:start':
        setActiveRoom(msg.room);
        setSelectedOptionId(null);
        playSound.click();
        if (msg.room?.currentQuestion?.questionEn) {
          speakEnglish(msg.room.currentQuestion.questionEn, 0.9);
        }
        break;

      case 'timer:tick':
        setActiveRoom(prev => prev ? { ...prev, roundTimeLeft: msg.timeLeft } : null);
        break;

      case 'player:answered':
        setActiveRoom(msg.room);
        break;

      case 'question:review':
        setActiveRoom(msg.room);
        if (msg.correctAnswerId === selectedOptionId) {
          playSound.correct();
        } else {
          playSound.wrong();
        }
        break;

      case 'game:podium':
        setActiveRoom(msg.room);
        playSound.fanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });

        // Award XP and Gems to the user based on rank
        if (!awardedPodium) {
          setAwardedPodium(true);
          const myPlayer = msg.room.players.find((p: Player) => p.id === myPlayerId);
          const myRank = msg.room.players.findIndex((p: Player) => p.id === myPlayerId) + 1;
          if (myRank === 1) onAwardXp(60, 20);
          else if (myRank === 2) onAwardXp(40, 15);
          else if (myRank === 3) onAwardXp(30, 10);
          else onAwardXp(20, 5);
        }
        break;

      case 'chat:new_message':
        setActiveRoom(prev => {
          if (!prev) return null;
          return {
            ...prev,
            chatMessages: [...prev.chatMessages, msg.message],
          };
        });
        playSound.click();
        break;

      case 'error':
        setErrorMessage(msg.message || 'حدث خطأ في الاتصال');
        playSound.wrong();
        break;
    }
  };

  // Actions
  const handleJoinRoom = (roomId?: string, roomCode?: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    setErrorMessage('');
    wsRef.current.send(JSON.stringify({
      type: 'room:join',
      roomId,
      roomCode: roomCode || joinCodeInput.trim(),
      player: {
        id: myPlayerId,
        name: playerName,
        avatar: playerAvatar,
        wilaya: playerWilaya,
      }
    }));
  };

  const handleCreateRoom = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    setShowCreateModal(false);
    wsRef.current.send(JSON.stringify({
      type: 'room:create',
      title: newRoomTitle,
      unitName: newRoomTopic,
      questionCount: 5,
      player: {
        id: myPlayerId,
        name: playerName,
        avatar: playerAvatar,
        wilaya: playerWilaya,
      }
    }));
  };

  const handleToggleReady = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    playSound.click();
    wsRef.current.send(JSON.stringify({ type: 'player:ready' }));
  };

  const handleStartGame = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    playSound.fanfare();
    wsRef.current.send(JSON.stringify({ type: 'game:start' }));
  };

  const handleSubmitAnswer = (optionId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (selectedOptionId || activeRoom?.status !== 'in_round') return;
    setSelectedOptionId(optionId);
    playSound.click();
    wsRef.current.send(JSON.stringify({
      type: 'answer:submit',
      optionId,
    }));
  };

  const handleSendChat = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({
      type: 'chat:send',
      text: text.trim(),
      isQuickReaction: !!textToSend,
    }));
    if (!textToSend) setChatInput('');
  };

  const handleLeaveRoom = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'room:leave' }));
    }
    setActiveRoom(null);
    setSelectedOptionId(null);
    playSound.click();
  };

  const handleCopyCode = () => {
    if (activeRoom?.code) {
      navigator.clipboard.writeText(activeRoom.code);
      setIsCopiedCode(true);
      playSound.click();
      setTimeout(() => setIsCopiedCode(false), 2000);
    }
  };

  // Find my player in active room
  const myPlayer = activeRoom?.players.find(p => p.id === myPlayerId);
  const isHost = myPlayer?.isHost;

  return (
    <div className="max-w-6xl mx-auto py-3 sm:py-6 px-2 sm:px-4 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* ARENA HEADER BANNER */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white shadow-xl border-b-4 border-violet-900 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-md border border-white/30 shrink-0">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-yellow-300 text-purple-950 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-purple-950" />
                  <span>تنافس مباشر متعدد التلاميذ (Real-Time Multiplayer)</span>
                </span>
                <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isConnected ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white animate-ping' : 'bg-white'}`} />
                  <span>{isConnected ? 'الخادم متصل وجاهز 🟢' : 'جاري الاتصال بالخادم...'}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                ساحة التحدي المباشر بين تلاميذ الجزائر 🇩🇿
              </h2>
              <p className="text-xs sm:text-sm text-purple-100 font-bold mt-0.5">
                تنافس مع زملائك من مختلف الولايات في نفس الوقت، أجب أسرع، وناقش في غرفة المحادثة المباشرة!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeRoom ? (
              <button
                onClick={handleLeaveRoom}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-white/30"
              >
                <span>مغادرة الغرفة 🚪</span>
              </button>
            ) : (
              <button
                onClick={onReturnToPath}
                className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer border border-white/30 shadow-xs"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للمسار</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ERROR MESSAGE TOAST */}
      {errorMessage && (
        <div className="p-3 bg-rose-100 border-2 border-rose-300 text-rose-800 rounded-2xl font-bold text-xs flex items-center justify-between animate-shake">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="p-1 text-rose-600 font-black">✕</button>
        </div>
      )}

      {/* ================= VIEW 1: LOBBY & ROOM SELECTOR ================= */}
      {!activeRoom && (
        <div className="space-y-6">
          {/* PUPIL IDENTITY CARD (WILAYA, AVATAR, NAME) */}
          <div className="p-4 sm:p-5 bg-white rounded-3xl border-2 border-slate-200 shadow-xs">
            <h3 className="font-black text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-600" />
              <span>بطاقة هوية المتنافس (تظهر لجميع المنافسين):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">اسم التلميذ:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-violet-500 outline-none"
                  maxLength={25}
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">المجسم الرمزي (Avatar):</label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      onClick={() => setPlayerAvatar(av)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                        playerAvatar === av 
                          ? 'bg-violet-500 text-white ring-2 ring-violet-300 scale-110' 
                          : 'bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilaya Selector */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">الولاية الجزائرية 🇩🇿:</label>
                <select
                  value={playerWilaya}
                  onChange={(e) => setPlayerWilaya(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs sm:text-sm text-slate-800 focus:border-violet-500 outline-none bg-white cursor-pointer"
                >
                  {ALGERIAN_WILAYAS.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* JOIN BY CODE OR CREATE ROOM ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Join via code */}
            <div className="p-4 sm:p-5 bg-gradient-to-tr from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-300 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                  غرفة خاصة مع الزملاء
                </span>
                <h4 className="font-black text-base text-slate-900 mt-1">
                  الانضمام برمز الغرفة (Room Code) 🔑
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  أدخل الرمز الذي شاركه معك زميلك للانضمام إلى منافسته فوراً!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="مثال: CHAMP أو DZ49"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2.5 rounded-xl border-2 border-amber-300 font-english font-black text-sm uppercase text-slate-800 bg-white tracking-widest outline-none"
                  maxLength={10}
                />
                <button
                  onClick={() => handleJoinRoom(undefined, joinCodeInput)}
                  disabled={!joinCodeInput.trim() || !isConnected}
                  className="btn-duo-yellow text-slate-950 px-4 py-2.5 rounded-xl font-black text-xs md:text-sm shadow-sm cursor-pointer disabled:opacity-50"
                >
                  انضمام 🚀
                </button>
              </div>
            </div>

            {/* Create new room */}
            <div className="p-4 sm:p-5 bg-gradient-to-tr from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-300 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="bg-purple-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                  أنت القائد
                </span>
                <h4 className="font-black text-base text-slate-900 mt-1">
                  إنشاء غرفة تحدٍّ جديدة ➕
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  اختر عنوان التحدي واستضف أصدقاءك للتنافس المباشر ومناقشة الإجابات!
                </p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={!isConnected}
                className="w-full btn-duo-purple text-white py-2.5 rounded-xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>إنشاء غرفة تحدٍّ خاصة ومشاركة الرمز 🎮</span>
              </button>
            </div>
          </div>

          {/* ACTIVE PUBLIC ROOMS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-slate-800 flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span>غرف التحدي المفتوحة الآن في الجزائر:</span>
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                {roomsList.length} غرف نشطة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {roomsList.map((room) => (
                <div
                  key={room.id}
                  className="p-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-violet-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-english font-black text-slate-800 px-2 py-0.5 rounded-md bg-slate-100">
                        #{room.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        room.status === 'in_round' 
                          ? 'bg-rose-100 text-rose-700 animate-pulse' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {room.status === 'in_round' ? '⚔️ جولة مشتعلة' : '⏳ في انتظار المتنافسين'}
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-base leading-snug group-hover:text-violet-700 transition-colors">
                      {room.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                      {room.unitName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{room.playerCount} / {room.maxPlayers} تلاميذ</span>
                    </span>

                    <button
                      onClick={() => handleJoinRoom(room.id)}
                      disabled={!isConnected}
                      className="btn-duo-green text-white px-3.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <span>انضمام للتحدي</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: ACTIVE MATCH ROOM & DISCUSSION CHAT ================= */}
      {activeRoom && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* MAIN GAME STAGE (2 COLS ON DESKTOP) */}
          <div className="lg:col-span-2 space-y-4">
            {/* ROOM HEADER CARD */}
            <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-base sm:text-lg text-slate-900">
                    {activeRoom.title}
                  </h3>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-english font-black transition-colors border border-slate-300"
                    title="انسخ الرمز وشاركه مع زملائك"
                  >
                    <span>رمز: {activeRoom.code}</span>
                    {isCopiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  {activeRoom.unitName}
                </p>
              </div>

              {/* Status pill */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                  {activeRoom.players.length} متنافسين 👥
                </span>
              </div>
            </div>

            {/* WAITING STATE SCREEN */}
            {activeRoom.status === 'waiting' && (
              <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-md text-center space-y-6">
                <div>
                  <span className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 text-3xl mx-auto flex items-center justify-center mb-3 animate-pulse">
                    ⏳
                  </span>
                  <h4 className="text-xl font-black text-slate-900">
                    غرفة الانتظار واستعداد المتنافسين
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
                    اضغط على زر "أنا جاهز"، وسيبدأ التنافس فور اكتمال الاستعداد!
                  </p>
                </div>

                {/* Connected Players Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                  {activeRoom.players.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3 rounded-2xl border-2 transition-all text-center relative ${
                        p.isReady 
                          ? 'bg-emerald-50 border-emerald-400 shadow-xs' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{p.avatar}</div>
                      <p className="font-black text-xs text-slate-900 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold truncate">📍 {p.wilaya}</p>
                      <div className="mt-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          p.isReady ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {p.isReady ? 'جاهز ✓' : 'يستعد...'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ready & Start Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleToggleReady}
                    className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                      myPlayer?.isReady
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                        : 'btn-duo-green text-white'
                    }`}
                  >
                    <span>{myPlayer?.isReady ? 'أنا جاهز للتحدي! ✓ (اضغط للإلغاء)' : 'اضغط للتأكيد: أنا جاهز للتحدي! 🚀'}</span>
                  </button>

                  {isHost && (
                    <button
                      onClick={handleStartGame}
                      className="btn-duo-purple text-white px-6 py-3 rounded-2xl font-black text-sm shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>بدء التحدي الآن كقائد الغرفة ⚡</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* COUNTDOWN 3..2..1 SCREEN */}
            {activeRoom.status === 'countdown' && (
              <div className="p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white text-center shadow-xl border-4 border-amber-400 space-y-4">
                <span className="text-6xl font-black font-english text-yellow-300 animate-ping inline-block">
                  {activeRoom.roundTimeLeft > 0 ? activeRoom.roundTimeLeft : 'GO!'}
                </span>
                <h4 className="text-2xl font-black">
                  استعدوا يا أبطال 4PS!
                </h4>
                <p className="text-sm text-slate-300">
                  السؤال ينطلق الآن... الدقة والسرعة هما مفتاح الصدارة! ⚡
                </p>
              </div>
            )}

            {/* IN-ROUND ACTIVE QUESTION SCREEN */}
            {(activeRoom.status === 'in_round' || activeRoom.status === 'question_review') && activeRoom.currentQuestion && (
              <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-white border-2 border-slate-200 shadow-md space-y-5">
                {/* Round progress & Timer */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-violet-100 text-violet-800 font-english font-black flex items-center justify-center text-xs">
                      #{activeRoom.currentQuestionIndex + 1}/{activeRoom.totalQuestions}
                    </span>
                    <span className="font-bold text-xs text-slate-500">
                      التصنيف: <strong className="text-slate-800">{activeRoom.currentQuestion.category}</strong>
                    </span>
                  </div>

                  {/* Circular / Box Countdown Timer */}
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-english font-black text-sm transition-all ${
                    activeRoom.roundTimeLeft <= 4 
                      ? 'bg-rose-100 text-rose-700 animate-pulse ring-2 ring-rose-300' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>{activeRoom.roundTimeLeft}s</span>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="text-center py-2 sm:py-3 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-english font-black text-xl sm:text-2xl md:text-3xl text-slate-900 leading-snug">
                      "{activeRoom.currentQuestion.questionEn}"
                    </h3>
                    <button
                      onClick={() => speakEnglish(activeRoom.currentQuestion?.questionEn || '', 0.9)}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                      title="استمع للسؤال"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg font-bold">
                    {activeRoom.currentQuestion.questionAr}
                  </p>
                </div>

                {/* 4 Interactive Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeRoom.currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrectAnswer = activeRoom.status === 'question_review' && opt.id === activeRoom.currentQuestion?.correctAnswerId;
                    const isWrongPicked = activeRoom.status === 'question_review' && isSelected && !isCorrectAnswer;

                    return (
                      <button
                        key={opt.id}
                        disabled={activeRoom.status !== 'in_round' || selectedOptionId !== null}
                        onClick={() => handleSubmitAnswer(opt.id)}
                        className={`p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isCorrectAnswer
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-200 scale-102 font-black'
                            : isWrongPicked
                            ? 'bg-rose-100 border-rose-500 text-rose-950 font-bold'
                            : isSelected
                            ? 'bg-violet-100 border-violet-500 text-violet-950 ring-2 ring-violet-300 font-black'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
                          <div>
                            <p className="font-english font-black text-base text-slate-900">
                              {opt.text}
                            </p>
                            {opt.ar && (
                              <p className="text-xs text-slate-500 font-medium">
                                {opt.ar}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                          isCorrectAnswer
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : isWrongPicked
                            ? 'border-rose-600 bg-rose-600 text-white'
                            : isSelected
                            ? 'border-violet-600 bg-violet-600 text-white'
                            : 'border-slate-300 text-slate-400'
                        }`}>
                          {isCorrectAnswer ? '✓' : isWrongPicked ? '✕' : isSelected ? '✓' : opt.id.toUpperCase()}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Review explanation */}
                {activeRoom.status === 'question_review' && (
                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs sm:text-sm font-bold animate-fadeIn">
                    <p className="flex items-center gap-1.5 font-black text-amber-900 mb-1">
                      <span>💡 التوضيح النموذجي:</span>
                    </p>
                    <p>{activeRoom.currentQuestion.explanationAr}</p>
                  </div>
                )}

                {/* Live competitors answer indicator */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-slate-500">حالة إجابات المتنافسين:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activeRoom.players.map(p => (
                      <span
                        key={p.id}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          p.hasAnsweredCurrent
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{p.avatar}</span>
                        <span>{p.name.split(' ')[0]}</span>
                        <span>{p.hasAnsweredCurrent ? '⚡ تم' : '...'}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PODIUM FINAL RESULTS SCREEN */}
            {activeRoom.status === 'podium' && (
              <div className="p-6 md:p-8 rounded-3xl bg-white border-4 border-amber-400 shadow-xl text-center space-y-6 animate-fadeIn">
                <div>
                  <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 mx-auto flex items-center justify-center text-3xl shadow-lg ring-4 ring-amber-300/40 mb-2 animate-bounce">
                    🏆
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900">
                    تتويج أبطال التحدي المباشر!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    تهانينا لجميع الأبطال المتنافسين من مختلف ولايات الجزائر!
                  </p>
                </div>

                {/* TOP 3 PODIUM DISPLAY */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto items-end pt-4">
                  {/* 2nd Place */}
                  {activeRoom.players[1] && (
                    <div className="p-3 rounded-2xl bg-slate-50 border-2 border-slate-300 text-center">
                      <span className="text-2xl">{activeRoom.players[1].avatar}</span>
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-black text-xs mx-auto my-1">2</div>
                      <p className="font-black text-xs text-slate-800 truncate">{activeRoom.players[1].name}</p>
                      <p className="font-english font-black text-xs text-slate-600">{activeRoom.players[1].score} pts</p>
                      <span className="text-[10px] text-slate-500 block truncate">📍 {activeRoom.players[1].wilaya}</span>
                    </div>
                  )}

                  {/* 1st Place Champion */}
                  {activeRoom.players[0] && (
                    <div className="p-4 rounded-3xl bg-amber-50 border-3 border-amber-400 text-center shadow-md -translate-y-3">
                      <div className="text-3xl mb-1 animate-pulse">👑 {activeRoom.players[0].avatar}</div>
                      <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm mx-auto my-1 shadow-xs">1</div>
                      <p className="font-black text-sm text-slate-900 truncate">{activeRoom.players[0].name}</p>
                      <p className="font-english font-black text-sm text-amber-600">{activeRoom.players[0].score} pts</p>
                      <span className="text-[10px] text-amber-900 font-bold block truncate">📍 {activeRoom.players[0].wilaya}</span>
                      <span className="bg-amber-200 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block">
                        البطل المتوج! 🥇
                      </span>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {activeRoom.players[2] && (
                    <div className="p-3 rounded-2xl bg-orange-50 border-2 border-orange-300 text-center">
                      <span className="text-2xl">{activeRoom.players[2].avatar}</span>
                      <div className="w-6 h-6 rounded-full bg-orange-200 text-orange-900 font-black text-xs mx-auto my-1">3</div>
                      <p className="font-black text-xs text-slate-800 truncate">{activeRoom.players[2].name}</p>
                      <p className="font-english font-black text-xs text-orange-600">{activeRoom.players[2].score} pts</p>
                      <span className="text-[10px] text-slate-500 block truncate">📍 {activeRoom.players[2].wilaya}</span>
                    </div>
                  )}
                </div>

                {/* Final Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                  <button
                    onClick={handleStartGame}
                    className="btn-duo-green text-white px-6 py-3 rounded-2xl font-black text-sm shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>لعب جولة أخرى مع الزملاء 🔄</span>
                  </button>

                  <button
                    onClick={handleLeaveRoom}
                    className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm cursor-pointer transition-colors"
                  >
                    العودة لساحة الغرف 🚪
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR: LIVE SCOREBOARD & LIVE DISCUSSION CHAT (1 COL) */}
          <div className="space-y-4">
            {/* REAL-TIME LEADERBOARD */}
            <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-xs">
              <h4 className="font-black text-sm text-slate-800 mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>الترتيب المباشر (Live Scores):</span>
                </span>
                <span className="text-[11px] font-english font-bold text-slate-400">
                  Round {activeRoom.currentQuestionIndex + 1}/{activeRoom.totalQuestions}
                </span>
              </h4>

              <div className="space-y-2">
                {activeRoom.players.map((p, index) => {
                  const isMe = p.id === myPlayerId;
                  return (
                    <div
                      key={p.id}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
                        isMe 
                          ? 'bg-violet-50 border-violet-400 shadow-xs scale-101' 
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-6 h-6 rounded-full font-english font-black text-xs flex items-center justify-center shrink-0 ${
                          index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-800' : index === 2 ? 'bg-orange-300 text-orange-950' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-lg shrink-0">{p.avatar}</span>
                        <div className="min-w-0">
                          <p className="font-black text-xs text-slate-900 truncate">
                            {p.name} {isMe && <span className="text-violet-600 font-bold">(أنت)</span>}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate font-semibold">📍 {p.wilaya}</p>
                        </div>
                      </div>

                      <div className="text-left shrink-0">
                        <span className="font-english font-black text-xs sm:text-sm text-amber-600 block">
                          {p.score} pts
                        </span>
                        {p.streak > 1 && (
                          <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-1 rounded-sm">
                            🔥 {p.streak}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* LIVE DISCUSSION & ENCOURAGEMENT CHAT */}
            <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-xs flex flex-col h-[400px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <h4 className="font-black text-xs text-slate-800 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-violet-600" />
                  <span>مناقشة وتشجيع المتنافسين 💬</span>
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  مباشر
                </span>
              </div>

              {/* Chat messages feed */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1 text-xs">
                {activeRoom.chatMessages.map((msg) => {
                  const isMe = msg.playerId === myPlayerId;
                  const isSys = msg.playerId === 'system';

                  if (isSys) {
                    return (
                      <div key={msg.id} className="text-center py-1">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold inline-block">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 font-bold mb-0.5 flex items-center gap-1">
                        <span>{msg.playerAvatar}</span>
                        <span>{msg.playerName}</span>
                        {msg.wilaya && <span className="text-slate-400">({msg.wilaya})</span>}
                      </span>
                      <div className={`p-2 rounded-2xl max-w-[85%] leading-relaxed ${
                        isMe 
                          ? 'bg-violet-600 text-white rounded-br-xs font-semibold' 
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs font-semibold'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Reactions Bar */}
              <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-1 border-t border-slate-100">
                {QUICK_CHAT_OPTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendChat(q)}
                    className="whitespace-nowrap px-2 py-1 rounded-xl bg-slate-100 hover:bg-violet-100 text-slate-700 hover:text-violet-800 text-[10px] font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-1.5 pt-1"
              >
                <input
                  type="text"
                  placeholder="اكتب رسالة تشجيع للزملاء..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-violet-500"
                  maxLength={100}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-violet-600 text-white disabled:opacity-40 hover:bg-violet-700 transition-colors cursor-pointer"
                  title="إرسال"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE CUSTOM ROOM ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-violet-400 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <span>🎮 إنشاء غرفة تحدٍّ وتنافس خاصة</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">عنوان الغرفة:</label>
                <input
                  type="text"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-sm text-slate-800 focus:border-violet-500 outline-none"
                  maxLength={40}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">موضوع التحدي ومحور الأسئلة:</label>
                <select
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs sm:text-sm text-slate-800 focus:border-violet-500 outline-none bg-white cursor-pointer"
                >
                  <option value="منهاج الإنجليزية 4PS (شامل لجميع الوحدات)">منهاج الإنجليزية 4PS (شامل لجميع الوحدات)</option>
                  <option value="الوحدة 1 و 2: المدرسة والعائلة (School & Family)">الوحدة 1 و 2: المدرسة والعائلة (School & Family)</option>
                  <option value="الوحدة 3 و 4: المهن والأطعمة الصحية (Jobs & Food)">الوحدة 3 و 4: المهن والأطعمة الصحية (Jobs & Food)</option>
                  <option value="الوحدة 6 و 9: أعياد ومدن الجزائر (Algerian Pride)">الوحدة 6 و 9: أعياد ومدن الجزائر (Algerian Pride)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 font-bold">
                💡 سيتم إنشاء رمز فريد (Room Code) يمكنك نسخه وإرساله لزملائك للانضمام فوراً من أجهزتهم!
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCreateRoom}
                className="flex-1 btn-duo-purple text-white py-2.5 rounded-xl font-black text-sm shadow-md cursor-pointer"
              >
                تأكيد وبدء الغرفة 🚀
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
