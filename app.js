const STORAGE_KEY = 'steady-cutting-data-v1';
const CLOUD_UPDATED_KEY = 'steady-cutting-cloud-updated-v1';

const defaultState = {
  profile: { name: '林同学', weight: 67.8, height: 175, age: 27, calorieGoal: 1920, carbMultiplier: 3.0 },
  meals: [
    { id: 1, name: '希腊酸奶 · 蓝莓 · 燕麦', type: '早餐', calories: 386, protein: 24, carbs: 48, fat: 11 },
    { id: 2, name: '鸡胸肉糙米饭', type: '午餐', calories: 528, protein: 38, carbs: 64, fat: 13 },
    { id: 3, name: '乳清蛋白', type: '加餐', calories: 142, protein: 24, carbs: 6, fat: 2 },
    { id: 4, name: '苹果', type: '加餐', calories: 92, protein: 0, carbs: 24, fat: 0 }
  ],
  weightLogs: [70.0,69.7,69.5,69.4,69.1,69.0,68.8,68.7,68.8,68.5,68.4,68.2,68.3,68.1,68.0,68.2,68.0,67.9,68.1,67.8],
  wearable: { steps: 8426, burn: 436, sleep: 7.7, score: 84 },
  signals: { hunger: 2, energy: 3, digestion: 3 },
  trainingLogs: [
    { id: 1, date: '9月28日', name: '上肢力量', focus: '推', duration: 58, volume: 2840, rpe: 7.5, note: '卧推最后一组保持余力' },
    { id: 2, date: '9月26日', name: '下肢力量', focus: '下肢', duration: 64, volume: 3260, rpe: 8.0, note: '深蹲状态稳定' },
    { id: 3, date: '9月24日', name: '背部训练', focus: '拉', duration: 52, volume: 2140, rpe: 7.2, note: '引体向上完成度提升' }
  ],
  bodyLogs: [{ date: '9月29日', waist: 78.5, chest: 96.0, hip: 94.0, thigh: 55.0, arm: 33.0, bodyFat: 18.5 }],
  adjustments: [
    { date: '9月29日', title: '保持当前方案', detail: '体重趋势平稳下降，训练状态好，继续保持当前碳水倍数。' },
    { date: '9月22日', title: '小幅上调碳水', detail: '连续 3 天明显饥饿，碳水从 2.8× 调整至 3.0×。' },
    { date: '9月15日', title: '开始记录', detail: '以 70.0 kg 作为起始体重建立基线。' }
  ]
};

