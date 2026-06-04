import { useState } from "react";

const C = {
  bg:"#0c0e14", surface:"#13161f", card:"#191d2a", border:"#232840",
  accent:"#3b82f6", accentDim:"#3b82f615", green:"#22c55e", red:"#ef4444",
  amber:"#f59e0b", purple:"#a855f7", text:"#dde2f0", muted:"#6b7694", dim:"#2a3050",
};

const inp = {
  width:"100%", padding:"8px 10px", background:"#0c0e14",
  border:`1px solid ${C.border}`, borderRadius:8,
  color:C.text, fontSize:13, fontFamily:"inherit",
  outline:"none", boxSizing:"border-box",
};

function fmt(n) {
  return new Intl.NumberFormat("ar-SY").format(Math.round(n));
}

const initTx = [
  {id:1,date:"2024-06-01",desc:"مبيعات منتجات",cat:"إيرادات",amount:1500000,type:"income"},
  {id:2,date:"2024-06-03",desc:"إيجار المكتب",cat:"مصروفات",amount:350000,type:"expense"},
  {id:3,date:"2024-06-05",desc:"رواتب الموظفين",cat:"مصروفات",amount:800000,type:"expense"},
  {id:4,date:"2024-06-08",desc:"خدمات استشارية",cat:"إيرادات",amount:650000,type:"income"},
  {id:5,date:"2024-06-12",desc:"بيع بضائع",cat:"إيرادات",amount:2200000,type:"income"},
  {id:6,date:"2024-06-15",desc:"مواد خام",cat:"مصروفات",amount:520000,type:"expense"},
];

const initClients = [
  {id:1,name:"شركة النور التجارية",phone:"0911234567",email:"noor@example.com",city:"دمشق",balance:1200000},
  {id:2,name:"مؤسسة الفرات",phone:"0939876543",email:"furat@example.com",city:"حلب",balance:0},
  {id:3,name:"محلات السلام",phone:"0921112233",email:"salam@example.com",city:"حمص",balance:350000},
];

