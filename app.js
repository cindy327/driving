(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const regions = {
    magok: { label: '마곡나루', query: '마곡나루역', fallback: [37.5666,126.8274] },
    yeongdeungpo: { label: '영등포', query: '영등포역', fallback: [37.5155,126.9076] },
    gwangmyeong: { label: '광명', query: '광명역', fallback: [37.4162,126.8845] }
  };

  const levels = [
    {
      id:0, icon:'🅿️', title:'차량 기초 조작', desc:'브레이크 · 기어 · 방향지시등 · 거울 확인', region:null,
      steps:[
        {title:'브레이크를 밟아보세요.', hint:'출발 전 가장 먼저 브레이크를 밟아 차량이 움직이지 않게 합니다.', expect:'brake'},
        {title:'주행 기어 D를 선택하세요.', hint:'브레이크를 밟은 상태라고 가정하고 D를 선택합니다.', expect:'gearD'},
        {title:'좌측 거울을 확인하세요.', hint:'출발 전 주변 차량과 보행자를 확인합니다.', expect:'mirror'},
        {title:'좌측 방향지시등을 켜세요.', hint:'도로로 진입한다는 의사를 미리 알립니다.', expect:'leftSignal'}
      ]
    },
    {
      id:1, icon:'🚦', title:'신호와 정지선', desc:'적색신호 · 황색신호 · 정지선 앞 정차', region:null,
      steps:[
        {title:'적색신호입니다. 무엇을 해야 할까요?', hint:'정지선 전에 멈춰야 합니다.', quiz:[['브레이크로 정지한다',true],['속도를 올려 통과한다',false],['비상등을 켜고 통과한다',false]]},
        {title:'정지선 앞에서 브레이크를 밟으세요.', hint:'차 앞부분이 정지선을 넘지 않도록 충분히 미리 감속합니다.', expect:'brake', scene:'stop'},
        {title:'녹색이 되었지만 보행자가 남아 있습니다.', hint:'신호만 보지 말고 횡단보도 상황을 확인합니다.', quiz:[['보행자가 완전히 지나갈 때까지 기다린다',true],['뒤차가 기다리니 바로 출발한다',false]]}
      ]
    },
    {
      id:2, icon:'↔️', title:'차선 변경', desc:'거울 → 방향지시등 → 사각지대 → 부드럽게 이동', region:null,
      steps:[
        {title:'차선 변경 전 첫 행동은?', hint:'주변 차량의 위치부터 파악합니다.', expect:'mirror'},
        {title:'왼쪽 차로로 이동하려고 합니다.', hint:'충분히 미리 방향지시등을 켭니다.', expect:'leftSignal'},
        {title:'뒤 차량과 거리가 충분합니다.', hint:'급하게 핸들을 꺾지 말고 부드럽게 이동한다고 가정합니다.', expect:'laneLeft'}
      ]
    },
    {
      id:3, icon:'🏙️', title:'마곡나루 실제도로', desc:'넓은 도로에서 신호 · 차선 선택 연습', region:'magok',
      steps:[
        {title:'로드뷰 화살표로 한 블록 전진해 보세요.', hint:'실제 도로의 차선 수, 정지선, 횡단보도를 먼저 관찰하세요.', roadMove:true},
        {title:'교차로 접근 전 속도를 줄여보세요.', hint:'브레이크를 가볍게 눌러 감속합니다.', expect:'brake'},
        {title:'오른쪽으로 진입한다고 가정합니다.', hint:'거울 확인 후 우측 방향지시등을 켭니다.', expect:'rightSignal'}
      ]
    },
    {
      id:4, icon:'🚌', title:'영등포 실제도로', desc:'버스 · 보행자 · 복합 교차로 판단', region:'yeongdeungpo',
      steps:[
        {title:'로드뷰를 이동하며 버스와 보행자 동선을 확인하세요.', hint:'복잡한 곳일수록 속도보다 시야 확보가 우선입니다.', roadMove:true},
        {title:'앞 차량이 갑자기 감속했습니다.', hint:'급조향보다 먼저 충분한 제동거리를 확보합니다.', expect:'brake', scene:'hazard'},
        {title:'길을 놓쳤습니다. 어떻게 해야 할까요?', hint:'급격한 차선변경을 피하는 것이 핵심입니다.', quiz:[['현재 차로를 유지하고 재탐색한다',true],['교차로 직전이라도 급히 차선을 바꾼다',false]]}
      ]
    },
    {
      id:5, icon:'🛣️', title:'광명 실제도로', desc:'속도 조절 · 긴 구간 · 진출입 적응', region:'gwangmyeong',
      steps:[
        {title:'로드뷰로 전방 시야를 충분히 확보하세요.', hint:'먼 곳의 신호와 차선 흐름을 먼저 읽습니다.', roadMove:true},
        {title:'진출입로 접근 전 무엇부터?', hint:'거울로 뒤차 위치를 확인합니다.', expect:'mirror'},
        {title:'진출 차로가 오른쪽입니다.', hint:'우측 방향지시등을 켜고 충분한 간격이 있을 때 이동합니다.', expect:'rightSignal'}
      ]
    },
    {
      id:6, icon:'⚠️', title:'돌발상황 종합', desc:'급정거 · 보행자 · 구급차 · 경로이탈', region:null,
      steps:[
        {title:'앞차가 갑자기 급정거했습니다!', hint:'먼저 속도를 줄이고 조향은 최소화합니다.', expect:'brake', scene:'hazard'},
        {title:'비상상황으로 정차가 필요합니다.', hint:'안전한 곳에 정차한 뒤 주변 차량에 알립니다.', expect:'hazard'},
        {title:'내비 안내를 놓쳐 진입로를 지났습니다.', hint:'안전한 다음 경로를 선택하세요.', quiz:[['현재 차로 유지 후 재탐색',true],['후진해서 진입로로 돌아감',false],['급정거 후 차선 변경',false]]}
      ]
    }
  ];

  let state = JSON.parse(localStorage.getItem('drivingLabState') || '{}');
  state.completed ??= [];
  state.xp ??= 0;
  state.currentLevel ??= null;
  state.selectedRegion ??= 'magok';

  let training = { level:null, step:0, score:100, roadMoved:false };
  let car = { speed:0, gear:'P', signal:'—' };
  let roadview = null, roadviewClient = null, places = null, kakaoReady = false;

  const els = {
    levelGrid: $('#levelGrid'), trainingSection: $('#trainingSection'), rankLabel: $('#rankLabel'), xpLabel: $('#xpLabel'), xpBar: $('#xpBar'), progressText: $('#progressText'), completedLabel: $('#completedLabel'),
    levelEyebrow: $('#levelEyebrow'), missionTitle: $('#missionTitle'), stepCount: $('#stepCount'), scoreLabel: $('#scoreLabel'), stepTitle: $('#stepTitle'), stepHint: $('#stepHint'), feedback: $('#feedback'), quizArea: $('#quizArea'), nextStepBtn: $('#nextStepBtn'),
    speedValue: $('#speedValue'), gearValue: $('#gearValue'), signalValue: $('#signalValue'), simScene: $('#simScene'), roadviewEl: $('#roadview'), roadviewStatus: $('#roadviewStatus'), regionLabel: $('#regionLabel'), stopLine: $('#stopLine'), hazardObject: $('#hazardObject'), trafficLight: $('#trafficLight'), apiBadge: $('#apiBadge')
  };

  function save(){ localStorage.setItem('drivingLabState', JSON.stringify(state)); }
  function isUnlocked(id){ return id === 0 || state.completed.includes(id-1) || state.completed.includes(id); }

  function renderLevels(){
    els.levelGrid.innerHTML = '';
    levels.forEach(level => {
      const unlocked = isUnlocked(level.id), complete = state.completed.includes(level.id);
      const btn = document.createElement('button');
      btn.className = `level-card ${!unlocked?'locked':''} ${complete?'complete':''}`;
      btn.innerHTML = `<span class="level-icon">${level.icon}</span><span class="level-status">${complete?'✅':unlocked?'▶️':'🔒'}</span><strong>LEVEL ${level.id} · ${level.title}</strong><span>${level.desc}</span>`;
      btn.onclick = () => unlocked ? startLevel(level.id) : toast('앞 단계를 먼저 완료하세요.', false);
      els.levelGrid.appendChild(btn);
    });
    updateProgress();
  }

  function updateProgress(){
    const n = state.completed.length;
    const ranks = n >= 7 ? ['🏆 실전 준비 운전자','모든 훈련 완료'] : n >= 5 ? ['🛣️ 실전 운전자','복합 도로 훈련 중'] : n >= 3 ? ['🚙 도심 운전자','실제 도로 훈련 중'] : n >= 1 ? ['🚗 동네 운전자','기초 감각을 만드는 중'] : ['🐣 초보 운전자','첫 미션부터 천천히 시작하세요.'];
    els.rankLabel.textContent = ranks[0]; els.progressText.textContent = ranks[1]; els.xpLabel.textContent = `${state.xp} XP`; els.completedLabel.textContent = `${n}/7 완료`; els.xpBar.style.width = `${Math.min(100,n/7*100)}%`;
  }

  function startLevel(id){
    training = {level:levels[id], step:0, score:100, roadMoved:false}; state.currentLevel = id; save();
    els.trainingSection.classList.remove('hidden');
    els.levelEyebrow.textContent = `LEVEL ${id}`; els.missionTitle.textContent = levels[id].title;
    if(levels[id].region){ selectRegion(levels[id].region); showRoadview(); } else { showSimulation(); }
    car = {speed:0,gear:'P',signal:'—'}; updateCar(); renderStep(); els.trainingSection.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderStep(){
    const step = training.level.steps[training.step];
    els.stepCount.textContent = `${training.step+1} / ${training.level.steps.length}`; els.scoreLabel.textContent = `점수 ${training.score}`; els.stepTitle.textContent = step.title; els.stepHint.textContent = step.hint;
    els.nextStepBtn.classList.add('hidden'); els.quizArea.classList.add('hidden'); els.quizArea.innerHTML='';
    setFeedback(step.roadMove && !kakaoReady ? 'API 미연결 상태라 실제 이동 대신 「다음 미션」으로 체험할 수 있습니다.' : '행동을 선택하세요.', 'neutral');
    applyScene(step.scene);
    if(step.quiz){
      els.quizArea.classList.remove('hidden');
      step.quiz.forEach(([label,ok]) => { const b=document.createElement('button'); b.className='quiz-option'; b.textContent=label; b.onclick=()=>judgeQuiz(ok,b); els.quizArea.appendChild(b); });
    }
    if(step.roadMove && !kakaoReady) els.nextStepBtn.classList.remove('hidden');
  }

  function applyScene(scene){
    els.stopLine.classList.toggle('hidden', scene!=='stop'); els.hazardObject.classList.toggle('hidden', scene!=='hazard');
    [...els.trafficLight.children].forEach(x=>x.classList.remove('on'));
    (scene==='stop' ? els.trafficLight.querySelector('.red') : els.trafficLight.querySelector('.green')).classList.add('on');
  }

  function handleAction(action){
    if(!training.level) return;
    if(action==='brake') car.speed=Math.max(0,car.speed-18);
    if(action==='accel') car.speed=Math.min(80,car.speed+10);
    if(action==='gearP') car.gear='P'; if(action==='gearD') car.gear='D'; if(action==='gearR') car.gear='R';
    if(action==='leftSignal') car.signal='◀'; if(action==='rightSignal') car.signal='▶'; if(action==='hazard') car.signal='⚠';
    updateCar();
    const step=training.level.steps[training.step]; if(!step.expect) return;
    if(action===step.expect) succeed('좋아요. 이 순서를 실제 차에서도 천천히 반복하면 됩니다.');
    else { training.score=Math.max(0,training.score-5); els.scoreLabel.textContent=`점수 ${training.score}`; setFeedback('지금 미션과 다른 조작입니다. 힌트를 다시 확인해 보세요.', 'bad'); }
  }

  function judgeQuiz(ok,button){
    $$('.quiz-option').forEach(x=>x.disabled=true);
    if(ok){ button.textContent='✅ '+button.textContent; succeed('정확합니다. 안전을 우선하는 판단입니다.'); }
    else { training.score=Math.max(0,training.score-10); button.textContent='❌ '+button.textContent; setFeedback('위험할 수 있는 선택입니다. 정답을 확인하고 다시 기억해 두세요.', 'bad'); els.scoreLabel.textContent=`점수 ${training.score}`; els.nextStepBtn.classList.remove('hidden'); }
  }

  function succeed(msg){ setFeedback(msg,'good'); els.nextStepBtn.classList.remove('hidden'); }
  function setFeedback(msg,type){ els.feedback.textContent=msg; els.feedback.className=`feedback ${type}`; }
  function updateCar(){ els.speedValue.textContent=car.speed; els.gearValue.textContent=car.gear; els.signalValue.textContent=car.signal; }
  function toast(msg,good=true){ setFeedback(msg,good?'good':'bad'); }

  function nextStep(){
    if(!training.level) return;
    const step=training.level.steps[training.step];
    if(step.roadMove && kakaoReady && !training.roadMoved){ setFeedback('로드뷰 안의 화살표를 눌러 실제 위치를 한 번 이동해 주세요.', 'bad'); return; }
    if(training.step < training.level.steps.length-1){ training.step++; training.roadMoved=false; renderStep(); return; }
    completeLevel();
  }

  function completeLevel(){
    const id=training.level.id;
    if(!state.completed.includes(id)){ state.completed.push(id); state.completed.sort((a,b)=>a-b); state.xp += Math.max(60,training.score); }
    save(); renderLevels(); setFeedback(`LEVEL ${id} 완료! +${Math.max(60,training.score)} XP`, 'good'); els.nextStepBtn.classList.add('hidden');
    setTimeout(()=>{ els.trainingSection.classList.add('hidden'); training={level:null,step:0,score:100,roadMoved:false}; },700);
  }

  function selectRegion(key){
    state.selectedRegion=key; save(); const r=regions[key]; els.regionLabel.textContent=r.label; $$('.region-btn').forEach(b=>b.classList.toggle('active',b.dataset.region===key));
    if(kakaoReady) loadRegionRoadview(key);
  }

  function showSimulation(){ els.roadviewEl.classList.add('hidden'); els.simScene.classList.remove('hidden'); els.roadviewStatus.textContent='시뮬레이션'; els.regionLabel.textContent='연습장'; }
  function showRoadview(){ if(kakaoReady){ els.simScene.classList.add('hidden'); els.roadviewEl.classList.remove('hidden'); els.roadviewStatus.textContent='실제 로드뷰'; loadRegionRoadview(training.level.region || state.selectedRegion); } else { showSimulation(); els.regionLabel.textContent=regions[training.level.region || state.selectedRegion].label; els.roadviewStatus.textContent='API 미연결'; } }

  function loadKakao(){
    const key=window.APP_CONFIG?.KAKAO_JS_KEY?.trim();
    if(!key){ els.apiBadge.textContent='미연결'; els.apiBadge.className='badge off'; return; }
    const script=document.createElement('script');
    script.src=`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(key)}&libraries=services&autoload=false`;
    script.onload=()=>window.kakao.maps.load(()=>{
      kakaoReady=true; els.apiBadge.textContent='연결됨'; els.apiBadge.className='badge on'; els.roadviewStatus.textContent='실제 로드뷰';
      roadview=new kakao.maps.Roadview(els.roadviewEl); roadviewClient=new kakao.maps.RoadviewClient(); places=new kakao.maps.services.Places();
      kakao.maps.event.addListener(roadview,'position_changed',()=>{ training.roadMoved=true; if(training.level?.steps?.[training.step]?.roadMove) succeed('좋습니다. 실제 도로를 한 지점 이동했습니다. 주변 표지와 차선을 다시 확인하세요.'); });
      if(training.level?.region) showRoadview();
    });
    script.onerror=()=>{ els.apiBadge.textContent='키/도메인 확인'; els.apiBadge.className='badge off'; };
    document.head.appendChild(script);
  }

  function loadRegionRoadview(key){
    if(!kakaoReady || !roadviewClient) return; const r=regions[key]; els.regionLabel.textContent=r.label;
    places.keywordSearch(r.query,(data,status)=>{
      let lat=r.fallback[0],lng=r.fallback[1];
      if(status===kakao.maps.services.Status.OK && data[0]){ lat=Number(data[0].y); lng=Number(data[0].x); }
      const pos=new kakao.maps.LatLng(lat,lng);
      roadviewClient.getNearestPanoId(pos,120,(panoId)=>{
        if(!panoId){ setFeedback(`${r.label} 주변 로드뷰를 찾지 못했습니다. 다른 위치를 선택해 주세요.`,'bad'); return; }
        roadview.setPanoId(panoId,pos); setTimeout(()=>roadview.relayout(),100);
      });
    });
  }

  $$('.control').forEach(b=>b.addEventListener('click',()=>handleAction(b.dataset.action)));
  $$('.region-btn').forEach(b=>b.addEventListener('click',()=>{ selectRegion(b.dataset.region); if(kakaoReady){ els.simScene.classList.add('hidden'); els.roadviewEl.classList.remove('hidden'); } }));
  els.nextStepBtn.onclick=nextStep;
  $('#closeTrainingBtn').onclick=()=>els.trainingSection.classList.add('hidden');
  $('#resetBtn').onclick=()=>{ if(confirm('훈련 진행도를 초기화할까요?')){ localStorage.removeItem('drivingLabState'); location.reload(); } };
  document.addEventListener('keydown',(e)=>{ const keyMap={ArrowDown:'brake',ArrowUp:'accel',q:'leftSignal',e:'rightSignal',' ':'hazard'}; if(keyMap[e.key]){ e.preventDefault(); handleAction(keyMap[e.key]); } });

  renderLevels(); selectRegion(state.selectedRegion); loadKakao();
})();