const foodCatalog = [
  { id: 'chicken-breast', name: '鸡胸肉', keywords: '鸡肉 白肉 健身', kcal: 133, protein: 31, carbs: 0, fat: 3.6 },
  { id: 'rice', name: '米饭', keywords: '大米 白饭 主食', kcal: 116, protein: 2.6, carbs: 25.9, fat: 0.3 },
  { id: 'oats', name: '燕麦片', keywords: '燕麦 早餐 粗粮', kcal: 367, protein: 15, carbs: 61.6, fat: 6.5 },
  { id: 'egg', name: '鸡蛋', keywords: '蛋 全蛋', kcal: 144, protein: 13.3, carbs: 1.1, fat: 9.9 },
  { id: 'salmon', name: '三文鱼', keywords: '鱼 海鱼 脂肪', kcal: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 'beef', name: '牛里脊', keywords: '牛肉 红肉', kcal: 170, protein: 26, carbs: 0, fat: 7 },
  { id: 'shrimp', name: '虾仁', keywords: '虾 海鲜', kcal: 99, protein: 24, carbs: 0, fat: 0.3 },
  { id: 'tofu', name: '北豆腐', keywords: '豆腐 大豆 素食', kcal: 81, protein: 8.1, carbs: 4.2, fat: 4.2 },
  { id: 'sweet-potato', name: '红薯', keywords: '地瓜 番薯 主食', kcal: 86, protein: 1.6, carbs: 20.1, fat: 0.1 },
  { id: 'potato', name: '土豆', keywords: '马铃薯 主食', kcal: 77, protein: 2, carbs: 17, fat: 0.1 },
  { id: 'whole-bread', name: '全麦面包', keywords: '面包 早餐 主食', kcal: 246, protein: 9, carbs: 46, fat: 4 },
  { id: 'greek-yogurt', name: '希腊酸奶', keywords: '酸奶 乳制品 早餐', kcal: 73, protein: 9.5, carbs: 4, fat: 2 },
  { id: 'milk', name: '纯牛奶', keywords: '牛奶 乳制品', kcal: 54, protein: 3, carbs: 5, fat: 3.2 },
  { id: 'whey', name: '乳清蛋白粉', keywords: '蛋白粉 补剂', kcal: 390, protein: 78, carbs: 8, fat: 6 },
  { id: 'broccoli', name: '西兰花', keywords: '蔬菜 绿色蔬菜', kcal: 34, protein: 2.8, carbs: 4.3, fat: 0.4 },
  { id: 'avocado', name: '牛油果', keywords: '鳄梨 水果 脂肪', kcal: 160, protein: 2, carbs: 8.5, fat: 14.7 },
  { id: 'banana', name: '香蕉', keywords: '水果 碳水', kcal: 93, protein: 1.4, carbs: 22, fat: 0.2 },
  { id: 'apple', name: '苹果', keywords: '水果', kcal: 53, protein: 0.3, carbs: 13.7, fat: 0.2 },
  { id: 'peanut', name: '花生', keywords: '坚果 脂肪', kcal: 567, protein: 25.8, carbs: 16.1, fat: 49.2 },
  { id: 'olive-oil', name: '橄榄油', keywords: '油脂 烹饪油', kcal: 884, protein: 0, carbs: 0, fat: 100 },
  { id: 'pork-tenderloin', name: '猪里脊', keywords: '猪肉 红肉', kcal: 143, protein: 20.2, carbs: 0, fat: 6.2 },
  { id: 'tuna', name: '金枪鱼', keywords: '鱼 罐头 海鲜', kcal: 132, protein: 28, carbs: 0, fat: 1.3 },
  { id: 'quinoa', name: '藜麦', keywords: '粗粮 主食', kcal: 368, protein: 14.1, carbs: 64.2, fat: 6.1 },
  { id: 'corn', name: '玉米', keywords: '粗粮 主食', kcal: 112, protein: 4, carbs: 22.8, fat: 1.2 },
  { id: 'noodles', name: '熟面条', keywords: '面条 主食', kcal: 137, protein: 4.5, carbs: 25.2, fat: 1.5 },
  { id: 'spinach', name: '菠菜', keywords: '蔬菜 绿叶菜', kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: 'cucumber', name: '黄瓜', keywords: '蔬菜', kcal: 15, protein: 0.8, carbs: 2.9, fat: 0.2 },
  { id: 'tomato', name: '番茄', keywords: '西红柿 蔬菜', kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2 },
  { id: 'carrot', name: '胡萝卜', keywords: '蔬菜 根茎', kcal: 41, protein: 0.9, carbs: 9.6, fat: 0.2 },
  { id: 'orange', name: '橙子', keywords: '水果', kcal: 47, protein: 0.9, carbs: 11.8, fat: 0.1 },
  { id: 'blueberry', name: '蓝莓', keywords: '水果 浆果', kcal: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
  { id: 'almond', name: '杏仁', keywords: '坚果', kcal: 579, protein: 21.2, carbs: 21.6, fat: 49.9 },
  { id: 'walnut', name: '核桃', keywords: '坚果 Omega-3', kcal: 654, protein: 15.2, carbs: 13.7, fat: 65.2 },
  { id: 'honey', name: '蜂蜜', keywords: '糖 碳水 调味', kcal: 304, protein: 0.3, carbs: 82.4, fat: 0 }
];

let state = loadState();
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
let selectedFood = null;
let mealEntryMode = 'library';
let scannerStream = null;
let scannerTimer = null;
let foodPhotoUrl = null;
let foodPhotoFile = null;
let deferredInstallPrompt = null;
let supabaseClient = null;
let cloudUser = null;
let cloudSaveTimer = null;
let cloudSyncBusy = false;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...structuredClone(defaultState), ...saved, profile: { ...defaultState.profile, ...(saved.profile || {}) }, wearable: { ...defaultState.wearable, ...(saved.wearable || {}) }, signals: { ...defaultState.signals, ...(saved.signals || {}) }, meals: saved.meals || structuredClone(defaultState.meals), weightLogs: saved.weightLogs || [...defaultState.weightLogs], trainingLogs: saved.trainingLogs || structuredClone(defaultState.trainingLogs), bodyLogs: saved.bodyLogs || structuredClone(defaultState.bodyLogs), adjustments: saved.adjustments || structuredClone(defaultState.adjustments) };
  } catch { return structuredClone(defaultState); }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudSave();
}

function setSyncStatus(message, mode = 'local') {
  if ($('#sync-status-text')) $('#sync-status-text').textContent = message;
  if ($('#cloud-account')) $('#cloud-account').dataset.syncMode = mode;
}

function scheduleCloudSave() {
  if (!supabaseClient || !cloudUser || cloudSyncBusy) return;
  clearTimeout(cloudSaveTimer);
  setSyncStatus('等待云同步…', 'pending');
  cloudSaveTimer = setTimeout(() => pushStateToCloud(), 900);
}

async function pushStateToCloud({ notify = false } = {}) {
  if (!supabaseClient || !cloudUser || cloudSyncBusy) return false;
  cloudSyncBusy = true;
  setSyncStatus('正在同步…', 'pending');
  try {
    const updatedAt = new Date().toISOString();
    const { error } = await supabaseClient.from('user_states').upsert({ user_id: cloudUser.id, state, updated_at: updatedAt }, { onConflict: 'user_id' });
    if (error) throw error;
    localStorage.setItem(CLOUD_UPDATED_KEY, updatedAt);
    setSyncStatus('云端已同步', 'cloud');
    if (notify) toast('数据已同步到云端');
    return true;
  } catch (error) {
    console.error('Cloud save failed', error);
    setSyncStatus('云同步失败 · 已存本地', 'error');
    if (notify) toast('云同步失败，数据仍已保存在本机');
    return false;
  } finally { cloudSyncBusy = false; }
}

