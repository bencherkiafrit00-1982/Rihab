import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { MULTIPLAYER_QUESTIONS, MultiplayerQuestion } from './src/data/multiplayerQuestions';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json());

// API health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// TYPES
export interface PlayerState {
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

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  wilaya: string;
  text: string;
  timestamp: number;
  isQuickReaction?: boolean;
}

export interface RoomState {
  id: string;
  code: string;
  title: string;
  unitName: string;
  status: 'waiting' | 'countdown' | 'in_round' | 'question_review' | 'podium';
  hostId: string;
  players: PlayerState[];
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: MultiplayerQuestion[];
  currentQuestion?: MultiplayerQuestion;
  roundTimeLeft: number;
  chatMessages: ChatMessage[];
  maxPlayers: number;
  timerInterval?: NodeJS.Timeout;
}

// In-memory active rooms
const rooms = new Map<string, RoomState>();

// Socket-to-player mapping
const socketMap = new Map<WebSocket, { playerId: string; roomId?: string }>();

// Pre-seeded Algerian Classmate Bots for instant vibrant rivalry
const ALGERIAN_CLASSMATE_POOL = [
  { name: 'أمين بن علي', wilaya: 'وهران (Oran)', avatar: '👦🏻' },
  { name: 'سارة مرابط', wilaya: 'قسنطينة (Constantine)', avatar: '👧🏻' },
  { name: 'ياسين بلقاسم', wilaya: 'الجزائر العاصمة (Algiers)', avatar: '👦🏽' },
  { name: 'إيمان زايدي', wilaya: 'سطيف (Setif)', avatar: '👧🏽' },
  { name: 'أحمد التواتي', wilaya: 'أدرار (Adrar)', avatar: '👦🏾' },
  { name: 'مريم خيدر', wilaya: 'تلمسان (Tlemcen)', avatar: '👧🏻' },
];

const BOT_CHAT_REACTIONS = [
  'ما شاء الله! تحدٍّ ممتع ورائع! 🌟',
  'سأجيب أسرع في السؤال القادم! ⚡',
  'تحدي رائع بين تلاميذ الجزائر! 🇩🇿',
  'أحسنت يا بطل! إجابة ذكية! 👍',
  'سأحاول تصدر لوحة المراتب الآن! 🏆',
  'هذه الكلمة من الوحدة الرابعة من كتابنا! 📚',
];

