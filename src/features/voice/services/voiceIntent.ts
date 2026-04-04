const MONEY_INTENT_PATTERN =
  /記帳|帳目|支出|花費|金額|花了|費用|分帳|元|塊|塊錢|醫療費|掛號費|藥費|檢查費|住院費|交通費|車費|餐費/u;

const HEALTH_INTENT_PATTERN =
  /血壓|收縮壓|舒張壓|體溫|血氧|體重|血糖|mmhg|mg\/dl|公斤|kg|公克|度/u;

const DIARY_EXPLICIT_PATTERN =
  /日誌|記事|提醒|記一下|記錄一下|幫我記錄|幫我新增|新增日誌|寫日誌|幫我寫日誌/u;

const DIARY_ACTIVITY_PATTERN =
  /散步|復健|回診|看診|吃藥|服藥|洗澡|睡覺|休息|跌倒|情緒|心情|精神|食慾|活動|照護|陪同|觀察|提醒/u;

function hasMoneyIntent(transcript: string) {
  return MONEY_INTENT_PATTERN.test(transcript);
}

function hasHealthIntent(transcript: string) {
  return HEALTH_INTENT_PATTERN.test(transcript);
}

function hasDiaryIntent(transcript: string) {
  const normalizedTranscript = transcript.trim();

  if (normalizedTranscript === '') {
    return false;
  }

  const hasExplicitDiaryIntent =
    DIARY_EXPLICIT_PATTERN.test(normalizedTranscript);
  const hasDiaryActivity = DIARY_ACTIVITY_PATTERN.test(normalizedTranscript);
  const moneyIntent = hasMoneyIntent(normalizedTranscript);
  const healthIntent = hasHealthIntent(normalizedTranscript);

  if (hasExplicitDiaryIntent) {
    return true;
  }

  if ((moneyIntent || healthIntent) && !hasDiaryActivity) {
    return false;
  }

  return hasDiaryActivity;
}

export { hasDiaryIntent, hasHealthIntent, hasMoneyIntent };