async function reconcileCloudState() {
  if (!supabaseClient || !cloudUser) return;
  cloudSyncBusy = true;
  setSyncStatus('正在读取云端…', 'pending');
  try {
    const { data, error } = await supabaseClient.from('user_states').select('state, updated_at').eq('user_id', cloudUser.id).maybeSingle();
    if (error) throw error;
    const localUpdatedAt = localStorage.getItem(CLOUD_UPDATED_KEY);
    if (data?.state && (!localUpdatedAt || new Date(data.updated_at) > new Date(localUpdatedAt))) {
      state = { ...structuredClone(defaultState), ...data.state, profile: { ...defaultState.profile, ...(data.state.profile || {}) }, wearable: { ...defaultState.wearable, ...(data.state.wearable || {}) }, signals: { ...defaultState.signals, ...(data.state.signals || {}) } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      localStorage.setItem(CLOUD_UPDATED_KEY, data.updated_at);
      render();
      setSyncStatus('已从云端恢复', 'cloud');
      toast('已加载你的云端记录');
    } else if (!data) {
      cloudSyncBusy = false;
      await pushStateToCloud();
      return;
    } else setSyncStatus('云端已同步', 'cloud');
  } catch (error) {
    console.error('Cloud load failed', error);
    setSyncStatus('云端连接失败 · 已存本地', 'error');
  } finally { cloudSyncBusy = false; }
}

function updateAuthModal() {
  $('#auth-signed-out')?.classList.toggle('hidden', Boolean(cloudUser));
  $('#auth-signed-in')?.classList.toggle('hidden', !cloudUser);
  if ($('#account-email')) $('#account-email').textContent = cloudUser?.email || '';
}

async function initializeCloudSync() {
  try {
    const response = await fetch('/api/config', { cache: 'no-store' });
    const config = await response.json();
    if (!config.cloudSyncAvailable || !window.supabase?.createClient) {
      setSyncStatus('本地数据已保存', 'local');
      return;
    }
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const { data: { session } } = await supabaseClient.auth.getSession();
    cloudUser = session?.user || null;
    updateAuthModal();
    if (cloudUser) await reconcileCloudState(); else setSyncStatus('登录后可跨设备同步', 'local');
    supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user || null;
      const changed = nextUser?.id !== cloudUser?.id;
      cloudUser = nextUser;
      updateAuthModal();
      if (cloudUser && changed) setTimeout(reconcileCloudState, 0);
      if (!cloudUser) setSyncStatus('登录后可跨设备同步', 'local');
    });
  } catch (error) {
    console.error('Cloud initialization failed', error);
    setSyncStatus('本地数据已保存', 'local');
  }
}
function formatNumber(value) { return Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 1 }); }
function totals() { return state.meals.reduce((a, m) => ({ calories: a.calories + +m.calories, protein: a.protein + +m.protein, carbs: a.carbs + +m.carbs, fat: a.fat + +m.fat }), { calories: 0, protein: 0, carbs: 0, fat: 0 }); }
function goalMacros() { const w = state.profile.weight; return { protein: Math.round(w * 1.75), carbs: Math.round(w * state.profile.carbMultiplier), fat: Math.round(w * .7) }; }
function iconFor(type) { return type === '早餐' ? 'coffee' : type === '午餐' ? 'bowl' : type === '晚餐' ? 'moon' : 'cookie'; }
function searchFoods(query = '') { const normalized = query.trim().toLowerCase(); return foodCatalog.filter(food => !normalized || `${food.name} ${food.keywords}`.toLowerCase().includes(normalized)).slice(0, 8); }
function formatFoodMeta(food) { return `每 100g · ${food.kcal} kcal · P ${food.protein}g · C ${food.carbs}g · F ${food.fat}g`; }
function renderFoodResults(query = '') { const results = searchFoods(query); $('#food-results').innerHTML = results.length ? results.map(food => `<button type="button" class="food-result" data-food-id="${food.id}"><span><strong>${escapeHtml(food.name)}</strong><small>${escapeHtml(food.keywords)}</small></span><b>${food.kcal} kcal</b></button>`).join('') : '<div class="food-empty">没有匹配的本地食物，可以切换手动填写或查询条码。</div>'; }
function selectFood(food) { selectedFood = food; $('#selected-food').classList.add('has-selection'); $('#selected-food-name').textContent = food.name; $('#selected-food-meta').textContent = formatFoodMeta(food); updateSelectedFoodMeta(); }
function updateSelectedFoodMeta() { if (!selectedFood) return; const grams = Number($('#food-grams').value || 100); const factor = grams / 100; $('#selected-food-meta').textContent = `${grams}g · ${Math.round(selectedFood.kcal * factor)} kcal · P ${(selectedFood.protein * factor).toFixed(1)}g · C ${(selectedFood.carbs * factor).toFixed(1)}g · F ${(selectedFood.fat * factor).toFixed(1)}g`; }
function resetMealComposer() { selectedFood = null; mealEntryMode = 'library'; $('#food-search').value = ''; $('#food-grams').value = 100; $('#selected-food').classList.remove('has-selection'); $('#selected-food-name').textContent = '请选择一种食物'; $('#selected-food-meta').textContent = '每 100g · —'; $('#food-results').innerHTML = ''; $('#manual-entry').classList.add('hidden'); $('#library-entry').classList.remove('hidden'); $$('.food-entry-tabs button').forEach(button => button.classList.toggle('selected', button.dataset.entryMode === 'library')); if (foodPhotoUrl) URL.revokeObjectURL(foodPhotoUrl); foodPhotoUrl = null; foodPhotoFile = null; $('#photo-preview').classList.remove('visible'); $('#vision-result')?.classList.remove('visible'); stopScanner(); }
function setMealEntryMode(mode) { mealEntryMode = mode; $('#library-entry').classList.toggle('hidden', mode !== 'library'); $('#manual-entry').classList.toggle('hidden', mode !== 'manual'); $$('.food-entry-tabs button').forEach(button => button.classList.toggle('selected', button.dataset.entryMode === mode)); }
async function lookupBarcode() { const code = $('#barcode-input').value.trim(); if (!code) { toast('请先输入条形码'); return; } const local = foodCatalog.find(food => food.barcode === code); if (local) { selectFood(local); setMealEntryMode('library'); toast(`已找到 ${local.name}`); return; } toast('正在查询公开食品库'); try { const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`); const data = await response.json(); if (!data.product) throw new Error('not found'); const product = data.product; const n = product.nutriments || {}; const remote = { id: `remote-${code}`, name: product.product_name_zh || product.product_name || `条码 ${code}`, keywords: 'Open Food Facts', kcal: Number(n['energy-kcal_100g'] || (Number(n.energy_100g || 0) / 4.184)), protein: Number(n.proteins_100g || 0), carbs: Number(n.carbohydrates_100g || 0), fat: Number(n.fat_100g || 0) }; if (!remote.kcal && !remote.protein && !remote.carbs && !remote.fat) throw new Error('empty'); foodCatalog.unshift(remote); selectFood(remote); setMealEntryMode('library'); toast('已从公开食品库找到'); } catch { toast('没有找到该条码，请核对营养成分表后手动填写'); setMealEntryMode('manual'); } }
async function startScanner() { if (!('BarcodeDetector' in window)) { $('#scanner-status').textContent = '当前浏览器不支持原生条码扫描，请手动输入条码'; $('#scanner-panel').classList.add('visible'); return; } try { scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false }); const video = $('#barcode-video'); video.srcObject = scannerStream; await video.play(); $('#scanner-status').textContent = '正在识别…'; $('#scanner-panel').classList.add('visible'); const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] }); const scan = async () => { if (!scannerStream) return; try { const codes = await detector.detect(video); if (codes.length) { $('#barcode-input').value = codes[0].rawValue; stopScanner(); lookupBarcode(); return; } } catch { /* camera frames can be unavailable while the tab is hidden */ } scannerTimer = requestAnimationFrame(scan); }; scan(); } catch { $('#scanner-status').textContent = '无法打开摄像头，请检查浏览器权限或手动输入条码'; $('#scanner-panel').classList.add('visible'); } }
function stopScanner() { if (scannerTimer) cancelAnimationFrame(scannerTimer); scannerTimer = null; if (scannerStream) scannerStream.getTracks().forEach(track => track.stop()); scannerStream = null; const video = $('#barcode-video'); if (video) video.srcObject = null; const panel = $('#scanner-panel'); if (panel) panel.classList.remove('visible'); }
function handleFoodPhoto(file) { if (!file) return; if (foodPhotoUrl) URL.revokeObjectURL(foodPhotoUrl); foodPhotoFile = file; foodPhotoUrl = URL.createObjectURL(file); $('#food-photo-preview').src = foodPhotoUrl; $('#photo-preview').classList.add('visible'); $('#vision-result')?.classList.remove('visible'); toast('照片已加载，可以开始识别'); }
function ensureVisionControls() { if ($('#analyze-food-photo')) return; $('#photo-preview').insertAdjacentHTML('afterend', '<button type="button" class="analyze-photo-button" id="analyze-food-photo"><i data-lucide="sparkles"></i><span>识别食物与营养</span></button><div class="vision-result" id="vision-result"></div>'); }
function showVisionResult(result) { const ingredients = (result.items || []).map(item => `${escapeHtml(item.name)} ${Math.round(item.estimated_grams || 0)}g`).join('、') || '未能清晰识别食材'; const confidence = Math.round(Number(result.confidence || 0) * 100); $('#vision-result').innerHTML = `<div class="vision-result-head"><span><i data-lucide="sparkles"></i>视觉估算 · 置信度 ${confidence}%</span><button type="button" id="apply-vision-result">使用此估算</button></div><strong>${escapeHtml(result.meal_name || '识别结果')}</strong><p>${ingredients}</p><div class="vision-macros"><span>${Math.round(result.calories || 0)}<small>kcal</small></span><span>P ${Number(result.protein || 0).toFixed(1)}g</span><span>C ${Number(result.carbs || 0).toFixed(1)}g</span><span>F ${Number(result.fat || 0).toFixed(1)}g</span></div><em>${escapeHtml(result.note || '请根据实际份量确认')}</em>`; $('#vision-result').dataset.result = JSON.stringify(result); $('#vision-result').classList.add('visible'); lucide.createIcons(); }
async function analyzeFoodPhoto() { if (!foodPhotoFile) { toast('请先拍照或上传食物照片'); return; } const button = $('#analyze-food-photo'); button.disabled = true; button.classList.add('loading'); button.querySelector('span').textContent = '正在识别…'; try { const form = new FormData(); form.append('image', foodPhotoFile); const response = await fetch('/api/recognize-food', { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error || '识别服务暂时不可用'); showVisionResult(result); toast('已生成营养估算，请确认后使用'); } catch (error) { toast(error.message || '识别失败，请稍后重试'); } finally { button.disabled = false; button.classList.remove('loading'); button.querySelector('span').textContent = '识别食物与营养'; } }
function applyVisionResult() { const raw = $('#vision-result').dataset.result; if (!raw) return; const result = JSON.parse(raw); setMealEntryMode('manual'); const form = $('#meal-form'); form.elements.name.value = result.meal_name || ''; form.elements.calories.value = Math.round(result.calories || 0); form.elements.protein.value = Number(result.protein || 0).toFixed(1); form.elements.carbs.value = Number(result.carbs || 0).toFixed(1); form.elements.fat.value = Number(result.fat || 0).toFixed(1); toast('已带入估算值，请核对后保存'); }
function average(values) { return values.length ? values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length : 0; }
function rollingAverage(values, count) { return average(values.slice(-count)); }
function readinessScore() { const sleep = Math.min(100, Number(state.wearable.score || 0)); const energy = Number(state.signals.energy || 2) / 4 * 100; const hungerPenalty = Math.abs(Number(state.signals.hunger || 2) - 2) * 7; return Math.round(Math.max(0, Math.min(100, sleep * .45 + energy * .4 + 15 - hungerPenalty))); }
function adjustmentAdvice() {
  const hunger = Number(state.signals.hunger || 2); const energy = Number(state.signals.energy || 2); const trend = state.weightLogs.length >= 14 ? rollingAverage(state.weightLogs, 7) - average(state.weightLogs.slice(-14, -7)) : -0.2;
  if (energy <= 1 || Number(state.wearable.score) < 60) return '恢复信号偏低。今天先保证睡眠和进食，不建议继续扩大热量缺口。';
  if (hunger >= 4 && energy >= 2) return '饥饿感较强且训练状态尚可。建议将碳水小幅上调 0.2×，观察 7 天，不要一次加太多。';
  if (hunger === 1 && trend >= -0.05) return '饥饿感很低且趋势接近停滞。可以考虑将碳水下调 0.2×，同时保持蛋白质。';
  if (trend < -0.65) return '最近下降速度偏快。优先检查训练表现和睡眠，必要时把缺口缩小。';
  return `状态稳定。先保持当前 ${Number(state.profile.carbMultiplier).toFixed(1)}× 碳水，连续观察 7 天，不急着调整。`;
}

function render() {
  const t = totals(); const g = goalMacros(); const p = state.profile;
  $('#greeting-name').textContent = p.name.replace(/同学|先生|女士/g, '') || '朋友';
  $('#sidebar-name').textContent = p.name || '我的记录';
  $('#calorie-goal-label').textContent = formatNumber(p.calorieGoal); $('#protein-goal-label').textContent = formatNumber(g.protein); $('#carb-goal-label').textContent = formatNumber(g.carbs); $('#carb-multiplier-label').textContent = `${Number(p.carbMultiplier).toFixed(1)}×`;
  $('#calorie-total').textContent = formatNumber(t.calories); $('#calorie-left').textContent = formatNumber(Math.max(0, p.calorieGoal - t.calories));
  $('#protein-total').textContent = formatNumber(t.protein); $('#protein-left').textContent = formatNumber(Math.max(0, g.protein - t.protein));
  $('#carb-total').textContent = formatNumber(t.carbs); $('#sleep-total').textContent = `${Math.floor(state.wearable.sleep)}h ${Math.round((state.wearable.sleep % 1) * 60)}m`;
  $('#calorie-progress').style.width = `${Math.min(100, t.calories / p.calorieGoal * 100)}%`; $('#protein-progress').style.width = `${Math.min(100, t.protein / g.protein * 100)}%`; $('#carb-progress').style.width = `${Math.min(100, t.carbs / g.carbs * 100)}%`;
  $('#legend-protein').textContent = `${formatNumber(t.protein)}g`; $('#legend-carb').textContent = `${formatNumber(t.carbs)}g`; $('#legend-fat').textContent = `${formatNumber(t.fat)}g`;
  const caloriePct = Math.min(100, t.calories / p.calorieGoal * 100); $('#macro-ring').style.background = `conic-gradient(var(--green) 0 ${caloriePct}%, #e9f0ea ${caloriePct}% 100%)`; $('#macro-ring strong').textContent = `${Math.round(caloriePct)}%`;
  $('#current-weight').textContent = Number(state.weightLogs.at(-1) || p.weight).toFixed(1); $('#steps-value').textContent = formatNumber(state.wearable.steps); $('#burn-value').innerHTML = `${formatNumber(state.wearable.burn)} <small>kcal</small>`; $('#sleep-score').textContent = state.wearable.score;
  $('#coach-note-text').textContent = adjustmentAdvice(); $('#readiness-score').textContent = readinessScore(); $('#readiness-bar').style.width = `${readinessScore()}%`;
  renderSignals(); renderMeals(); renderNutritionTable(); renderTraining(); renderBody(); renderTrends(t); drawChart($('#weight-chart'), state.weightLogs, false); drawChart($('#large-weight-chart'), state.weightLogs, true); renderSettings(); ensureVisionControls();
  lucide.createIcons();
}

function renderSignals() { $$('.segmented').forEach(group => $$('.segmented button', group).forEach(button => button.classList.toggle('selected', +button.dataset.value === +state.signals[group.dataset.signal]))); }
function renderTraining() {
  const logs = state.trainingLogs || []; const totalVolume = logs.reduce((sum, item) => sum + Number(item.volume || 0), 0); const avgRpe = average(logs.map(item => item.rpe));
  $('#training-count').textContent = logs.length; $('#training-count-badge').textContent = `${logs.length} / 4 次`; $('#training-volume').textContent = formatNumber(totalVolume); $('#training-rpe').textContent = avgRpe ? avgRpe.toFixed(1) : '—';
  $('#session-list').innerHTML = logs.slice(0, 5).map(item => `<div class="session-row"><div class="session-icon"><i data-lucide="dumbbell"></i></div><div><strong>${escapeHtml(item.name)}</strong><span>${item.date} · ${item.focus} · ${item.duration} 分钟</span></div><div><b>${formatNumber(item.volume)}</b><small>kg · RPE ${Number(item.rpe).toFixed(1)}</small></div></div>`).join('') || '<p class="empty-state">还没有训练记录，先记录今天的第一堂训练。</p>';
}
function renderBody() {
  const latest = state.bodyLogs?.at(-1); if (!latest) return; $('#body-log-date').textContent = latest.date; $('#measurement-grid').innerHTML = [['腰围', latest.waist, 'cm', 'green'], ['胸围', latest.chest, 'cm', 'blue'], ['臀围', latest.hip, 'cm', 'orange'], ['大腿', latest.thigh, 'cm', 'violet'], ['手臂', latest.arm, 'cm', 'green'], ['体脂率', latest.bodyFat || '—', '%', 'blue']].map(([label, value, unit, tone]) => `<div class="measurement-item ${tone}"><span>${label}</span><strong>${value}</strong><small>${unit}</small></div>`).join('');
}
function renderTrends(t) {
  const current = Number(state.weightLogs.at(-1) || state.profile.weight); const avg14 = rollingAverage(state.weightLogs, 14); const previous = average(state.weightLogs.slice(-28, -14)); const delta = previous ? avg14 - previous : -0.4; const expenditure = Math.round(Number(state.profile.calorieGoal) + 270);
  $('#trend-weight').textContent = current.toFixed(1); $('#trend-average').textContent = `${avg14.toFixed(1)} kg`; $('#trend-change').textContent = `${delta <= 0 ? '↓' : '↑'} ${Math.abs(delta).toFixed(1)} kg`; $('#avg-intake').textContent = formatNumber(Math.max(0, t.calories)); $('#avg-expenditure').textContent = formatNumber(expenditure); $('#avg-deficit').textContent = formatNumber(Math.max(0, expenditure - t.calories));
  const adjustment = state.adjustments || []; $('#adjustment-timeline').innerHTML = adjustment.map((item, index) => `<div class="timeline-item"><span class="timeline-dot ${index === 0 ? 'current' : ''}"></span><div><strong>${escapeHtml(item.date)} · ${escapeHtml(item.title)}</strong><p>${escapeHtml(item.detail)}</p></div></div>`).join('');
  $('#signal-summary').innerHTML = [['饥饿感', state.signals.hunger, ['无', '微微', '明显', '很强']], ['训练状态', state.signals.energy, ['低', '一般', '好', '很棒']], ['消化状态', state.signals.digestion, ['不适', '一般', '舒服']]].map(([label, value, labels]) => `<div><span>${label}</span><b>${labels[value - 1] || '未记录'}</b><i class="signal-level level-${value}"></i></div>`).join('');
}

function renderMeals() {
  $('#meal-list').innerHTML = state.meals.map(m => `<div class="meal-row"><div class="meal-icon ${m.type === '早餐' ? 'breakfast' : m.type === '午餐' ? 'lunch' : m.type === '晚餐' ? 'dinner' : 'snack'}"><i data-lucide="${iconFor(m.type)}"></i></div><div class="meal-copy"><strong>${escapeHtml(m.name)}</strong><span>${m.type} · P ${formatNumber(m.protein)}g · C ${formatNumber(m.carbs)}g · F ${formatNumber(m.fat)}g</span></div><div class="meal-kcal"><strong>${formatNumber(m.calories)} kcal</strong><span>已记录</span></div></div>`).join('');
}
function renderNutritionTable() {
  const head = '<div class="table-head"><span>食物</span><span>餐次</span><span>热量</span><span>蛋白质</span><span>碳水</span><span></span></div>';
  const rows = state.meals.map(m => `<div class="table-row"><strong>${escapeHtml(m.name)}</strong><span>${m.type}</span><span>${formatNumber(m.calories)} kcal</span><span>${formatNumber(m.protein)} g</span><span>${formatNumber(m.carbs)} g</span><button class="delete-meal" data-delete-meal="${m.id}" title="删除"><i data-lucide="trash-2"></i></button></div>`).join('');
  $('#nutrition-table').innerHTML = head + rows;
}
function renderSettings() { const form = $('#settings-form'); if (!form) return; Object.entries(state.profile).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; }); }
function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }

