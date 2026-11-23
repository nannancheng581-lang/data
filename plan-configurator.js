import {d as defineComponent,A as ref,f as computed,B as vnode,U as gsap,a5 as nextTick,aO as onDispose} from './_nuxt/Bjc5SYZB.js';
const h=(tag,props,children)=>vnode(tag,props,children?.__v_isVNode?[children]:children);
const format=n=>Math.round(n).toLocaleString('zh-CN');
export const flowSurface=(id,dark,still=false,palette=null,softness=22,motion={})=>{
  const colors=palette||(dark?['#151515','#000000','#4a4a4a']:['#686868','#292929','#a0a0a0']);
  const phase=`-${id.split('').reduce((sum,char)=>sum+char.charCodeAt(0),0)%9}s`;
  const shapes=[
    'M -170 60 C -20 -100 220 -80 330 70 C 450 230 590 -60 810 110 C 980 270 650 440 390 330 C 120 430 -190 350 -170 60 Z',
    'M -170 60 C 120 -70 420 -80 510 110 C 550 300 750 0 810 110 C 880 300 560 400 340 290 C 80 330 -210 300 -170 60 Z',
    'M -170 60 C -60 -60 170 -80 280 130 C 380 330 690 -40 810 110 C 980 310 680 430 450 350 C 200 450 -170 300 -170 60 Z'
  ];
  const liquidShapes=motion.shapeSet||shapes;
  const highlightShapes=motion.highlightShapeSet||[liquidShapes[2],liquidShapes[1],liquidShapes[0],liquidShapes[2]];
  const fluid=motion.fluid===true;
  const fluidSets=motion.fluidSet||[
    {dark:['-80 110;260 250;620 90','250 240;610 90;120 70'],light:['610 330;280 80;700 170']},
    {dark:['120 360;560 210;240 30','560 210;240 30;700 360'],light:['-20 70;430 330;760 90']},
    {dark:['700 40;240 250;640 350','240 250;640 350;40 120'],light:['80 340;520 80;760 300']},
    {dark:['70 40;260 330;720 170','260 330;720 170;120 110'],light:['740 340;440 120;80 260']},
    {dark:['110 360;360 90;760 300','360 90;760 300;150 120'],light:['-10 120;410 300;760 80']},
    {dark:['640 40;120 180;680 350','120 180;680 350;240 60'],light:['160 350;500 120;780 250']}
  ];
  const fluidSet=fluidSets[motion.fluidIndex??0]||fluidSets[0];
  const fluidAnimate=(attributeName,values,dur,begin)=>h('animate',{
    attributeName,values:[...values,values[0]].join(';'),dur,begin,repeatCount:'indefinite',
    calcMode:'spline',keyTimes:'0;.333333;.666667;1',keySplines:'.42 0 .58 1;.42 0 .58 1;.42 0 .58 1'
  });
  const fluidBlob=(fill,opacity,values,dur,begin,seed)=>h('ellipse',{cx:seed===2?650:180,cy:seed===2?100:290,rx:310,ry:200,fill,opacity},still?[]:[
    fluidAnimate('cx',values.split(';').map(v=>v.split(' ')[0]),dur,begin),
    fluidAnimate('cy',values.split(';').map(v=>v.split(' ')[1]),dur,`${parseFloat(begin)-seed}s`),
    fluidAnimate('rx',[270+seed*10,360-seed*7,300+seed*8],`${parseFloat(dur)*1.13}s`,begin),
    fluidAnimate('ry',[150+seed*8,240-seed*5,180+seed*6],`${parseFloat(dur)*1.07}s`,`${parseFloat(begin)-1}s`)
  ]);
  const fluidContent=fluid?[
    fluidBlob(colors[1],motion.liquidOpacity??.42,fluidSet.dark[0],motion.pathDuration||'10s',phase,1),
    fluidBlob(colors[2],motion.highlightOpacity??.34,fluidSet.light[0],motion.duration||'12s',`${parseFloat(phase)-1}s`,2),
    fluidBlob(colors[1],(motion.liquidOpacity??.42)*.62,fluidSet.dark[1],motion.duration||'12s',`${parseFloat(phase)-3}s`,3)
  ]:[
    h('path',{d:liquidShapes[0],fill:colors[1],opacity:motion.liquidOpacity??.85},still?[]:[h('animate',{attributeName:'d',values:[...liquidShapes,liquidShapes[0]].join(';'),begin:phase,dur:motion.pathDuration||'11s',repeatCount:'indefinite',calcMode:'spline',keyTimes:'0;.34;.68;1',keySplines:'.42 0 .58 1;.42 0 .58 1;.42 0 .58 1'})]),
    h('path',{d:highlightShapes[0],fill:colors[2],opacity:motion.highlightOpacity??(dark?.48:.5)},still?[]:[
      h('animate',{attributeName:'d',values:highlightShapes.join(';'),begin:`${phase}-2s`,dur:motion.duration||'13s',repeatCount:'indefinite',calcMode:'spline',keyTimes:'0;.34;.68;1',keySplines:'.42 0 .58 1;.42 0 .58 1;.42 0 .58 1'})
    ])
  ];
  return h('svg',{class:'pc-flow-surface',viewBox:'0 0 800 400',preserveAspectRatio:'none','aria-hidden':'true',focusable:'false'},[
    h('defs',null,[h('filter',{id:`pc-soft-${id}`,x:'-60%',y:'-70%',width:'220%',height:'240%','color-interpolation-filters':'sRGB'},[
      ...(fluid?[
        h('feTurbulence',{type:'fractalNoise',baseFrequency:'.004 .008',numOctaves:2,seed:(motion.fluidIndex??0)+3,result:'warp'}),
      h('feDisplacementMap',{in:'SourceGraphic',in2:'warp',scale:motion.displacementScale??110,xChannelSelector:'R',yChannelSelector:'G'})
      ]:[]),
      h('feGaussianBlur',{stdDeviation:fluid?'58 28':softness})
    ])]),
    h('rect',{width:800,height:400,fill:colors[0]}),
    h('g',{filter:`url(#pc-soft-${id})`},[
      ...fluidContent
    ])
  ]);
};
export const icon=(name,className='')=>{
  const paths={check:['M20 6 9 17l-5-5'],chevron:['m6 9 6 6 6-6'],arrow:['M5 12h14','m12 5 7 7-7 7'],pause:['M9 5v14','M15 5v14'],play:['m8 5 11 7-11 7V5Z'],layers:['m12 3 9 5-9 5-9-5 9-5Z','m3 12 9 5 9-5','m3 16 9 5 9-5'],info:['M12 11v6','M12 7h.01'],help:['M9.3 9a2.8 2.8 0 1 1 4.9 1.9c-.8.8-1.8 1.1-2.1 2.2','M12 17h.01']};
  return h('svg',{class:`pc-icon ${className}`,viewBox:'0 0 24 24',width:18,height:18,fill:'none',stroke:'currentColor','stroke-width':1.75,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',focusable:'false'},[
    ...(name==='info'||name==='help'?[h('circle',{cx:12,cy:12,r:9})]:[]),...paths[name].map(d=>h('path',{d}))
  ]);
};
const categories=[
  {id:'base',number:'01',name:'基础底座',en:'FOUNDATION',description:'从基础行情出发，建立你的研究数据底座。',items:['股票类基础底座','期货类基础底座','日线行情 · 基础信息 · 交易工具'],count:'2 个基础底座',minimum:3720},
  {id:'scene',number:'02',name:'场景模块',en:'SCENARIO MODULES',description:'围绕研究场景，自由扩展数据能力。',items:['A股进阶 · 期货深度 · 期权','港股 · 美股','宏观基础 · 基金'],count:'7 个场景模块',minimum:6000}
];
export const categoryPanel=(category,selected,{onChoose,still=false})=>h('article',{key:category.id,class:`pc-category pc-category-${category.id} ${selected?'is-active':''}`},[
  h('button',{type:'button',class:'pc-category-art','aria-label':category.label||`查看${category.name}`,'aria-pressed':selected,onClick:onChoose},[
    flowSurface(
      `category-${category.id}`,
      category.dark??category.id==='scene',
      still,
      category.id==='scene'?['#151515','#000000','#686868']:['#686868','#323232','#ababab'],
      '68 38',
    category.id==='scene'?{
      fluid:true,
      fluidIndex:4,
      highlightOpacity:.68,
      liquidOpacity:.72,
      displacementScale:118,
      duration:'10.8s',
      pathDuration:'10.2s'
    }:{
        fluid:true,
        fluidIndex:0,
        highlightOpacity:.36,
        liquidOpacity:.56,
        duration:'10.8s',
        pathDuration:'9.8s'
      }
    ),
    h('span',{class:'pc-category-top'},[h('span',null,category.en),...(category.number?[h('span',null,category.number)]:[])]),
    h('span',{class:'pc-category-name'},category.name),
    h('span',{class:'pc-category-description'},category.description),
    h('span',{class:'pc-category-price'},[h('strong',null,format(category.minimum)),h('span',null,' 算力/年起')])
  ]),
  h('div',{class:'pc-category-includes'},[
    h('span',{class:'pc-includes-label'},category.count),
    h('ul',null,category.items.map(text=>h('li',{key:text},[icon('check','pc-check'),h('span',null,text)]))),
    h('button',{type:'button',class:'pc-category-switch',role:'switch','aria-checked':selected,'aria-label':category.switchLabel||`切换到${category.name}`,onClick:onChoose},[h('span',null,selected?'正在浏览':category.action||'查看模块'),h('span',{class:'pc-switch-track'},h('span',{class:'pc-switch-knob'}))])
  ])
]);
export const transitionCategory=async({targets,surfaces,apply,isDisposed})=>{
  await gsap.to(targets(),{opacity:0,y:-5,duration:.17,ease:'power2.in'});
  if(isDisposed())return;
  apply();
  await nextTick();
  if(isDisposed())return;
  gsap.fromTo(surfaces(),{opacity:.5},{opacity:1,duration:.55,ease:'power2.out'});
  await gsap.fromTo(targets(),{opacity:0,y:10,clipPath:'inset(0 0 100% 0)'},{opacity:1,y:0,clipPath:'inset(0 0 0% 0)',duration:.45,stagger:{amount:.16},delay:.1,ease:'power3.out',clearProps:'opacity,transform,clipPath'});
};
export default defineComponent({
  name:'PlanConfigurator',
  props:{bases:{type:Array,default:()=>[]},modules:{type:Array,default:()=>[]},onOrder:Function,onCompose:Function,showInfo:Function,hideInfo:Function},
  setup(props){
    const active=ref('base'),rightColumn=ref(null),composeFilling=ref(false);
    const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let switching=false,disposed=false,composeTimer=null;
    const copyTargets=()=>rightColumn.value?.querySelectorAll('.pc-module-list-heading,.pc-panel-eyebrow,.pc-module-label,.pc-module-description,.pc-module-price,.pc-features')||[];
    onDispose(()=>{disposed=true;clearTimeout(composeTimer);gsap.killTweensOf(copyTargets());});
    const openComposer=()=>{
      if(composeFilling.value)return;
      composeFilling.value=true;
      composeTimer=setTimeout(()=>{props.onCompose?.();composeFilling.value=false;},reduceMotion?0:420);
    };
    const current=computed(()=>active.value==='base'?props.bases:props.modules);
    const chooseCategory=async id=>{
      if(active.value===id||switching)return;
      props.hideInfo?.();
      if(reduceMotion){active.value=id;return;}
      switching=true;
      await transitionCategory({targets:copyTargets,surfaces:()=>rightColumn.value?.querySelectorAll('.pc-flow-surface')||[],apply:()=>{active.value=id;},isDisposed:()=>disposed});
      switching=false;
    };
    const featureRow=(item,feature)=>h('button',{
        key:feature,class:'pc-feature',type:'button','aria-label':`查看${feature}包含的接口`,
        onMouseenter:event=>props.showInfo?.(event,feature,item.name),onFocus:event=>props.showInfo?.(event,feature,item.name),
        onMouseleave:()=>props.hideInfo?.(),onBlur:()=>props.hideInfo?.(),onClick:event=>props.showInfo?.(event,feature,item.name)
      },h('span',null,feature));
    const row=(item,index)=>h('article',{key:item.id,class:`pc-module pc-module-${active.value}`},[
      h('div',{class:'pc-panel-eyebrow'},[h('span',null,String(index+1).padStart(2,'0')),h('span',null,`${item.features.length} 项数据内容`)]),
      h('div',{class:'pc-module-row'},[
        flowSurface(
          `module-${item.id}`,
          active.value==='scene',
          reduceMotion,
          active.value==='scene'?['#151515','#000000','#686868']:['#5b5b5b','#1d1d1d','#ababab'],
          '52 24',
          {
            fluid:true,
            fluidIndex:(index+(active.value==='scene'?1:3))%6,
            highlightOpacity:active.value==='scene'?.56:.48,
            liquidOpacity:active.value==='scene'?.74:.68,
            duration:`${10.4+(index%3)*1.1}s`,
            pathDuration:`${9.2+(index%4)*.8}s`
          }
        ),
        h('div',{class:'pc-module-label'},[h('h4',null,item.name)]),
        h('div',{class:'pc-module-price'},[h('strong',null,format(item.listPrice)),h('span',null,'算力/年')]),
        h('p',{class:'pc-module-description'},item.description)
      ]),
      h('div',{id:`pc-details-${item.id}`,class:'pc-features'},item.features.map(feature=>featureRow(item,feature)))
    ]);
    return ()=>h('div',{class:'pc-configurator'},[
      h('div',{class:'pc-categories','aria-label':'套餐分类'},[
        h('div',{class:'pc-module-list-heading pc-category-heading'},[h('h3',null,'套餐分类'),h('span',null,'2 个分类')]),
        ...categories.map(category=>categoryPanel(category,active.value===category.id,{onChoose:()=>chooseCategory(category.id),still:reduceMotion})),
        h('div',{class:'pc-help'},[
          h('span',{class:'pc-help-icon'},icon('layers')),
          h('div',{class:'pc-help-copy'},[h('strong',null,'需要组合报价？'),h('span',null,'进入弹窗后再选择订阅周期、基础底座和场景模块。')]),
          h('button',{type:'button',class:`pc-help-action ${composeFilling.value?'is-filling':''}`,onClick:openComposer},[h('span',{class:'pc-help-action-arrow'},icon('arrow')),h('span',null,[h('strong',null,'自由搭配订购'),h('small',null,'选择你的数据方案')])])
        ])
      ]),
      h('aside',{class:'pc-right-column',ref:rightColumn,'aria-label':'模块详情'},[
        h('div',{class:'pc-module-list-heading'},[h('h3',null,active.value==='base'?'基础底座模块':'场景模块'),h('span',null,`${current.value.length} 个模块 · 点击查看详情`)]),
        h('div',{key:`list-${active.value}`,class:'pc-module-list','aria-label':active.value==='base'?'基础底座模块':'场景模块列表'},current.value.map(row))
      ])
    ]);
  }
});
