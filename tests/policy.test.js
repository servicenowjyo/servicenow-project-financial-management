const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('../servicenow/ProjectFinancePolicy');
const p = new P();
const finance = () => ({id:'F',budget_paise:10000,actual_paise:4000,etc_paise:7000,remaining_commitments_paise:2000,earned_value_paise:3000,planned_value_paise:5000});
const gov = () => ({id:'G',as_of:'2026-11-17',evidence_date:'2026-11-01',decision_due:'2026-11-20',owner:'Synthetic sponsor',likelihood:3,impact:5,risk_response_agreed:true,sponsor_approval:'approved',business_case_complete:true});
const plan = () => ({id:'P',start_date:'2026-11-01',deadline:'2026-11-10',tasks:[
 {id:'A',duration_days:2,depends_on:[],resource:'r1',allocation_pct:100,done:true},
 {id:'B',duration_days:4,depends_on:['A'],resource:'r2',allocation_pct:100,done:false},
 {id:'C',duration_days:3,depends_on:['A'],resource:'r2',allocation_pct:100,done:false},
 {id:'D',duration_days:2,depends_on:['B'],resource:'r3',allocation_pct:100,done:false},
 {id:'E',duration_days:1,depends_on:['C'],resource:'r4',allocation_pct:100,done:false},
 {id:'F',duration_days:2,depends_on:['D','E'],resource:'r5',allocation_pct:100,done:false}]});
test('finance: bottom-up forecast and variance match hand calculation',()=>{const r=p.finance(finance());assert.equal(r.forecast_paise,11000);assert.equal(r.variance_at_completion_paise,-1000);assert.equal(r.remaining_budget_paise,6000)});
test('finance: remaining commitments are included once, not twice',()=>assert.equal(p.finance(finance()).forecast_paise,11000));
test('finance: EVM indices and three independent flags',()=>{const r=p.finance(finance());assert.equal(r.cpi,.75);assert.equal(r.spi,.6);assert.equal(r.actions.length,3)});
test('finance: exactly budget is not overrun',()=>{const d=finance();d.etc_paise=6000;assert(!p.finance(d).actions.includes('REVIEW_FORECAST_OVERRUN'))});
test('finance: zero denominators produce null indices',()=>{const d=finance();d.actual_paise=0;d.planned_value_paise=0;const r=p.finance(d);assert.equal(r.cpi,null);assert.equal(r.spi,null)});
test('finance: exactly 0.9 index does not flag',()=>{const d=finance();d.earned_value_paise=4500;d.actual_paise=5000;assert(!p.finance(d).actions.includes('REVIEW_COST_EFFICIENCY'))});
test('finance: actual overrun is distinct',()=>{const d=finance();d.actual_paise=11000;assert(p.finance(d).actions.includes('REVIEW_ACTUAL_OVERRUN'))});
for(const value of [-1,0.5,NaN,Infinity,'100',undefined,1e13]) test('finance: rejects invalid money '+String(value),()=>{const d=finance();d.budget_paise=value;assert.throws(()=>p.finance(d))});
test('finance: rejects commitments above ETC',()=>{const d=finance();d.remaining_commitments_paise=8000;assert.throws(()=>p.finance(d))});
test('finance: rejects earned value above baseline',()=>{const d=finance();d.earned_value_paise=11000;assert.throws(()=>p.finance(d))});
test('deterministic policy leaves source unchanged',()=>{const d=finance();const before=JSON.stringify(d);assert.deepEqual(p.finance(d),p.finance(d));assert.equal(JSON.stringify(d),before)});