function drawChart(svg, values, large) {
  if (!svg || !values.length) return; const width = large ? 720 : 640; const height = large ? 230 : 170; const pad = large ? 20 : 14; const min = Math.min(...values) - .3; const max = Math.max(...values) + .3; const x = i => pad + (width - pad * 2) * i / (values.length - 1); const y = v => height - pad - (height - pad * 2) * (v - min) / (max - min);
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' '); const area = `${pad},${height-pad} ${points} ${width-pad},${height-pad}`;
  let lines = [0, .5, 1].map(r => `<line x1="${pad}" x2="${width-pad}" y1="${pad + (height-pad*2)*r}" y2="${pad + (height-pad*2)*r}" stroke="#edf1ed" stroke-width="1"/>`).join('');
  svg.innerHTML = `${lines}<polygon points="${area}" fill="#eaf5ed"/><polyline points="${points}" fill="none" stroke="#3d8d64" stroke-width="${large ? 3 : 2}" stroke-linejoin="round" stroke-linecap="round"/>${values.map((v,i)=>i===values.length-1?`<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="#fff" stroke="#237a56" stroke-width="2"/>`: '').join('')}`;
}

function showModal(id) { if (id === 'meal-modal') { resetMealComposer(); renderFoodResults(''); } $(`#${id}`).classList.add('open'); const first = $(`#${id} input`); if (first) setTimeout(() => first.focus(), 50); }
function closeModal(id) { $(`#${id}`).classList.remove('open'); }
function toast(message = '已保存') { $('#toast span').textContent = message; $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 2200); }

