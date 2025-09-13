const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const users = [
  {
    user_id: "oz_user1",
    user_password: "1234",
    user_name: "김오즈",
    user_info: "서울에 거주하는 김오즈입니다.",
  },
  {
    user_id: "oz_user2",
    user_password: "4567",
    user_name: "박코딩",
    user_info: "부산에 거주하는 박코딩입니다.",
  },
  {
    user_id: "oz_user3",
    user_password: "7890",
    user_name: "이쿠키",
    user_info: "경기에 거주하는 이쿠키입니다.",
  },
  {
    user_id: "oz_user4",
    user_password: "1357",
    user_name: "최노드",
    user_info: "제주에 거주하는 최노드입니다.",
  },
];

const app = express();

app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"], // Live Server
    methods: ["OPTIONS", "POST", "GET", "DELETE"],
    credentials: true, // 쿠키 주고받기 허용
  })
);

app.use(cookieParser());
app.use(express.json());

// 🔑 세션 설정
app.use(
  session({
    secret: "oz_secret_key", // 암호화 키
    resave: false, // 변경 없으면 세션 저장 X
    saveUninitialized: false, // 빈 세션 저장 X
    name: "session_id", // 쿠키 이름 변경
    cookie: {
      httpOnly: true,
      secure: false, // https 환경에서는 true
      maxAge: 1000 * 60 * 30, // 30분
    },
  })
);

// 🟢 로그인
app.post("/", (req, res) => {
  const { userId, userPassword } = req.body;
  const userInfo = users.find(
    (u) => u.user_id === userId && u.user_password === userPassword
  );

  if (!userInfo) return res.status(401).send("로그인 실패");

  req.session.userId = userInfo.user_id;
  req.session.save(() => {
    console.log("세션 저장됨:", req.session); // ✅ userId 확인
    res.send("⭐️세션 생성 완료!");
  });
});

// 🟢 사용자 정보 가져오기
app.get("/", (req, res) => {
  console.log("현재 세션:", req.session); // ✅ 디버깅
  const userInfo = users.find((u) => u.user_id === req.session.userId);
  res.json(userInfo || null);
});

// 🟢 로그아웃
app.delete("/", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("세션 삭제 실패");
    res.clearCookie("session_id");
    res.send("🧹세션 삭제 완료");
  });
});

app.listen(3000, () => console.log("서버 실행 ..."));
