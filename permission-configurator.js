import {d as defineComponent,A as ref,f as computed,B as vnode,U as gsap,aO as onDispose} from './_nuxt/Bjc5SYZB.js';
import {flowSurface,icon,transitionCategory} from './plan-configurator.js';
const h=(tag,props,children)=>vnode(tag,props,children?.__v_isVNode?[children]:children);
const format=n=>Math.round(n).toLocaleString('zh-CN');
const groups=[
  {code:'CN_',name:'A股',en:'A-SHARES',description:'按需接入股票与指数分钟数据、实时行情。',details:['股票分钟行情','指数分钟数据','L1 实时行情']},
  {code:'FUTURES_',name:'期货',en:'FUTURES',description:'覆盖期货分钟数据与 L1 实时行情。',details:['期货分钟数据','L1 实时行情']},
  {code:'OVERSEA_',name:'港美股',en:'HK / US',description:'从日线行情到财务与股东，拓展海外研究。',details:['日线、指数与ETF','核心与财务数据','股东与投资者','一致预期与公司事件']},
  {code:'MACRO_',name:'宏观',en:'MACRO',description:'补充国际、行业与特色宏观研究数据。',details:['国际宏观数据','国内行业数据','特色宏观数据']},
  {code:'FUND_',name:'基金',en:'FUNDS',description:'结合 ETF 行情、基金持仓与风格业绩。',details:['ETF 分钟与 L1 实时行情','基金持仓、配置与风格业绩']},
  {code:'FACTOR_',name:'量化',en:'QUANT',description:'接入 A股 Barra 风格因子暴露度。',details:['A股 Barra 风格因子']}
];
const categoryTones=[
  ['#dededb','#c2c2bf','#f0f0ed'],
  ['#bdbdb9','#a5a5a1','#d3d3cf'],
  ['#969692','#7e7e7a','#adada9'],
  ['#666662','#4b4b48','#7b7b77'],
  ['#383838','#252525','#515151'],
  ['#111111','#000000','#303030']
];
// Retain the six base tones; broaden the moving light/shadow range.
const flowShadows=['#989895','#757571','#454541','#272724','#090909','#000000'];
const flowHighlights=['#f4f4f1','#dfdfdb','#bebeba','#969692','#717171','#606060'];
groups.forEach((group,index)=>{
  group.palette=categoryTones[index];
  group.flowPalette=[categoryTones[index][0],flowShadows[index],flowHighlights[index]];
  group.light=index<3;
  group.flowIndex=index;
  group.flowDuration=['10.8s','12.4s','11.2s','13.6s','11.8s','10.2s'][index];
  group.flowPathDuration=['11.6s','10.9s','12.8s','11.1s','13.4s','10.7s'][index];
});
const belongs=(item,code)=>item.tierCode?.startsWith(code)||(code==='CN_'&&item.tierCode?.startsWith('INDEX_'));
const featureNames=item=>{const values=Array.isArray(item.features)?item.features.filter(Boolean):[]; return values.length?values.slice(0,5):[item.name+'接口'];};
const summary=item=>{const text=String(item.description||''); const first=text.split(/[;；]/).filter(Boolean)[0]; return first&&first!==item.name?first:`${item.name}，提供独立年度数据接口`;};
export default defineComponent({
  name:'PermissionConfigurator',
  props:{items:{type:Array,default:()=>[]},showInfo:Function,hideInfo:Function,onOrder:Function},
  setup(props){
    const active=ref('CN_'),rightColumn=ref(null),ordering=ref(null); let switching=false,disposed=false,orderTimer=null;
    const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let categoryElement=null,categoryObserver=null;
    // A tall category column scrolls fully into view before it stays alongside
    // long lists. Measure only on resize; page scrolling remains native.
    const trackCategories=element=>{
      if(element===categoryElement)return;
      categoryObserver?.disconnect();
      categoryElement=element;
      if(!element)return;
      const measure=()=>element.style.setProperty('--pp-categories-height',`${element.getBoundingClientRect().height}px`);
      measure();
      categoryObserver=new ResizeObserver(measure);
      categoryObserver.observe(element);
    };
    const current=computed(()=>props.items.filter(item=>belongs(item,active.value)));
    const activeGroup=computed(()=>groups.find(group=>group.code===active.value)||groups[0]);
    const copyTargets=()=>rightColumn.value?.querySelectorAll('.pp-heading,.pp-card-head,.pp-card-copy,.pp-card-price,.pp-card-actions')||[];
    onDispose(()=>{disposed=true;categoryObserver?.disconnect();clearTimeout(orderTimer);gsap.killTweensOf(copyTargets());});
    const order=item=>{
      if(ordering.value)return;
      ordering.value=item.id;
      orderTimer=setTimeout(()=>{props.hideInfo?.();props.onOrder?.(item);ordering.value=null;},reduceMotion?0:420);
    };
    const choose=async code=>{
      if(code===active.value||switching)return;
      props.hideInfo?.();
      if(reduceMotion){active.value=code;return;}
      switching=true;
      await transitionCategory({targets:copyTargets,surfaces:()=>rightColumn.value?.querySelectorAll('.pc-flow-surface')||[],apply:()=>{active.value=code;},isDisposed:()=>disposed});
      switching=false;
    };
    const card=(item,index)=>h('article',{key:item.id,class:'pp-card'},[
      h('div',{class:'pp-card-head'},[h('span',null,String(index+1).padStart(2,'0')),h('span',null,`${featureNames(item).length} 项数据内容`)]),
      h('div',{class:`pp-card-row ${activeGroup.value.light&&active.value!=='OVERSEA_'?'is-light':''}`,'data-permission-group':active.value},[
        flowSurface(
          `permission-${item.id}`,
          false,
          reduceMotion,
          activeGroup.value.flowPalette,
          '54 26',
          {
            fluid:true,
            fluidIndex:(activeGroup.value.flowIndex+index)%6,
            highlightOpacity:activeGroup.value.light?.42:.5,
            liquidOpacity:activeGroup.value.light?.58:.68,
            duration:`${9.6+index*.8}s`,
            pathDuration:`${8.8+index*.65}s`
          }
        ),
        h('div',{class:'pp-card-copy'},[h('h4',null,item.name),h('p',null,summary(item))]),
        h('div',{class:'pp-card-price'},[h('strong',null,format(item.price)),h('span',null,'算力/年')]),
        h('div',{class:'pp-card-actions'},[
          h('button',{type:'button',class:'pp-info','aria-label':`查看${item.name}包含的接口`,onMouseenter:event=>props.showInfo?.(event,null,item.name),onFocus:event=>props.showInfo?.(event,null,item.name),onMouseleave:()=>props.hideInfo?.(),onBlur:()=>props.hideInfo?.(),onClick:event=>props.showInfo?.(event,null,item.name)},icon('help')),
          h('div',{class:'pp-footer-order'},[h('small',null,`约合 ¥${format(item.price*.1)}/年`),h('button',{type:'button',class:`pc-help-action pp-order ${ordering.value===item.id?'is-filling':''}`,'aria-label':`订阅${item.name}`,onClick:()=>order(item)},[h('span',{class:'pc-help-action-arrow'},icon('arrow')),h('span',null,[h('strong',null,'立即订阅')])])])
        ])
      ]),
    ]);
    return ()=>h('div',{class:'pc-configurator pp-configurator'},[
      h('nav',{class:'pc-categories pp-categories',ref:trackCategories,'aria-label':'权限分类'},[
        h('div',{class:'pc-module-list-heading pc-category-heading'},[h('h3',null,'权限分类'),h('span',null,`${groups.length} 个分类`)]),
        ...groups.map(group=>{
          const items=props.items.filter(item=>belongs(item,group.code));
          const selected=active.value===group.code;
          const minimum=items.length?Math.min(...items.map(item=>item.price)):0;
          return h('article',{key:group.code,class:`pp-category ${selected?'is-active':''}`},[
            h('button',{type:'button',class:'pp-category-art','aria-label':`查看${group.name}权限`,'aria-pressed':selected,onClick:()=>choose(group.code)},[
              flowSurface(
                `permission-category-${group.code}`,
                false,
                reduceMotion,
                group.flowPalette,
                '58 28',
                {fluid:true,fluidIndex:group.flowIndex,highlightOpacity:.48,duration:group.flowDuration,pathDuration:group.flowPathDuration,liquidOpacity:.62}
              )
            ]),
            h('div',{class:'pp-category-copy'},[
              h('span',{class:'pp-category-eyebrow'},group.en),
              h('h4',null,group.name),
              h('p',{class:'pp-category-description'},group.description),
              h('div',{class:'pp-category-minimum'},[h('strong',null,format(minimum)),h('span',null,'算力/年起')])
            ]),
            h('div',{class:'pp-category-includes'},[
              h('span',{class:'pp-category-count'},`${items.length} 个权限 · 按需选择`),
              h('ul',null,group.details.map(text=>h('li',{key:text},[icon('check','pc-check'),h('span',null,text)]))),
              h('button',{type:'button',class:'pc-category-switch',role:'switch','aria-checked':selected,'aria-label':`切换到${group.name}权限`,onClick:()=>choose(group.code)},[
                h('span',null,selected?'正在浏览':'查看权限'),h('span',{class:'pc-switch-track'},h('span',{class:'pc-switch-knob'}))
              ])
            ])
          ]);
        })
      ]),
      h('section',{class:'pp-right-column',ref:rightColumn,'aria-label':'权限内容'},[
        h('div',{class:'pp-heading'},[h('h3',null,`${activeGroup.value.name}权限`),h('span',null,`${current.value.length} 个权限 · 点击查看详情`)]),
        h('div',{class:'pp-list'},current.value.map(card))
      ])
    ]);
  }
});