function navigate(view) { $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view)); $$('.view').forEach(v => v.classList.toggle('active', v.id === `${view}-view`)); window.scrollTo({ top: 0, behavior: 'smooth' }); }

window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstallPrompt = event; $('#install-app').classList.remove('hidden'); });
window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; $('#install-app').classList.add('hidden'); toast('已添加到设备桌面'); });

document.addEventListener('click', e => {
  const nav = e.target.closest('[data-view]'); if (nav) navigate(nav.dataset.view);
  const target = e.target.closest('[data-view-target]'); if (target) navigate(target.dataset.viewTarget);
  const open = e.target.closest('#quick-add,#add-meal-row,#nutrition-add'); if (open) showModal('meal-modal');
  const template = e.target.closest('[data-template]'); if (template) { const presets = { 'chicken-rice': ['鸡胸肉饭', '午餐', 528, 38, 64, 13], 'protein-shake': ['乳清蛋白', '加餐', 142, 24, 6, 2], yogurt: ['希腊酸奶 · 蓝莓 · 燕麦', '早餐', 386, 24, 48, 11] }; const item = presets[template.dataset.template]; if (item) { state.meals.push({ id: Date.now(), name: item[0], type: item[1], calories: item[2], protein: item[3], carbs: item[4], fat: item[5] }); saveState(); render(); toast('快捷食物已添加'); } }
  const mode = e.target.closest('[data-entry-mode]'); if (mode) setMealEntryMode(mode.dataset.entryMode);
  const foodResult = e.target.closest('[data-food-id]'); if (foodResult) { const food = foodCatalog.find(item => item.id === foodResult.dataset.foodId); if (food) selectFood(food); }
  if (e.target.closest('#lookup-barcode')) lookupBarcode(); if (e.target.closest('#scan-barcode')) startScanner(); if (e.target.closest('#stop-scanner')) stopScanner();
  if (e.target.closest('#analyze-food-photo')) analyzeFoodPhoto(); if (e.target.closest('#apply-vision-result')) applyVisionResult();
  if (e.target.closest('#clear-food-photo')) { if (foodPhotoUrl) URL.revokeObjectURL(foodPhotoUrl); foodPhotoUrl = null; foodPhotoFile = null; $('#food-photo-input').value = ''; $('#photo-preview').classList.remove('visible'); $('#vision-result')?.classList.remove('visible'); }
  if (e.target.closest('#log-weight')) showModal('weight-modal'); if (e.target.closest('#wearable-entry,#edit-wearable')) { const f = $('#wearable-form'); f.steps.value = state.wearable.steps; f.burn.value = state.wearable.burn; f.sleep.value = state.wearable.sleep; f.score.value = state.wearable.score; showModal('wearable-modal'); }
  if (e.target.closest('#training-entry')) showModal('training-modal'); if (e.target.closest('#body-entry')) showModal('body-modal'); if (e.target.closest('#body-photo-entry')) toast('照片入口已预留，后续可按周绑定到围度记录');
  if (e.target.closest('#open-settings,#open-settings-top')) showModal('settings-modal');
  if (e.target.closest('#cloud-account')) { updateAuthModal(); showModal('auth-modal'); }
  if (e.target.closest('#install-app')) { if (!deferredInstallPrompt) { toast('请在浏览器菜单中选择“添加到主屏幕”'); } else { deferredInstallPrompt.prompt(); deferredInstallPrompt.userChoice.finally(() => { deferredInstallPrompt = null; $('#install-app').classList.add('hidden'); }); } }
  const close = e.target.closest('[data-close-modal]'); if (close) closeModal(close.dataset.closeModal);
  if (e.target.classList.contains('modal-backdrop')) e.target.classList.remove('open');
  const signal = e.target.closest('.segmented button'); if (signal) { const group = signal.closest('.segmented'); $$('.segmented button', group).forEach(b => b.classList.remove('selected')); signal.classList.add('selected'); state.signals[group.dataset.signal] = +signal.dataset.value; saveState(); toast('反馈已保存'); }
  const del = e.target.closest('[data-delete-meal]'); if (del) { state.meals = state.meals.filter(m => m.id !== +del.dataset.deleteMeal); saveState(); render(); toast('已删除这条记录'); }
});

