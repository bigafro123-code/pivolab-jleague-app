// ---- 広告枠(モック) ----------------------------------------------------
// 実際にはAdMob(ネイティブアプリ)やGoogle Ad Manager/AdSense(Web版)のSDKタグに置き換える。
// 「広告」ラベルは景品表示法・各広告ネットワーク規約上、必須表示。
export default function BannerAd() {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 12,
        border: '1px solid #d2d2d7',
        background: '#f5f5f7',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        minHeight: 72,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 8,
          left: 10,
          fontFamily: "'Oswald', sans-serif",
          fontSize: 9,
          letterSpacing: 1,
          color: '#86868b',
          border: '1px solid #d2d2d7',
          borderRadius: 4,
          padding: '1px 6px',
        }}
      >
        広告
      </span>
      <a href="https://px.a8.net/svt/ejp?a8mat=4B83CZ+2DQFW2+4ZCO+63OY9" rel="nofollow noopener noreferrer sponsored" target="_blank">
        <img
          border="0"
          width="320"
          height="50"
          alt=""
          src="https://www20.a8.net/svt/bgt?aid=260718083144&wid=001&eno=01&mid=s00000023244001025000&mc=1"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </a>
      <img
        border="0"
        width="1"
        height="1"
        src="https://www15.a8.net/0.gif?a8mat=4B83CZ+2DQFW2+4ZCO+63OY9"
        alt=""
        style={{ position: 'absolute', width: 1, height: 1 }}
      />
    </div>
  );
}
