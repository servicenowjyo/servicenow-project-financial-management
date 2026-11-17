/* Independent Project Financial Management policy. Identical source in Node and ServiceNow. */
var ProjectFinancePolicy = function () {};
ProjectFinancePolicy.prototype = {
    initialize: function () {},
    _integer: function (x, label, minimum) {
        if (typeof x !== 'number' || !isFinite(x) || Math.floor(x) !== x || x < minimum || x > 1000000000000) throw new Error('Invalid ' + label);
        return x;
    },
    _round: function (x) { return Math.round(x * 10000) / 10000; },
    finance: function (d) {
        var keys = ['budget_paise', 'actual_paise', 'etc_paise', 'remaining_commitments_paise', 'earned_value_paise', 'planned_value_paise'];
        for (var i = 0; i < keys.length; i++) this._integer(d[keys[i]], keys[i], 0);
        if (d.remaining_commitments_paise > d.etc_paise) throw new Error('ETC must include remaining commitments');
        if (d.earned_value_paise > d.budget_paise || d.planned_value_paise > d.budget_paise) throw new Error('Value exceeds baseline budget');
        var eac = d.actual_paise + d.etc_paise, actions = [];
        if (eac > d.budget_paise) actions.push('REVIEW_FORECAST_OVERRUN');
        if (d.actual_paise > d.budget_paise) actions.push('REVIEW_ACTUAL_OVERRUN');
        var cpi = d.actual_paise === 0 ? null : d.earned_value_paise / d.actual_paise;
        var spi = d.planned_value_paise === 0 ? null : d.earned_value_paise / d.planned_value_paise;
        if (cpi !== null && cpi < 0.9) actions.push('REVIEW_COST_EFFICIENCY');
        if (spi !== null && spi < 0.9) actions.push('REVIEW_SCHEDULE_EFFICIENCY');
        return {id:d.id, forecast_paise:eac, variance_at_completion_paise:d.budget_paise-eac,
            remaining_budget_paise:d.budget_paise-d.actual_paise, cpi:cpi === null ? null : this._round(cpi),
            spi:spi === null ? null : this._round(spi), actions:actions, status:actions.length ? 'REVIEW' : 'ON_TRACK'};
    },
    type:'ProjectFinancePolicy'
};
if(typeof module !== 'undefined' && module.exports) module.exports=ProjectFinancePolicy;