$('#food-search').addEventListener('input', e => renderFoodResults(e.target.value)); $('#food-grams').addEventListener('input', updateSelectedFoodMeta); $('#food-photo-input').addEventListener('change', e => handleFoodPhoto(e.target.files?.[0]));
$('#auth-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!supabaseClient) { toast('云同步尚未配置'); return; }
  const email = new FormData(e.target).get('email')?.toString().trim();
  if (!email) return;
  const button = e.target.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}${location.pathname}` } });
    if (error) throw error;
    toast('登录链接已发送，请检查邮箱');
    closeModal('auth-modal');
  } catch (error) { toast(error.message || '发送失败，请稍后再试'); }
  finally { button.disabled = false; }
});
$('#sync-now').addEventListener('click', () => pushStateToCloud({ notify: true }));
$('#sign-out').addEventListener('click', async () => { if (!supabaseClient) return; await supabaseClient.auth.signOut(); cloudUser = null; updateAuthModal(); closeModal('auth-modal'); toast('已退出云同步，数据仍保留在本机'); });
$('#meal-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); let meal; if (mealEntryMode === 'library') { if (!selectedFood) { toast('请先从食物库选择一种食物'); return; } const grams = Number($('#food-grams').value || 100); const factor = grams / 100; meal = { name: `${selectedFood.name} · ${grams}g`, calories: Math.round(selectedFood.kcal * factor), protein: +(selectedFood.protein * factor).toFixed(1), carbs: +(selectedFood.carbs * factor).toFixed(1), fat: +(selectedFood.fat * factor).toFixed(1) }; } else { if (!d.name || !d.calories || !d.protein || !d.carbs || !d.fat) { toast('请把手动营养数据填写完整'); return; } meal = { name: d.name, calories: +d.calories, protein: +d.protein, carbs: +d.carbs, fat: +d.fat }; } state.meals.push({ id: Date.now(), type: d.type, ...meal, barcode: d.barcode || '' }); saveState(); e.target.reset(); closeModal('meal-modal'); render(); toast('这一餐已记录'); });
$('#weight-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); state.weightLogs.push(+d.weight); state.profile.weight = +d.weight; saveState(); closeModal('weight-modal'); render(); toast('体重已记录'); });
$('#wearable-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); state.wearable = { steps: +d.steps, burn: +d.burn, sleep: +d.sleep, score: +d.score }; saveState(); closeModal('wearable-modal'); render(); toast('手环数据已更新'); });
$('#settings-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); state.profile = { name: d.name, weight: +d.weight, height: +d.height, age: +d.age, calorieGoal: +d.calorieGoal, carbMultiplier: +d.carbMultiplier }; saveState(); closeModal('settings-modal'); render(); toast('个人参数已保存'); });
$('#training-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); state.trainingLogs.unshift({ id: Date.now(), date: `${new Date().getMonth() + 1}月${new Date().getDate()}日`, name: d.name, focus: d.focus, duration: +d.duration, volume: +d.volume, rpe: +d.rpe, note: d.note }); saveState(); e.target.reset(); closeModal('training-modal'); render(); toast('训练已记录'); });
$('#body-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); state.bodyLogs.push({ date: `${new Date().getMonth() + 1}月${new Date().getDate()}日`, waist: +d.waist, chest: +d.chest, hip: +d.hip, thigh: +d.thigh, arm: +d.arm, bodyFat: d.bodyFat ? +d.bodyFat : null }); saveState(); e.target.reset(); closeModal('body-modal'); render(); toast('身体测量已保存'); });
$('#recovery-entry').addEventListener('click', () => { const f = $('#wearable-form'); f.steps.value = state.wearable.steps; f.burn.value = state.wearable.burn; f.sleep.value = state.wearable.sleep; f.score.value = state.wearable.score; showModal('wearable-modal'); });

const now = new Date(); const weekdays = ['日','一','二','三','四','五','六']; $('#today-label').textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
render(); lucide.createIcons(); initializeCloudSync();
