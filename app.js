(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const LABELS = { observation:'관찰', signal:'신호', control:'조작', judgment:'판단' };
  const ACTION_LABELS = { brake:'브레이크', accel:'가속', gearP:'P', gearD:'D', gearR:'R', leftSignal:'좌측 깜빡이', rightSignal:'우측 깜빡이', hazard:'비상등', mirror:'거울 확인', blindSpot:'사각지대', look:'전방 확인', laneLeft:'왼쪽 이동', laneRight:'오른쪽 이동' };

  const levels = [
    {id:0,icon:'🪪',title:'운전석 기초',desc:'브레이크 · 기어 · 거울 · 방향지시등',steps:[
      {title:'출발 전 브레이크를 먼저 밟으세요.',hint:'차가 움직이지 않게 만든 뒤 다음 조작을 시작합니다.',expect:'brake',skill:'control'},
      {title:'주행 기어 D를 선택하세요.',hint:'브레이크를 밟고 있다는 가정 아래 D를 선택합니다.',expect:'gearD',skill:'control'},
      {title:'룸미러와 사이드미러를 확인하세요.',hint:'출발 전 주변 상황을 확인하는 습관을 만듭니다.',expect:'mirror',skill:'observation'},
      {title:'도로로 나간다고 가정하고 좌측 깜빡이를 켜세요.',hint:'움직이기 전에 먼저 의사를 알립니다.',expect:'leftSignal',skill:'signal'},
      {title:'아주 천천히 출발해 보세요.',hint:'가속 페달을 한 번 눌러 저속으로 출발합니다.',expect:'accel',skill:'control'}]},
    {id:1,icon:'🚗',title:'출발과 정지',desc:'출발 순서 · 저속 유지 · 부드러운 정차',steps:[
      {title:'출발 순서를 완성하세요.',hint:'거울 → 좌측 깜빡이 → 가속 순서로 연습합니다.',sequence:['mirror','leftSignal','accel'],skill:'judgment'},
      {title:'앞쪽 정지 지점을 확인하세요.',hint:'가속보다 먼저 전방을 확인하세요.',expect:'look',skill:'observation',scene:{message:'50m 앞 정지'}},
      {title:'부드럽게 정지하세요.',hint:'미리 감속하고 완전히 멈춥니다.',expect:'brake',skill:'control',scene:{stop:true}},
      {title:'완전히 세워둔다면 P를 선택하세요.',hint:'차량을 안전하게 고정합니다.',expect:'gearP',skill:'control'}]},
    {id:2,icon:'🚦',title:'신호와 정지선',desc:'적색 · 황색 · 녹색 · 횡단보도',steps:[
      {title:'적색신호입니다. 어떻게 해야 할까요?',hint:'정지선을 넘기 전에 멈추는 것이 핵심입니다.',quiz:[['정지선 전에 감속해 정지한다',true],['뒤차가 가까우면 그대로 통과한다',false],['비상등을 켜고 지나간다',false]],skill:'judgment',scene:{light:'red',stop:true}},
      {title:'정지선에 접근했습니다.',hint:'브레이크를 밟아 충분히 감속하세요.',expect:'brake',skill:'control',scene:{light:'red',stop:true}},
      {title:'녹색이지만 횡단보도에 보행자가 있습니다.',hint:'신호색뿐 아니라 실제 보행자를 확인합니다.',quiz:[['보행자가 안전하게 지나간 뒤 출발한다',true],['녹색이므로 바로 출발한다',false]],skill:'judgment',scene:{light:'green',crosswalk:true,pedestrian:true}},
      {title:'황색신호로 바뀌었습니다.',hint:'무리한 진입보다 감속·정지를 우선합니다.',expect:'brake',skill:'judgment',scene:{light:'yellow',stop:true}}]},
    {id:3,icon:'↱',title:'우회전',desc:'감속 · 횡단보도 · 우측 신호',steps:[
      {title:'우회전 교차로에 접근합니다.',hint:'회전 전에 먼저 감속하세요.',expect:'brake',skill:'control',scene:{crosswalk:true}},
      {title:'횡단보도와 우측을 확인하세요.',hint:'시선을 진행 방향으로 충분히 움직입니다.',expect:'look',skill:'observation',scene:{crosswalk:true,pedestrian:true}},
      {title:'우측 방향지시등을 켜세요.',hint:'우회전 의사를 미리 알립니다.',expect:'rightSignal',skill:'signal'},
      {title:'보행자가 나타났습니다.',hint:'보행자 안전이 우선입니다.',quiz:[['멈춰서 보행자가 지나가길 기다린다',true],['천천히 보행자 앞으로 지나간다',false]],skill:'judgment',scene:{crosswalk:true,pedestrian:true}}]},
    {id:4,icon:'↔️',title:'차선 변경',desc:'거울 → 신호 → 사각지대 → 이동',steps:[
      {title:'왼쪽 차로로 변경하세요.',hint:'거울 → 좌측 깜빡이 → 사각지대 → 왼쪽 이동.',sequence:['mirror','leftSignal','blindSpot','laneLeft'],skill:'judgment'},
      {title:'오른쪽 차로로 돌아오세요.',hint:'거울 → 우측 깜빡이 → 사각지대 → 오른쪽 이동.',sequence:['mirror','rightSignal','blindSpot','laneRight'],skill:'judgment'},
      {title:'옆 차가 가까이 있습니다.',hint:'억지로 끼어들지 않습니다.',quiz:[['현재 차로를 유지하고 안전한 간격을 기다린다',true],['깜빡이를 켰으니 바로 진입한다',false]],skill:'judgment',scene:{leadCar:true}}]},
    {id:5,icon:'🏙️',title:'교차로 판단',desc:'차로 선택 · 길 놓침 · 안전한 재탐색',steps:[
      {title:'교차로 안쪽 공간까지 확인하세요.',hint:'신호만 보지 말고 전방 흐름을 확인합니다.',expect:'look',skill:'observation'},
      {title:'좌회전 차로로 이동합니다.',hint:'거울과 깜빡이, 사각지대를 순서대로 확인하세요.',sequence:['mirror','leftSignal','blindSpot','laneLeft'],skill:'judgment'},
      {title:'좌회전 차로를 놓쳤습니다.',hint:'급하게 차선을 건너지 말고 새 경로를 택합니다.',quiz:[['현재 차로를 유지하고 경로를 다시 안내받는다',true],['교차로 직전에서 급하게 두 개 차로를 건넌다',false],['멈춰서 후진한다',false]],skill:'judgment'}]},
    {id:6,icon:'🛣️',title:'속도와 안전거리',desc:'전방주시 · 앞차 감속 · 저속구간',steps:[
      {title:'앞차보다 더 멀리 전방을 보세요.',hint:'전체 흐름을 읽는 연습입니다.',expect:'look',skill:'observation',scene:{leadCar:true}},
      {title:'저속 주행 구간입니다.',hint:'브레이크로 충분히 감속합니다.',expect:'brake',skill:'control'},
      {title:'앞차가 갑자기 감속합니다.',hint:'급조향보다 먼저 제동합니다.',expect:'brake',skill:'judgment',scene:{leadCar:true}},
      {title:'안전거리가 부족하다면?',hint:'속도를 줄여 공간을 다시 확보합니다.',quiz:[['속도를 줄여 간격을 넓힌다',true],['옆 차로로 바로 튀어나간다',false]],skill:'judgment'}]},
    {id:7,icon:'⚠️',title:'돌발상황',desc:'급정거 · 구급차 · 우천 · 비상정차',steps:[
      {title:'앞차 급정거!',hint:'먼저 브레이크로 감속합니다.',expect:'brake',skill:'judgment',scene:{leadCar:true}},
      {title:'뒤에서 긴급차량이 접근합니다.',hint:'주변 공간을 먼저 확인합니다.',expect:'mirror',skill:'observation',scene:{emergency:true}},
      {title:'안전한 곳에 비상정차했습니다.',hint:'비상등을 켜 다른 차량에 알립니다.',expect:'hazard',skill:'signal'},
      {title:'비가 많이 옵니다.',hint:'속도를 낮추고 차간거리를 늘립니다.',quiz:[['속도를 낮추고 차간거리를 더 확보한다',true],['평소와 같은 속도로 빨리 통과한다',false]],skill:'judgment'}]},
    {id:8,icon:'🅿️',title:'주차 기초',desc:'후진 · 저속 · 주변 확인 · P',steps:[
      {title:'주차 전 주변을 확인하세요.',hint:'보행자와 옆 차량을 먼저 봅니다.',expect:'mirror',skill:'observation'},
      {title:'후진 기어 R을 선택하세요.',hint:'브레이크를 밟은 상태를 가정합니다.',expect:'gearR',skill:'control'},
      {title:'후진 중 거울만 보면 충분할까요?',hint:'거울과 직접 확인을 함께 사용합니다.',quiz:[['거울과 주변을 번갈아 직접 확인한다',true],['한쪽 사이드미러만 계속 본다',false]],skill:'judgment'},
      {title:'차가 빨라졌습니다.',hint:'주차는 아주 저속으로 조절합니다.',expect:'brake',skill:'control'},
      {title:'주차가 끝났습니다.',hint:'완전히 정지한 뒤 P를 선택합니다.',expect:'gearP',skill:'control'}]},
    {id:9,icon:'🏁',title:'종합 모의주행',desc:'출발부터 돌발대응까지 한 번에',steps:[
      {title:'출발 준비를 완료하세요.',hint:'거울 → 좌측 깜빡이 → D → 천천히 출발.',sequence:['mirror','leftSignal','gearD','accel'],skill:'judgment'},
      {title:'교차로 적색신호입니다.',hint:'정지선 전에 감속·정지합니다.',expect:'brake',skill:'control',scene:{light:'red',stop:true}},
      {title:'오른쪽 차로로 변경하세요.',hint:'확인 없이 차로부터 움직이면 안 됩니다.',sequence:['mirror','rightSignal','blindSpot','laneRight'],skill:'judgment'},
      {title:'우회전 구간에 보행자가 있습니다.',hint:'진행보다 보행자 안전을 먼저 판단합니다.',quiz:[['정지하고 보행자가 지나가길 기다린다',true],['경적을 울리고 천천히 지나간다',false]],skill:'judgment',scene:{crosswalk:true,pedestrian:true}},
      {title:'앞차 급정거!',hint:'먼저 브레이크로 속도를 줄입니다.',expect:'brake',skill:'judgment',scene:{leadCar:true}},
      {title:'도착했습니다.',hint:'완전히 정지하고 P를 선택합니다.',expect:'gearP',skill:'control'}]}
  ];

  // 실도로 체크포인트: Google Street View가 가장 가까운 파노라마를 표시합니다.
  const routes = {
    magok:{title:'마곡나루 실도로 · 초급',points:[
      {name:'마곡나루역 주변',lat:37.5658213,lng:126.8276343,heading:75,mission:'브레이크를 밟고 D로 변경한 뒤 주변을 확인하세요.'},
      {name:'마곡중앙로 진입',lat:37.56600,lng:126.82835,heading:75,mission:'차선을 유지하면서 횡단보도와 보행자를 먼저 찾아보세요.'},
      {name:'마곡중앙로 직진',lat:37.56618,lng:126.82910,heading:78,mission:'앞차와 신호등 위치를 확인하고 안전거리를 생각하세요.'},
      {name:'교차로 접근',lat:37.56636,lng:126.82990,heading:78,mission:'교차로 전에 어느 차로를 선택할지 미리 판단하세요.'},
      {name:'마곡 도착점',lat:37.56652,lng:126.83065,heading:80,mission:'급한 차선변경 없이 현재 차로를 유지하며 마무리하세요.'}
    ]},
    yeongdeungpo:{title:'영등포 실도로 · 도심',points:[
      {name:'영등포역 주변',lat:37.515560,lng:126.907780,heading:350,mission:'출발 전 버스·택시·보행자 움직임을 먼저 확인하세요.'},
      {name:'역 앞 도로',lat:37.51615,lng:126.90760,heading:350,mission:'차로 수와 정지선 위치를 확인하세요.'},
      {name:'도심 직진구간',lat:37.51682,lng:126.90738,heading:348,mission:'앞차만 보지 말고 교차로 안쪽까지 시선을 넓혀보세요.'},
      {name:'복합 교차로 접근',lat:37.51745,lng:126.90712,heading:346,mission:'내가 갈 방향의 차로를 미리 고르고 방향지시등 시점을 생각하세요.'},
      {name:'영등포 도착점',lat:37.51810,lng:126.90688,heading:345,mission:'길을 놓쳐도 급차선변경하지 않는다는 원칙을 기억하세요.'}
    ]},
    gwangmyeong:{title:'광명 실도로 · 역세권',points:[
      {name:'광명역 주변',lat:37.416390,lng:126.885000,heading:335,mission:'출발 전 넓은 도로의 차량 흐름과 합류 차량을 확인하세요.'},
      {name:'역세권 진입도로',lat:37.41688,lng:126.88472,heading:334,mission:'차로를 유지하고 속도를 천천히 올려보세요.'},
      {name:'넓은 직선구간',lat:37.41734,lng:126.88446,heading:334,mission:'속도보다 안전거리와 전방 흐름을 우선하세요.'},
      {name:'교차로 전 구간',lat:37.41779,lng:126.88419,heading:333,mission:'교차로 전 미리 감속하고 목적 차로를 확인하세요.'},
      {name:'광명 도착점',lat:37.41825,lng:126.88392,heading:333,mission:'뒤차 때문에 서두르지 말고 안전한 판단으로 마무리하세요.'}
    ]}
  };

  const defaultStats=()=>({observation:{success:0,fail:0},signal:{success:0,fail:0},control:{success:0,fail:0},judgment:{success:0,fail:0}});
  let state; try{state=JSON.parse(localStorage.getItem('drivingLabStateV3')||'{}')}catch{state={}}
  state.completed??=[]; state.xp??=0; state.stats??=defaultStats(); state.bestScores??={};
  let training={level:null,step:0,score:100,sequenceIndex:0,wrong:0};
  let car={speed:0,gear:'P',signal:'—',lane:2};
  let lastCompletedLevel=null;
  let real={routeKey:null,index:0,speed:0,gear:'P',signal:'—',wheel:0};
  const googleKey=(window.APP_CONFIG?.GOOGLE_MAPS_EMBED_KEY||'').trim();

  const els={
    levelGrid:$('#levelGrid'),trainingSection:$('#trainingSection'),resultSection:$('#resultSection'),rankLabel:$('#rankLabel'),xpLabel:$('#xpLabel'),xpBar:$('#xpBar'),progressText:$('#progressText'),completedLabel:$('#completedLabel'),weaknessTip:$('#weaknessTip'),
    skillObservation:$('#skillObservation'),skillSignal:$('#skillSignal'),skillControl:$('#skillControl'),skillJudgment:$('#skillJudgment'),
    levelEyebrow:$('#levelEyebrow'),missionTitle:$('#missionTitle'),stepCount:$('#stepCount'),scoreLabel:$('#scoreLabel'),stepTitle:$('#stepTitle'),stepHint:$('#stepHint'),feedback:$('#feedback'),quizArea:$('#quizArea'),nextStepBtn:$('#nextStepBtn'),sequenceChips:$('#sequenceChips'),speedValue:$('#speedValue'),gearValue:$('#gearValue'),signalValue:$('#signalValue'),
    simLight:$('#simLight'),simMessage:$('#simMessage'),simCrosswalk:$('#simCrosswalk'),simLead:$('#simLead'),simPed:$('#simPed'),simEmergency:$('#simEmergency'),
    resultTitle:$('#resultTitle'),resultScore:$('#resultScore'),resultMessage:$('#resultMessage'),resultSkills:$('#resultSkills'),replayBtn:$('#replayBtn'),continueBtn:$('#continueBtn'),
    googleStatus:$('#googleStatus'),googleSetup:$('#googleSetup'),realTraining:$('#realTraining'),realRouteTitle:$('#realRouteTitle'),streetViewFrame:$('#streetViewFrame'),satelliteFrame:$('#satelliteFrame'),realLevelLabel:$('#realLevelLabel'),realPointName:$('#realPointName'),realMissionBubble:$('#realMissionBubble'),realSpeed:$('#realSpeed'),clusterSpeed:$('#clusterSpeed'),clusterGear:$('#clusterGear'),clusterSignal:$('#clusterSignal'),wheelGuide:$('#wheelGuide'),realFeedback:$('#realFeedback'),checkpointLabel:$('#checkpointLabel'),realPrevBtn:$('#realPrevBtn'),realNextBtn:$('#realNextBtn')
  };

  function save(){localStorage.setItem('drivingLabStateV3',JSON.stringify(state))}
  function isUnlocked(id){return id===0||state.completed.includes(id-1)||state.completed.includes(id)}
  function getSkillPercent(key){const s=state.stats[key]||{success:0,fail:0};const t=s.success+s.fail;return t?Math.round(s.success/t*100):null}
  function record(skill,ok){if(!skill)return;state.stats[skill]??={success:0,fail:0};state.stats[skill][ok?'success':'fail']++;save();updateProgress()}

  function renderLevels(){els.levelGrid.innerHTML='';levels.forEach(level=>{const unlocked=isUnlocked(level.id),complete=state.completed.includes(level.id);const b=document.createElement('button');b.className=`level-card ${!unlocked?'locked':''} ${complete?'complete':''}`;const best=state.bestScores[level.id];b.innerHTML=`<span class="level-icon">${level.icon}</span><span class="level-status">${complete?'✅':unlocked?'▶️':'🔒'}</span><strong>LEVEL ${level.id} · ${level.title}</strong><span>${level.desc}</span>${best!=null?`<span>BEST ${best}점</span>`:''}`;b.onclick=()=>unlocked?startLevel(level.id):flashMessage('앞 단계를 먼저 완료하세요.');els.levelGrid.appendChild(b)});updateProgress()}
  function updateProgress(){const n=state.completed.length;const ranks=n>=10?['🏆 실전 준비 운전자','모든 기초 훈련 완료']:n>=7?['🛣️ 상황대응 운전자','돌발상황과 주차까지 연습 중']:n>=4?['🚙 도심 연습 운전자','차선과 교차로 판단을 만드는 중']:n>=1?['🚗 기초 운전자','조작 순서를 몸에 익히는 중']:['🐣 초보 운전자','첫 미션부터 천천히 시작하세요.'];els.rankLabel.textContent=ranks[0];els.progressText.textContent=ranks[1];els.xpLabel.textContent=`${state.xp} XP`;els.completedLabel.textContent=`${n}/10 완료`;els.xpBar.style.width=`${Math.min(100,n/10*100)}%`;const nodes={observation:els.skillObservation,signal:els.skillSignal,control:els.skillControl,judgment:els.skillJudgment};const scored=[];Object.keys(nodes).forEach(k=>{const p=getSkillPercent(k);nodes[k].textContent=p==null?'—':`${p}%`;if(p!=null)scored.push([k,p])});if(!scored.length)els.weaknessTip.textContent='💡 아직 기록이 없습니다. LEVEL 0부터 시작해 보세요.';else{scored.sort((a,b)=>a[1]-b[1]);const[w,p]=scored[0];els.weaknessTip.textContent=`💡 현재 가장 보강할 항목은 「${LABELS[w]}」 ${p}%입니다.`}}
  function flashMessage(msg){els.weaknessTip.textContent=`🔒 ${msg}`}

  function startLevel(id){const level=levels[id];training={level,step:0,score:100,sequenceIndex:0,wrong:0};lastCompletedLevel=null;car={speed:0,gear:'P',signal:'—',lane:2};updateCar();els.resultSection.classList.add('hidden');els.trainingSection.classList.remove('hidden');els.levelEyebrow.textContent=`LEVEL ${id}`;els.missionTitle.textContent=level.title;renderStep();els.trainingSection.scrollIntoView({behavior:'smooth',block:'start'})}
  function renderStep(){const step=training.level.steps[training.step];training.sequenceIndex=0;els.stepCount.textContent=`${training.step+1} / ${training.level.steps.length}`;els.scoreLabel.textContent=`점수 ${training.score}`;els.stepTitle.textContent=step.title;els.stepHint.textContent=step.hint;els.nextStepBtn.classList.add('hidden');els.quizArea.classList.add('hidden');els.quizArea.innerHTML='';setFeedback('행동을 선택하세요. 틀려도 다시 연습할 수 있습니다.','neutral');applyScene(step.scene||{});renderSequence(step);if(step.quiz){els.quizArea.classList.remove('hidden');step.quiz.forEach(([label,ok])=>{const b=document.createElement('button');b.className='quiz-option';b.textContent=label;b.onclick=()=>judgeQuiz(ok,b,step);els.quizArea.appendChild(b)})}}
  function renderSequence(step){if(!step.sequence){els.sequenceChips.classList.add('hidden');els.sequenceChips.innerHTML='';return}els.sequenceChips.classList.remove('hidden');els.sequenceChips.innerHTML=step.sequence.map((a,i)=>`<span class="sequence-chip ${i<training.sequenceIndex?'done':''}">${i+1}. ${ACTION_LABELS[a]}</span>`).join('')}
  function applyScene(scene){els.simMessage.textContent=scene.message||training.level.title;els.simLight.className=`sim-light ${scene.light||'green'}`;els.simCrosswalk.classList.toggle('hidden',!scene.crosswalk);els.simLead.classList.toggle('hidden',!scene.leadCar);els.simPed.classList.toggle('hidden',!scene.pedestrian);els.simEmergency.classList.toggle('hidden',!scene.emergency)}
  function updateCar(){els.speedValue.textContent=car.speed;els.gearValue.textContent=car.gear;els.signalValue.textContent=car.signal}
  function handleAction(action){if(!training.level)return;if(action==='brake')car.speed=Math.max(0,car.speed-15);if(action==='accel')car.speed=car.gear==='P'?0:Math.min(80,car.speed+10);if(action==='gearP'){car.gear='P';car.speed=0}if(action==='gearD')car.gear='D';if(action==='gearR')car.gear='R';if(action==='leftSignal')car.signal='◀';if(action==='rightSignal')car.signal='▶';if(action==='hazard')car.signal='⚠';updateCar();const step=training.level.steps[training.step];if(step.quiz)return;if(step.sequence){handleSequence(action,step);return}if(!step.expect)return;if(action===step.expect)succeedStep(step,'좋아요. 안전한 순서로 처리했습니다.');else failStep(step,'지금 미션과 다른 조작입니다. 힌트를 확인하고 다시 해보세요.')}
  function handleSequence(action,step){const expected=step.sequence[training.sequenceIndex];if(action===expected){training.sequenceIndex++;renderSequence(step);if(training.sequenceIndex===step.sequence.length)succeedStep(step,'순서를 정확히 완료했습니다.');else setFeedback(`좋습니다. 다음은 「${ACTION_LABELS[step.sequence[training.sequenceIndex]]}」입니다.`,'good')}else{training.sequenceIndex=0;renderSequence(step);failStep(step,`순서가 바뀌었습니다. 처음부터 다시: ${step.sequence.map(a=>ACTION_LABELS[a]).join(' → ')}`,4)}}
  function judgeQuiz(ok,button,step){$$('.quiz-option').forEach(x=>x.disabled=true);if(ok){button.textContent='✅ '+button.textContent;succeedStep(step,'정확합니다. 안전을 우선하는 판단입니다.')}else{button.textContent='❌ '+button.textContent;failStep(step,'위험할 수 있는 선택입니다. 힌트를 다시 확인하세요.',10);els.nextStepBtn.classList.remove('hidden')}}
  function succeedStep(step,msg){record(step.skill,true);setFeedback(msg,'good');els.nextStepBtn.classList.remove('hidden')}
  function failStep(step,msg,penalty=5){training.score=Math.max(0,training.score-penalty);training.wrong++;els.scoreLabel.textContent=`점수 ${training.score}`;record(step.skill,false);setFeedback(msg,'bad')}
  function setFeedback(msg,type){els.feedback.textContent=msg;els.feedback.className=`feedback ${type}`}
  function nextStep(){if(training.step<training.level.steps.length-1){training.step++;renderStep()}else completeLevel()}
  function completeLevel(){const id=training.level.id,score=training.score;lastCompletedLevel=id;const first=!state.completed.includes(id);if(first){state.completed.push(id);state.completed.sort((a,b)=>a-b);state.xp+=Math.max(50,score)}else state.xp+=20;state.bestScores[id]=Math.max(state.bestScores[id]||0,score);save();renderLevels();els.trainingSection.classList.add('hidden');showResult(id,score,training.wrong,first)}
  function showResult(id,score,wrong,first){const level=levels[id];els.resultSection.classList.remove('hidden');els.resultTitle.textContent=`LEVEL ${id} · ${level.title} 완료`;els.resultScore.textContent=score;const grade=score>=90?'아주 안정적입니다. 다음 단계로 진행해도 좋습니다.':score>=75?'기본 흐름은 좋습니다. 틀린 부분만 한 번 더 반복하세요.':'같은 레벨을 한 번 더 반복하는 것을 권장합니다.';els.resultMessage.textContent=`${grade} ${first?`+${Math.max(50,score)} XP`:'+20 XP'} · 실수 ${wrong}회`;els.resultSkills.innerHTML=Object.keys(LABELS).map(k=>{const p=getSkillPercent(k);return `<div><span>${LABELS[k]}</span><b>${p==null?'—':p+'%'}</b></div>`}).join('');els.continueBtn.textContent=id<levels.length-1?'다음 단계':'훈련 목록';els.resultSection.scrollIntoView({behavior:'smooth',block:'center'})}

  // Google Maps Embed API — no-charge SKU. Billing account and API key are still required by Google.
  function initGoogleStatus(){if(googleKey){els.googleStatus.textContent='Google 준비됨';els.googleStatus.classList.add('ready');els.googleSetup.classList.add('hidden')}else{els.googleStatus.textContent='API 키 필요';els.googleStatus.classList.add('wait');els.googleSetup.classList.remove('hidden')}}
  function streetViewUrl(point){const p=new URLSearchParams({key:googleKey,location:`${point.lat},${point.lng}`,heading:String(point.heading||0),pitch:'0',fov:'85'});return `https://www.google.com/maps/embed/v1/streetview?${p.toString()}`}
  function satelliteUrl(point){const p=new URLSearchParams({key:googleKey,center:`${point.lat},${point.lng}`,zoom:'18',maptype:'satellite'});return `https://www.google.com/maps/embed/v1/view?${p.toString()}`}
  function startRealRoute(key){if(!googleKey){els.googleSetup.classList.remove('hidden');els.googleSetup.scrollIntoView({behavior:'smooth',block:'center'});return}real={routeKey:key,index:0,speed:0,gear:'P',signal:'—',wheel:0};els.realTraining.classList.remove('hidden');els.realRouteTitle.textContent=routes[key].title;renderRealPoint();els.realTraining.scrollIntoView({behavior:'smooth',block:'start'})}
  function renderRealPoint(){const route=routes[real.routeKey],point=route.points[real.index];els.streetViewFrame.src=streetViewUrl(point);els.satelliteFrame.src=satelliteUrl(point);els.realLevelLabel.textContent=`실도로 ${real.index+1}/${route.points.length}`;els.realPointName.textContent=point.name;els.realMissionBubble.innerHTML=`<span>현재 미션</span><strong>${point.mission}</strong>`;els.checkpointLabel.textContent=`${real.index+1} / ${route.points.length}`;els.realPrevBtn.disabled=real.index===0;els.realNextBtn.textContent=real.index===route.points.length-1?'처음으로':'다음 지점';updateRealHud()}
  function updateRealHud(){els.realSpeed.textContent=real.speed;els.clusterSpeed.textContent=real.speed;els.clusterGear.textContent=real.gear;els.clusterSignal.textContent=real.signal}
  function setRealFeedback(msg,type='neutral'){els.realFeedback.textContent=msg;els.realFeedback.className=`feedback ${type}`}
  function advanceReal(delta=1){const route=routes[real.routeKey];let next=real.index+delta;if(next>=route.points.length)next=0;if(next<0)next=0;real.index=next;renderRealPoint()}
  function handleRealAction(action){if(!real.routeKey)return;if(action==='gearD'){real.gear='D';setRealFeedback('D로 변경했습니다. 브레이크에서 발을 천천히 떼고 주변을 확인하세요.','good')}else if(action==='gearP'){real.gear='P';real.speed=0;setRealFeedback('P로 변경했습니다. 완전히 정차한 뒤 사용하는 습관을 기억하세요.','good')}else if(action==='gearR'){real.gear='R';real.speed=0;setRealFeedback('R입니다. 실제 후진 시 거울과 직접 확인을 반복하세요.','good')}else if(action==='gearN'){real.gear='N';setRealFeedback('N이 선택되었습니다. 평소 주행에서는 차량 매뉴얼과 상황에 맞게 사용하세요.')}else if(action==='brake'){real.speed=Math.max(0,real.speed-12);setRealFeedback(real.speed===0?'완전히 정지했습니다.':'감속 중입니다. 미리 부드럽게 제동하는 감각을 익히세요.','good')}else if(action==='accel'){if(real.gear!=='D'){setRealFeedback('먼저 브레이크를 밟은 상태에서 D를 선택하세요.','bad');return}real.speed=Math.min(50,real.speed+10);setRealFeedback('천천히 가속합니다. 실도로 화면이 다음 체크포인트로 이동합니다.','good');setTimeout(()=>advanceReal(1),260)}else if(action==='leftSignal'){real.signal='◀';setRealFeedback('좌측 방향지시등을 켰습니다. 거울과 사각지대를 함께 확인하세요.','good')}else if(action==='rightSignal'){real.signal='▶';setRealFeedback('우측 방향지시등을 켰습니다. 횡단보도와 보행자를 확인하세요.','good')}else if(action==='hazard'){real.signal='⚠';setRealFeedback('비상등을 켰습니다. 비상정차 등 필요한 상황에서 사용합니다.','good')}else if(action==='mirror'){setRealFeedback('미러 확인 완료. 다음에는 고개를 움직여 사각지대도 확인하는 습관을 만드세요.','good')}else if(action==='steerLeft'||action==='steerRight'){real.wheel=Math.max(-70,Math.min(70,real.wheel+(action==='steerLeft'?-18:18)));els.wheelGuide.classList.add('active');els.wheelGuide.style.transform=`rotate(${real.wheel}deg)`;setTimeout(()=>els.wheelGuide.classList.remove('active'),450);setRealFeedback(action==='steerLeft'?'핸들을 왼쪽으로 돌렸습니다. 실제로는 시선이 먼저 진행방향을 향해야 합니다.':'핸들을 오른쪽으로 돌렸습니다. 회전 후 핸들이 돌아오는 양을 느끼는 연습이 중요합니다.','good')}updateRealHud()}

  $$('#levelGrid').forEach(()=>{});
  $$('.control-deck [data-action]').forEach(b=>b.addEventListener('click',()=>handleAction(b.dataset.action)));
  els.nextStepBtn.onclick=nextStep;
  $('#closeTrainingBtn').onclick=()=>els.trainingSection.classList.add('hidden');
  els.replayBtn.onclick=()=>{if(lastCompletedLevel!=null)startLevel(lastCompletedLevel)};
  els.continueBtn.onclick=()=>{if(lastCompletedLevel!=null&&lastCompletedLevel<levels.length-1)startLevel(lastCompletedLevel+1);else{els.resultSection.classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})}};
  $('#resetBtn').onclick=()=>{if(confirm('훈련 진행도와 점수를 모두 초기화할까요?')){localStorage.removeItem('drivingLabStateV3');location.reload()}};
  $$('.region-btn').forEach(b=>b.addEventListener('click',()=>startRealRoute(b.dataset.route)));
  $$('[data-real-action]').forEach(b=>b.addEventListener('click',()=>handleRealAction(b.dataset.realAction)));
  $('#closeRealBtn').onclick=()=>els.realTraining.classList.add('hidden');
  els.realPrevBtn.onclick=()=>advanceReal(-1);els.realNextBtn.onclick=()=>advanceReal(1);
  document.addEventListener('keydown',e=>{const m={ArrowDown:'brake',ArrowUp:'accel',q:'leftSignal',e:'rightSignal',' ':'hazard',m:'mirror',b:'blindSpot'};if(m[e.key]&&!els.trainingSection.classList.contains('hidden')){e.preventDefault();handleAction(m[e.key])}});

  initGoogleStatus();renderLevels();updateCar();
})();