// Helper to pick random questions
function getRandomQuestions(count = 5): MultiplayerQuestion[] {
  const shuffled = [...MULTIPLAYER_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Create initial default public rooms
function initDefaultRooms() {
  const defaultRooms: { id: string; code: string; title: string; unitName: string }[] = [
    { id: 'room-champ', code: 'CHAMP', title: 'تحدي أبطال الجزائر الكبرى 🏆', unitName: 'شامل لكل الوحدات (Units 0-9)' },
    { id: 'room-wilaya', code: 'WILAYA', title: 'دوري ولايات الجزائر للتلاميذ 🇩🇿', unitName: 'تحدي العائلة والمدن (Units 2 & 9)' },
    { id: 'room-speed', code: 'SPEED4', title: 'سباق السرعة والذكاء الخاطف ⚡', unitName: 'الأدوات والألعاب (Units 1 & 5)' },
  ];

  for (const def of defaultRooms) {
    if (!rooms.has(def.id)) {
      const q = getRandomQuestions(5);
      rooms.set(def.id, {
        id: def.id,
        code: def.code,
        title: def.title,
        unitName: def.unitName,
        status: 'waiting',
        hostId: 'system',
        players: [],
        currentQuestionIndex: 0,
        totalQuestions: 5,
        questions: q,
        currentQuestion: q[0],
        roundTimeLeft: 15,
        chatMessages: [
          {
            id: 'msg-welcome-' + def.id,
            playerId: 'system',
            playerName: 'نجيب ورحاب 🇩🇿',
            playerAvatar: '🌟',
            wilaya: 'الجزائر',
            text: 'مرحباً بكم في ساحة التحدي المباشر! تنافسوا واكسبوا الجواهر ونقاط XP!',
            timestamp: Date.now(),
          }
        ],
        maxPlayers: 8,
      });
    }
  }
}

initDefaultRooms();

// Broadcast room summary list to all sockets
function broadcastRoomsList() {
  const summary = Array.from(rooms.values()).map(r => ({
    id: r.id,
    code: r.code,
    title: r.title,
    unitName: r.unitName,
    status: r.status,
    playerCount: r.players.length,
    maxPlayers: r.maxPlayers,
  }));

  const msg = JSON.stringify({ type: 'rooms:list', rooms: summary });
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

// Broadcast room state to players inside a room
function broadcastToRoom(roomId: string, messageObj: any) {
  const payload = JSON.stringify(messageObj);
  for (const [ws, info] of socketMap.entries()) {
    if (info.roomId === roomId && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
}

// Clean room state for client (remove secret answers during active question)
function getSanitizedRoom(room: RoomState): any {
  let q: any = undefined;
  if (room.currentQuestion) {
    q = {
      id: room.currentQuestion.id,
      unitNumber: room.currentQuestion.unitNumber,
      category: room.currentQuestion.category,
      questionAr: room.currentQuestion.questionAr,
      questionEn: room.currentQuestion.questionEn,
      options: room.currentQuestion.options,
      timeLimitSec: room.currentQuestion.timeLimitSec,
      // Only include correct answer and explanation if we are in review or finished
      correctAnswerId: (room.status === 'question_review' || room.status === 'podium')
        ? room.currentQuestion.correctAnswerId
        : undefined,
      explanationAr: (room.status === 'question_review' || room.status === 'podium')
        ? room.currentQuestion.explanationAr
        : undefined,
    };
  }

  return {
    id: room.id,
    code: room.code,
    title: room.title,
    unitName: room.unitName,
    status: room.status,
    hostId: room.hostId,
    players: room.players,
    currentQuestionIndex: room.currentQuestionIndex,
    totalQuestions: room.totalQuestions,
    currentQuestion: q,
    roundTimeLeft: room.roundTimeLeft,
    chatMessages: room.chatMessages.slice(-25),
    maxPlayers: room.maxPlayers,
  };
}

// Start game round for a room
function startGame(room: RoomState) {
  if (room.status === 'in_round' || room.status === 'countdown') return;

  room.status = 'countdown';
  room.currentQuestionIndex = 0;
  room.questions = getRandomQuestions(5);
  room.currentQuestion = room.questions[0];
  room.roundTimeLeft = 3; // 3 sec countdown

  // Reset player scores
  room.players.forEach(p => {
    p.score = 0;
    p.streak = 0;
    p.correctAnswersCount = 0;
    p.hasAnsweredCurrent = false;
    p.lastSelectedAnswerId = undefined;
    p.lastAnswerIsCorrect = undefined;
  });

  broadcastToRoom(room.id, {
    type: 'game:countdown',
    countdown: 3,
    room: getSanitizedRoom(room),
  });

  setTimeout(() => {
    startNextQuestion(room);
  }, 3500);
}

// Next question
function startNextQuestion(room: RoomState) {
  if (!room.questions[room.currentQuestionIndex]) {
    finishGame(room);
    return;
  }

  room.status = 'in_round';
  room.currentQuestion = room.questions[room.currentQuestionIndex];
  room.roundTimeLeft = room.currentQuestion.timeLimitSec || 15;

  // Reset per-question state for all players
  room.players.forEach(p => {
    p.hasAnsweredCurrent = false;
    p.lastSelectedAnswerId = undefined;
    p.lastAnswerIsCorrect = undefined;
  });

  if (room.timerInterval) clearInterval(room.timerInterval);

  broadcastToRoom(room.id, {
    type: 'question:start',
    questionIndex: room.currentQuestionIndex,
    totalQuestions: room.totalQuestions,
    room: getSanitizedRoom(room),
  });

  // Schedule bots answering with realistic delays
  scheduleBotAnswers(room);

  // Tick timer every second
  room.timerInterval = setInterval(() => {
    room.roundTimeLeft -= 1;

    broadcastToRoom(room.id, {
      type: 'timer:tick',
      timeLeft: room.roundTimeLeft,
    });

    if (room.roundTimeLeft <= 0) {
      if (room.timerInterval) clearInterval(room.timerInterval);
      endQuestionRound(room);
    }
  }, 1000);
}

// Bot answers
function scheduleBotAnswers(room: RoomState) {
  const currentQ = room.currentQuestion;
  if (!currentQ) return;

  const botPlayers = room.players.filter(p => p.isBot);
  for (const bot of botPlayers) {
    // 80% chance bot answers correctly
    const isCorrect = Math.random() < 0.85;
    const chosenOptionId = isCorrect 
      ? currentQ.correctAnswerId 
      : currentQ.options.find(o => o.id !== currentQ.correctAnswerId)?.id || currentQ.correctAnswerId;

    // Random delay between 2 and 9 seconds
    const delayMs = Math.floor(Math.random() * 7000) + 2000;

    setTimeout(() => {
      if (room.status === 'in_round' && room.currentQuestion?.id === currentQ.id && !bot.hasAnsweredCurrent) {
        handlePlayerAnswer(room, bot.id, chosenOptionId);

        // Occasional bot chat reaction (30% chance)
        if (Math.random() < 0.35) {
          const randomReaction = BOT_CHAT_REACTIONS[Math.floor(Math.random() * BOT_CHAT_REACTIONS.length)];
          addChatMessage(room, {
            id: 'bot-msg-' + Date.now(),
            playerId: bot.id,
            playerName: bot.name,
            playerAvatar: bot.avatar,
            wilaya: bot.wilaya,
            text: randomReaction,
            timestamp: Date.now(),
          });
        }
      }
    }, delayMs);
  }
}

// Handle player answer
function handlePlayerAnswer(room: RoomState, playerId: string, optionId: string) {
  if (room.status !== 'in_round' || !room.currentQuestion) return;

  const player = room.players.find(p => p.id === playerId);
  if (!player || player.hasAnsweredCurrent) return;

  player.hasAnsweredCurrent = true;
  player.lastSelectedAnswerId = optionId;

  const isCorrect = optionId === room.currentQuestion.correctAnswerId;
  player.lastAnswerIsCorrect = isCorrect;

  if (isCorrect) {
    // Base 100 points + speed bonus (up to 80 points) + streak bonus (20 per streak)
    const speedRatio = Math.max(0, room.roundTimeLeft / (room.currentQuestion.timeLimitSec || 15));
    const speedBonus = Math.round(speedRatio * 80);
    const streakBonus = Math.min(100, player.streak * 20);

    const pointsEarned = 100 + speedBonus + streakBonus;
    player.score += pointsEarned;
    player.streak += 1;
    player.correctAnswersCount += 1;
  } else {
    player.streak = 0;
  }

  // Sort players by score descending
  room.players.sort((a, b) => b.score - a.score);

  broadcastToRoom(room.id, {
    type: 'player:answered',
    playerId: player.id,
    playerName: player.name,
    allAnswered: room.players.every(p => p.hasAnsweredCurrent),
    room: getSanitizedRoom(room),
  });

  // If everyone answered, end question early!
  const allAnswered = room.players.every(p => p.hasAnsweredCurrent);
  if (allAnswered) {
    if (room.timerInterval) clearInterval(room.timerInterval);
    setTimeout(() => {
      endQuestionRound(room);
    }, 800);
  }
}

// End question round & show review
function endQuestionRound(room: RoomState) {
  room.status = 'question_review';
  if (room.timerInterval) clearInterval(room.timerInterval);

  broadcastToRoom(room.id, {
    type: 'question:review',
    correctAnswerId: room.currentQuestion?.correctAnswerId,
    explanationAr: room.currentQuestion?.explanationAr,
    room: getSanitizedRoom(room),
  });

  // Wait 4 seconds for players to review answer, then proceed
  setTimeout(() => {
    if (room.status !== 'question_review') return;
    room.currentQuestionIndex += 1;
    if (room.currentQuestionIndex < room.totalQuestions) {
      startNextQuestion(room);
    } else {
      finishGame(room);
    }
  }, 4500);
}

// Finish game & award XP
function finishGame(room: RoomState) {
  room.status = 'podium';
  if (room.timerInterval) clearInterval(room.timerInterval);

  // Final sort
  room.players.sort((a, b) => b.score - a.score);

  broadcastToRoom(room.id, {
    type: 'game:podium',
    room: getSanitizedRoom(room),
  });
}

// Add chat message
function addChatMessage(room: RoomState, msg: ChatMessage) {
  room.chatMessages.push(msg);
  if (room.chatMessages.length > 50) room.chatMessages.shift();

  broadcastToRoom(room.id, {
    type: 'chat:new_message',
    message: msg,
  });
}

// WebSocket Connection Management
wss.on('connection', (ws) => {
  const tempPlayerId = 'p-' + Math.random().toString(36).substring(2, 9);
  socketMap.set(ws, { playerId: tempPlayerId });

  // Send initial welcome & room list
  ws.send(JSON.stringify({
    type: 'welcome',
    playerId: tempPlayerId,
  }));

  broadcastRoomsList();

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'rooms:get': {
          broadcastRoomsList();
          break;
        }

        case 'room:create': {
          const roomCode = (msg.code || Math.random().toString(36).substring(2, 7)).toUpperCase();
          const newRoomId = 'room-' + Date.now();
          const questions = getRandomQuestions(msg.questionCount || 5);

          const newRoom: RoomState = {
            id: newRoomId,
            code: roomCode,
            title: msg.title || 'غرفة التحدي الخاصة 🎮',
            unitName: msg.unitName || 'أسئلة عامة من المنهاج',
            status: 'waiting',
            hostId: msg.player.id,
            players: [{
              id: msg.player.id,
              name: msg.player.name || 'تلميذ 4PS',
              avatar: msg.player.avatar || '👦🏻',
              wilaya: msg.player.wilaya || 'الجزائر',
              score: 0,
              streak: 0,
              correctAnswersCount: 0,
              isReady: true,
              isHost: true,
              hasAnsweredCurrent: false,
              isBot: false,
            }],
            currentQuestionIndex: 0,
            totalQuestions: questions.length,
            questions: questions,
            currentQuestion: questions[0],
            roundTimeLeft: 15,
            chatMessages: [{
              id: 'msg-' + Date.now(),
              playerId: 'system',
              playerName: 'النظام',
              playerAvatar: '🔔',
              wilaya: '',
              text: `تم إنشاء الغرفة بنجاح! شارك الرمز [${roomCode}] مع زملائك للانضمام!`,
              timestamp: Date.now(),
            }],
            maxPlayers: 8,
          };

          rooms.set(newRoomId, newRoom);
          socketMap.set(ws, { playerId: msg.player.id, roomId: newRoomId });

          ws.send(JSON.stringify({
            type: 'room:joined',
            room: getSanitizedRoom(newRoom),
          }));

          broadcastRoomsList();
          break;
        }

        case 'room:join': {
          let targetRoom = rooms.get(msg.roomId);
          if (!targetRoom && msg.roomCode) {
            targetRoom = Array.from(rooms.values()).find(
              r => r.code.toUpperCase() === msg.roomCode.trim().toUpperCase()
            );
          }

          if (!targetRoom) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'لم يتم العثور على الغرفة! تأكد من الرمز المدخل.',
            }));
            return;
          }

          // Check if player already in room
          let existingPlayer = targetRoom.players.find(p => p.id === msg.player.id);
          if (!existingPlayer) {
            existingPlayer = {
              id: msg.player.id,
              name: msg.player.name || 'تلميذ 4PS',
              avatar: msg.player.avatar || '👦🏻',
              wilaya: msg.player.wilaya || 'الجزائر',
              score: 0,
              streak: 0,
              correctAnswersCount: 0,
              isReady: false,
              isHost: targetRoom.players.length === 0,
              hasAnsweredCurrent: false,
              isBot: false,
            };
            targetRoom.players.push(existingPlayer);
          }

          // If there is only 1 human in the room, populate 2 friendly Algerian classmate bots so the pupil can always compete
          const humanCount = targetRoom.players.filter(p => !p.isBot).length;
          if (humanCount === 1 && targetRoom.players.filter(p => p.isBot).length === 0) {
            const bot1 = ALGERIAN_CLASSMATE_POOL[0];
            const bot2 = ALGERIAN_CLASSMATE_POOL[1];
            targetRoom.players.push(
              {
                id: 'bot-1',
                name: bot1.name,
                avatar: bot1.avatar,
                wilaya: bot1.wilaya,
                score: 0,
                streak: 0,
                correctAnswersCount: 0,
                isReady: true,
                isHost: false,
                hasAnsweredCurrent: false,
                isBot: true,
              },
              {
                id: 'bot-2',
                name: bot2.name,
                avatar: bot2.avatar,
                wilaya: bot2.wilaya,
                score: 0,
                streak: 0,
                correctAnswersCount: 0,
                isReady: true,
                isHost: false,
                hasAnsweredCurrent: false,
                isBot: true,
              }
            );
          }

          socketMap.set(ws, { playerId: msg.player.id, roomId: targetRoom.id });

          addChatMessage(targetRoom, {
            id: 'msg-join-' + Date.now(),
            playerId: 'system',
            playerName: 'النظام',
            playerAvatar: '👋',
            wilaya: '',
            text: `انضم البطل ${existingPlayer.name} من ولاية ${existingPlayer.wilaya} إلى التحدي! 🇩🇿`,
            timestamp: Date.now(),
          });

          ws.send(JSON.stringify({
            type: 'room:joined',
            room: getSanitizedRoom(targetRoom),
          }));

          broadcastToRoom(targetRoom.id, {
            type: 'room:updated',
            room: getSanitizedRoom(targetRoom),
          });

          broadcastRoomsList();
          break;
        }

        case 'player:ready': {
          const info = socketMap.get(ws);
          if (!info?.roomId) return;
          const room = rooms.get(info.roomId);
          if (!room) return;

          const player = room.players.find(p => p.id === info.playerId);
          if (player) {
            player.isReady = !player.isReady;

            broadcastToRoom(room.id, {
              type: 'room:updated',
              room: getSanitizedRoom(room),
            });

            // If all human players are ready and room is waiting, start match!
            const allHumansReady = room.players.filter(p => !p.isBot).every(p => p.isReady);
            if (allHumansReady && room.players.length >= 2 && room.status === 'waiting') {
              startGame(room);
            }
          }
          break;
        }

        case 'game:start': {
          const info = socketMap.get(ws);
          if (!info?.roomId) return;
          const room = rooms.get(info.roomId);
          if (room && (room.status === 'waiting' || room.status === 'podium')) {
            startGame(room);
          }
          break;
        }

        case 'answer:submit': {
          const info = socketMap.get(ws);
          if (!info?.roomId) return;
          const room = rooms.get(info.roomId);
          if (room) {
            handlePlayerAnswer(room, info.playerId, msg.optionId);
          }
          break;
        }

        case 'chat:send': {
          const info = socketMap.get(ws);
          if (!info?.roomId) return;
          const room = rooms.get(info.roomId);
          if (!room) return;

          const player = room.players.find(p => p.id === info.playerId);
          if (!player) return;

          addChatMessage(room, {
            id: 'msg-' + Date.now(),
            playerId: player.id,
            playerName: player.name,
            playerAvatar: player.avatar,
            wilaya: player.wilaya,
            text: msg.text.trim().substring(0, 140),
            timestamp: Date.now(),
            isQuickReaction: !!msg.isQuickReaction,
          });
          break;
        }

        case 'room:leave': {
          const info = socketMap.get(ws);
          if (!info?.roomId) return;
          const room = rooms.get(info.roomId);
          if (room) {
            room.players = room.players.filter(p => p.id !== info.playerId);
            socketMap.set(ws, { playerId: info.playerId });

            broadcastToRoom(room.id, {
              type: 'room:updated',
              room: getSanitizedRoom(room),
            });
            broadcastRoomsList();
          }
          break;
        }
      }
    } catch (e) {
      console.error('WebSocket message parsing error:', e);
    }
  });

  ws.on('close', () => {
    const info = socketMap.get(ws);
    if (info?.roomId) {
      const room = rooms.get(info.roomId);
      if (room) {
        room.players = room.players.filter(p => p.id !== info.playerId);
        broadcastToRoom(room.id, {
          type: 'room:updated',
          room: getSanitizedRoom(room),
        });
        broadcastRoomsList();
      }
    }
    socketMap.delete(ws);
  });
});

// Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server & WebSocket running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
