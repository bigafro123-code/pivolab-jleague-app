import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebaseコンソール(https://console.firebase.google.com/)で作成したプロジェクトの
// 「プロジェクトの設定 > マイアプリ > ウェブアプリ」から取得したconfigをそのまま貼り付ける。
// Firebaseのウェブapiキーは秘匿情報ではなく(公式に公開前提の設計)、
// アクセス制御はFirestoreのセキュリティルール側で行う。詳細: firestore.rules
const firebaseConfig = {
  apiKey: 'AIzaSyB96L3BFWNAaSa6nnkQytujdV5PlE8Cza8',
  authDomain: 'pivolab-jleague-app.firebaseapp.com',
  projectId: 'pivolab-jleague-app',
  storageBucket: 'pivolab-jleague-app.firebasestorage.app',
  messagingSenderId: '1055304655488',
  appId: '1:1055304655488:web:59d7263ce13f686ebd7c65',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let dbInstance = null;

export function getDb() {
  if (!isFirebaseConfigured) return null;
  if (!dbInstance) {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    dbInstance = getFirestore(app);
  }
  return dbInstance;
}
