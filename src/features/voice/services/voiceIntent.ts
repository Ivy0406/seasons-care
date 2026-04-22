const MONEY_EXPLICIT_PATTERN =
  /記[帳賬]|[帳賬]目|支出|花費|金額|花了|費用|分(?:[帳賬]|錢)|付款|付了|消費|收據/u;

const MONEY_AMOUNT_PATTERN =
  /(?:\$\s*\d{1,6})|(?:(?:\d{1,6}|[零一二三四五六七八九十百千兩]+)\s*(?:元|塊|塊錢))/u;

const MONEY_LABELED_AMOUNT_PATTERN =
  /金額(?:是|為)?\s*(?:\d{1,6}|[零一二三四五六七八九十百千兩]+)/u;

const HEALTH_INTENT_PATTERN =
  /血壓|收縮壓|舒張壓|體溫|血氧|體重|血糖|mmhg|mg\/dl|公斤|kg|公克|度/u;

const DIARY_EXPLICIT_PATTERN =
  /任務|記事|提醒|記一下|記錄一下|幫我記錄|幫我新增|新增任務|寫任務|幫我寫任務/u;

const DIARY_ACTIVITY_PATTERN =
  /散步|復健|回診|看診|看醫生|看醫師|去醫院|門診|吃藥|服藥|洗澡|睡覺|休息|跌倒|情緒|心情|精神|食慾|活動|照護|陪同|觀察|提醒/u;

function hasMoneyIntent(transcript: string) {
  return (
    MONEY_EXPLICIT_PATTERN.test(transcript) ||
    MONEY_AMOUNT_PATTERN.test(transcript) ||
    MONEY_LABELED_AMOUNT_PATTERN.test(transcript)
  );
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
