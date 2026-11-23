/* Local adapter. Public catalog and API descriptions are snapshots; no account credentials are stored. */
(() => {
  const nativeFetch = window.fetch.bind(window);
  const catalog = nativeFetch('/catalog.json').then(r=>r.json());
  const apis = nativeFetch('/package-api.json').then(r=>r.json());
  const json = data => new Response(JSON.stringify(data), {status:200,headers:{'Content-Type':'application/json'}});
  if (location.pathname === '/' || location.pathname === '/index.html') history.replaceState(null,'','/data-service');
  window.fetch = async (input, init={}) => {
    const raw = typeof input==='string'?input:input.url;
    const url = new URL(raw,location.href), pathname=url.pathname;
    if (url.origin!==location.origin) return json({code:'200',data:null});
    if (pathname.endsWith('/dataUserPackage/comboGoods')) return json(await catalog);
    if (pathname.endsWith('/apiIntroduction/packageApi')) return json(await apis);
    if (pathname.endsWith('/dataUserPackage/comboPricing')) {
      const {data:c}=await catalog;
      let req={};try{req=JSON.parse(init.body||'{}')}catch{}
      const factor=req.billingPeriod==='QUARTER'?.25:1;
      const items=[...c.bases,...c.modules,...c.alaCartes].map(p=>({...p,
        periodPower:Math.floor(p.annualPower*factor),actualPower:Math.floor(p.annualPower*factor),
        selected:(req.goodsIds||[]).includes(p.goodsId),isBought:false,discountRate:1,
        description:(p.description||'').split(';')[0],features:(p.description||'').split(';').slice(1)
      }));
      const total=items.filter(p=>p.selected).reduce((s,p)=>s+p.periodPower,0);
      return json({code:'200',data:{items,originalPower:total,payablePower:total,totalPower:total,
        accountTier:{tierCode:'T0',tierName:'入门',historyAmount:0,discountRate:1,dailyTrafficLimit:'5G',perMinuteCallLimit:300}}});
    }
    if (/comboCheckout|comboOrderStatus|payment|payOrder/i.test(pathname)) return json({code:'LOCAL_PREVIEW',message:'本地预览：已保留订阅确认弹窗，不创建订单或扣费。',data:null});
    if (pathname.startsWith('/pandaApi/') || pathname.startsWith('/collect/')) {
      if (pathname.includes('seo')) return json({code:'200',data:{title:'PandaAI 数据服务计划',description:'数据套餐本地预览'}});
      return json({code:'200',data:null});
    }
    return nativeFetch(input,init);
  };
  // Keep links to pages outside the extracted data service pointed at the original site.
  document.addEventListener('click',event=>{
    const a=event.target.closest?.('a[href]');if(!a)return;
    const href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('javascript:'))return;
    const u=new URL(href,location.href);
    if(u.origin===location.origin && !u.pathname.startsWith('/data-service') && !u.pathname.startsWith('/_nuxt')){
      event.preventDefault();event.stopImmediatePropagation();window.open('https://www.pandaaiquant.com'+u.pathname+u.search+u.hash,'_blank','noopener');
    }
  },true);
})();