const initInvoices = [
  {id:1,number:"INV-001",clientId:1,date:"2024-06-01",due:"2024-06-15",items:[{desc:"استشارات تقنية",qty:5,price:120000}],status:"paid"},
  {id:2,number:"INV-002",clientId:2,date:"2024-06-10",due:"2024-06-25",items:[{desc:"بضائع متنوعة",qty:10,price:85000}],status:"pending"},
  {id:3,number:"INV-003",clientId:3,date:"2024-06-12",due:"2024-06-30",items:[{desc:"خدمات صيانة",qty:3,price:150000}],status:"overdue"},
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [tx, setTx] = useState(initTx);
  const [clients, setClients] = useState(initClients);
  const [invoices, setInvoices] = useState(initInvoices);
  const [showTxForm, setShowTxForm] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showInvForm, setShowInvForm] = useState(false);
  const [txForm, setTxForm] = useState({date:"",desc:"",cat:"إيرادات",amount:"",type:"income"});
  const [clientForm, setClientForm] = useState({name:"",phone:"",email:"",city:"",balance:""});
  const [invForm, setInvForm] = useState({clientId:"",date:"",due:"",items:[{desc:"",qty:1,price:""}]});
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [toast, setToast] = useState(null);

  const income  = tx.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = tx.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const net     = income - expense;
  const profPct = income>0 ? ((net/income)*100).toFixed(1) : 0;

  const invTotal = (inv) => inv.items.reduce((s,i)=>s+(+i.qty * +i.price),0);

  function addTx() {
    if(!txForm.date||!txForm.desc||!txForm.amount) return;
    setTx(p=>[...p,{...txForm,id:Date.now(),amount:parseFloat(txForm.amount)}]);
    setTxForm({date:"",desc:"",cat:"إيرادات",amount:"",type:"income"});
    setShowTxForm(false); toast2("تمت إضافة المعاملة ✓");
  }
  function addClient() {
    if(!clientForm.name) return;
    setClients(p=>[...p,{...clientForm,id:Date.now(),balance:parseFloat(clientForm.balance)||0}]);
    setClientForm({name:"",phone:"",email:"",city:"",balance:""});
    setShowClientForm(false); toast2("تمت إضافة العميل ✓");
  }
  function addInvoice() {
    if(!invForm.clientId||!invForm.date) return;
    const num = `INV-${String(invoices.length+1).padStart(3,"0")}`;
    setInvoices(p=>[...p,{...invForm,id:Date.now(),number:num,status:"pending"}]);
    setInvForm({clientId:"",date:"",due:"",items:[{desc:"",qty:1,price:""}]});
    setShowInvForm(false); toast2("تم إنشاء الفاتورة ✓");
  }
  function toast2(m){setToast(m);setTimeout(()=>setToast(null),2500);}

  function printInvoice(inv) {
    const client = clients.find(c=>c.id===+inv.clientId)||{name:"—"};
    const total = invTotal(inv);
    const w = window.open("","_blank");
    w.document.write(`
      <html dir="rtl"><head><meta charset="utf-8">
      <style>body{font-family:'Tajawal',sans-serif;padding:40px;color:#111;}
      h1{font-size:24px;}table{width:100%;border-collapse:collapse;margin-top:20px;}
      th,td{border:1px solid #ddd;padding:10px;text-align:right;}th{background:#f5f5f5;}
      .total{font-size:18px;font-weight:bold;text-align:left;margin-top:16px;}
      </style></head><body>
      <h1>فاتورة رقم ${inv.number}</h1>
      <p>العميل: <b>${client.name}</b></p>
      <p>التاريخ: ${inv.date} | تاريخ الاستحقاق: ${inv.due||"—"}</p>
      <table><thead><tr><th>الوصف</th><th>الكمية</th><th>سعر الوحدة</th><th>الإجمالي</th></tr></thead>
      <tbody>${inv.items.map(i=>`<tr><td>${i.desc}</td><td>${i.qty}</td><td>${fmt(i.price)} ل.س</td><td>${fmt(i.qty*i.price)} ل.س</td></tr>`).join("")}</tbody>
      </table>
      <div class="total">الإجمالي: ${fmt(total)} ل.س</div>
      <script>window.print();window.close();<\/script></body></html>
    `); w.document.close();
  }

  const filteredTx = tx.filter(t=>{
    return (t.desc.includes(search)||t.cat.includes(search))
      && (filterType==="all"||t.type===filterType);
  }).sort((a,b)=>new Date(b.date)-new Date(a.date));

  const tabs=[
    {id:"dashboard",label:"لوحة التحكم",icon:"📊"},
    {id:"transactions",label:"المعاملات",icon:"📋"},
    {id:"invoices",label:"الفواتير",icon:"🧾"},
    {id:"clients",label:"العملاء",icon:"👥"},
    {id:"reports",label:"التقارير",icon:"📈"},
  ];

  const statusBadge = {
    paid:  {label:"مدفوعة",  bg:"#22c55e18", color:C.green},
    pending:{label:"معلقة",  bg:"#f59e0b18", color:C.amber},
    overdue:{label:"متأخرة", bg:"#ef444418", color:C.red},
  };

  return (
    <div style={{direction:"rtl",fontFamily:"'Tajawal','Cairo',sans-serif",background:C.bg,minHeight:"100vh",color:C.text,display:"flex",flexDirection:"column"}}>
      <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet"/>

      {/* Sidebar */}
      <div style={{display:"flex",flex:1}}>
        <aside style={{width:200,background:C.surface,borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"1rem 0",flexShrink:0}}>
          <div style={{padding:"0 1rem 1.5rem",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.border}`}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.accent},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💼</div>
            <div>
              <div style={{fontWeight:800,fontSize:15}}>حسابي</div>
              <div style={{fontSize:10,color:C.muted}}>الليرة السورية</div>
            </div>
          </div>
          <nav style={{padding:"1rem 0",flex:1}}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                display:"flex",alignItems:"center",gap:10,width:"100%",
                padding:"10px 1rem",border:"none",cursor:"pointer",
                background:tab===t.id?C.accentDim:"transparent",
                color:tab===t.id?C.accent:C.muted,
                fontFamily:"inherit",fontSize:13,fontWeight:tab===t.id?700:400,
                borderRight:tab===t.id?`3px solid ${C.accent}`:"3px solid transparent",
                transition:"all .15s",textAlign:"right",
              }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div style={{padding:"1rem",borderTop:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>م</div>
              <div style={{fontSize:12,color:C.muted}}>مدير الحسابات</div>
            </div>
          </div>
        </aside>

        <main style={{flex:1,padding:"1.5rem",overflow:"auto"}}>

          {/* ── DASHBOARD ── */}
          {tab==="dashboard" && (
            <div>
              <h1 style={{margin:"0 0 .25rem",fontSize:20,fontWeight:800}}>لوحة التحكم المالية</h1>
              <p style={{margin:"0 0 1.2rem",color:C.muted,fontSize:12}}>يونيو 2024</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                {[
                  {label:"إجمالي الإيرادات",val:fmt(income),unit:"ل.س",color:C.green,icon:"⬆"},
                  {label:"إجمالي المصروفات",val:fmt(expense),unit:"ل.س",color:C.red,icon:"⬇"},
                  {label:"صافي الربح",val:fmt(net),unit:"ل.س",color:net>=0?C.green:C.red,icon:"💰"},
                  {label:"عدد العملاء",val:clients.length,unit:"عميل",color:C.purple,icon:"👥"},
                ].map((k,i)=>(
                  <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <span style={{fontSize:11,color:C.muted}}>{k.label}</span>
                      <span style={{fontSize:18}}>{k.icon}</span>
                    </div>
                    <div style={{fontSize:20,fontWeight:800,margin:"8px 0 2px",color:k.color}}>{k.val}</div>
                    <div style={{fontSize:11,color:C.muted}}>{k.unit}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:12}}>
                {/* Bar chart */}
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.2rem"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:14,display:"flex",justifyContent:"space-between"}}>
                    <span>الإيرادات مقابل المصروفات</span>
                    <div style={{display:"flex",gap:10,fontSize:10}}>
                      <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:C.accent,display:"inline-block"}}></span>إيرادات</span>
                      <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:8,height:8,borderRadius:2,background:C.red,display:"inline-block"}}></span>مصروفات</span>
                    </div>
                  </div>
                  {(()=>{
                    const bars=[
                      {m:"يناير",i:1800000,e:1100000},{m:"فبراير",i:2200000,e:1350000},
                      {m:"مارس",i:1950000,e:1200000},{m:"أبريل",i:2500000,e:1400000},
                      {m:"مايو",i:2100000,e:1550000},{m:"يونيو",i:income,e:expense},
                    ];
                    const mx=Math.max(...bars.map(d=>Math.max(d.i,d.e)));
                    return <div style={{display:"flex",alignItems:"flex-end",gap:6,height:140}}>
                      {bars.map((d,i)=>(
                        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,height:"100%"}}>
                          <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end",gap:1}}>
                            <div style={{flex:1,background:C.accent,borderRadius:"3px 3px 0 0",opacity:.85,height:`${(d.i/mx)*100}%`,minHeight:2}}></div>
                            <div style={{flex:1,background:C.red,borderRadius:"3px 3px 0 0",opacity:.75,height:`${(d.e/mx)*100}%`,minHeight:2}}></div>
                          </div>
                          <span style={{fontSize:9,color:C.muted}}>{d.m}</span>
                        </div>
                      ))}
                    </div>;
                  })()}
                </div>
                {/* Invoices summary */}
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.2rem"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:12,display:"flex",justifyContent:"space-between"}}>
                    <span>حالة الفواتير</span>
                    <button onClick={()=>setTab("invoices")} style={{fontSize:10,color:C.accent,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>عرض الكل ←</button>
                  </div>
                  {[
                    {label:"مدفوعة",count:invoices.filter(i=>i.status==="paid").length,color:C.green},
                    {label:"معلقة",count:invoices.filter(i=>i.status==="pending").length,color:C.amber},
                    {label:"متأخرة",count:invoices.filter(i=>i.status==="overdue").length,color:C.red},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:C.surface,borderRadius:8,marginBottom:6}}>
                      <span style={{fontSize:13}}>{r.label}</span>
                      <span style={{fontSize:16,fontWeight:800,color:r.color}}>{r.count}</span>
                    </div>
                  ))}
                  <div style={{marginTop:10,padding:"10px",background:C.surface,borderRadius:8,textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.muted}}>إجمالي الفواتير</div>
                    <div style={{fontSize:18,fontWeight:800,color:C.accent,marginTop:4}}>
                      {fmt(invoices.reduce((s,i)=>s+invTotal(i),0))} ل.س
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ── */}
          {tab==="transactions" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
                <div>
                  <h1 style={{margin:0,fontSize:20,fontWeight:800}}>المعاملات المالية</h1>
                  <p style={{margin:"4px 0 0",color:C.muted,fontSize:12}}>{filteredTx.length} معاملة</p>
                </div>
                <button onClick={()=>setShowTxForm(!showTxForm)} style={{background:`linear-gradient(135deg,${C.accent},#7c3aed)`,color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ إضافة معاملة</button>
              </div>
              {showTxForm && (
                <div style={{background:C.card,border:`1px solid ${C.accent}40`,borderRadius:12,padding:"1.2rem",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>معاملة جديدة</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
                    {[
                      {label:"التاريخ",el:<input type="date" value={txForm.date} onChange={e=>setTxForm({...txForm,date:e.target.value})} style={inp}/>},
                      {label:"الوصف",el:<input type="text" placeholder="وصف المعاملة" value={txForm.desc} onChange={e=>setTxForm({...txForm,desc:e.target.value})} style={inp}/>},
                      {label:"الفئة",el:<select value={txForm.cat} onChange={e=>setTxForm({...txForm,cat:e.target.value})} style={inp}>{["إيرادات","مصروفات"].map(c=><option key={c}>{c}</option>)}</select>},
                      {label:"النوع",el:<select value={txForm.type} onChange={e=>setTxForm({...txForm,type:e.target.value})} style={inp}><option value="income">إيراد</option><option value="expense">مصروف</option></select>},
                      {label:"المبلغ (ل.س)",el:<input type="number" placeholder="0" value={txForm.amount} onChange={e=>setTxForm({...txForm,amount:e.target.value})} style={inp}/>},
                    ].map((f,i)=>(
                      <div key={i}><div style={{fontSize:11,color:C.muted,marginBottom:4}}>{f.label}</div>{f.el}</div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button onClick={addTx} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"7px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>حفظ</button>
                    <button onClick={()=>setShowTxForm(false)} style={{background:"none",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>إلغاء</button>
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
                <input type="text" placeholder="🔍 بحث..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,flex:1,maxWidth:260}}/>
                {["all","income","expense"].map(f=>(
                  <button key={f} onClick={()=>setFilterType(f)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${filterType===f?C.accent:C.border}`,background:filterType===f?C.accentDim:"none",color:filterType===f?C.accent:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                    {{all:"الكل",income:"إيرادات",expense:"مصروفات"}[f]}
                  </button>
                ))}
              </div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead>
                    <tr style={{background:C.surface}}>
                      {["التاريخ","الوصف","الفئة","النوع","المبلغ (ل.س)",""].map((h,i)=>(
                        <th key={i} style={{padding:"9px 12px",textAlign:"right",color:C.muted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${C.border}`}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.map((t,i)=>(
                      <tr key={t.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.surface+"33"}}>
                        <td style={{padding:"9px 12px",color:C.muted,fontSize:11}}>{t.date}</td>
                        <td style={{padding:"9px 12px",fontWeight:500}}>{t.desc}</td>
                        <td style={{padding:"9px 12px"}}><span style={{background:C.accentDim,color:C.accent,fontSize:11,padding:"2px 8px",borderRadius:20}}>{t.cat}</span></td>
                        <td style={{padding:"9px 12px"}}><span style={{background:t.type==="income"?"#22c55e18":"#ef444418",color:t.type==="income"?C.green:C.red,fontSize:11,padding:"2px 8px",borderRadius:20}}>{t.type==="income"?"إيراد":"مصروف"}</span></td>
                        <td style={{padding:"9px 12px",fontWeight:700,color:t.type==="income"?C.green:C.red}}>{t.type==="income"?"+":"-"} {fmt(t.amount)}</td>
                        <td style={{padding:"9px 12px"}}><button onClick={()=>{setTx(p=>p.filter(x=>x.id!==t.id));toast2("تم الحذف");}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:15}}>🗑</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredTx.length===0&&<div style={{textAlign:"center",padding:"2rem",color:C.muted}}>لا توجد معاملات</div>}
              </div>
            </div>
          )}

          {/* ── INVOICES ── */}
          {tab==="invoices" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
                <div>
                  <h1 style={{margin:0,fontSize:20,fontWeight:800}}>الفواتير</h1>
                  <p style={{margin:"4px 0 0",color:C.muted,fontSize:12}}>{invoices.length} فاتورة</p>
                </div>
                <button onClick={()=>setShowInvForm(!showInvForm)} style={{background:`linear-gradient(135deg,${C.accent},#7c3aed)`,color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ فاتورة جديدة</button>
              </div>
              {showInvForm && (
                <div style={{background:C.card,border:`1px solid ${C.accent}40`,borderRadius:12,padding:"1.2rem",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>إنشاء فاتورة جديدة</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                    <div><div style={{fontSize:11,color:C.muted,marginBottom:4}}>العميل</div>
                      <select value={invForm.clientId} onChange={e=>setInvForm({...invForm,clientId:e.target.value})} style={inp}>
                        <option value="">اختر عميل</option>
                        {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div><div style={{fontSize:11,color:C.muted,marginBottom:4}}>تاريخ الفاتورة</div><input type="date" value={invForm.date} onChange={e=>setInvForm({...invForm,date:e.target.value})} style={inp}/></div>
                    <div><div style={{fontSize:11,color:C.muted,marginBottom:4}}>تاريخ الاستحقاق</div><input type="date" value={invForm.due} onChange={e=>setInvForm({...invForm,due:e.target.value})} style={inp}/></div>
                  </div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:6}}>البنود</div>
                  {invForm.items.map((item,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:8,marginBottom:6}}>
                      <input placeholder="الوصف" value={item.desc} onChange={e=>{const it=[...invForm.items];it[i].desc=e.target.value;setInvForm({...invForm,items:it});}} style={inp}/>
                      <input type="number" placeholder="الكمية" value={item.qty} onChange={e=>{const it=[...invForm.items];it[i].qty=e.target.value;setInvForm({...invForm,items:it});}} style={inp}/>
                      <input type="number" placeholder="السعر" value={item.price} onChange={e=>{const it=[...invForm.items];it[i].price=e.target.value;setInvForm({...invForm,items:it});}} style={inp}/>
                      <button onClick={()=>{const it=invForm.items.filter((_,j)=>j!==i);setInvForm({...invForm,items:it});}} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.red,cursor:"pointer",padding:"0 8px",fontSize:14}}>✕</button>
                    </div>
                  ))}
                  <button onClick={()=>setInvForm({...invForm,items:[...invForm.items,{desc:"",qty:1,price:""}]})} style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:8,color:C.muted,cursor:"pointer",padding:"6px 14px",fontSize:12,fontFamily:"inherit",marginBottom:10}}>+ إضافة بند</button>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={addInvoice} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"7px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>إنشاء الفاتورة</button>
                    <button onClick={()=>setShowInvForm(false)} style={{background:"none",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>إلغاء</button>
                  </div>
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {invoices.map(inv=>{
                  const client=clients.find(c=>c.id===+inv.clientId)||{name:"—"};
                  const total=invTotal(inv);
                  const sb=statusBadge[inv.status];
                  return (
                    <div key={inv.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1rem 1.2rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",gap:16,alignItems:"center"}}>
                        <div style={{width:40,height:40,borderRadius:10,background:C.accentDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧾</div>
                        <div>
                          <div style={{fontSize:13,fontWeight:700}}>{inv.number} — {client.name}</div>
                          <div style={{fontSize:11,color:C.muted,marginTop:2}}>التاريخ: {inv.date} | الاستحقاق: {inv.due||"—"}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:16}}>
                        <div style={{textAlign:"left"}}>
                          <div style={{fontSize:16,fontWeight:800,color:C.accent}}>{fmt(total)} ل.س</div>
                          <div style={{fontSize:10,color:C.muted}}>{inv.items.length} بند</div>
                        </div>
                        <span style={{background:sb.bg,color:sb.color,fontSize:11,padding:"3px 10px",borderRadius:20}}>{sb.label}</span>
                        <select value={inv.status} onChange={e=>{setInvoices(p=>p.map(x=>x.id===inv.id?{...x,status:e.target.value}:x));toast2("تم تحديث الحالة");}} style={{...inp,width:"auto",fontSize:11,padding:"4px 8px"}}>
                          <option value="paid">مدفوعة</option>
                          <option value="pending">معلقة</option>
                          <option value="overdue">متأخرة</option>
                        </select>
                        <button onClick={()=>printInvoice(inv)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:8,color:C.text,cursor:"pointer",padding:"5px 10px",fontSize:12,fontFamily:"inherit"}}>🖨 طباعة</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── CLIENTS ── */}
          {tab==="clients" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
                <div>
                  <h1 style={{margin:0,fontSize:20,fontWeight:800}}>إدارة العملاء</h1>
                  <p style={{margin:"4px 0 0",color:C.muted,fontSize:12}}>{clients.length} عملاء</p>
                </div>
                <button onClick={()=>setShowClientForm(!showClientForm)} style={{background:`linear-gradient(135deg,${C.accent},#7c3aed)`,color:"#fff",border:"none",borderRadius:10,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ عميل جديد</button>
              </div>
              {showClientForm && (
                <div style={{background:C.card,border:`1px solid ${C.accent}40`,borderRadius:12,padding:"1.2rem",marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>بيانات العميل الجديد</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
                    {[
                      {label:"الاسم",key:"name",ph:"اسم العميل أو الشركة"},
                      {label:"الهاتف",key:"phone",ph:"09XXXXXXXX"},
                      {label:"البريد",key:"email",ph:"email@example.com"},
                      {label:"المدينة",key:"city",ph:"دمشق"},
                      {label:"الرصيد المستحق (ل.س)",key:"balance",ph:"0"},
                    ].map((f,i)=>(
                      <div key={i}>
                        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{f.label}</div>
                        <input placeholder={f.ph} value={clientForm[f.key]} onChange={e=>setClientForm({...clientForm,[f.key]:e.target.value})} style={inp}/>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button onClick={addClient} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"7px 18px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>حفظ</button>
                    <button onClick={()=>setShowClientForm(false)} style={{background:"none",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 14px",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>إلغاء</button>
                  </div>
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                {clients.map(c=>(
                  <div key={c.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1rem"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                      <div style={{width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${C.accent},#7c3aed)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff"}}>{c.name[0]}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700}}>{c.name}</div>
                        <div style={{fontSize:11,color:C.muted}}>{c.city}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:12}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{color:C.muted}}>📞 {c.phone}</span>
                      </div>
                      <div style={{color:C.muted}}>✉ {c.email}</div>
                      <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:`1px solid ${C.border}`,marginTop:4}}>
                        <span style={{color:C.muted}}>الرصيد المستحق</span>
                        <span style={{fontWeight:700,color:c.balance>0?C.amber:C.green}}>{fmt(c.balance)} ل.س</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{color:C.muted}}>الفواتير</span>
                        <span style={{fontWeight:700,color:C.accent}}>{invoices.filter(i=>+i.clientId===c.id).length} فاتورة</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REPORTS ── */}
          {tab==="reports" && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.2rem"}}>
                <div>
                  <h1 style={{margin:0,fontSize:20,fontWeight:800}}>التقارير المالية</h1>
                  <p style={{margin:"4px 0 0",color:C.muted,fontSize:12}}>ملخص مالي شامل</p>
                </div>
                <button onClick={()=>window.print()} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 18px",fontSize:13,color:C.text,cursor:"pointer",fontFamily:"inherit"}}>🖨 طباعة التقرير</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.2rem"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>قائمة الدخل</div>
                  {[
                    {label:"إجمالي الإيرادات",val:income,color:C.green},
                    {label:"إجمالي المصروفات",val:expense,color:C.red,neg:true},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}20`}}>
                      <span style={{fontSize:13}}>{r.label}</span>
                      <span style={{fontSize:13,fontWeight:700,color:r.color}}>{r.neg?"-":""}{fmt(r.val)} ل.س</span>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:`1px solid ${C.border}`,marginTop:4}}>
                    <span style={{fontSize:14,fontWeight:700}}>صافي الربح</span>
                    <span style={{fontSize:14,fontWeight:800,color:net>=0?C.green:C.red}}>{fmt(net)} ل.س</span>
                  </div>
                  <div style={{marginTop:12,padding:10,background:C.surface,borderRadius:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}>
                      <span style={{color:C.muted}}>هامش الربح</span>
                      <span style={{fontWeight:700,color:parseFloat(profPct)>=0?C.green:C.red}}>{profPct}%</span>
                    </div>
                    <div style={{height:6,background:C.dim,borderRadius:3,marginTop:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${Math.min(100,Math.max(0,parseFloat(profPct)))}%`,background:C.green,borderRadius:3}}></div>
                    </div>
                  </div>
                </div>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"1.2rem"}}>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:14,paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>ملخص الأعمال</div>
                  {[
                    {label:"إجمالي قيمة الفواتير",val:fmt(invoices.reduce((s,i)=>s+invTotal(i),0)),unit:"ل.س",color:C.accent},
                    {label:"فواتير مدفوعة",val:invoices.filter(i=>i.status==="paid").length,unit:"فاتورة",color:C.green},
                    {label:"فواتير معلقة",val:invoices.filter(i=>i.status==="pending").length,unit:"فاتورة",color:C.amber},
                    {label:"إجمالي الذمم المدينة",val:fmt(clients.reduce((s,c)=>s+c.balance,0)),unit:"ل.س",color:C.red},
                    {label:"عدد العملاء",val:clients.length,unit:"عميل",color:C.purple},
                  ].map((r,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}20`}}>
                      <span style={{fontSize:12,color:C.muted}}>{r.label}</span>
                      <span style={{fontSize:13,fontWeight:700,color:r.color}}>{r.val} {r.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {toast&&<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.accent,color:"#fff",padding:"10px 24px",borderRadius:10,fontSize:13,fontWeight:700,zIndex:999,boxShadow:"0 4px 24px #0008"}}>{toast}</div>}
    </div>
  );
}
