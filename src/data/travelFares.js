export const REAL_TRAIN_FARES = {
  // 名古屋グランパス
  'nagoya-kashima': { oneWayFare: 13400, oneWayHours: 4 + 10 / 60, note: '名古屋→東京(新幹線のぞみ)＋東京→鹿島神宮駅(在来線・バス)の合算・正規運賃' },
  'nagoya-hiroshima': { oneWayFare: 14810, oneWayHours: 2 + 11 / 60, note: '新幹線のぞみ普通車指定席の正規運賃(名古屋−広島)' },
  'nagoya-nagasaki': { oneWayFare: 23930, oneWayHours: 5 + 40 / 60, note: '新幹線のぞみ+特急かもめ(博多・武雄温泉乗継)の正規運賃・全区間指定席' },
  'nagoya-fctokyo': { oneWayFare: 11500, oneWayHours: 1 + 55 / 60, note: '新幹線のぞみ指定席(名古屋−東京)＋国立競技場最寄り駅までの在来線の合算' },
  // 東京ヴェルディ(拠点: 味の素スタジアム/調布)
  'verdy-okayama': { oneWayFare: 17650, oneWayHours: 3 + 30 / 60, note: '新幹線のぞみ指定席の正規運賃(東京−岡山)＋調布・スタジアム間の在来線' },
  'verdy-cerezo': { oneWayFare: 15020, oneWayHours: 2 + 45 / 60, note: '新幹線のぞみ指定席の正規運賃(東京−新大阪)＋調布・新大阪・スタジアム間の在来線' },
  'verdy-urawa': { oneWayFare: 900, oneWayHours: 1 + 10 / 60, note: '新幹線を使わない区間。JR在来線での正規運賃(調布−浦和)' },
  'verdy-ynmarinos': { oneWayFare: 400, oneWayHours: 45 / 60, note: 'この試合はMUFG国立(東京都内)で開催されるため新幹線は不要。都内在来線の正規運賃' },
  // 鹿島アントラーズ(新幹線が通っていないため、必ず東京経由になる区間)
  // 東京-鹿島神宮駅(実運賃¥2,100/約2時間15分)+ 東京-新大阪/京都(実運賃)を組み合わせて算出
  'kashima-kobe': { oneWayFare: 17520, oneWayHours: 2.25 + 2.35 + 0.3, note: '東京-鹿島神宮駅(実運賃)＋新幹線のぞみ(東京-新大阪)の実運賃＋神戸市内の在来線を合算' },
  'kashima-kyoto': { oneWayFare: 16570, oneWayHours: 2.25 + 2.25 + 0.2, note: '東京-鹿島神宮駅(実運賃)＋新幹線のぞみ(東京-京都)の実運賃相場＋亀岡市内の在来線を合算' },
  'gamba-kashima': { oneWayFare: 16820, oneWayHours: 2.35 + 2.25, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-鹿島神宮駅(実運賃)を合算' },
  // 柏レイソル(柏駅は新幹線が通っていないため、東京経由の長距離区間を合算)
  'kashiwa-shimizu': { oneWayFare: 7270, oneWayHours: 0.5 + 1.0, note: '柏-東京間の在来線目安＋新幹線こだま(東京-静岡)の実運賃相場を合算' },
  'kashiwa-cerezo': { oneWayFare: 16220, oneWayHours: 0.5 + 2.35 + 0.3, note: '柏-東京間の在来線目安＋新幹線のぞみ(東京-新大阪)の実運賃＋大阪市内の在来線を合算' },
  'kashiwa-kyoto': { oneWayFare: 15270, oneWayHours: 0.5 + 2.25 + 0.2, note: '柏-東京間の在来線目安＋新幹線のぞみ(東京-京都)の実運賃相場＋亀岡市内の在来線を合算' },
  // ガンバ大阪(長崎・鹿島同様、新幹線本線から外れる関東の区間は東京経由で合算)
  'gamba-chiba': { oneWayFare: 15520, oneWayHours: 2.35 + 0.5, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-千葉間の在来線目安を合算' },
  'gamba-machida': { oneWayFare: 15520, oneWayHours: 2.35 + 0.5, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-町田間の在来線目安を合算' },
  'gamba-mito': { oneWayFare: 16720, oneWayHours: 2.35 + 1.3, note: '新幹線のぞみ(新大阪-東京)の実運賃＋東京-水戸間の在来線目安を合算' },
  'gamba-fukuoka': { oneWayFare: 16620, oneWayHours: 2.37 + 0.2, note: '新幹線のぞみ/みずほ指定席の実運賃(新大阪-博多)＋博多駅-スタジアム間の在来線目安を合算' },
};
